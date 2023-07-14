import { create } from "zustand";
import ProductAccordionController from "../controllers/product_accordion_controller";
import { Product, Status } from "../models/product_model";

interface ProductAccordionState {
  products: Product[];
  isLoading: boolean;
  statusLoaders: boolean[];
  init: () => void;
  fetchProducts: () => void;
  changeProductStatus: ({
    status,
    product,
    index,
  }: {
    status: Status;
    product: Product;
    index: number;
  }) => void;
}

export const useProductAccordionStore = create<ProductAccordionState>()(
  (set, get) => ({
    products: [],
    isLoading: false,
    statusLoaders: [],
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
      index,
    }: {
      status: Status;
      product: Product;
      index: number;
    }) => {
      const loaders = get().statusLoaders;
      loaders[index] = true;

      set({
        statusLoaders: loaders,
      });

      if (status === "RUNNING") {
        const [changeRes] = await Promise.all([
          ProductAccordionController.changeProductStatus({
            status,
            product,
          }),
          ProductAccordionController.listenPriceChangeOnProduct(product),
        ]);

        if (changeRes.status === false) {
          return;
        }
      } else {
        const res = await ProductAccordionController.changeProductStatus({
          status,
          product,
        });

        if (res.status === false) {
          return;
        }
      }

      loaders[index] = false;

      set({
        statusLoaders: loaders,
      });

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
