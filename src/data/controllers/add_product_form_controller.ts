import axios from "axios";
import toast from "react-hot-toast";
import { ADD_PRODUCT_ENDPOINT } from "../../config/constants";

type FormValues = {
  link: string;
  store: string;
  interval: number;
  orderedPrice: number;
};

export default class AddProductFormController {
  static async addProduct({ data }: { data: FormValues }) {
    try {
      const addProductRes = await axios.post(ADD_PRODUCT_ENDPOINT, data);

      if (addProductRes.data.status === false) {
        throw new Error(addProductRes.data.msg);
      }

      toast.success("Product Added");

      return { status: true };
    } catch (e: any) {
      toast.error(e.message);

      return { status: false };
    }
  }
}
