import {
    setCookie,
    getCookie 
} 
    from './cookieModule.js';
import {
    requestAllRoomTypes,
    requestAllOffers,
    requestAllOffersName,
    requestAllRooms,
    requestAllBooking,
    requestAllAdmins
}
    from './adminServerCalls.js'

import {
    requestAllUserBooking
}
    from './userServerCall.js';

/*** ZMIANA TABÓW NA PROFILU ADMINA***/
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
        requestAllRooms();
        requestAllOffersName();
    });
}

function setupTab5ClickHandler() {
    $("#tab-5").on('click', function () {
        setCookie("nameOfLastTabClicked", "#tab-5", 30);
        requestAllAdmins();
    });
}

/*** ZMIANA TABÓW NA PROFILU UŻYTKOWNIKA***/
export function loadSideMenu() {
    var nameOfLastClicked = getCookie("nameOfLastClicked");
    if (nameOfLastClicked === "") {
        nameOfLastClicked = "#profile";
        setCookie("nameOfLastClicked", nameOfLastClicked, 30);
    }
    $(nameOfLastClicked).click();
    return nameOfLastClicked;
}

export function setupSideMenuClickHandler() {
    setupClickHandler("#profile");
    setupSideMenuDeleteClickHandler();
}

function setupClickHandler(tabName) {
    $(tabName).on('click', function () {
        setCookie("nameOfLastClicked", tabName, 30);
    });
}

function setupSideMenuDeleteClickHandler() {
    $("#delete").on('click', function () {
        setCookie("nameOfLastClicked", "#delete", 30);
        requestAllUserBooking();
    });
}