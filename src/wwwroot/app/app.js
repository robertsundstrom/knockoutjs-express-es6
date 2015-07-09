import $ from "jquery";
import ko from "knockout";
import"SteveSanderson/knockout-es5";
import projections from "js/knockout/knockout-projections.min.js";
import "knockout.validation";

import router from "modules/router";
import CustomBindingProvider from "modules/customBindingProvider";

import components from "./components";
import Main from "./main";

router.config({
	routes: [
		{url: '', params: {page: 'home'}},
		{url: 'about', params: {page: 'about'}},
		{url: 'foo', params: {page: 'foo'}},
	]
});

import "modules/validation";

ko.bindingProvider.instance = new CustomBindingProvider();

ko.track(Main);
ko.applyBindings(Main);