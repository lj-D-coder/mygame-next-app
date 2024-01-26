/* cSpell:disable */
import cloudinary from "cloudinary";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import BusinessSetup from "@/app/(models)/BusinessSetup";
import Users from "@/app/(models)/Users";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});



export async function POST(req) {
  await connection();
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const businessID = formData.get("businessID");

    const business = await Users.findById(businessID);
        if (!business) { 
            return NextResponse.json({
                status: 404,
                success: false,
                message: "invalid business ID",
              });
        }
    
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);

    const uploadResult = await new Promise(async(resolve, reject) => {
      cloudinary.v2.uploader.upload_stream(
        {
            resource_type: "image",
            folder: "bannerPhotos",
        },
        async (error, result) => {
          if (error) reject(error);
          else resolve(result);
      }).end(bytes);
  });

    if (!uploadResult) {
      return NextResponse.json({
        status: 500,
        success: false,
        message: "Uploaded File is not an Image",
      });
    }
    
    const result = await BusinessSetup.updateOne(
      { businessID },
      { $set: {"businessInfo.bannerUrl": uploadResult.url} });
    if (!result) { 
      return NextResponse.json({
        status: 500,
        success: false,
        message: "Something went Wrong while saving URL",
      });
    }
    return NextResponse.json({
      status: 200,
      success: true,
      message: "Banner photo Uploaded",
    });
      
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
  
}