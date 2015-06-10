import $ from "jquery";
import ko from "knockout";
import"knockout-es5";
import projections from "js/knockout/knockout-projections.min.js";

import router from "modules/router";
import customBindingProvider from "modules/customBindingProvider";

import components from "./components";
import Main from "./main";

ko.bindingProvider.instance = new customBindingProvider();

ko.track(Main);
ko.applyBindings(Main);