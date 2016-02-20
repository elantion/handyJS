handyJS.ajax = {};
handyJS.ajax.request = function (options) {
	var self = this;
	var blankFun = function () {
	};
	self.xhr = new XMLHttpRequest();
	if (options.method === undefined) {
		options.method = 'GET';
	} else {
		options.method = options.method.toUpperCase();
	}
	if (options.async === undefined) {
		options.async = true;
	}
	if (!options.data) {
		options.segments = null;
	} else if (!Array.isArray(options.data)) {
		throw Error('Option.data must be an Array.');
	} else if (options.data.length === 0) {
		options.segments = null;
	} else {
		//detect the form to send data.
		if (options.method === 'POST') {
			options.data.forEach(function (segment) {
				if (segment === null) {
					throw Error('Do not send null variable.');
				} else if (typeof segment === 'object') {
					for (var key in segment) {
						if (segment.hasOwnProperty(key)) {
							if (segment[key] === undefined) {
								continue;
							}
							if (segment[key] instanceof Blob) {
								if (options.enctype === undefined) {
									options.enctype = 'FORMDATA';
									break;
								}
								if (options.enctype.toUpperCase() !== 'FORMDATA') {
									throw Error('You have to set dataForm to \'FormData\'' +
										' because you about to send file, or just ignore this property.');
								}
							}
							if (options.enctype === undefined) {
								options.enctype = 'URLENCODE';
							}
						}
					}
				} else {
					throw Error('You have to use {key: value} structure to send data.');
				}
			});
		} else {
			options.enctype = 'URLINLINE';
		}
	}
	//transform some type of value
	var transformValue = function (value) {
		if (value === null) {
			return '';
		}
		if (value === undefined) {
			return '';
		}
		switch (typeof value) {
			case 'object' :
				if (value instanceof Blob) {
					return value;
				} else {
					return JSON.stringify(value);
				}
				break;
			case 'string':
				return value;
			default :
				return value;
		}
	};
	//encode uri string
	//Copied from MDN, if wrong, pls info me.
	var encodeUriStr = function (str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
			return '%' + c.charCodeAt(0).toString(16);
		});
	};

	//add event handler. These handlers must added before open method.
	//set blank functions
	options.onProgress = options.onProgress || blankFun;
	options.onComplete = options.onComplete || blankFun;
	options.onFailed = options.onFailed || blankFun;
	options.onCanceled = options.onCanceled || blankFun;
	options.onLoadEnd = options.onLoadEnd || blankFun;
	self.xhr.addEventListener('progress', options.onProgress);
	self.xhr.addEventListener('load', options.onComplete);
	self.xhr.addEventListener('error', options.onFailed);
	self.xhr.addEventListener('abort', options.onCanceled);
	self.xhr.addEventListener('loadend', options.onLoadEnd);
	self.xhr.open(options.method, options.url, options.async, options.user, options.password);
	//digest the data decided by encode type
	//header setting must be done here
	switch (options.enctype.toUpperCase()) {
		case 'FORMDATA':
			console.log('Encode data as FormData type.');
			options.segments = new FormData();
			options.data.forEach(function (segment) {
				if(segment.fileName){
					for (let key in segment) {
						if (segment.hasOwnProperty(key)) {
							if(key !== 'fileName'){
								options.segments.append(key, segment[key], segment.fileName);
							}
						}
					}
				}else{
					for (let key in segment) {
						if (segment.hasOwnProperty(key)) {
							options.segments.append(key, transformValue(segment[key]));
						}
					}
				}
			});
			break;
		case 'URLINLINE':
			console.log('Encode data as url inline type.');
			options.segments = null;
			options.data.forEach(function (segment, index) {
				for (var key in segment) {
					if (segment.hasOwnProperty(key)) {
						var value = encodeUriStr(transformValue(segment[key]));
						if (index === 0) {
							options.url = options.url + '?' + value;
						} else {
							options.url = options.url + '&' + value;
						}
					}
				}
			});
			break;
		case 'URLENCODE':
			console.log('Encode data as url encode type.');
			self.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			options.segments = '';
			options.data.forEach(function (segment, index) {
				for (var key in segment) {
					if (segment.hasOwnProperty(key)) {
						var value = encodeUriStr((transformValue(segment[key])));
						if (index === 0) {
							options.segments = options.segments + key + '=' + value;
						} else {
							options.segments = options.segments + '&' + key + '=' + value;
						}
					}
				}
			});
			break;
	}
	self.xhr.send(options.segments);
};
handyJS.ajax.post = function (url, data, cb) {
	var self = this;
	self.request({
		method: 'POST',
		url: url,
		data: data,
		onComplete: function () {
			//get response content types
			var contentType = this.string.removeWhitespace(this.getResponseHeader('content-type').toLowerCase()).split(';');
			//callback with probably variables.
			if(contentType.indexOf('application/json') === -1){
				cb(this.responseText);
			}else{
				cb(JSON.parse(this.responseText));
			}
		}
	});
};
