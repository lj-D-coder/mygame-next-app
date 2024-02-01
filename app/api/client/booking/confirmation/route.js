import firebaseApp from "@/lib/firebase/config";
import { NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; 
import connection from "@/lib/utils/db-connect";
import MatchModel from "@/app/(models)/MatchModel";
import BookingModel from "@/app/(models)/BookingModel";
import removeProperties from "@/lib/utils/delete-keys";

const firestore_db = getFirestore(firebaseApp); // Use getFirestore

export async function POST(res) {
  await connection();
  try {
    const { bookingId } = await res.json();
    const booking = await BookingModel.findById(bookingId);
    const data = await MatchModel.findById(booking.matchId);

    // Convert the data to a plain JavaScript object
    let dataToSave = data.toObject();

    // Convert _id to a string
    //dataToSave._id = dataToSave._id.toString();
    
    dataToSave = await removeProperties(dataToSave, ['_id', '__v']);
    

    // Convert teams to plain JavaScript objects
    for (let team in dataToSave.teams) {
      let teamData = {};
      for (let key in dataToSave.teams[team]) {
        teamData[key] = [...dataToSave.teams[team][key]];
      }
      dataToSave.teams[team] = Object.fromEntries(dataToSave.teams[team]);
    }

    const docRef = doc(firestore_db, 'matchesCollection', booking.matchId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, dataToSave);
    } else {
      await updateDoc(docRef, dataToSave);
    }

    console.log(`Document updated with ID: ${docRef.id}`);

    // Return the document ID as a response
    return NextResponse.json({ id: docRef.id, docRef }, { status: 201 })
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
