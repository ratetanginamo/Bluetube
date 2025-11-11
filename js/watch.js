const params = new URLSearchParams(window.location.search);
const videoId = params.get("videoId");

const watchContainer = document.getElementById("watchContainer");
const videoTitle = document.getElementById("videoTitle");
const videoDescription = document.getElementById("videoDescription");

const API_KEY = atob("QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR");

if (videoId) {
    // Load video player
    watchContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;

    // Fetch video details
    fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
        if (data.items.length) {
            const video = data.items[0].snippet;
            videoTitle.textContent = video.title;
            videoDescription.textContent = video.description;
        }
    });
} else {
    watchContainer.innerHTML = "<p>No video selected.</p>";
}
