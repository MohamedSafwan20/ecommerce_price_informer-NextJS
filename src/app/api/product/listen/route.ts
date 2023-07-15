import { NextResponse } from "next/server";
import { Product } from "../../../../data/models/product_model";
import ProductRepository from "../../../../data/repositories/product_repository";
import { prisma } from "../../_base";

type Body = {
  id: number;
};

export async function POST(request: Request) {
  try {
    const { id } = (await request.json()) as Body;

    const product = (await prisma.product.findFirst({
      where: {
        id,
      },
    })) as Product;

    const res = await ProductRepository.listenPriceChangeOnProduct(product);

    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({
      status: false,
      msg: e.message,
    });
  }
}
