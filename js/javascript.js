/*** POPUP LOGIN ***/
document.getElementById('clickLogin').addEventListener('click', function () {
    document.querySelector('.bg-modal-login').style.display = 'flex';
    const formLogin = new Vue(
        {
            el: '#form-login',
            data: {
                errorLogin: '',
                errorPassword: '',
                emailLogin: null,
                passwordLogin: null
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
                    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return mailFormat.test(emailLogin);
                }
            }
        });
});
document.querySelector('.close-login').addEventListener('click', function () {
    document.querySelector('.bg-modal-login').style.display = 'none';
});

/*** POPUP REGISTER ***/
document.getElementById('clickRegister').addEventListener('click', function () {
    document.querySelector('.bg-modal-register').style.display = 'flex';
    const formRegister = new Vue(
        {
            el: '#form-register',
            data: {
                errorName: '',
                errorSurname: '',
                errorEmail: '',
                errorPassword: '',
                errorPasswordConfirm: '',

                nameRegister: null,
                surnameRegister: null,
                email: null,
                passwordRegister: null,
                passwordConfirm: null
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
                        this.errorPassword = "Niepoprawny format hasła.";
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
                validNameSurname:function (str) {
                    var nameOrSurname = str.trim();
                    var nameOrSurnameFormat = /^[a-zA-Z]{3,20}?$/;
                    return nameOrSurnameFormat.test(nameOrSurname);
                },
                validEmail: function (email) {
                    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
});
document.querySelector('.close-register').addEventListener('click', function () {
    document.querySelector('.bg-modal-register').style.display = 'none';
});

/***CHECK LOGIN OR REGISTER ERROR (RESPONSE FROM SERVER)***/
$(document).ready(function() {
    checkError("Register");
    checkError("Login");
});

function checkError(error) {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == ("error_"+error.toLowerCase()))
                document.getElementById("click"+error).click();
        }
    }
    ajax.open("GET", "./php/helpers/checkError"+error+".php", true);
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
$(document).ready(function (){
    validateDateInput();
    $('#book-date-from, #book-date-to').change(validateDateInput);
});

function validateDateInput(){
    if ($('#book-date-from').val().length > 0   &&
        $('#book-date-to').val().length > 0) {
        $("#clickBooking").prop("disabled", false);
    }
    else {
        $("#clickBooking").prop("disabled", true);
    }
} 
document.getElementById('clickBooking').addEventListener('click', function () {
    // var dateFrom = document.getElementById('book-date-from').value;
    // var dateTo = document.getElementById('book-date-to').value;
    var selectList = document.getElementById('nrPersons');
    var nrPersons = selectList.options[selectList.selectedIndex].text;
    console.log(nrPersons);
    
    document.querySelector('.bg-modal-booking').style.display = 'flex';
    document.getElementById('book-from').value = dateFrom.value;
    document.getElementById('book-to').value = dateTo.value;
    document.getElementById('numbers-person-room').value = nrPersons;
});
document.querySelector('.close-booking').addEventListener('click', function () {
    document.querySelector('.bg-modal-booking').style.display = 'none';
});

/*** POPUP RESERVE***/
document.getElementById('bookButt').addEventListener('click', function () {
    document.querySelector('.bg-modal-booking').style.display = 'none';
    document.querySelector('.bg-modal-reserve').style.display = 'flex';
    const formLogin = new Vue(
        {
            el: '#form-reserve',
            data: {
                errorName: '',
                errorSurname: '',
                errorEmail: '',
                
                nameReserve: null,
                surnameReserve: null,
                emailReserve: null
            },
            methods: {
                checkForm: function (e) {
                    this.errorName = '';
                    this.errorSurname = '';
                    this.errorEmail = '';

                    if (!this.nameReserve) {
                        this.errorName = "Wprowadź imię.";
                    } else if (!this.validNameSurname(this.nameReserve)) {
                        this.errorName = "Niepoprawny format.";
                    }

                    if (!this.surnameReserve) {
                        this.errorSurname = "Wprowadź nazwisko.";
                    } else if (!this.validNameSurname(this.surnameReserve)) {
                        this.errorSurname = "Niepoprawny format.";
                    }

                    if (!this.emailReserve) {
                        this.errorEmail = "Wprowadź email.";
                    } else if (!this.validEmail(this.emailReserve)) {
                        this.errorEmail = "Niepoprawny format email.";
                    }

                    if (!this.errorName.length && 
                        !this.errorSurname.length && 
                        !this.errorEmail.length) {
                        return true;
                    } 
                    e.preventDefault();
                },
                validNameSurname:function (str) {
                    var nameOrSurname = str.trim();
                    var nameOrSurnameFormat = /^[a-zA-Z]{3,20}?$/;
                    return nameOrSurnameFormat.test(nameOrSurname);
                },
                validPassword: function (passwordLogin) {
                    var pass = passwordLogin.trim();
                    return (pass.length >= 8) && (pass.length <= 20);
                },
                validEmail: function (emailReserve) {
                    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    return mailFormat.test(emailReserve);
                }
            }
        });
});
document.querySelector('.close-reserve').addEventListener('click', function () {
    document.querySelector('.bg-modal-reserve').style.display = 'none';
});