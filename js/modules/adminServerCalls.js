import { requestServer }
    from './requestServer.js'

var url = "./php/admin.php";

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
    }
    requestServer(url, data, callback);
}

export function requestAddNewOffer(name, price, from, to) {
    var data = {
        name: name,
        price: price,
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

export function requestAllOffers() {
    var data = {
        offer: 'all'
    };
    function callback(response) {
        if (response.result === 'OK') {
            fillOffersTable(response.value);
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

export function fillOffersTable(values) {
    // table
    var tableRef = document.getElementById("tableOferty").getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';
    let idx = 1;
    // combobox
    var select = document.getElementById("offers");
    select.innerHTML = '';

    for (var v of values) {
        // Insert a row in the table at row index 0
        var newRow = tableRef.insertRow(tableRef.rows.length)
        // Insert a cell in the row at index 0 and // Append a text node to the cell
        newRow.insertCell(0).appendChild(document.createTextNode(idx));
        newRow.insertCell(1).appendChild(document.createTextNode(v.name));
        newRow.insertCell(2).appendChild(document.createTextNode(v.price));
        newRow.insertCell(3).appendChild(document.createTextNode(''));
        newRow.insertCell(4).appendChild(document.createTextNode(v.date_from));
        newRow.insertCell(5).appendChild(document.createTextNode(v.date_to));

        var option = document.createElement('option')
        option.innerHTML = idx++;
        select.appendChild(option);
    }
}

export function requestAllRooms() {
    var data = {
        room: 'all'
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