import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import Users from "@/app/(models)/Users";

export async function POST(req) {
  await connection();
  try {
    const { userId, longitude, latitude } = await req.json();

    const result = await Users.findOneAndUpdate(
      { _id: userId }, // find a document with this filter
      {
        $set: {
          // fields to update
          userLocation: {
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
    if (result) {
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
