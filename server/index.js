'use strict';
var handyJS = {};
//All bout file manipulate
handyJS.file = {};

// sources:
// http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
handyJS.file.getExtension = function (fileName) {
	return fileName.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
};

//usage: changeFileName('ding.js', 'dong'); => dong.js
handyJS.file.changeName = function (originalName, newName) {
	var extension = this.getExtension(originalName);
	return newName + '.' + extension;
};

handyJS.string = {};
//remove whitespace, tab and new line
handyJS.string.removeAllSpace = function (string) {
	return string.replace(/\s/g, '');
};
//only remove whitespace
handyJS.string.removeWhitespace = function (string) {
	return string.replace(/ /g, '');
};

module.exports = handyJS;