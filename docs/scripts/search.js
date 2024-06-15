document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        var searchQuery = document.getElementById('searchInput').value.toLowerCase();
        var content = document.getElementById('content');
        var paragraphs = content.getElementsByTagName('p');

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