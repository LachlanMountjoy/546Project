const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;
const fs = require("fs");
const multer = require("multer");

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
    res.status(404).json({ error: "band not found" });
    return;
  }
  try {
    await itemData.removeItem(itemId);
    const result = {
      deleted: true,
      data: item
    }
    console.log(result);
    res.redirect('/items');
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
    return;
  }


})

router.get("/item/:id", async (req, res) => {
  try {
    const item = await itemData.getItem(req.params.id);
    console.log(item);
    res.render("pages/item", {
      itemId: item._id,
      itemName: item.itemName,
      price: item.price,
      userId: item.userId,
      categories: categories,
      description: item.description,
      image: '/' + item.image,
      id: item._id,
      postDate: item.postDate,
      sellType: item.sellType,
      auctionExpiration: item.auctionExpiration,
      currentPrice : '0'

    });
  } catch (e) {
    res.status(404).json({ error: "item not found" });
  }
});

router.get("/modifyItem/:id", async (req, res) => {
  try {
    const item = await itemData.getItem(req.params.id);
    res.render("pages/modifyItem", {
      itemName: item.itemName,
      price: item.price,
      userId: item.userId,
      description: item.description,
      image: '/' + item.image,
      categories: item.categories,
      description: item.description,
      id: item._id
    });
  } catch (e) {
    res.status(404).json({ error: "page not found" });
  }
});

router.get("/addItem", async (req, res) => {
  try {
    res.render('pages/addItem', { title: "Add a new item" });
  } catch (e) {
    res.status(404).json({ error: "page not found" });
  }
});

router.get("/modifyItem/item/:id", async (req, res) => {
  try {
    const item = await itemData.getItem(req.params.id);
    res.render("pages/item", {
      itemName: item.itemName,
      price: item.price,
      userId: item.userId,
      description: item.description,
      image: '/' + item.image,
      categories: item.categories,
      description: item.description,
      id: item._id
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
    console.log(req.file);

    const inputCategories = req.body['modifyCategories'];
    const categories = inputCategories.split(',').map(x => x.trim());

    const description = req.body['modifyDescriptions'];

    //const userId = undefined;

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

    const imageFile = req.body['inputImage'];
    const image = req.file.path;
    console.log(req.file);

    const inputCategories = req.body['inputCategories'];
    const categories = inputCategories.split(',').map(x => x.trim());

    const description = req.body['inputDescriptions'];

    const userId = undefined;

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