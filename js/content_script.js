var dataFetcher = {
    'data': {},
    'getPageData': function() {
        var handler = window.location.hostname.replace(/[^a-zA-Z0-9]/g,'');
        var response = {'success': false};
        if (this.hasOwnProperty(handler)) {
            response.success = true;
            response.data = this[handler]();
        }
        return response;
    },
    'wwwimdbcom': function() {
        return {
            'name':document.querySelectorAll('#overview-top .header .itemprop')[0].innerHTML,
            'url': window.location.href};
    }
};

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse){
        var response = dataFetcher.getPageData();
        sendResponse(response);
    }
);
