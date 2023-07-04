import { NextResponse } from "next/server";
import { STORE } from "../../../../config/constants";
import ProductRepository from "../../../../data/repositories/product_repository";

type Body = {
  link: string;
  store: STORE;
};

export async function POST(request: Request) {
  const { link, store } = (await request.json()) as Body;

  const intervalId = setInterval(async () => {
    const res = await ProductRepository.getProductPrice({
      link,
      store,
    });
  }, 2000);

  return NextResponse.json({
    status: true,
  });
}
