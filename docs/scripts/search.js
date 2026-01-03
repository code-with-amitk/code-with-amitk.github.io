document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    let searchIndex = [];

    // Load search index on page load
    loadSearchIndex();

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            searchResults.innerHTML = "<li>Please enter a keyword to search.</li>";
            return;
        }

        if (searchIndex.length === 0) {
            searchResults.innerHTML = "<li>Search index not loaded. Try again.</li>";
            return;
        }

        // Filter results - search in title, url, and excerpt
        const results = searchIndex.filter((page) => {
            const searchableText = (
                page.title.toLowerCase() +
                " " +
                page.url.toLowerCase() +
                " " +
                (page.excerpt || "").toLowerCase()
            );
            return searchableText.includes(query);
        });

        displayResults(results, query);
    });

    async function loadSearchIndex() {
        try {
            const response = await fetch("/search-index.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            searchIndex = await response.json();
            console.log(`✅ Loaded ${searchIndex.length} pages into search index`);
        } catch (error) {
            console.error("Error loading search index:", error);
            searchResults.innerHTML = "<li>Search service unavailable.</li>";
        }
    }

    function displayResults(results, query) {
        searchResults.innerHTML = "";

        if (results.length === 0) {
            searchResults.innerHTML = "<li>No results found for '<strong>" + query + "</strong>'</li>";
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
    }
});
