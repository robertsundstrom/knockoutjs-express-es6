import ko from "knockout";

Array.prototype.first = function (predicate) {
    this.forEach((item) => {
        if (predicate(item)) {
            return item;
        }
    });
    return null;
}

Array.prototype.any = function (predicate) {
    return this.first(predicate) != null;
}

Array.prototype.where = function (predicate) {
    var result = [];
    this.forEach((item) => {
        if (predicate(item)) {
            result.push(item);
        }
    });
    return result;
}


function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
    var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
    return cache[cacheKey]
        || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
}

function createBindingsStringEvaluator(bindingsString, options) {
    // Build the source for a function that evaluates "expression"
    // For each scope variable, add an extra level of "with" nesting
    // Example result: with(sc1) { with(sc0) { return (expression) } }
    var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
        functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
    return new Function("$context", "$element", functionBody);
}

//You can now create a bindingProvider that uses something different than data-bind attributes
export default function CustomBindingProvider() {

    this.bindingCache = {};

    this.getBindingsString = function (node, bindingContext) {
        switch (node.nodeType) {
            case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
            case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
            default: return null;
        }
    };

    this.parseBindingsString = function (bindingsString, bindingContext, node, options) {
        try {
            var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
            return bindingFunction(bindingContext, node);
        } catch (ex) {
            ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
            throw ex;
        }
    };
    
    //determine if an element has any bindings
    this.nodeHasBindings = function (node) {
        var matches = null;
        if (typeof node.attributes !== "undefined") {
            var attributes = Array.prototype.slice.call(node.attributes);
            matches = attributes.where((item) => item.name.indexOf("ko-") === 0);
        }
        return node.getAttribute ? matches : false;
    };

    //return the bindings given a node and the bindingContext
    this.getBindings = function (node, bindingContext) {
        var result = {};
        if (typeof node.attributes !== "undefined") {
            var attributes = Array.prototype.slice.call(node.attributes);
            var matches = attributes.where((item) => item.name.indexOf("ko-") === 0);
            if (matches.length > 0) {
                for (var elem of matches) {                  
                    var bindingName = elem.name.replace("ko-", "");
                    
                    var bindingsString = elem.value;
                    var parsedBindings = bindingsString ? this['parseBindingsString'](bindingName + ": " + bindingsString, bindingContext, node) : null;
                    
                    var binding = ko.bindingHandlers[bindingName];
                    if(binding !== undefined) {
                        // var val = bindingContext.$data[elem.value];
                        if (parsedBindings === undefined) {
                            result[bindingName] = val;
                        } else {
                            //result[bindingName] = eval(elem.value);
                            result[bindingName] = parsedBindings[bindingName];
                        }
                    } else {
                        throw "Undefined binding: " + bindingName;
                    }
                }
            }
        }
        return ko.components.addBindingsForCustomElement(result, node, bindingContext, /* valueAccessors */ false)
    };
    
    /*
    
    this.getBindingAccessors = function(node, bindingContext) {
        var result = {};    
        if(typeof node.attributes !== "undefined") {
            var attributes = Array.prototype.slice.call(node.attributes);
            var matches = attributes.where((item) => item.name.indexOf("ko-") === 0);
            if(matches.length > 0) {
                for(var elem of matches) {
                    console.log(elem.name);
                    console.log(elem.value);
                    
                    var bindingsString = elem.value;
                    var parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
                    console.log(parsedBindings);
                    
                    var bindingName = elem.name.replace("ko-", "");
                    var binding = ko.bindingHandlers[bindingName];
                    if(binding !== undefined) {
                        var val = bindingContext.$data[elem.value];
                        if(val !== undefined) {
                            result[bindingName] = val;
                        } else {
                            //result[bindingName] = eval(elem.value);
                            result[bindingName] = parsedBindings;
                        }
                    } else {
                        throw "Undefined binding: " + bindingName;
                    }
                }
            }
        }
        return ko.components.addBindingsForCustomElement(result, node, bindingContext, true)
    };
    
    */
};



        /*
		Array.prototype.slice.call(node.attributes).forEach((item) => {
			
		});
        */

/*

	for(var bindingHandler in ko.bindingHandlers) {
            var result = {};
	        var classes = node.getAttribute("data-class");
	        if (classes) {
	            classes = classes.split(' ');
	            //evaluate each class, build a single object to return
	            for (var i = 0, j = classes.length; i < j; i++) {
	               var bindingAccessor = this.bindingObject[classes[i]];
	               if (bindingAccessor) {
	                   var binding = typeof bindingAccessor == "function" ? bindingAccessor.call(bindingContext.$data) : bindingAccessor;
	                   ko.utils.extend(result, binding);
	               }
	            }
	        }

*/