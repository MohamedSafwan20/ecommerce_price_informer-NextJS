import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { Product } from "../../../../data/models/product_model";
import ProductRepository from "../../../../data/repositories/product_repository";
import { prisma } from "../../_base";

type Body = {
  id: number;
  userEmail: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Body;

    const schema = z.object({
      id: z.number().min(1, {
        message: "id is Required",
      }),
      userEmail: z
        .string()
        .min(1, {
          message: "User email is Required",
        })
        .email({
          message: "Invalid user email",
        }),
    });

    schema.parse(payload);

    const product = (await prisma.product.findUnique({
      where: {
        id: payload.id,
      },
    })) as Product;

    const res = await ProductRepository.listenPriceChangeOnProduct({
      product,
      userEmail: payload.userEmail,
    });

    return NextResponse.json(res);
  } catch (e: any) {
    if (e instanceof ZodError) {
      return NextResponse.json({
        status: false,
        msg: e.flatten().fieldErrors,
      });
    }

    return NextResponse.json({
      status: false,
      msg: e.message,
    });
  }
}
