const loginRoutes = require('./login');
const postRoutes = require('./posts');
const userRoutes = require('./users');

const path = require('path');

const constructorMethod = (app) => {
	app.get('/', (req, res) => {
		res.render('layouts/main', {body :"placeholder"});
    });
    app.use('/login', loginRoutes);
    app.use('/posts', postRoutes);
    app.use('/users', userRoutes);
	app.use('*', (req, res) => {
		res.redirect('/');
	});
};

module.exports = constructorMethod;