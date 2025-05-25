const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 8000;
const database = require("./database/database")
const route = require("./routes/main")

app.use(bodyParser.urlencoded({extended:"true"}));
app.use(bodyParser.json());
app.use(cors());



// Routes//
app.use("/",route)

app.listen(port,function(){
    console.log(`Server Running on port ${port}`)
})
