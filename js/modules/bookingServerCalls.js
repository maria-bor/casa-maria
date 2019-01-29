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
        inputType.id = "type-room"+idx;
        inputType.name = "type-room";
        inputType.type = "text";
        inputType.disabled = true;

        var labelType = document.createElement("LABEL");
        labelType.htmlFor = inputType.id;
        labelType.innerText = "Typ pokoju:";

        var inputPrice = document.createElement("INPUT");
        inputPrice.id = "price-room"+idx;
        inputPrice.name = "price-room";
        inputPrice.type = "text";
        inputPrice.disabled = true;

        var labelPrice = document.createElement("LABEL");
        labelPrice.htmlFor = inputPrice.id;
        labelPrice.innerText = "Cena:";

        var p = document.createElement('p');

        var button = document.createElement("INPUT");
        button.id = "bookButt"+idx;
        button.className = "bookButt";
        button.value = "Zarezerwuj";
        button.type = "button";

        root.appendChild(fieldset);
        fieldset.appendChild(ul);
        ul.appendChild(li);

        li.appendChild(labelType);
        inputType.value = v.type;
        li.appendChild(inputType);
        li.appendChild(p);

        li.appendChild(labelPrice);
        var pricePerDay = v.price;
        inputPrice.value = date_diff_indays(dateFrom, dateTo)*pricePerDay;
        li.appendChild(inputPrice);

        fieldset.appendChild(button);
        idx++;
    }
}

function showUnavailable() {

}