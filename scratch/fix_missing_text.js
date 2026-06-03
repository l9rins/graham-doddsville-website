const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const replacements = [
        ['Letters <span class="article-source-inline">(1957 to 1970)</span>', 'Warren Buffett\'s Partnership Letters <span class="article-source-inline">(1957 to 1970)</span>'],
        ['Letters to Berkshire Shareholders <span class="article-source-inline">(1969 to 1976)</span>', 'Warren Buffett\'s Unpublished Letters to Berkshire Shareholders <span class="article-source-inline">(1969 to 1976)</span>'],
        ['Berkshire Shareholders <span class="article-source-inline">(1977 to present day)</span>', 'Warren Buffett\'s Letters to Berkshire Shareholders <span class="article-source-inline">(1977 to present day)</span>'],
        ['Manual <span class="article-source-inline">(1999)</span>', 'Berkshire Hathaway Owner\'s Manual <span class="article-source-inline">(1999)</span>'],
        ['and Doddsville <span class="article-source-inline">(1984)</span>', 'The Superinvestors of Graham and Doddsville <span class="article-source-inline">(1984)</span>'],
        ['Current Problems in Security Analysis <span class="article-source-inline">(1946 &amp; 1947)</span>', 'Benjamin Graham Lectures on Current Problems in Security Analysis <span class="article-source-inline">(1946 &amp; 1947)</span>'],
        ['Letters <span class="article-source-inline">(1946 to 1958)</span>', 'Graham-Newman Partnership Letters <span class="article-source-inline">(1946 to 1958)</span>'],
        ['Rich Corporations Return Stockholders\' Cash? <span class="article-source-inline">(Benjamin Graham 1932)</span>', 'Should Rich Corporations Return Stockholders\' Cash? <span class="article-source-inline">(Benjamin Graham 1932)</span>'],
        ['Rich But Losing Corporations be Liquidated? <span class="article-source-inline">(Benjamin Graham 1932)</span>', 'Should Rich But Losing Corporations be Liquidated? <span class="article-source-inline">(Benjamin Graham 1932)</span>'],
        ['America for 50 Cents on the Dollar <span class="article-source-inline">(Benjamin Graham 1932)</span>', 'Selling America for 50 Cents on the Dollar <span class="article-source-inline">(Benjamin Graham 1932)</span>']
    ];
    
    let original = content;
    for (const [search, replace] of replacements) {
        content = content.replace(search, replace);
    }
    
    const indexReplacements = [
        ['Letters (1957 to 1970)</h3>', 'Warren Buffett\'s Partnership Letters (1957 to 1970)</h3>'],
        ['Letters to Berkshire Shareholders (1969 to 1976)</h3>', 'Warren Buffett\'s Unpublished Letters to Berkshire Shareholders (1969 to 1976)</h3>'],
        ['Berkshire Shareholders (1977 to present day)</h3>', 'Warren Buffett\'s Letters to Berkshire Shareholders (1977 to present day)</h3>'],
        ['Manual (1999)</h3>', 'Berkshire Hathaway Owner\'s Manual (1999)</h3>'],
        ['and Doddsville (1984)</h3>', 'The Superinvestors of Graham and Doddsville (1984)</h3>'],
        ['Current Problems in Security Analysis (1946 &amp; 1947)</h3>', 'Benjamin Graham Lectures on Current Problems in Security Analysis (1946 &amp; 1947)</h3>'],
        ['Letters (1946 to 1958)</h3>', 'Graham-Newman Partnership Letters (1946 to 1958)</h3>'],
        ['Rich Corporations Return Stockholders\' Cash? (Benjamin Graham 1932)</a></h3>', 'Should Rich Corporations Return Stockholders\' Cash? (Benjamin Graham 1932)</a></h3>'],
        ['Rich But Losing Corporations be Liquidated? (Benjamin Graham 1932)</a></h3>', 'Should Rich But Losing Corporations be Liquidated? (Benjamin Graham 1932)</a></h3>'],
        ['America for 50 Cents on the Dollar (Benjamin Graham 1932)</a></h3>', 'Selling America for 50 Cents on the Dollar (Benjamin Graham 1932)</a></h3>']
    ];
    for (const [search, replace] of indexReplacements) {
        content = content.replace(search, replace);
    }

    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${filePath}`);
    } else {
        console.log(`No changes made to ${filePath}`);
    }
}

fixFile('public/index.html');
fixFile('index.html');
