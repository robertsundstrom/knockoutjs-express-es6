import ko from "knockout";
import { Iterable } from "modules/linq";

export default class TestViewModel {
	constructor() {
		this.title = "Test";
		this.text = "Click me";
		this.counter = 0;
		
		var items = [{id: 1, type: "boo"}, {id: 2, type: "foo"}, {id: 3, type: "boo"}];
		var result = items.groupBy(x => x.type);
		console.log(result);
	}

	click() {
		this.counter++;
		this.text = `Count: ${this.counter}`;
	}
}