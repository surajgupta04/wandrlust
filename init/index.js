const mongoose = require('mongoose');
const { Data } = require("./data");
const Listing = require("../models/listing.js");

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wandrlust');
    console.log('Connected to MongoDB');
}

const initdb = async () => {
    try {
        await Listing.deleteMany({});
        await Listing.insertMany(Data);
        console.log("Data was initialized successfully");
    } catch (err) {
        console.error(" Error initializing data:", err);
    } finally {
        mongoose.connection.close(); 
    }
};

main().then(() => initdb()).catch(console.error);
