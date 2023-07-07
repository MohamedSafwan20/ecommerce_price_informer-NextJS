import { create } from "zustand";
import AddProductFormController from "../controllers/add_product_form_controller";

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
  addProduct: (data: FormValues) => void;
  updateState: ({ state, value }: { state: string; value: any }) => void;
}

export const useAddProductFormStore = create<AddProductFormState>()(
  (set, get) => ({
    formValues: {
      link: "",
      store: "",
      interval: 30,
      orderedPrice: NaN,
    },
    isDialogOpen: false,
    isLoading: false,
    updateState: ({ state, value }: { state: string; value: any }) => {
      set({ [state]: value });
    },
    addProduct: async (data) => {
      set({ isLoading: true });

      const res = await AddProductFormController.addProduct({
        data,
      });

      set({ isLoading: false });

      if (res.status) {
        set({ isDialogOpen: false });
      }
    },
  })
);
