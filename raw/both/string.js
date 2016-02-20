handyJS.string = {};
//remove whitespace, tab and new line
handyJS.string.removeAllSpace = function (string) {
	return string.replace(/\s/g, '');
};
//only remove whitespace
handyJS.string.removeWhitespace = function (string) {
	return string.replace(/ /g, '');
};