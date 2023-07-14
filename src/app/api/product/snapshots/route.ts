import { NextResponse } from "next/server";
import ProductRepository from "../../../../data/repositories/product_repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const res = await ProductRepository.getProductSnapshots(parseInt(id!));

  return NextResponse.json(res);
}
