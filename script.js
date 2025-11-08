const apiKey = atob("QUl6YVN5Q1lSSU5OcEtTTEVYaWNEZThmc3I4Z1ZNZ1RWMTRSNGdR");
const videoGrid = document.getElementById('video-grid');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('search');

async function fetchVideos(query = 'trending') {
  let url;
  
  if(query === 'trending') {
    url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=12&regionCode=US&key=${apiKey}`;
  } else {
    url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=12&key=${apiKey}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  displayVideos(data.items);
}

function displayVideos(videos) {
  videoGrid.innerHTML = '';
  videos.forEach(video => {
    const videoId = video.id.videoId || video.id;
    const title = video.snippet.title;
    const thumbnail = video.snippet.thumbnails.high.url;

    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.innerHTML = `
      <a href="watch.html?v=${videoId}">
        <img src="${thumbnail}" alt="${title}">
        <h3>${title}</h3>
      </a>
    `;
    videoGrid.appendChild(videoCard);
  });
}

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if(query) fetchVideos(query);
});

window.onload = () => fetchVideos();
