import axios from "axios";
import { toast } from "react-hot-toast";
import {
  GET_ALL_PRODUCTS_ENDPOINT,
  UPDATE_PRODUCT_ENDPOINT,
} from "../../config/constants";
import { Product, Status } from "../models/product_model";

export default class ProductAccordionController {
  static async fetchProducts() {
    try {
      const res = await axios.get(GET_ALL_PRODUCTS_ENDPOINT);

      if (res.data.status === false) {
        throw new Error(res.data.msg);
      }

      return { status: true, data: res.data.data };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static async changeProductStatus({
    status,
    product,
  }: {
    status: Status;
    product: Product;
  }) {
    try {
      const payload = {
        id: product.id,
        status,
      };

      const res = await axios.put(UPDATE_PRODUCT_ENDPOINT, payload);

      if (res.data.status === false) {
        throw new Error(res.data.msg);
      }

      return { status: true };
    } catch (e: any) {
      toast.error(e.message);

      return { status: false };
    }
  }
}
