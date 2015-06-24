export class Iterable {
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
			if(predicate(item)) {
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
		var source = this;
		for (let i = 0; i < limit; i++) {
			yield source[i];
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
		var source = this;
		var i = 0;
		for (let item of source) {
			if(i > limit) {
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