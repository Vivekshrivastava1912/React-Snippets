import mongoose from "mongoose";


const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please provide name"]
    },

    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide password"]
    },

    credit : {
        type: Number,
        default: 0
    }
    ,
    mobile: {
        type: Number,
        default: null
    },

    refresh_token: {
        type: String,
        default: ""
    },

    verify_email: {
        type: Boolean,
        default: false
    },

    last_login_date: {
        type: Date,
        default: ""
    },

    forget_password_otp: {
        type: String,
        default: null
    },

    forget_password_expiry: {
        type: Date,
        default: ""
    },

},

    {
        timestamps: true

    })

const UserModel = mongoose.model('User', userSchema)

export default UserModel