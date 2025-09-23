  class Carrousel {
            constructor(category, data, isHero) {
                this.category = category;
                this.data = data;
                this.currentIndex = 0;
                this.cardsPerView = this.getCardsPerView();
                this.maxIndex = Math.max(0, this.data.length - this.cardsPerView);
                
                this.track = document.getElementById(`${category}-track`);

                if (isHero){
                    this.indicatorsContainer = document.getElementById(`${name}-indicators`);
                }
                
                /* tengo que aprovechar el constructor para que se renderice solo */ 
                this.init();
                this.setupEventListeners();
                this.setupResponsive();
            }



               /* ver tamaños en mobile y desktop */  
            getCardsPerView() {
                const width = window.innerWidth;
                if (width >= 1200) return 4;
                if (width >= 768) return 2;
                return 1;
            }

            init() {
                this.renderCards();
                this.renderIndicators();
                this.updateCarousel();
            }

            renderCards() {
                this.track.innerHTML = '';
                this.data.forEach((item, index) => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <div class="card-image">${item.icon}</div>
                        <div class="card-content">
                            <h3 class="card-title">${item.title}</h3>
                            <p class="card-description">${item.description}</p>
                            <button class="card-button" onclick="handleCardClick('${this.catgory}', ${index})">
                                Ver más
                            </button>
                        </div>
                    `;
                    this.track.appendChild(card);
                });
            }

            renderIndicators() {
                this.indicatorsContainer.innerHTML = '';
                const totalPages = this.maxIndex + 1;
                
                for (let i = 0; i <= this.maxIndex; i++) {
                    const indicator = document.createElement('div');
                    indicator.className = 'indicator';
                    if (i === 0) indicator.classList.add('active');
                    indicator.addEventListener('click', () => this.goToSlide(i));
                    this.indicatorsContainer.appendChild(indicator);
                }
            }

            updateCarousel() {
                const cardWidth = 320; // 300px + 20px gap
                const translateX = -this.currentIndex * cardWidth;
                this.track.style.transform = `translateX(${translateX}px)`;
                
                // Actualizar indicadores
                const indicators = this.indicatorsContainer.querySelectorAll('.indicator');
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === this.currentIndex);
                });
                
                // Actualizar botones
                this.updateButtons();
            }

            updateButtons() {
                const prevBtn = document.querySelector(`button[data-action="prev"][data-target="${this.name}"]`);
                const nextBtn = document.querySelector(`button[data-action="next"][data-target="${this.name}"]`);
                
                prevBtn.disabled = this.currentIndex === 0;
                nextBtn.disabled = this.currentIndex >= this.maxIndex;
            }

            goToSlide(index) {
                this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
                this.updateCarousel();
            }

            next() {
                if (this.currentIndex < this.maxIndex) {
                    this.currentIndex++;
                    this.updateCarousel();
                }
            }

            prev() {
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                    this.updateCarousel();
                }
            }

            setupEventListeners() {
                // Navegación con teclado
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'ArrowLeft') this.prev();
                    if (e.key === 'ArrowRight') this.next();
                });

                // Touch/swipe para móviles
                let startX = 0;
                let endX = 0;

                this.track.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });

                this.track.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                });

                this.track.addEventListener('touchend', (e) => {
                    endX = e.changedTouches[0].clientX;
                    const diff = startX - endX;
                    
                    if (Math.abs(diff) > 50) {
                        if (diff > 0) {
                            this.next();
                        } else {
                            this.prev();
                        }
                    }
                });
            }

            setupResponsive() {
                window.addEventListener('resize', () => {
                    const newCardsPerView = this.getCardsPerView();
                    if (newCardsPerView !== this.cardsPerView) {
                        this.cardsPerView = newCardsPerView;
                        this.maxIndex = Math.max(0, this.data.length - this.cardsPerView);
                        this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                        this.renderIndicators();
                        this.updateCarousel();
                    }
                });
            }
        }

        // Instanciar carruseles
        const carousels = {};

        // Inicializar todos los carruseles
        Object.keys(carouselData).forEach(name => {
            carousels[name] = new Carousel(name, carouselData[name]);
        });

        // Event listeners para botones de navegación
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="prev"]')) {
                const target = e.target.getAttribute('data-target');
                carousels[target]?.prev();
            }
            
            if (e.target.matches('[data-action="next"]')) {
                const target = e.target.getAttribute('data-target');
                carousels[target]?.next();
            }
        });

        // Función para manejar clics en cards
        function handleCardClick(carouselName, cardIndex) {
            const item = carouselData[carouselName][cardIndex];
            alert(`¡Hiciste clic en "${item.title}" del carrusel "${carouselName}"!\n\n${item.description}`);
        }

        // Auto-play opcional (descomenta para activar)
        /*
        function startAutoPlay() {
            setInterval(() => {
                Object.values(carousels).forEach(carousel => {
                    if (carousel.currentIndex >= carousel.maxIndex) {
                        carousel.goToSlide(0);
                    } else {
                        carousel.next();
                    }
                });
            }, 5000);
        }
        
        // Iniciar auto-play después de 3 segundos
        setTimeout(startAutoPlay, 3000);
        */