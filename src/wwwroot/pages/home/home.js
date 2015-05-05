import ko from "knockout";

export default class HomeViewModel {
	constructor() {
		this.title = ko.observable("Welcome");
	}
}