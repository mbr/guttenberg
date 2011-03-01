chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
	console.log('request from outside', request, sender, sendResponse);
	var clipboard = document.getElementById('myclipboard');
	var footnote_id  = 'bla';
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
