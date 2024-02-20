import { NextResponse } from "next/server";
import Users from "@/app/(models)/Users";
import FollowModel from "@/app/(models)/FollowModel";
import connection from "@/lib/utils/db-connect";

export async function POST(req) {
  await connection();
  try {
    const { userId, followerId } = await req.json();

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "User ID not Found",
      });
    }

    const follower = await FollowModel.findOne({ _id: userId, followers: followerId });

    if (follower) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Follower already exists",
      });
    }
    const result = await FollowModel.updateOne({ _id: userId }, { $push: { followers: followerId } }, { upsert: true });

    if (result) {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Follow complete",
      });
    }

    // Return the number of followers
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
}
