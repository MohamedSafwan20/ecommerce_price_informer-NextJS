import { create } from "zustand";

type FormValues = {
  link: string;
  store: string;
  interval: number;
  orderedPrice: number;
};

interface EditProductFormState {
  formValues: FormValues;
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
    updateProduct: (data) => {},
  })
);
