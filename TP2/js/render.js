
/********************************************* APP ***********************************************************************/

document.addEventListener('DOMContentLoaded', () => {
  startApp();
});

async function startApp() {

  window.APP_READY = false;

  try {
    const games = await getGames();
    await showHome(games);
    initSearch();
    window.APP_READY = true;
  } catch (err) {
    console.error('Error al iniciar la app:', err);
  }
}


/******************************************************************* HOME *******************************************************************/

async function showHome(games) {
  const containerRender = document.querySelector('#home-container');
  containerRender.innerHTML = "";


  const heroSection = document.createElement('section');
  heroSection.id = 'hero-slider';
  containerRender.appendChild(heroSection);

  const heroCards = await filterByHeroCard(games);
  new HeroCarrousel('hero', heroCards);


  const categoriesHome = ['action', 'rpg', 'shooter', 'arcade', 'indie', 'adventure'];

  for (let i = 0; i < categoriesHome.length; i++) {
    const category = categoriesHome[i];


    const section = document.createElement('section');
    section.classList.add('common-carrusel-padding');
    section.id = `${category}-slider`;
    containerRender.appendChild(section);


    const gamesByCategory = await filterBy(category, games);
    new CommonCarrousel(category, gamesByCategory);

    if (i === 1) {

      containerRender.appendChild(renderSpecialOffers());
    } else if (i === 3) {

      containerRender.appendChild(createComingSoonSection());
    }
  }
}

/********************************************** Search ************************************************/

async function renderSearch(filteredGames, searchTerm = '') {
  const containerRender = document.querySelector('#home-container');
  containerRender.innerHTML = "";
  containerRender.classList.remove('search-results');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  const searchSection = document.createElement('section');
  searchSection.className = 'search-results-section';

  /*Bradcrumbs*/
  const breadcrumbs = document.createElement('div');
  breadcrumbs.className = 'breadcrumbs';
  breadcrumbs.innerHTML = `
      <ol class="bc-list">
        <li class="bc-item"><a href="../index.html">Home</a></li>
        <li class="separator">›</li>
        <li class="bc-item current">${searchTerm}</li>
      </ol>
    `;

  searchSection.appendChild(breadcrumbs);


  const searchHeader = document.createElement('div');
  searchHeader.className = 'search-header';

  const searchTitle = document.createElement('h2');
  searchTitle.className = 'search-title';


  if (!filteredGames || filteredGames.length === 0) {
    searchTitle.textContent = searchTerm ? `Sin resultados para "${searchTerm}"` : 'No se encontraron resultados';
    searchHeader.appendChild(searchTitle);
    searchSection.appendChild(searchHeader);


    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'search-empty-message';

    const emptyIcon = document.createElement('div');
    emptyIcon.className = 'empty-icon';
    emptyIcon.innerHTML = `
          <div class="empty-content-wrapper">
            <div class="empty-images">
              <img class="empty-search-img" src="assets/img/emptystate.png" alt="">
              <img class="empty-search-logo" src="assets/logos_png/mainLogo.png" alt="">
            </div>
            <div class="empty-text">
            <p class="empty-text-1">Oops! Ningún juego por aquí...</p>
            <p class="empty-text-2">Pero tampoco bugs ;)</p>
          </div>
        `;

    const emptySuggestion = document.createElement('p');
    emptySuggestion.className = 'empty-suggestion';
    emptySuggestion.textContent = 'Descubrí mas juegos en nuestras categorías: ';

    emptyMessage.appendChild(emptyIcon);
    emptyMessage.appendChild(emptySuggestion);

    try {
      const categories = await getCategories();
      const categoriesContainer = document.createElement('div');
      categoriesContainer.className = 'categories-links-container';

      categories.forEach(category => {
        const categoryLink = document.createElement('button');
        categoryLink.className = 'category-link-btn';
        categoryLink.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryLink.onclick = async () => {
          const allGames = await getGames();
          const gamesByCategory = await filterBy(category, allGames);
          renderSearch(gamesByCategory, category);
        };
        categoriesContainer.appendChild(categoryLink);
      });

      emptyMessage.appendChild(categoriesContainer);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }



    searchSection.appendChild(emptyMessage);
    containerRender.appendChild(searchSection);
    return;
  }


  searchTitle.textContent = `${filteredGames.length} resultado${filteredGames.length !== 1 ? 's' : ''} ${searchTerm ? `para "${searchTerm}"` : ''}`;
  searchHeader.appendChild(searchTitle);



  searchSection.appendChild(searchHeader);


  const gridContainer = document.createElement('div');
  gridContainer.className = 'search-grid-container';

  filteredGames.forEach((game) => {
    const card = document.createElement("div");
    card.classList.add("game-card", "search-card");


    const isPromo = game.discountPrice && game.discountPrice < game.price;


    let priceHTML = '';
    if (game.isFree) {
      priceHTML = '<span class="price free">Gratis</span>';
    } else if (isPromo) {
      priceHTML = `
                <div class="price discount">
                    <span class="old-price">U$D ${game.price}</span>
                    <span class="new-price">U$D ${game.discountPrice}</span>
                </div>
            `;
    } else {
      priceHTML = `<span class="price common">U$D ${game.price || 'Gratis'}</span>`;
    }

    card.innerHTML = `
            <div class="image-container">
                <img src="${game.background_image}" alt="${game.name}" class="img-card">
                ${isPromo ? '<div class="offer-label"><p>-' + game.discountPercentage + '%</p></div>' : ''} 
            </div>
            <div class="body-card">
                <div class="title-card">
                    <p>${game.name}</p>
                </div>
                ${priceHTML}
            </div>
        `;

    gridContainer.appendChild(card);
  });

  searchSection.appendChild(gridContainer);
  containerRender.appendChild(searchSection);
}


/********************************************** Helpers Ofertas espciales y Comming Soon ************************************************/

function createComingSoonSection(src = 'assets/images_games/VoyagerOfNera.jpg', alt = 'Coming Soon Game') {

  const section = document.createElement('section');
  section.className = 'comingSoon-section';


  const wrapper = document.createElement('div');
  wrapper.className = 'cardsComingSoon-container';
  section.appendChild(wrapper);


  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  wrapper.appendChild(img);


  const label = document.createElement('div');
  label.className = 'coningSoon-label';
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
  priceBox.className = 'specialOfferPrice';
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
      title: 'Kejora',
      image: 'assets/images_games/Kejora.jpg',
      oldPrice: 59.99,
      newPrice: 45.99
    },
    {
      title: 'Silent Hill F',
      image: 'assets/images_games/SilentHillF.jpg',
      oldPrice: 20.99,
      newPrice: 15.99
    },
    {
      title: 'The Witcher 2: Assassins of Kings',
      image: 'assets/images_games/TheWitcher.jpeg',
      oldPrice: 70.99,
      newPrice: 60.99
    },
    {
      title: 'Ready or Not',
      image: 'assets/images_games/ReadyOrNot.jpg',
      oldPrice: 35.00,
      newPrice: 30.00
    }
  ];

  var section = document.createElement('section');
  section.className = 'specialOffer-section';

  var header = document.createElement('header');
  header.className = 'carousel-header-oferta';
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

