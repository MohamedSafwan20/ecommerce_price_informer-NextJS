import { create } from "zustand";
import EditProductFormController from "../controllers/edit_product_form_controller";
import { Product } from "../models/product_model";
import { useProductAccordionStore } from "./product_accordion_store";

type FormValues = {
  link: string;
  store: string;
  interval: number;
  orderedPrice: number;
};

interface EditProductFormState {
  formValues: FormValues;
  isLoading: boolean;
  isDialogOpen: boolean;
  selectedProduct: Product;
  updateState: ({ state, value }: { state: string; value: any }) => void;
  fetchProduct: (product: Product) => void;
  updateProduct: (data: FormValues) => void;
}

export const useEditProductFormStore = create<EditProductFormState>()(
  (set, get) => ({
    formValues: {
      link: "",
      store: "",
      interval: 30,
      orderedPrice: NaN,
    },
    isLoading: false,
    isDialogOpen: false,
    selectedProduct: <Product>{},
    updateState: ({ state, value }: { state: string; value: any }) => {
      set({ [state]: value });
    },
    fetchProduct: async (product: Product) => {
      set({
        formValues: {
          link: product.link,
          store: product.store,
          interval: product.interval,
          orderedPrice: product.orderedPrice,
        },
        selectedProduct: product,
      });
    },
    updateProduct: async (data) => {
      set({ isLoading: true });

      const res = await EditProductFormController.updateProduct({
        data,
        product: get().selectedProduct,
      });

      set({ isLoading: false });

      if (res.status) {
        useProductAccordionStore.getState().fetchProducts();

        set({ isDialogOpen: false });
      }
    },
  })
);
