/* cSpell:disable */
import cloudinary from "cloudinary";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import Users from "@/app/(models)/Users";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function POST(req) {
  await connection();
  try {
    const data = await req.formData();
    const userId = data.get("userId");

    const business = await Users.findById(userId);
    if (!business) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "invalid user",
      });
    }

    const image = await data.get("image");
    const fileBuffer = await image.arrayBuffer();

    var mime = image.type;
    var encoding = "base64";
    var base64Data = Buffer.from(fileBuffer).toString("base64");
    var fileUri = "data:" + mime + ";" + encoding + "," + base64Data;

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        var result = cloudinary.uploader
          .upload(
            fileUri,
            {
              invalidate: true,
            },
            {
              resource_type: "image",
              folder: "profilePhotos",
              transformation: [{gravity: "faces", height: 200, width: 200, crop: "thumb"}],
            }
          )
          .then((result) => {
            console.log(result);
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    };

    const uploadResult = await uploadToCloudinary();

    if (!uploadResult) {
      return NextResponse.json({
        status: 500,
        success: false,
        message: "Uploaded File is not an Image",
      });
    }

    const result = await Users.updateOne(
      { _id: userId },
      { $set: { "profilePicture": uploadResult.url } }
    );
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
      message: "Profile photo Uploaded",
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
