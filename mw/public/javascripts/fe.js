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
                document.getElementById(preId).innerHTML = response[1];
            } else if (xmlhttp.status == 400) {
                alert('There was an error 400');
            } else {
                alert('something else other than 200 was returned');
            }
        }
    }

    xmlhttp.open('GET', '/chipmunk?resource=' + resource, true);
    xmlhttp.send();
}