import { NextResponse } from "next/server";
import ProductRepository from "../../../data/repositories/product_repository";

export async function GET(request: Request) {
  const res = await ProductRepository.fetchAllProducts();

  return NextResponse.json(res);
}
