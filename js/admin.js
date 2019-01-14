function logout() {
    window.open("./index.html");
}

const formAddTypeRoom = new Vue(
    {
        el: '#form-add-type',
        data: {
            errorName: '',

            nameType: null,
        },
        methods: {
            checkForm: function (e) {
                this.errorName = '';

                if (!this.nameType) {
                    this.errorName = "Wprowadź typ pokoju.";
                } else if (!this.validName(this.nameType)) {
                    this.errorName = "Niepoprawny format.";
                }

                if (!this.errorName.length) {
                    return true;
                }
                e.preventDefault();
            },
            validName: function (str) {
                var nameType = str.trim();
                var nameTypeFormat = /^[a-zA-Z]{3,20}?$/;
                return nameTypeFormat.test(nameType);
            }
        }
    });

const formRoom = new Vue(
    {
        el: '#form-add-room',
        data: {
            errorNrRoom: '',
            errorNrFloor: '',
            errorSleeps: '',
            errorType: '',

            nrRoom: null,
            nrFloor: null,
            sleeps: null,
            type: null
        },
        methods: {
            checkForm: function (e) {
                this.errorNrRoom = '';
                this.errorNrFloor = '';
                this.errorSleeps = '';
                this.errorType = '';

                if (!this.nrRoom) {
                    this.errorNrRoom = "Wprowadź numer pokoju.";
                } else if (!this.validNumber(this.nrRoom)) {
                    this.errorNrRoom = "Niepoprawny format.";
                }

                if (!this.nrFloor) {
                    this.errorNrFloor = "Wprowadź numer piętra.";
                } else if (!this.validNumber(this.nrFloor)) {
                    this.errorNrFloor = "Niepoprawny format.";
                }

                if (!this.sleeps) {
                    this.errorSleeps = "Wprowadź ilość miejsc do spania.";
                } else if (!this.validSleeps(this.sleeps)) {
                    this.errorSleeps = "Niepoprawny format.";
                }

                if (!this.type) {
                    this.errorType = "Wybierz typ pokoju.";
                }

                if (!this.errorNrRoom.length && !this.errorNrFloor.length
                    && !this.errorSleeps.length && !this.errorType.length) {
                    return true;
                }
                e.preventDefault();
            },
            validNumber: function (nr) {
                return /^[1-9]\d*$/.test(nr);
            },
            validSleeps: function (nr) {
                return /^[1-9]$/.test(nr);
            }
        }
    });

const formAddOffer = new Vue(
    {
        el: '#form-add-offer',
        data: {
            errorName: '',
            errorPrice: '',
            errorFrom: '',
            errorTo: '',

            name: null,
            price: null,
            from: null,
            to: null
        },
        methods: {
            checkForm: function (e) {
                this.errorName = '';
                this.errorPrice = '';
                this.errorFrom = '';
                this.errorTo = '';

                if (!this.name) {
                    this.errorName = "Wprowadź nazwę oferty.";
                } else if (!this.validName(this.name)) {
                    this.errorName = "Niepoprawny format.";
                }

                if (!this.price) {
                    this.errorPrice = "Wprowadź cenę.";
                } else if (!this.validPrice(this.price)) {
                    this.errorPrice = "Niepoprawny format.";
                }

                if (!this.from) {
                    this.errorFrom = "Wprowadź początek oferty.";
                }

                if (!this.to) {
                    this.errorTo = "Wprowadź datę końca oferty.";
                } else if (!this.validTo(this.to)) {
                    this.errorTo = "Zła data.";
                }

                if (!this.errorName.length && !this.errorPrice.length
                    && !this.errorFrom.length && !this.errorTo.length) {
                    return true;
                }
                e.preventDefault();
            },
            validName: function (str) {
                var nameOffer = str.trim();
                var nameOfferFormat = /^[a-zA-Z]{3,20}?$/;
                return nameOfferFormat.test(nameOffer);
            },
            validPrice: function (price) {
                return /^[1-9]\d*$/.test(price);
            },
            validTo: function (to) {
                return to > this.from;
            }
        }
    });

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
            validNameSurname: function (str) {
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

// ***ADMIN DATA***
// CHANGE ADMIN NAME
var changedName;
$('#name-change-butt').on('click', function () {
    if ($('#name-change-butt').val() === 'Zmień') {
        $('#userName').prop('disabled', false);
        $('#name-change-butt').prop('value', 'Ok');
    }
    else if ($('#name-change-butt').val() === 'Ok') {
        changedName = $('#userName').val();
        if (/^[a-zA-Z]{3,20}?$/.test(changedName)) {
            $('#userName').prop('disabled', true);
            $('#name-change-butt').prop('value', 'Zmień');
            $('#errorName').empty();
        }
        else {
            $('#errorName').text('Niepoprawny format.');
        }
    }
});

// CHANGE ADMIN SURNAME
var changedSurname;
$('#surname-change-butt').on('click', function () {
    if ($('#surname-change-butt').val() === 'Zmień') {
        $('#userSurname').prop('disabled', false);
        $('#surname-change-butt').prop('value', 'Ok');
    }
    else if ($('#surname-change-butt').val() === 'Ok') {
        changedSurname = $('#userSurname').val();
        if (/^[a-zA-Z]{3,20}?$/.test(changedSurname)) {
            $('#userSurname').prop('disabled', true);
            $('#surname-change-butt').prop('value', 'Zmień');
            $('#errorSurname').empty();
        }
        else {
            $('#errorSurname').text('Niepoprawny format.');
        }
    }
});

// CHANGE ADMIN EMAIL
var changedEmail;
$('#email-change-butt').on('click', function () {
    if ($('#email-change-butt').val() === 'Zmień') {
        $('#userEmail').prop('disabled', false);
        $('#email-change-butt').prop('value', 'Ok');
    }
    else if ($('#email-change-butt').val() === 'Ok') {
        changedEmail = $('#userEmail').val();
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(changedEmail)) {
            $('#userEmail').prop('disabled', true);
            $('#email-change-butt').prop('value', 'Zmień');
            $('#errorEmail').empty();
        }
        else {
            $('#errorEmail').text('Niepoprawny format.');
        }
    }
});

// CHANGE ADMIN ASSWORD
var changedPassword;
$('#password-change-butt').on('click', function () {
    if ($('#password-change-butt').val() === 'Zmień') {
        $('#userPassword').prop('disabled', false);
        $('#password-change-butt').prop('value', 'Ok');
    }
    else if ($('#password-change-butt').val() === 'Ok') {
        changedPassword = $('#userPassword').val().trim();
        if ((changedPassword.length >= 8) && (changedPassword.length <= 20)) {
            $('#userPassword').prop('disabled', true);
            $('#password-change-butt').prop('value', 'Zmień');
            $('#errorPassword').empty();
        }
        else {
            $('#errorPassword').text('Niepoprawny format.');
        }
    }
});