'use client';
import React, { useState } from "react";
import { Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";


export default function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      // className={cn("fixed inset-x-0 max-w-2xl mx-auto z-50 top-0 sm:top-10", className)}
      className={cn("fixed inset-x-0 max-w-2xl mx-auto z-50 top-0 sm:top-10 mt-8 sm:mt-0", className)}

    >
      <Menu setActive={setActive}>
        <Link href={"/"} passHref>
          <MenuItem setActive={setActive} active={active} item="Home">
          </MenuItem>
        </Link>
        <Link href={"/products"}>
          <MenuItem setActive={setActive} active={active} item="Products">
            <div className="text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="shirt"
                href={`/Category/shirt`}
                src="/data/t-shirt.jpg"
                description="For best look you can buy our best t-shirts"
              />
              <ProductItem
                title="men"
                href={`/Category/men`}
                src="/data/t-shirt.jpg"
                description="For best look you can buy our best t-shirts"
              />
              <ProductItem
                title="pant"
                href={`/Category/pant`}
                src="/data/t-shirt.jpg"
                description="For best look you can buy our best t-shirts"
              />
              <ProductItem
                title="Leather"
                href={`/Category/leather`}
                src="/data/t-shirt.jpg"
                description="For best look you can buy our best t-shirts"
              />
            </div>

          </MenuItem>
        </Link>
        
        <Link href={"/order"} passHref>
          <MenuItem setActive={setActive} active={active} item="Order">
          </MenuItem>
        </Link>
        <Link href={"/singin2"} passHref>
          <MenuItem setActive={setActive} active={active} item="SingIn">
          </MenuItem>
        </Link>
      </Menu>

    </div>
  );
}
