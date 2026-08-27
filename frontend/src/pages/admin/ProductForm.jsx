import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiImage } from "react-icons/fi";
import api from "../../api/axios";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  stocks: 1,
};

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/product-detail/${id}`);
        const product = data.product;
        setForm({
          title: product.title || "",
          description: product.description || "",
          price: product.price ?? "",
          category: product.category || "",
          stocks: product.stocks ?? 1,
        });
        if (product.images?.[0]?.url) {
          setPreview(product.images[0].url);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEdit && !imageFile) {
      setError("Please upload a product image.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stocks: Number(form.stocks),
      };

      if (imageFile) {
        const base64 = await fileToBase64(imageFile);
        payload.images = [{ public_id: imageFile.name, url: base64 }];
      }

      if (isEdit) {
        await api.put(`/products/update-product/${id}`, payload);
      } else {
        await api.post("/products/create-product", payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading product...</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link to="/admin/products" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600">
        <FiArrowLeft size={16} /> Back to products
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">{isEdit ? "Edit Product" : "Add Product"}</h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <label htmlFor="image" className="relative cursor-pointer group">
              <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group-hover:border-brand-500 transition-colors">
                {preview ? (
                  <img src={preview} alt="Product preview" className="w-full h-full object-cover" />
                ) : (
                  <FiImage className="text-gray-400" size={24} />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 bg-brand-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                +
              </span>
              <input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="Product title"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Product description"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                name="stocks"
                required
                min="0"
                value={form.stocks}
                onChange={handleChange}
                placeholder="0"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              name="category"
              required
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {submitting ? "Saving..." : isEdit ? "Save Changes" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
