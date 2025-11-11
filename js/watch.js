const params = new URLSearchParams(window.location.search);
const videoId = params.get("videoId");
const watchContainer = document.getElementById("watchContainer");

if (videoId) {
    watchContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
} else {
    watchContainer.innerHTML = "<p>No video selected.</p>";
}
