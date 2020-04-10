const path = require('path');

const constructorMethod = (app) => {
	app.get('/', (req, res) => {
		res.render('layouts/main');
	});

	app.use('*', (req, res) => {
		res.redirect('/');
	});
};

module.exports = constructorMethod;