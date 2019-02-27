let express    = require("express"),
 app          = express(),
 mongoose     = require("mongoose"),
 methodOverride = require("method-override"),
 bodyparser   = require( "body-parser" );

mongoose.connect("mongodb://localhost:27017/NDLEA", { useNewUrlParser: true })
.then(()=> {
  console.log("Database connected");
})
.catch((err) =>{
  console.log("An error occurred"+ err)
})
app.use( bodyparser.urlencoded( { extended: true } ));
app.use( express.static("public"));
app.use( methodOverride("_method"));
app.set("view engine", "ejs");

// SETUP SCHEMA
let culpritSchema = new mongoose.Schema({
  fullName: String,
  age: String,
  sex: String,
  lga: String,
  state: String,
  phoneNumber: String,
  occupation: String,
  nameOfDrug: String,
  drugPrice: String,
  frequency: String,
  sellerName: String,
  sellerLocation: String,
  passport: String,
  description: String,
  date: {type: Date, default: Date.now }
})

let Culprit = mongoose.model("Culprit", culpritSchema );

// INDEX ROUTE
app.get("/", ( req, res)=>{
  res.render( "landing" )
});


// SIGNIN ROUTE
app.get("/signin", ( req, res)=>{
  res.render( "signin" )
});


// SIGNUP ROUTE
app.get("/signup", ( req, res)=>{
  res.render( "signup" )
});



// INDEX -- SHOW ALL CULPRITS
app.get( '/culprits', ( req, res )=> {
  Culprit.find({}, function(err, allCulprits){

    req.query.email === "giftkovop@gmail.com" 
      ?  err 
        ? console.log( err ) 
        : res.render( "indexAdmin", { allCulprits }) 
      : err 
        ? console.log( err ) 
        : res.render( "index", { allCulprits });
        
  }).sort({'date': -1})
});

// SEARCH

app.get("/culprits/search", (req, res) => {
  let searchString = req.query.search;
  console.log(searchString)
  Culprit.find({}, (err, searchResult) => {
    if(err){
      console.log(err)
    } else {
      res.render("index", {allCulprits: searchResult})
    }
  }).or([{sex: searchString },{age: searchString }, {fullName:searchString},{nameOfDrug:searchString},{sellerName:searchString}])
})

//CREATE -- ADD NEW CULPRIT TO DB
app.post( '/culprits', ( req, res)=> {
  // create new culprit and save to db
  Culprit.create( req.body.culprit, function( err, newCulprit ){
    if(err){
      console.log(err)
    } else {
      // redirect back to culprits page
      res.redirect("/culprits")
    }
  })
});

// NEW -- SHOW FORM TO CREATE NEW CULPRIT
app.get("/register", ( req, res)=>{
  res.render( "register_culprit" )
});

// SHOW A CULPRIT USING ITS ID
app.get("/culprits/:id", ( req, res) => {
  Culprit.findById( req.params.id, (err, foundCulprit) => {
    if(err){
      console.log( err)
    } else {
      res.render("show", { foundCulprit})
    }
  })
}); 

app.get("/culpritsAdmin/:id", ( req, res) => {
  Culprit.findById( req.params.id, (err, foundCulprit) => {
    if(err){
      console.log( err)
    } else {
      res.render("showAdmin", { foundCulprit})
    }
  })
}); 

// EDIT ROUTE
app.get("/culprits/:id/edit", ( req,res )=> {
  Culprit.findById( req.params.id, ( err, foundCulprit )=>{
    if( err ){
      console.log(`the error is at ${err}`)
    } else {
      res.render("edit", { foundCulprit })
    }
  })
});

//UPDATE ROUTE
app.put("/culprits/:id", ( req,res )=>{
  Culprit.findByIdAndUpdate( req.params.id, req.body.culprit, ( err,updatedCulprit )=>{
    if( err ){
      console.log( err )
    } else {
      res.redirect( `/culprits/${req.params.id}`)
    }
  })
});

// DELETE ROUTE

app.delete("/culprits/:id", (req,res) => {
  Culprit.findByIdAndRemove(req.params.id, (err) => {
    // res.alert(`You are about to delete this record with an id of ${req.params.id}`)
    if(err){
      console.log(err)
    }else {
      res.redirect("/culprits")
    }
  })
})



app.listen( 3000, ()=>{
  console.log( "The NDLEA server has started" )
})