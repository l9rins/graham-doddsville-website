const fetch = require('node-fetch');
const fs = require('fs');
async function run() {
    const rba = await fetch('https://www.rba.gov.au/news/').then(r=>r.text());
    fs.writeFileSync('scratch/rba.html', rba);

    const accc = await fetch('https://www.accc.gov.au/about-us/media/media-releases').then(r=>r.text());
    fs.writeFileSync('scratch/accc.html', accc);

    const ato = await fetch('https://www.ato.gov.au/media-centre').then(r=>r.text());
    fs.writeFileSync('scratch/ato.html', ato);

    const austrac = await fetch('https://www.austrac.gov.au/news-and-media/media-release').then(r=>r.text());
    fs.writeFileSync('scratch/austrac.html', austrac);

    const afca = await fetch('https://www.afca.org.au/news/media-releases').then(r=>r.text());
    fs.writeFileSync('scratch/afca.html', afca);
}
run();
