import ko from "knockout";
import router from "modules/router";

class Main {
	constructor() {
		this.title = ko.observable("My site");
		this.route = router.currentRoute;
		
	}

}

export default new Main();