const express = require('express');
const app = express();

const mongoose = require('mongoose');

// update karne ke liye method override npm use karnge aise direct use nhi kar skte 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

//st ejs mate
const ejsMate =require("ejs-mate")
//setup ejs
const path = require("path");
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//jisse hamra jo data hai request ke andr aa raha hai parse ho paye 
app.use(express.urlencoded({extended : true}));

//after making schema in models folder listing
const Listing = require('./models/listing');

const Review = require('./models/reviews');

//wrapsync function so that server neverr go down instead show revalent error 

const wrapasync = require("./utils/wrapasync.js");

// expresserror module for server error prblm
const ExpressError = require("./utils/ExpressError.js");





// app.use((req, res, next) => {
//     console.log(`Incoming: ${req.method} ${req.url}`);
//     next();
// });



app.get('/', (req, res) => {
    res.send('root is working !!');
});

//index route
app.get('/listings', async (req, res)=>{
    const allisting = await Listing.find({});
    console.log("sonu")
    res.render("./listings/index",{allisting});
});
//new route
app.get('/listings/new',(req, res)=>{
    res.render("./listings/new");
})

//show route
app.get('/listings/:id',async (req, res)=>{
    let {id}= req.params;
    const listing =await Listing.findById(id);
    res.render("./listings/show",{listing});
});
//create route
// app.post("/listings", async (req, res)=>{
//     const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
// });
app.post("/listings", async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(404, "client error ");
    }
    const { title, description, price, location, country, image } = req.body.listing;

    let finalImage;
    // Check if the string starts with '{', which hints it's a JSON string
    if (typeof image === "string" && image.trim().startsWith("{")) {
        try {
            finalImage = JSON.parse(image);
        } catch (parseError) {
            console.error("Error parsing image JSON:", parseError);
            finalImage = { filename: "listingimage", url: image };
        }
    } else {
        finalImage = { filename: "listingimage", url: image };
    }

    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: finalImage 
    });

    await newListing.save();
    console.log("New listing added:", newListing);
    res.redirect("/listings");
});

 
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req ,res, next)=>{
    let {statuscode = 500, message = "Something went wrong" } = err;
    /* res.status(statuscode).render("error.ejs", { statuscode, message });*/
    res.status(statuscode).render("error.ejs", { err });
});

// });


//edit route
app.get("/listings/:id/edit", wrapasync,async (req, res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit" ,{listing});
})
//update route
app.put('/listings/:id',wrapasync,async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!req.body.listing.image || req.body.listing.image.trim() === "") {
        req.body.listing.image = listing.image;
    } else {
        req.body.listing.image = {
            filename: "listingimage",
            url: req.body.listing.image
        };
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});
//delete route 

app.delete("/listings/:id", wrapasync, async (req, res)=>{
    let { id } = req.params;
    const del = await Listing.findByIdAndDelete(id);
    console.log(del);
    res.redirect("/listings");
    
});

// reiews route post 
app.post("/listings/:id/reviews",wrapasync, async (req, res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);

    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
});

//loger
// app.use(res ,req, next=>{
//     req.time = Date.now();
//     console.log(req.method, req.hostname, req.patch, req.time);
//     next();
// })


// ---------------------api token string  ACCESS--------------
// app.use("/api", (req,res,next)=>{
//     let {token} =req.query;
//     if(token === "giveaccess"){
//         next();
//     }
//     res.send("access denied");
// });

 

// app.get("/testlisting", async (req, res) => {
//     try {
//         let samplelisting = new Listing({
//             title: "my new villa",
//             description: "by the beach",
//             price: 100,
//             location: "Goa",
//             country: "India",
//         });
//         await samplelisting.save();
//         console.log("Data saved successfully");
//         res.send("Data saved");
//     } catch (err) {
//         console.error("Error saving data:", err);
//         res.send("Error saving data");
//     }
// });



// Listing.findOneAndDelete("Historic Villa in Tuscany")
// .then((res)=>{
//     console.log(res);  
// }).catch((err)=>{
//     console.log(err);
// });
// Listing.findByIdAndDelete('67da976c69d5994f5a8b3638')
// .then((res)=>{
//     console.log(res);  
// }).catch((err)=>{
//     console.log(err);
// });



app.get('/test', (req, res) => {
  console.log("Test route hit"); // Check terminal
  res.send("TEST WORKED"); // Check browser at http://localhost:3000/test
});



mongoose
  .connect("mongodb://127.0.0.1:27017/wandrlust")
  .then(() => {
    app.listen(3000, () => {
      console.log("Mongo is connected && Server is listening on 3000");
    });
  })
  .catch(() => {
    console.log("connection error,error");
  });
