const encoded = "QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR";
const API_KEY = atob(encoded);

const isIndex = document.getElementById("search");
const isVideo = document.getElementById("player") || document.getElementById("video-info");

async function search() {
  const query = document.getElementById("search").value;
  if (!query) return alert("Please type something to search.");
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const results = document.getElementById("results");
    results.innerHTML = "";
    data.items.forEach(item => {
      const video = document.createElement("div");
      video.classList.add("video");
      video.innerHTML = `
        <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}">
        <h3>${item.snippet.title}</h3>
        <a href="video.html?id=${item.id.videoId}">Watch</a>
      `;
      results.appendChild(video);
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching videos.");
  }
}

if (isVideo) {
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get("id");
  if (!videoId) {
    document.body.innerHTML = "<h2 style='text-align:center;'>❌ Video not found</h2>";
  } else {
    const player = document.getElementById("player");
    player.innerHTML = `
      <iframe width="100%" height="400"
        src="https://www.youtube.com/embed/${videoId}"
        frameborder="0"
        allowfullscreen>
      </iframe>
    `;
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const info = data.items[0].snippet;
          document.getElementById("title").textContent = info.title;
          document.getElementById("description").textContent = info.description;
        } else {
          document.getElementById("title").textContent = "Video not found.";
        }
      })
      .catch(err => {
        console.error(err);
        document.getElementById("title").textContent = "Error loading video info.";
      });
  }
      }
