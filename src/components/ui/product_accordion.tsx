"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Utils from "@/utils/utils";
import { Pause, Play, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useProductAccordionStore } from "../../data/stores/product_accordion_store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import { Button } from "./button";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import EditProductForm from "./edit_product_form";
import Loader from "./loader";
import ProductAccordionSkeleton from "./product_accordion_skeleton";

export default function ProductAccordion() {
  const {
    products,
    init,
    isLoading,
    changeProductStatus,
    statusLoaders,
    deleteProductLoaders,
    onStatusChange,
    selectedStatus,
    deleteProduct,
    updateState,
  } = useProductAccordionStore();

  const deleteProductDialogBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="w-full md:w-[75%] mx-auto pr-4 h-[60vh] overflow-y-auto">
      <Tabs
        defaultValue="ALL"
        className="w-full"
        onValueChange={onStatusChange}
      >
        <TabsList>
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="RUNNING">Running</TabsTrigger>
          <TabsTrigger value="PAUSED">Paused</TabsTrigger>
        </TabsList>
        <TabsContent value={selectedStatus}>
          {isLoading ? (
            <ProductAccordionSkeleton />
          ) : (
            <Accordion type="single" collapsible>
              {products.map((product, index) => {
                return (
                  <AccordionItem value={`item-${index}`} key={product.id}>
                    <AccordionTrigger>
                      <div className="md:flex justify-between items-center w-full space-y-2 md:space-y-0">
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
                            <h5 className="text-start max-w-[25ch] md:max-w-[50ch] overflow-hidden">
                              {product.name}
                            </h5>
                            <div className="flex gap-3 text-[0.7em] text-secondary-foreground">
                              <div className="flex items-start flex-col">
                                <span>Ordered Price</span>
                                <span>₹{product.orderedPrice}</span>
                              </div>
                              <div className="flex items-start flex-col">
                                <span>Interval</span>
                                <span>{product.interval}M</span>
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
                        <div className="flex justify-center items-center px-6 gap-4 ml-9 md:ml-0">
                          {deleteProductLoaders[index] === true ? (
                            <Loader showLoadingText={false} size={16} />
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-auto h-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateState({
                                  state: "selectedProduct",
                                  value: product,
                                });
                                updateState({
                                  state: "selectedProductIndex",
                                  value: index,
                                });
                                deleteProductDialogBtn.current?.click();
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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
                                {statusLoaders[index] === true ? (
                                  <Loader showLoadingText={false} size={16} />
                                ) : (
                                  <Pause
                                    className="h-4 w-4"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      changeProductStatus({
                                        status: "PAUSED",
                                        product,
                                        index,
                                      });
                                    }}
                                  />
                                )}
                                <div className="w-[5px] h-[5px] bg-success rounded-xl"></div>
                                <span className="text-[0.7em] text-success">
                                  Running
                                </span>
                              </>
                            ) : (
                              <>
                                {statusLoaders[index] === true ? (
                                  <Loader showLoadingText={false} size={16} />
                                ) : (
                                  <Play
                                    className="h-4 w-4"
                                    onClick={(e) => {
                                      e.stopPropagation();

                                      changeProductStatus({
                                        status: "RUNNING",
                                        product,
                                        index,
                                      });
                                    }}
                                  />
                                )}
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
                      {product.snapshots?.map((snapshot) => {
                        const date = new Intl.DateTimeFormat("en-IN", {
                          dateStyle: "full",
                          timeStyle: "short",
                        }).format(new Date(snapshot.time!));

                        const formattedDate = date.replace(" at", "");
                        return (
                          <Card key={snapshot.id}>
                            <CardHeader className="flex justify-between items-center flex-row">
                              <CardTitle
                                className={`${
                                  snapshot.priceReduced
                                    ? "text-success"
                                    : "text-destructive"
                                }  text-base`}
                              >
                                ₹{snapshot.price}
                              </CardTitle>
                              <CardDescription className="max-w-[18ch] sm:max-w-none">
                                {formattedDate}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>

      {/* delete product confirm dialog */}
      <AlertDialog>
        <AlertDialogTrigger ref={deleteProductDialogBtn}></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently stop this
              product&apos;s price change listener.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
