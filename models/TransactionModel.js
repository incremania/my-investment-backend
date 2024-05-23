const { Schema, default: mongoose } = require("mongoose");

const TransactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    operationType: {
      type: String,
      enum: {
        values: ["withdrawal", "deposit"],
        message: "{VALUE} is not supported",
      },
      default: "deposit",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "successful", "failed"],
        message: "{VALUE} is not supported",
      },
      default: "pending",
    },
    gateway: {
      type: String,
      enum: {
        values: ["Bitcoin", "Ethereum", "USDT (ERC20)", "SHIBA"],
        message: "{VALUE} is not supported",
      },
      required: true
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
