# User Feedback — Open Items

Items from the initial review that need clarification or are larger feature requests.

## 1. Long videos are hard to stream / delay when clicking around

> "long videos are hard to stream. there is a delay when clicking around."

This is inherent to how streaming works — each seek spawns a new server-side ffmpeg transcode, so there's always a short buffering delay. Possible mitigations:

- **Pre-transcode popular files** to HLS segments so seeking is instant (significant storage/compute cost).
- **Lower the transcode bitrate/resolution** to reduce buffering time (trades quality).
- **Cache recently-transcoded segments** on disk so re-seeking to the same spot is instant.

**Question:** Is the delay long enough to be a blocker, or is a better explanation in the UI sufficient? Are there specific files where it's particularly bad (e.g., ProRes originals vs. H.264)?

## 2. Search files then search further through transcript

> "It would be really nice to be able to search for files and then search further through transcript."

Transcript text (from scanned shotlist PDFs) is already included in the general search index — a query like `"lunar module"` will match reels whose shotlist text contains that phrase. However, the user may want a **two-step workflow**:

1. Search for reels by title/mission/description.
2. Within the results (or on a reel detail page), search _within_ that reel's shotlist transcript.

**Question:** Is the request for a separate "search within this reel's transcript" field on the detail page? Or is it about being able to filter search results by transcript content after an initial search? Or something else entirely?

## 3. Bookmark videos and times

> "it might be nice to be able to 'bookmark' videos and times while clicking through them instead of keeping a separate notepad. I can end up with a list of clips/audio I need."

This is a significant feature. Design questions:

- **Persistence:** Should bookmarks be saved per-user on the server (requires user accounts) or stored locally in the browser (simpler, but lost if you switch devices/clear data)?
- **What gets bookmarked:** A reel + timestamp? A reel + timestamp + user note? Should there be a way to export the bookmark list (e.g., as CSV or text)?
- **Sharing:** Should bookmarked lists be shareable with other users (e.g., via a link)?
- **UI:** A floating "bookmark" button in the video player that stamps the current timecode into a sidebar list?
