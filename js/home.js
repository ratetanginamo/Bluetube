const API_KEY = atob("QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const videoContainer = document.getElementById("videoContainer");

// List of countries
const countries = ["PH", "US", "JP", "CA", "UK"]; // UK uses "GB" in YouTube API

// Default videos on page load
window.addEventListener("DOMContentLoaded", () => {
    fetchVideos("trending");
});

searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) fetchVideos(query);
});

async function fetchVideos(query) {
    videoContainer.innerHTML = "<p>Loading...</p>";
    try {
        const allVideos = [];

        // Fetch videos for each country
        for (let country of countries) {
            // Use GB instead of UK
            let region = country === "UK" ? "GB" : country;

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=3&regionCode=${region}&key=${API_KEY}`
            );
            const data = await response.json();

            if (data.items) {
                allVideos.push(...data.items);
            }
        }

        videoContainer.innerHTML = ""; // Clear container

        if (!allVideos.length) {
            videoContainer.innerHTML = "<p>No videos found.</p>";
            return;
        }

        // Limit total displayed videos to 12
        allVideos.slice(0, 12).forEach(video => {
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

    } catch (error) {
        videoContainer.innerHTML = "<p>Error loading videos. Try again later.</p>";
        console.error(error);
    }
}
