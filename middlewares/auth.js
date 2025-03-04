
//auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = (req, res, next) => {
    try{

        console.log("cookie" , req.cookies.babbarCookie);
        console.log("body", req.body.token);
        console.log("header", req.header("Authorization"));

        //extract jwt token 
        const token = req.cookies.babbarCookie || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){  // matlab humne token bheja hi nahi hai //
            return res.status(401).json({
                success:false,
                message:'Token Missing',   
            })
        }

        //verify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET);   
            console.log(payload);

            req.user = payload; //jo role hai woh is object ke andar pda hai 
            //isse hi pata pdega ki student hai ya Admin
            //req.key ke andar maine poyload ko store kr liya hai
        }catch(err){
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();

    }
    catch(err) {
        return res.status(401).json({
            success: false,
            message:'Something went wrong, while verifying the token',
            error:err.message,
        })
    }
}


exports.isStudent = (req,res,next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:'This is a Protected route for students', //matlab student access nahi kar skta resources ko 
            })
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a Protected route for Admin',
            })
        }
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }
}


