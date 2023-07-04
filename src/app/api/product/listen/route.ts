import { NextResponse } from "next/server";
import { STORE } from "../../../../config/constants";
import ProductRepository from "../../../../data/repositories/product_repository";

type Body = {
  link: string;
  store: STORE;
  interval: number;
  orderedPrice: number;
};

export async function POST(request: Request) {
  try {
    const { link, store, interval, orderedPrice } =
      (await request.json()) as Body;

    let count = 0;
    const intervalId = setInterval(async () => {
      const res = await ProductRepository.getProductPrice({
        link,
        store,
      });

      if (res.status) {
        if (res.data!.price < orderedPrice) {
          return NextResponse.json({
            status: false,
          });
        }
      }

      count++;

      if (count === 3) {
        clearInterval(intervalId);
      }
    }, interval);

    return NextResponse.json({
      status: true,
    });
  } catch (e) {
    return NextResponse.json({
      status: false,
    });
  }
}
