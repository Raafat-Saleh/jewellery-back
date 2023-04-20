/** @format */

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Product = require("./product");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    store: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      trim: true,
      validate(value) {
        if (value < 16) {
          throw new Error("Age must be larger than 15");
        }
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please Enter Valid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 7,
      // validate(value) {
      //   let strongPassword = new RegExp(
      //     "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      //   );
      //   if (!strongPassword.test(value)) {
      //     throw new Error(
      //       "Password must include small and capital letter , symbols and numbers"
      //     );
      //   }
      // },
    },
    gender: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isMobilePhone(value)) {
          throw new Error("Please Enter a valid phone number");
        }
        //   let egNumber = new RegExp("^(\\+?2)?(01)(0|1|2|5)(\\d{8})$");
        //   if (!egNumber.test(value)) {
        //     throw new Error("Please Enter an Egyptian number");
        //   }
      },
    },
    country: { type: String, required: true, trim: true },
    governate: {
      type: String,
      required: true,
      trim: true,
    },
    city: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },

    rate: { type: String },
    opinion: { type: String },

    accountType: { type: String, required: true, trim: true },
    isAdmin: { type: Boolean, default: false },
    avatar: {
      type: String,
    },
    notification: [
      {
        message: {
          type: String,
        },
        title: {
          type: String,
        },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
//   avatar: {
//     type: Buffer
// },
// purchases:[{ type: String}],

userSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "creator",
});

userSchema.virtual("bin", {
  ref: "Bin",
  localField: "_id",
  foreignField: "creator",
});

userSchema.virtual("drafts", {
  ref: "Draft",
  localField: "_id",
  foreignField: "creator",
});

userSchema.virtual("comment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
});

userSchema.virtual("blog", {
  ref: "Blog",
  localField: "_id",
  foreignField: "user",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  // delete userObject.avatar

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismykey");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Please check your email");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login, password is Incorrect");
  }

  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user products when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Product.deleteMany({ creator: user._id });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
