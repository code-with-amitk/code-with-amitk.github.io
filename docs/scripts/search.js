document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    var searchForm = document.getElementById('searchForm');
    if (!searchForm) {
        console.error('Search form not found');
        return;
    }

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting normally
        console.log('Search form submitted');

        var searchInput = document.getElementById('searchInput');
        if (!searchInput) {
            console.error('Search input not found');
            return;
        }

        var searchQuery = searchInput.value.toLowerCase();
        console.log('Search query:', searchQuery);

        var content = document.getElementById('content');
        if (!content) {
            console.error('Content element not found');
            return;
        }

        var paragraphs = content.getElementsByTagName('p');
        console.log('Number of paragraphs:', paragraphs.length);

        // Reset previous search results
        for (var i = 0; i < paragraphs.length; i++) {
            paragraphs[i].classList.remove('hidden');
        }

        // Perform the search
        for (var i = 0; i < paragraphs.length; i++) {
            if (!paragraphs[i].innerText.toLowerCase().includes(searchQuery)) {
                paragraphs[i].classList.add('hidden');
            }
        }
    });
});