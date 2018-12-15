/*** POPUP LOGIN ***/
document.getElementById('clickLogin').addEventListener('click', function () {
    document.querySelector('.bg-modal-login').style.display = 'flex';
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
