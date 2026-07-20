document.addEventListener("DOMContentLoaded", () => {

    const searchForm = document.getElementById("searchForm");

    const searchInput = document.getElementById("searchInput");

    const searchResults = document.getElementById("searchResults");



    // Requires both the form and a results container (see _templates/base.html).

    if (!searchForm || !searchResults) return;



    let searchIndex = [];

    let debounceTimer = null;



    function showResults() {

        searchResults.classList.add("is-open");

    }



    function hideResults() {

        searchResults.classList.remove("is-open");

    }



    function setResultsMessage(html) {

        searchResults.innerHTML = html;

        showResults();

    }



    function truncateText(text, maxLength) {

        if (!text) return "";

        const trimmed = text.trim();

        if (trimmed.length <= maxLength) return trimmed;

        return trimmed.slice(0, maxLength).trim() + "…";

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



    function filterResults(query) {

        const words = query.split(/\s+/).filter(Boolean);

        return searchIndex.filter((page) => {

            const searchableText = (

                (page.title || "") + " " +

                (page.url || "") + " " +

                (page.excerpt || "")

            ).toLowerCase();

            return words.every((word) => searchableText.includes(word));

        });

    }



    function displayResults(results, query) {

        searchResults.innerHTML = "";



        if (results.length === 0) {

            const escaped = query.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

            setResultsMessage("<li>No results found for '<strong>" + escaped + "</strong>'</li>");

            return;

        }



        const summary = document.createElement("li");

        summary.className = "search-results-summary";

        summary.textContent = results.length + " result" + (results.length === 1 ? "" : "s");

        searchResults.appendChild(summary);



        results.forEach((result) => {

            const listItem = document.createElement("li");

            listItem.className = "search-result-item";



            const link = document.createElement("a");

            link.href = result.url;

            link.className = "search-result-title";

            link.textContent = result.title;

            link.title = result.title;



            const urlDiv = document.createElement("div");

            urlDiv.className = "search-result-url";

            urlDiv.textContent = truncateText(result.url, 80);

            urlDiv.title = result.url;



            listItem.appendChild(link);

            listItem.appendChild(urlDiv);

            searchResults.appendChild(listItem);

        });



        showResults();

    }



    function runSearch(rawQuery) {

        const query = rawQuery.trim().toLowerCase();



        if (!query) {

            hideResults();

            searchResults.innerHTML = "";

            return;

        }



        if (searchIndex.length === 0) {

            setResultsMessage("<li>Search index not loaded. Try again.</li>");

            return;

        }



        displayResults(filterResults(query), query);

    }



    function scheduleSearch() {

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {

            runSearch(searchInput ? searchInput.value : "");

        }, 150);

    }



    (async function init() {

        await loadSearchIndex();



        searchForm.addEventListener("submit", (event) => {

            event.preventDefault();

            runSearch(searchInput ? searchInput.value : "");

        });



        if (searchInput) {

            searchInput.addEventListener("input", scheduleSearch);

        }



        document.addEventListener("click", (event) => {

            if (!searchForm.contains(event.target) && !searchResults.contains(event.target)) {

                hideResults();

            }

        });

    })();

});

