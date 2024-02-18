// import BusinessSetup from "@/app/(models)/BusinessSetup";
// import { NextResponse } from "next/server";
// import connection from "@/lib/utils/db-connect";
// import MatchModel from "@/app/(models)/MatchModel";
// import Users from "@/app/(models)/Users";
// import getAvailableSlots from "@/lib/utils/avail-slots-today"; 

// export async function GET(req, { params }) {
//   await connection();
//   try {
//     const { businessID } = params;

//     let today = new Date();
//     today.setHours(0, 0, 0, 0);
//     var slots = await getAvailableSlots(openTime, closeTime, gameLength, today);
//       console.log(slots);

//     const matches = await MatchModel.find({
//       businessID,
//       matchDate: { $gte: today.getTime() / 1000 }, // convert to seconds since epoch
//     });
//     //console.log(matches)
//     return NextResponse.json({
//       status: 200,
//       success: true,
//       message: "Nearby Business Fetched",
//       // matches
//     });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({
//       status: 500,
//       error: "An error occurred while trying to fetch the users.",
//     });
//   }
// }
