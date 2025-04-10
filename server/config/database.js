// const mongoose = require("mongoose");
// require("dotenv").config();

// exports.connect = () => {
//     mongoose.connect(process.env.MONGODB_URL,{
//         useNewUrlParser:true,
//         useUnifiedTopology:true
//     })
//     .then(()=>console.log("DB Connected Successfully"))
//     .catch((error)=>{
//         console.log("DB Connection Failed");
//         console.error(error);
//         process.exit(1);
//     })
// };

const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log("DB Connected Successfully"))
        .catch((error) => {
            console.log("DB Connection Failed");
            console.error(error);
            process.exit(1);
        });
};
