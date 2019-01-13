import { setupChangeNameHandler, setupChangeSurnameHandler, setupChangeEmailHandler } from './changeProfile.js';

$(function () {
    $(".menu-toggle").on("click", function (e) {
        if ($(this).hasClass("nav")) {
            $("nav").addClass("open");
        }
        e.stopPropagation();
    });

    $("body:not(nav)").on("click", function (e) {
        $("nav").removeClass("open");
    });
});

window.logout = logout;
function logout() {
    window.location.replace("./php/logout.php");
}

var card = $('.card');
var cardProfile = $('.modal-user-profile');
$(function () {
    $('#profile').on('click', function (params) {
        card.empty();
        card.append(cardProfile.css({
            'display': 'flex',
            'flex-direction': 'column'
        }));
        cardProfile.children().css({ 'padding': '20px' });
        $('.modal-user-profile div label').css({
            'display': 'block',
        });
    })
});

var cardReservation = $('.modal-user-reservation');
var cardReservationInfo = $('.reserve-info');
$(function () {
    $('#reservation').on('click', function (params) {
        card.empty();
        cardReservation.css({
            'display': 'flex',
            'flex-direction': 'column'
        });
        cardReservationInfo.css({ 'padding': '20px' });
        cardReservation.append(cardReservationInfo);
        card.append(cardReservation);
    })
});

var cardReservationDelete = $('.modal-user-reservation-delete');
$(function () {
    $('#delete').on('click', function (params) {
        card.empty();
        cardReservationDelete.css({
            'display': 'flex',
            'flex-direction': 'column'
        });
        $('.modal-user-reservation-delete #user-reservation-table').css({ 'margin': '20px' });
        card.append(cardReservationDelete);
    })
});

// ***USER DATA***
$(setupChangeNameHandler());
$(setupChangeSurnameHandler());
$(setupChangeEmailHandler());

// CHANGE PASSWORD ON PROFILE
var changedPassword;
$('#password-change-butt').on('click', function () {
    if ($('#password-change-butt').val() === 'Zmień') {
        $('#userPassword').prop('disabled', false);
        $('#password-change-butt').prop('value', 'Ok');
    }
    else if ($('#password-change-butt').val() === 'Ok') {
        changedPassword = $('#userPassword').val().trim();
        if ((changedPassword.length >= 8) && (changedPassword.length <= 20)) {
            $('#userPassword').prop('disabled', true);
            $('#password-change-butt').prop('value', 'Zmień');
            $('#errorPassword').empty();
        }
        else {
            $('#errorPassword').text('Niepoprawny format.');
        }
    }
});

// CHANGE DATE TO ON PROFILE
var changedTo;
$('#od-change-butt').on('click', function () {
    if ($('#od-change-butt').val() === 'Zmień') {
        $('#od-reserve').prop('disabled', false);
        $('#od-change-butt').prop('value', 'Ok');
    }
    else if ($('#od-change-butt').val() === 'Ok') {
        changedTo = $('#od-reserve').val();
        if (changedTo < $('#do-reserve').val()) {
            $('#od-reserve').prop('disabled', true);
            $('#od-change-butt').prop('value', 'Zmień');
            $('#errorTo').empty();
        }
        else {
            $('#errorTo').text('Niepoprawny format.');
        }
    }
});

// CHANGE DATE FROM ON PROFILE
var changedDateTo;
$('#do-change-butt').on('click', function () {
    if ($('#do-change-butt').val() === 'Zmień') {
        $('#do-reserve').prop('disabled', false);
        $('#do-change-butt').prop('value', 'Ok');
    }
    else if ($('#do-change-butt').val() === 'Ok') {
        changedDateTo = $('#do-reserve').val();
        if (changedDateTo > $('#od-reserve').val()) {
            $('#do-reserve').prop('disabled', true);
            $('#do-change-butt').prop('value', 'Zmień');
            $('#errorDateTo').empty();
        }
        else {
            $('#errorDateTo').text('Data wyjazdu powinna być później aniżeli przyjazdu.');
        }
    }
});
