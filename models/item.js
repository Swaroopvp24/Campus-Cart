import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    item_desc: {
      type: String,
      required: [true, "Item description is required"],
    },
    item_price: {
      type: Number,
      required: [true, "Item price is required"],
    },
    item_category: {
      type: String,
      required: [true, "Item category is required"],
    },
    // We’ll store the relative file path as a string.
    item_photo: {
      type: String,
      // not required if no image is uploaded
    },
    // postedby connects to the Users collection
    postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Posted by is required"],
    },
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);
