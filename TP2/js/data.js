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

async function showHome() {
  try {
    console.log('Iniciando showHome...');
    
    // Obtener los datos
    const games = await getGames();
    console.log('Games obtenidos:', games.length);
    
    if (games.length === 0) {
      console.error('No se pudieron cargar los juegos');
      return;
    }

    // Verificar que el elemento existe
    let divHero = document.querySelector('#rpg-slider');
    if (!divHero) {
      console.error('No se encontró el elemento #rpg-slider');
      return;
    }

    console.log('Elemento encontrado, creando carrusel...');
    
    // Crear el carrusel hero
    const heroCarrousel = new Carrousel("rpg", games, true);
    
  } catch (error) {
    console.error('Error en showHome:', error);
  }
}

/* Clase Carrousel corregida */
class Carrousel {
  constructor(category, arrayGames, isHero) {
    this.category = category;
    this.arrayGames = arrayGames;
    this.globalIndex = 0;
    this.isHero = isHero;
    
    
    //renderizar con el ID-correcto en HOME
    this.DOMElement = document.querySelector(`#${category}-slider`);
    
    if (!this.DOMElement) {
      console.error(`No se encontró el elemento #${category}-slider`);
      return;
    }

    console.log(`Carrusel creado para: ${category}, Hero: ${isHero}, Juegos: ${arrayGames.length}`);
    this.renderCarrousel();
  }

  renderCarrousel() {
    if (this.isHero) {
      this.renderHero();
    } else {
      this.renderCommon();
    }
  }

  renderHero() {
    if (this.arrayGames.length < 3) {
      console.error("No hay suficientes juegos para renderizar el hero");
      return;
    }

    this.globalIndex = 1;

    // Crear la estructura HTML del hero
    this.DOMElement.innerHTML = `
      <div id="heroCardPrevious" class="hero-button-container"></div>
      <div id="heroCardMain" class="hero-main-container"></div>
      <div id="heroCardNext" class="hero-button-container"></div>
    `;

    // Renderizar el contenido inicial
    this.updateHeroDisplay();
  }

  updateHeroDisplay() {
    let prevIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
    let nextIndex = (this.globalIndex + 1) % this.arrayGames.length;

    // Obtener los elementos después de crearlos
    let previousSlide = document.querySelector('#heroCardPrevious');
    let principalSlide = document.querySelector('#heroCardMain');
    let nextSlide = document.querySelector('#heroCardNext');

    if (previousSlide && principalSlide && nextSlide) {
      this.renderButtons(this.arrayGames[prevIndex], previousSlide, "previous");
      this.renderButtons(this.arrayGames[nextIndex], nextSlide, "next");
      this.renderCard(this.arrayGames[this.globalIndex], principalSlide);
    }
  }

  renderButtons(game, DOMElement, type) {

    if (this.isHero) {
      DOMElement.innerHTML = `//previous-hero next-hero
        <div class="side-card ${type}-hero" style="cursor: pointer;"> 
          <img src="${game.background_image}" alt="${game.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
      `;

      // CORRECCIÓN: Limpiar eventos anteriores y agregar nuevo
      DOMElement.replaceWith(DOMElement.cloneNode(true));
      DOMElement = document.querySelector(`#heroCard${type === "previous" ? "Previous" : "Next"}`);
      //reemplace por addeventListener;
      DOMElement.addEventListener('click', () => {
        console.log(`Click en botón ${type}`);
        if (type === "previous") {
          this.globalIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
        } else {
          this.globalIndex = (this.globalIndex + 1) % this.arrayGames.length;
        }
        this.updateHeroDisplay();
      });

    } else {
      DOMElement.innerHTML = `
        <button class="carousel-btn ${type}-common">
          ${type === "previous" ? "‹" : "›"}
        </button>
      `;
      //addeventListener
      DOMElement.addEventListener('click', () => {
        if (type === "previous") {
          this.globalIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
        } else {
          this.globalIndex = (this.globalIndex + 1) % this.arrayGames.length;
        }
        this.renderCommon();
      });
    }
  }

  renderCard(game, DOMElement) {
    if (this.isHero) {
      DOMElement.innerHTML = `
        <div class="mainCardHero" style="text-align: center;">
          <img src="${game.background_image}" alt="${game.name} ">
          <h3 class="titleHeroCard">${game.name}</h3>          
        </div>
      `;
    } else {
      // Calcular precios y estados antes de crear el HTML
      const gamePromo = this.isPromo(game);
      let priceHTML = '';
      let buttonClass = '';
      let buttonText = '';

      if (!gamePromo) {
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

      DOMElement.innerHTML = `
        <div class="game-card">
          <img src="${game.background_image}" alt="${game.name}" class="card-img" style="width: 100%; height: 200px; object-fit: cover;">
          <div class="card-body">
            <h3 class="card-title">${game.name}</h3>
            <div style="display:flex; justify-content: space-between; align-items: center;"> 
              <div class="price-container">${priceHTML}</div>
              <button class="btn buy ${buttonClass}">${buttonText}</button>
            </div>
          </div>
        </div>
      `;
    }
  }

  isPromo(game) {
    return game.discountPrice !== 0 && game.discountPrice < game.price;
  }

  renderCommon() {
    console.log("Implementando render común...");
    
    if (this.arrayGames.length === 0) {
      this.DOMElement.innerHTML = '<p>No hay juegos disponibles</p>';
      return;
    }

    // Estructura básica para carrusel común
    this.DOMElement.innerHTML = `
      <div class="common-carousel-container" style="display: flex; align-items: center; gap: 20px;">
        <button class="carousel-btn previous-common" style="padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">‹</button>
        <div class="carousel-content" style="flex: 1;"></div>
        <button class="carousel-btn next-common" style="padding: 10px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">›</button>
      </div>
    `;

    // Configurar botones
    const prevBtn = this.DOMElement.querySelector('.previous-common');
    const nextBtn = this.DOMElement.querySelector('.next-common');
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        this.globalIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
        this.updateCommonDisplay();
      });

      nextBtn.addEventListener('click', () => {
        this.globalIndex = (this.globalIndex + 1) % this.arrayGames.length;
        this.updateCommonDisplay();
      });
    }

    this.updateCommonDisplay();
  }

  updateCommonDisplay() {
    const contentDiv = this.DOMElement.querySelector('.carousel-content');
    if (contentDiv) {
      this.renderCard(this.arrayGames[this.globalIndex], contentDiv);
    }
  }
}
