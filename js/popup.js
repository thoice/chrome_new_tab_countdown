document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('btn-send').addEventListener('click', send);
    fillForm();
});

function send(e) {
    e.currentTarget.preventDefault = true;
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