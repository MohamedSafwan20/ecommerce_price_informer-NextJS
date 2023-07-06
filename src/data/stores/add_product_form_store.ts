import { create } from "zustand";

type FormValues = {
  link: string;
  store: string;
  interval: number;
  orderedPrice: number;
};

interface AddProductFormState {
  formValues: FormValues;
  addProduct: (data: FormValues) => void;
}

export const useAddProductFormStore = create<AddProductFormState>()(
  (set, get) => ({
    formValues: {
      link: "",
      store: "",
      interval: 30,
      orderedPrice: NaN,
    },
    addProduct: (data) => {},
  })
);
