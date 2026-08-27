# Technical Specification: Multi-Part Document Acquisition, Collation & Optimization Pipeline

## Problem Statement

Users researching foundational computer science and artificial intelligence literature often encounter seminal texts distributed as fragmented, chapter-by-chapter PDF files across legacy web servers. In the case of *Rule-Based Expert Systems: The MYCIN Experiments of the Stanford Heuristic Programming Project* (Buchanan & Shortliffe, 1984), the book is split into 45 individual PDFs covering front matter, 36 chapters, epilog, appendix, references, and indices.

Manually locating, downloading, renaming, ordering, merging, and optimizing dozens of separate PDF files is tedious, error-prone, and often results in bloated, unindexed single files that are difficult to search, read, or distribute. Furthermore, legacy scanned volumes composed of 1-bit monochrome bitmaps require specialized compression strategies to prevent file-size explosion while maintaining text legibility.

## Solution

A robust, idempotent three-stage pipeline that:
1. **Automates Acquisition**: Ingests structured manifests of remote document URLs, handling URL encoding, network retry semantics, progress tracking, and idempotency (skipping already downloaded assets).
2. **Sequentially Collates & Merges**: Assembles individual document parts into a single monolithic volume strictly adhering to the original publication structure and pagination hierarchy.
3. **Optimizes & Compresses**: Analyzes PDF streams and underlying embedded page images, deduplicating unreferenced objects, downscaling high-density 1-bit scanned monochrome bitmaps with Lanczos anti-aliasing preservation, and achieving substantial file-size reduction (~38%+) without compromising typographic clarity.

## User Stories

1. As a researcher, I want to provide a manifest of fragmented chapter URLs so that all components of an out-of-print reference volume are downloaded automatically without manual interaction.
2. As a researcher, I want the downloader to be idempotent so that interrupted downloads can resume without re-fetching previously downloaded chapters.
3. As a researcher, I want real-time progress indicators during download so that I can monitor network throughput and chapter-by-chapter completion status.
4. As a researcher, I want the system to handle URL-encoded filenames with spaces and special characters so that index and appendix files do not fail during fetch.
5. As an archivist, I want individual chapter files preserved in a structured local directory so that discrete chapter references remain accessible alongside the merged volume.
6. As a reader, I want the individual chapter PDFs merged into a single volume in exact book order (Front Matter → Chapters 1–36 → Epilog → Appendix → References → Indices) so that pagination flows naturally.
7. As a reader, I want structural integrity checks during merge so that any missing chapters or malformed PDF headers are immediately flagged before writing output.
8. As a mobile or tablet reader, I want the final merged document size reduced significantly from its raw scan size so that it loads quickly and conserves device storage.
9. As an archivist, I want the optimization process to preserve the 1-bit monochrome nature of scanned line art and text rather than converting them to heavy 8-bit RGB/grayscale JPEGs, avoiding file-size inflation.
10. As a reader, I want high-quality spatial downsampling (Lanczos filtering) on monochrome scans so that small serif text and mathematical notation remain crisp and legible after compression.
11. As a system operator, I want redundant PDF object definitions and unreferenced streams removed during optimization so that unnecessary metadata overhead is eliminated.
12. As a developer, I want separate executable stages for download, merge, and compression so that I can re-run individual operations independently without re-downloading sources.

## Implementation Decisions

### Acquisition Layer (Downloader)
- **Manifest Architecture**: Defined as an ordered list of resource basenames combined with a base URI prefix to decouple location from file ordering.
- **Resilience & Idempotency**: Prior to executing a network fetch, destination file existence and non-zero byte size are verified. Existing targets are skipped.
- **Encoding Safety**: URL components containing whitespace (e.g., `Name Index.pdf`, `Subject Index.pdf`) are explicitly escaped using standard URL encoding routines before initiating HTTP GET requests.

### Collation Layer (Merger)
- **Strict Structural Sequencing**: Document assembly follows an explicit sequential sequence rather than arbitrary alphanumeric filesystem sorting (which would place `Chapter-10.pdf` ahead of `Chapter-02.pdf` if non-zero-padded, or misplace indices).
- **Stream Appending**: Pages and resource dictionaries from source documents are sequentially concatenated into an output write buffer, preserving existing internal vector shapes and text layers.
- **Fail-Soft Diagnostics**: Missing chapters trigger explicit warnings with itemized lists of missing components while permitting partial compilation for diagnostic inspection.

### Optimization & Compression Layer
- **Object Deduplication**: Identical internal PDF objects (fonts, shared XObjects, color spaces) and orphaned object identifiers are stripped from the cross-reference table.
- **1-Bit Monochrome Preservation**: Scanned document pages composed of 1-bit bitmap images (`mode=1`) are preserved in monochrome mode rather than converted to multi-channel color or grayscale spaces.
- **Geometric Downsampling**: Page images exceeding target screen reading resolutions are scaled down by a proportional factor (e.g., 0.5x scale) using high-order interpolation (Lanczos) before re-quantizing to 1-bit bitmap streams, yielding a ~75% pixel count reduction.
- **Deterministic Compression Ratio**: Stream flate compression is reapplied across all newly encoded image streams.

## Testing Decisions

### Seams & Boundaries
- **Testing Seam 1: Manifest Acquisition Boundary**: Test external network retrieval behavior by verifying local file existence and byte completeness against a mocked or sandbox HTTP fixture.
- **Testing Seam 2: Merged Volume Structure Boundary**: Test PDF page count and section boundaries by asserting that `page_count(merged_pdf) == sum(page_count(chapter_i))` and verifying page dimensions match source specifications.
- **Testing Seam 3: Compression Efficiency & Fidelity Boundary**: Test compression output by asserting `file_size(compressed_pdf) < file_size(raw_merged_pdf)` while verifying that rendered image dimensions and color bit-depth meet minimum legibility thresholds.

### Prior Art
- Standard CLI file processing harnesses and stream comparison tests.
- PDF regression tests verifying page tree validity and cross-reference table parsing.

## Out of Scope

- Optical Character Recognition (OCR) and text layer generation / synthetic font embedding over scanned bitmaps.
- PDF bookmark and Table of Contents (TOC) hyperlink metadata tree synthesis.
- Automatic header/footer cropping or margin de-skewing.
- GUI / browser-based interactive reader interface.

## Further Notes

- The resulting compressed file for *Rule-Based Expert Systems* achieves a final footprint of 21.8 MB (down from ~37 MB raw aggregate) across 752 total pages, averaging ~29 KB per scanned page.
- This pipeline serves as the primary data ingestion prerequisite for knowledge extraction and skill distillation workflows targeting expert systems and historical AI literature.
