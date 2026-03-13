import { useState, useEffect, useCallback, useMemo, useRef, type JSX } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { shotlistPdfUrl } from "../api/client";

// Configure pdfjs worker — Vite resolves this URL at build time.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/** Read the reveal key from session storage (returns empty string when absent). */
function getRevealKey(): string {
  try {
    return sessionStorage.getItem("revealKey") ?? "";
  } catch {
    return "";
  }
}

interface ShotlistPdfViewerProps {
  identifier: string;
  pdfs: string[];
  onClose: () => void;
}

/**
 * Modal overlay that renders shotlist PDFs via react-pdf (canvas-based).
 * No browser PDF viewer chrome means no built-in download button.
 * Tab labels are hidden from unauthenticated users (no revealKey).
 */
export default function ShotlistPdfViewer({
  identifier,
  pdfs,
  onClose,
}: ShotlistPdfViewerProps): JSX.Element {
  const [activePdf, setActivePdf] = useState<string>(pdfs[0] ?? "");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState<number>(800);

  const revealKey = getRevealKey();
  const isAuthed = revealKey !== "";

  // Measure the body container on mount so the Page fills the available width.
  useEffect(() => {
    if (bodyRef.current) {
      setPageWidth(Math.max(200, bodyRef.current.clientWidth - 32));
    }
  }, []);

  // Close on Escape key
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  const tabLabel = (filename: string, index: number): string =>
    isAuthed ? filename.replace(".pdf", "") : `Document ${index + 1}`;

  const pdfFile = useMemo(
    () =>
      activePdf
        ? {
            url: shotlistPdfUrl(activePdf),
            httpHeaders: isAuthed ? { "X-Reveal-Key": revealKey } : {},
          }
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activePdf, isAuthed]
  );

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="pdf-viewer-overlay" onClick={onClose}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="pdf-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-viewer-header">
          <span className="pdf-viewer-title">Shot List — {identifier}</span>
          <button className="pdf-viewer-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Tab bar — labels are generic for unauthenticated users */}
        {pdfs.length > 1 && (
          <div className="pdf-viewer-tabs">
            {pdfs.map((filename, i) => (
              <button
                key={filename}
                className={`pdf-viewer-tab${activePdf === filename ? " pdf-viewer-tab-active" : ""}`}
                onClick={() => {
                  setActivePdf(filename);
                  setPageNumber(1);
                }}
              >
                {tabLabel(filename, i)}
              </button>
            ))}
          </div>
        )}

        <div className="pdf-viewer-body" ref={bodyRef}>
          {pdfs.length === 0 && (
            <div className="muted" style={{ padding: "2rem", textAlign: "center" }}>
              No shotlist PDFs found for {identifier}.
            </div>
          )}
          {pdfFile && (
            <Document
              file={pdfFile}
              className="pdf-viewer-document"
              onLoadSuccess={({ numPages: n }) => {
                setNumPages(n);
                setPageNumber(1);
              }}
            >
              <Page
                pageNumber={pageNumber}
                width={pageWidth}
                renderAnnotationLayer
                renderTextLayer
              />
            </Document>
          )}
        </div>

        {numPages > 1 && (
          <div className="pdf-viewer-tabs pdf-viewer-page-tabs">
            <span className="pdf-viewer-page-label">Page</span>
            {Array.from({ length: numPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`pdf-viewer-tab${pageNumber === n ? " pdf-viewer-tab-active" : ""}`}
                onClick={() => setPageNumber(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
