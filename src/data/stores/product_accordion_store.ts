import { create } from "zustand";
import ProductAccordionController from "../controllers/product_accordion_controller";
import { Product, Status } from "../models/product_model";

interface ProductAccordionState {
  products: Product[];
  isLoading: boolean;
  init: () => void;
  fetchProducts: () => void;
  changeProductStatus: ({
    status,
    product,
  }: {
    status: Status;
    product: Product;
  }) => void;
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
    changeProductStatus: async ({
      status,
      product,
    }: {
      status: Status;
      product: Product;
    }) => {
      const res = await ProductAccordionController.changeProductStatus({
        status,
        product,
      });

      if (res.status === false) {
        return;
      }

      const newProducts = get().products.map((value) => {
        if (value.id === product.id) {
          return {
            ...value,
            status,
          };
        }

        return value;
      });

      set({
        products: newProducts,
      });
    },
  })
);
