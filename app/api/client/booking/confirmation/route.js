import firebaseApp from "@/lib/firebase/config";
import { NextResponse } from 'next/server'
import { getFirestore, collection, addDoc } from 'firebase/firestore' // Import getFirestore and collection

const firestore_db = getFirestore(firebaseApp) // Use getFirestore

// Define the POST route handler
export async function POST(res) {
  // Get the username and address from the request body
  const { username, address } = await res.json()

  // Validate the input data
  if (!username || !address) {
    return NextResponse.json({ error: 'Missing username or address' }, { status: 400 })
  }

  try {
    // Create a new document in the users collection with the input data
    const docRef = await addDoc(collection(firestore_db, 'usersTest'), { // Use collection and addDoc
      username,
      address,
    })

    // Return the document ID as a response
    return NextResponse.json({ id: docRef.id }, { status: 201 })
  } catch (error) {
    // Handle any errors
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
