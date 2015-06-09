import ko from "knockout";
import $ from "jquery";
import testTemplate from "./greeter.html!text";

class testViewModel {
	constructor(params) {		
		this.name = params.name;
	}
}

export default { viewModel: testViewModel, template: testTemplate };