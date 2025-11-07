const encoded = "QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR";
const API_KEY = atob(encoded);

const resultsDiv = document.getElementById("results");
const loadingDiv = document.getElementById("loading");
const searchInput = document.getElementById("search");

// Format views
function formatViews(views) {
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M";
  if (views >= 1_000) return (views / 1_000).toFixed(1) + "K";
  return views.toString();
}

// Time ago
function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 }
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
}

// Fetch video stats
async function fetchVideoStats(videoIds) {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds.join(',')}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.items.reduce((acc, item) => {
    acc[item.id] = item.statistics;
    return acc;
  }, {});
}

// Render videos
async function renderVideos(items) {
  resultsDiv.innerHTML = "";
  if (!items.length) {
    resultsDiv.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>No videos found.</p>";
    return;
  }

  const videoIds = items.map(item => item.id.videoId || item.id);
  const stats = await fetchVideoStats(videoIds);

  items.forEach(item => {
    const videoId = item.id.videoId || item.id;
    const stat = stats[videoId] || {};
    const snippet = item.snippet;

    const card = document.createElement("a");
    card.href = `video.html?id=${videoId}`;
    card.classList.add("video-card");

    card.innerHTML = `
      <img src="${snippet.thumbnails.medium.url}" alt="${snippet.title}" loading="lazy">
      <div class="video-info">
        <h3>${snippet.title}</h3>
        <div class="channel">${snippet.channelTitle}</div>
        <div class="meta">${formatViews(stat.viewCount || 0)} views • ${timeAgo(snippet.publishedAt)}</div>
      </div>
    `;

    resultsDiv.appendChild(card);
  });
}

// Search
async function search() {
  const query = searchInput.value.trim();
  if (!query) return alert("Please enter a search term.");

  loadingDiv.style.display = "block";
  resultsDiv.innerHTML = "";

  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.error) throw new Error(data.error.message);

    await renderVideos(data.items);
  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = `<p style='text-align:center; color:red;'>Error: ${err.message}</p>`;
  } finally {
    loadingDiv.style.display = "none";
  }
}

// Load trending
async function loadTrending() {
  loadingDiv.style.display = "block";
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=PH&maxResults=12&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    await renderVideos(data.items);
  } catch (err) {
    console.error("Failed to load trending:", err);
  } finally {
    loadingDiv.style.display = "none";
  }
}

// Dark mode toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  document.querySelector("#theme-toggle i").classList.toggle("fa-moon");
  document.querySelector("#theme-toggle i").classList.toggle("fa-sun");
});

// Init
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    document.querySelector("#theme-toggle i").classList.replace("fa-moon", "fa-sun");
  }
  loadTrending();
};
