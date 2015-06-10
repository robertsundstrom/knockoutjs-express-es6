import ko from "knockout";

export default class TestViewModel {
	constructor() {
		this.title = "Test";
		this.text = "Click me";
		this.counter = 0;
	}

	click() {
		this.counter++;
		this.text = `Count: ${this.counter}`;
	}
}