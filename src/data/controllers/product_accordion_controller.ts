import axios from "axios";
import { GET_ALL_PRODUCTS_ENDPOINT } from "../../config/constants";

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
}
