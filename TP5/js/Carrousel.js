class BaseCarrousel {

  constructor(category, arrayGames) {
    this.category = category;
    this.arrayGames = arrayGames;
    this.DOMElement = document.querySelector(`#${category}-slider`);

    if (!this.DOMElement) {
      console.error(`No se encontró el elemento #${category}-slider`);
      return;
    }
  }

  isPromo(game) {
    return game.discountPrice !== 0 && game.discountPrice < game.price;
  }

  renderCarrousel() { }
  updateDisplay() { }
  renderCard(game, DOMElement) { }
}

/**************************** HERO CARRUSEL *************************/
class HeroCarrousel extends BaseCarrousel {

  constructor(category, arrayGames) {
    super(category, arrayGames);
    if (!this.DOMElement) return;

    this.currentIndex = 0;
    this.autoPlayInterval = null;

    this.DOMElement.classList.add('hero-gallery');
    this.renderCarrousel();
    this.setupEventListeners();
    this.startAutoPlay();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.arrayGames.length;
    this.updateDisplay();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
    this.updateDisplay();
  }

  renderCarrousel() {
    this.DOMElement.innerHTML = `
      <div class="hero-conteiner" id="hero-container"></div>
      <div class="gallery-nav" id="gallery-nav-${this.category}"></div>
    `;

    this.container = this.DOMElement.querySelector('#hero-container');
    this.navContainer = this.DOMElement.querySelector(`#gallery-nav-${this.category}`);

    if (this.container) this.container.style.touchAction = 'pan-y';

    this.renderSlides();
    this.renderNavigation();
    this.updateDisplay();
  }

  renderSlides() {
    this.container.innerHTML = '';

    this.arrayGames.forEach((game, index) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';

      const href = game?.url || game?.href || '';
      if (href) slide.dataset.href = href;

      slide.innerHTML = `
        <img src="${game.background_image}" 
             alt="${game.name}" 
             loading="lazy" 
             draggable="false" 
             style="pointer-events:none;-webkit-user-drag:none;user-select:none;">
        <div class="slide-overlay">
          <h2 class="slide-title">${game.name}</h2>
        </div>
      `;

      slide.addEventListener('click', (e) => {
        if (e.target.closest('.slide-actions')) return;

        const isActive = slide.classList.contains('active');
        const isNext = slide.classList.contains('next');
        const isPrev = slide.classList.contains('prev');

        if (isActive && slide.dataset.href) {
          window.location.assign(slide.dataset.href);
          return;
        }
        if (isNext) { this.next(); return; }
        if (isPrev) { this.prev(); return; }

        this.goToSlide(index);
      });

      this.container.appendChild(slide);
    });

    this.container.addEventListener('dragstart', (e) => e.preventDefault());
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
    // Click en dots
    this.navContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-dot')) {
        const index = parseInt(e.target.dataset.index, 10);
        this.goToSlide(index);
      }
    });

    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Autoplay pausa/reanuda en desktop
    this.DOMElement.addEventListener('mouseenter', () => this.stopAutoPlay());
    this.DOMElement.addEventListener('mouseleave', () => this.startAutoPlay());


    // ********* Swipe solo para mobile *********
    const area = this.container || this.DOMElement;
    const ACTIVATE = 10;
    const ACTION = 50;

    let startX = 0, startY = 0, dx = 0, dy = 0;
    let isSwiping = false;

    const begin = (x, y) => {
      this.stopAutoPlay();
      startX = x; startY = y; dx = dy = 0;
      isSwiping = false;
    };

    const move = (x, y, e) => {
      dx = x - startX;
      dy = y - startY;

      if (!isSwiping && Math.abs(dx) > ACTIVATE && Math.abs(dx) > Math.abs(dy)) {
        isSwiping = true;
      }
      if (isSwiping && e && e.cancelable) e.preventDefault();
    };

    const end = () => {
      if (isSwiping && Math.abs(dx) > ACTION) {
        (dx < 0) ? this.next() : this.prev();
      }
      startX = startY = dx = dy = 0;
      isSwiping = false;
      this.startAutoPlay();
    };

    const onDown = (e) => {
      if (e.pointerType !== 'touch') return;
      begin(e.clientX, e.clientY);
      area.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e) => {
      if (e.pointerType !== 'touch') return;
      move(e.clientX, e.clientY, e);
    };
    const onUp = (e) => {
      if (e.pointerType !== 'touch') return;
      try { area.releasePointerCapture?.(e.pointerId); } catch { }
      end();
    };

    area.addEventListener('pointerdown', onDown, { passive: true });
    area.addEventListener('pointermove', onMove, { passive: false });
    area.addEventListener('pointerup', onUp, { passive: true });
    area.addEventListener('pointercancel', onUp, { passive: true });

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
        slide.style.cursor = slide.dataset.href ? 'pointer' : 'default';
      } else if (diff === 1 || diff === -(totalSlides - 1)) {
        slide.classList.add('next');
        slide.style.cursor = 'pointer';
      } else if (diff === -1 || diff === totalSlides - 1) {
        slide.classList.add('prev');
        slide.style.cursor = 'pointer';
      } else if (diff > 1 || diff < -1) {
        if (diff > 0 || diff === -(totalSlides - 2)) {
          slide.classList.add('far-next');
        } else {
          slide.classList.add('far-prev');
        }
        slide.style.cursor = 'default';
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  goToSlide(index) {
    this.currentIndex = ((index % this.arrayGames.length) + this.arrayGames.length) % this.arrayGames.length;
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

/********************************************************* CARRUSEL COMÚN ***********************************************/
class CommonCarrousel extends BaseCarrousel {

  constructor(category, arrayGames) {
    super(category, arrayGames);
    if (!this.DOMElement) return;

    this.updateDimensions();
    this.currentPosition = 0;

    this.renderCarrousel();

    if (this.isDesktop) {
      this.initializeCarousel();
    }

    //Detecta cambios de tamaño de ventana
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  updateDimensions() {
    this.isDesktop = window.innerWidth >= 1440;

    if (this.isDesktop) {
      this.cardWidth = 192.5;
      this.gap = 10;
      this.viewportWidth = 1205;
      this.cardMove = this.cardWidth + this.gap;
    }
  }

  handleResize() {
    const wasDesktop = this.isDesktop;
    this.isDesktop = window.innerWidth >= 1440;

    // Si cambió el modo (desktop <-> mobile), re-renderizar
    if (wasDesktop !== this.isDesktop) {
      this.updateDimensions();
      this.currentPosition = 0;

      // Re-renderizar el carrusel
      this.renderCarrousel();

      if (this.isDesktop) {
        this.initializeCarousel();
      }
    }
  }

  initializeCarousel() {
    const container = this.DOMElement.querySelector('.card-container');
    const prevButton = this.DOMElement.querySelector('.prev-btn');
    const nextButton = this.DOMElement.querySelector('.next-btn');

    const totalCards = this.arrayGames.length;
    const totalContentWidth = (totalCards * this.cardWidth) + ((totalCards - 1) * this.gap);

    container.style.width = `${totalContentWidth}px`;

    container.addEventListener('transitionend', (e) => {
      if (e.propertyName === 'transform') {
        container.classList.remove('moving');
      }
    });

    const moveCarousel = (direction) => {
      const maxMovement = totalContentWidth - this.viewportWidth;
      const step = this.cardMove;

      let newPosition = this.currentPosition + (direction === 'next' ? -step : step);
      newPosition = Math.min(0, Math.max(newPosition, -maxMovement));

      if (newPosition === this.currentPosition) return;

      this.currentPosition = newPosition;

      container.classList.add('moving');
      container.style.transform = `translateX(${this.currentPosition}px)`;

      updateButtonState();
    };

    //Actualiza estados de lo botones next y prev
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

    this.arrayGames.forEach(game => {
      this.renderCard(game, contentDiv, true);
    });
  }

  /***************************** CREAR CARRUSEL *********************************/

  renderCarrousel() {
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
          <div class="card-container"></div>
        </div>

        <button class="carousel-nav-btn next-btn" aria-label="Siguiente">
          <svg class="carousel-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.71069 18.2929C10.1012 18.6834 10.7344 18.6834 11.1249 18.2929L16.0123 13.4006C16.7927 12.6195 16.7924 11.3537 16.0117 10.5729L11.1213 5.68254C10.7308 5.29202 10.0976 5.29202 9.70708 5.68254C9.31655 6.07307 9.31655 6.70623 9.70708 7.09676L13.8927 11.2824C14.2833 11.6729 14.2833 12.3061 13.8927 12.6966L9.71069 16.8787C9.32016 17.2692 9.32016 17.9023 9.71069 18.2929Z" fill="currentColor"></path>
          </svg>
        </button>
      </section>
    `;

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

  /***************************** CREAR CARD *********************************/

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
          <div class="old-price">U$D ${game.price.toFixed(2)}</div> 
          <div class="new-price">U$D ${game.discountPrice.toFixed(2)}</div>
        </div>
      `;
    } else {
      if (game.isFree) {
        priceHTML = `<div class="price free"><div class="new-price">Gratis</div></div>`;
      } else {
        priceHTML = `<div class="price common"><div class="new-price">U$D ${game.price.toFixed(2)}</div></div>`;
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

  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}
