"""Merge all downloaded MYCIN PDFs into a single file in book order.

Requirements:
    pip install pypdf
"""

from pathlib import Path
from pypdf import PdfWriter

SCRIPT_DIR = Path(__file__).resolve().parent
PDF_DIR = SCRIPT_DIR / "mycin_pdfs"
OUTPUT  = SCRIPT_DIR / "MYCIN_Rule_Based_Expert_Systems_Complete.pdf"

# Book order — must match the download script
FILES = [
    "Contents.pdf",
    "Contributors.pdf",
    "Newell-foreword.pdf",
    "Preface.pdf",
    *[f"Chapter-{n:02d}.pdf" for n in range(1, 37)],
    "Epilog.pdf",
    "Appendix.pdf",
    "References.pdf",
    "Name Index.pdf",
    "Subject Index.pdf",
]


def main() -> None:
    if not PDF_DIR.is_dir():
        raise SystemExit(f"PDF directory not found: {PDF_DIR}\nRun download_mycin_pdfs.ps1 first.")

    writer = PdfWriter()
    missing: list[str] = []

    for name in FILES:
        path = PDF_DIR / name
        if not path.exists():
            missing.append(name)
            print(f"  MISSING: {name}")
            continue
        print(f"  Adding : {name} ({path.stat().st_size // 1024} KB)")
        writer.append(str(path))

    if missing:
        print(f"\nWarning: {len(missing)} file(s) missing — merged PDF will be incomplete.")

    writer.write(str(OUTPUT))
    writer.close()
    print(f"\nMerged PDF saved to: {OUTPUT}  ({OUTPUT.stat().st_size // (1024*1024)} MB)")


if __name__ == "__main__":
    main()
