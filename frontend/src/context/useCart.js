import { useContext } from "react";
import { CartContext } from "./cartContextBase";

export const useCart = () => useContext(CartContext);
