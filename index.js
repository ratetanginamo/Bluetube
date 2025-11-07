const encoded = "QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR";
const API_KEY = atob(encoded);

document.addEventListener("DOMContentLoaded", () => {
  loadTrending();
  loadShorts();
});

async function loadTrending() {
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=PH&maxResults=8&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const trendingDiv = document.getElementById("trending");
    trendingDiv.innerHTML = "";
    data.items.forEach(item => {
      trendingDiv.innerHTML += `
        <div class="video">
          <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}">
          <h3>${item.snippet.title}</h3>
          <a href="video.html?id=${item.id}">Watch</a>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading trending videos:", err);
  }
}

async function loadShorts() {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=shorts&key=${API_KEY}`;
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

async function search() {
  const query = document.getElementById("search").value;
  if (!query) return alert("Please type something to search.");
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const trendingDiv = document.getElementById("trending");
    const shortsDiv = document.getElementById("shorts");
    trendingDiv.innerHTML = `<h2 style="grid-column:1/-1;">Search results for "${query}"</h2>`;
    shortsDiv.innerHTML = "";
    data.items.forEach(item => {
      trendingDiv.innerHTML += `
        <div class="video">
          <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}">
          <h3>${item.snippet.title}</h3>
          <a href="video.html?id=${item.id.videoId}">Watch</a>
        </div>
      `;
    });
  } catch (err) {
    console.error(err);
    alert("Error fetching videos.");
  }
}
  
