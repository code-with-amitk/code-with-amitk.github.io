const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..');
const SITE_URL = 'https://code-with-amitk.github.io';

const EXCLUDE_DIRS = [
    'node_modules',
    '.git',
    'css',
    'images',
    'scripts',
    '_layouts',
    '_templates',
    '.vscode',
    'Documents',
];

const EXCLUDE_FILES = [
    '.gitignore',
    '_config.yml',
    'search-index.json',
    'sitemap.xml',
    'package.json',
    'package-lock.json',
];

// Pages omitted from sitemap (still allowed in robots.txt unless Disallow added)
const SITEMAP_EXCLUDE_FILES = [...EXCLUDE_FILES, 'MyResume.html'];

// Pages omitted from site search index
const SEARCH_INDEX_EXCLUDE_FILES = [...EXCLUDE_FILES, 'contact.html', 'MyResume.html'];

function isExcluded(filePath, excludeFiles = EXCLUDE_FILES) {
    const dirs = filePath.split(path.sep);
    if (EXCLUDE_DIRS.some((exc) => dirs.includes(exc))) {
        return true;
    }

    const fileName = path.basename(filePath);
    return excludeFiles.includes(fileName);
}

function getRelativeUrl(filePath) {
    let relativePath = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/');

    if (filePath.endsWith('index.html')) {
        relativePath = relativePath.replace(/index\.html$/, '');
    }

    if (!relativePath.startsWith('/')) {
        relativePath = '/' + relativePath;
    }

    return relativePath;
}

function encodeUrlPath(relativeUrl) {
    if (relativeUrl === '/') {
        return '/';
    }

    return (
        '/' +
        relativeUrl
            .replace(/^\//, '')
            .split('/')
            .filter(Boolean)
            .map((segment) => encodeURIComponent(segment))
            .join('/')
    );
}

function getAbsoluteUrl(filePath) {
    const relativeUrl = getRelativeUrl(filePath);
    const encodedPath = encodeUrlPath(relativeUrl);
    return SITE_URL + (encodedPath === '/' ? '/' : encodedPath);
}

function getSitemapPriority(relativeUrl) {
    if (relativeUrl === '/') {
        return '1.0';
    }
    if (relativeUrl.endsWith('/')) {
        return '0.8';
    }
    return '0.6';
}

function walkHtmlFiles(callback, excludeFiles = EXCLUDE_FILES) {
    function walkDir(dir) {
        fs.readdirSync(dir).forEach((file) => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (isExcluded(filePath, excludeFiles)) {
                return;
            }

            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.html')) {
                callback(filePath);
            }
        });
    }

    walkDir(DOCS_DIR);
}

function escapeXml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

module.exports = {
    DOCS_DIR,
    SITE_URL,
    EXCLUDE_DIRS,
    EXCLUDE_FILES,
    SITEMAP_EXCLUDE_FILES,
    SEARCH_INDEX_EXCLUDE_FILES,
    isExcluded,
    getRelativeUrl,
    getAbsoluteUrl,
    getSitemapPriority,
    walkHtmlFiles,
    escapeXml,
};
