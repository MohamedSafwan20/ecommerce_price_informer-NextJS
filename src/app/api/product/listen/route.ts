import { NextResponse } from "next/server";
import { Product } from "../../../../data/models/product_model";
import { Snapshot } from "../../../../data/models/snapshot_model";
import ProductRepository from "../../../../data/repositories/product_repository";
import SnapshotRepository from "../../../../data/repositories/snapshot_repository";
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

    const intervalId = setInterval(async () => {
      const product = (await prisma.product.findFirst({
        where: {
          id,
        },
      })) as Product;

      const res = await ProductRepository.getProductPrice({
        link: product.link,
        store: product.store,
      });

      if (res.status) {
        const snapshot: Snapshot = {
          price: res.data!.price,
          productId: product.id!,
        };

        await SnapshotRepository.addSnapshot({ snapshot });

        if (res.data!.price < product.orderedPrice) {
          // TODO: send email here
        }
      }

      if (product.status === "PAUSED") {
        clearInterval(intervalId);
      }
    }, product.interval);

    return NextResponse.json({
      status: true,
    });
  } catch (e) {
    return NextResponse.json({
      status: false,
    });
  }
}
