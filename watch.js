// watch.js - BlueTube Watch Page Logic
// Optimized for PH: Fast, Offline-Resilient, SEC IT Branding

const API_KEY = atob("QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR"); // Same as script.js
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('v');

const player = document.getElementById('youtube-player');
const placeholder = document.getElementById('player-placeholder');
const titleEl = document.getElementById('video-title');
const descEl = document.getElementById('video-description');

// Show error if no video ID
if (!videoId) {
  showError("No video selected. <a href='index.html'>Go back</a>.");
  return;
}

// Load YouTube iframe (lazy, autoplay off on mobile)
function loadPlayer() {
  player.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3`;
  placeholder.style.display = 'none';
}

// Fetch video details
async function fetchVideoInfo() {
  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
    );
    const data = await res.json();

    if (data.items && data.items[0]) {
      const v = data.items[0].snippet;
      titleEl.textContent = v.title;
      descEl.innerHTML = formatDescription(v.description);
      document.title = `${v.title} | BlueTube`;
    } else {
      throw new Error("Video not found");
    }
  } catch (err) {
    console.error("API Error:", err);
    showError("Failed to load video info. Check connection.");
  }
}

// Format description: links + line breaks
function formatDescription(text) {
  if (!text) return "No description.";
  return text
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
}

// Show error message
function showError(msg) {
  document.getElementById('video-container').innerHTML = `
    <div class="error-msg">
      <h2>Error</h2>
      <p>${msg}</p>
    </div>
  `;
}

// Start loading
loadPlayer();
fetchVideoInfo();
