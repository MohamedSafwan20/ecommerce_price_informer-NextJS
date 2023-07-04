import { STORE } from "../../config/constants";

export interface Product {
  id?: number;
  link: string;
  imageUrl: string;
  name: string;
  store: STORE;
  interval: number;
  orderedPrice: number;
  createdAt?: Date;
}
