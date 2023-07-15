import { NextResponse } from "next/server";
import ProductRepository from "../../../../data/repositories/product_repository";

type Body = {
  id: number;
};

export async function DELETE(request: Request) {
  const { id } = (await request.json()) as Body;

  const res = await ProductRepository.deleteProduct(id);

  return NextResponse.json(res);
}
