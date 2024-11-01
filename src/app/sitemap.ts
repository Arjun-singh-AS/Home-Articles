import { Product } from "@/model/Product";
import {MetadataRoute } from "next";

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
    const products:Product[]=await response.json();
    const productsEntries:MetadataRoute.Sitemap=products.map(({id})=>({
        url:`${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`
    }))
    return [
        {
            url:`${process.env.NEXT_PUBLIC_BASE_URL}/`
        },
        ...productsEntries
    ]
}