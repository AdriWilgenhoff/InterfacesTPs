
const URL_GAMES = 'https://vj.interfaces.jima.com.ar/api/v2';
const URL_PRICES = window.location.pathname.includes('html/') ? '../js/prices.json' : './js/prices.json';
const URL_COMMENTS = 'https://68ccc70eda4697a7f3038624.mockapi.io/comments';


async function getGames() {
  try {
    const responseGamesData = await fetch(URL_GAMES);
    const gamesData = await responseGamesData.json();

    const responsePrices = await fetch(URL_PRICES);
    const prices = await responsePrices.json();

    let gamesWithPrices = [];

    gamesData.forEach(game => {
      const product = { ...game, ...prices[game.id] };
      gamesWithPrices.push(product);
    });

    gamesData
    return gamesWithPrices;

  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function getComments() {
  try {
    const responseComments = await fetch(URL_COMMENTS);
    const comments = await responseComments.json();
    return comments;
  } catch (error) {
    console.log('error:', error);
    return [];
  }
}

async function getCategories() {
  let categories = [];

  const games = await getGames();

  games.forEach(game => {
    if (game.category) {
      const categoryName = game.category.toLowerCase();
      if (!categories.includes(categoryName)) {
        categories.push(categoryName);
      }
    }
  });

  return categories;
}

async function getPromos() {
  const games = await getGames();
  let promos = [];

  games.forEach(game => {
    if (isPromo(game)) {
      promos.push(game);
    }
  });

  return promos;
}

/******************************************** Filtros ******************************************************/

async function filterBy(text, games) {
  let input = text.toLowerCase();
  let gamesFiltered = [];

  if (await isCategory(input)) {
    gamesFiltered = games.filter(game =>
      game.category.toLowerCase() == input);
  } else {
    gamesFiltered = games.filter(game => game.name.toLowerCase().includes(input));
  }
  return gamesFiltered;
}
function filterByFree(games) {
  let gamesFiltered = games.filter(game => game.isFree == true);
  return gamesFiltered;
}

function filterByHeroCard(games) {
  let gamesFiltered = games.filter(game => game.isHeroCard == true);

  juegoNuestroPeg = {
    id: 6660,
    name: "Peg Debugging",
    released: "2013-09-17",
    url: "html/game.html",
    background_image: "assets/img/peg/pegDebugger.png",
    isFree: false,
    price: 49.99,
    discountPrice: 49.99,
    discountPercentage: 0,
    isHeroCard: false,
    category: "adventure"
  }

  juegoNuestroBlocka = {
    id: 6666,
    name: "Blocka",
    released: "2025-09-17",
    url: "html/blocka.html",
    background_image: "assets/img/blocka/blocka.png",
    isFree: false,
    price: 49.99,
    discountPrice: 49.99,
    discountPercentage: 0,
    isHeroCard: false,
    category: "adventure"
  }

  gamesFiltered = [...gamesFiltered, juegoNuestroPeg]
  gamesFiltered = [...gamesFiltered, juegoNuestroBlocka]

  return gamesFiltered;
}


/***************************** HELPERS **************************************/

async function isCategory(text) {
  let categories = await getCategories();
  let category = text.toLowerCase();
  return categories.includes(category);
}

function isPromo(game) {
  let price = game.price;
  let discountPrice = game.discountPrice;
  return discountPrice != 0 && discountPrice < price;
}