import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import Users from "@/app/(models)/Users";
import UsersLocationModel from "@/app/(models)/usersLocationService";

export async function POST(req) {
  await connection();
  try {
    const { userId, longitude, latitude } = await req.json();
     
    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "user not Found",
      });
    }
    
      const updatedLocation = await UsersLocationModel.findOneAndUpdate(
        { _id: userId }, // find a document with this filter
        {
          $setOnInsert: {
            // fields to insert if the document doesn't exist
            _id: userId,
            "name": user.userName,
          },
          $set: {
            // fields to update
            "location": {
              type: "Point",
              coordinates: [longitude, latitude], 
            },
          },
        },
        {
          upsert: true, // if no documents match the filter, create a new one
          new: true, // return the updated document
        }
      );

    if (updatedLocation) {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Location Updated",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
}
