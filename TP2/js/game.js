
window.addEventListener('load', () => {
  //showGames();
  showComments();
  showRandomGames(5);
});

const URL_GAMES = 'https://vj.interfaces.jima.com.ar/api';
const URL_PRICES = './js/prices.json';
const URL_COMMENTS = 'https://68ccc70eda4697a7f3038624.mockapi.io/comments';



async function getGames() {

  try {

    const responseGamesData = await fetch(URL_GAMES);
    const gamesData = await responseGamesData.json();

    const responsePrices = await fetch(URL_PRICES);
    const prices = await responsePrices.json();


    // prices es diccionario

    let gamesWithPrices = [];

    gamesData.forEach(game => {

      const product = { ...game, ...prices[game.id] };

      gamesWithPrices.push(product);
    });

    return gamesWithPrices;

  } catch (error) {
    console.error('Error:', error);
  }

}


async function filterBy(category) {

  let games = await getGames();

  let gamesFiltered = games.filter(game =>
    game.genres.find(genres => genres.name == category));

  console.log(gamesFiltered);

  return gamesFiltered;
}

let category = 'RPG'
console.log(filterBy(category));


async function showGames() {

  let games = await getGames();

  let ejemplo = document.querySelector('#divData');

  let reemplazoEjemplo = '';

  games.forEach(game => {

    reemplazoEjemplo += `
           <li>                
                <p>${game.id}</p>
                <p>${game.name}</p>
                <p>${game.discountPrice}</p>
                <p>${game.price}</p>
                <p>Gratis? ${game.isFree}</p>
                <p> - </p>

            </li>
    `

  });

  ejemplo.innerHTML = reemplazoEjemplo;

}

// **************** GET COMMENTS **************** 


async function getComments() {

  try {

    const responseComments = await fetch(URL_COMMENTS);
    const comments = await responseComments.json();

    return comments;

  } catch (error) {
    console.log('error:', error);
  }
}

async function showComments() {
  const comments = await getComments();
  const list = document.getElementById('comments-list-ul');

  list.textContent = '';
  const frag = document.createDocumentFragment();
  for (const c of comments)
    frag.appendChild(renderCommentItem(c));
  list.appendChild(frag);
}


function renderCommentItem(c) {
  var li = document.createElement('li');
  li.className = 'comment-item';

  var img = document.createElement('img');
  img.className = 'avatar';
  img.src = c.avatar;
  img.alt = 'Avatar de ' + c.name;

  var bubble = document.createElement('div');
  bubble.className = 'bubble';

  var header = document.createElement('div');
  header.className = 'header';

  var name = document.createElement('strong');
  name.className = 'name';
  name.textContent = c.name;

  var time = document.createElement('time');
  time.className = 'date';
  var d = new Date(c.createdAt);
  time.setAttribute('datetime', d.toISOString());
  time.textContent = d.toLocaleDateString('es-AR');

  header.appendChild(name);
  header.appendChild(time);

  var text = document.createElement('p');
  text.className = 'text';
  text.textContent = c.comment;

  bubble.appendChild(header);
  bubble.appendChild(text);
  li.appendChild(img);
  li.appendChild(bubble);

  return li;
}

// **************** GET RECOMMEND GAMES ****************

// Toma n elementos únicos al azar
function sampleUnique(arr, n) {
  var a = arr.slice();
  var k = Math.min(n, a.length);
  for (var i = a.length - 1; i > a.length - 1 - k; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a.slice(-k);
}

// Random de todo el catálogo
async function getRandomGames(n) {
  var games = await getGames();
  return sampleUnique(games, n);
}

// Render (sin IDs ni data-attrs; botón solo para hover)
async function showRandomGames(n) {
  n = n || 5;
  var games = await getRandomGames(n);
  var el = document.getElementById('randomGames');

  el.innerHTML = games.map(function (g) {
    return '' +
      '<li class="rec-card">' +
        '<img class="rec-cover" src="' + g.background_image + '" alt="' + g.name + '">' +
        '<div class="rec-body">' +
          '<p class="rec-name">' + g.name + '</p>' +
          '<p class="rec-genre">' + g.genres.map(function(x){ return x.name; }).join(' · ') + '</p>' +
          '<button class="btn-play" type="button">Jugar</button>' +
        '</div>' +
      '</li>';
  }).join('');
}

