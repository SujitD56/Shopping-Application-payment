const mongoose = require("mongoose");

const webhookSchema = new mongoose.Schema(
  {
    event: {
      type: String,
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    calculatedSignature: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("webhookEvents", webhookSchema);
