import {
    setCookie,
    getCookie } 
    from './cookieModule.js';
import {
    requestAllRoomTypes,
    requestAllOffers,
    requestAllRoomsNumbers,
    requestAllRooms
}
    from './adminServerCalls.js'

export function loadTab() {
    var nameOfLastTabClicked = getCookie("nameOfLastTabClicked");
    if (nameOfLastTabClicked === "") {
        nameOfLastTabClicked = "#tab-1";
        setCookie("nameOfLastTabClicked", nameOfLastTabClicked, 30);
    }
    $(nameOfLastTabClicked).click();
    return nameOfLastTabClicked;
}

export function setupTabClickHandlers() {
    setupTabClickHandler("#tab-1");
    setupTab2ClickHandler();
    setupTabClickHandler("#tab-3");
    setupTab4ClickHandler();
    setupTabClickHandler("#tab-5");
}

function setupTabClickHandler(tabName) {
    $(tabName).on('click', function () {
        setCookie("nameOfLastTabClicked", tabName, 30);
    });
}

function setupTab2ClickHandler() {
    $("#tab-2").on('click', function () {
        setCookie("nameOfLastTabClicked", "#tab-2", 30);
        requestAllRoomTypes();
        requestAllRooms();
    });
}

function setupTab4ClickHandler() {
    $("#tab-4").on('click', function () {
        setCookie("nameOfLastTabClicked", "#tab-4", 30);
        requestAllOffers();
        requestAllRoomsNumbers();
    });
}