var refs = {};
var ids = {};
if (localStorage.getItem('refs')) refs = JSON.parse(localStorage.getItem('refs'));
if (localStorage.getItem('ids')) ids = JSON.parse(localStorage.getItem('ids'));

function copyText(text) {
	//console.log('Copying',text,'to clipboard');
	var clipboard = document.getElementById('myclipboard');
	clipboard.value = text;
	clipboard.focus();
	clipboard.select();
	document.execCommand('Copy');
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	// calculate id
	var footnote_id;
	if (request.url in refs) footnote_id = refs[request.url];
	else {
		// we need to generate an id for our ref!
		var domain = parseUri(request.url).host.split('.');
		var name;

		var i = 0;
		var text = '';
		do {
			if (text.length <= domain[i].length) text = domain[i];
			++i;
		} while(i < domain.length);
		text = text.substring(0,4)

		var i = 0;
		var cand;
		do {
			cand = text + i;
			++i;
		} while(cand in ids);

		footnote_id = cand;
		ids[cand] = true; // store id

		// store the id
		refs[request.url] = footnote_id;
		localStorage.setItem('refs', JSON.stringify(refs));
		localStorage.setItem('ids', JSON.stringify(ids));
	}

	copyText('"' + request.selection + '" [' + footnote_id + ']\n\n[' + footnote_id + ']: ' + request.url + ' ' + '"' + request.title + '"');
}
);

// set up context menu
var ctxMenuEntry = chrome.contextMenus.create({
	type: 'normal',
	title: 'Copy without footnote',
	contexts: ['selection'],
	onclick: function(info, tab) {
		chrome.tabs.sendRequest(tab.id, {
			action: 'normalCopy',
		}, function(response) {
			copyText(response.selection);
		});
	}
});
