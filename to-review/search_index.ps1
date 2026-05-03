$file = Get-Content "C:\Users\Mark Lorenz\Desktop\LibraryWebsite\index.html"
$patterns = @(
    "LATEST NEWS",
    "FEATURE ARTICLE",
    "AROUND THE WORLD",
    "MARKET QUOTE",
    "RECOMMENDED BOOK",
    "WARREN BUFFETT",
    "See more",
    "see more",
    "Classical",
    "Commodit",
    "see-more",
    "Warren Buffett on",
    "OUR RECOMMENDED",
    "WARREN BUFFETT BOOKS",
    "section-header",
    "Philosophy",
    "Investing",
    "Governance",
    "Accounting",
    "Economics",
    "Miscellaneous",
    "book-tab",
    "buffett-tab",
    "sort"
)

foreach ($pattern in $patterns) {
    $matches = $file | Select-String -Pattern $pattern -SimpleMatch
    if ($matches.Count -gt 0) {
        Write-Host "=== FOUND '$pattern' ($($matches.Count) matches) ==="
        $matches | Select-Object -First 5 | ForEach-Object {
            $line = $_.Line
            if ($line.Length -gt 200) { $line = $line.Substring(0, 200) + "..." }
            Write-Host "  Line $($_.LineNumber): $line"
        }
        Write-Host ""
    } else {
        Write-Host "=== NOT FOUND: '$pattern' ==="
        Write-Host ""
    }
}
