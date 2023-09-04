export interface Snapshot {
  id?: number;
  time?: Date;
  price: number;
  productId: number;
  priceReduced: boolean;
}
