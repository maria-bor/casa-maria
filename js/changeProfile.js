export {setupChangeNameHandler, setupChangeSurnameHandler, setupChangeEmailHandler};

function changeProfile(changedName, changedValue, attributeName) {
    $.ajax({
        type: "POST",
        url: "./php/changeUserProfile.php",
        data: {
            name : changedName,
            value : changedValue
        },
        dataType : "json",
        success: function(response) {
            if (response.value.length != 0)
                $('#user'+attributeName).val(response.value);
            if (response.result == 'OK') {
                alert(response.message);
            }
            else
                $('#error'+attributeName).text(response.message);
        }
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
function setupChangeNameHandler() {
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
                    changeProfile("new_name", changedName, 'Name');
                }
            }
            else {
                $('#errorName').text('Niepoprawny format.');
            }
        }
    });
}

// CHANGE SURNAME ON PROFILE
var changedSurname;
function setupChangeSurnameHandler() {
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
                    changeProfile("new_surname", changedSurname, 'Surname');
                }
            }
            else {
                $('#errorSurname').text('Niepoprawny format.');
            }
        }
    });
}

var changedEmail;
function setupChangeEmailHandler() {
    // CHANGE EMAIL ON PROFILE
    $('#email-change-butt').on('click', function () {
        if ($('#email-change-butt').val() === 'Zmień') {
            changedEmail = $('#userEmail').val();
            $('#userEmail').prop('disabled', false);
            $('#email-change-butt').prop('value', 'Ok');
        }
        else if ($('#email-change-butt').val() === 'Ok') {
            let newChangedEmail = $('#userEmail').val();
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newChangedEmail)) {
                $('#userEmail').prop('disabled', true);
                $('#email-change-butt').prop('value', 'Zmień');
                $('#errorEmail').empty();
                if (changedEmail != newChangedEmail) {
                    changedEmail = newChangedEmail;
                    changeProfile("new_email", changedEmail, 'Email');
                }
            }
            else {
                $('#errorEmail').text('Niepoprawny format.');
            }
        }
    });
}