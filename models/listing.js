const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        filename: { type: String , default:"defaultimage"},
        url: { type: String }
    },  
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
            required: true,
        }
    ]
});

const Listing= mongoose.model('Listing', ListingSchema);
module.exports = Listing;

