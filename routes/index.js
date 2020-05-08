const loginRoutes 			= require('./login');
const postRoutes 			= require('./posts');
const userRoutes 			= require('./users');
const logoutRoutes 			= require('./logout');
const createNewItemRoutes 	= require('./createNewItem')
const itemRoutes            = require("./items");
const bidItemRoutes         = require("./bidItems");
const apiRoutes				= require("./api")
// const commentRoutes 		= require("./comments")

const data = require('../data')
const itemData = data.items

const constructorMethod = (app) => {
	app.get('/', async (req, res) => {
		const items = await itemData.getAllItems()

		//console.log(items)

		// console.log(items)

		if(req.session.user){
			console.log(items)
			res.render('pages/landing', {loggedIn: true, items:items, user:req.session.user});
		} else {
			res.render('pages/landing', {loggedIn: false, items:items})
		}
	});
	app.post('/search', async (req, res) => {
		const {search}=req.body;
		const cleansearch = search.toLowerCase();
		console.log(cleansearch);
		let items = [];
		if(search != ''){
			items = await itemData.getItemByCategory(cleansearch);
		}else{
			items = await itemData.getAllItems();
		}
		//console.log(items)

		// console.log(items)

		if(req.session.user){
			res.render('pages/landing', {loggedIn: true, items:items, user:req.session.user});
		} else {
			res.render('pages/landing', {loggedIn: false, items:items})
		}
	});
	// app.use('/comments', 		commentRoutes)
	app.use('/logout', 			logoutRoutes);
	app.use('/api',				apiRoutes);
	app.use('/login', 			loginRoutes);
    app.use('/posts', 			postRoutes);
	app.use('/users', 			userRoutes);
	app.use('/createNewItem', 	createNewItemRoutes);
	app.use("/items", 			itemRoutes);
    app.use("/bidItems", 		bidItemRoutes);
	app.use('*', (req, res) => {
		res.redirect('/');
	});
};

module.exports = constructorMethod;