import ko from "knockout";
import { serialize } from "modules/utils";
import { Iterable, ObjectHelpers } from "modules/linq";
import "modules/utils";

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
export default class CustomBindingProvider {
    defaultProvider = null;
    static bindingCache = {};
    bindingCache2 = {};

    constructor() {
        this.defaultProvider = ko.bindingProvider.instance;
        
        var bindings = [];
        var bindingHandlers = ko.bindingHandlers;
        for (let bindingName in bindingHandlers) {
            var binding = bindingHandlers[bindingName];
            binding.prefix = "ko";
            binding.name = bindingName;
            binding.getFullName = function() {
                return `${this.prefix}-${this.name}`;
            };
            bindings.push(binding);
        }

        this.bindingCache2 = bindings.groupBy(b => b.prefix);

        /*
        for (let f of this.bindingCache2["ko"]) {
            if ("prefix" in f) {
                console.log(f.getFullName());
            }
        }
        */
    }

    getBindingsString(node, bindingContext) {
        switch (node.nodeType) {
            case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
            case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
            default: return null;
        }
    }

    parseBindingsString(bindingsString, bindingContext, node, options) {
        try {
            var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, CustomBindingProvider.bindingCache, options);
            return bindingFunction(bindingContext, node);
        } catch (ex) {
            ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
            throw ex;
        }
    }

    addBinding(ns, name, obj) {
        obj["prefix"] = ns;
        bindingHandlers[name] = obj;
    }

    nodeHasBindings(node: Element) {
        var bindingCache2 = this.bindingCache2;
        var matches = [];
        if (typeof node.attributes !== "undefined") {
            var attributes = Array.prototype.slice.call(node.attributes);
            for (let attribute of attributes) {
                if (attribute.name.indexOf("-") > 0) {
                    var match = Array.from(ObjectHelpers.explode(bindingCache2)).selectMany(x => x).firstOrDefault(x => x.getFullName() === attribute.name);
                    if (match) {
                        matches.push(match);
                    }
                }
            }
        }

        return this.defaultProvider.nodeHasBindings(node) || matches.length;
    }

    getBindings(node: Element, bindingContext) {
        var bindingCache2 = this.bindingCache2;
        var parseBindingsString = this.parseBindingsString;
        var matches = [];
        var result = {};
        if (typeof node.attributes !== "undefined") {
            var attributes = Array.prototype.slice.call(node.attributes);
            for (let attribute of attributes) {
                if (attribute.name.indexOf("-") > 0) {
                    var match = Array.from(ObjectHelpers.explode(bindingCache2)).selectMany(x => x).firstOrDefault(x => x.getFullName() === attribute.name);
                    if (match) {
                        var bindingName = attribute.name.replace("ko-", "");;
                        var bindingsString = attribute.value;
                        var parsedBindings = bindingsString ? parseBindingsString(bindingName + ": " + bindingsString, bindingContext, node) : null;

                        var binding = ko.bindingHandlers[bindingName];
                        if (binding !== undefined) {
                            if (parsedBindings === undefined) {
                                result[bindingName] = val;
                            } else {
                                result[bindingName] = parsedBindings[bindingName];
                            }
                        } else {
                            throw "Undefined binding: " + bindingName;
                        }
                    }
                }
            }

            ko.components.addBindingsForCustomElement(result, node, bindingContext, /* valueAccessors */ false)
        }

        var result2 = this.defaultProvider.getBindings(node, bindingContext);
        if (result2 !== null) {
            for (let prop in result2) {
                var value = result2[prop];
                result[prop] = value;
            }
        }
        return result;
    }

    preprocessNode(node: Element) {
        if (node.nodeType == 3) {
            if ("nodeValue" in node && node.nodeValue !== null) {
                var value = node.nodeValue;
                var match = value.matchAll(/\${([^}]*)}/g);
                if (!match) {
                    match = value.matchAll(/{{([^}]*)}/g);
                }
                if (match !== null && match.length > 0) {
                    var parentNode = node.parentNode;
                    var nodes = [];
                    var textString = value;
                    var i = 0;
                    for (let entry of match) {
                        var startOffset = node.nodeValue.indexOf(entry[0]);
                        var endOffset = startOffset + entry[0].length;
                        
                        var length = startOffset - i;
                        if (length > 0) {
                            var str = textString.substr(i, length);
                            var textNode = document.createTextNode(str);
                            parentNode.insertBefore(textNode, node);
                        }

                        var newNode2 = document.createElement("span");
                        newNode2.setAttribute("ko-text", entry[1]);
                        parentNode.insertBefore(newNode2, node);
                        
                        nodes.push(newNode2);
                        
                        i = endOffset;
                    }

                    var length = textString.length - i;
                    if (length > 0) {
                        var str = textString.substr(i, length);
                        var textNode = document.createTextNode(str);
                        parentNode.insertBefore(textNode, node);
                    }
                    parentNode.removeChild(node);
                    return nodes;
                }
            }
            return;
        } else if (node.nodeType == 1) {
            var attrs = {};
            var attributes = Array.prototype.slice.call(node.attributes);
            for (let attribute of attributes) {
                var localName = attribute.localName;
                var value = attribute.value;
                var match = value.matchAll(/\${([^}]*)}/g);
                if (!match) {
                    match = value.matchAll(/{{([^}]*)}/g);
                }
                if (match !== null && match.length > 0) {
                    match = match[0];
                    //console.log(match);
                    var value = match[1];
                    attrs[localName] = value;
                    //console.log(localName);
                    node.removeAttribute(localName);
                }
            }
            if (Object.getOwnPropertyNames(attrs).length > 0) {
                node.setAttribute("ko-attr", serialize(attrs));
                return [node];
            }
        }
    }
}