import User from "../models/userModel.js";
import Product from "../models/productModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -resetPasswordToken -resetPasswordExpire");
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, usersByRoleAgg, productsByCategoryAgg, stockAgg] =
      await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
        Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
        Product.aggregate([{ $group: { _id: null, totalStock: { $sum: "$stocks" } } }]),
      ]);

    const usersByRole = usersByRoleAgg.map((r) => ({ role: r._id || "user", count: r.count }));
    const productsByCategory = productsByCategoryAgg.map((c) => ({ category: c._id || "Uncategorized", count: c.count }));
    const totalAdmins = usersByRole.find((r) => r.role === "admin")?.count || 0;
    const totalStock = stockAgg[0]?.totalStock || 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalAdmins,
        totalStock,
        usersByRole,
        productsByCategory,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
    });
  }
};
