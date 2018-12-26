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
                    // return !isNaN(parseFloat(passwordLogin.trim())) && !isFinite(passwordLogin.trim()) || !(passwordLogin.trim() === '');
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
});
document.querySelector('.close-register').addEventListener('click', function () {
    document.querySelector('.bg-modal-register').style.display = 'none';
});

/*LOGIN ADMIN*/
// document.getElementById('loginButt').addEventListener('click', login()) 
function login() {
    var emailLogin = document.getElementById('emailLogin')
    var passwordLogin = document.getElementById('passwordLogin')

    if (emailLogin.value === 'a' && passwordLogin.value === 'a') {
        console.log('AAA')
        console.log(emailLogin)
        console.log(passwordLogin)
        window.open("/admin.html");
    }
    else {

    }
}
