import { Status } from "@/data/models/product_model";
import { NextResponse } from "next/server";
import ProductRepository from "../../../data/repositories/product_repository";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let status =
    searchParams.get("status") === null
      ? undefined
      : (searchParams.get("status") as Status);

  const res = await ProductRepository.fetchAllProducts(status);

  return NextResponse.json(res);
}
