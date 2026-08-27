import { useEffect, useMemo, useState } from "react";
import { CartContext } from "./cartContextBase";
import { useAuth } from "./useAuth";
import api from "../api/axios";

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setItems([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get("/cart");
        setItems(data.cart.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [user]);

  const refreshCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/cart");
      setItems(data.cart.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const { data } = await api.post("/cart/add", { productId, quantity });
    setItems(data.cart.items || []);
  };

  const updateQty = async (productId, quantity) => {
    const { data } = await api.put(`/cart/update/${productId}`, { quantity });
    setItems(data.cart.items || []);
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/remove/${productId}`);
    setItems(data.cart.items || []);
  };

  const clearCart = async () => {
    await api.delete("/cart/clear");
    setItems([]);
  };

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, loading, itemCount, subtotal, addToCart, updateQty, removeItem, clearCart, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
