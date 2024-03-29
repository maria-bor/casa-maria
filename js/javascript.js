import { requestAvailability }
    from "./modules/bookingServerCalls.js";

// Putting the logout function as a property on the window object
window.logout = logout;
function logout() {
    window.location.replace("./php/logout.php");
}

/*** POPUP LOGIN ***/
document.getElementById('clickLogin').addEventListener('click', function () {
    // Sprawdzamy co jest na buttonie napisane
    let label = document.getElementById('clickLogin').innerText;
    if (label === 'Zaloguj się') {
        document.querySelector('.bg-modal-login').style.display = 'flex';
        document.querySelector('body').style.overflow = 'hidden';
        const formLogin = new Vue(
            {
                el: '#form-login',
                data: {
                    errorLogin: '',
                    errorPassword: '',
                    emailLogin: document.getElementById('emailLogin').value,
                    passwordLogin: ''
                },
                methods: {
                    checkForm: function (e) {
                        this.errorLogin = '';
                        this.errorPassword = '';

                        if (!this.passwordLogin) {
                            this.errorPassword = "Wprowadź hasło.";
                        } else if (!this.validPassword(this.passwordLogin)) {
                            this.errorPassword = "Niepoprawny format hasła.";
                        }

                        if (!this.emailLogin) {
                            this.errorLogin = "Wprowadź email.";
                        } else if (!this.validEmail(this.emailLogin)) {
                            this.errorLogin = "Niepoprawny email.";
                        }

                        if (!this.errorLogin.length && !this.errorPassword.length) {
                            return true;
                        }
                        e.preventDefault();
                    },
                    validPassword: function (passwordLogin) {
                        var pass = passwordLogin.trim();
                        return (pass.length >= 8) && (pass.length <= 20);
                    },
                    validEmail: function (emailLogin) {
                        // var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        var mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;                        
                        return mailFormat.test(emailLogin);
                    }
                }
            });
    } else if (label === 'Wyloguj się') {
        logout();
    }
});

document.querySelector('.close-login').addEventListener('click', function () {
    document.querySelector('.bg-modal-login').style.display = 'none';
    document.querySelector('body').style.overflow = 'auto';
    logout();
});

/*** POPUP REGISTER ***/
document.getElementById('clickRegister').addEventListener('click', function () {
    let label = document.getElementById('clickRegister').innerText;
    if (label === 'Zarejestruj się') {
        document.querySelector('.bg-modal-register').style.display = 'flex';
        document.querySelector('body').style.overflow = 'hidden';
        const formRegister = new Vue(
            {
                el: '#form-register',
                data: {
                    errorName: '',
                    errorSurname: '',
                    errorEmail: '',
                    errorPassword: '',
                    errorPasswordConfirm: '',

                    nameRegister: document.getElementById('nameRegister').value,
                    surnameRegister: document.getElementById('surnameRegister').value,
                    email: document.getElementById('email').value,
                    passwordRegister: '',
                    passwordConfirm: ''
                },
                methods: {
                    checkForm: function (e) {
                        this.errorName = '';
                        this.errorSurname = '';
                        this.errorEmail = '';
                        this.errorPassword = '';
                        this.errorPasswordConfirm = '';

                        if (!this.nameRegister) {
                            this.errorName = "Wprowadź imię.";
                        } else if (!this.validNameSurname(this.nameRegister)) {
                            this.errorName = "Niepoprawny format.";
                        }

                        if (!this.surnameRegister) {
                            this.errorSurname = "Wprowadź nazwisko.";
                        } else if (!this.validNameSurname(this.surnameRegister)) {
                            this.errorSurname = "Niepoprawny format.";
                        }

                        if (!this.email) {
                            this.errorEmail = "Wprowadź email.";
                        } else if (!this.validEmail(this.email)) {
                            this.errorEmail = "Niepoprawny email.";
                        }

                        if (!this.passwordRegister) {
                            this.errorPassword = "Wprowadź hasło.";
                        } else if (!this.validPassword(this.passwordRegister)) {
                            this.errorPassword = "Niepoprawny format hasła. Min 8 znaków.";
                        }

                        if (!this.passwordConfirm) {
                            this.errorPasswordConfirm = "Wprowadź hasło.";
                        } else if (!this.validPasswordConfirm(this.passwordConfirm)) {
                            this.errorPasswordConfirm = "Hasła nie zgadzają się.";
                        }

                        if (!this.errorName.length && !this.errorSurname.length
                            && !this.errorEmail.length && !this.errorPassword.length
                            && !this.errorPasswordConfirm.length) {
                            return true;
                        }
                        e.preventDefault();
                    },
                    validNameSurname: function (str) {
                        var nameOrSurname = str.trim();
                        var nameOrSurnameFormat = /^[a-zA-Z]{3,20}?$/;
                        return nameOrSurnameFormat.test(nameOrSurname);
                    },
                    validEmail: function (email) {
                        // var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        var mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                        return mailFormat.test(email);
                    },
                    validPassword: function (passwordRegister) {
                        var pass = passwordRegister.trim();
                        return (pass.length >= 8) && (pass.length <= 20);
                    },
                    validPasswordConfirm: function (passwordConfirm) {
                        var passConfirm = passwordConfirm.trim();
                        return passConfirm === this.passwordRegister;
                    }
                }
            });
    } else if (label === 'Konto') {
        window.location.replace("./user.html");
    }
});
document.querySelector('.close-register').addEventListener('click', function () {
    document.querySelector('.bg-modal-register').style.display = 'none';
    document.querySelector('body').style.overflow = 'auto';
    logout();
});

/***CHECK LOGIN OR REGISTER ERROR (RESPONSE FROM SERVER)***/
$(document).ready(function () {
    checkError("Register");
    checkError("Login");
});

function checkError(error) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == ("error_" + error.toLowerCase())) {
                document.getElementById("click" + error).click();
            }
        }
    }
    ajax.open("GET", "./php/helpers/checkError" + error + ".php", true);
    ajax.send();
}

let tmp = new Date(Date.now()); // tmp now like: "2018-08-21T11:54:50.580Z"
let dateInputFormatted = tmp.toISOString().split('T')[0]; // 0, as split produces: ["2018-08-21", "11:54:50.580Z"]

var dateFrom = document.getElementById('book-date-from');
dateFrom.min = dateInputFormatted;

var dateTo = document.getElementById("book-date-to");

dateFrom.addEventListener('change', setDateTo);
function setDateTo() {
    var from = dateFrom.value;
    dateTo.min = from;
}

/*** POPUP BOOKING ***/
$(document).ready(function () {
    validateDateInput();
    $('#book-date-from, #book-date-to').change(validateDateInput);
});

function validateDateInput() {
    if ($('#book-date-from').val().length > 0 &&
        $('#book-date-to').val().length > 0 &&
        $('#book-date-to').val() > $('#book-date-from').val()) {
        $("#clickBooking").prop("disabled", false);
    }
    else {
        $("#clickBooking").prop("disabled", true);
    }
}
document.getElementById('clickBooking').addEventListener('click', function () {
    var selectList = document.getElementById('nrPersons');
    var nrPersons = selectList.options[selectList.selectedIndex].text;

    requestAvailability(dateFrom.value, dateTo.value, nrPersons);
});
document.querySelector('.close-booking').addEventListener('click', function () {
    document.querySelector('.bg-modal-booking').style.display = 'none';
    document.querySelector('body').style.overflow = 'auto';

});

document.querySelector('.close-reserve').addEventListener('click', function () {
    document.querySelector('.bg-modal-reserve').style.display = 'none';
});


document.querySelector('.close-popup').addEventListener('click', function () {
    document.querySelector('.bg-modal-popup').style.display = 'none';
});