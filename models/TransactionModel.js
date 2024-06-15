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
    firstname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
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
    accountId : {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "successful", "failed"],
        message: "{VALUE} is not supported",
      },
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: {
      values: ["bitcoin", "ethereum", "ripple", "litecoin", "bitcoin-cash", "cardano", "usdt",
         "polkadot", "chainlink", "stellar", "binance-coin",
          "tether", "dogecoin", "vechain", "solana", "eos", "cosmos", "monero",
           "tezos", "tron", "iota", "neo", "avalanche", "algorand"],
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
