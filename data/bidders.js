const mongoCollections = require('../config/mongoCollections');
const bidders = mongoCollections.bidders;
const ObjectId = require('mongodb').ObjectID;

async function addBidder(itemId, userId, bidPrice) {
    if (!itemId) throw 'You should provide an item id for the bid item';
    if (!userId) throw 'you should provide userId of yourself to bid on';
    if (!bidPrice) throw 'You should provide a price of the bid on item';
    if (typeof bidPrice != "number" || bidPrice <= 0 ) throw 'you should provide the valid price of the bid item';
    const bidderCollection = await bidders();
    const postDate = new Date();
    let newBidder = {
        itemId: itemId,
        userId: userId,
        bidPrice: bidPrice,
        postDate: postDate
    };
    const insertInfo = await bidderCollection.insertOne(newBidder);
    if (insertInfo.insertedCount === 0) throw 'could not add new bidder';
    const newId = insertInfo.insertedId;
    //await users.createItem(author,newId);
    const bidder = await this.getBidder(newId);
    return bidder;
}
async function getBidder(id) {
    if (!id) throw 'you must provide a bidder id to search for ';
    const bidderCollection = await bidders();
    const bidder = await bidderCollection.findOne({ _id: new ObjectId(id) });
    if (bidder === null) throw 'no bidder with the id ';
    return bidder;
}
async function getAllBidders() {
    const bidderCollection = await bidders();
    const bidderList = await bidderCollection.find({}).toArray();
    return bidderList;
}
async function updateBidder(id, bidPrice) {
    if (!id) throw 'You should provide a bidder id to search for';
    if (!bidPrice) throw 'You should provide a price of the bid on item';
    if (typeof bidPrice != "number" || bidPrice <= 0 ) throw 'you should provide the valid price of the bid item';


    const bidderCollection = await bidders();
    let updatedBidder = {
        bidPrice: bidPrice
    };
    const updatedInfo = await bidderCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedBidder });
    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update bidder successfully';
    }

    return await this.getBidder(id);
}

async function removeBidder(id) {
    if (!id) throw 'you must provide a bidder id to search for';
    const bidderCollection = await bidders();
    const deletionInfo = await bidderCollection.deleteOne({ _id: new ObjectId(id) });
    //await itemCollection.deleteMany({author: id});
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete bidder with id of ${id}`;
    }
    return { deleted: true };
}
module.exports = {
    getAllBidders,
    getBidder,
    updateBidder,
    removeBidder,
    addBidder
}
