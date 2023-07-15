import axios from "axios";
import { toast } from "react-hot-toast";
import {
  DELETE_PRODUCT_ENDPOINT,
  GET_ALL_PRODUCTS_ENDPOINT,
  PRODUCT_LISTEN_ENDPOINT,
  UPDATE_PRODUCT_ENDPOINT,
} from "../../config/constants";
import { Product, Status } from "../models/product_model";

export default class ProductAccordionController {
  static async fetchProducts(status?: Status) {
    try {
      let res = null;

      if (status === undefined) {
        res = await axios.get(GET_ALL_PRODUCTS_ENDPOINT);
      } else {
        res = await axios.get(`${GET_ALL_PRODUCTS_ENDPOINT}?status=${status}`);
      }

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

  static async listenPriceChangeOnProduct(product: Product) {
    try {
      const payload = {
        id: product.id,
      };

      const res = await axios.post(PRODUCT_LISTEN_ENDPOINT, payload);

      if (res.data.status === false) {
        throw new Error(res.data.msg);
      }

      return { status: true };
    } catch (e: any) {
      toast.error(e.message);

      return { status: false };
    }
  }

  static async deleteProduct(product: Product) {
    try {
      const payload = {
        id: product.id,
      };

      const res = await axios.delete(DELETE_PRODUCT_ENDPOINT, {
        data: payload,
      });

      if (res.data.status === false) {
        throw new Error(res.data.msg);
      }

      toast.success("Product deleted");

      return { status: true };
    } catch (e: any) {
      toast.error(e.message);

      return { status: false };
    }
  }
}
