$word = New-Object -ComObject Word.Application
$word.Visible = $false

$files = @(
    "C:\Users\Mark Lorenz\Desktop\LibraryWebsite\to-review\2026-04-07  G&D mobile - additional comments (1).docx",
    "C:\Users\Mark Lorenz\Desktop\LibraryWebsite\to-review\2026-02-08  G&D mobile - comments (1).docx",
    "C:\Users\Mark Lorenz\Desktop\LibraryWebsite\to-review\2026-03-18  G&D mobile (secondary pages) - comments.docx"
)

$outNames = @("april7_comments.txt", "feb8_comments.txt", "march18_comments.txt")

for ($i = 0; $i -lt $files.Count; $i++) {
    Write-Host "Processing: $($files[$i])"
    $doc = $word.Documents.Open($files[$i])
    
    # Extract all text including comments/annotations
    $allText = ""
    
    # Get main body text
    $allText += "=== MAIN BODY TEXT ===" + "`r`n"
    $allText += $doc.Content.Text + "`r`n`r`n"
    
    # Get comments/annotations
    $allText += "=== COMMENTS/ANNOTATIONS ===" + "`r`n"
    foreach ($comment in $doc.Comments) {
        $allText += "--- Comment by: " + $comment.Author + " ---" + "`r`n"
        $allText += "Scope/Context: " + $comment.Scope.Text + "`r`n"
        $allText += "Comment: " + $comment.Range.Text + "`r`n`r`n"
    }
    
    # Get text boxes and shapes
    $allText += "=== TEXT BOXES/SHAPES ===" + "`r`n"
    foreach ($shape in $doc.Shapes) {
        if ($shape.TextFrame.HasText) {
            $allText += $shape.TextFrame.TextRange.Text + "`r`n"
        }
    }
    
    $outPath = "C:\Users\Mark Lorenz\Desktop\LibraryWebsite\to-review\" + $outNames[$i]
    $allText | Out-File -FilePath $outPath -Encoding UTF8
    Write-Host "Saved to: $outPath"
    $doc.Close()
}

$word.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
Write-Host "Done extracting all docx files."
