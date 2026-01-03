const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(DOCS_DIR, 'search-index.json');

// Files/folders to exclude from search
const EXCLUDE_DIRS = ['node_modules', '.git', 'css', 'images', 'scripts', '_layouts', '.vscode', 'Documents'];
const EXCLUDE_FILES = ['.gitignore', '_config.yml', 'search-index.json', 'contact.html', 'MyResume.html', 'package.json', 'package-lock.json'];

function isExcluded(filePath) {
    // Check if directory is excluded
    const dirs = filePath.split(path.sep);
    if (EXCLUDE_DIRS.some(exc => dirs.includes(exc))) {
        return true;
    }
    // Check if file is excluded
    const fileName = path.basename(filePath);
    if (EXCLUDE_FILES.includes(fileName)) {
        return true;
    }
    return false;
}

function getPageTitle(filePath, htmlContent) {
    try {
        // Try to get title from <title> tag
        const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1].trim()) {
            return titleMatch[1].trim();
        }

        // Fallback: get first h1
        const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (h1Match && h1Match[1].trim()) {
            return h1Match[1].trim();
        }

        // Last resort: use filename
        return path.basename(filePath, '.html');
    } catch (e) {
        return path.basename(filePath, '.html');
    }
}

function getPageExcerpt(htmlContent, maxLength = 150) {
    try {
        // Remove all HTML tags
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

function getRelativeUrl(filePath) {
    let relativePath = path.relative(DOCS_DIR, filePath)
        .replace(/\\/g, '/');
    
    if (filePath.endsWith('index.html')) {
        relativePath = relativePath.replace('index.html', '');
    }
    
    return '/' + relativePath;
}

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (isExcluded(filePath)) return;

        if (stat.isDirectory()) {
            walkDir(filePath, callback);
        } else if (file.endsWith('.html')) {
            callback(filePath);
        }
    });
}

function generateSearchIndex() {
    const searchIndex = [];
    let fileCount = 0;

    console.log('📚 Building search index...');

    try {
        walkDir(DOCS_DIR, (filePath) => {
            try {
                const html = fs.readFileSync(filePath, 'utf8');

                const title = getPageTitle(filePath, html);
                const url = getRelativeUrl(filePath);
                const excerpt = getPageExcerpt(html);

                if (title && url) {
                    searchIndex.push({
                        title,
                        url,
                        excerpt
                    });
                    fileCount++;
                    console.log(`  ✓ ${title} (${url})`);
                }
            } catch (e) {
                console.warn(`⚠️  Error processing ${filePath}:`, e.message);
            }
        });

        // Sort by title
        searchIndex.sort((a, b) => a.title.localeCompare(b.title));

        // Write to file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2));

        console.log(`✅ Search index built successfully!`);
        console.log(`📄 Indexed ${fileCount} pages`);
        console.log(`💾 Saved to: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('❌ Error building search index:', error);
        process.exit(1);
    }
}

generateSearchIndex();
