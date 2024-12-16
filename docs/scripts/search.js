document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form submission
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            searchResults.innerHTML = "<li>Please enter a keyword to search.</li>";
            return;
        }

        try {
            const links = await getSiteLinks();
            const results = links.filter((page) =>
                page.text.toLowerCase().includes(query) || page.url.toLowerCase().includes(query)
            );

            displayResults(results);
        } catch (error) {
            console.error("Error during search:", error);
            searchResults.innerHTML = "<li>Search failed. Try again later.</li>";
        }
    });

    async function getSiteLinks() {
        const response = await fetch(window.location.origin);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const links = Array.from(doc.querySelectorAll("a"))
            .filter((a) => a.href.startsWith(window.location.origin))
            .map((a) => ({
                text: a.innerText || "No Title",
                url: a.href,
            }));

        return links;
    }

    function displayResults(results) {
        searchResults.innerHTML = ""; // Clear previous results

        if (results.length === 0) {
            searchResults.innerHTML = "<li>No results found.</li>";
            return;
        }

        results.forEach((result) => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.href = result.url;
            link.textContent = result.text;

            listItem.appendChild(link);
            searchResults.appendChild(listItem);
        });
    }
});
