"use client";

import AddProductForm from "@/components/ui/add_product_form";
import Navbar from "@/components/ui/navbar";
import ProductAccordion from "@/components/ui/product_accordion";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex justify-center items-center min-h-[91vh] flex-col container space-y-10">
        <h1 className="text-5xl font-semibold text-center tracking-wide">
          Ecommerce Price Informer
        </h1>
        <ProductAccordion />
        <AddProductForm />
      </main>
    </>
  );
}
