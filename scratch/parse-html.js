const fs = require('fs');
const cheerio = require('cheerio');

function testRBA() {
    const $ = cheerio.load(fs.readFileSync('scratch/rba.html'));
    console.log('RBA HREFs:');
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('media-releases') && $(el).text().trim()) {
            console.log(href, $(el).text().trim());
        }
    });
}
function testACCC() {
    const $ = cheerio.load(fs.readFileSync('scratch/accc.html'));
    console.log('ACCC HREFs:');
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('media-release') && $(el).text().trim()) {
            console.log(href, $(el).text().trim());
        }
    });
}
function testATO() {
    const $ = cheerio.load(fs.readFileSync('scratch/ato.html'));
    console.log('ATO HREFs:');
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('media-releases') && $(el).text().trim()) {
            console.log(href, $(el).text().trim());
        }
    });
}
function testAUSTRAC() {
    const $ = cheerio.load(fs.readFileSync('scratch/austrac.html'));
    console.log('AUSTRAC HREFs:');
    $('a').each((i, el) => {
        const href = $(el).attr('href');
        if (href && href.includes('media-release') && $(el).text().trim()) {
            console.log(href, $(el).text().trim());
        }
    });
}

testRBA();
testACCC();
testATO();
testAUSTRAC();
