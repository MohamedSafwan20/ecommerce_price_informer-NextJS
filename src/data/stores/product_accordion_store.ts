import { create } from "zustand";
import ProductAccordionController from "../controllers/product_accordion_controller";
import { Product } from "../models/product_model";

interface ProductAccordionState {
  products: Product[];
  isLoading: boolean;
  init: () => void;
  fetchProducts: () => void;
}

export const useProductAccordionStore = create<ProductAccordionState>()(
  (set, get) => ({
    products: [],
    isLoading: false,
    init: () => {
      get().fetchProducts();
    },
    fetchProducts: async () => {
      set({ isLoading: true });

      const res = await ProductAccordionController.fetchProducts();

      set({ isLoading: false });

      if (res.status) {
        set({ products: res.data });
      }
    },
  })
);
