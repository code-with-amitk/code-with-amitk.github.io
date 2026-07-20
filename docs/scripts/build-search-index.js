const fs = require('fs');
const path = require('path');
const {
    DOCS_DIR,
    SEARCH_INDEX_EXCLUDE_FILES,
    getRelativeUrl,
    walkHtmlFiles,
} = require('./site-pages');

const OUTPUT_FILE = path.join(DOCS_DIR, 'search-index.json');

function getPageTitle(filePath, htmlContent) {
    try {
        const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1].trim()) {
            return titleMatch[1].trim();
        }

        const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (h1Match && h1Match[1].trim()) {
            return h1Match[1].trim();
        }

        return path.basename(filePath, '.html');
    } catch (e) {
        return path.basename(filePath, '.html');
    }
}

function getPageExcerpt(htmlContent, maxLength = 150) {
    try {
        const text = htmlContent
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, maxLength);
        return text + (text.length === maxLength ? '...' : '');
    } catch (e) {
        return '';
    }
}

function generateSearchIndex() {
    const searchIndex = [];
    let fileCount = 0;

    console.log('Building search index...');

    try {
        walkHtmlFiles((filePath) => {
            try {
                const html = fs.readFileSync(filePath, 'utf8');
                const title = getPageTitle(filePath, html);
                const url = getRelativeUrl(filePath);
                const excerpt = getPageExcerpt(html);

                if (title && url) {
                    searchIndex.push({ title, url, excerpt });
                    fileCount += 1;
                    console.log(`  ✓ ${title} (${url})`);
                }
            } catch (e) {
                console.warn(`Error processing ${filePath}:`, e.message);
            }
        }, SEARCH_INDEX_EXCLUDE_FILES);

        searchIndex.sort((a, b) => a.title.localeCompare(b.title));
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2));

        console.log('Search index built successfully.');
        console.log(`Indexed ${fileCount} pages`);
        console.log(`Saved to: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Error building search index:', error);
        process.exit(1);
    }
}

generateSearchIndex();
