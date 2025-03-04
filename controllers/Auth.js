const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//export the model
const User = require("../models/User");



//signUp route Handler
exports.signup = async(req, res) => {
    try{
        //get data
        const {name, email, password, role} = req.body;
        //Check if User already exists
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success: true,
                message:'User already Exists',
            });
        }

        //secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err)
        {
            return res.status(500).json({
                success: false,
                message:'Error in Hashing Password',
            })
        }

        //create entry for User
        const user = await User.create({
            name, email, password:hashedPassword, role
        })

        return res.status(200).json({
            success:true,
            message:'User Created Successfully'
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        })
    }
}


//login route handler
exports.login = async(req, res) => {
    try{
        //get the data
        const {email, password} = req.body;
        //validation on email and password means none of them are empty we must sure to fill these fields
        if(!email || !password){
            res.status(500).json({
                success: false,
                message:"Please fill all the details carefully",
            });
        }

        //check for the registered user
        let user = await User.findOne({email});
        //if not registered user
        if(!user) {
            return res.status(401).json({
                success:false,
                message:"User is not registered yet",
            })
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        }


        //verify password & generate a JWT token
        if(await bcrypt.compare(password, user.password))
        {
            //password match
            let token = jwt.sign(payload, //The payload is where we store the information 
                                          // we want to associate with the user or the request.//
                                 process.env.JWT_SECRET,
                                 {
                                    expiresIn:"2h",
                                 }
            );
            console.log(user);

            user = user.toObject(); 
            user.token = token;
            console.log(user);
            user.password = undefined;  //agar hum user ka poora object pass krenge toh 
                                       // usme toh passsword bhi pda hai usse hacker ko pta pd jayega 
                                       //humne user ka jo object hai usme se password hataya hai
                                       //but database mei toh woh store rahega hi
            console.log(user);


            const options = {
                expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                //expires: new Date( Date.now() + 3000) 
                //yeh sirf 30seconds ke liye bnegi cookie phie hat jayegi
                httpOnly: true,
            }

            res.cookie("babbarCookie", token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            });
        
        }
        else{
            //passwords do not match
            return res.status(403).json({
                success: false,
                message: "Password Incorrect",
            })
        }



    }
    catch(err){
        console.error(err);
        res.status(200).json({
            success:false,
            error: err.message,
        })
        
    }
}