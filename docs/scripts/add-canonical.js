const fs = require('fs');
const { walkHtmlFiles, getAbsoluteUrl } = require('./site-pages');

const CANONICAL_RE = /<link\s+rel=["']canonical["'][^>]*>/i;

function upsertCanonical(html, canonicalUrl) {
    const tag = `<link rel="canonical" href="${canonicalUrl}" />`;

    if (CANONICAL_RE.test(html)) {
        return html.replace(CANONICAL_RE, tag);
    }

    if (/<meta\s+name=["']viewport["'][^>]*>/i.test(html)) {
        return html.replace(
            /(<meta\s+name=["']viewport["'][^>]*>)/i,
            `$1\n    ${tag}`
        );
    }

    if (/<title[^>]*>[\s\S]*?<\/title>/i.test(html)) {
        return html.replace(/(<title[^>]*>[\s\S]*?<\/title>)/i, `$1\n    ${tag}`);
    }

    return html.replace(/(<head[^>]*>)/i, `$1\n    ${tag}`);
}

function addCanonicalTags() {
    let updated = 0;

    console.log('Adding canonical URLs...');

    walkHtmlFiles((filePath) => {
        const canonicalUrl = getAbsoluteUrl(filePath);
        const html = fs.readFileSync(filePath, 'utf8');
        const nextHtml = upsertCanonical(html, canonicalUrl);

        if (nextHtml !== html) {
            fs.writeFileSync(filePath, nextHtml, 'utf8');
            updated += 1;
            console.log(`  ✓ ${canonicalUrl}`);
        }
    });

    console.log(`Canonical tags updated on ${updated} page(s).`);
}

addCanonicalTags();
