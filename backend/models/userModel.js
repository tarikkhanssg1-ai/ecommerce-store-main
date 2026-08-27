import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        default : "user"
    },
    profile : {
        public_id : {
            type : String,
            required : true
        },
        url : {
            type : String,
            required : true
        }
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
}, {
    timestamps : true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        return next
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function(){
    const token = crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    return token;
}

userSchema.methods.getJWTToken = function (){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET_KEY, {expiresIn : "7d"})
}

const User = mongoose.model("User", userSchema);
export default User;
