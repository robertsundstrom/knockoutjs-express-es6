import ko from "knockout";

class AboutViewModel {
	constructor() {
		this.title = ko.observable("About");
	}
}

export default new AboutViewModel(); 