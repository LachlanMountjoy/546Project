const mongoCollections = require('../config/mongoCollections');
const items = mongoCollections.items;
const ObjectId = require('mongodb').ObjectID;

let exportedMethods = {
    async getAllItems(){
        const itemCollection = await items();
        const itemList = await itemCollection.find({}).toArray();
        if (!itemList) throw 'No items in system!';
        return itemList;
    },

    async getItem(id) {
        if (!id) throw 'you must provide an item id to search for ';
        const itemCollection = await items();
        const item = await itemCollection.findOne({ _id: new ObjectId(id) });
        if (item === null) throw 'no item with the id ';
        return item;
    },

    async getItemByUser(userId) {
        if (!userId) throw 'you must provide an item id to search for ';
        const itemCollection = await items();
        const itemList = await itemCollection.find({ userId: userId }).toArray();
        if (itemList === null) throw 'no item with the userId ';
        return itemList;
    },

    async getItemByCategory(cat) {
        if (!cat) throw 'you must provide an item id to search for ';
        const itemCollection = await items();
        console.log("here1");
        const itemList = await itemCollection.find({ categories: cat }).toArray();
        console.log("here2");
        if (itemList === null) throw 'no item with the userId ';
        return itemList;
    },

    async getItemByBidder(userId) {
        if (!userId) throw 'you must provide an item id to search for ';
        const itemCollection = await items();
        const itemList = await itemCollection.find({ bidders: userId }).toArray();
        if (itemList === null) throw 'no item with the userId ';
        return itemList;
    },
    async removeItem(id) {
        if (!id) throw 'you must provide an id to search for';
        const itemCollection = await items();
        const deletionInfo = await itemCollection.deleteOne({ _id: new ObjectId(id) });
        //await itemCollection.deleteMany({author: id});
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete item with id of ${id}`;
        }
        return { deleted: true };
    },

    async addCommentToItem(itemID, commentID){
        const item = await this.getItem(itemID)
        console.log(item);
        (item.comments).push(commentID)
        const itemUpdateInfo = {
          comments: item.comments
        };
        console.log(item.comments)
        const itemCollection = await items();

        console.log("updating item with id " + itemID)
        console.log("with comment " + commentID)
        const updateInfo = await itemCollection.updateOne(
            {_id: item._id},
            { $set: itemUpdateInfo }
        );
        console.log(updateInfo)
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
          throw 'Update failed';
    
        return await this.getItem(itemID);
      },

    async addItem(sellType, auctionExpiration, itemName, categories, description, image, userId, price) {
        console.log("in add item")
        if (!itemName) throw 'You should provide a name of your item';
        if (!categories || !Array.isArray(categories)) throw 'you should provide an array of categories';
        //if (categories.length <= 0) throw 'You must provide at least one category';
        if (!description) throw 'You should provide a description of your item';
        if (!image) throw 'you should update the picture of your item';   //TODO Store image in mongodb
        if (!userId) throw 'you should provide a userId';
        if (!price) throw 'you should provide a price of the item';
        if (typeof price != "number" || price <= 0 ) throw 'you should provide the valid price of the item';
        if (!sellType) throw 'you shoule choose a type of sell';
        if (!auctionExpiration) throw 'you should provide auctionExpiration'
        let cleancat = [];
        for (var i = 0; i < categories.length; i++) {
        cleancat.push(categories[i].toLowerCase());
}

        const itemCollection = await items();
        const time = new Date();
        let newItem = {
            sellType: sellType,
            auctionExpiration: auctionExpiration,
            itemName: itemName,
            price: price,
            categories: cleancat,
            userId: userId,
            description: description,
            image: image,
            postDate: time,
            status : 'selling',
            buyer: '',
            comments: []
        };
    const insertInfo = await itemCollection.insertOne(newItem);
    if (insertInfo.insertedCount === 0) throw 'could not add new item';
    const newId = insertInfo.insertedId;
    const item = await this.getItem(newId);
    return item;
    },
    async updateItem(id, sellType, auctionExpiration, itemName, categories, description, image, price) {
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
    },
    async updateBuyer(itemId, buyer) {
        if(!itemId) throw 'you should provide itemId';
        if(!buyer) throw 'you should provide a buyer';
        const itemCollection = await items();
        let updateInfo = {
            buyer: buyer,
            status: "soldOut"
        };
        const updatedInfo = await itemCollection.updateOne({ _id: new ObjectId(itemId) }, { $set: updateInfo });
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not buy successfully';
        }


    }
};

module.exports = exportedMethods;
