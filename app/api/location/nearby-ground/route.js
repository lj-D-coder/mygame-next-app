import connection from "@/lib/utils/db-connect";
import LocationModel from "@/app/(models)/locationService";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";
import BusinessSetup from "@/app/(models)/BusinessSetup";

export async function POST(req) {
  await connection();
  try {
    const { userLocation, radius } = await req.json();

    //   LocationModel.collection.getIndexes().then(indexes => {
    //     console.log(indexes);
    // }).catch(err => {
    //     console.error(err);
    // });

    // let userLocation = [longitude, latitude]; // make sure to input longitude first, then latitude

    let findBus = LocationModel.find({
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

    let arrBusinessId = await findBus.exec();
    console.log(arrBusinessId);
    let nearbyGround = [];

    for (let obj of arrBusinessId) {
      let business = await BusinessSetup.findOne({
        businessID: obj._id,
      });
      let { businessInfo: { bannerUrl }, businessID } = business;
      let nearbyBusiness = { bannerUrl, businessID }; 
      nearbyGround.push(nearbyBusiness);
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Nearby Business Fetched",
      nearbyGround,
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
