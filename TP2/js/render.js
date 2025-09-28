
/********************************************* app ***********************************************************************/

window.addEventListener("load", renderApp)

async function renderApp() {
    // busco juegos de las apis
    const games = await getGames();
    showHome(games);

    const searchInput = document.querySelector(".search-input");
    const searchBtn = document.querySelector(".search-btn");

    searchBtn.addEventListener("click", async () => {
        const text = searchInput.value.trim();
        if (text.length > 0) {
            const allGames = await getGames();
            const filteredGames = await filterBy(text, allGames);
            renderSearch(filteredGames);
        } else {
            showHome();
        }
    });
}

/********************************************* Home *******************************************************************/

/* async function showHome(games) {

    const containerRender = document.querySelector('#home-container');
    containerRender.innerHTML = "";

    const section = document.createElement('section');
    section.id = `hero-slider`;
    containerRender.appendChild(section);

    const heroCards = await filterByHeroCard(games);
    new HeroCarrousel('hero', heroCards);

    const categoriesHome = ['platformer', 'rpg', 'shooter', 'arcade'];

    for (const category of categoriesHome) {

        const section = document.createElement('section');
        section.id = `${category}-slider`;
        containerRender.appendChild(section);

        const gamesByCategory = await filterBy(category, games);

        new CommonCarrousel(category, gamesByCategory);

    }
}
 */



async function showHome(games) {
    console.log(games)
    const containerRender = document.querySelector('#home-container');
    containerRender.innerHTML = "";

    const section = document.createElement('section');
    section.id = `hero-slider`;
    containerRender.appendChild(section);

    const heroCards = await filterByHeroCard(games);
    new HeroCarrousel('hero', heroCards); 

    const categoriesHome = ['action','rpg','shooter','arcade','indie','adventure'];

    for (const category of categoriesHome) {
        
        const section = document.createElement('section');
        section.id = `${category}-slider`; 
        containerRender.appendChild(section);  

        const gamesByCategory = await filterBy(category, games);
       
        new CommonCarrousel(category, gamesByCategory);       
      
    }
}

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
/********************************************** resultados de busqueda ************************************************/

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



