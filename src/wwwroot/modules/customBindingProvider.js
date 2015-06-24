import ko from "knockout";
import { serialize } from "modules/utils";
import { Iterable } from "modules/linq";


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

    this.initialize = function () {
        
    };

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
            matches = Array.from(attributes.where((item) => item.name.indexOf("ko-") === 0));
        }
        return node.getAttribute ? matches : false;
    };

    //return the bindings given a node and the bindingContext
    this.getBindings = function (node, bindingContext) {
        var result = {};
        if (typeof node.attributes !== "undefined") {
            var attributes = Array.prototype.slice.call(node.attributes);
            var matches = Array.from(attributes.where((item) => item.name.indexOf("ko-") === 0));
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

    this.preprocessNode = function (node: Element) {
        if (node.nodeType == 3) {
            if ("nodeValue" in node && node.nodeValue !== null) {          
                        
                var value = node.nodeValue;
                var match = value.match(/\${([^}]*)}/);
                if (!match) {
                    match = value.match(/{{([^}]*)}/);
                }
                if (match) {
                    value = match[1];
                    var newNode = document.createElement("span");
                    newNode.setAttribute("ko-text", value);
                    node.parentNode.replaceChild(newNode, node);
                    return [node, newNode];
                }
            }
            return;
        } else if (node.nodeType == 1) {
            var attrs = {};
            var attributes = Array.prototype.slice.call(node.attributes);
            for (let attribute of attributes) {
                var localName = attribute.localName;
                var value = attribute.value;
                var match = value.match(/\${([^}]*)}/);
                if(!match) {
                match = value.match(/{{([^}]*)}/);
            }
            if (match) {
                console.log(match);
                var value = match[1];
                attrs[localName] = value;
                console.log(localName);
                node.removeAttribute(localName);
            }
        }
        if (Object.getOwnPropertyNames(attrs).length > 0) {
            node.setAttribute("ko-attr", serialize(attrs));
            return [node];
        }
    }
    /*
    if (node.nodeType == 8) {
        var match = node.nodeValue.match(/{(.*?)}/);
        if (match) {
            console.log(node);
            
            return;
            
            // Create a pair of comments to replace the single comment
            var c1 = document.createComment("ko " + match[1]),
                c2 = document.createComment("/ko");
            node.parentNode.insertBefore(c1, node);
            node.parentNode.replaceChild(c2, node);
 
            // Tell Knockout about the new nodes so that it can apply bindings to them
            return [c1, c2];
        }
    }
    */
}
    
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