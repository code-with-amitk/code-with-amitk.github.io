  document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    performSearch(document.getElementById('searchInput').value);
  });

  function performSearch(query) {
    // Assuming 'content' is an array of your content
    const results = content.filter(item => item.includes(query));
    displayResults(results.join('<br>'));
    }

  function displayResults(results) {
      document.getElementById('searchResults').innerHTML = results;
  }