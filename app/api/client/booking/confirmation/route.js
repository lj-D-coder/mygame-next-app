// pages/api/addUser.js
import firestore_db from "@/lib/firebase/admin";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import MatchModel from "@/app/(models)/MatchModel";
import BookingModel from "@/app/(models)/BookingModel";
import removeProperties from "@/lib/utils/delete-keys";

export async function POST(req) {
  await connection();
  try {
    const { bookingId } = await req.json();
    const booking = await BookingModel.findById(bookingId);
    const data = await MatchModel.findById(booking.matchId);
    if (!data || !booking) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "Booking or Match not Found",
      });
    }

    const updateStatus = await BookingModel.updateOne(
      { _id: booking._id },
      {
        $set: {
          bookingStatus: "confirmed",
          "paymentInfo.paymentStatus": "paid",
        },
      }
    );

    if (!updateStatus) {
      return NextResponse.json({
        status: 400,
        success: false,
        message: "error booking status update",
      });
    }

    // Convert the data to a plain JavaScript object
    let dataToSave = data.toObject();
    dataToSave = await removeProperties(dataToSave, ["_id", "__v"]);

    
    if (dataToSave.bookingType === "playground") {

      var addGameTime = (dataToSave.gameTime / dataToSave.noOfSlot) * 60;

      for(let i = 1; i <= dataToSave.noOfSlot; i++) {
        let newData = { ...dataToSave }; // Copy the data object
        newData.EndTimestamp = newData.StartTimestamp + addGameTime;
        newData.gameTime = (newData.gameTime / newData.noOfSlot);
        
        // Insert the new object into the Firestore collection
        let docRef = firestore_db.doc("matchesCollection/" + `${i}SL-${booking.matchId}`);
        await docRef.set(newData);
        
        // Update StartTimestamp for the next slot
        dataToSave.StartTimestamp = newData.EndTimestamp;
      }

      return NextResponse.json({ message: "Success" }, { status: 200 });
    }


    // Convert teams to plain JavaScript objects
    for (let team in dataToSave.teams) {
      let teamData = {};
      for (let key in dataToSave.teams[team]) {
        teamData[key] = [...dataToSave.teams[team][key]];
      }
      dataToSave.teams[team] = Object.fromEntries(dataToSave.teams[team]);
    }

    const docRef = firestore_db.doc("matchesCollection/" + `1SL-${booking.matchId}`);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      await docRef.set(dataToSave);
    } else {
      await docRef.update(dataToSave);
    }

    console.log(`Document updated with ID: ${docRef.id}`);

    // Return the document ID as a response
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
