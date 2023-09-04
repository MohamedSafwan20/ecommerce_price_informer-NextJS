import { Store } from "@/data/models/product_model";
import { NextResponse } from "next/server";
import ProductRepository from "../../../../data/repositories/product_repository";

type Body = {
  link: string;
  store: Store;
  interval: number;
  orderedPrice: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  const hostUrl = request.headers.get("host") ?? "";

  const res = await ProductRepository.addProduct(body, hostUrl);

  return NextResponse.json(res);
}
