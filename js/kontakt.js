function _(id) {
    return document.getElementById(id);
}
function submitForm() {
    _('contactButt').disable = true;
    _('status').innerHTML = 'proszę zaczekać...';
    var formData = new FormData();
    formData.append('nameContact', _('nameContact').value);
    formData.append('emailContact', _('emailContact').value);
    formData.append('messageContact', _('messageContact').value);
    var ajax = new XMLHttpRequest();
    ajax.open('POST', './php/kontakt.php');
    ajax.onreadystatechange = function() {
        if(ajax.readyState == 4 && ajax.status == 200) {
            if(ajax.responseText == 'success') {
                _(form-contact).innerHTML = '<h2>Dziękujemy ' + _('nameContact').value + ', twoja wiadomość została wysłana.</h2>';
            } else {
                _('status').innerHTML = ajax.responseText;
                _('contactButt').disable = false;
            }
        }
    }
    ajax.send(formData);
}