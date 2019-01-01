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

document.getElementById('clickBooking').addEventListener('click', function () {
    document.querySelector('.bg-modal-booking').style.display = 'flex';
    console.log('JESTEM')
});
document.querySelector('.close-booking').addEventListener('click', function () {
    document.querySelector('.bg-modal-booking').style.display = 'none';
});