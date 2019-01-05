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

function changeProfile(changedName, changedValue) {
    $.ajax({
        type: "POST",
        url: "./php/changeUserProfile.php",
        data: {
            name : changedName,
            value : changedValue
        },
        dataType : "text",
        success: function(response) {
            console.log(response);
        }
    })
    .done(function(response) {
        alert(response);
    })
    .fail(function( xhr, status, errorThrown ) {
        alert("Przepraszamy, wystąpił problem!");
        console.warn(xhr.responseText)
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
    });
}
// CHANGE NAME ON PROFILE
var changedName;
$('#name-change-butt').on('click', function () {
    if ($('#name-change-butt').val() === 'Zmień') {
        changedName = $('#userName').val();
        $('#userName').prop('disabled', false);
        $('#name-change-butt').prop('value', 'Ok');
    }
    else if ($('#name-change-butt').val() === 'Ok') {
        let newChangedName = $('#userName').val();
        if (/^[a-zA-Z]{3,20}?$/.test(newChangedName)) {
            $('#userName').prop('disabled', true);
            $('#name-change-butt').prop('value', 'Zmień');
            $('#errorName').empty();
            if (changedName != newChangedName) {
                changedName = newChangedName;
                changeProfile("new_name", changedName);
            }
        }
        else {
            $('#errorName').text('Niepoprawny format.');
        }
    }
});

// CHANGE SURNAME ON PROFILE
var changedSurname;
$('#surname-change-butt').on('click', function () {
    if ($('#surname-change-butt').val() === 'Zmień') {
        changedSurname = $('#userSurname').val();
        $('#userSurname').prop('disabled', false);
        $('#surname-change-butt').prop('value', 'Ok');
    }
    else if ($('#surname-change-butt').val() === 'Ok') {
        let newChangedSurname = $('#userSurname').val();
        if (/^[a-zA-Z]{3,20}?$/.test(newChangedSurname)) {
            $('#userSurname').prop('disabled', true);
            $('#surname-change-butt').prop('value', 'Zmień');
            $('#errorSurname').empty();
            if (changedSurname != newChangedSurname) {
                changedSurname = newChangedSurname;
                changeProfile("new_surname", changedSurname);
            }
        }
        else {
            $('#errorSurname').text('Niepoprawny format.');
        }
    }
});

// CHANGE EMAIL ON PROFILE
var changedEmail;
$('#email-change-butt').on('click', function () {
    if ($('#email-change-butt').val() === 'Zmień') {
        $('#userEmail').prop('disabled', false);
        $('#email-change-butt').prop('value', 'Ok');
    }
    else if ($('#email-change-butt').val() === 'Ok') {
        changedEmail = $('#userEmail').val();
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(changedEmail)) {
            $('#userEmail').prop('disabled', true);
            $('#email-change-butt').prop('value', 'Zmień');
            $('#errorEmail').empty();
        }
        else {
            $('#errorEmail').text('Niepoprawny format.');
        }
    }
});

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
