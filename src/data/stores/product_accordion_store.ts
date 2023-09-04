import { create } from "zustand";
import ProductAccordionController from "../controllers/product_accordion_controller";
import { Product, Status } from "../models/product_model";

interface ProductAccordionState {
  products: Product[];
  isLoading: boolean;
  statusLoaders: boolean[];
  deleteProductLoaders: boolean[];
  selectedStatus: Status | "ALL";
  selectedProduct: Product | null;
  selectedProductIndex: number | null;
  init: () => void;
  fetchProducts: (status?: Status) => void;
  changeProductStatus: ({
    status,
    product,
    index,
  }: {
    status: Status;
    product: Product;
    index: number;
  }) => void;
  onStatusChange: (value: string) => void;
  deleteProduct: () => void;
  updateState: ({ state, value }: { state: string; value: any }) => void;
}

export const useProductAccordionStore = create<ProductAccordionState>()(
  (set, get) => ({
    products: [],
    isLoading: false,
    statusLoaders: [],
    deleteProductLoaders: [],
    selectedStatus: "ALL",
    selectedProduct: null,
    selectedProductIndex: null,
    init: () => {
      get().fetchProducts();
    },
    updateState: ({ state, value }: { state: string; value: any }) => {
      set({ [state]: value });
    },
    fetchProducts: async (status) => {
      set({ isLoading: true });

      const res = await ProductAccordionController.fetchProducts(status);

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

      let res = await ProductAccordionController.changeProductStatus({
        status,
        product,
      });

      loaders[index] = false;

      set({
        statusLoaders: loaders,
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
    onStatusChange: (value) => {
      if (value === get().selectedStatus) {
        return;
      }

      set({ selectedStatus: value as Status | "ALL" });

      if (value === "ALL") {
        get().fetchProducts();
        return;
      }

      get().fetchProducts(value as Status);
    },
    deleteProduct: async () => {
      const product = get().selectedProduct!;
      const index = get().selectedProductIndex!;

      const loaders = get().deleteProductLoaders;
      loaders[index] = true;

      set({
        deleteProductLoaders: loaders,
      });

      const res = await ProductAccordionController.deleteProduct(product);

      loaders[index] = false;

      set({
        deleteProductLoaders: loaders,
      });

      if (res.status === false) {
        return;
      }

      const newProducts = get().products.filter((item) => {
        return item.id !== product.id;
      });

      set({
        products: newProducts,
      });
    },
  })
);
