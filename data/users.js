const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const uuid = require('uuid/v4');
const bcrypt = require('bcrypt');

let exportedMethods = {
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    if (!userList) throw 'No users in system!';
    return userList;
  },

  async getUserById(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({_id: id});
    if (!user) throw 'User not found';
    return user;
  },
  async addUser(firstName, lastName, email, location, password) {
    const userCollection = await users();
    const hashedPassword = bcrypt.hash(password, 10);
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      location: location,
      _id: uuid(),
      password: hashedPassword,
      itemsForSale: [],
      itemsBidOn:[],
      boughtItems: [],
    };

    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
    return await this.getUserById(newInsertInformation.insertedId);
  },
  async removeUser(id) {
    const userCollection = await users();
    const deletionInfo = await userCollection.removeOne({_id: id});
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    }
    return true;
  },
  async updateUser(id, updatedUser) {
    const user = await this.getUserById(id);
    console.log(user);
    const hashedPassword = bcrypt.hash(updatedUser.password, 10);

    let userUpdateInfo = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      location: updatedUser.location,
      password: hashedPassword,
    };

    const userCollection = await users();
    const updateInfo = await userCollection.updateOne({_id: id}, {$set: userUpdateInfo});
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getUserById(id);
  }
};

module.exports = exportedMethods;
