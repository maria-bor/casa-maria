import {
    setCookie,
    getCookie } 
    from './cookieModule.js';

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
    for(var i = 1; i <= 5; ++i) {
        setupTabClickHandler("#tab-"+i);
    }
}

function setupTabClickHandler(tabName) {
    $(tabName).on('click', function () {
        setCookie("nameOfLastTabClicked", tabName, 30);
    });
}