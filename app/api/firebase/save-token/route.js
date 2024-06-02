import Users from "@/app/(models)/Users";
import connection from "@/lib/utils/db-connect";
import { NextResponse } from "next/server";


export async function POST(req) {
  await connection();
  try {
    let { userId, firebaseToken } = await req.json();

      
    const result = await Users.updateOne(
        { _id: userId },
        { $set: { "firebaseToken": firebaseToken } }
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
      message: "Token added successfully"
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

