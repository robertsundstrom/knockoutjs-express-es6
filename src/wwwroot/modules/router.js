/// <reference path="/Scripts/crossroads/crossroads.js" />

import $ from "jquery";
import ko from "knockout";
import crossroads from "crossroads";
import hasher from "hasher";


//function change(state) {
//    if (state === null) {
//        crossroads.parse('/');
//    } else {
//        crossroads.parse(state.url);
//    }
//}

//$(window).bind("popstate", function (e) {
//    change(e.originalEvent.state);
//})

function activateCrossroads() {
	function parseHash(newHash, oldHash) {
		//if (newHash == "")
		//{
		//    if(location.pathname != "/" && location.pathname.length > 1)
		//    {
		//        newHash = location.pathname.slice(1);
		//    }
		//}
		crossroads.parse(newHash);
	}

	function changeHash(newHash, oldHash) {
		var route = newHash;
		//if (route) {
		//    history.replaceState({url: route}, "", location.protocol + '//' + location.host + '/' + route);
		//}
		//else {
		//    history.replaceState({url: '/' }, "", location.protocol + '//' + location.host);
		//}
		crossroads.parse(newHash);
	}
	crossroads.normalizeFn = crossroads.NORM_AS_OBJECT;

	hasher.initialized.add(parseHash);
	hasher.changed.add(changeHash);
	hasher.init();
}

class Router {
	constructor() {
		this.currentRoute = this.currentRoute = ko.observable({});
	}

	config(config) {
		ko.utils.arrayForEach(config.routes,(route) => {
			crossroads.addRoute(route.url,(requestParams) => {
				this.currentRoute(ko.utils.extend(requestParams, route.params));
			});
		});
		//crossroads.routed.add(console.log, console);
		activateCrossroads();
	}
}

export default new Router();