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

    const getFollowers = await FollowModel.findById(userId).populate("followers", "userName profilePicture").lean().exec();

    // Transform the result
    getFollowers.followers = getFollowers.followers.map((follower) => {
      return {
        followerId: follower._id.toString(),
        userName: follower.userName,
        profilePicture: follower.profilePicture,
      };
    });

    const followerCount = getFollowers.followers.length;

    // console.log(getFollowers);

    if (getFollowers) {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Follower list Fetched",
        data: {
          followerCount,
          followers: getFollowers.followers,
        },
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

export async function DELETE(req, { params }) {
  await connection();
  try {
    const { userId } = params;
    const { followerId } = await req.json();
    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "User ID not Found",
      });
    }

    const result = await FollowModel.updateOne({ _id: userId }, { $pull: { followers: followerId } });

    if (result) {
      return NextResponse.json({ status: 200, message: "un-followed successfully" }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Error", error }, { status: 500 });
  }
}
