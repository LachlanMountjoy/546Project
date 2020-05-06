const mongoCollections = require('../config/mongoCollections');
const comments = mongoCollections.comments;
const uuid = require('uuid');

let exportedMethods = {
    async getCommentById(id){
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({_id: id});
        return comment;
    },

    async addComment(username, comment, itemID){
        const commentsCollection = await comments();
        var time = Date()
        let newComment = {
            username: username,
            comment: comment,
            itemID: itemID,
            commentTime: time
        };
        const newInsertInformation = await commentsCollection.insertOne(newComment);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        return await this.getCommentById(newInsertInformation.insertedId);
    },
};
module.exports = exportedMethods;
