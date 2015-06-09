import ko from "knockout";

export default class HomeViewModel {
	constructor() {
		this.title = "Welcome";
		this.counter = 0;
	}

	click() {
		this.counter++;
		this.title = `Count: ${this.counter}`;
	}
}