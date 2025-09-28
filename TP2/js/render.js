
/********************************************* app ***********************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  startApp();
});

async function startApp() {
  // marcamos como no listo antes de empezar
  window.APP_READY = false;

  try {
    const games = await getGames();
    await showHome(games);
    initSearch();
    // si todo ok:
    window.APP_READY = true;
  } catch (err) {
    console.error('Error al iniciar la app:', err);
    // APP_READY se queda en false
  }
}



/******************************************************************* Home *******************************************************************/

async function showHome(games) {
  const containerRender = document.querySelector('#home-container');
  containerRender.innerHTML = "";

  // HERO
  const heroSection = document.createElement('section');
  heroSection.id = 'hero-slider';
  containerRender.appendChild(heroSection);

  const heroCards = await filterByHeroCard(games);
  new HeroCarrousel('hero', heroCards);

  // CATEGORÍAS
  const categoriesHome = ['action','rpg','shooter','arcade','indie','adventure'];

  for (let i = 0; i < categoriesHome.length; i++) {
    const category = categoriesHome[i];

    // 1) creo la sección vacía para el carrusel
    const section = document.createElement('section');
    section.id = `${category}-slider`;
    containerRender.appendChild(section);

    // 2) traigo juegos y renderizo el carrusel
    const gamesByCategory = await filterBy(category, games);
    new CommonCarrousel(category, gamesByCategory);

    // 3) intercalo extras en posiciones fijas
    if (i === 1) {
      // después de 2 categorías
      containerRender.appendChild(renderSpecialOffers());
    } else if (i === 3) {
      // después de 4 categorías
      containerRender.appendChild(createComingSoonSection()); // tu "banner"
    }
  }
}


/******************************** Categorias ********************************/


async function renderMenuCategories() {
    let categories = await getCategories(); 
    let menuContainer = document.querySelector('#hamburguer-menu-list');

    //hardcode !!!!!!! para asignar un icon (malisimo)
    const iconsByCategory = {
        action: "assets/icons_perfil/perfil.png",
        rpg: "assets/icons_perfil/games.svg",
        shooter: "assets/icons_perfil/config.svg",
        arcade: "assets/icons_perfil/help.svg",
        indie: "",
        adventure:""        
    };

    categories.forEach(category => {
        // crear <li>
        let li = document.createElement("li");
        li.classList.add("menu-item");

        // crear <img>
        let img = document.createElement("img");
        img.classList.add("menu-icon");
        img.src = iconsByCategory[category] || "assets/icons_perfil/default.png";
        img.alt = category;

        // crear <a>
        let a = document.createElement("a");
        a.classList.add("menu-link");
        a.href = "#";
        a.textContent = category.charAt(0).toUpperCase() + category.slice(1);

        // armar estructura
        li.appendChild(img);
        li.appendChild(a);

        // meter al contenedor
        menuContainer.appendChild(li);
    });
}

/********************************************** Search ************************************************/

function renderSearch(filteredGames) {

    const containerRender = document.querySelector('#home-container');
    containerRender.innerHTML = "";

    if (!filteredGames || filteredGames.length === 0) {
        containerRender.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    filteredGames.forEach((game) => {

        const card = document.createElement("div");
        card.classList.add("game-card");

        /* el codigo de la card se renderiza aca! o se puede traer de otro archivo */

        card.innerHTML = `
            <img src="${game.background_image}" alt="${game.name}" class="game-img">
            <h3 class="game-title">${game.name}</h3>
            <p class="game-price">
                ${game.discountPrice && game.discountPrice < game.price
                        ? `<span class="old-price">$${game.price}</span> <span class="promo-price">$${game.discountPrice}</span>`
                        : `<span>$${game.price || "Gratis"}</span>`
                    }
            </p>
         `;

        containerRender.appendChild(card);
        containerRender.classList.add('search-results');
    });

}


/********************************************** Helpers Ofertas espciales y Comming Soon ************************************************/

function createComingSoonSection(src = 'assets/images_games/soulmask-titel01_6292744-3472156468.jpg', alt = 'Coming Soon Game') {
  // <section class="comingSoon-section">
  const section = document.createElement('section');
  section.className = 'comingSoon-section';

  // <div class="cardsComingSoon-container">
  const wrapper = document.createElement('div');
  wrapper.className = 'cardsComingSoon-container';
  section.appendChild(wrapper);

  // <img ...>
  const img = document.createElement('img');
  img.src = src;         // ruta relativa hardcodeada por default
  img.alt = alt;
  img.loading = 'lazy';  // mejora performance
  wrapper.appendChild(img);

  // <div class="coningSoon-label"><p>Próximamente</p></div>
  const label = document.createElement('div');
  label.className = 'coningSoon-label'; // mantiene tu clase tal cual la pasaste
  const p = document.createElement('p');
  p.textContent = 'Próximamente';
  label.appendChild(p);
  wrapper.appendChild(label);

  return section;
}

function renderOfferSpecialCard(offer) {
  var article = document.createElement('article');
  article.className = 'specialOffer-card';

  var imgWrap = document.createElement('div');
  imgWrap.className = 'img-specialOffer-card';
  article.appendChild(imgWrap);

  var img = document.createElement('img');
  img.src = offer.image;
  img.alt = offer.title;
  img.loading = 'lazy';
  imgWrap.appendChild(img);

  var label = document.createElement('div');
  label.className = 'specialOffer-label';
  imgWrap.appendChild(label);

  var rect = document.createElement('div');
  rect.className = 'rectangle-3';
  label.appendChild(rect);

  var priceBox = document.createElement('div');
  priceBox.className = 'price';
  rect.appendChild(priceBox);

  var oldSpan = document.createElement('span');
  oldSpan.className = 'specialOffer-old-price';
  oldSpan.textContent = 'U$D ' + offer.oldPrice.toFixed(2);
  priceBox.appendChild(oldSpan);

  var newSpan = document.createElement('span');
  newSpan.className = 'specialOffer-new-price';
  newSpan.textContent = 'U$D ' + offer.newPrice.toFixed(2);
  priceBox.appendChild(newSpan);

  var body = document.createElement('div');
  body.className = 'body-specialOffer-card';
  article.appendChild(body);

  var h3 = document.createElement('h3');
  h3.className = 'titulo-de-specialOffer-card';
  h3.textContent = offer.title;
  body.appendChild(h3);

  return article;
}

function renderSpecialOffers() {
  var OFFERS = [
    {
      title: 'Cyberpunk 2077 - Edición Base',
      image: 'assets/images_games/20603-kejora-teaser-4245805646.jpg',
      oldPrice: 59.99,
      newPrice: 45.99
    },
    {
      title: 'The Witcher 3: Wild Hunt',
      image: 'assets/images_games/Silent-Hill-f-Key-Art-2616265892.jpg',
      oldPrice: 20.99,
      newPrice: 15.99
    },
    {
      title: 'Elden Ring',
      image: 'assets/images_games/The+Witcher+2-557647869.jpeg',
      oldPrice: 70.99,
      newPrice: 60.99
    },
    {
      title: 'Hollow Knight: Silksong',
      image: 'assets/images_games/Ready-or-Not-Consoles_04-17-25-874354600.jpg',
      oldPrice: 35.00,
      newPrice: 30.00
    }
  ];

  var section = document.createElement('section');
  section.className = 'specialOffer-section';

  var header = document.createElement('header');
  header.className = 'carousel-header';
  section.appendChild(header);

  var h2 = document.createElement('h2');
  h2.className = 'carousel-title';
  h2.textContent = 'Ofertas';
  header.appendChild(h2);

  var grid = document.createElement('div');
  grid.className = 'cardsSpecialsOffer-container';
  section.appendChild(grid);

  for (var i = 0; i < OFFERS.length; i++) {
    grid.appendChild(renderOfferSpecialCard(OFFERS[i]));
  }

  return section;
}

