"""Compress the merged MYCIN PDF by downscaling 1-bit scanned images.

The originals are 1-bit bitmaps at high DPI. Downscaling by 50% while keeping
them as 1-bit dramatically reduces pixel count (and thus file size) with
minimal readability loss for text.

Requirements:
    pip install pypdf Pillow
"""

from pathlib import Path
from PIL import Image
from pypdf import PdfReader, PdfWriter

SCRIPT_DIR = Path(__file__).resolve().parent
INPUT  = SCRIPT_DIR / "MYCIN_Rule_Based_Expert_Systems_Complete.pdf"
OUTPUT = SCRIPT_DIR / "MYCIN_Rule_Based_Expert_Systems_Complete_compressed.pdf"

SCALE = 0.5  # 50% resolution → ~25% pixel count


def main() -> None:
    if not INPUT.exists():
        raise SystemExit(f"Input not found: {INPUT}")

    reader = PdfReader(INPUT)
    writer = PdfWriter()

    print(f"Input : {INPUT.name}  ({INPUT.stat().st_size // (1024*1024)} MB)")
    print(f"Pages : {len(reader.pages)}")

    for page in reader.pages:
        writer.add_page(page)

    writer.compress_identical_objects(remove_duplicates=True, remove_unreferenced=True)

    replaced = 0
    skipped = 0
    total_pages = len(writer.pages)
    print(f"Downscaling images by {SCALE}x...")

    for i, page in enumerate(writer.pages):
        for img in page.images:
            try:
                pil_img = img.image
                orig_w, orig_h = pil_img.size
                new_w = max(1, int(orig_w * SCALE))
                new_h = max(1, int(orig_h * SCALE))

                # Downscale, keeping original mode (1-bit stays 1-bit)
                resized = pil_img.resize((new_w, new_h), Image.LANCZOS)

                # If original was 1-bit, convert back (LANCZOS outputs grayscale)
                if pil_img.mode == "1":
                    resized = resized.convert("1")

                img.replace(resized)
                replaced += 1
            except Exception as e:
                skipped += 1
                if skipped <= 5:
                    print(f"  Skip page {i}: {e}")

        if (i + 1) % 100 == 0:
            print(f"  Processed {i + 1}/{total_pages} pages...")

    print(f"  Replaced: {replaced}, Skipped: {skipped}")
    print("Writing output...")

    writer.write(str(OUTPUT))
    writer.close()

    in_mb  = INPUT.stat().st_size / (1024 * 1024)
    out_mb = OUTPUT.stat().st_size / (1024 * 1024)
    pct    = (1 - out_mb / in_mb) * 100

    print(f"\nOutput: {OUTPUT.name}  ({out_mb:.1f} MB)")
    print(f"Saved : {in_mb - out_mb:.1f} MB  ({pct:.0f}% reduction)")


if __name__ == "__main__":
    main()
