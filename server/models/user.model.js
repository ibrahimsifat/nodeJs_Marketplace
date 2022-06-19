const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
      required: [true, "Password is required"],
    },
    salt: String,
  },
  { timestamps: true }
);

userSchema.path("password").validate(function (v) {
  if (this.password && this.password.length < 6) {
    this.invalidate("password", "Password must be at least 6 characters.");
  }
  if (this.isNew && !this.password) {
    this.invalidate("password", "Password is required");
  }
}, null);
const User = mongoose.model("User", userSchema);
module.exports = User;
