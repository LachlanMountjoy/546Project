const mongoCollections = require('../config/mongoCollections');
const items = mongoCollections.items;

let exportedMethods = {
    async getAllItems(){
        const itemCollection = await items();
        const itemList = await itemCollection.find({}).toArray();
        if (!itemList) throw 'No items in system!';
        return itemList;
    },

    async getItemByID(id){
        const itemCollection = await items();
        const item = await itemCollection.findOne({_id: id});
        if (!item) throw 'item not found';
        return item;
    },

    async removeItemByItem(id){
        const itemCollection = await items();
        const deletionInfo = await itemCollection.removeOne({_id: id});
        if (deletionInfo.deletedCount === 0) throw `Could not delete item with id of ${id}`;
        return true;
    },

    async addItem(itemName, description, sellerID, categories, startingPrice, imageLinks) {
        const itemCollection = await items()
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let newItem = {
            itemName: itemName,
            description: description,
            sellerID: sellerID,
            categories: categories,
            currentPrice: startingPrice,
            images: imageLinks,
            comments: [],
            bidders: [],
            highestBidder: null,
            postedTime: time
        };
        const newInsertInformation = await itemCollection.insertOne(newItem);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
       
        const newId = newInsertInformation.insertedId;
        return itemCollection.findOne(newId);
    }
};

module.exports = exportedMethods;
