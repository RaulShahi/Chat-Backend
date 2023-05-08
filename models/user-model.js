const mongoose = require("mongoose");
const { encryptPassword } = require("../utils/encryptPassword");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    const cryptedPW = await encryptPassword(this.password, 12);
    this.password = cryptedPW;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
