const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const uuid = require('uuid/v4');

let exportedMethods = {
    async addComment(username, userID, comment, itemID){
        const commentsCollection = await comments();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let newComment = {
            username: username,
            userID: userID,
            comment: comment,
            itemID: itemID,
            commentTime: time
        };
        const newInsertInformation = await commentsCollection.insertOne(newComment);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getCommentById(newInsertInformation.insertedId);
    },

    async getCommentByID(){
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({_id: id});
        return comment;
    },
};
module.exports = exportedMethods;