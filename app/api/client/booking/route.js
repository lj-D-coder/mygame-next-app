import PricingModel from "@/app/(models)/PricingModel";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import BusinessSetup from "@/app/(models)/BusinessSetup";
import MatchModel from "@/app/(models)/MatchModel";
import BookingModel from "@/app/(models)/BookingModel";
import convertToUnixTime from "@/lib/utils/to-unix-time";
import createOrder from "@/lib/utils/create-order-rzp";
import getNextSequence from "@/lib/utils/receipt-sequencer";
import countPlayer from "@/lib/utils/player-count";

export async function POST(req) {
  await connection();
  try {
    const {
      userId,
      UserName,
      businessID,
      noOfSlot,
      sideChoose,
      date,
      startTime,
      endTime,
      bookingType,
      paymentInfo,
    } = await req.json();

    const newPlayerCount = UserName.length;

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

    const playerCapacity = businessData.slot.playerPerSide * 2;

    const pricingData = await PricingModel.findOne({ businessID });
    if (!pricingData) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "pricing Data Not found!",
      });
    }

    const matchDate = Date.parse(date) / 1000;
    const StartTimestamp = await convertToUnixTime(date, startTime);
    const EndTimestamp = await convertToUnixTime(date, endTime);
    const matchLength = (EndTimestamp - StartTimestamp) / 60;

    const query = {
      businessID,
      EndTimestamp,
      EndTimestamp,
    };
    const isMatchExist = await MatchModel.find(query);

    if (isMatchExist.length === 0) {
      const newMatch = new MatchModel({
        businessID,
        bookingType,
        playerCapacity,
        matchDate,
        noOfSlot,
        gameTime: matchLength,
        playerJoined: 0,
        StartTimestamp,
        EndTimestamp,
      });
      var matchSave = await newMatch.save();
    }
    var findMatch = isMatchExist[0] ? isMatchExist[0] : matchSave;

    let validSide = sideChoose;
    if (findMatch.teams) {
      var playerCountReqSide = await countPlayer(findMatch.teams[validSide]);
      console.log(playerCountReqSide);
      // return
      if (playerCountReqSide + newPlayerCount > businessData.slot.playerPerSide) {
        validSide = validSide === "leftTeam" ? "rightTeam" : "leftTeam";

        var playerCountSwitchedSide = await countPlayer(findMatch.teams[validSide]);
        if (playerCountSwitchedSide + newPlayerCount > businessData.slot.playerPerSide) { 
          return NextResponse.json({
            status: 400,
            success: false,
            message: "Match the number of players to available slots on each side before booking.",
          });
        }
         NextResponse.json({
          status: 200,
          success: true,
          message: "Auto switch sides, as not enough space on selected side.",
        });
      }
      const totalPlayer = findMatch.playerJoined + newPlayerCount;
      if (totalPlayer > playerCapacity) {
        return NextResponse.json({
          status: 200,
          success: false,
          message: `No free Slot`,
        });
      }
    }

    const updateMatchId = findMatch ? findMatch._id : matchSave._id;
    var receiptNo = await getNextSequence("65bbae0ef201573df4ed646f");
    if (!receiptNo) {
      receiptNo = 0;
    }

    const newBooking = new BookingModel({
      userId,
      businessID,
      matchId: updateMatchId,
      bookingType,
      bookingStatus: "pending",
      bookingDate: new Date(),
      receiptNo,
      paymentInfo,
    });
    const booking = await newBooking.save();

    const priceValidation = paymentInfo.amountPaid / paymentInfo.quantity;
    if (bookingType === "individual") {
      let isPriceMatched =
        priceValidation === parseInt(pricingData.price.individual.Price);
    } else {
      let isPriceMatched =
        priceValidation === parseInt(pricingData.price.field.Price);
    }

    if (!priceValidation) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "pricing not match!",
      });
    }

    const data = {
      amount: paymentInfo.amountPaid * 100,
      currency: "INR",
      receipt: `MG00${receiptNo}`,
      notes: {
        bookingId: booking._id,
        orderAmount: paymentInfo.amountPaid,
        customerName: user.userName,
        customerPhone: user.phoneNo,
      },
    };

    //console.log(data);

    const rzpOrder = await createOrder(data);

    //console.log(rzpOrder);

    if (booking && bookingType !== "individual") {
      await MatchModel.updateOne(
        { _id: updateMatchId },
        {
          $set: { playerJoined: playerCapacity },
        }
      );

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Playground booking created",
        bookingId: booking._id,
        rzpOrder,
      });
    }

    const addPlayer = { [`teams.${validSide}.${booking._id}`]: UserName };
    const result = await MatchModel.updateOne(
      { _id: updateMatchId },
      {
        $push: addPlayer,
        $inc: { playerJoined: newPlayerCount }, // increment playerJoined
      }
    );

    if (result) {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Booking complete",
        bookingId: booking._id,
        rzpOrder,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      success: false,
      message: "Internal Server Error",
    });
  }
}
