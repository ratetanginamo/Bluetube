const encoded = "QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR";
const API_KEY = atob(encoded);

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
