import { requestServer }
    from './requestServer.js'

var url = "./php/admin.php";

/***  TAB-2 ***/
export function requestAddNewRoomType(nameType, description) {
    var data = {
        nameType: nameType,
        description: description
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

    var select = document.getElementById("selectedRoom");
    select.innerHTML = '';

    for (var v of values) {
        // Insert a row in the table at row index 0
        var newRow = tableRef.insertRow(tableRef.rows.length)
        // Insert a cell in the row at index 0 and // Append a text node to the cell
        newRow.insertCell(0).appendChild(document.createTextNode(v.nrRoom));
        newRow.insertCell(1).appendChild(document.createTextNode(v.floor));
        newRow.insertCell(2).appendChild(document.createTextNode(v.sleeps));
        newRow.insertCell(3).appendChild(document.createTextNode(v.name));

        var option = document.createElement('option')
        option.innerHTML = v.nrRoom;
        select.appendChild(option);
    }
}

export function deleteRoom(nrRoom, id) {
    var data = {
        nrRoomForDelete: nrRoom
    };
    function callback(response) {
        $('#deleteRoomInfo').text(response.message);
        if (response.result === 'OK') {
            deleteRoomFromTable(id);
        }
    }
    requestServer(url, data, callback);
}

function deleteRoomFromTable(id) {
    var tableRef = document.getElementById("tableRoom").getElementsByTagName('tbody')[0];
    tableRef.deleteRow(id);

    var select = document.getElementById("selectedRoom");
    select.remove(id);
}
/*** END TAB-2 ***/

/*** TAB-3 ***/
export function requestAllBooking() {
    var data = {
        booking: 'all'
    };
    function callback(response) {
        if (response.result === 'OK') {
            fillBookingTable(response.value);
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

        newRow.insertCell(8).appendChild(document.createTextNode(v.price));

        var option = document.createElement('option')
        option.innerHTML = idx++;
        select.appendChild(option);
    }
}

export var date_diff_indays = function (from, to) {
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
    for (let i = nrBooking - 1; i < tableRef.rows.length; ++i) {
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
            requestAllOffersName();
        }
    }
    requestServer(url, data, callback);
}

var allOffers = null
export function requestAllOffers() {
    allOffers = null
    var data = {
        offer: 'all'
    };
    function callback(response) {
        if (response.result === 'OK') {
            allOffers = response.value;
            fillOffersTable(allOffers);
            if (isComboboxesFilled != undefined &&
                isComboboxesFilled == false) {
                isComboboxesFilled = true
                onAddRoomToOfferSelectChanged()
                onRoomFromOfferSelectChanged()
            }
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

    for (var v of values) {
        // Insert a row in the table at row index 0
        var newRow = tableRef.insertRow(tableRef.rows.length)
        // Insert a cell in the row at index 0 and // Append a text node to the cell
        newRow.insertCell(0).appendChild(document.createTextNode(idx));
        newRow.insertCell(1).appendChild(document.createTextNode(v.name));
        if (v.price != undefined) {
            newRow.insertCell(2).appendChild(document.createTextNode(v.price));
        } else {
            newRow.insertCell(2).appendChild(document.createTextNode(''));
        }
        if (v.nrRoom != undefined) {
            newRow.insertCell(3).appendChild(document.createTextNode(v.nrRoom));
        } else {
            newRow.insertCell(3).appendChild(document.createTextNode(''));
        }
        newRow.insertCell(4).appendChild(document.createTextNode(v.date_from));
        newRow.insertCell(5).appendChild(document.createTextNode(v.date_to));

        idx++;
    }
}

export function requestAllOffersName() {
    var data = {
        name: 'offersName'
    };
    function callback(response) {
        if (response.result === 'OK') {
            fillOffersNameCombobox(response.value);
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

var isComboboxesFilled = undefined
function fillOffersNameCombobox(values) {
    //Uzupełnienie dodaj pokoj do oferty:
    var select = document.getElementById("offers");
    select.innerHTML = '';

    // Uzupelninie usun pokoj z oferty
    var select2 = document.getElementById("selectedOfferSignedToRoom");
    select2.innerHTML = '';

    // Uzupełnienie usuń ofertę:
    var selectNameForDelete = document.getElementById("selectedOffer");
    selectNameForDelete.innerHTML = '';

    for (var v of values) {
        var optionOffers = document.createElement('option')
        optionOffers.innerHTML = v.name;
        select.appendChild(optionOffers);

        var optionName = document.createElement('option')
        optionName.innerHTML = v.name;
        select2.appendChild(optionName);

        var optionSelectedOffer = document.createElement('option')
        optionSelectedOffer.innerHTML = v.name;
        selectNameForDelete.appendChild(optionSelectedOffer);
    }
    fillRoomsCombobox(allRooms);

    if (allOffers != null) {
        isComboboxesFilled = true
        onAddRoomToOfferSelectChanged()
        onRoomFromOfferSelectChanged()
    }
    else {
        isComboboxesFilled = false
    }
}

function fillRoomsCombobox(values) {
    var select = document.getElementById("rooms");
    select.innerHTML = '';
    for (var v of values) {
        var option = document.createElement('option')
        option.innerHTML = v.nrRoom;
        select.appendChild(option);
    }
}

export function onAddRoomToOfferSelectChanged() {
    // Znajdujemy dane o pokoju z comboboxa
    // a potem szukamy pierwszego pokoju w wybranej ofercie w
    // w comboboxie o takich samych parametrach. Jeśli jest
    // to uzupełniamy pole z ceną i wyłączamy jego edycję.
    $('#errorPrice').text('')

    var select = document.getElementById("rooms");
    var nrRoom = select.options[select.selectedIndex].text

    var roomIdx = -1
    for (let i = 0; i < allRooms.length; i++) {
        if (allRooms[i].nrRoom == nrRoom) {
            roomIdx = i
        }
    }
    if (roomIdx != -1) {
        select = document.getElementById("offers")
        var price = document.getElementById("price")
        var offerName = select.options[select.selectedIndex].text
        for (var o of allOffers) {
            if (o.name != offerName) {
                continue
            }
            if (o.nrRoom == nrRoom) { // pokój jest już w ofercie
                price.value = ''
                price.disabled = true
                $('#add-room-offer').prop('disabled', true)
                return
            }
            if (compareRooms(roomIdx, o.nrRoom)) {
                price.value = o.price
                price.disabled = true
                $('#add-room-offer').prop('disabled', false)
                return
            }
        }
        price.value = ''
        price.disabled = false
        $('#add-room-offer').prop('disabled', false)
    }
}

function compareRooms(roomIdx, nrRoom) {
    for (let i = 0; i < allRooms.length; i++) {
        if (allRooms[i].nrRoom == nrRoom &&
            allRooms[i].sleeps == allRooms[roomIdx].sleeps &&
            allRooms[i].name == allRooms[roomIdx].name) {
                return true
        }
    }
    return false
}

export function requestAddRoomToOffer(nameOffer, nrRoom, price) {
    var data = {
        nameOffer: nameOffer,
        nrRoom: nrRoom,
        price: price
    };

    function callback(response) {
        $('#errorPrice').text(response.message);
        if (response.result === 'OK') {
            isComboboxesFilled = false
            requestAllOffers();
        }
    }
    requestServer(url, data, callback);
}

export function deleteOffer(nameOffer, id) {
    var data = {
        nameOfferToDelete: nameOffer
    };
    function callback(response) {
        $('#deleteOfferInfo').text(response.message);
        if (response.result === 'OK') {
            deleteOfferFromTable(nameOffer, id);
        }
    }
    requestServer(url, data, callback);
}

function deleteOfferFromTable(nameOffer, id) {
    var tableRef = document.getElementById("tableOferty").getElementsByTagName('tbody')[0];
    for (let i = 0; i < tableRef.rows.length; ++i) {
        if (tableRef.rows[i].cells[1].innerHTML === nameOffer) {
            tableRef.deleteRow(i)
            i--
        }
    }

    var select = document.getElementById("selectedOffer");
    select.remove(id);

    var selectNameOffer = document.getElementById("offers");
    selectNameOffer.remove(id);

    var selectedOfferSignedToRoom = document.getElementById("selectedOfferSignedToRoom");
    selectedOfferSignedToRoom.remove(id);

    onAddRoomToOfferSelectChanged()
}

export function deleteRoomFromOffer(nrRoom, idRowRoom, offerName) {
    var data = {
        nrRoom: nrRoom,
        offerName: offerName
    };
    function callback(response) {
        $('#deleteRoomInOfferInfo').text(response.message);
        if (response.result === 'OK') {
            deleteRoomFromOfferTable(nrRoom, offerName, idRowRoom);
        }
    }
    requestServer(url, data, callback);
}

function deleteRoomFromOfferTable(nrRoom, offerName, idRowRoom) {
    var tableRef = document.getElementById("tableOferty").getElementsByTagName('tbody')[0];
    for (let i = 0; i < tableRef.rows.length; ++i) {
        if (tableRef.rows[i].cells[1].innerHTML === offerName &&
            tableRef.rows[i].cells[3].innerHTML === nrRoom) {
            tableRef.deleteRow(i)
            allOffers.splice(i, 1)
            break
        }
    }

    var selectedRoomInOffer = document.getElementById("selectedRoomInOffer");
    selectedRoomInOffer.remove(idRowRoom);

    onRoomFromOfferSelectChanged()
}

export function onRoomFromOfferSelectChanged() {
    var selectOfferSignedToRoom = document.querySelector('#selectedOfferSignedToRoom');
    var offerName = selectOfferSignedToRoom.options[selectOfferSignedToRoom.selectedIndex].value;

    var selectRoomInOffer = document.querySelector('#selectedRoomInOffer');
    selectRoomInOffer.innerHTML = '';
    for(var i = 0; i< allOffers.length; i++) {
        if(allOffers[i].name == offerName) {
            var option = document.createElement('option')
            option.innerHTML = allOffers[i].nrRoom
            selectRoomInOffer.appendChild(option)
        }
    }
}
/*** END TAB-4 ***/

/*** TAB-5 ***/
export function deleteAdmin(nr, email) {
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

export function requestAllAdmins() {
    var data = {
        admins: 'all'
    };
    function callback(response) {
        if (response.result === 'OK') {
            fillAdminsTable(response.value);
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