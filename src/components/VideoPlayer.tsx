import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { requestVideoSession, videoHeartbeat, videoStop } from "../api/client";
import { formatDuration } from "../utils/format";
import styles from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  fileId: number;
  filename: string;
  durationSecs: number | null;
  onClose: () => void;
}

// Each seek generates a fresh StreamKey so the server gets a new registration
// and the heartbeat loop restarts cleanly around the new ffmpeg process.
interface StreamKey {
  offset: number;
  id: string;
}

export default function VideoPlayer({
  fileId,
  filename,
  durationSecs,
  onClose,
}: VideoPlayerProps): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);

  // Atomic seek-offset + stream-id so both update in one setState call
  const [streamKey, setStreamKey] = useState<StreamKey>(() => ({
    offset: 0,
    id: crypto.randomUUID(),
  }));
  // Elapsed time reported by the <video> element (since current seek offset)
  const [videoTime, setVideoTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  // While dragging, show the preview time; null means not dragging
  const [dragTime, setDragTime] = useState<number | null>(null);

  // Tracks a deferred videoStop call so it can be cancelled on Strict Mode / HMR
  // remounts where the same streamId is re-registered immediately after cleanup.
  const pendingStopRef = useRef<{ id: string; timer: ReturnType<typeof setTimeout> } | null>(null);

  const duration = durationSecs ?? 0;
  const currentTime = streamKey.offset + videoTime;

  // Resolved stream URL for the current streamKey; null while the session is
  // being requested or if it failed (split mode + home gateway down).
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);

  // Fetch a session URL whenever the streamKey changes (initial mount or seek).
  useEffect(() => {
    let cancelled = false;
    setStreamUrl(null);
    setStreamError(null);
    requestVideoSession(fileId, streamKey.offset, streamKey.id)
      .then((session) => {
        if (cancelled) return;
        setStreamUrl(session.streamUrl);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : String(err);
        setStreamError(
          msg.includes("503")
            ? "Video streaming is temporarily unavailable. The home gateway is offline."
            : "Could not start playback."
        );
      });
    return () => {
      cancelled = true;
    };
  }, [fileId, streamKey]);

  // Update videoTime from the <video> element's timeupdate event
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onTimeUpdate = () => setVideoTime(vid.currentTime);
    vid.addEventListener("timeupdate", onTimeUpdate);
    return () => vid.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  // When the stream key changes (seek or initial mount), reset videoTime and reload.
  // Cleanup sends an explicit stop so the previous ffmpeg is killed immediately
  // rather than waiting for the heartbeat timeout.
  useEffect(() => {
    setVideoTime(0);
    const vid = videoRef.current;
    if (vid) {
      vid.load();
      if (isPlaying) vid.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamKey]);

  // Heartbeat — keeps the server-side watchdog alive while the player is open.
  // In split mode this hits the home gateway directly; in monolithic mode it
  // hits same-origin Express. Both are derived from streamUrl.
  useEffect(() => {
    const { id } = streamKey;
    if (!streamUrl) return; // wait until session resolves

    if (pendingStopRef.current?.id === id) {
      clearTimeout(pendingStopRef.current.timer);
      pendingStopRef.current = null;
    }

    videoHeartbeat(streamUrl, id).catch(() => {});
    const interval = setInterval(() => videoHeartbeat(streamUrl, id).catch(() => {}), 5_000);
    return () => {
      clearInterval(interval);
      const timer = setTimeout(() => {
        if (pendingStopRef.current?.id === id) pendingStopRef.current = null;
        videoStop(streamUrl, id).catch(() => {});
      }, 0);
      pendingStopRef.current = { id, timer };
    };
  }, [streamKey, streamUrl]);

  // --- Scrubber interaction ---
  const getScrubTime = useCallback(
    (clientX: number): number => {
      const bar = scrubberRef.current;
      if (!bar || duration <= 0) return 0;
      const rect = bar.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return fraction * duration;
    },
    [duration]
  );

  // Commit a seek: generate a new stream key so both offset and streamId update
  // atomically, giving the new ffmpeg process a fresh registration on the server.
  const commitSeek = useCallback(
    (time: number) => {
      setDragTime(null);
      const clamped = Math.max(0, Math.min(duration, time));
      setStreamKey({ offset: clamped, id: crypto.randomUUID() });
    },
    [duration]
  );

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() => {});
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }, []);

  // Skip forward/backward by a given number of seconds
  const skip = useCallback(
    (delta: number) => {
      const newTime = Math.max(0, Math.min(duration, currentTime + delta));
      commitSeek(newTime);
    },
    [currentTime, duration, commitSeek]
  );

  // Keyboard shortcuts — Space: play/pause, ←/→: ±5s, Shift+←/→: ±10s
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      )
        return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skip(e.shiftKey ? -10 : -5);
          break;
        case "ArrowRight":
          e.preventDefault();
          skip(e.shiftKey ? 10 : 5);
          break;
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, skip]);

  const onScrubPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const bar = scrubberRef.current;
      if (!bar) return;
      bar.setPointerCapture(e.pointerId);
      const t = getScrubTime(e.clientX);
      setDragTime(t);

      const onMove = (ev: PointerEvent) => {
        setDragTime(getScrubTime(ev.clientX));
      };
      const onUp = (ev: PointerEvent) => {
        bar.removeEventListener("pointermove", onMove);
        bar.removeEventListener("pointerup", onUp);
        bar.releasePointerCapture(ev.pointerId);
        commitSeek(getScrubTime(ev.clientX));
      };
      bar.addEventListener("pointermove", onMove);
      bar.addEventListener("pointerup", onUp);
    },
    [getScrubTime, commitSeek]
  );

  // Progress fraction for the filled bar
  const displayTime = dragTime !== null ? dragTime : currentTime;
  const progressFraction = duration > 0 ? Math.min(1, displayTime / duration) : 0;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span>{filename}</span>
          <button onClick={onClose}>✕ Close</button>
        </div>

        <div className={styles.videoWrapper}>
          {streamError && (
            <div className="muted" style={{ padding: "2rem", textAlign: "center" }}>
              {streamError}
            </div>
          )}
          {!streamError && streamUrl && (
            <video
              ref={videoRef}
              autoPlay
              className={styles.videoElement}
              src={streamUrl}
              onClick={togglePlay}
            >
              <track kind="captions" />
            </video>
          )}
        </div>

        {/* Custom controls bar */}
        <div className={styles.controls}>
          <button className={styles.playBtn} onClick={togglePlay}>
            {isPlaying ? "❚❚" : "▶"}
          </button>

          {/* Scrubber track */}
          <div className={styles.scrubber} ref={scrubberRef} onPointerDown={onScrubPointerDown}>
            <div className={styles.scrubberFill} style={{ width: `${progressFraction * 100}%` }} />
            <div className={styles.scrubberThumb} style={{ left: `${progressFraction * 100}%` }} />
            {/* Tooltip showing time while dragging */}
            {dragTime !== null && (
              <div
                className={styles.scrubberTooltip}
                style={{ left: `${progressFraction * 100}%` }}
              >
                {formatDuration(dragTime)}
              </div>
            )}
          </div>

          <span className={styles.time}>
            {formatDuration(displayTime)} / {formatDuration(duration || null)}
          </span>

          <span className={styles.keyHints} title="Keyboard shortcuts">
            <kbd>Space</kbd> play/pause &nbsp; <kbd>←</kbd>/<kbd>→</kbd> ±5s &nbsp; <kbd>Shift</kbd>
            +<kbd>←</kbd>/<kbd>→</kbd> ±10s
          </span>
        </div>

        <div className={styles.info}>
          Seeking re-encodes from the new position (may take a moment to buffer). The timecode
          always reflects the absolute position in the source file.
        </div>
      </div>
    </div>
  );
}
