const { Schema, default: mongoose } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [isEmail, "enter a valid email"],
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      reuired: [true, "please provide a username"],
      
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "password must be greater than 8 characters"],
    },

    phone: {
      type: String,
      required: [true, "please provide a phone number"],
    },
    balance: {
      type: Number,
      default: 0.00,
      required: true
    },
    totalWithdrawal: {
      type: Number,
      default: 0
    },
    invitationCode: {
      type: String,
      required: [true, 'please provide a valid invitation code']
    },
    // referedBy: {
    //     type: String,
    // },
    // referralCode: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // referralCounts: {
    //   type: Number,
    //   default: 0,
    // },
    // investmentType: {
    //   type: String,
    //   enum: {
    //     values: ["gold", "silver", "bronze", "platinum"],
    //     message: "{VALUE} is not supported",
    //   },
    //   default: "gold",
    // },
    role: {
      type: String,
      enum: {
        values: ["user", "admin", "client-owner"],
        message: "{VALUE} is not supported",
      },
      default: "user",
    },
    profit: {
      type: Number,
      default: 0.0,
    },
    totalInvest: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isPasswordMatch = await bcrypt.compare(
    canditatePassword,
    this.password
  );
  return isPasswordMatch;
};


module.exports = mongoose.model("User", UserSchema);
