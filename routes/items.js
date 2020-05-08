const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;
const userData = data.users;
const bidderData = data.bidders;
const fs = require("fs");
const multer = require("multer");

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
    const result = {
      deleted: true,
      data: item
    }
    res.redirect('/login/verifyUser');
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
    return;
  }


})

// router.post("/buy", async (req, res) => {
// try{

// }
// })


router.get("/item/:id", async (req, res) => {
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

    //console.log(item);
    res.render("pages/item", {
      itemId: item._id,
      itemName: item.itemName,
      price: item.price,
      userId: item.userId,
      categories: item.categories,
      description: item.description,
      image: '/' + item.image,
      id: item._id,
      postDate: item.postDate,
      sellType: item.sellType,
      auctionExpiration: item.auctionExpiration,
      currentPrice : currentPrice,
      bidderCount: bidderCount,
      currentBidder: currentBidder,
      status: item.status,
      role: role,
      loggedIn:loggedIn

    });
  } catch (e) {
    res.status(404).json({ error: "item not found" });
  }
});

router.get("/modifyItem/:id", async (req, res) => {
  try {
    const item = await itemData.getItem(req.params.id);
    if(req.session.user){
			loggedIn=true;
		} else {
			loggedIn=false;
		}
    res.render("pages/modifyItem", {
      itemName: item.itemName,
      price: item.price,
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
  try {
    const item = await itemData.getItem(req.params.id);
    if(req.session.user){
			loggedIn=true;
		} else {
			loggedIn=false;
		}
    res.render("pages/item", {
      itemName: item.itemName,
      price: item.price,
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
  console.log("sdss");

  try {
    const id = req.body['itemId'];
    const oldItem = await itemData.getItem(id);
    const sellType = req.body['modifySellType'];

    // let auctionExpiration = null;
    // if (sellType == 'auction') {
    const auctionExpiration = req.body['modifyAuctionExpiration'];
    // }

    const itemName = req.body['modifyName'];

    const price = Number(req.body['modifyPrice']);

    //const imageFile = req.body['inputImage'];

    let image = oldItem.image;
    if (req.file) {
      image = req.file.path;
    }

    const inputCategories = req.body['modifyCategories'];
    const categories = inputCategories.split(',').map(x => x.trim());

    const description = req.body['modifyDescriptions'];


    const item = await itemData.updateItem(id, sellType, auctionExpiration, itemName, categories, description, image, price);


    //console.log(sellType, auctionExpiration, name, price, image, categories, descriptions);

    res.redirect(`/items/item/${item._id}`);
    //res.redirect(`pages/item`);

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

router.post("/item", upload.single('inputImage'), async (req, res) => {

  try {
    const sellType = req.body['inputSellType'];

    // let auctionExpiration = null;
    // if (sellType == 'auction') {
    const auctionExpiration = req.body['inputAuctionExpiration'];
    // }

    const itemName = req.body['inputName'];

    const price = Number(req.body['inputPrice']);

    // const imageFile = req.body['inputImage'];
    // const image = req.file.path;

    let image = "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png";
    if (req.file) {
      image = req.file.path;
    }

    const inputCategories = req.body['inputCategories'];
    const categories = inputCategories.split(',').map(x => x.trim());

    const description = req.body['inputDescriptions'];

    const userId = req.session.user.username;
    // let user = await userData.getUserbyUsername(req.session.user.username);
    // console.log(user.username);

    const newItem = await itemData.addItem(sellType, auctionExpiration, itemName, categories, description, image, userId, price);


    //console.log(sellType, auctionExpiration, name, price, image, categories, descriptions);

    res.redirect(`/items/item/${newItem._id}`);
    //res.redirect(`pages/item`);

  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;