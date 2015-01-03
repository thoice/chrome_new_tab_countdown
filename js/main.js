jQuery(function() {
    itemsManager.get();
	document.getElementById('add-progress-item').addEventListener('click', itemsManager.addItem.bind(itemsManager), false);
	//document.getElementById('ex-link').addEventListener('click',  progressItems.exportItems.bind(progressItems), false);
});

var itemsManager = {
    "apiBaseUrl": 'http://khliapov.loc/myosotis/',
	"items": [],
	"template" : '<div class="progress-wrapper">\
		<div class="progress-frame" id="progress-frame-{{id}}">\
			<div class="progress-item" id="progress-item-{{id}}">\
				<div class="progress-item-close" id="progress-item-close-{{id}}">&times;</div>\
				<span>{{duedate}}</span>\
				<div class="progress-bar" id="progress-bar-{{id}}"></div>\
				<a href="{{url}}" data-item-title="{{name}}" id="item-title-{{id}}">{{name}}</a>\
			</div>\
		</div>\
	</div>',
	"addItem": function(event) {
		event.stopPropagation();
        event.preventDefault();
		var duedate = document.getElementById('duedate');
		var name = document.getElementById('name');
		var url = document.getElementById('url');
        var type = document.getElementById('type');
        var item = {
            "duedate": duedate.value,
            "name": name.value,
            "url": url.value,
            "type": type.value
        };
		duedate.value = '';
        name.value = '';
		url.value = '';
        type.value = 'none';
		this.post(item);
	},
	"removeItem": function(event) {
		var id = this.id.replace('progress-item-close-', '');
		var itemTitle = document.getElementById('item-title-' + id).dataset.itemTitle;
		if (confirm('Are you sure you want to delete item ' + itemTitle + '?')) {
            itemsManager.delete(id);
		}
	},
	"render": function(items) {
		document.getElementById('container').innerHTML = '';
		var formattedItem;
		var html = '';
		items.sort(function(a, b) {
			var aDate = new Date(a.duedate);
			var bDate = new Date(b.duedate);
			return aDate - bDate;
		});

		for (var i in items) {
    		var item = items[i];
    		formattedItem = itemsManager.formatItem(item.id, item.duedate, item.name, item.url);
    		html += formattedItem;
    	}
    	document.getElementById('container').innerHTML = html;
        jQuery('.progress-item-close').click(itemsManager.removeItem);
	},
	"formatItem": function(id, duedate, name, url) {
		var html = itemsManager.template;
        duedate = (duedate == '') ? '&nbsp;' : duedate;
		html = html.replace(/{{id}}/g, id)
			.replace(/{{duedate}}/g, duedate)
			.replace(/{{name}}/g, name)
			.replace(/{{url}}/g, url);
		return html;
	},
	//"exportItems": function(event) {
	//	event.srcElement.href = 'data:application/json;base64,' + jQuery.base64.encode(JSON.stringify(this.items));
	//},
    "updateCollectionAndRender": function(items) {
        items.map(function(element) {
            itemsManager.items[element.id] = element;
        });
        itemsManager.render(itemsManager.items);
    },
    "post": function(item) {
        var data = {'item': item};
        jQuery.ajax({
            'url': this.apiBaseUrl + 'items.json',
            'type': 'POST',
            'dataType': 'json',
            'data': data,
            'crossDomain': true
        }).done(
            function(data) {
                itemsManager.render(data.items)
            }
        );

    },
    "get": function() {
        jQuery.ajax({
            'url': this.apiBaseUrl + 'items.json',
            'crossDomain': true
        }).done(
            function(data, textStatus, jqXHR) {
                itemsManager.updateCollectionAndRender(data.items);
            }
        );
    },
    "delete": function(id) {
        var data = {'id' : id};
        jQuery.ajax({
            'url': this.apiBaseUrl + 'items.json',
            'type': 'DELETE',
            'dataType': 'json',
            'data': data,
            'crossDomain': true
        }).done(function(data, textStatus, jqXHR) {
                itemsManager.render(data.items);
            }
        ).fail(function(jqXHR, textStatus, errorThrown) {
                debugger;
            }
        ).always(function(data, textStatus, jqXHR) {}
        );
        return this;
    }
};