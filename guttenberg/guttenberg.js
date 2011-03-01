var refs = {};
var ids = {};
if (localStorage.getItem('refs')) refs = JSON.parse(localStorage.getItem('refs'));
if (localStorage.getItem('ids')) ids = JSON.parse(localStorage.getItem('ids'));

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	var clipboard = document.getElementById('myclipboard');

	// calculate id
	var footnote_id = 'undef'
	if (request.url in refs) footnote_id = refs[request.url];
	else {
		// we need to generate an idea for our ref!
		var domain = parseUri(request.url).host.split('.');
		var name;

		var i = 0;
		var text = 'undef';
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

	clipboard.value = '"' + request.selection + '" [source][' + footnote_id + ']\n\n[' + footnote_id + ']: ' + request.url + ' ' + '"' + request.title + '"';
	clipboard.focus();
	clipboard.select();
	document.execCommand('Copy');
}
);

chrome.browserAction.onClicked.addListener(function(tab) {
	// run script in tab context
	chrome.tabs.executeScript(tab.id, {'file': 'guttencopy.js'});
});
