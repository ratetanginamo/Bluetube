
const apiKey = atob("QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR");
const videoGrid = document.getElementById('video-grid');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');

// Show skeleton loading cards
function showSkeleton(count = 12) {
  videoGrid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const skeleton = `
      <div class="video-card skeleton">
        <div class="thumb"></div>
        <div class="title"></div>
        <div class="meta"></div>
      </div>
    `;
    videoGrid.innerHTML += skeleton;
  }
}

// Display real videos
function displayVideos(videos) {
  // Clear grid (remove skeletons + old cards)
  videoGrid.innerHTML = '';

  if (!videos || videos.length === 0) {
    videoGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ccc; font-family: 'Orbitron', sans-serif;">
        <h3>No videos found</h3>
        <p>Try a different search term.</p>
      </div>
    `;
    return;
  }

  videos.forEach(video => {
    const videoId = video.id.videoId || video.id;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium.url;

    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.innerHTML = `
      <a href="watch.html?v=${videoId}" aria-label="Watch ${title}">
        <img src="${thumbnail}" alt="${title}" loading="lazy">
        <h3>${title}</h3>
      </a>
    `;
    videoGrid.appendChild(videoCard);
  });
}

// Fetch videos from YouTube API
async function fetchVideos(query = 'trending') {
  showSkeleton(12); // Show loading

  let url;
  try {
    if (query === 'trending') {
      url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=PH&key=${apiKey}`;
    } else {
      const encodedQuery = encodeURIComponent(query);
      url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodedQuery}&type=video&maxResults=12&regionCode=PH&key=${apiKey}`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    displayVideos(data.items);
  } catch (error) {
    console.error('YouTube API Error:', error);
    videoGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ff6b6b; font-family: 'Orbitron', sans-serif;">
        <h3>Failed to load videos</h3>
        <p>${error.message}</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #ff0000; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Retry
        </button>
      </div>
    `;
  }
}

// Search on button click
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchVideos(query);
  } else {
    fetchVideos(); // Reload trending
  }
});

// Search on Enter key
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    searchBtn.click();
  }
});

// Debounce to prevent rapid searches
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const query = searchInput.value.trim();
    if (query && query.length > 2) {
      fetchVideos(query);
    }
  }, 600);
});

// Load trending videos on page load
window.addEventListener('load', () => {
  fetchVideos();
});
