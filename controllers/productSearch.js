const Products = require("./../models/ProductModel");
const Category = require("./../models/CategoryModel");
const SubCategory = require("./../models/SubCategoryModel");
const PurposeFor = require("./../models/PurposeForModel");
const BedSize = require("./../models/BedSizeModel");
const SeatingSize = require("./../models/SeatingSizeModel");
const DoorCount = require("./../models/DoorCountModel");

// Search products dynamically
const searchProduct = async (req, res) => {
    console.log("Inside search product");
    const { searchTerm1, searchTerm2 } = req.params;
    console.log("Search terms:", searchTerm1, searchTerm2);

    try {
        let filter = {};

        const collections = [
            { model: Category, field: "category_id" },
            { model: SubCategory, field: "subcategory_id" },
            { model: PurposeFor, field: "purposeFor_id" },
            { model: BedSize, field: "bed_size_id" },
            { model: SeatingSize, field: "seatingSize" },
            { model: DoorCount, field: "doorCount_id" }
        ];

        const searchResults = await Promise.all(
            collections.map(({ model }) =>
                model.findOne({ name: { $regex: searchTerm1, $options: "i" } })
            )
        );

        console.log("Search results from collections:", searchResults);

        const matchedCollection = searchResults.find(result => result !== null);
        if (matchedCollection) {
            const matchedIndex = searchResults.indexOf(matchedCollection);
            filter[collections[matchedIndex].field] = matchedCollection._id;
        }

        if (Object.keys(filter).length === 0) {
            return res.status(404).json({ success: false, message: "No products found matching the search term" });
        }

        console.log("Final product filter:", filter);

        const products = await Products.find(filter);

        if (!products.length) {
            return res.status(404).json({ success: false, message: "No products found matching the search term" });
        }

        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { searchProduct };
