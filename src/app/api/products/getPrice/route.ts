import { NextResponse } from "next/server";
import path from "path";
import { STORE } from "../../../../config/constants";
import ProductRepository from "../../../../data/repositories/product_repository";
import { PrismaClient } from "@prisma/client";

type Body = {
  link: string;
  store: STORE;
};

export async function POST(request: Request) {
  const prisma = new PrismaClient();

  const a = await prisma.product.findMany();

  const { link, store } = (await request.json()) as Body;

  // let count = 0;
  // const intervalId = setInterval(async () => {
  //   const res = await ProductRepository.getProductPrice({
  //     link,
  //     store,
  //   });
  //   console.log("res", res);

  //   count++;

  //   if (count === 3) {
  //     clearInterval(intervalId);
  //   }
  // }, 2000);

  return NextResponse.json({
    status: true,
  });
}
