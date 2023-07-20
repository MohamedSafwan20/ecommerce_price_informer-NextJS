import { Snapshot } from "./snapshot_model";

export type Store = "AJIO" | "FLIPKART" | "AMAZON";

export type Status = "RUNNING" | "PAUSED";
export interface Product {
  id?: number;
  link: string;
  imageUrl: string;
  name: string;
  store: Store;
  interval: number;
  orderedPrice: number;
  createdAt?: Date;
  snapshots?: [Snapshot];
  status: Status;
  userId: string;
}
