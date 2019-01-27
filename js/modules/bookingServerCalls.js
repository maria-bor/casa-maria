import { requestServer }
    from './requestServer.js'

var url = "./php/booking.php";

export function requestAvailability(dateFrom, dateTo, nrPersons) {
    var data = {
        dateFrom: 'dateFrom',
        dateTo: 'dateTo',
        nrPersons: 'nrPersons'
    };
    function callback(response) {
        if (response.result === 'OK') {
            fillAvailability(response.value, dateFrom, dateTo, nrPersons);
        } else {
            showUnavailable();
        }
    }
    requestServer(url, data, callback);
}

function fillAvailability(values, dateFrom, dateTo, nrPersons) {
    document.querySelector('.bg-modal-booking').style.display = 'flex';
    document.getElementById('book-from').value = dateFrom;
    document.getElementById('book-to').value = dateTo;
    document.getElementById('numbers-person-room').value = nrPersons;

    var root = document.getElementById("modal-content-booking");
    var fieldset = document.createElement("FIELDSET");
    var ul = document.createElement("UL");
    var li = document.createElement("LI");
    ul.setAttribute('class', 'input-booking');

    var inputType = document.createElement("INPUT");
    inputType.id = "type-room";
    inputType.name = "type-room";
    inputType.type = "text";

    var labelType = document.createElement("LABEL");
    labelType.htmlFor = inputType.id;
    labelType.innerText = "Typ pokoju:";

    var inputPrice = document.createElement("INPUT");
    inputPrice.id = "price-room";
    inputPrice.name = "price-room";
    inputPrice.type = "text";

    var labelPrice = document.createElement("LABEL");
    labelPrice.htmlFor = inputPrice.id;
    labelPrice.innerText = "Cena:";

    var button = document.createElement("INPUT");
    button.id = "bookButt";
    button.value = "Zarezerwuj";
    button.type = "submit"; // CZY JEDNAK TYPE=BUTTON?????
    // TODO w for(v) po values trzeba będzie robić fieldsety v.type, v.price ilość osob wywalić
    for (var v of values) {
        root.appendChild(fieldset);
        fieldset.appendChild(ul);
        ul.appendChild(li);

        li.appendChild(labelType);
        inputType.value = v.type;
        li.appendChild(inputType);

        li.appendChild(labelPrice);
        inputPrice.value = v.price;
        li.appendChild(inputPrice);

        fieldset.appendChild(button);
    }
}

function showUnavailable() {

}