import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import LocationModel from "@/app/(models)/locationService";
import MatchModel from "@/app/(models)/MatchModel";
import BusinessSetup from "@/app/(models)/BusinessSetup";
import getAvailableSlots from "@/lib/utils/avail-slots-today";
import PricingModel from "@/app/(models)/PricingModel";

import moment from "moment";

function arrayIncludesObject(array, businessID) {
  return array.some((obj) => obj.businessID === businessID);
}

export async function POST(req) {
  await connection();
  try {
    const { userLocation, radius } = await req.json();

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
    let matches = [];

    for (let obj of arrBusinessId) {
      let business = await BusinessSetup.findOne({
        businessID: obj._id,
      });

      //console.log(business)

      let {
        businessInfo: { name, address, bannerUrl },
        businessHours: { openTime, closeTime },
        slot: { gameLength },
        businessID,
      } = business; //destructuring business

      //let nearbyBusiness = { businessID, name, address, bannerUrl };

      var currentTime = new Date();
      var midnightTime = new Date(currentTime);
      midnightTime.setHours(0, 0, 0, 0);
      var freeSlotsTomorrow = await getAvailableSlots(
        openTime,
        closeTime,
        gameLength,
        midnightTime
      );
      //console.log(freeSlotsTomorrow);

      // var availableSlots = await getAvailableSlots(openTime, closeTime, gameLength, currentTime);
      // console.log(availableSlots);

      for (let slot of freeSlotsTomorrow) {
        let tomorrow = moment().add(1, "days").format("YYYY-MM-DD");
        let startTimestampTomorrow = moment(
          `${tomorrow} ${slot.startTime}`,
          "YYYY-MM-DD h:mm:ss A"
        ).unix();

       //console.log(startTimestampTomorrow);
        let matchesTomorrow = await MatchModel.find({
          businessID: businessID,
          StartTimestamp: startTimestampTomorrow,
          $expr: { $ne: ["$playerCapacity", "$playerJoined"] },
        });

        if (matchesTomorrow && Object.keys(matchesTomorrow).length > 0) {
          const individualPrice = await PricingModel.findOne({ businessID: businessID }).select('price.individual.Price');
          //console.log(price)

          let { _id: matchId,businessID, gameTime, playerCapacity, playerJoined, matchDate, StartTimestamp, EndTimestamp } = matchesTomorrow[0];
          let foundMatch = {
            matchId,
            businessID,
            name,
            address,
            "price": individualPrice.price.individual.Price,
            gameTime,
            playerCapacity,
            playerJoined,
            matchDate,
            StartTimestamp,
            EndTimestamp
          };
          
          //let nearbyBusiness = { businessID, name, address, bannerUrl };

          matches.push(foundMatch);
        } 
          if (!arrayIncludesObject(nearbyGround, businessID)) {
            nearbyGround.push({ businessID, name, address, bannerUrl });
          }
      }
    }

   // console.log(matches);

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Nearby Business Fetched",
      nearbyGround,
      matches
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
