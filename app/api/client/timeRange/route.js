import moment from "moment";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import BusinessSetup from "@/app/(models)/BusinessSetup";
import MatchModel from "@/app/(models)/MatchModel";


export async function POST(req) {
  try {
    await connection();
    const { businessID, date } = await req.json();

    const businessData = await BusinessSetup.findOne({ businessID });
    if (!businessData) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Business ID not Found",
      });
    }

    let openTime = businessData.businessHours["openTime"];
    let closeTime = businessData.businessHours["closeTime"];
    let gameLength = businessData.slot["gameLength"];

    const matchDate = Date.parse(date) / 1000;
    const query = {
      businessID,
      matchDate,
    };
    const findMatch = await MatchModel.find(query);

    let timeRanges = [];

    let startTime = moment(openTime, "h:mm A");
    let endTime = moment(closeTime, "h:mm A");

    while (startTime.isBefore(endTime)) {
      let endTimeSlot = moment(startTime).add(gameLength, "minutes");
      if (endTimeSlot.isAfter(endTime)) {
        break;
      }
      let startTimeString = startTime.format("h:mm A");
      let endTimeString = endTimeSlot.format("h:mm A");

      let status = "open";
      if (findMatch.length > 0) {
        for (let match of findMatch) {
          let matchStartTime = moment
            .unix(match.StartTimestamp)
            .utc()
            .format("h:mm A");
          let matchEndTime = moment
            .unix(match.EndTimestamp)
            .utc()
            .format("h:mm A");
          if (
            moment(startTimeString, "h:mm A").unix() >=
              moment(matchStartTime, "h:mm A").unix() &&
            moment(endTimeString, "h:mm A").unix() <=
              moment(matchEndTime, "h:mm A").unix() &&
            match.playerCapacity === match.playerJoined
          ) {
            status = "close";
            break;
          }
        }
      }

      //timeRanges[`${startTimeString} - ${endTimeString}`] = status;
      timeRanges.push(`${startTimeString} - ${endTimeString}`, status);
      startTime.add(gameLength, "minutes");
    }

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Success",
      timeRanges,
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
