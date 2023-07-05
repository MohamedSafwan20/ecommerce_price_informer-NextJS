import { Status, Store } from "@/data/models/product_model";
import { NextResponse } from "next/server";
import ProductRepository from "../../../../data/repositories/product_repository";

type Body = {
  id: number;
  link?: string;
  store?: Store;
  interval?: number;
  orderedPrice?: number;
  status?: Status;
};

export async function PUT(request: Request) {
  const body = (await request.json()) as Body;

  const res = await ProductRepository.updateProduct({
    id: body.id,
    data: body,
  });

  return NextResponse.json(res);
}
