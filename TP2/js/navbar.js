// Funcionalidad para los menús dropdown de la navbar
// Ambos menús funcionan independientemente

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const hamburgerButton = document.querySelector('#hamburger-menu');
    const hamburgerMenu = document.querySelector('#hamburguer-menu');
    const hamburgerCloseButton = document.querySelector('#hamburguer-menu-close');
    
    const userArea = document.querySelector('.navbar-user');
    const userMenu = document.querySelector('#user-menu');
    
    // Estados de los menús
    let isHamburgerOpen = false;
    let isUserMenuOpen = false;
    
    // ===== MENU HAMBURGUESA =====
    
    // Función para mostrar/ocultar menú hamburguesa
    function toggleHamburgerMenu() {
        isHamburgerOpen = !isHamburgerOpen;
        
        if (isHamburgerOpen) {
            hamburgerMenu.style.display = 'block';
            hamburgerMenu.style.transform = 'translateX(0)';
            hamburgerButton.classList.add('active');
        } else {
            hamburgerMenu.style.transform = 'translateX(-100%)';
            hamburgerButton.classList.remove('active');
            // Ocultar después de la transición
            setTimeout(() => {
                if (!isHamburgerOpen) {
                    hamburgerMenu.style.display = 'none';
                }
            }, 300);
        }
    }
    
    // Event listeners para menú hamburguesa
    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleHamburgerMenu();
        });
    }
    
    if (hamburgerCloseButton) {
        hamburgerCloseButton.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isHamburgerOpen) {
                toggleHamburgerMenu();
            }
        });
    }
    
    // ===== MENU DE USUARIO =====
    
    // Función para mostrar/ocultar menú de usuario
    function toggleUserMenu() {
        isUserMenuOpen = !isUserMenuOpen;
        
        if (isUserMenuOpen) {
            userMenu.style.display = 'block';
            userMenu.style.transform = 'translateX(0)';
            userArea.classList.add('active');
        } else {
            userMenu.style.transform = 'translateX(100%)';
            userArea.classList.remove('active');
            // Ocultar después de la transición
            setTimeout(() => {
                if (!isUserMenuOpen) {
                    userMenu.style.display = 'none';
                }
            }, 300);
        }
    }
    
    // Event listener para menú de usuario
    if (userArea) {
        userArea.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleUserMenu();
        });
    }
    
    // ===== CERRAR MENÚS AL HACER CLICK FUERA =====
    
    // Cerrar menús cuando se hace click fuera de ellos
    document.addEventListener('click', function(e) {
        // Cerrar menú hamburguesa si está abierto y click fuera
        if (isHamburgerOpen && 
            !hamburgerMenu.contains(e.target) && 
            !hamburgerButton.contains(e.target)) {
            toggleHamburgerMenu();
        }
        
        // Cerrar menú de usuario si está abierto y click fuera
        if (isUserMenuOpen && 
            !userMenu.contains(e.target) && 
            !userArea.contains(e.target)) {
            toggleUserMenu();
        }
    });
    
    // Evitar que los clicks dentro de los menús los cierren
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    if (userMenu) {
        userMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
  
    // ===== INICIALIZACIÓN =====
    
    // Asegurar que los menús estén ocultos al cargar la página
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
    
    // Inicializar menús
    initializeMenus();
    
    console.log('✅ Navbar dropdowns initialized successfully');
});
