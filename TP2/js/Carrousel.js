

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

/**************************** HERO CARRUSEL *************************/
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

    this.navContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-dot')) {
        const index = parseInt(e.target.dataset.index);
        this.goToSlide(index);
      }
    });

    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    
    this.DOMElement.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.DOMElement.addEventListener('mouseleave', () => this.startAutoPlay());

    
    this.DOMElement.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.stopAutoPlay(); // Detener autoplay al tocar en móvil
    });

    this.DOMElement.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      if (this.touchStartX - this.touchEndX > 50) this.next();
      if (this.touchEndX - this.touchStartX > 50) this.prev();
      this.startAutoPlay(); // Reiniciar autoplay después del swipe
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

  constructor(category, arrayGames) {
    super(category, arrayGames);
    
    // ✅ DETECCIÓN DINÁMICA DEL VIEWPORT
    this.isDesktop = window.innerWidth >= 1440;
    
    // ✅ VALORES RESPONSIVOS BASADOS EN EL TAMAÑO DE PANTALLA
    if (this.isDesktop) {
      this.cardWidth = 192.5;
      this.gap = 10;
      this.viewportWidth = 1205;
    } else {
      // Valores móvil - scroll nativo, sin necesidad de cálculos precisos
      this.cardWidth = 118;
      this.gap = 7;
      this.viewportWidth = window.innerWidth;
    }
    
    this.cardMove = this.cardWidth + this.gap;
    this.currentPosition = 0;
    
    this.renderCarrousel();
    
    // ✅ SOLO inicializar navegación con botones en desktop
    if (this.isDesktop) {
      this.initializeCarousel();
    }
    
    // ✅ LISTENER para detectar cambios de tamaño de ventana
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 1440;
    
    // Si cambió el modo (desktop <-> mobile), re-renderizar
    if (wasDesktop !== this.isDesktop) {
      // Actualizar valores
      if (this.isDesktop) {
        this.cardWidth = 192.5;
        this.gap = 10;
        this.viewportWidth = 1205;
      } else {
        this.cardWidth = 118;
        this.gap = 7;
        this.viewportWidth = window.innerWidth;
      }
      
      this.cardMove = this.cardWidth + this.gap;
      this.currentPosition = 0;
      
      // Re-renderizar el carrusel
      this.renderCarrousel();
      
      if (this.isDesktop) {
        this.initializeCarousel();
      }
    }
  }

  renderCarrousel() { /* achicar flecha de svg */
    this.DOMElement.innerHTML = `
      <header class="carousel-header">
        <h2 class="carousel-title">${this.category}</h2>  
        <a href="#" class="view-more-link" data-category="${this.category}">Ver más<svg class="view-more-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" fill="currentColor"></path>
          </svg></a>
      </header>

      <section class="carousel-section">
        <button class="carousel-nav-btn prev-btn" aria-label="Anterior">
          <svg class="carousel-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.2893 5.70708C13.8988 5.31655 13.2657 5.31655 12.8751 5.70708L7.98768 10.5993C7.20729 11.3805 7.2076 12.6463 7.98837 13.427L12.8787 18.3174C13.2693 18.7079 13.9024 18.7079 14.293 18.3174C14.6835 17.9269 14.6835 17.2937 14.293 16.9032L10.1073 12.7175C9.71678 12.327 9.71678 11.6939 10.1073 11.3033L14.2893 7.12129C14.6799 6.73077 14.6799 6.0976 14.2893 5.70708Z" fill="currentColor"></path>
          </svg>
        </button>
        
        <div class="card-container-viewport">
          <div class="card-container">
          </div>
        </div>

        <button class="carousel-nav-btn next-btn" aria-label="Siguiente">
          <svg class="carousel-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" fill="currentColor"></path>
          </svg>
        </button>
      </section>
    `;

    // Agregar evento click al link "Ver más"
    const viewMoreLink = this.DOMElement.querySelector('.view-more-link');
    if (viewMoreLink) {
      viewMoreLink.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const allGames = await getGames();
          const gamesByCategory = await filterBy(this.category, allGames);
          renderSearch(gamesByCategory, this.category);
        } catch (error) {
          console.error('Error al cargar más juegos de la categoría:', error);
        }
      });
    }

    this.updateDisplay();
  }

  initializeCarousel() {
    // ✅ SOLO SE EJECUTA EN DESKTOP (>= 1440px)
    const viewport = this.DOMElement.querySelector('.card-container-viewport');
    const container = this.DOMElement.querySelector('.card-container');
    const prevButton = this.DOMElement.querySelector('.prev-btn');
    const nextButton = this.DOMElement.querySelector('.next-btn');

    const totalCards = this.arrayGames.length;
    const totalContentWidth = (totalCards * this.cardWidth) + ((totalCards - 1) * this.gap);
    
    // ✅ Establecer ancho fijo SOLO en desktop
    container.style.width = `${totalContentWidth}px`;
    
    // ✅ Asegurar que NO haya scroll en desktop (navegación con botones)
    container.style.overflowX = 'hidden';

    const moveCarousel = (direction) => {
      if (direction === 'next') {
        const maxMovement = totalContentWidth - this.viewportWidth;

        let newPosition = this.currentPosition - this.cardMove;

        if (Math.abs(newPosition) > maxMovement) {
          newPosition = -maxMovement;
        }

        if (this.currentPosition === newPosition) return;

        this.currentPosition = newPosition;

      } else if (direction === 'prev') {
        let newPosition = this.currentPosition + this.cardMove;

        if (newPosition > 0) {
          newPosition = 0;
        }

        if (this.currentPosition === newPosition) return;

        this.currentPosition = newPosition;
      }
      
      const cards = container.querySelectorAll('.game-card');
      cards.forEach(card => card.classList.add('skewing'));
      
      container.style.transform = `translateX(${this.currentPosition}px)`;

      setTimeout(() => {
        cards.forEach(card => card.classList.remove('skewing'));
      }, 300);

      updateButtonState();
    };

    const updateButtonState = () => {
      prevButton.disabled = this.currentPosition >= 0;

      const maxMovement = totalContentWidth - this.viewportWidth;
      const atEnd = Math.abs(this.currentPosition) >= maxMovement - 1;
      nextButton.disabled = atEnd;
    };

    nextButton.addEventListener('click', () => moveCarousel('next'));
    prevButton.addEventListener('click', () => moveCarousel('prev'));

    updateButtonState();
  }

  updateDisplay() {
    const contentDiv = this.DOMElement.querySelector('.card-container');
    contentDiv.innerHTML = '';
    
    // ✅ EN MÓVIL: Resetear estilos inline que puedan interferir con el scroll nativo
    if (!this.isDesktop) {
      contentDiv.style.width = 'auto';
      contentDiv.style.transform = 'none';
      contentDiv.style.overflowX = 'scroll'; // Scroll nativo en móvil
    }

    this.arrayGames.forEach(game => {
      this.renderCard(game, contentDiv, true);
    });
  }

  renderCard(game, container, append = false) {
    const promo = this.isPromo ? this.isPromo(game) : false;
    let priceHTML = '';
    let offerLabelHTML = '';

    if (promo) {
      const discountPercentage = game.discountPercentage; 

      offerLabelHTML = `
        <div class="offer-label">
          <p>-${discountPercentage}%</p>
        </div>
      `;
      
      priceHTML = `
        <div class="price discount"> 
          <div class="old-price">U$D ${game.price}</div> 
          <div class="new-price">U$D ${game.discountPrice}</div>
        </div>
      `;
    } else {
      if (game.isFree) {
        priceHTML = `<div class="price free"><div class="new-price">Gratis</div></div>`;
      } else {
        priceHTML = `<div class="price common"><div class="new-price">U$D ${game.price}</div></div>`;
      }
    }

    const cardHTML = document.createElement('div');
    cardHTML.classList.add('game-card');

    cardHTML.innerHTML = `
      <div class="main-card">
        <div class="image-container">
          <img class="img-card" 
               src="${game.background_image}" 
               alt="${game.name}" />           
          ${offerLabelHTML}
        </div>
        
        <div class="body-card">
          <div class="title-card">
            <p>${game.name}</p>
          </div>
          
          ${priceHTML}
        </div>
      </div>
    `;

    if (append) {
      container.appendChild(cardHTML);
    } else {
      container.innerHTML = cardHTML.outerHTML;
    }
  }
  
  // ✅ Destructor para limpiar el event listener de resize
  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}
