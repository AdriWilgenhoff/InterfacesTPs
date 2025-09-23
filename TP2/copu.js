
class Carrousel {

    /*atributos*/
    category;
    arrayGames;
    globalIndex;
    DOMElement;
    isHero;

    /*constructor*/
    constructor(category, arrayGames, isHero) {
        this.category = category;
        this.arrayGames = arrayGames;
        this.globalIndex = 0;
        this.DOMElement = document.querySelector(`#${category}-slider`);
        this.isHero = isHero;

        this.renderCarrousel();
    }

    /*  Métodos de la clase */
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

        let prevIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
        let nextIndex = (this.globalIndex + 1) % this.arrayGames.length;

        this.DOMElement.innerHTML = `
            <div id="heroCardPrevious"></div>
            <div id="heroCardMain"></div>
            <div id="heroCardNext"></div>
        `;

        let previousSlide = document.querySelector('#heroCardPrevious');
        let principalSlide = document.querySelector('#heroCardMain');
        let nextSlide = document.querySelector('#heroCardNext');

        this.renderButtons(this.arrayGames[prevIndex], previousSlide, "previous");
        this.renderButtons(this.arrayGames[nextIndex], nextSlide, "next");
        this.renderCard(this.arrayGames[this.globalIndex], principalSlide);
    }

    renderButtons(game, DOMElement, type) {
        if (this.isHero) { 
            /* la clase que va a hber que usar para modificar el estilo del hero va a ser previous-hero y next-hero y para el comun previous-common y next-common*/
            DOMElement.innerHTML = `
                <div class="side-card ${type}-hero"> 
                    <img src="${game.background_image}" alt="${game.name}">
                </div>
            `;
        } else {
            DOMElement.innerHTML = `
                <button class="carousel-btn ${type}-common"></button>
            `;
        }

        DOMElement.onclick = () => {
            if (type === "previous") {
                this.globalIndex = (this.globalIndex - 1 + this.arrayGames.length) % this.arrayGames.length;
            } else {
                this.globalIndex = (this.globalIndex + 1) % this.arrayGames.length;
            }
            this.renderHero();
        };
    }

    renderCard(game, DOMElement) {
        if (this.isHero) {
            DOMElement.innerHTML = `
                <div class="mainCardHero">
                    <img src="${game.background_image}" alt="${game.name}">
                    <h3>${game.name}</h3>
                    <a href="#" class="btn-info">Ver Info</a>
                </div>
            `;
        } else {
            DOMElement.innerHTML = `
                <div class="game-card">
                    <img src="${game.background_image}" alt="" class="card-img">
                    <div class="card-body">
                        <h3 class="card-title">${game.name}</h3>
                        <div style="display:flex"> 
                            <div id="${game.id}-price"></div>
                            <div></div>
                        </div>
                    </div>
                    <button class="btn buy" id="${game.id}-button"></button>
                </div>
            `;
        }

        let gamePromo = this.isPromo(game);
        let gamePrice = document.querySelector(`#${game.id}-price`);
        let buttonCard = document.querySelector(`#${game.id}-button`);

        if (!gamePromo) {
            if (game.isFree) {
                gamePrice.innerHTML = `
                    <div class="precioComun">
                        Gratis
                    </div>`;
                buttonCard.classList.add("buttonFree");
                buttonCard.innerText = "Jugar";
            } else {
                gamePrice.innerHTML = `
                    <div class="precioComun">
                        ${game.price}
                    </div>`;
                buttonCard.classList.add("buttonBuy");
                buttonCard.innerText = "Comprar";
            }
        } else {
            gamePrice.innerHTML = `
                <div class="precioDescuento">
                    <div class="precioTachado">${game.price}</div>
                    <div class="precioComun">${game.discountPrice}</div>
                </div>`;
            buttonCard.classList.add("buttonBuy");
            buttonCard.innerText = "Comprar";
        }
    }

    isPromo(game) {
        return game.discountPrice !== 0 && game.discountPrice < game.price;
    }

    /* pendiente implementar */
    renderCommon() {
        console.log("Render común...");
    }
}
