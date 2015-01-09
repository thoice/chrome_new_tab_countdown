document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('btn-send').addEventListener('click', sendClickHandler);
    fillForm();
});

function sendClickHandler(event) {
    event.preventDefault();
    var data = {
        'name': document.getElementById('name').value,
        'url': document.getElementById('url').value
    };

    send(data, doneCallback, failCallback);
    debugger;
}

function doneCallback(data, b, c) {
    debugger;
}

function failCallback(data, b, c) {
    debugger;
}

function fillForm() {
    var port;
    chrome.tabs.query({active: true , currentWindow: true}, function(tab){
        var activeTabId = tab[0].id;
        var msg = {};

        chrome.tabs.executeScript(activeTabId, {file: "js/content_script.js"}, function(){
            chrome.tabs.sendMessage(activeTabId, msg, function(response) {
                if (response.success) {
                    // TODO extract this and new tab form to a separate file or template.
                    //var duedate = document.getElementById('duedate');
                    var name = document.getElementById('name');
                    var url = document.getElementById('url');
                    //var type = document.getElementById('type');
                    name.value = response.data.name;
                    url.value = response.data.url;
                }
            });
        });
    });
}