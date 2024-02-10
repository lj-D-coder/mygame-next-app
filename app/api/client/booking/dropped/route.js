import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import MatchModel from "@/app/(models)/MatchModel";
import BookingModel from "@/app/(models)/BookingModel";

export async function POST(req) {
  await connection();
  try {
    const { bookingId } = await req.json();
    console.log(bookingId);
    const booking = await BookingModel.findById(bookingId);
    booking.bookingStatus = "dropped";
    await booking.save();

    const match = await MatchModel.findById(booking.matchId);

    if (match.bookingType !== "individual") {
      const deleteMatch = await MatchModel.deleteOne({ _id: booking.matchId });
      console.log("Match removed successfully");
      return NextResponse.json({
        status: 200,
        success: true,
        message: "removed match data",
      });
    }

    const teams = match.teams;

    if (!teams.rightTeam.get(bookingId) && !teams.leftTeam.get(bookingId)) {
      console.log("BookingId not found in teams.");
    }

    // Get the player array associated with the bookingId
    const playerArray = teams.rightTeam.get(bookingId)
      ? teams.rightTeam.get(bookingId)
      : teams.leftTeam.get(bookingId);

    // Update playerJoined count based on the reduced number of players
    const originalPlayerCount = match.playerJoined;
    const updatedPlayerCount = Math.max(
      originalPlayerCount - (playerArray ? playerArray.length : 0),
      0
    );

    match.playerJoined = updatedPlayerCount;

    // Delete the key-value pair based on the bookingId
    if (teams.rightTeam.get(bookingId)) {
      teams.rightTeam.delete(bookingId);
    } else if (teams.leftTeam.get(bookingId)) {
      teams.leftTeam.delete(bookingId);
    }
    var result = await match.save();

    // Check if player data is empty or null, then delete the whole match
    if (updatedPlayerCount === 0) {
      var result = await MatchModel.deleteOne({ _id: booking.matchId });
      //return res.json({ message: 'Match removed successfully.' });
      console.log("Match removed successfully");
    }
    if (result) {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "removed match data",
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
