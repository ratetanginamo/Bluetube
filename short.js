const encoded = "QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR";
const API_KEY = atob(encoded);

document.addEventListener("DOMContentLoaded", () => {
  loadShorts();
});

async function loadShorts() {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=shorts&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const shortsDiv = document.getElementById("shorts");
    shortsDiv.innerHTML = "";
    data.items.forEach(item => {
      shortsDiv.innerHTML += `
        <div class="video">
          <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}">
          <h3>${item.snippet.title}</h3>
          <a href="video.html?id=${item.id.videoId}">Watch</a>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading shorts:", err);
  }
}
