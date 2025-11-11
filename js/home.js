const API_KEY = atob("QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const videoContainer = document.getElementById("videoContainer");

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchVideos(query);
    }
});

async function fetchVideos(query) {
    videoContainer.innerHTML = "Loading...";
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=12&key=${API_KEY}`
    );
    const data = await response.json();
    videoContainer.innerHTML = "";
    data.items.forEach(video => {
        const videoEl = document.createElement("div");
        videoEl.classList.add("video-card");
        videoEl.innerHTML = `
            <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
            <h3>${video.snippet.title}</h3>
        `;
        videoEl.addEventListener("click", () => {
            window.location.href = `watch.html?videoId=${video.id.videoId}`;
        });
        videoContainer.appendChild(videoEl);
    });
                                 }
