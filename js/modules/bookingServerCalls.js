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

    // TODO w for(v) po values trzeba będzie robić fieldsety v.type, v.price ilość osob wywalić
}

function showUnavailable() {

}