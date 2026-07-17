const fs = require('fs');
const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const { newsSourcesData } = require('../news-sources-data.js');

const timeout = 8000;
const commonPaths = ['/feed', '/rss', '/rss.xml', '/feed.xml', '/index.xml'];

async function fetchWithTimeout(url) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

async function checkUrlIsRss(url) {
    try {
        const res = await fetchWithTimeout(url);
        if (!res.ok) return false;
        const text = await res.text();
        return text.includes('<rss') || text.includes('<feed') || text.includes('xmlns:atom');
    } catch {
        return false;
    }
}

async function discoverRss(domainUrl) {
    try {
        const baseUrl = new URL(domainUrl).origin;
        
        // Check common paths
        for (const p of commonPaths) {
            const testUrl = baseUrl + p;
            if (await checkUrlIsRss(testUrl)) {
                return testUrl;
            }
        }
        
        // Check homepage for alternate links
        const res = await fetchWithTimeout(baseUrl);
        if (res.ok) {
            const html = await res.text();
            const matches = [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]*type=["']application\/(rss\+xml|atom\+xml)["'][^>]*href=["']([^"']+)["']/gi)];
            for (const match of matches) {
                let href = match[2];
                if (!href.startsWith('http')) {
                    if (href.startsWith('/')) href = baseUrl + href;
                    else href = baseUrl + '/' + href;
                }
                if (await checkUrlIsRss(href)) {
                    return href;
                }
            }
        }
        
        // Also try the exact url provided
        if (await checkUrlIsRss(domainUrl)) {
            return domainUrl;
        }
        
        return null;
    } catch (e) {
        return null;
    }
}

async function run() {
    console.log("Starting RSS Discovery...");
    const results = {};
    
    // Flatten all sources
    const allSources = [];
    for (const [category, sources] of Object.entries(newsSourcesData)) {
        if (category === 'guru-watch') continue; // Guru Watch uses Currents API, not RSS
        for (const source of sources) {
            allSources.push({ category, name: source.name, url: source.url });
        }
    }
    
    // Deduplicate by URL
    const uniqueSources = [];
    const seen = new Set();
    for (const s of allSources) {
        if (!seen.has(s.url)) {
            seen.add(s.url);
            uniqueSources.push(s);
        }
    }
    
    console.log(`Checking ${uniqueSources.length} unique sources (excluding Guru Watch)...`);
    
    let working = 0;
    let failed = 0;
    
    const BATCH_SIZE = 15;
    for (let i = 0; i < uniqueSources.length; i += BATCH_SIZE) {
        const batch = uniqueSources.slice(i, i + BATCH_SIZE);
        await Promise.all(batch.map(async (s) => {
            const rss = await discoverRss(s.url);
            if (rss) {
                console.log(`FOUND: ${s.name} -> ${rss}`);
                s.rss = rss;
                working++;
            } else {
                console.log(`FAILED: ${s.name}`);
                failed++;
            }
            results[s.url] = s;
        }));
    }
    
    fs.writeFileSync('scratch/rss-discovery-results.json', JSON.stringify(Object.values(results), null, 2));
    
    console.log(`\nDiscovery complete. Working: ${working}, Failed: ${failed}`);
    console.log('Saved to scratch/rss-discovery-results.json');
}

run();
