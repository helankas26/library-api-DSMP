import mongoose from 'mongoose';

const {Schema, model} = mongoose;

const userSchema = new Schema({

});

module.exports = model('User', userSchema);