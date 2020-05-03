const itemData    = require("./items");
const userData    = require("./users");
const commentData = require("./comments");
const bidderData = require('./bidders.js');

module.exports = {
  users: userData,
  items: itemData,
  comments: commentData,
  bidders: bidderData
};
