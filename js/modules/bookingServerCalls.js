import { requestServer }
    from './requestServer.js'

import { date_diff_indays }
    from './adminServerCalls.js'

var url = "./php/booking.php";

export function requestAvailability(dateFrom, dateTo, nrPersons) {
    var data = {
        dateFrom: dateFrom,
        dateTo: dateTo,
        nrPersons: nrPersons
    };
    function callback(response) {
        if (response.result === 'OK') {
            fillAvailability(response.value, dateFrom, dateTo, nrPersons);
        } else {
            alert(response.message);
            console.log('showUnavailable');
            showUnavailable();
        }
    }
    requestServer(url, data, callback);
}

var choosenType = null;

function fillAvailability(values, dateFrom, dateTo, nrPersons) {
    document.querySelector('.bg-modal-booking').style.display = 'flex';
    document.querySelector('body').style.overflow = 'hidden';
    document.getElementById('book-from').value = dateFrom;
    document.getElementById('book-to').value = dateTo;

    var root = document.querySelector(".inner-modal-content-booking");
    root.innerHTML = "";
    var idx = 1;
    for (var v of values) {
        var fieldset = document.createElement("FIELDSET");
        var ul = document.createElement("UL");
        var li = document.createElement("LI");
        ul.setAttribute('class', 'input-booking');

        var inputType = document.createElement("INPUT");
        inputType.id = "type-room" + idx;
        inputType.name = "type-room";
        inputType.type = "text";
        inputType.disabled = true;

        var labelType = document.createElement("LABEL");
        labelType.htmlFor = inputType.id;
        labelType.innerText = "Typ pokoju:";

        var inputPrice = document.createElement("INPUT");
        inputPrice.id = "price-room" + idx;
        inputPrice.name = "price-room";
        inputPrice.type = "text";
        inputPrice.disabled = true;

        var labelPrice = document.createElement("LABEL");
        labelPrice.htmlFor = inputPrice.id;
        labelPrice.innerText = "Cena:";

        var p = document.createElement('p');

        var button = document.createElement("INPUT");
        button.id = "bookButt" + idx;
        button.className = "bookButt";
        button.value = "Zarezerwuj";
        button.type = "button";
        button.setAttribute('input-type-id', inputType.id);

        button.addEventListener('click', function () {
            choosenType = document.getElementById(this.getAttribute('input-type-id')).value;
            console.log("type" + choosenType);
            showReservationPopup(choosenType);
        }); 

        root.appendChild(fieldset);
        fieldset.appendChild(ul);
        ul.appendChild(li);

        li.appendChild(labelType);
        inputType.value = v.type;
        li.appendChild(inputType);
        li.appendChild(p);

        li.appendChild(labelPrice);
        var pricePerDay = v.price;
        inputPrice.value = date_diff_indays(dateFrom, dateTo) * pricePerDay;
        li.appendChild(inputPrice);

        fieldset.appendChild(button);
        idx++;
    }
}

function showUnavailable() {}

function showReservationPopup(choosenType) {
    document.querySelector('.bg-modal-booking').style.display = 'none';
    document.querySelector('.bg-modal-reserve').style.display = 'flex';
    const formLogin = new Vue(
        {
            el: '#form-reserve',
            data: {
                errorName: '',
                errorSurname: '',
                errorEmail: '',

                nameReserve: document.getElementById('nameReserve').value,
                surnameReserve: document.getElementById('surnameReserve').value,
                emailReserve: document.getElementById('emailReserve').value,
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
                validNameSurname: function (str) {
                    var nameOrSurname = str.trim();
                    var nameOrSurnameFormat = /^[a-zA-Z]{3,20}?$/;
                    return nameOrSurnameFormat.test(nameOrSurname);
                },
                validPassword: function (passwordLogin) {
                    var pass = passwordLogin.trim();
                    return (pass.length >= 8) && (pass.length <= 20);
                },
                validEmail: function (emailReserve) {
                    // var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    var mailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    return mailFormat.test(emailReserve);
                }
            }
        });

    document.getElementById('reserveButt').addEventListener('click', function () {
        var name = document.getElementById('nameReserve').value;
        var surname = document.getElementById('surnameReserve').value;
        var email = document.getElementById('emailReserve').value;
        console.log("[requestBooking] choosenType: " + choosenType)
        requestBooking(choosenType, name, surname, email);
    });
}

function requestBooking(type, name, surname, email) {
    console.log("[requestBooking] TYPE: " + type)
    var data = {
        bookingType: type,
        name: name,
        surname: surname,
        email: email
    };
    function callback(response) {
        if (response.result === 'OK') {
            alert("Rezerwacja dokonana");
            document.querySelector('.bg-modal-reserve').style.display = 'none';
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}