import ko from "knockout";
import "knockout.validation";

ko.validation.rules.pattern.message = 'Invalid.';

ko.validation.init({
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    //parseInputAttributes: true,
    writeInputAttributes: true,
    messageTemplate: null
}, true);

ko.extenders.trackChange = function (target, track) {
    if (track) {
        target.isDirty = ko.observable(false);
        target.originalValue = target();
        target.subscribe(function (newValue) {
            // use != not !== so numbers will equate naturally
            target.isDirty(newValue != target.originalValue);
        });
    }
    return target;
};

var originalTrack = ko.track;

ko.track = function (viewModel) {
	originalTrack(viewModel);
	/*
	var observables = ko.es5.getAllObservablesForObject(viewModel);
	for(var prop in observables) {
		var observable = observables[prop];
		observable.extend({
                     required: true });
	}
    */
}