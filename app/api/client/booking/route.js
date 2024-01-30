import PricingModel from "@/app/(models)/PricingModel";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import BusinessSetup from "@/app/(models)/BusinessSetup";
import MatchModel from "@/app/(models)/MatchModel";
import BookingModel from "@/app/(models)/BookingModel";

export const convertToUnixTime = (date, time) => {
  // Combine the date and start time into a single string
  const dateTime = `${date}T${time}:00`;

  // Create a Date object
  const dateObj = new Date(dateTime);

  // Convert to Unix timestamp in seconds
  const unixTime = dateObj.getTime() / 1000;

  return unixTime;
};

// Controller to get business hours
export async function POST(req) {
  await connection();
  try {
    const {
      userId,
      UserName,
      businessID,
      matchId,
      sideChoose,
      date,
      startTime,
      endTime,
      bookingType,
      paymentInfo,
    } = await req.json();

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "User ID not Found",
      });
    }

    const businessData = await BusinessSetup.findOne({ businessID });
    if (!businessData) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Business ID not Found",
      });
    }

    const PricingData = await PricingModel.findOne({ businessID });
    if (!PricingData) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "pricing Data Not found!",
      });
    }

    // generate bookingId add payment details
    //Date and time , Blocking Logic should be added
    // individual booking will only block when all players are full but in  this time frame no ground booking
    // Usage:

    const StartTimestamp = convertToUnixTime(date, startTime);
    const EndTimestamp = convertToUnixTime(date, endTime);

    const findMatch = await MatchModel.findById(matchId);
    //query again with matchId and check the player count if find to add additional player
//console.log(findMatch);

    if (matchId === null && !findMatch) {
      const query = {
        businessID,
        EndTimestamp,
        EndTimestamp,
      };
        const isMatchExist = await MatchModel.find(query);
//console.log(findMatch);
      if (isMatchExist.length !== 0) {
        return NextResponse.json({
          status: 400,
          success: false,
          message: "A match is already exits Provide match Id",
        });
      }
      
      const newMatch = new MatchModel({
        // Fill in the match details here
        businessID,
        bookingType,
        gameTime: businessData.slot.gameLength,
        playerJoined: 0,
        StartTimestamp,
        EndTimestamp,
      });
      var matchSave = await newMatch.save();
      // look in to player no
    }
//console.log(matchSave);
      const updateMatchId = findMatch ? findMatch._id : matchSave._id;
//console.log(updateMatchId);
    const newBooking = new BookingModel({
      userId,
      businessID,
      matchId: updateMatchId,
      bookingType,
      bookingStatus: "pending",
      bookingDate: new Date(),
      paymentInfo,
    });
      const booking = await newBooking.save();
//console.log(booking);
      if (!booking) { 
        return NextResponse.json({
            status: 400,
            success: false,
            message: "fail in creating booking",
          });
      }

      const addPlayer = {
          [sideChoose]: {
            [booking._id]:UserName  
          } 
    };
    
// console.log(updateMatchId);
console.log(addPlayer);
const result = await MatchModel.updateOne({ _id: updateMatchId }, { $set: addPlayer });

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Match created",
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
