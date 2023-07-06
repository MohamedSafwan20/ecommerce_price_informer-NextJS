"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, Play } from "lucide-react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen flex-col container space-y-10">
      <h1 className="text-5xl font-semibold text-center tracking-wide">
        Ecommerce Price Informer
      </h1>

      <Tabs defaultValue="ALL" className="w-full">
        <TabsList className="ml-28">
          <TabsTrigger value="ALL">All</TabsTrigger>
          <TabsTrigger value="RUNNING">Running</TabsTrigger>
          <TabsTrigger value="PAUSED">Paused</TabsTrigger>
        </TabsList>
        <div className="w-[75%] mx-auto pr-4 h-[60vh] overflow-y-auto">
          <TabsContent value="ALL">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex justify-center gap-6">
                      <Image
                        src={
                          "https://assets.ajio.com/medias/sys_master/root/20230614/DoRc/6489d2d142f9e729d7426284/-473Wx593H-469433553-black-MODEL.jpg"
                        }
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
                        <h5 className="text-start">Unisex crocs lited</h5>
                        <div className="flex gap-3">
                          <div className="flex items-start flex-col text-[0.7em] text-secondary-foreground">
                            <span className="">Ordered Price</span>
                            <span>₹4000</span>
                          </div>
                          <div className="flex items-start flex-col text-[0.7em] text-secondary-foreground">
                            <span className="">Interval</span>
                            <span>120S</span>
                          </div>
                          <div className="flex items-start flex-col text-[0.7em] text-secondary-foreground">
                            <span className="">Store</span>
                            <span>Ajio</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center px-6 gap-4">
                      <Edit3
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                      <div className="flex justify-center items-center gap-1">
                        <Play
                          className="h-4 w-4"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                        {/* <Pause className="h-4 w-4" />
                    <div className="w-[5px] h-[5px] bg-success rounded-xl"></div>
                    <span className="text-[0.7em] text-success">Running</span> */}
                        <div className="w-[5px] h-[5px] bg-warning rounded-xl"></div>
                        <span className="text-[0.7em] text-warning">
                          Paused
                        </span>
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
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex justify-center gap-6">
                      <Image
                        src={
                          "https://assets.ajio.com/medias/sys_master/root/20230614/DoRc/6489d2d142f9e729d7426284/-473Wx593H-469433553-black-MODEL.jpg"
                        }
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
                        <h5 className="text-start">Unisex crocs lited</h5>
                        <div className="flex gap-3">
                          <div className="flex items-start flex-col text-[0.7em] text-secondary-foreground">
                            <span className="">Ordered Price</span>
                            <span>₹4000</span>
                          </div>
                          <div className="flex items-start flex-col text-[0.7em] text-secondary-foreground">
                            <span className="">Interval</span>
                            <span>120S</span>
                          </div>
                          <div className="flex items-start flex-col text-[0.7em] text-secondary-foreground">
                            <span className="">Store</span>
                            <span>Ajio</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center px-6 gap-4">
                      <Edit3
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                      <div className="flex justify-center items-center gap-1">
                        <Play
                          className="h-4 w-4"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                        {/* <Pause className="h-4 w-4" />
                    <div className="w-[5px] h-[5px] bg-success rounded-xl"></div>
                    <span className="text-[0.7em] text-success">Running</span> */}
                        <div className="w-[5px] h-[5px] bg-warning rounded-xl"></div>
                        <span className="text-[0.7em] text-warning">
                          Paused
                        </span>
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
          </TabsContent>
          <TabsContent value="RUNNING"></TabsContent>
          <TabsContent value="PAUSED"></TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
