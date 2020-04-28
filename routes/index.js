const loginRoutes 	= require('./login');
const postRoutes 	= require('./posts');
const userRoutes 	= require('./users');
const logoutRoutes 	= require('./logout')

const path = require('path');

const constructorMethod = (app) => {
	app.get('/', (req, res) => {
		if(req.session.user){
			res.render('pages/landing', {loggedIn: true});
		} else {
			res.render('pages/landing', {loggedIn: false})
		}
	});
	app.use('/logout', 	logoutRoutes)
	app.use('/login', 	loginRoutes);
    app.use('/posts', 	postRoutes);
    app.use('/users', 	userRoutes);
	app.use('*', (req, res) => {
		res.redirect('/');
	});
};

module.exports = constructorMethod;