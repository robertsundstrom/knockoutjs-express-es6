export default class Iterable {
	select(expr) {
		return new SelectIterable(this, expr);
	}

	selectMany(expr) {
		return new SelectManyIterable(this, expr);
	}

	take(limit) {
		return new TakeIterable(this, limit);
	}

	skip(limit) {
		return new SkipIterable(this, limit);
	}

	firstOrDefault(predicate) {
		if (predicate === undefined) {
			return this[0];
		}
		if (predicate === null) {
			throw "Predicate is missing.";
		}
		var source = this;
		var match = null;
		for (let item of source) {
			if (predicate(item)) {
				return item;
			}
		}
	}

	first(predicate) {
		var result = this.firstOrDefault(predicate);
		if (result === null) {
			if (predicate === undefined)
				throw "No items.";
			else
				throw "No match.";
		}
		return result;
	}

	any(predicate) {
		if (predicate === undefined || predicate === null) {
			throw "Predicate is missing.";
		}
		return this.first(predicate) !== null;
	};

	where(predicate) {
		return new WhereIterable(this, predicate);
	}

	groupBy(expr) {
		if (expr === undefined || expr === null) {
			throw "Expression is missing.";
		}
		var source = this;
		var target = {};
		source.forEach((item) => {
			var value = expr(item);
			if (!(value in target)) {
				target[value] = [];
			}
			var items = target[value];
			items.push(item);
		});
		return target;
	}

	toArray() {
		return Array.from(this);
	}
}

export class SelectIterable extends Iterable {
	constructor(source, expr) {
		super();

		this.source = source;
		this.expr = expr;
	}
	
	*[Symbol.iterator]() {
		if (expr === undefined || expr === null) {
			throw "Expression is missing.";
		}
		for (let item of this.source) {
			yield this.expr(item);
		}		
	}
}


export class SelectManyIterable extends Iterable {
	constructor(source, expr) {
		super();

		this.source = source;
		this.expr = expr;
	}
	
	*[Symbol.iterator]() {
		if (this.expr === undefined || this.expr === null) {
			throw "Expression is missing.";
		}
		for (let item of this.source) {
			let items = this.expr(item);
			for (let item2 of items) {
				yield item2;
			}
		}
	}
}

export class TakeIterable extends Iterable {
	constructor(source, limit) {
		super();

		this.source = source;
		this.limit = limit;
	}

	*[Symbol.iterator]() {
		if (this.limit === undefined || !(this.limit instanceof Number)) {
			throw "Expected limit.";
		}
		for (let i = 0; i < limit; i++) {
			yield this.source[i];
		}
	}
}

export class SkipIterable extends Iterable {
	constructor(source, limit) {
		super();

		this.source = source;
		this.limit = limit;
	}

	*[Symbol.iterator]() {
		if (this.limit === undefined || !(this.limit instanceof Number)) {
			throw "Expected limit.";
		}
		var i = 0;
		for (let item of this.source) {
			if (i > limit) {
				yield item;
			}
			i++;
		}
	}
}

export class WhereIterable extends Iterable {
	constructor(source, predicate) {
		super();

		this.source = source;
		this.predicate = predicate;
	}

	*[Symbol.iterator]() {
		if (this.predicate === undefined || this.predicate === null) {
			throw "Predicate is missing.";
		}
		for (let item of this.source) {
			if (this.predicate(item)) {
				yield item;
			}
		}
	}
}

Array.prototype.take = Iterable.prototype.take;
Array.prototype.skip = Iterable.prototype.skip;
Array.prototype.any = Iterable.prototype.any;
Array.prototype.first = Iterable.prototype.first;
Array.prototype.firstOrDefault = Iterable.prototype.firstOrDefault;
Array.prototype.where = Iterable.prototype.where;
Array.prototype.groupBy = Iterable.prototype.groupBy;
Array.prototype.select = Iterable.prototype.select;
Array.prototype.selectMany = Iterable.prototype.selectMany;

export class ObjectHelpers {
	static *explode(source) {
		for (let prop in source) {
			yield source[prop];
		}
	}

	static groupBy(source, expr) {
		if (expr === undefined || expr === null) {
			throw "Expression is missing.";
		}
		var target = {};
		source.forEach((prop) => {
			var item = this[prop];
			var value = expr(item);
			if (!(value in target)) {
				target[value] = [];
			}
			var items = target[value];
			items.push(item);
		});
		return target;
	}
}