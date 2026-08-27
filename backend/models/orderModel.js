import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    items : [
        {
            product : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Product",
                required : true
            },
            title : {
                type : String,
                required : true
            },
            price : {
                type : Number,
                required : true
            },
            quantity : {
                type : Number,
                required : true
            }
        }
    ],
    shippingInfo : {
        fullName : {
            type : String,
            required : true
        },
        address : {
            type : String,
            required : true
        },
        city : {
            type : String,
            required : true
        },
        state : {
            type : String,
            required : true
        },
        pincode : {
            type : String,
            required : true
        },
        phone : {
            type : String,
            required : true
        }
    },
    totalAmount : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ["Processing", "Shipped", "Delivered", "Cancelled"],
        default : "Processing"
    },
    paymentInfo : {
        id : {
            type : String
        },
        status : {
            type : String
        }
    },
    isPaid : {
        type : Boolean,
        default : false
    },
    paidAt : {
        type : Date
    }
},{
    timestamps : true
})

const Order = mongoose.model("Order", orderSchema);
export default Order;
