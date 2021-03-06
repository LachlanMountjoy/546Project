const mongoCollections = require('../config/mongoCollections');
const items = mongoCollections.items;
const bidders = mongoCollections.bidders;
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
        const itemList2 = await itemCollection.find({ userId: userId, sellType: 'auction'}).toArray();
        for(i in itemList2){
            await this.updateStutasByItemId(itemList2[i]._id);
        }
        const itemList = await itemCollection.find({ userId: userId,  status: 'selling'}).toArray();
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

    async getItemByBid(userId){
        if (!userId) throw 'you must provide an item id to search for ';
        const itemCollection = await items();
        const bidderCollection = await bidders();
        let itemList = [];
        const list = await bidderCollection.find({userId:userId}).toArray();
        for(i in list){
            const item = await this.getItem(list[i].itemId);
            itemList.push(item);
        }
        return itemList;
    },

    async getItemByBidder(userId) {
        if (!userId) throw 'you must provide an item id to search for ';
        const itemCollection = await items();
        const itemList = await itemCollection.find({ buyer: userId, sellType: 'auction'}).toArray();
        for(i in itemList) {
            const today = new Date();
            const time = today.getTime();
            if(itemList[i].postDate.getTime() + parseInt(itemList[i].auctionExpiration)*24*60*60*1000 > time) {
                itemList.splice(i,1);
            }
        }
        if (itemList === null) throw 'no item with the userId ';
        return itemList;
    },
    async getItemByBought(userId) {
        if (!userId) throw 'you must provide an item id to search for ';
        const itemCollection = await items();
        const itemList = await itemCollection.find({ buyer: userId, sellType: 'sell'}).toArray();
        if (itemList === null) throw 'no item with the userId ';
        return itemList;
    },
    async getItemSold(userId) {
        if (!userId) throw 'you must provide an item id to search for ';
        const itemCollection = await items();
        const itemList2 = await itemCollection.find({ userId: userId, sellType: 'auction'}).toArray();
        for(i in itemList2){
            await this.updateStutasByItemId(itemList2[i]._id);
        }
        const itemList = await itemCollection.find({userId: userId, status:'soldOut'}).toArray();
        if (itemList === null) throw 'no item with the userId ';
        return itemList;
    },
    async removeItem(id) {
        if (!id) throw 'you must provide an id to search for';
        const itemCollection = await items();
        const deletionInfo = await itemCollection.deleteOne({ _id: new ObjectId(id) });
        if (deletionInfo.deletedCount === 0) {
            throw `Could not delete item with id of ${id}`;
        }
        return { deleted: true };
    },

    async addCommentToItem(itemID, commentID, username, comment){
        if (!itemID) throw 'you must provide an itemID';
        if (!commentID) throw 'you must provide an commentID';
        if (!username) throw 'you must provide a username';
        if (!comment) throw 'you must provide an comment';

        let item;
        try{
            item = await this.getItem(itemID)
        }catch (e) {
            //do nothing

        }
        (item.comments).push(commentID)
        const itemUpdateInfo = {
          comments: item.comments
        };
        const itemCollection = await items();

        const updateInfo = await itemCollection.updateOne(
            {_id: item._id},
            { $set: itemUpdateInfo }
        );
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
          throw 'Update failed';

        return await this.getItem(itemID);
      },

    async addItem(sellType, auctionExpiration, itemName, categories, description, image, userId, price) {
        console.log("in add item")
        if (!itemName) throw 'You should provide a name of your item';
        if (!categories || !Array.isArray(categories)) throw 'you should provide an array of categories';
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
            console.log('no information changed');
        }

        return await this.getItem(id);
    },
    async updateBuyer(itemId, buyer) {
        if(!itemId) throw 'you should provide itemId';
        if(!buyer) throw 'you should provide a buyer';
        const itemCollection = await items();
        const item = await this.getItem(itemId);
        var status;
        if(item.sellType == "sell") {
            status = 'soldOut'
        } else{
            status = item.status;
        }

        let updateInfo = {
            buyer: buyer,
            status: status
        };
        const updatedInfo = await itemCollection.updateOne({ _id: new ObjectId(itemId) }, { $set: updateInfo });
        if (updatedInfo.modifiedCount === 0) {
            console.log('buyer no change');
        }


    },

    async updateStutasByItemId(itemId){
        if(!itemId) throw 'you should provide a itemId to search for see status'
        const itemCollection = await items();
        const item = await this.getItem(itemId);
        const today = new Date();
        const time = today.getTime()
        var status;
        if(item.postDate.getTime() + parseInt(item.auctionExpiration)*24*60*60*1000 > time) {
            status = 'selling'
        } else{
            status = 'soldOut';
        }
        let updateInfo = {
            status: status
        };
        const updatedInfo = await itemCollection.updateOne({ _id: new ObjectId(itemId) }, { $set: updateInfo });
        if (updatedInfo.modifiedCount === 0) {
            console.log('status no change');
        }

    }
};

module.exports = exportedMethods;
