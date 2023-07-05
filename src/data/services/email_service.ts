import axios from "axios";
import { EMAILJS_SEND_EMAIL_ENDPOINT } from "../../config/constants";

export default class EmailService {
  static async sendProductPriceUpdateEmail({
    productLink,
    productName,
    storeName,
    message,
    toEmail,
  }: {
    productLink: string;
    productName: string;
    storeName: string;
    message: string;
    toEmail: string;
  }) {
    try {
      const payload = {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          productLink,
          productName,
          storeName,
          message,
          toEmail,
        },
      };

      await axios.post(EMAILJS_SEND_EMAIL_ENDPOINT, payload);

      return { status: true };
    } catch (e: any) {
      return { status: false, msg: e.message };
    }
  }

  static generateProductUpdateEmailMessage({
    currentPrice,
    orderedPrice,
  }: {
    currentPrice: number;
    orderedPrice: number;
  }) {
    const message = `The price of this product is dropped to ₹${currentPrice} (₹${
      orderedPrice - currentPrice
    } reduced). The original price of the product was ₹${orderedPrice}.`;

    return message;
  }
}
