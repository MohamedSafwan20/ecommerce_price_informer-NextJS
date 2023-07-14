import { NextResponse } from "next/server";
import { Job, scheduleJob } from "node-schedule";
import { Product } from "../../../../data/models/product_model";
import { Snapshot } from "../../../../data/models/snapshot_model";
import ProductRepository from "../../../../data/repositories/product_repository";
import SnapshotRepository from "../../../../data/repositories/snapshot_repository";
import EmailService from "../../../../data/services/email_service";
import Utils from "../../../../utils/utils";
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

    const job: Job = scheduleJob(
      `*/${product.interval} * * * * *`,
      function () {
        runTask(id, job);
      }
    );

    return NextResponse.json({
      status: true,
    });
  } catch (e: any) {
    return NextResponse.json({
      status: false,
      msg: e.message,
    });
  }
}

async function runTask(id: number, job: Job) {
  const product = (await prisma.product.findFirst({
    where: {
      id,
    },
  })) as Product;

  if (product.status === "PAUSED") {
    job.cancel();
    return;
  }

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
      EmailService.sendProductPriceUpdateEmail({
        productLink: product.link,
        productName: product.name,
        storeName: Utils.capitalize({ text: product.store }),
        message: EmailService.generateProductUpdateEmailMessage({
          currentPrice: res.data!.price,
          orderedPrice: product.orderedPrice,
        }),
        toEmail: "mohamedsfn20@gmail.com",
      });
    }
  }
}
