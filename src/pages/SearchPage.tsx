import { useState, useEffect, useCallback, useRef, type JSX } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import ReelTable from "../components/ReelTable";
import ReelDetailModal from "../components/ReelDetailModal";
import { searchReels } from "../api/client";
import { QUALITY_BUCKETS } from "../utils/qualityBuckets";
import type { FilmReel } from "../types";

const PAGE_SIZE = 50;

export default function SearchPage(): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const hasTransfer = searchParams.get("has_transfer") === "1";
  const qualityBucket = searchParams.get("quality_bucket") || "";

  const [rows, setRows] = useState<FilmReel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReel, setSelectedReel] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(true);
  const effectiveHasTransfer = !revealed ? true : hasTransfer;

  // Track the next page to fetch (1-based). Reset when filters change.
  const nextPageRef = useRef(1);
  const hasMore = rows.length < total;

  // Reset and fetch first page whenever filters change
  useEffect(() => {
    nextPageRef.current = 1;
    setRows([]);
    setTotal(0);

    let cancelled = false;

    async function fetchFirst() {
      setLoading(true);
      setError(null);
      try {
        const result = await searchReels({
          q: q || undefined,
          page: 1,
          limit: PAGE_SIZE,
          has_transfer: effectiveHasTransfer || undefined,
          quality_bucket: qualityBucket || undefined,
        });
        if (!cancelled) {
          setRows(result.rows);
          setTotal(result.total);
          setRevealed(result.revealed ?? true);
          nextPageRef.current = 2;
        }
      } catch (err) {
        if (!cancelled) setError(String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFirst();
    return () => {
      cancelled = true;
    };
  }, [q, effectiveHasTransfer, qualityBucket]);

  // Load next page (called by IntersectionObserver sentinel)
  const loadMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const page = nextPageRef.current;
      const result = await searchReels({
        q: q || undefined,
        page,
        limit: PAGE_SIZE,
        has_transfer: effectiveHasTransfer || undefined,
        quality_bucket: qualityBucket || undefined,
      });
      setRows((prev) => [...prev, ...result.rows]);
      setTotal(result.total);
      nextPageRef.current = page + 1;
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [q, effectiveHasTransfer, qualityBucket, loading]);

  // Sentinel ref — triggers loadMore when scrolled into view
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  function handleSearch(newQ: string, newHasTransfer: boolean) {
    const params: Record<string, string> = {};
    if (newQ) params.q = newQ;
    if (newHasTransfer) params.has_transfer = "1";
    if (qualityBucket) params.quality_bucket = qualityBucket;
    setSearchParams(params);
  }

  function handleQualityFilter(bucket: string) {
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (hasTransfer) params.has_transfer = "1";
    if (bucket) params.quality_bucket = bucket;
    setSearchParams(params);
  }

  return (
    <div className="search-page">
      <SearchBar
        initialQuery={q}
        initialHasTransfer={effectiveHasTransfer}
        onSearch={handleSearch}
        revealed={revealed}
      />

      <div className="quality-filter-bar">
        <span className="quality-filter-label">Quality:</span>
        <button
          type="button"
          className={`quality-filter-btn${!qualityBucket ? " active" : ""}`}
          onClick={() => handleQualityFilter("")}
        >
          All
        </button>
        {QUALITY_BUCKETS.map((b) => (
          <button
            key={b.key}
            type="button"
            className={[
              "quality-filter-btn",
              `quality-bucket-${b.key}`,
              qualityBucket === b.key ? "active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => handleQualityFilter(qualityBucket === b.key ? "" : b.key)}
          >
            {b.label}
          </button>
        ))}
      </div>

      {error && <div className="error-msg">Error: {error}</div>}

      <ReelTable rows={rows} total={total} onSelectReel={setSelectedReel} revealed={revealed} />

      {loading && <div className="loading">Loading…</div>}

      {hasMore && !loading && <div ref={sentinelRef} className="scroll-sentinel" />}

      {selectedReel && (
        <ReelDetailModal identifier={selectedReel} onClose={() => setSelectedReel(null)} />
      )}
    </div>
  );
}
