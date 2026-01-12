$urls = @(
"https://www.grahamanddoddsville.net/Articles/ShouldRichButLosingCorporationsBeLiquidated.html",
"https://www.grahamanddoddsville.net/Articles/ShouldRichCorporationsReturnStockholdersCash.html",
"https://www.grahamanddoddsville.net/Articles/SellingAmericaFor50CentsOnTheDollar.html",
"https://www.grahamanddoddsville.net/Articles/StockMarketWarningDangerAhead.html",
"https://www.grahamanddoddsville.net/Articles/TheFutureOfCommonStocks.html",
"https://www.grahamanddoddsville.net/Articles/TheNewSpeculationInCommonStocks.html"
)

$titles = @(
"Should Rich But Losing Corporations be Liquidated? (1932)",
"Should Rich Corporations Return Stockholders' Cash?",
"Selling America for 50 Cents on the Dollar (1932)",
"Stock Market Warning: Danger Ahead (1960)",
"The Future of Common Stocks (1974)",
"The New Speculation in Common Stocks (1958)"
)

for ($i = 0; $i -lt $urls.Length; $i++) {
    Write-Host "=== $($titles[$i]) ==="
    try {
        $content = Invoke-WebRequest -Uri $urls[$i] -UseBasicParsing | Select-Object -ExpandProperty Content
        Write-Host $content
    } catch {
        Write-Host "Error fetching $($urls[$i])"
    }
}