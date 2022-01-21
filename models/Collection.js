const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  userId: { type: String },
  viewDate: { type: Date, default: new Date() },
  productId: { type: String },
});

module.exports = mongoose.model("collection", collectionSchema);
