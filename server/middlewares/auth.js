const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require('../models/User');

//auth
exports.auth = async (req,res,next)=>{
    try{
        //extract token
        
        const token = req.cookies.token
                      || req.body.token
                      || req.header("Authorisation")?.replace("Bearer ", "");
        //if token missing, then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token is missing',
            });
        }
    //   console.log("token verify ",token);
        //verify the token
        try{
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
           // console.log("decode=",decode);
            req.user = decode;
        }
        catch(error){
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
              
            });
        }
        
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'something went wrong while validation the token'
        })
    }
}

//isStudent
exports.isStudent = async (req,res,next)=>{
    try{
        
       // console.log(req.user.accountType);
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Student only",
            });
        }
       // console.log("Student hu....");
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        });
    }
}


//isInstructor
exports.isInstructor = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructor only",
            });
        }
        
      // console.log("instructor hu.....");
       
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        });
    }
}


//isAdmin
exports.isAdmin = async (req,res,next)=>{
    try{
        //console.log("admin...");
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin only",
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        });
    }
}