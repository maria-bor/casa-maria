import {
    setCookie,
    getCookie } 
    from './cookieModule.js';
import {
    requestAllRoomTypes,
    requestAllOffers,
    requestAllRoomsNumbers,
    requestAllRooms,
    requestAllBooking,
    requestAllAdmins
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
    setupTab3ClickHandler();
    setupTab4ClickHandler();
    setupTab5ClickHandler();
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

function setupTab3ClickHandler() {
    $("#tab-3").on('click', function () {
        setCookie("nameOfLastTabClicked", "#tab-3", 30);
        requestAllBooking()
    });
}

function setupTab4ClickHandler() {
    $("#tab-4").on('click', function () {
        setCookie("nameOfLastTabClicked", "#tab-4", 30);
        requestAllOffers();
        requestAllRoomsNumbers();
    });
}

function setupTab5ClickHandler() {
    $("#tab-5").on('click', function () {
        setCookie("nameOfLastTabClicked", "#tab-5", 30);
        requestAllAdmins();
    });
}