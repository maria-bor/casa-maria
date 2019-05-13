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

        var inputDescription = document.createElement("TEXTAREA");
        inputDescription.id = "about-room" + idx;
        inputDescription.name = "about-room";
        inputDescription.rows = "5";
        // inputDescription.cols = "30";
        inputDescription.resize = "none";
        inputDescription.disabled = true;
        inputDescription.style.padding = "0";

        var labelDescription = document.createElement("LABEL");
        labelDescription.htmlFor = inputDescription.id;
        labelDescription.innerText = "Wyposażenie:";
        labelDescription.style.verticalAlign = "top";

        var p = document.createElement('p');
        var p2 = document.createElement('p');

        var button = document.createElement("INPUT");
        button.id = "bookButt" + idx;
        button.className = "bookButt";
        button.value = "Zarezerwuj";
        button.type = "button";
        button.setAttribute('input-type-id', inputType.id);

        button.addEventListener('click', function () {
            choosenType = document.getElementById(this.getAttribute('input-type-id')).value;
            var user = document.getElementById("logged")
            var isUserLogged = user.dataset.islogged
            if(isUserLogged == true) {
                requestBookingForLogged(choosenType)
            } else {
                showReservationPopup(choosenType);
            }
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
        li.appendChild(p2);

        li.appendChild(labelDescription);
        inputDescription.value = v.description;
        li.appendChild(inputDescription);
        // li.appendChild(p);

        fieldset.appendChild(button);
        idx++;
    }
}

function showUnavailable() {}

function showReservationPopup(choosenType) {
    document.querySelector('.bg-modal-booking').style.display = 'none';
    document.querySelector('.bg-modal-reserve').style.display = 'flex';
    const formReserve = new Vue(
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
                },
                onSubmit: function () {
                    requestBooking(choosenType, this.nameReserve, this.surnameReserve, this.emailReserve);
                }
            }
        });
}

function onRequestBookingCallback(response) {
    if (response.result === 'OK') {
        alert("Rezerwacja dokonana");
        document.querySelector('.bg-modal-reserve').style.display = 'none';
        document.querySelector('.bg-modal-booking').style.display = 'none';
    } else {
        alert(response.message);
    }
}

function requestBookingForLogged(type) {
    var data = {
        bookingType: type
    };
    requestServer(url, data, onRequestBookingCallback);
}

function requestBooking(type, name, surname, email) {
    console.log("[requestBooking] TYPE: " + type)
    var data = {
        bookingType: type,
        name: name,
        surname: surname,
        email: email
    };
    requestServer(url, data, onRequestBookingCallback);
}