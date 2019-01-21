import { requestServer }
    from './requestServer.js'

export function requestAddNewRoomType(nameType) {
    console.log("requestAddNewRoomType");
    var url = "./php/admin.php";
    var data = {
        nameType: nameType
    };
    function callback(response) {
        document.getElementById("nameTypeInfo").innerHTML = response.message;
        if (response.result === 'OK') {

        }
    }

    requestServer(url, data, callback);
}

export function requestAllRoomTypes() {
    console.log("requestAllRoomTypes");
    var url = "./php/admin.php";
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