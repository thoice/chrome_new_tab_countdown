jQuery(function() {
    chrome.storage.sync.get('progressItems', function(d){
    	progressItems.parseAndRender(d);
    });

	jQuery( "#duedate" ).datepicker().datepicker("option", "dateFormat", "yy-mm-dd");

	document.getElementById('add-progress-item').addEventListener('click', progressItems.addItem.bind(progressItems), false);
	document.getElementById('ex-link').addEventListener('click',  progressItems.exportItems.bind(progressItems), false);
});

var progressItems = {
	"items": [],
	"template" : '<div class="progress-wrapper">\
		<div class="progress-frame" id="progress-frame-{{id}}">\
			<div class="progress-item" id="progress-item-{{id}}">\
				<div class="progress-item-close" id="progress-item-close-{{id}}">&times;</div>\
				<span>{{duedate}}</span>\
				<div class="progress-bar" id="progress-bar-{{id}}"></div>\
				<a href="{{url}}">{{title}}</a>\
			</div>\
		</div>\
	</div>',
	"getAllItems": function() {
		return progressItems.items;
	},
	"addItem": function(event) {
		console.log(this.items);
		event.stopPropagation();
		var duedate = document.getElementById('duedate');
		var title = document.getElementById('title');
		var url = document.getElementById('url');
		this.items.push({"duedate": duedate.value, "title": title.value, "url": url.value});
		duedate.value = '';
		title.value = '';
		url.value = '';
		chrome.storage.sync.set({'progressItems': JSON.stringify(this.items)});
		this.render(this.items);
	},
	"removeItem": function(event) {
		var id = this.id.replace('progress-item-close-', '');
		var itemTitle = progressItems.items[id]['title'];
		if (confirm('Are you sure you want to delete item ' + itemTitle + '?')) {
			progressItems.items.splice(id, 1);
			progressItems.render(progressItems.items);
			chrome.storage.sync.set({'progressItems': JSON.stringify(progressItems.items)});
		}
	},
	"parseAndRender": function(string) {
		if (typeof (string.progressItems) !== 'undefined') {
			this.items = JSON.parse(string.progressItems);
		} else {
			this.items = [];
		}
		this.render(progressItems.items);
	},
	"render": function(items) {
		document.getElementById('container').innerHTML = '';
		var formattedItem = '';
		var html = '';
		items.sort(function(a, b) {
			var aDate = new Date(a.duedate);
			var bDate = new Date(b.duedate);
			return aDate - bDate;
		});

		for (i in items) {
    		item = items[i];
    		formattedItem = progressItems.formatItem(i, item['duedate'], item['title'], item['url']);
    		html += formattedItem;
    	}
    	document.getElementById('container').innerHTML = html;

    	chrome.storage.sync.getBytesInUse(null,function(bytes){
			document.getElementById('usage').innerHTML = 'Used: ' + bytes + '/' + chrome.storage.sync.QUOTA_BYTES;
		});
		jQuery('.progress-item-close').click(progressItems.removeItem);
	},
	"formatItem": function(id, duedate, title, url) {
		html = progressItems.template;
		html = html.replace(/{{id}}/g, id)
			.replace(/{{duedate}}/g, duedate)
			.replace(/{{title}}/g, title)
			.replace(/{{url}}/g, url);
		return html;
	},
	"exportItems": function(event) {
		event.srcElement.href = 'data:application/json;base64,' + jQuery.base64.encode(JSON.stringify(this.items));
	}
};