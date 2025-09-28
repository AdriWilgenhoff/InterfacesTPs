window.addEventListener('load', () => {
  showComments();
  showRandomGames(5);
});


async function showComments() {
  const comments = await getComments();
  const list = document.getElementById('comments-list-ul');

  list.textContent = '';
  const fragment = document.createDocumentFragment();
  
  comments.forEach(comment => {
    fragment.appendChild(renderCommentItem(comment));
  });
  
  list.appendChild(fragment);
}

function renderCommentItem(comment) {
  const li = document.createElement('li');
  li.className = 'comment-item';

  const img = document.createElement('img');
  img.className = 'avatar';
  img.src = comment.avatar;
  img.alt = `Avatar de ${comment.name}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const header = document.createElement('div');
  header.className = 'header';

  const name = document.createElement('strong');
  name.className = 'name';
  name.textContent = comment.name;

  const time = document.createElement('time');
  time.className = 'date';
  const date = new Date(comment.createdAt);
  time.setAttribute('datetime', date.toISOString());
  time.textContent = date.toLocaleDateString('es-AR');

  header.appendChild(name);
  header.appendChild(time);

  const text = document.createElement('p');
  text.className = 'text';
  text.textContent = comment.comment;

  bubble.appendChild(header);
  bubble.appendChild(text);
  
  li.appendChild(img);
  li.appendChild(bubble);

  return li;
}

async function postComment(commentData) {
  try {
    const response = await fetch(URL_COMMENTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error(`Error al publicar comentario, estado: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error publicando comentario:', error);
    return false;
  }
}

function sampleUnique(arr, n) {
  const a = arr.slice();
  const k = Math.min(n, a.length);
  
  for (let i = a.length - 1; i > a.length - 1 - k; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  
  return a.slice(-k);
}

async function getRandomGames(n) {
  const games = await getGames();
  return sampleUnique(games, n);
}

async function showRandomGames(n = 5) {
  const games = await getRandomGames(n);
  const element = document.getElementById('randomGames');

  element.innerHTML = games.map(game => `
    <li class="rec-card">
      <img class="rec-cover" src="${game.background_image}" alt="${game.name}">
      <div class="rec-body">
        <p class="rec-name">${game.name}</p>
        <p class="rec-genre">${game.genres.map(genre => genre.name).join(' · ')}</p>
        <button class="btn-play" type="button">Jugar</button>
      </div>
    </li>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // Comentarios
  const commentInput = document.querySelector('.comment-input');
  const commentButton = document.querySelector('.button-comentar');
  const userAvatar = document.querySelector('.comment-row .avatar')?.src;

  if (commentButton && commentInput) {
    commentButton.addEventListener('click', async () => {
      const commentText = commentInput.value.trim();

      if (!commentText) return;

      const newCommentData = {
        name: 'PepitoElPistolero',
        comment: commentText,
        avatar: userAvatar,
        createdAt: new Date().toISOString()
      };

      const success = await postComment(newCommentData);

      if (success) {
        commentInput.value = '';
        await showComments();
      }
    });
  }

  // Botones de like
  const heartButton = document.getElementById('like-button');
  const dedoButton = document.getElementById('like-button-dedo');

  if (heartButton) {
    heartButton.addEventListener('click', () => {
      heartButton.classList.toggle('like-activo');
    });
  }

  if (dedoButton) {
    dedoButton.addEventListener('click', () => {
      dedoButton.classList.toggle('like-activo-dedo');
    });
  }

  // Popup de compartir
  const shareButton = document.getElementById('share-button');
  const sharePopup = document.querySelector('.share-popup');

  if (shareButton && sharePopup) {
    shareButton.addEventListener('click', (event) => {
      event.stopPropagation();
      
      const isActive = sharePopup.classList.toggle('active');
      shareButton.classList.toggle('share-activo', isActive);
    });

    document.addEventListener('click', (event) => {
      if (sharePopup.classList.contains('active') && 
          !shareButton.contains(event.target) && 
          !sharePopup.contains(event.target)) {
        
        sharePopup.classList.remove('active');
        shareButton.classList.remove('share-activo');
      }
    });
  }
});