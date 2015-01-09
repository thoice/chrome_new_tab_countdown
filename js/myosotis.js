var apiBaseUrl = 'http://khliapov.loc/myosotis/';

function send(data, doneCallback, failCallback)
{
    var requestData = {
        'item': {
            'name': data.name,
            'url': data.url
        }
    };

    jQuery.ajax({
        'url': apiBaseUrl + 'items.json',
        'type': 'POST',
        'dataType': 'json',
        'data': requestData,
        'crossDomain': true
    }).done(
        function(data, textStatus, jqXHR) {
            doneCallback(data, textStatus, jqXHR);
        }
    ).fail(
        function(jqXHR, textStatus, errorThrown){
            failCallback(jqXHR, textStatus, errorThrown);
        }
    );

}