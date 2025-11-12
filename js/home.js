const API_KEY = atob("QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const videoContainer = document.getElementById("videoContainer");

// Allowed countries
const allowedCountries = ["PH","US", "JP", "CA", "GB"]; // GB = UK
let userCountry = null;

// Check visitor country
async function checkCountry() {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        userCountry = data.country;

        // If user’s country not allowed → show Access Denied screen
        if (!allowedCountries.includes(userCountry)) {
            document.body.innerHTML = `
                <div style="
                    display:flex;
                    justify-content:center;
                    align-items:center;
                    height:100vh;
                    flex-direction:column;
                    background:#0a0a0a;
                    color:#fff;
                    font-family:Arial,sans-serif;
                    text-align:center;
                ">
                    <h1 style="font-size:3em;">🚫 Access Denied</h1>
                    <p style="max-width:400px;line-height:1.5;">
                        Sorry, this site is only available in 
                        <b>PH, US, JP, CA, and UK</b>.
                    </p>
                    <p style="color:#999;font-size:0.9em;">Your detected country: ${userCountry || "Unknown"}</p>
                </div>
            `;
            return false;
        }

        return true;
    } catch (error) {
        console.error("GeoIP check failed:", error);
        userCountry = "US"; // fallback if API fails
        return true;
    }
}

// Initialize site
async function init() {
    const allowed = await checkCountry();
    if (!allowed) return; // stop loading if access denied
    fetchVideos("trending");
}

init();

// Search button click (no country restriction)
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) return;
    fetchVideos(query);
});

// Fetch videos from YouTube API
async function fetchVideos(query) {
    videoContainer.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=12&key=${API_KEY}`
        );

        const data = await response.json();
        videoContainer.innerHTML = "";

        if (!data.items || !data.items.length) {
            videoContainer.innerHTML = "<p>No videos found.</p>";
            return;
        }

        data.items.forEach(video => {
            const videoEl = document.createElement("div");
            videoEl.classList.add("video-card");
            videoEl.innerHTML = `
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <h3>${video.snippet.title}</h3>
                <p style="font-size:12px;color:#ccc;">Region: ${userCountry}</p>
            `;
            videoEl.addEventListener("click", () => {
                window.location.href = \`watch.html?videoId=\${video.id.videoId}\`;
            });
            videoContainer.appendChild(videoEl);
        });

    } catch (error) {
        videoContainer.innerHTML = "<p>Error loading videos. Try again later.</p>";
        console.error(error);
    }
                      }
                      
