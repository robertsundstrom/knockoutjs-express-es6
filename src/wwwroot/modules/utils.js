String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix) === 0;
};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.replaceAll = function(token, newToken, ignoreCase) {
    ignoreCase = typeof ignoreCase !== 'undefined' ? ignoreCase : false;
    var _token;
    var str = this + "";
    var i = -1;

    if (typeof token === "string") {

        if (ignoreCase) {

            _token = token.toLowerCase();

            while ((
                    i = str.toLowerCase().indexOf(
                    token, i >= 0 ? i + newToken.length : 0
                    )) !== -1
                    ) {
                str = str.substring(0, i) +
                        newToken +
                        str.substring(i + token.length);
            }

        } else {
            return this.split(token).join(newToken);
        }

    }
    return str;
};

Array.prototype.remove = function(value) {
	var index = this.indexOf(value);	
	if (index > -1) {
		this.splice(index, 1);
		return true;
	}
	return false;
};

Array.prototype.clear = function () {
	while (this.length > 0)
		this.pop();
};

Array.prototype.shuffle = function() {
    var o = new Array();
    for (var i = 0; i < this.length; i++)
        o.push(this[i]);
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
        ;
    return o;
};

var timeModifier = 0;

Date.prototype.getUnixTime = function(apply_modifier) {
    apply_modifier = typeof apply_modifier !== 'undefined' ? apply_modifier : true;
    return Math.round((this.getTime()) / 1000)+(apply_modifier ? timeModifier : 0);
};

Date.prototype.format = function(format) 
{
    var o = {
        "M+": this.getMonth() + 1, 
        "d+": this.getDate(), 
        "h+": this.getHours(), 
        "m+": this.getMinutes(),
        "s+": this.getSeconds(), 
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }

    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

Date.prototype.modify = function(seconds){
	return new Date(this.getTime() + (seconds*1000));
}

String.prototype.matchAll = function(regexp) {
  var matches = [];
  this.replace(regexp, function() {
    var arr = ([]).slice.call(arguments, 0);
    var extras = arr.splice(-2);
    arr.index = extras[0];
    arr.input = extras[1];
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

export function delay(ms) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				resolve(undefined);
			} catch(error) {
				reject(error);
			}
		}, ms);
	});
}

export function isConstructor(func) {
	if(func.constructor == Function) return true;
	return false;
}

export function serialize(obj) {
	var str = "";
	var names = Object.getOwnPropertyNames(obj);
	var length = names.length;
	for(let i = 0; i < length; i++) {
		var prop = names[i];
		var value = obj[prop];
		str += `\'${prop}\': ${value}`;
		if(i < (length - 1)) {
			str += ", ";
		}
	}
	return `{${str}}`;
}