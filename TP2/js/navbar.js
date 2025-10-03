document.addEventListener('DOMContentLoaded', () => {

    const hamburgerButton = document.querySelector('#hamburger-menu');
    const hamburgerMenu = document.querySelector('#hamburguer-menu');
    const hamburgerCloseButton = document.querySelector('#hamburguer-menu-close');
    const userArea = document.querySelector('.navbar-user');
    const userMenu = document.querySelector('#user-menu');
    const searchToggleBtn = document.querySelector('#search-toggle-btn');
    const searchContainer = document.querySelector('.navbar-search');


    let isHamburgerOpen = false;
    let isUserMenuOpen = false;
    let isSearchExpanded = false;


    function toggleSearch() {
        isSearchExpanded = !isSearchExpanded;

        if (isSearchExpanded) {
            searchContainer.classList.add('expanded');

            setTimeout(() => {
                const searchInput = searchContainer.querySelector('.search-input');
                if (searchInput) searchInput.focus();
            }, 300);
        } else {
            searchContainer.classList.remove('expanded');
        }
    }


    function toggleHamburgerMenu() {
        isHamburgerOpen = !isHamburgerOpen;

        if (isHamburgerOpen) {
            hamburgerMenu.style.display = 'block';
            hamburgerMenu.style.transform = 'translateX(0)';
            hamburgerButton.classList.add('active');
        } else {
            hamburgerMenu.style.transform = 'translateX(-100%)';
            hamburgerButton.classList.remove('active');
            setTimeout(() => {
                if (!isHamburgerOpen) hamburgerMenu.style.display = 'none';
            }, 300);
        }
    }

    function toggleUserMenu() {
        isUserMenuOpen = !isUserMenuOpen;

        if (isUserMenuOpen) {
            userMenu.style.display = 'block';
            userMenu.style.transform = 'translateX(0)';
            userArea.classList.add('active');
        } else {
            userMenu.style.transform = 'translateX(100%)';
            userArea.classList.remove('active');
            setTimeout(() => {
                if (!isUserMenuOpen) userMenu.style.display = 'none';
            }, 300);
        }
    }


    if (searchToggleBtn) {
        searchToggleBtn.addEventListener('click', e => {
            e.stopPropagation();
            toggleSearch();
        });
    }

    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', e => {
            e.stopPropagation();
            toggleHamburgerMenu();
        });
    }

    if (hamburgerCloseButton) {
        hamburgerCloseButton.addEventListener('click', e => {
            e.stopPropagation();
            if (isHamburgerOpen) toggleHamburgerMenu();
        });
    }

    if (userArea) {
        userArea.addEventListener('click', e => {
            e.stopPropagation();
            toggleUserMenu();
        });
    }


    document.addEventListener('click', e => {

        if (isSearchExpanded &&
            !searchContainer.contains(e.target)) {
            toggleSearch();
        }

        if (isHamburgerOpen &&
            !hamburgerMenu.contains(e.target) &&
            !hamburgerButton.contains(e.target)) {
            toggleHamburgerMenu();
        }

        if (isUserMenuOpen &&
            !userMenu.contains(e.target) &&
            !userArea.contains(e.target)) {
            toggleUserMenu();
        }
    });


    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', e => e.stopPropagation());
    }
    if (userMenu) {
        userMenu.addEventListener('click', e => e.stopPropagation());
    }
    if (searchContainer) {
        searchContainer.addEventListener('click', e => e.stopPropagation());
    }


    function initializeMenus() {
        if (hamburgerMenu) {
            hamburgerMenu.style.display = 'none';
            hamburgerMenu.style.transform = 'translateX(-100%)';
            hamburgerMenu.style.transition = 'transform 0.3s ease';
        }

        if (userMenu) {
            userMenu.style.display = 'none';
            userMenu.style.transform = 'translateX(100%)';
            userMenu.style.transition = 'transform 0.3s ease';
        }
    }

    initializeMenus();


    window.addEventListener('resize', () => {
        if (window.innerWidth > 480 && isSearchExpanded) {
            searchContainer.classList.remove('expanded');
            isSearchExpanded = false;
        }
    });

    /******************************** Renderizar Categorías ********************************/

    async function renderMenuCategories() {
        try {
            let categories = await getCategories();
            let menuContainer = document.querySelector('#hamburguer-menu-list');

            if (!menuContainer) {
                console.error('No se encontró el contenedor #hamburguer-menu-list');
                return;
            }

           
            menuContainer.innerHTML = '';

            
            const iconsByCategory = {
                action: "/assets/logos_svg/categories/action.svg",
                rpg: "/assets/logos_svg/categories/rpg.svg",
                shooter: "/assets/logos_svg/categories/shooter.svg",
                arcade: "/assets/logos_svg/categories/arcade.svg",
                indie: "/assets/logos_svg/categories/indie.svg",
                adventure: "/assets/logos_svg/categories/adventure.svg"
            };

            categories.forEach(category => {
                
                let li = document.createElement("li");
                li.classList.add("menu-item");

                
                let img = document.createElement("img");
                img.classList.add("menu-icon");
                img.src = iconsByCategory[category] || "/assets/icons_perfil/perfil.png";
                img.alt = category;

               
                let a = document.createElement("a");
                a.classList.add("menu-link");
                a.href = "#";
                a.textContent = category.charAt(0).toUpperCase() + category.slice(1);

                // Agregar evento click para filtrar por categoría
                a.addEventListener('click', async (e) => {
                    e.preventDefault();
                    try {
                        // Cerrar el menú hamburguesa
                        if (isHamburgerOpen) toggleHamburgerMenu();
                        
                        // Obtener todos los juegos
                        const allGames = await getGames();
                        
                        // Filtrar por categoría
                        const gamesByCategory = await filterBy(category, allGames);
                        
                        // Renderizar resultados
                        renderSearch(gamesByCategory, category);
                        
                        console.log(`Categoría ${category} filtrada:`, gamesByCategory.length, 'juegos');
                    } catch (error) {
                        console.error('Error al filtrar por categoría:', error);
                    }
                });

                
                li.appendChild(img);
                li.appendChild(a);

                
                menuContainer.appendChild(li);
            });

            console.log('Categorías renderizadas:', categories);
        } catch (error) {
            console.error('Error al renderizar categorías:', error);
        }
    }

   
    renderMenuCategories();

    /******************************** Funcionalidad Logo - Volver al Home ********************************/
    
    const navbarLogo = document.querySelector('.navbar-logo');
    
    if (navbarLogo) {
        // Agregar cursor pointer para indicar que es clickeable
        navbarLogo.style.cursor = 'pointer';
        
        navbarLogo.addEventListener('click', async () => {
            try {
                // Cerrar menús si están abiertos
                if (isHamburgerOpen) toggleHamburgerMenu();
                if (isUserMenuOpen) toggleUserMenu();
                if (isSearchExpanded) toggleSearch();
                
                // Obtener juegos y renderizar home
                const games = await getGames();
                await showHome(games);
                
                console.log('Home renderizado desde el logo');
            } catch (error) {
                console.error('Error al volver al home desde el logo:', error);
            }
        });
    }

});