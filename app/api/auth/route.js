import Users from "@/app/(models)/Users";
import connection from "@/lib/utils/db-connect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connection();
  try {
    let { loginId, phoneNo, email, userRole, userName } = await req.json();

      const checkloginId = await Users.findOne({ loginId });
    if (checkloginId) {
      const JWT_token = jwt.sign(
        { userId: checkloginId._id, data: checkloginId },
        process.env.JWT_SECRET
      );
      console.log("fetching user data");
      return NextResponse.json({status: 200, success: true, JWT_token });
    }
    
    // // Check if email is provided and not an empty string
    if (email === null || email.trim() === "") {
      email = undefined;
    }
    if (phoneNo === null || phoneNo.trim() === "") {
      phoneNo = undefined;
    }
    if (userName === null || userName.trim() === "") {
        userName = undefined;
      }

    if (!userName) { 
      return  NextResponse.json({status: 200,
        success: false, message: "Please Sign Up to Continue", JWT_token:"" });
    } 

    const user = new Users({ loginId, userName, phoneNo, userRole, email });

    await user.save({ omitUndefined: true });

    const JWT_token = jwt.sign(
      { userId: user._id, data: user },
      process.env.JWT_SECRET
    );
    console.log("adding new user data");
    return NextResponse.json({
      status: 200,
      success: true,
      message: "User added successfully",
      JWT_token,
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
