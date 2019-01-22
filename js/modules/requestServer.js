export function requestServer(url, json, callback) {
    $.ajax({
        type: "POST",
        url: url,
        data: json,
        dataType : "json",
        success: callback
    })
    .fail(function( xhr, status, errorThrown ) {
        console.warn(xhr.responseText)
        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
        alert("Przepraszamy, wystąpił problem!");
    });
}