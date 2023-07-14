import ProductRepository from "@/data/repositories/product_repository";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const res = await ProductRepository.fetchProduct({
    id: id!,
  });

  return NextResponse.json(res);
}
