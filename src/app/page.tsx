import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-7xl py-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Welcome to Our E-Commerce Store
            </h1>
            <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Discover our wide range of products with great prices and fast shipping.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/products">
                <Button className="px-8">Shop Now</Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/placeholder.png"
              alt="Featured Products"
              width={500}
              height={500}
              className="rounded-lg object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
        <div className="container space-y-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Featured Categories
              </h2>
              <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Browse our most popular categories
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* Category cards would go here */}
            <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
              <Link href="/products?category=electronics" className="absolute inset-0 z-10" />
              <div className="p-6">
                <h3 className="text-xl font-bold">Electronics</h3>
                <p className="text-sm text-gray-500">Latest gadgets and devices</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
              <Link href="/products?category=clothing" className="absolute inset-0 z-10" />
              <div className="p-6">
                <h3 className="text-xl font-bold">Clothing</h3>
                <p className="text-sm text-gray-500">Fashion for all seasons</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
              <Link href="/products?category=home" className="absolute inset-0 z-10" />
              <div className="p-6">
                <h3 className="text-xl font-bold">Home & Kitchen</h3>
                <p className="text-sm text-gray-500">Everything for your home</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
