document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    // Requires both the form and a results container (see _templates/base.html).
    if (!searchForm || !searchResults) return;

    let searchIndex = [];

    function showResults() {
        searchResults.classList.add("is-open");
    }

    function setResultsMessage(html) {
        searchResults.innerHTML = html;
        showResults();
    }

    // Resolve site base URL from the script src so fetch works on GitHub Pages (any base path)
    function getSearchIndexUrl() {
        const script = document.querySelector('script[src*="search.js"]');
        if (script && script.src) {
            const url = new URL(script.src);
            const basePath = url.pathname.replace(/\/scripts\/search\.js.*$/i, "/");
            return url.origin + basePath + "search-index.json";
        }
        return "/search-index.json";
    }

    async function loadSearchIndex() {
        try {
            const url = getSearchIndexUrl();
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            searchIndex = await response.json();
            console.log(`✅ Loaded ${searchIndex.length} pages into search index`);
        } catch (error) {
            console.error("Error loading search index:", error);
            setResultsMessage("<li>Search service unavailable.</li>");
        }
    }

    (async function init() {
        await loadSearchIndex();

        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const query = (searchInput && searchInput.value.trim()) ? searchInput.value.trim().toLowerCase() : "";

            if (!query) {
                setResultsMessage("<li>Please enter a keyword to search.</li>");
                return;
            }

            if (searchIndex.length === 0) {
                setResultsMessage("<li>Search index not loaded. Try again.</li>");
                return;
            }

            // Match every word against title, url, and excerpt
            const words = query.split(/\s+/).filter(Boolean);
            const results = searchIndex.filter((page) => {
                const searchableText = (
                    (page.title || "") + " " +
                    (page.url || "") + " " +
                    (page.excerpt || "")
                ).toLowerCase();
                return words.every((word) => searchableText.includes(word));
            });

            displayResults(results, query);
        });
    })();

    function displayResults(results, query) {
        searchResults.innerHTML = "";

        if (results.length === 0) {
            const escaped = query.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
            setResultsMessage("<li>No results found for '<strong>" + escaped + "</strong>'</li>");
            return;
        }

        results.forEach((result) => {
            const listItem = document.createElement("li");
            listItem.className = "search-result-item";

            const link = document.createElement("a");
            link.href = result.url;
            link.className = "search-result-title";
            link.textContent = result.title;

            const urlDiv = document.createElement("div");
            urlDiv.className = "search-result-url";
            urlDiv.textContent = result.url;

            let excerptDiv = null;
            if (result.excerpt) {
                excerptDiv = document.createElement("div");
                excerptDiv.className = "search-result-excerpt";
                excerptDiv.textContent = result.excerpt;
            }

            listItem.appendChild(link);
            listItem.appendChild(urlDiv);
            if (excerptDiv) {
                listItem.appendChild(excerptDiv);
            }

            searchResults.appendChild(listItem);
        });

        showResults();
    }
});
