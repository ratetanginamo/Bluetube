const API_KEY = atob("QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const videoContainer = document.getElementById("videoContainer");

// Allowed countries
const allowedCountries = ["PH", "US", "JP", "CA", "GB"]; // GB = UK

let userCountry = null;

// Check visitor country
async function checkCountry() {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        userCountry = data.country;
        if (!allowedCountries.includes(userCountry)) {
            document.body.innerHTML = `
                <div style="display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column;color:#fff;background:#0a0a0a;font-family:Arial,sans-serif;">
                    <h1>Access Denied</h1>
                    <p>Sorry, this site is only available in PH, US, JP, CA, and UK.</p>
                </div>
            `;
            return false;
        }
        return true;
    } catch (error) {
        console.error("GeoIP check failed:", error);
        userCountry = "US"; // fallback to US
        return true;
    }
}

// Initialize site
async function init() {
    const allowed = await checkCountry();
    if (!allowed) return; // Stop if user not allowed
    fetchVideos("trending");
}

init();

// Search button click
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;

    // Limit search to allowed countries
    if (!allowedCountries.includes(userCountry)) {
        alert("Search is not available in your country.");
        return;
    }
    fetchVideos(query);
});

// Fetch videos from allowed countries only
async function fetchVideos(query) {
    videoContainer.innerHTML = "<p>Loading...</p>";
    try {
        const allVideos = [];

        for (let country of allowedCountries) {
            const region = country === "UK" ? "GB" : country;

            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=3&regionCode=${region}&key=${API_KEY}`
            );
            const data = await response.json();
            if (data.items) {
                data.items.forEach(v => v.regionCode = region);
                allVideos.push(...data.items);
            }
        }

        videoContainer.innerHTML = "";

        if (!allVideos.length) {
            videoContainer.innerHTML = "<p>No videos found.</p>";
            return;
        }

        allVideos.slice(0, 12).forEach(video => {
            const videoEl = document.createElement("div");
            videoEl.classList.add("video-card");
            videoEl.innerHTML = `
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <h3>${video.snippet.title}</h3>
                <p style="font-size:12px;color:#ccc;">Region: ${video.regionCode}</p>
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
