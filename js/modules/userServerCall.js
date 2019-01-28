import { requestServer }
    from './requestServer.js'

var url = "./php/user.php";

/*** PROFIL ***/
/*** TWOJE REZERWACJE ***/

/*** USUŃ REZERWACJE ***/
var allBooking = null;
export function requestAllUserBooking() {
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
    var tableRef = document.getElementById("user-reservation-delete-table").getElementsByTagName('tbody')[0];
    tableRef.innerHTML = '';
    var idx = 1;

    for (var v of values) {
        var buttonDelete = document.createElement("input");
        var id = "deleteBooking-" + idx;
        buttonDelete.id = id;
        buttonDelete.className = "butt-delete";
        buttonDelete.type = "button";
        buttonDelete.value = "Usuń";
        buttonDelete.setAttribute('idx', idx - 1);
        buttonDelete.setAttribute('date_from', v.date_from);
        buttonDelete.setAttribute('date_to', v.date_to);

        buttonDelete.addEventListener('click', function () {
            deleteSelectedUserBooking(this.getAttribute('date_from'), this.getAttribute('date_to'), this.getAttribute('idx'), tableRef);
        });

        // Insert a row in the table at row index 0
        var newRow = tableRef.insertRow(tableRef.rows.length)
        // Insert a cell in the row at index 0 and // Append a text node to the cell
        newRow.insertCell(0).appendChild(document.createTextNode(idx));
        console.log("IDX: " + idx)
        newRow.insertCell(1).appendChild(document.createTextNode(v.date_from));
        newRow.insertCell(2).appendChild(document.createTextNode(v.date_to));
        newRow.insertCell(3).appendChild(buttonDelete);

        idx++;
    }
}

function deleteSelectedUserBooking(date_from, date_to, idx, tableRef) {
    var data = {
        date_from: date_from,
        date_to: date_to
    };
    function callback(response) {
        if (response.result === 'OK') {
            deleteRowFromTableBookingUser(idx, tableRef);
            requestAllUserBooking();
        } else {
            alert(response.message);
        }
    }
    requestServer(url, data, callback);
}

function deleteRowFromTableBookingUser(idx, tableRef) {
    tableRef.deleteRow(idx);
}