import Product from "../models/productModel.js"

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        if(!product) {
            res.status(400).json({
                success : false,
                message: "Product not created"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Product created successfully",
            product
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}

export const getAllProducts = async (req,res) => {
    try {
        const products = await Product.find();
        if(!products) {
            res.status(400).json({
                success : false,
                message: "No products found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const productDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            res.status(400).json({
                success : false,
                message: "Product not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        })
    } catch (error) { 
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if(!product) {
            res.status(400).json({
                success : false,
                message: "Product not found"
            })
        }
        product = await Product.findByIdAndUpdate(product._id, req.body, {new: true});
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            error
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(400).json({
                success : false,
                message: "Product not found"
            })
        }

        await Product.findByIdAndDelete(product._id);
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            error
        })
    }
}