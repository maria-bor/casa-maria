export default changeProfile;

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