const encoded = "QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR";
const API_KEY = atob(encoded);

document.addEventListener("DOMContentLoaded", () => {
  loadShorts();
});

async function loadShorts() {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=shorts&key=${API_KEY}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const container = document.getElementById("shorts");
    container.innerHTML = "";

    data.items.forEach(item => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      const channel = item.snippet.channelTitle;

      const videoDiv = document.createElement("div");
      videoDiv.classList.add("short-card");
      videoDiv.innerHTML = `
        <iframe src="https://www.youtube.com/embed/${videoId}?playsinline=1"
          frameborder="0" allowfullscreen></iframe>
        <div class="short-info">
          <h3>${title}</h3>
          <p>${channel}</p>
        </div>
      `;
      container.appendChild(videoDiv);
    });
  } catch (err) {
    console.error("Error loading shorts:", err);
  }
}
