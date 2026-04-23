import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function registerUserCantroller(request , response){


try {

 const {name ,email , password}= request.body ;


if(!name || !email || !password){
    return response.status(400).json({
        message : "please provide all the fields",
        error : true ,
        success : false 
    })
}

const user = await UserModel.findOne({ email })

   if(user){
    return response.json({
        message : "user already exist",
        error : true ,
        success :false 
    })
   }

   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password , salt)

   const payload = {
    name ,
    email ,
    password : hashedPassword
   }

   const newUser = await UserModel(payload)
     const save = await newUser.save()

   
        return response.json({
            message: "User registered successfully. Please check your email to verify your account.",
            error: false,
            success: true,
            data: save
        })

}



catch(error){
 return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false

        });
}




}