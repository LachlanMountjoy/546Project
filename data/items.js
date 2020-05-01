const mongoCollections = require('../config/mongoCollections');
const items = mongoCollections.items;
const ObjectId = require('mongodb').ObjectID;

async function addItem(sellType, auctionExpiration, itemName, categories, description, image, userId, price) {
    if (!itemName) throw 'You should provide a name of your item';
    if (!categories || !Array.isArray(categories)) throw 'you should provide an array of categories';
    //if (categories.length <= 0) throw 'You must provide at least one category';
    if (!description) throw 'You should provide a description of your item';
    if (!image) throw 'you should update the picture of your item';   //TODO Store image in mongodb
    if (!userId) {
        userId = new Date();
    }
    if (!price) throw 'you should provide a price of the item';
    if (typeof price != "number" || price <= 0 ) throw 'you should provide the valid price of the item';
    if (!sellType) throw 'you shoule choose a type of sell';
    if (!auctionExpiration) throw 'you should provide auctionExpiration'
    const itemCollection = await items();
    const postDate = new Date();
    let newitem = {
        sellType: sellType,
        auctionExpiration: auctionExpiration,
        itemName: itemName,
        price: price,
        categories: categories,
        userId: userId,
        description: description,
        image: image,
        postDate: postDate  // TODO: replaced by system getCurrentTime function later
    };
    const insertInfo = await itemCollection.insertOne(newitem);
    if (insertInfo.insertedCount === 0) throw 'could not add new item';
    const newId = insertInfo.insertedId;
    //await users.createItem(author,newId);
    const item = await this.getItem(newId);
    return item;
}
async function getItem(id) {
    if (!id) throw 'you must provide an item id to search for ';
    const itemCollection = await items();
    const item = await itemCollection.findOne({ _id: new ObjectId(id) });
    if (item === null) throw 'no item with the id ';
    return item;
}
async function getAllItems() {
    const itemCollection = await items();
    const itemList = await itemCollection.find({}).toArray();
    return itemList;
}
async function updateItem(id, sellType, auctionExpiration, itemName, categories, description, image, price) {
    if (!id) throw 'you must provide an item id to search for ';
    if (!itemName) throw 'You should provide a name of your item';
    if (!categories || !Array.isArray(categories)) throw 'you should provide an array of categories';
    //if (categories.length <= 0) throw 'You must provide at least one category';
    if (!description) throw 'You should provide a description of your item';
    if (!image) throw 'you should update the picture of your item';   //TODO Store image in mongodb
    if (!price) throw 'you should provide a price of the item';
    if (typeof price != "number" || price <= 0 ) throw 'you should provide the valid price of the item';
    if (!sellType) throw 'you shoule choose a type of sell';
    if (!auctionExpiration) throw 'you should provide auctionExpiration';
    const itemCollection = await items();
    let updatedItem = {
        itemName: itemName,
        categories: categories,
        description: description,
        image: image,
        price: price,
        sellType: sellType,
        auctionExpiration: auctionExpiration,
    };
    const updatedInfo = await itemCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedItem });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update item successfully';
    }

    return await this.getItem(id);
}

async function removeItem(id) {
    if (!id) throw 'you must provide an id to search for';
    const itemCollection = await items();
    const deletionInfo = await itemCollection.deleteOne({ _id: new ObjectId(id) });
    //await itemCollection.deleteMany({author: id});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete item with id of ${id}`;
    }
    return { deleted: true };
}
module.exports = {
    getAllItems,
    getItem,
    updateItem,
    removeItem,
    addItem
}
