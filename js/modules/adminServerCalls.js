import { requestServer }
    from './requestServer.js'

var url = "./php/admin.php";

/***  TAB-2 ***/
export function requestAddNewRoomType(nameType) {
    var data = {
        nameType: nameType
    };
    function callback(response) {
        $('#nameTypeInfo').text(response.message);
        if (response.result === 'OK') {
            $("#nameType").val('');
            requestAllRoomTypes();
        }
    }
    requestServer(url, data, callback);
}

export function requestAllRoomTypes() {
    var data = {
        roomTypes: 'name'
    };
    function callback(response) {
        if (response.result === 'OK') {
            fillTypesCombobox(response.value);
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

function fillTypesCombobox(types) {
    var select = document.getElementById("type");
    select.innerHTML = '';
    for (var t of types) {
        var option = document.createElement('option')
        option.innerHTML = t.name;
        select.appendChild(option);
    }
}

export function requestAddNewRoom(nrRoom, nrFloor, sleeps, type) {
    var data = {
        nrRoom: nrRoom,
        nrFloor: nrFloor,
        sleeps: sleeps,
        nameType: type
    };
    function callback(response) {
        $('#addRoomInfo').text(response.message);
        if (response.result === 'OK') {
            requestAllRooms();
        }
    }
    requestServer(url, data, callback);
}

var allRooms = null;
export function requestAllRooms() {
    var data = {
        room: 'all'
    };
    function callback(response) {
        if (response.result === 'OK') {
            allRooms = response.value;
            fillRoomsTable(allRooms);
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

export function fillRoomsTable(values) {
    var tableRef = document.getElementById("tableRoom").getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';

    for (var v of values) {
        // Insert a row in the table at row index 0
        var newRow = tableRef.insertRow(tableRef.rows.length)
        // Insert a cell in the row at index 0 and // Append a text node to the cell
        newRow.insertCell(0).appendChild(document.createTextNode(v.nrRoom));
        newRow.insertCell(1).appendChild(document.createTextNode(v.floor));
        newRow.insertCell(2).appendChild(document.createTextNode(v.sleeps));
        newRow.insertCell(3).appendChild(document.createTextNode(v.name));
    }
}
/*** END TAB-2 ***/

/*** TAB-3 ***/
var allBooking = null;
export function requestAllBooking() {
    var data = {
        booking: 'all'
    };
    function callback(response) {
        if (response.result === 'OK') {
            allBooking = response.value;
            fillBookingTable(allBooking);
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

export function fillBookingTable(values) {
    var tableRef = document.getElementById("tableRezerwacje").getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';
    let idx = 1;

    var select = document.getElementById("booking");
    select.innerHTML = '';

    for (var v of values) {
        // Insert a row in the table at row index 0
        var newRow = tableRef.insertRow(tableRef.rows.length)
        // Insert a cell in the row at index 0 and // Append a text node to the cell
        newRow.insertCell(0).appendChild(document.createTextNode(idx));
        newRow.insertCell(1).appendChild(document.createTextNode(v.nrRoom));
        newRow.insertCell(2).appendChild(document.createTextNode(v.name));
        newRow.insertCell(3).appendChild(document.createTextNode(v.surname));
        newRow.insertCell(4).appendChild(document.createTextNode(v.email));
        newRow.insertCell(5).appendChild(document.createTextNode(v.guests));
        newRow.insertCell(6).appendChild(document.createTextNode(v.date_from));
        newRow.insertCell(7).appendChild(document.createTextNode(v.date_to));

        var payment = date_diff_indays(v.date_from, v.date_to);
        newRow.insertCell(8).appendChild(document.createTextNode(payment * v.price));

        var option = document.createElement('option')
        option.innerHTML = idx++;
        select.appendChild(option);
    }
}

var date_diff_indays = function (from, to) {
    var dateFrom = new Date(from);
    var dateTo = new Date(to);
    return Math.floor((
        Date.UTC(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()) -
        Date.UTC(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate())) / (1000 * 60 * 60 * 24));
}

export function deleteBookingInAdmin(nrBooking, nrRoom, dateFrom, dateTo) {
    var data = {
        nrRoom: nrRoom,
        dateFrom: dateFrom,
        dateTo: dateTo
    };
    function callback(response) {
        $('#deleteBookingInfo').text(response.message);
        if (response.result === 'OK') {
            deleteBooking(nrBooking);
        }
    }
    requestServer(url, data, callback);
}

function deleteBooking(nrBooking) {
    var tableRef = document.getElementById("tableRezerwacje").getElementsByTagName('tbody')[0];
    tableRef.deleteRow(nrBooking - 1);

    var select = document.getElementById("booking");
    select.remove(nrBooking - 1);

    // Aktualizacja liczb porządkowych w tabeli i comboboxie:
    var options = select.getElementsByTagName('option');
    for (let i = nr - 1; i < tableRef.rows.length; ++i) {
        tableRef.rows[i].cells[0].innerHTML = i + 1;
        options[i].innerHTML = i + 1;
    }
}
/*** END TAB-3 ***/

/*** TAB-4 ***/
export function requestAddNewOffer(name, from, to) {
    var data = {
        name: name,
        from: from,
        to: to
    };
    function callback(response) {
        $('#addOfferInfo').text(response.message);
        if (response.result === 'OK') {
            requestAllOffers();
        }
    }
    requestServer(url, data, callback);
}

var allOffers = null;
export function requestAllOffers() {
    var data = {
        offer: 'all'
    };
    function callback(response) {
        if (response.result === 'OK') {
            allOffers = response.value;
            fillOffersTable(allOffers);
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

export function fillOffersTable(values) {
    var tableRef = document.getElementById("tableOferty").getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';
    let idx = 1;

    var select = document.getElementById("offers");
    select.innerHTML = '';

    for (var v of values) {
        // Insert a row in the table at row index 0
        var newRow = tableRef.insertRow(tableRef.rows.length)
        // Insert a cell in the row at index 0 and // Append a text node to the cell
        newRow.insertCell(0).appendChild(document.createTextNode(idx));
        newRow.insertCell(1).appendChild(document.createTextNode(v.name));
        newRow.insertCell(2).appendChild(document.createTextNode(''));
        newRow.insertCell(3).appendChild(document.createTextNode(''));
        newRow.insertCell(4).appendChild(document.createTextNode(v.date_from));
        newRow.insertCell(5).appendChild(document.createTextNode(v.date_to));

        var option = document.createElement('option')
        option.innerHTML = idx++;
        select.appendChild(option);
    }
}

export function requestAllRoomsNumbers() {
    var data = {
        room: 'nr'
    };
    function callback(response) {
        if (response.result === 'OK') {
            fillOffersCombobox(response.value);
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

function fillOffersCombobox(values) {
    var select = document.getElementById("rooms");
    select.innerHTML = '';
    for (var v of values) {
        var option = document.createElement('option')
        option.innerHTML = v.nrRoom;
        select.appendChild(option);
    }
}

export function requestAddRoomToOffer(nrOffer, nrRoom, price) {
    let idOffer = allOffers[nrOffer - 1].idOffer;
    var data = {
        idOffer: idOffer,
        nrRoom: nrRoom,
        price: price
    };
    function callback(response) {
        $('#errorPrice').text(response.message);
        if (response.result === 'OK') {
            fillRoomInOffers(nrOffer, nrRoom, price);
        }
    }
    requestServer(url, data, callback);
}

function fillRoomInOffers(nrOffer, nrRoom, price) {
    var tableRef = document.getElementById("tableOferty").getElementsByTagName('tbody')[0];
    var row = tableRef.rows[nrOffer - 1];
    row.cells[2].innerHTML = price;
    row.cells[3].innerHTML = nrRoom;
}
/*** END TAB-4 ***/

/*** TAB-5 ***/
export function deleteAdmins(nr, email) {
    var data = {
        email: email
    };
    function callback(response) {
        $('#deleteAdminsInfo').text(response.message);
        if (response.result === 'OK') {
            deleteAdminFromTable(nr);
        }
    }
    requestServer(url, data, callback);
}

function deleteAdminFromTable(nr) {
    var tableRef = document.getElementById("tableAdmin").getElementsByTagName('tbody')[0];
    tableRef.deleteRow(nr - 1);

    var select = document.getElementById("nrAdmin");
    select.remove(nr - 1);

    // Aktualizacja liczb porządkowych w tabeli i comboboxie:
    var options = select.getElementsByTagName('option');
    for (let i = nr - 1; i < tableRef.rows.length; ++i) {
        tableRef.rows[i].cells[0].innerHTML = i + 1;
        options[i].innerHTML = i + 1;
    }
}

var allAdmins = null;
export function requestAllAdmins() {
    var data = {
        admins: 'all'
    };
    function callback(response) {
        if (response.result === 'OK') {
            allAdmins = response.value;
            fillAdminsTable(allAdmins);
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

export function fillAdminsTable(values) {
    var tableRef = document.getElementById("tableAdmin").getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';
    let idx = 1;

    var select = document.getElementById("nrAdmin");
    select.innerHTML = '';

    for (var v of values) {
        // Insert a row in the table at row index 0
        var newRow = tableRef.insertRow(tableRef.rows.length)
        // Insert a cell in the row at index 0 and // Append a text node to the cell
        newRow.insertCell(0).appendChild(document.createTextNode(idx));
        newRow.insertCell(1).appendChild(document.createTextNode(v.name));
        newRow.insertCell(2).appendChild(document.createTextNode(v.surname));
        newRow.insertCell(3).appendChild(document.createTextNode(v.email));

        var option = document.createElement('option')
        option.innerHTML = idx++;
        select.appendChild(option);
    }
}
/*** END TAB-5 ***/