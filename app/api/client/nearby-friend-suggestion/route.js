import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import UsersLocationModel from "@/app/(models)/usersLocationService";
import Users from "@/app/(models)/Users";
import FollowModel from "@/app/(models)/FollowModel";

export async function POST(req) {
  await connection();
  try {
    const { userId, userLocation, radius } = await req.json();
    let nearbyPlayers = [];
    let nearbyUsers = UsersLocationModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: userLocation,
          },
          $maxDistance: radius, // distance in meters
        },
      },
    }).select("_id");

    let findUserIds = await nearbyUsers.exec();

    // console.log(findUserIds);

    const arrUserIds = findUserIds.filter((item) => item._id !== userId);

    // console.log(arrUserIds);

    for (let id of arrUserIds) {
      let followingStatus = false;
      const getFollowers = await FollowModel.findById(id).lean().exec();
      
      if (getFollowers) { 
        const followerIds = getFollowers.followers.map(id => id.toString());
        const userExists = followerIds.includes(userId);

        if (userExists) {
          followingStatus = true;
        }
      }
      
      let user = await Users.findById(id);
      let userData = {
        userId: user._id,
        name: user.userName,
        profilePicture: user.profilePicture,
        following: followingStatus,
      };
      nearbyPlayers.push(userData);
    }

    // console.log(nearbyPlayers);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Nearby Players Fetched",
      nearbyPlayers,
    });
  } catch (error) {
    console.error(error);
    let nearbyPlayers = [];
    return NextResponse.json({
      status: 200,
      success: true,
      message: "No Nearby Players Found",
      nearbyPlayers,
    });
  }
}
