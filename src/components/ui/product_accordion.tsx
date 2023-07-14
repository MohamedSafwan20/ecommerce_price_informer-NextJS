"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Utils from "@/utils/utils";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useProductAccordionStore } from "../../data/stores/product_accordion_store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import EditProductForm from "./edit_product_form";
import ProductAccordionSkeleton from "./product_accordion_skeleton";

export default function ProductAccordion() {
  const { products, init, isLoading, changeProductStatus } =
    useProductAccordionStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Tabs defaultValue="ALL" className="w-full">
      <TabsList className="ml-28">
        <TabsTrigger value="ALL">All</TabsTrigger>
        <TabsTrigger value="RUNNING">Running</TabsTrigger>
        <TabsTrigger value="PAUSED">Paused</TabsTrigger>
      </TabsList>
      <div className="w-[75%] mx-auto pr-4 h-[60vh] overflow-y-auto">
        <TabsContent value="ALL">
          {isLoading ? (
            <ProductAccordionSkeleton />
          ) : (
            products.map((product) => {
              return (
                <Accordion type="single" collapsible key={product.id}>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex justify-center gap-6">
                          <Image
                            src={product.imageUrl}
                            alt="product"
                            priority={true}
                            width={0}
                            height={0}
                            sizes="100vw"
                            placeholder="blur"
                            blurDataURL="../assets/images/product_loader.png"
                            className="w-[90px] h-[70px] rounded"
                          />
                          <div>
                            <h5 className="text-start max-w-[50ch] overflow-hidden">
                              {product.name}
                            </h5>
                            <div className="flex gap-3 text-[0.7em] text-secondary-foreground">
                              <div className="flex items-start flex-col">
                                <span>Ordered Price</span>
                                <span>₹{product.orderedPrice}</span>
                              </div>
                              <div className="flex items-start flex-col">
                                <span>Interval</span>
                                <span>{product.interval}S</span>
                              </div>
                              <div className="flex items-start flex-col">
                                <span>Store</span>
                                <span>
                                  {Utils.capitalize({
                                    text: product.store,
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center items-center px-6 gap-4">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <EditProductForm product={product} />
                          </div>
                          <div className="flex justify-center items-center gap-1">
                            {product.status === "RUNNING" ? (
                              <>
                                <Pause
                                  className="h-4 w-4"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    changeProductStatus({
                                      status: "PAUSED",
                                      product,
                                    });
                                  }}
                                />
                                <div className="w-[5px] h-[5px] bg-success rounded-xl"></div>
                                <span className="text-[0.7em] text-success">
                                  Running
                                </span>
                              </>
                            ) : (
                              <>
                                <Play
                                  className="h-4 w-4"
                                  onClick={(e) => {
                                    e.stopPropagation();

                                    changeProductStatus({
                                      status: "RUNNING",
                                      product,
                                    });
                                  }}
                                />
                                <div className="w-[5px] h-[5px] bg-warning rounded-xl"></div>
                                <span className="text-[0.7em] text-warning">
                                  Paused
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardHeader className="flex justify-between items-center flex-row">
                          <CardTitle className="text-success text-base">
                            ₹3000
                          </CardTitle>
                          <CardDescription>Thu, 11:30PM</CardDescription>
                        </CardHeader>
                      </Card>
                      <Card>
                        <CardHeader className="flex justify-between items-center flex-row">
                          <CardTitle className="text-destructive text-base">
                            ₹5000
                          </CardTitle>
                          <CardDescription>Thu, 11:30PM</CardDescription>
                        </CardHeader>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })
          )}
        </TabsContent>
        <TabsContent value="RUNNING"></TabsContent>
        <TabsContent value="PAUSED"></TabsContent>
      </div>
    </Tabs>
  );
}
