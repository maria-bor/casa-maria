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
            'flex-direction': 'column' }));
        cardProfile.children().css({ 'padding': '20px' });
        $('.modal-user-profile div label').css({ 
            'display': 'block', 
            'padding-bottom': '5px' });
    })
});

var cardReservation = $('.modal-user-reservation');
var cardReservationInfo = $('.reserve-info');
$(function () {
    $('#reservation').on('click', function (params) {
        card.empty();
        cardReservation.css({ 
            'display': 'flex', 
            'flex-direction': 'column' });
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
            'flex-direction': 'column' });
        $('.modal-user-reservation-delete #user-reservation-table').css({'margin': '20px'});
        card.append(cardReservationDelete);
    })
});