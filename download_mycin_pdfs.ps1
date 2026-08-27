# Download all MYCIN book PDFs from shortliffe.net

$baseUrl = "https://www.shortliffe.net/Buchanan-Shortliffe-1984"
$outDir  = Join-Path $PSScriptRoot "mycin_pdfs"

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

# Ordered list of PDFs (the merge script relies on this order)
$files = @(
    "Contents.pdf"
    "Contributors.pdf"
    "Newell-foreword.pdf"
    "Preface.pdf"
    "Chapter-01.pdf"
    "Chapter-02.pdf"
    "Chapter-03.pdf"
    "Chapter-04.pdf"
    "Chapter-05.pdf"
    "Chapter-06.pdf"
    "Chapter-07.pdf"
    "Chapter-08.pdf"
    "Chapter-09.pdf"
    "Chapter-10.pdf"
    "Chapter-11.pdf"
    "Chapter-12.pdf"
    "Chapter-13.pdf"
    "Chapter-14.pdf"
    "Chapter-15.pdf"
    "Chapter-16.pdf"
    "Chapter-17.pdf"
    "Chapter-18.pdf"
    "Chapter-19.pdf"
    "Chapter-20.pdf"
    "Chapter-21.pdf"
    "Chapter-22.pdf"
    "Chapter-23.pdf"
    "Chapter-24.pdf"
    "Chapter-25.pdf"
    "Chapter-26.pdf"
    "Chapter-27.pdf"
    "Chapter-28.pdf"
    "Chapter-29.pdf"
    "Chapter-30.pdf"
    "Chapter-31.pdf"
    "Chapter-32.pdf"
    "Chapter-33.pdf"
    "Chapter-34.pdf"
    "Chapter-35.pdf"
    "Chapter-36.pdf"
    "Epilog.pdf"
    "Appendix.pdf"
    "References.pdf"
    "Name Index.pdf"
    "Subject Index.pdf"
)

$total = $files.Count
$i = 0

foreach ($file in $files) {
    $i++
    $url      = "$baseUrl/$([uri]::EscapeDataString($file))"
    $destPath = Join-Path $outDir $file

    if (Test-Path $destPath) {
        Write-Host "[$i/$total] Already exists: $file"
        continue
    }

    Write-Host "[$i/$total] Downloading: $file"
    try {
        Invoke-WebRequest -Uri $url -OutFile $destPath -ErrorAction Stop
    }
    catch {
        Write-Warning "  Failed to download $file : $_"
    }
}

Write-Host "`nDone. $total files targeted -> $outDir"
