//All bout file manipulate
handyJS.file = {};

// sources:
// http://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
handyJS.file.getExtension = function (fileName) {
	return fileName.slice((Math.max(0, fileName.lastIndexOf('.')) || Infinity) + 1);
};

//usage: changeFileName('ding.js', 'dong'); => dong.js
handyJS.file.changeName = function (originalName, newName) {
	var extension = this.getFileExtension(originalName);
	return newName + '.' + extension;
};
