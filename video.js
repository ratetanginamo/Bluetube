const encoded = "QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR";
const API_KEY = atob(encoded);

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
