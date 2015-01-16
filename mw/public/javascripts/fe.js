function getUser() {
    document.getElementById('pre-user').innerHTML = '';
    callMwGet('user', 'pre-user');
};

function getItem() {
    document.getElementById('pre-item-get').innerHTML = '';
    callMwGet('item', 'pre-item-get');
};

function addItem() {
    document.getElementById('pre-item-add').innerHTML = '';
    var data = JSON.stringify({
        value: document.getElementById('value').value
    });
    console.log(data);
    callMwPost('item', data, 'pre-item-add');
}

function callMwGet(resource, preId) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 ) {
            if (xmlhttp.status == 200) {
                var response = JSON.parse(xmlhttp.responseText);
                document.getElementById(preId).innerHTML = JSON.stringify(response.data);
            } else {
                alert(xmlhttp.status);
            }
        }
    }

    xmlhttp.open('GET', '/chipmunk?resource=' + resource, true);
    xmlhttp.send();
}

function callMwPost(resource, data, preId) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 ) {
            if (xmlhttp.status == 200) {
                var response = JSON.parse(xmlhttp.responseText);
                document.getElementById(preId).innerHTML = JSON.stringify(response.data);
            } else {
                alert(xmlhttp.status);
            }
        }
    }

    xmlhttp.open('POST', '/chipmunk?resource=' + resource, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json');
    xmlhttp.send(data);
}
