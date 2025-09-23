window.addEventListener('load', showHome);

const URL_GAMES = 'https://vj.interfaces.jima.com.ar/api';
const URL_PRICES = window.location.pathname.includes('html/') ? '../js/prices.json' : './js/prices.json';
const URL_COMMENTS = 'https://68ccc70eda4697a7f3038624.mockapi.io/comments';

/* # data */

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

    //game withPrices.add(juegoNuestro);

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
    if (game.genres) { // verificacion si existe para que no rompa
      game.genres.forEach(genre => {
        const genreName = genre.name.toLowerCase();
        if (!categories.includes(genreName)) {
          categories.push(genreName);
        }
      });
    }
  });
  console.log(categories);
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

/* # controller */
/* ## filtros */

async function filterBy(text, games) {
  let input = text.toLowerCase();
  let gamesFiltered = [];

  if (await isCategory(input)) {
    gamesFiltered = games.filter(game => 
      game.genres.find(genre => genre.name.toLowerCase() == input)
    );
  } else { // busca por nombre
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
  return gamesFiltered;
}

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

/* # vistas */

async function showGames(nameOrCategory) {
  let games = await getGames();
  let ejemplo = document.querySelector('#divData');
  
  if (!ejemplo) {
    console.error('No se encontró el elemento #divData');
    return;
  }

  let reemplazoEjemplo = '';
  let gamesFiltered = await filterBy('rpg', games);

  console.log(gamesFiltered);

  gamesFiltered.forEach(game => {
    reemplazoEjemplo += `
      <li>                
        <p>${game.id}</p>
        <p>${game.name}</p>
        <p>${game.discountPrice}</p>
        <p>${game.price}</p>
        <p>Gratis? ${game.isFree}</p>
        <p> - </p>
      </li>
    `;
  });

  ejemplo.innerHTML = reemplazoEjemplo;
}



class BaseCarrousel {

  constructor(category, arrayGames) {
    this.category = category;
    this.arrayGames = arrayGames;
    this.globalIndex = 0;
    this.DOMElement = document.querySelector(`#${category}-slider`);
    
    if (!this.DOMElement) {
      console.error(`No se encontró el elemento #${category}-slider`);
      return;
    }
  }

  next() {
    this.globalIndex = (this.globalIndex + 1) % this.arrayGames.length;
    this.updateDisplay();
  }

  prev() {
    this.globalIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
    this.updateDisplay();
  }

  isPromo(game) {
    return game.discountPrice !== 0 && game.discountPrice < game.price;
  }

  // Cada clase hija define estos metodos
  renderCarrousel() {}
  updateDisplay() {}
  renderCard(game, DOMElement) {}
}

class HeroCarrousel extends BaseCarrousel {
  constructor(category, arrayGames) {
    super(category, arrayGames)
    this.globalIndex = 1; // arranca en indice 1 para asegurarme que tengo un elemento para mostrar en el previo; 
    this.renderCarrousel();
  }

  renderCarrousel() {
    if (this.arrayGames.length < 3) {
      console.error("No hay suficientes juegos para renderizar el hero");
      return;
    }

    this.DOMElement.innerHTML = `
      <div id="heroCardPrevious" class="hero-button-container"></div>
      <div id="heroCardMain" class="hero-main-container"></div>
      <div id="heroCardNext" class="hero-button-container"></div>
    `;
    this.updateDisplay();
  }

  updateDisplay() {
    let prevIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
    let nextIndex = (this.globalIndex + 1) % this.arrayGames.length;

    this.renderButtons(this.arrayGames[prevIndex], "#heroCardPrevious", "previous");
    this.renderButtons(this.arrayGames[nextIndex], "#heroCardNext", "next");
    this.renderCard(this.arrayGames[this.globalIndex], document.querySelector('#heroCardMain'));
  }

  renderButtons(game, selector, type) {
    let container = document.querySelector(selector);
    container.innerHTML = `
      <div class="side-card ${type}-hero" style="cursor: pointer;"> 
        <img src="${game.background_image}" alt="${game.name}">
      </div>
    `;
    container.onclick = () => type === "previous" ? this.prev() : this.next();
  }

  renderCard(game, DOMElement) {
    DOMElement.innerHTML = `
      <div class="mainCardHero">
        <img src="${game.background_image}" alt="${game.name}">
        <h3 class="titleHeroCard">${game.name}</h3>          
      </div>
    `;
  }
}

class CommonCarrousel extends BaseCarrousel {
  constructor(category, arrayGames, cardsVisible = 3) {
    super(category, arrayGames);
    this.cardsVisible = cardsVisible;
    this.renderCarrousel();

    // recalcular cards visibles al redimensionar
    window.addEventListener('resize', () => this.updateDisplay());
  }

  renderCarrousel() {
    this.DOMElement.innerHTML = `
      <div class="common-carousel-container" style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
        <button class="carousel-btn prev" style="padding: 0.5rem;">‹</button>
        <div class="carousel-content" style="display:flex; gap:10px;"></div>
        <button class="carousel-btn next" style="padding: 0.5rem;">›</button>
      </div>
    `;

    // botones
    const prevBtn = this.DOMElement.querySelector('.prev');
    const nextBtn = this.DOMElement.querySelector('.next');

    prevBtn.onclick = () => this.prev();
    nextBtn.onclick = () => this.next();

    this.updateDisplay();
  }

  getCardsVisible() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    return this.cardsVisible; // default
  }

  updateDisplay() {
    const contentDiv = this.DOMElement.querySelector('.carousel-content');
    contentDiv.innerHTML = ''; // limpiar

    const visible = this.getCardsVisible();

    for (let i = 0; i < visible; i++) {
      let index = (this.globalIndex + i) % this.arrayGames.length;
      this.renderCard(this.arrayGames[index], contentDiv, true);
    }
  }

  next() {
    this.globalIndex = (this.globalIndex + 1) % this.arrayGames.length;
    this.updateDisplay();
  }

  prev() {
    this.globalIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
    this.updateDisplay();
  }

  renderCard(game, container, append = false) {
    const promo = this.isPromo(game);
    let priceHTML = '';
    let buttonClass = '';
    let buttonText = '';

    if (!promo) {
      if (game.isFree) {
        priceHTML = `<div class="precioComun">Gratis</div>`;
        buttonClass = "buttonFree";
        buttonText = "Jugar";
      } else {
        priceHTML = `<div class="precioComun">$${game.price}</div>`;
        buttonClass = "buttonBuy";
        buttonText = "Comprar";
      }
    } else {
      priceHTML = `
        <div class="precioDescuento">
          <div class="precioTachado">$${game.price}</div>
          <div class="precioComun">$${game.discountPrice}</div>
        </div>
      `;
      buttonClass = "buttonBuy";
      buttonText = "Comprar";
    }

    const cardHTML = document.createElement('div');
    cardHTML.classList.add('game-card');
    cardHTML.innerHTML = `
      <img src="${game.background_image}" alt="${game.name}" class="card-img">
      <div class="card-body">
        <h3 class="card-title">${game.name}</h3>
        <div style="display:flex; justify-content: space-between; align-items: center;"> 
          <div class="price-container">${priceHTML}</div>
          <button class="btn buy ${buttonClass}">${buttonText}</button>
        </div>
      </div>
    `;

    if (append) container.appendChild(cardHTML);
    else container.innerHTML = cardHTML.outerHTML;
  }
}

async function showHome() {

  const games = await getGames();

  const heroCards = await filterByHeroCard(games);
  
  const categoriesHome = ['rpg','shooter','platformer','arcade'];

  const container = document.querySelector('#carruselesHome');
  
  // Limpiar el contenedor
  container.innerHTML = '';

  // Hero principal
  new HeroCarrousel("hero", heroCards);

  // Crear secciones dinámicas para cada categoría y añadir carrusel
  for (const category of categoriesHome) {
    // Crear la sección para el carrusel
    const section = document.createElement('section');
    section.id = `${category}-slider`; // Ej: "shooter-slider"
    container.appendChild(section);

    // Filtrar juegos por categoría
    const gamesByCategory = await filterBy(category, games);

    // Crear carrusel común dentro de la sección
    new CommonCarrousel(category, gamesByCategory);
  }
}
