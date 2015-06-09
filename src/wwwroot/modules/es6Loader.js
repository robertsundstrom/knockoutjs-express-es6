import ko from "knockout";

class ES6Loader {
	
	loadComponent(name, componentConfig, callback) {
		this.loadComponent2(name, componentConfig, callback);
	}
	
	async loadComponent2(name, componentConfig, callback) {
		try {
			if ("require" in componentConfig) {
				var module = await System.import(componentConfig.require);			
				ko.components.defaultLoader.loadTemplate(name, module.default.template, (elements) => {
					try {
						callback({
							template: elements,
							viewModel: module.default.viewModel,		
							createViewModel: (params, componentInfo) => {
								var viewModel = module.default.viewModel;					
								let o = null;		
								if(typeof viewModel === "function") {
									o = new viewModel(params);
								} else {
									o = viewModel;
								}
								ko.track(o);
								return o;
							}
						});				
					} catch (error) {
						throw error;			
					}
				});
			} else if ("template" in componentConfig) {
				var template = await System.import(componentConfig.template.require);			
				ko.components.defaultLoader.loadTemplate(name, template, async (elements) => {
					try { 
						var obj = {
							template: elements,
						};
						if("viewModel" in componentConfig) {
							var module = await System.import(componentConfig.viewModel.require);
							obj.viewModel = module.default,
							obj.createViewModel = (params, componentInfo) => {
								var viewModel = module.default;	
								let o = null;		
								if(typeof viewModel === "function") {
									o = new viewModel(params);
								} else {
									o = viewModel;
								}
								ko.track(o);	
								return o;
							}
						}
						callback(obj);				
					} catch (error) {
						throw error;	
					}
				});
			}
			
		} catch (error) {
			throw error;
		}
		return null;
	}
	
	loadTemplate(name, templateConfig, callback) {
		console.log("loadTemplate");
		console.log(name);
		console.log(templateConfig);
	}
	
	loadViewModel(name, templateConfig, callback) {
		console.log("loadViewModel");
		console.log(name);
		console.log(templateConfig);		
	}
}

export default new ES6Loader();