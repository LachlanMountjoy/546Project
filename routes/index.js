const loginRoutes 			= require('./login');
const postRoutes 			= require('./posts');
const userRoutes 			= require('./users');
const logoutRoutes 			= require('./logout');
const createNewItemRoutes 	= require('./createNewItem')

const path = require('path');
const data = require('../data')
const itemData = data.items
const userData = data.users

const constructorMethod = (app) => {
	app.get('/', async (req, res) => {
		const items = await itemData.getAllItems()
		console.log(items)
		if(req.session.user){
			res.render('pages/landing', {loggedIn: true, items:items});
		} else {
			res.render('pages/landing', {loggedIn: false, items:items})
		}
	});
	app.use('/logout', 	logoutRoutes)
	app.use('/login', 	loginRoutes);
    app.use('/posts', 	postRoutes);
	app.use('/users', 	userRoutes);
	app.use('/createNewItem', createNewItemRoutes)
	app.use('*', (req, res) => {
		res.redirect('/');
	});
};

module.exports = constructorMethod;