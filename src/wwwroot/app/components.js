import ko from "knockout";
import es6Loader from 'modules/es6Loader';

ko.components.loaders.unshift(es6Loader);


/* Pages */

ko.components.register('home', {
	template: {
		require: 'pages/home/home.html!text'
	},
	viewModel: {
		require: 'pages/home/home'
	}
});

ko.components.register('about', {
	template: {
		require: 'pages/about/about.html!text'
	},
	viewModel: {
		require: 'pages/about/about'
	}
});

ko.components.register('foo', {
	template: {
		require: 'pages/foo/foo.html!text'
	},
	viewModel: {
		require: 'pages/foo/foo'
	}
});

/* Components */

ko.components.register('greeter', {
		require: 'components/greeter/greeter'
});