// Simple Jekyll Search
(function() {
  let searchData = [];
  let searchInput = document.getElementById('search-input');
  let searchResults = document.getElementById('search-results');
  let searchOverlay = document.getElementById('search-overlay');

  // Load search data
  fetch('/search.json')
    .then(response => response.json())
    .then(data => {
      searchData = data;
    })
    .catch(error => console.error('Error loading search data:', error));

  // Search function
  function performSearch(query) {
    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    query = query.toLowerCase();
    const results = searchData.filter(post => {
      return post.title.toLowerCase().includes(query) ||
             post.content.toLowerCase().includes(query) ||
             post.tags.toLowerCase().includes(query);
    });

    displayResults(results, query);
  }

  // Display search results
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-no-results">未找到相关文章</div>';
      return;
    }

    let html = '<div class="search-results-list">';
    results.slice(0, 10).forEach(post => {
      // Highlight search term in title
      let highlightedTitle = post.title.replace(
        new RegExp(query, 'gi'),
        match => `<mark>${match}</mark>`
      );

      // Get excerpt with highlighted search term
      let excerpt = getExcerpt(post.content, query);

      html += `
        <div class="search-result-item">
          <h3><a href="${post.url}">${highlightedTitle}</a></h3>
          <div class="search-result-meta">
            <span class="date">${post.date}</span>
            ${post.tags ? `<span class="tags">${post.tags}</span>` : ''}
          </div>
          <p class="search-result-excerpt">${excerpt}</p>
        </div>
      `;
    });
    html += '</div>';

    searchResults.innerHTML = html;
  }

  // Get excerpt with highlighted search term
  function getExcerpt(content, query) {
    const maxLength = 150;
    const lowerContent = content.toLowerCase();
    const queryIndex = lowerContent.indexOf(query.toLowerCase());

    if (queryIndex === -1) {
      return content.substring(0, maxLength) + '...';
    }

    const start = Math.max(0, queryIndex - 50);
    const end = Math.min(content.length, queryIndex + query.length + 100);
    let excerpt = content.substring(start, end);

    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    // Highlight query in excerpt
    excerpt = excerpt.replace(
      new RegExp(query, 'gi'),
      match => `<mark>${match}</mark>`
    );

    return excerpt;
  }

  // Event listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      performSearch(e.target.value);
    });

    searchInput.addEventListener('focus', () => {
      if (searchOverlay) {
        searchOverlay.classList.add('active');
      }
    });
  }

  // Close search overlay when clicking outside
  if (searchOverlay) {
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
      }
    });
  }

  // Close search with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay) {
      searchOverlay.classList.remove('active');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }
  });

  // Open search with Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
      }
    }
  });
})();
