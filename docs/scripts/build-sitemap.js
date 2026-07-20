const fs = require('fs');
const path = require('path');
const {
    DOCS_DIR,
    SITEMAP_EXCLUDE_FILES,
    getRelativeUrl,
    getAbsoluteUrl,
    getSitemapPriority,
    walkHtmlFiles,
    escapeXml,
} = require('./site-pages');

const OUTPUT_FILE = path.join(DOCS_DIR, 'sitemap.xml');

function toLastMod(filePath) {
    const mtime = fs.statSync(filePath).mtime;
    return mtime.toISOString().slice(0, 10);
}

function getChangeFreq(relativeUrl) {
    return relativeUrl === '/' ? 'weekly' : 'monthly';
}

function buildUrlEntry(filePath) {
    const relativeUrl = getRelativeUrl(filePath);
    const loc = getAbsoluteUrl(filePath);
    const lastmod = toLastMod(filePath);
    const changefreq = getChangeFreq(relativeUrl);
    const priority = getSitemapPriority(relativeUrl);

    return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
    ].join('\n');
}

function generateSitemap() {
    const entries = [];

    console.log('Building sitemap...');

    walkHtmlFiles((filePath) => {
        entries.push({
            relativeUrl: getRelativeUrl(filePath),
            xml: buildUrlEntry(filePath),
        });
        console.log(`  ✓ ${getRelativeUrl(filePath)}`);
    }, SITEMAP_EXCLUDE_FILES);

    entries.sort((a, b) => a.relativeUrl.localeCompare(b.relativeUrl));

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...entries.map((entry) => entry.xml),
        '</urlset>',
        '',
    ].join('\n');

    fs.writeFileSync(OUTPUT_FILE, xml, 'utf8');

    console.log('Sitemap built successfully.');
    console.log(`Indexed ${entries.length} URLs`);
    console.log(`Saved to: ${OUTPUT_FILE}`);
}

generateSitemap();
