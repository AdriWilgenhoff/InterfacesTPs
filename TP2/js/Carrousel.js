

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
  renderCarrousel() { }
  updateDisplay() { }
  renderCard(game, DOMElement) { }
}

/* class HeroCarrousel extends BaseCarrousel {
  
  constructor(category, arrayGames) {
    super(category, arrayGames)
    this.globalIndex = 2; 
    this.DOMElement.classList.add('hero'); 
    this.renderCarrousel();
  }

  renderCarrousel() {
    console.log(this.arrayGames)
    if (this.arrayGames.length < 5) {
      console.error("No hay suficientes juegos para renderizar el hero");
      return;
    }

    this.DOMElement.innerHTML = `
      <div id="heroCardMoreElementsLeft" class="hero-content previous-hero"></div>
      <div id="heroCardPrevious" class="hero-button-container"></div>
      <div id="heroCardMain" class="hero-main-container"></div>
      <div id="heroCardNext" class="hero-button-container"></div>      
      <div id="heroCardMoreElementsRight" class="hero-content next-hero"></div>
    `;
    this.updateDisplay();
    
  }

updateDisplay() {
  // índices relativos
  let prev2Index = (this.globalIndex - 2 + this.arrayGames.length) % this.arrayGames.length;
  let prev1Index = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
  let next1Index = (this.globalIndex + 1) % this.arrayGames.length;
  let next2Index = (this.globalIndex + 2) % this.arrayGames.length;

  // render principal
  this.renderCard(this.arrayGames[this.globalIndex], document.querySelector('#heroCardMain'));

  // render secundarios
  this.renderButtons(this.arrayGames[prev2Index], "#heroCardMoreElementsLeft", "previous");
  this.renderButtons(this.arrayGames[prev1Index], "#heroCardPrevious", "previous");
  this.renderButtons(this.arrayGames[next1Index], "#heroCardNext", "next");
  this.renderButtons(this.arrayGames[next2Index], "#heroCardMoreElementsRight", "next");
}

  renderButtons(game, selector, type) {

    let DOMElement = document.querySelector(selector);
    console.log("elemento tomado");
    console.log(game); 

    DOMElement.innerHTML = `
      <div class="side-card ${type}-hero" style="cursor: pointer;"> 
        <img src="${game.background_image}" alt="${game.name}">
      </div>
    `;

    DOMElement.onclick = () => type === "previous" ? this.prev() : this.next();
  }

  renderCard(game, DOMElement) {
    DOMElement.innerHTML = `
      <div class="mainCardHero">
        <img src="${game.background_image}" alt="${game.name}">
        <h3 class="titleHeroCard">${game.name}</h3>          
      </div>
    `;
  }
} */
class HeroCarrousel extends BaseCarrousel {
  constructor(category, arrayGames) {
    super(category, arrayGames);
    this.currentIndex = 0;
    this.autoPlayInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;

    // Verificar que tenemos suficientes juegos
    if (this.arrayGames.length < 3) {
      console.error("Se necesitan al menos 3 juegos para la galería hero");
      return;
    }

    this.DOMElement.classList.add('hero-gallery');
    this.renderCarrousel();
    this.setupEventListeners();
    this.startAutoPlay();
  }
  /* renderCarrousel() {
      console.log(this.arrayGames)
      if (this.arrayGames.length < 5) {
        console.error("No hay suficientes juegos para renderizar el hero");
        return;
      }
  
      this.DOMElement.innerHTML = `
        <div id="heroCardMoreElementsLeft" class="hero-content previous-hero"></div>
        <div id="heroCardPrevious" class="hero-button-container"></div>
        <div id="heroCardMain" class="hero-main-container"></div>
        <div id="heroCardNext" class="hero-button-container"></div>      
        <div id="heroCardMoreElementsRight" class="hero-content next-hero"></div>
      `;
      this.updateDisplay();
      
    } */
  renderCarrousel() {
    this.DOMElement.innerHTML = `
            
            <div class="hero-conteiner" id="hero-container"></div>
            <div class="gallery-nav" id="gallery-nav-${this.category}"></div>  

        `;

    this.container = this.DOMElement.querySelector('#hero-container');
    this.navContainer = this.DOMElement.querySelector(`#gallery-nav-${this.category}`);

    this.renderSlides();
    this.renderNavigation();
    this.updateDisplay();
  }

  renderSlides() {
    this.container.innerHTML = '';

    this.arrayGames.forEach((game, index) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.dataset.index = index;

      slide.innerHTML = `
                <img src="${game.background_image}" alt="${game.name}" loading="lazy">
                <div class="slide-overlay">
                    <h2 class="slide-title">${game.name}</h2>
                </div>
            `;
      // Event listener para click en slide
      slide.addEventListener('click', (e) => {
        if (e.target.closest('.slide-actions')) return; // No cambiar slide si se hace click en botones
        this.goToSlide(index);
      });

      this.container.appendChild(slide);
    });
  }




  renderNavigation() {
    this.navContainer.innerHTML = '';

    this.arrayGames.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = 'nav-dot';
      dot.dataset.index = index;
      this.navContainer.appendChild(dot);
    });
  }

  setupEventListeners() {

    // Navigation dots
    this.navContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-dot')) {
        const index = parseInt(e.target.dataset.index);
        this.goToSlide(index);
      }
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Pausar autoplay al hacer hover
    this.DOMElement.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.DOMElement.addEventListener('mouseleave', () => this.startAutoPlay());

    // Touch/Swipe support para móviles
    this.DOMElement.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    });

    this.DOMElement.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      if (this.touchStartX - this.touchEndX > 50) this.next();
      if (this.touchEndX - this.touchStartX > 50) this.prev();
    });
  }

  updateDisplay() {
    const slides = this.DOMElement.querySelectorAll('.gallery-slide');
    const dots = this.DOMElement.querySelectorAll('.nav-dot');

    slides.forEach((slide, index) => {
      slide.className = 'gallery-slide';

      const diff = index - this.currentIndex;
      const totalSlides = this.arrayGames.length;

      if (diff === 0) {
        slide.classList.add('active');
      } else if (diff === 1 || diff === -(totalSlides - 1)) {
        slide.classList.add('next');
      } else if (diff === -1 || diff === totalSlides - 1) {
        slide.classList.add('prev');
      } else if (diff > 1 || diff < -1) {
        if (diff > 0 || diff === -(totalSlides - 2)) {
          slide.classList.add('far-next');
        } else {
          slide.classList.add('far-prev');
        }
      }
    });

    // Actualizar navigation dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });


  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateDisplay();
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }



 
}

/*********************************************************CARRUSEL COMUNNN ***********************************************/

class CommonCarrousel extends BaseCarrousel {

    constructor(category, arrayGames, cardsVisible = arrayGames.length) {

        super(category, arrayGames);
        this.cardsVisible = cardsVisible;
        this.renderCarrousel();

        // recalcular cards visibles al redimensionar
        window.addEventListener('resize', () => this.updateDisplay());
    }

    renderCarrousel() {
        this.DOMElement.innerHTML = `
      <div class="" style="display:flex, flex-direction:column; gap:10px;">
       <div class="carousel-header" >
       <div class="carousel-title" >${this.category}</div>
        <div>Ver Todos ></div>
        </div>        
        <div class="common-carousel-container" style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
          <button class="carousel-btn prev" style="padding: 0.5rem;">‹</button>
          <div class="carousel-content" style="display:flex; gap:10px;"></div>
          <button class="carousel-btn next" style="padding: 0.5rem;">›</button>
        </div>
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



    renderCard(game, container, append = false) {

        const promo = this.isPromo ? this.isPromo(game) : false;
        let priceHTML = '';

        if (!promo) {
            if (game.isFree) {
                priceHTML = `<div class="precioComun">Gratis</div>`;

            } else {
                priceHTML = `<div class="precioComun">U$D ${game.price}</div>`;
            }

        } else {
            priceHTML = `
      <div class="precioDescuento">
        <div class="precioTachado">U$D ${game.price}</div>
        <div class="precioComun">U$D ${game.discountPrice}</div>
      </div>
    `;
        }

        const cardHTML = document.createElement('div');
        cardHTML.classList.add('game-card');
        cardHTML.innerHTML = `
            <img src="${game.background_image}" alt="${game.name}" class="card-img">
            <div class="card-body">
            <h3 class="card-title">${game.name}</h3>
            <div class="card-footer">
                <div class="price-container">${priceHTML}</div>        
            </div>
            </div>
  `;

        if (append) {
            container.appendChild(cardHTML);
        } else {
            container.innerHTML = cardHTML.outerHTML;
        }
    }


}
