import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import UsersLocationModel from "@/app/(models)/usersLocationService";



function arrayIncludesObject(array, businessID) {
  return array.some((obj) => obj.businessID === businessID);
}

export async function POST(req) {
  await connection();
  try {
    const { userLocation, radius } = await req.json();

    // let userLocation = [longitude, latitude]; // make sure to input longitude first, then latitude

    let nearbyUsers = UsersLocationModel.find({
      userLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: userLocation,
          },
          $maxDistance: radius, // distance in meters
        },
      },
    }).select("_id");

    let arrUserIds = await nearbyUsers.exec();
    console.log(arrUserIds);

    let nearbyGround = [];
    let matches = [];

    
    // for (let obj of arrBusinessId) {
    //   let business = await BusinessSetup.findOne({
    //     businessID: obj._id,
    //   });

    //   //console.log(business)

    //   let {
    //     businessInfo: { name, address, bannerUrl },
    //     businessHours: { openTime, closeTime },
    //     slot: { gameLength },
    //     businessID,
    //   } = business; //destructuring business

  
    // }

   // console.log(matches);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Nearby Business Fetched",
      arrUserIds,
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

// var currentTime = new Date();
// var availableSlots = await getAvailableSlots(openTime, closeTime, gameLength, currentTime);
// console.log(availableSlots);

// let now = new Date();

// let requestTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
// //tomorrow.setHours(0, 0, 0, 0); // Set the time to 12 AM
// var freeSlotsTomorrow = await getAvailableSlots(openTime, closeTime, gameLength, requestTime);
// console.log(freeSlotsTomorrow);

// for (let slot of freeSlotsTomorrow) {
//   //let today = moment().format("YYYY-MM-DD");
//   let tomorrow = moment().add(1, "days").format("YYYY-MM-DD");

//   // let startTimestampToday = moment(
//   //   `${today} ${slot.startTime}`,
//   //   "YYYY-MM-DD h:mm:ss A"
//   // ).unix();
//   let startTimestampTomorrow = moment(
//     `${tomorrow} ${slot.startTime}`,
//     "YYYY-MM-DD h:mm:ss A"
//   ).unix();

//   // let matchesToday = await MatchModel.find({
//   //   businessID: businessID,
//   //   StartTimestamp: startTimestampToday,
//   //   $expr: { $ne: ["$playerCapacity", "$playerJoined"] },
//   // });

//   let matchesTomorrow = await MatchModel.find({
//     businessID: businessID,
//     StartTimestamp: startTimestampTomorrow,
//     $expr: { $ne: ["$playerCapacity", "$playerJoined"] },
//   });

//   // Merge matchesToday and matchesTomorrow
//   //let matches = matchesToday.concat(matchesTomorrow);

//   matches.push(matchesTomorrow);

//   // Process the matches as needed

//   //let nearbyBusiness = { businessID, name, address, bannerUrl };
// }

//////////////////////////////////////////////////////////////////////

// console.log(matches);
// console.log("///////////////////////////")
// console.log(nearbyGround);

// //////////////////////////////////////////////////////////////////
