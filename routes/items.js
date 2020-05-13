const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;
const userData = data.users;
const bidderData = data.bidders;
const commentData = data.comments
const fs = require("fs");
const multer = require("multer");
const xss = require('xss');


router.get("/buyItem/:id", async (req, res) => {
    try{

        userId = req.session.user.username;
        const item = await itemData.updateBuyer(req.params.id, userId);
        res.redirect('/login');

    }catch (e) {
        res.status(500).send();
    }
})

router.get("/", async (req, res) => {
  try {
    const itemList = await itemData.getAllItems();
    res.json(itemList);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/", async (req, res) => {
  var item;
  var itemId;
  try {
    itemId = req.body['itemId'];
    console.log(itemId);
    item = await itemData.getItem(itemId);
  } catch (e) {
    res.status(404).json({ error: "item not found" });
    return;
  }
  try {
    await itemData.removeItem(itemId);
    await bidderData.removeBidderByItemid(itemId);
    const result = {
      deleted: true,
      data: item
    }
    res.redirect('/login');
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
    return;
  }


})

router.get("/item/:id", async (req, res) => {
  if(!req.session.user){
    res.render('pages/login', {loggedIn: false})
    return
  }
  try {
    const item = await itemData.getItem(req.params.id);
    const bidderList = await bidderData.getBidderByItem(req.params.id);
    var currentPrice = item.price;
    var currentBidder;
    var role;
    var loggedIn;
    const bidderCount = bidderList.length;
    if(req.session.user){
			loggedIn=true;
		} else {
			loggedIn=false;
		}
    for(i in bidderList) {
      if(currentPrice < bidderList[i].bidPrice) {
        currentPrice = bidderList[i].bidPrice;
        currentBidder = bidderList[i].userId;
      }
   }
   bidPriceFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(currentPrice);

   if(req.session.user.username == item.userId) {
        role = 'seller';
   }else{
       role = 'custom';
   }

    if(item.sellType == "auction") {
        const today = new Date();
        const time = today.getTime();
        console.log(time);
        if(item.postDate.getTime() + parseInt(item.auctionExpiration)*24*60*60*1000 > time) {
            item.status = "selling";
        }else {
            item.status = "soldOut";
        }
    }

    console.log("item comments are " + item.comments);
    listOfComments = []
    for (var i = 0; i < (item.comments).length; i++) {
      comment = await commentData.getCommentById(item.comments[i])
      listOfComments.push(comment)
    }
    console.log("currnet user = " + req.session.user.username)
    const price = item.price;
    priceFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price);


    res.render("pages/item", {
      itemId: item._id,
      itemName: item.itemName,
      price: priceFormat,
      userID: item.userId,
      categories: item.categories,
      description: item.description,
      image: '/' + item.image,
      id: item._id,
      postDate: item.postDate,
      sellType: item.sellType,
      auctionExpiration: item.auctionExpiration,
      currentPrice : bidPriceFormat,
      bidderCount: bidderCount,
      currentBidder: currentBidder,
      status: item.status,
      role: role,
      loggedIn:loggedIn,

      listOfComments: listOfComments,
      currUser: req.session.user.usename
    });
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get("/modifyItem/:id", async (req, res) => {
  if(!req.session.user){
    res.render('pages/login', {loggedIn: false})
    return
  }
  try {
    const item = await itemData.getItem(req.params.id);
    if(req.session.user){
			loggedIn=true;
		} else {
			loggedIn=false;
    }
    const price = item.price;
    priceFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price);

    res.render("pages/modifyItem", {
      itemName: item.itemName,
      price: priceFormat,
      userId: item.userId,
      description: item.description,
      image: '/' + item.image,
      categories: item.categories,
      description: item.description,
      id: item._id,
      loggedIn:loggedIn
    });
  } catch (e) {
    res.status(404).json({ error: "page not found" });
  }
});

router.get("/addItem", async (req, res) => {
  if(!req.session.user){
    res.render('pages/login', {loggedIn: false})
    return
  }
  try {
    if(req.session.user){
			loggedIn=true;
		} else {
			loggedIn=false;
		}
    res.render('pages/addItem',{loggedIn:loggedIn});
  } catch (e) {
    res.status(404).json({ error: "page not found" });
  }
});

router.get("/modifyItem/item/:id", async (req, res) => {
  if(!req.session.user){
    res.render('pages/login', {loggedIn: false})
    return
  }
  try {
    const item = await itemData.getItem(req.params.id);
    if(req.session.user){
			loggedIn=true;
		} else {
			loggedIn=false;
    }
    const price = item.price;
    priceFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price);

    res.render("pages/item", {
      itemName: item.itemName,
      price: priceFormat,
      userId: item.userId,
      description: item.description,
      image: '/' + item.image,
      categories: item.categories,
      description: item.description,
      id: item._id,
      loggedIn:loggedIn
    });
  } catch (e) {
    res.status(404).json({ error: "page not found" });
  }
});

var upload = multer({ dest: 'public/images/' });

router.post("/modifyItem/item", upload.single('inputImage'), async (req, res) => {
  try {
    const id = xss(req.body['itemId']);
    const oldItem = await itemData.getItem(id);
    const sellType = xss(req.body['modifySellType']);

    const auctionExpiration = xss(req.body['modifyAuctionExpiration']);

    const itemName = xss(req.body['modifyName']);

    const priceStr = xss(req.body['modifyPrice']);
    let priceNum = priceStr.replace(/,/g,"");
    const price = Number(priceNum);

    let image = oldItem.image;
    if (req.file) {
      image = req.file.path;
    }

    const inputCategories = req.body['modifyCategories'];
    const categories = inputCategories.split(',').map(x => x.trim());

    const description = xss(req.body['modifyDescriptions']);


    const item = await itemData.updateItem(id, sellType, auctionExpiration, itemName, categories, description, image, price);

    res.redirect(`/items/item/${item._id}`);

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.post("/item", upload.single('inputImage'), async (req, res) => {
  try {
    const sellType = xss(req.body['inputSellType']);

    const auctionExpiration = xss(req.body['inputAuctionExpiration']);

    const itemName = xss(req.body['inputName']);

    const priceStr = xss(req.body['inputPrice']);
    let priceNum = priceStr.replace(/,/g,"");
    const price = Number(priceNum);

    let image = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png";
    if (req.file) {
      image = req.file.path;
    }

    const inputCategories = req.body['inputCategories'];
    const categories = inputCategories.split(',').map(x => x.trim());

    const description = xss(req.body['inputDescriptions']);

    const userId = xss(req.session.user.username);

    const newItem = await itemData.addItem(sellType, auctionExpiration, itemName, categories, description, image, userId, price);

    res.redirect(`/items/item/${newItem._id}`);

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;