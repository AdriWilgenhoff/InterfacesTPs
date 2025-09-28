document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('login-button');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const loginForm = document.querySelector('.login-form');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function displayError(inputElement, errorElement, message) {
        const groupElement = inputElement.parentElement;
        
        errorElement.textContent = message;
        if (message) {
            if (groupElement) {
                groupElement.classList.add('error');
            }
        } else {
            if (groupElement) {
                groupElement.classList.remove('error');
            }
        }
    }
    function validateEmail() {
        const emailValue = emailInput.value.trim();
        let message = '';

        if (emailValue === '') {
            message = 'El correo electrónico es obligatorio.';
       
        } else if (!emailRegex.test(emailValue)) { 
            message = 'Por favor, introduce un formato de correo electrónico válido (ej: usuario@ejemplo.com).';
        }

        displayError(emailInput, emailError, message);
        return message === '';
    }

    function validatePassword() {
        const passwordValue = passwordInput.value.trim();
        let message = '';

        if (passwordValue === '') {
            message = 'Contraseña incorrecta.';
        }
        
        displayError(passwordInput, passwordError, message);
        return message === '';
    }

    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    function validateAll() {
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        
        return isEmailValid && isPasswordValid;
    }


    if (loginButton) {
        loginButton.addEventListener('click', function(event) {
            const isValid = validateAll();
            
            if (isValid) {
                window.location.href = 'index.html';
            } else {
                event.preventDefault(); 
            }
        });
    }
});