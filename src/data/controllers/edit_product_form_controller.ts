import axios from "axios";
import toast from "react-hot-toast";
import { UPDATE_PRODUCT_ENDPOINT } from "../../config/constants";
import { Product } from "../models/product_model";

type FormValues = {
  link: string;
  store: string;
  interval: number;
  orderedPrice: number;
};

export default class EditProductFormController {
  static async updateProduct({
    data,
    product,
  }: {
    data: FormValues;
    product: Product;
  }) {
    try {
      const payload = {
        ...data,
        id: product.id,
      };

      const res = await axios.put(UPDATE_PRODUCT_ENDPOINT, payload);

      if (res.data.status === false) {
        throw new Error(res.data.msg);
      }

      toast.success("Product Updated");

      return { status: true };
    } catch (e: any) {
      toast.error(e.message);

      return { status: false };
    }
  }
}
