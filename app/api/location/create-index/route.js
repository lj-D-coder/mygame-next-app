import connection from "@/lib/utils/db-connect";
import LocationModel from "@/app/(models)/locationService";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connection();
  try {
    const { loginId } = await req.json();
    const findSuAdmin = await Users.findOne({ loginId });
      if (!findSuAdmin && findSuAdmin.userRole !== "suAdmin") { 
          return NextResponse.json({
              status: 400,
              success: true,
              message: "Super Admin Authentication required",
          })
      }

      // LocationModel.collection.createIndex({
      //     location: "2dsphere",
      // });
    
      Users.collection.createIndex({
        userLocation: "2dsphere",
    });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Index Created",
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
