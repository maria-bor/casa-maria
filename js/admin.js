import {
    setupChangeNameHandler,
    setupChangeSurnameHandler,
    setupChangeEmailHandler
}
    from './changeProfile.js';
import {
    loadTab,
    setupTabClickHandlers
}
    from './modules/tabsModule.js'
import {
    requestAddNewRoomType,
    requestAllRoomTypes,
    requestAddNewRoom,
    requestAddNewOffer,
    requestAllOffers
}
    from './modules/adminServerCalls.js'

// Putting the logout function as a property on the window object
window.logout = logout;
function logout() {
    window.location.replace("./php/logout.php");
}

window.onload = function () {
    var tab = loadTab();
    if (tab === "#tab-2") {
        requestAllRoomTypes();
    } else if (tab === "#tab-4") {
        requestAllOffers();
    }
}

$(setupTabClickHandlers());

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
                    this.errorName = "Wprowadź nazwe typu pokoju.";
                } else if (!this.validName(this.nameType)) {
                    this.errorName = "Niepoprawny format.";
                }

                if (!this.errorName.length) { // Jak sukces walidacji to zapytanie do serwera o dodanie nowego typu
                    requestAddNewRoomType(this.nameType);
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
                } else if (!this.validNumberRoom(this.nrRoom)) {
                    this.errorNrRoom = "Niepoprawny format. Na przykład: 001";
                }

                if (!this.nrFloor) {
                    this.errorNrFloor = "Wprowadź numer piętra.";
                } else if (!this.validNumberFloor(this.nrFloor)) {
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

                // Jak sukces walidacji to zapytanie do serwera o dodanie nowego pokoju
                if (!this.errorNrRoom.length && !this.errorNrFloor.length
                    && !this.errorSleeps.length && !this.errorType.length) {
                    requestAddNewRoom(this.nrRoom, this.nrFloor, this.sleeps, this.type);
                    return true;
                }
                e.preventDefault();
            },
            validNumberRoom: function (nr) {
                return /^\d{3}$/.test(nr);
            },
            validNumberFloor: function (nr) {
                return /^[1-9]\d*$/.test(nr);
            },
            validSleeps: function (nr) {
                return /^[1-9]$/.test(nr);
            }
        }
    });

let tmp = new Date(Date.now()); // tmp now like: "2018-08-21T11:54:50.580Z"
let dateInputFormatted = tmp.toISOString().split('T')[0]; // 0, as split produces: ["2018-08-21", "11:54:50.580Z"]

var dateFromMin = document.getElementById('from');
dateFromMin.min = dateInputFormatted;

var dateToMin = document.getElementById('to');
dateToMin.min = dateInputFormatted;

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
            from: dateFromMin,
            to: dateToMin
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
                    requestAddNewOffer(this.name, this.price, this.from, this.to);
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
$(setupChangeNameHandler());
// CHANGE ADMIN SURNAME
$(setupChangeSurnameHandler());
// CHANGE ADMIN EMAIL
$(setupChangeEmailHandler());

// CHANGE ADMIN PASSWORD
var changedPassword;
var changedPasswordConfirm;
$('#password-change-butt').on('click', function () {
    if ($('#password-change-butt').val() === 'Zmień') {
        $('#userPassword').prop('disabled', false);
        $('#password-change-butt').prop('value', 'Ok');
        $('.hidden').css('visibility', 'visible');
    }
    else if ($('#password-change-butt').val() === 'Ok') {
        changedPassword = $('#userPassword').val().trim();
        changedPasswordConfirm = $('#userPasswordConfirm').val().trim();

        if ((changedPassword.length >= 8) && (changedPassword.length <= 20)) {
            $('#errorPassword').empty();
            if (changedPassword !== changedPasswordConfirm) {
                $('#errorPasswordConfirm').text('Hasła nie zgadzają się!');
            }
            else {
                $('#userPassword').prop('disabled', true);
                $('.hidden').css('visibility', 'hidden');
                $('#password-change-butt').prop('value', 'Zmień');
                $('#errorPassword').empty();
                $('#errorPasswordConfirm').empty();
            }
        }
        else {
            $('#errorPassword').text('Niepoprawny format.');
        }
    }
});

