import { NextResponse } from "next/server";
import Users from "@/app/(models)/Users";
import FollowModel from "@/app/(models)/FollowModel";
import connection from "@/lib/utils/db-connect";


export async function GET(req, { params }) {
    await connection();
    try {
      const { userId } = await params;

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "User ID not Found",
      });
    }
      
    const { userName, _id: UserId, profilePicture } = user;


    const getFollowers = await FollowModel.findById(userId).lean().exec();
    const followerCount = getFollowers.followers.map(id => id.toString()).length;

      console.log(followerCount);
      let following = 0;
      

    // const result = await FollowModel.updateOne({ _id: userId }, { $push: { followers: followerId } }, { upsert: true });

  
      return NextResponse.json({
        status: 200,
        success: true,
          message: "user profile fetch complete",
          UserData: {domain: process.env.NEXT_PUBLIC_DOMAIN_NAME, UserId, userName, profilePicture, follower: followerCount, following }
 
      });
  

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
