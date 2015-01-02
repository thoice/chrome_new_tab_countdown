jQuery(function() {
	progressItems.get();
	document.getElementById('add-progress-item').addEventListener('click', progressItems.addItem.bind(progressItems), false);
	document.getElementById('ex-link').addEventListener('click',  progressItems.exportItems.bind(progressItems), false);
});

var progressItems = {
    "apiBaseUrl": 'http://khliapov.com/myosotis/',
	"items": [],
	"template" : '<div class="progress-wrapper">\
		<div class="progress-frame" id="progress-frame-{{id}}">\
			<div class="progress-item" id="progress-item-{{id}}">\
				<div class="progress-item-close" id="progress-item-close-{{id}}">&times;</div>\
				<span>{{duedate}}</span>\
				<div class="progress-bar" id="progress-bar-{{id}}"></div>\
				<a href="{{url}}">{{name}}</a>\
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
		var itemTitle = progressItems.items[id]['title'];
		if (confirm('Are you sure you want to delete item ' + itemTitle + '?')) {
            progressItems.delete(id).bind(progressItems);
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
    		formattedItem = progressItems.formatItem(item.id, item.duedate, item.name, item.url);
    		html += formattedItem;
    	}
    	document.getElementById('container').innerHTML = html;
        jQuery('.progress-item-close').click(progressItems.removeItem);
	},
	"formatItem": function(id, duedate, name, url) {
		var html = progressItems.template;
        duedate = (duedate == '') ? '&nbsp;' : duedate;
		html = html.replace(/{{id}}/g, id)
			.replace(/{{duedate}}/g, duedate)
			.replace(/{{name}}/g, name)
			.replace(/{{url}}/g, url);
		return html;
	},
	"exportItems": function(event) {
		event.srcElement.href = 'data:application/json;base64,' + jQuery.base64.encode(JSON.stringify(this.items));
	},
    "addToCollectionAndRender": function(item) {
        if (undefined != item && undefined != item.id) {
            this.items[item.id] = item;
        }
        this.render(this.items);
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
                progressItems.render(data.items)
            }
        );

    },
    "get": function() {
        jQuery.ajax({
            'url': this.apiBaseUrl + 'items.json',
            'crossDomain': true
        }).done(
            function(data) {
                data.items.map(function(element) {
                    progressItems.items[element.id] = element;
                });
                progressItems.render(progressItems.items);
            }
        );
    },
    "delete": function(id) {
        debugger;
        var data = {'id' : id};
        jQuery.ajax({
            'url': this.apiBaseUrl + 'items',
            'type': 'DELETE',
            'data': data
        }).done(
            function(d) {
                debugger;
                progressItems.items.splice(id, 1);
                progressItems.render(progressItems.items);
                chrome.storage.sync.set({'progressItems': JSON.stringify(progressItems.items)});

                progressItems.items = d;
                progressItems.render(progressItems.items);
            }
        );
    }
};