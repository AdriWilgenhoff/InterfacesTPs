document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('register-button');
    const registerForm = document.querySelector('.register-form');
    
    const nameInput = document.getElementById('nombre');
    const lastNameInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const repeatPasswordInput = document.getElementById('repeat-password');
    const dobInput = document.getElementById('fecha-nacimiento');
    const recaptchaCheckbox = document.getElementById('recaptcha-input');

    const inputs = [
        { input: nameInput, errorElement: createErrorElement(nameInput), validate: validateName },
        { input: lastNameInput, errorElement: createErrorElement(lastNameInput), validate: validateLastName },
        { input: emailInput, errorElement: createErrorElement(emailInput), validate: validateEmail },
        { input: passwordInput, errorElement: createErrorElement(passwordInput), validate: validatePassword },
        { input: repeatPasswordInput, errorElement: createErrorElement(repeatPasswordInput), validate: validateRepeatPassword },
        { input: dobInput, errorElement: createErrorElement(dobInput), validate: validateDOB },
    ];
    const recaptchaError = createErrorElement(recaptchaCheckbox.parentElement.parentElement, true);

    function createErrorElement(inputElement, isRecaptcha = false) {
        const error = document.createElement('span');
        error.classList.add('error-message');
        if (isRecaptcha) {
            inputElement.parentElement.appendChild(error);
        } else {
            inputElement.parentElement.appendChild(error);
        }
        return error;
    }


    function displayError(inputElement, errorElement, message) {
        const groupElement = inputElement.closest('.input-group') || inputElement.closest('.recaptcha-group');
        errorElement.textContent = message;
        if (message) {
            if (groupElement) {
                groupElement.classList.add('error');
            } else {
                inputElement.parentElement.classList.add('error');
            }
        } else {
            if (groupElement) {
                groupElement.classList.remove('error');
            } else {
                inputElement.parentElement.classList.remove('error');
            }
        }
    }

    function validateName() {
        const input = nameInput;
        const error = inputs.find(i => i.input === input).errorElement;
        const value = input.value.trim();
        let message = '';

        if (value === '') {
            message = 'El nombre es obligatorio.';
        }

        displayError(input, error, message);
        return message === '';
    }

    function validateLastName() {
        const input = lastNameInput;
        const error = inputs.find(i => i.input === input).errorElement;
        const value = input.value.trim();
        let message = '';

        if (value === '') {
            message = 'El apellido es obligatorio.';
        }

        displayError(input, error, message);
        return message === '';
    }

    function validateEmail() {
        const input = emailInput;
        const error = inputs.find(i => i.input === input).errorElement;
        const value = input.value.trim();
        let message = '';

        if (value === '') {
            message = 'El correo electrónico es obligatorio.';
        } else if (!value.includes('@')) {
            message = 'Debe ser un correo electrónico válido.';
        }

        displayError(input, error, message);
        return message === '';
    }

    function validatePassword() {
        const input = passwordInput;
        const error = inputs.find(i => i.input === input).errorElement;
        const value = input.value;
        let passwordErrors = [];

        if (value.length < 6) {
            passwordErrors.push('La contraseña debe tener al menos 6 caracteres.');
        }
        const hasNumbers = (value.match(/\d/g) || []).length >= 3;
        if (!hasNumbers) {
            passwordErrors.push('La contraseña debe tener al menos 3 números.');
        }
        const hasUppercase = /[A-Z]/.test(value);
        if (!hasUppercase) {
            passwordErrors.push('La contraseña debe tener al menos una letra mayúscula.');
        }
        
        const message = passwordErrors.join('\n');
        displayError(input, error, message);

        validateRepeatPassword(); 
        
        return message === '';
    }

    function validateRepeatPassword() {
        const input = repeatPasswordInput;
        const error = inputs.find(i => i.input === input).errorElement;
        const value = input.value;
        const passwordValue = passwordInput.value;
        let message = '';

        if (value !== passwordValue) {
            message = 'Las contraseñas no coinciden.';
        }

        displayError(input, error, message);
        return message === '';
    }

    function validateDOB() {
        const input = dobInput;
        const error = inputs.find(i => i.input === input).errorElement;
        const value = input.value;
        let message = '';

        if (value === '') {
            message = 'La fecha de nacimiento es obligatoria.';
        }

        displayError(input, error, message);
        return message === '';
    }

    function validateRecaptcha() {
        const input = recaptchaCheckbox;
        const error = recaptchaError;
        let message = '';

        if (!input.checked) {
            message = 'Por favor, confirma que no eres un robot.';
        }
        const recaptchaGroup = recaptchaCheckbox.closest('.recaptcha-group');
        displayError(recaptchaCheckbox, error, message);
        
        return message === '';
    }

    nameInput.addEventListener('input', validateName);
    lastNameInput.addEventListener('input', validateLastName);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    repeatPasswordInput.addEventListener('input', validateRepeatPassword);
    dobInput.addEventListener('change', validateDOB);
    recaptchaCheckbox.addEventListener('change', validateRecaptcha);
    
    passwordInput.addEventListener('input', validateRepeatPassword); 


    function validateAll() {
        const results = [
            validateName(),
            validateLastName(),
            validateEmail(),
            validatePassword(),
            validateRepeatPassword(),
            validateDOB(),
            validateRecaptcha()
        ];
        
        return results.every(result => result === true);
    }


    if (registerButton) {
        registerButton.addEventListener('click', function(event) {
            const isValid = validateAll();
            
            if (isValid) {
                window.location.href = 'index.html';
            } else {
                event.preventDefault(); 
            }
        });
    }
});

