const API_SERVER = 'http://127.0.0.1:3000'; // change to your Termux server IP if needed


function renderResults(items){
results.innerHTML = '';
items.forEach(it => {
const card = document.createElement('div'); card.className='card';
const thumb = document.createElement('div'); thumb.className='thumb';
const img = document.createElement('img'); img.src = it.thumbnail; img.alt=''; img.style.width='100%'; img.style.height='100%'; img.style.objectFit='cover'; img.style.borderRadius='6px';
thumb.appendChild(img);
const t = document.createElement('div'); t.className='title'; t.innerText = it.title;
const m = document.createElement('div'); m.className='meta'; m.innerText = it.channel;
card.appendChild(thumb); card.appendChild(t); card.appendChild(m);
card.onclick = ()=> loadVideo(it);
results.appendChild(card);
})
}


function loadVideo(video){
playerArea.innerHTML = `<iframe width="100%" height="240" src="https://www.youtube.com/embed/${video.id}?rel=0" frameborder="0" allowfullscreen></iframe>`;
if(ws && ws.readyState===WebSocket.OPEN){
ws.send(JSON.stringify({type:'join', videoId:video.id, role:roleSelect.value}));
}
}


searchBtn.onclick = async ()=>{
const q = qEl.value.trim(); if(!q) return;
const data = await searchYouTube(q);
renderResults(data.items || []);
}


function initWS(){
try{
ws = new WebSocket('ws://127.0.0.1:3000');
}catch(e){ console.warn('WS failed', e); return; }
ws.onmessage = evt=>{
try{const msg = JSON.parse(evt.data);
if(msg.type==='comment') addComment(msg);
}catch(e){ }
}
}


function addComment(c){
const d = document.createElement('div'); d.className='comment';
d.innerHTML = `<strong>${escapeHtml(c.name)} (${escapeHtml(c.role)})</strong><div>${escapeHtml(c.text)}</div>`;
commentsList.appendChild(d); commentsList.scrollTop = commentsList.scrollHeight;
}


sendComment.onclick = ()=>{
const text = commentInput.value.trim(); if(!text || !ws || ws.readyState!==WebSocket.OPEN) return;
const payload = {type:'comment', text, name:'Anonymous', role: roleSelect.value};
ws.send(JSON.stringify(payload));
commentInput.value='';
}


function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[c])}


initWS();
