import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import UsersLocationModel from "@/app/(models)/usersLocationService";
import Users from "@/app/(models)/Users";


export async function POST(req) {
  await connection();
  try {
    const { userId, userLocation, radius } = await req.json();

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
    const arrUserIds = findUserIds.filter(item => item._id !== userId);

    console.log(arrUserIds);

    let nearbyPlayers = [];

    for (let id of arrUserIds) {
      let user = await Users.findById(id);
      let userData = { userId: user._id, profilePicture: user.profilePicture };
      nearbyPlayers.push(userData);
    }

    console.log(nearbyPlayers);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Nearby Players Fetched",
      nearbyPlayers,
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
