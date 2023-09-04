import { create } from "zustand";
import AddProductFormController from "../controllers/add_product_form_controller";
import { useProductAccordionStore } from "./product_accordion_store";

type FormValues = {
  link: string;
  store: string;
  interval: number;
  orderedPrice: number;
};

interface AddProductFormState {
  formValues: FormValues;
  isDialogOpen: boolean;
  isLoading: boolean;
  addProduct: (data: FormValues, form: any) => void;
  updateState: ({ state, value }: { state: string; value: any }) => void;
}

export const useAddProductFormStore = create<AddProductFormState>()(
  (set, get) => ({
    formValues: {
      link: "",
      store: "",
      interval: 1,
      orderedPrice: 0,
    },
    isDialogOpen: false,
    isLoading: false,
    updateState: ({ state, value }: { state: string; value: any }) => {
      set({ [state]: value });
    },
    addProduct: async (data, form) => {
      set({ isLoading: true });

      const res = await AddProductFormController.addProduct({
        data,
      });

      set({ isLoading: false });

      if (res.status) {
        useProductAccordionStore.getState().fetchProducts();
        set({ isDialogOpen: false });
        form.reset();
      }
    },
  })
);
