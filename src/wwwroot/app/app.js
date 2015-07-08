import $ from "jquery";
import ko from "knockout";
import"knockout-es5";
import projections from "js/knockout/knockout-projections.min.js";

import router from "modules/router";
import customBindingProvider from "modules/customBindingProvider";

import components from "./components";
import Main from "./main";

router.config({
	routes: [
		{url: '', params: {page: 'home'}},
		{url: 'about', params: {page: 'about'}},
		{url: 'foo', params: {page: 'foo'}},
	]
});

ko.bindingProvider.instance = new customBindingProvider().initialize();

ko.track(Main);
ko.applyBindings(Main);