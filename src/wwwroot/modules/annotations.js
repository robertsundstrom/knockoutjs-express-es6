import ko from "knockout";

import router from "modules/router";

export function Component(options: { selector: string, template: string }) {
	return (target) => {
		ko.components.register(options.selector, {
			template: {
				require: options.template
			},
			viewModel: new target({})
		});
	};
}

export function Route(route) {

}