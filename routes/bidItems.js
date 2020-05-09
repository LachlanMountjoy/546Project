const express = require("express");
const router = express.Router();
const data = require("../data");
const itemData = data.items;
const bidderData = data.bidders;

router.get("/", async (req, res) => {
  try {
    const bidderList = await bidderData.getAllBidders();
    res.json(bidderList);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/item", async (req, res) => {
  try {

    const bidPriceStr = req.body['bidOnPrice'];
    let bidPriceNum = bidPriceStr.replace(/,/g,"");
    const bidPrice = Number(bidPriceNum);
    const itemId = req.body['itemId'];
    //const userId = req.session.user;
    const userId = req.session.user.username;   // test data need to add userId
    const bidderList = await bidderData.getBidderByItem(itemId);
    for(i in bidderList) {
      if(userId == bidderList[i].userId) {
        const bidder = await bidderData.updateBidder(bidderList[i]._id, bidPrice);
        const item = await itemData.updateBuyer(itemId, userId);
        res.redirect(`/items/item/${itemId}`);
        return;
      }
    }
    const bidder = await bidderData.addBidder(itemId, userId, bidPrice);
    const item = await itemData.updateBuyer(itemId, userId);
    res.redirect(`/items/item/${itemId}`);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
    return;
  }
})

router.get("/item/:id", async (req, res) => {
  try {
    const item = await itemData.getItem(req.params.id);
    const bidderList = await bidderData.getBidderByItem(req.params.id);
    var currentPrice = item.price;
    var currentBidder;
    for(i in bidderList) {
      if(currentPrice < bidderList[i].bidPrice) {
        currentPrice = bidderList[i].bidPrice;
        currentBidder = bidderList[i].userId;
      }
   }
   const price = item.price;
   priceFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(price);
   bidPriceFormat = Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(currentPrice);

    res.render("pages/bidItem", {
      itemId: item._id,
      itemName: item.itemName,
      price: priceFormat,
      userId: item.userId,
      categories: item.categories,
      description: item.description,
      image: '/' + item.image,
      id: item._id,
      postDate: item.postDate,
      sellType: item.sellType,
      auctionExpiration: item.auctionExpiration,
      currentPrice: bidPriceFormat
    });
  } catch (e) {
    res.status(404).json({ error: e + "page not found" });
  }
});



module.exports = router;