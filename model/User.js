const mongoose = require("mongoose");
const { Schema } = mongoose;
// {
//     "value": "smartphones",
//     "label": "smartphones",
//     "checked": false
//   }
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: Buffer, required: true },
  role: { type: String, default :"user"},
  addresses: { type: [Schema.Types.Mixed] },
  name: { type: String  },
  orders: { type: [Schema.Types.Mixed] },
  salt : {type:Buffer},
  //   checked:{ type: Boolean, required: true },
}); 

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
exports.User = mongoose.model("User", userSchema);
