// import { Item } from "./models/item.js";

// const seedItems = async () => {
//   const count = await Item.countDocuments();
//   if (count > 0) return;

//   const dummyUserId = "679e09477dd1d1c9898104e2";
//   console.log("Dummy user ID:", dummyUserId);

//   const dummyItems = [
//     {
//       item_name: "Laptop",
//       item_desc: "A powerful laptop with 16GB RAM.",
//       item_price: 1200,
//       item_category: "Electronics",
//       item_photo: copyImageToUploads("./dummy_images/laptop.jpg", `laptop-${Date.now()}.jpg`),
//       postedby: dummyUserId,
//     },
//     {
//       item_name: "Bicycle",
//       item_desc: "A mountain bike in good condition.",
//       item_price: 300,
//       item_category: "Sports",
//       item_photo: copyImageToUploads("./dummy_images/bike.jpg", `bike-${Date.now()}.jpg`),
//       postedby: dummyUserId,
//     },
//     {
//       item_name: "Book Collection",
//       item_desc: "A set of classic literature books.",
//       item_price: 80,
//       item_category: "Books",
//       item_photo: copyImageToUploads("./dummy_images/books.jpg", `books-${Date.now()}.jpg`),
//       postedby: dummyUserId,
//     },
//   ];

//   try {
//     await Item.insertMany(dummyItems);
//     console.log("Dummy items inserted.");
//   } catch (err) {
//     console.error("Error seeding items:", err);
//   }
// };

// seedItems();