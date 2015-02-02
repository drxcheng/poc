function getUser() {
    document.getElementById('pre-user').innerHTML = '';
    callMw('user', 'pre-user');
};

function getItem() {
    document.getElementById('pre-item').innerHTML = '';
    callMw('item', 'pre-item');
};

function callMw(resource, preId) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 ) {
            if (xmlhttp.status == 200) {
                var response = JSON.parse(xmlhttp.responseText);
                document.getElementById(preId).innerHTML = JSON.stringify(response);
            }
        }
    }

    xmlhttp.open('GET', '/api/poc/' + resource, true);
    xmlhttp.send();
}