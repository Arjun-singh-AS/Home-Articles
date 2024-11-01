import { MetadataRoute } from "next";
import { userAgent } from "next/server";

export default function robot():MetadataRoute.Robots{
    return{
        rules:[
            {
            userAgent:"*",
            allow:"/",
            disallow:[]
            }
        ],
        sitemap:`${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`
    }
}