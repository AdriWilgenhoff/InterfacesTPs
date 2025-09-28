document.addEventListener('DOMContentLoaded', () => {
    
    const hamburgerButton = document.querySelector('#hamburger-menu');
    const hamburgerMenu = document.querySelector('#hamburguer-menu');
    const hamburgerCloseButton = document.querySelector('#hamburguer-menu-close');
    const userArea = document.querySelector('.navbar-user');
    const userMenu = document.querySelector('#user-menu');

    
    let isHamburgerOpen = false;
    let isUserMenuOpen = false;

   
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

    
});