/**
 * Utility to generate custom IDs for Mongoose models.
 * @param {String} modelName - The name of the model to query.
 * @param {Number} startValue - The starting value for IDs (e.g., 101).
 * @param {Object} doc - The document being saved.
 * @param {Function} next - Callback to proceed.
 */

const generateCustomId = async ( modelName, startValue, doc, next ) => {
    try {
        // Check if `id` is already set
        if(!doc.id) {
             // Find the highest `id` in the collection
            // const lastDoc = await doc.constructor.findOne().sort({ id: -1 }).exec();
            const lastDoc = await modelName.findOne().sort({ id: -1 }).exec();
            const newId = lastDoc ? lastDoc.id + 1 : startValue; // Use starting value if no records exist
            doc.id = newId;
        }
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = generateCustomId;