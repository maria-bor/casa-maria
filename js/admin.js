function logout() {
    window.open("./index.html");
}

const formRegisterAdmin = new Vue(
    {
        el: '#form-add-admin',
        data: {
            errorName: '',
            errorSurname: '',
            errorEmail: '',
            errorPassword: '',
            errorPasswordConfirm: '',

            nameNewAdmin: null,
            surnameNewAdmin: null,
            emailNewAdmin: null,
            passwordNewAdmin: null,
            passwordConfirmNewAdmin: null
        },
        methods: {
            checkForm: function (e) {
                this.errorName = '';
                this.errorSurname = '';
                this.errorEmail = '';
                this.errorPassword = '';
                this.errorPasswordConfirm = '';

                if (!this.nameNewAdmin) {
                    this.errorName = "Wprowadź imię.";
                } else if (!this.validNameSurname(this.nameNewAdmin)) {
                    this.errorName = "Niepoprawny format.";
                }

                if (!this.surnameNewAdmin) {
                    this.errorSurname = "Wprowadź nazwisko.";
                } else if (!this.validNameSurname(this.surnameNewAdmin)) {
                    this.errorSurname = "Niepoprawny format.";
                }

                if (!this.emailNewAdmin) {
                    this.errorEmail = "Wprowadź email.";
                } else if (!this.validEmail(this.emailNewAdmin)) {
                    this.errorEmail = "Niepoprawny email.";
                }

                if (!this.passwordNewAdmin) {
                    this.errorPassword = "Wprowadź hasło.";
                } else if (!this.validPassword(this.passwordNewAdmin)) {
                    this.errorPassword = "Niepoprawny format hasła.";
                }

                if (!this.passwordConfirmNewAdmin) {
                    this.errorPasswordConfirm = "Wprowadź hasło.";
                } else if (!this.validPasswordConfirm(this.passwordConfirmNewAdmin)) {
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
            validPassword: function (passwordNewAdmin) {
                var pass = passwordNewAdmin.trim();
                return (pass.length >= 8) && (pass.length <= 20);
            },
            validPasswordConfirm: function (passwordConfirmNewAdmin) {
                var passConfirm = passwordConfirmNewAdmin.trim();
                return passConfirm === this.passwordNewAdmin;
              }
        }
    });