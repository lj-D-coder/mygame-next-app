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

    // Convert the data to a plain JavaScript object
    let dataToSave = data.toObject();

    dataToSave = await removeProperties(dataToSave, ["_id", "__v"]);

    // Convert teams to plain JavaScript objects
    for (let team in dataToSave.teams) {
      let teamData = {};
      for (let key in dataToSave.teams[team]) {
        teamData[key] = [...dataToSave.teams[team][key]];
      }
      dataToSave.teams[team] = Object.fromEntries(dataToSave.teams[team]);
    }

    const docRef = firestore_db.doc("matchesCollection/" + booking.matchId);
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
