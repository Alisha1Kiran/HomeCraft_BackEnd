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

        if (searchTerm1 && !searchTerm2) {
            // General search: Check multiple collections for matching names
            const collections = [
                { model: Category, field: "category_id" },
                { model: SubCategory, field: "subcategory_id" },
                { model: PurposeFor, field: "purposeFor_id" },
                { model: BedSize, field: "bed_size_id" },
                { model: SeatingSize, field: "seatingSize" },
                { model: DoorCount, field: "doorCount_id" }
            ];

            // Run all collection searches in parallel
            const searchPromises = collections.map(({ model }) =>
                model.findOne({ name: { $regex: searchTerm1, $options: "i" } })
            );

            const results = await Promise.all(searchPromises);

            // Find the first matching collection
            for (let i = 0; i < results.length; i++) {
                if (results[i]) {
                    filter[collections[i].field] = results[i]._id;
                    break; // Stop after finding the first match
                }
            }
        } else if (searchTerm1 && searchTerm2) {
            // PurposeFor and SubCategory search
            const [purposeFor, subCategory] = await Promise.all([
                PurposeFor.findOne({ name: { $regex: searchTerm1, $options: "i" } }),
                SubCategory.findOne({ name: { $regex: searchTerm2, $options: "i" } })
            ]);

            if (purposeFor && subCategory) {
                filter = { purposeFor_id: purposeFor._id, subcategory_id: subCategory._id };
            }
        }

        // Fetch products based on determined filter
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