var sel = window.getSelection();
chrome.extension.sendRequest({
	selection: sel.toString(),
	title: document.title,
	url: document.URL}
);
