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

        const findMatch = async (searchTerm) => {
            const searchResults = await Promise.all(
                collections.map(async ({ model, field }) => {
                    const match = await model.findOne({ name: { $regex: searchTerm, $options: "i" } });
                    return match ? { field, id: match._id } : null;
                })
            );
            return searchResults.filter((result) => result !== null);
        };

        const matches1 = searchTerm1 ? await findMatch(searchTerm1) : [];
        const matches2 = searchTerm2 ? await findMatch(searchTerm2) : [];

        console.log("Matches for searchTerm1:", matches1);
        console.log("Matches for searchTerm2:", matches2);

        if (searchTerm1 && searchTerm2) {
            if (matches1.length === 0 || matches2.length === 0) {
                return res.status(404).json({ success: false, message: "No products found matching both search terms" });
            }

            matches1.forEach(({ field, id }) => {
                const match2 = matches2.find((m) => m.field !== field);
                if (match2) {
                    filter["$and"] = [
                        { [field]: id },
                        { [match2.field]: match2.id }
                    ];
                }
            });
        } else {
            const matches = matches1.length ? matches1 : matches2;
            matches.forEach(({ field, id }) => {
                filter[field] = id;
            });
        }

        if (Object.keys(filter).length === 0) {
            return res.status(404).json({ success: false, message: "No products found matching the search term(s)" });
        }

        console.log("Final product filter:", filter);

        const products = await Products.find(filter);

        if (!products.length) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        res.status(200).json({ success: true, products });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { searchProduct };
