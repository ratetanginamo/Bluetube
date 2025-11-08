// === Termux server IP ===
const API_SERVER = 'http://192.168.1.61:3000';
const WS_SERVER = 'ws://192.168.1.61:3000';

// WebSocket for live comments
const ws = new WebSocket(WS_SERVER);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if(data.type === 'comment') {
    const list = document.getElementById('commentList');
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `<b>${data.name}</b> (${data.role}): ${data.text}`;
    list.appendChild(div);
    list.scrollTop = list.scrollHeight;
  }
};

// Search YouTube videos
async function searchVideos() {
  const q = document.getElementById('search').value || 'trending';
  const res = await fetch(`${API_SERVER}/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  renderResults(data.items || []);
}

// Render video results
function renderResults(items) {
  const results = document.getElementById('results');
  results.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'card';

    const thumb = document.createElement('img');
    thumb.src = it.thumbnail;
    thumb.alt = it.title;
    thumb.style.width = '100%';

    const title = document.createElement('div');
    title.className = 'title';
    title.innerText = it.title;

    const channel = document.createElement('div');
    channel.className = 'meta';
    channel.innerText = it.channel;

    card.appendChild(thumb);
    card.appendChild(title);
    card.appendChild(channel);

    card.onclick = () => {
      const player = document.getElementById('playerArea');
      player.innerHTML = `<iframe width="100%" height="240" src="https://www.youtube.com/embed/${it.id}" frameborder="0" allowfullscreen></iframe>`;
    };

    results.appendChild(card);
  });
}

// Send comment via WebSocket
function sendComment() {
  const input = document.getElementById('commentInput');
  if(input.value.trim() === '') return;
  ws.send(JSON.stringify({ type:'comment', text: input.value, name:'Viewer', role:'viewer' }));
  input.value = '';
}

// Initial load
searchVideos();
