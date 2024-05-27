import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import BookingModel from "@/app/(models)/BookingModel";
import BusinessSetup from "@/app/(models)/BusinessSetup";
import MatchModel from "@/app/(models)/MatchModel";


export async function GET(req, { params }) {
  await connection();
  try {
   
    const { userId } = params;
    //const newPlayerCount = UserName.length;

    const user = await Users.findById(userId);
    if (!user) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "User ID not Found",
      });
    }

    const myBookings = await BookingModel.find({ userId }).sort({ createdAt: -1 }).select('-updatedAt -__v');
    const allBookings = await Promise.all(myBookings.map(async (booking) => {
      // Fetch business information for each booking
      const business = await BusinessSetup.findOne({ businessID: booking.businessID });
      const findMatch = await MatchModel.findById(booking.matchId);

      // Destructure booking object and rename keys as needed
      const { _id: bookingId, createdAt, ...rest } = booking.toObject();

      // Return the new booking object with additional business information
      return {
        bookingId,
        businessName: business?.businessInfo?.name || 'Unknown Business',
        matchStartTime: findMatch.StartTimestamp,
        matchEndTime: findMatch.EndTimestamp,
        ...rest
      };
    }));
    
    //console.log(allBookings);

      return NextResponse.json({
        status: 200,
        success: true,
        message: "Fetching Booking",
        data: allBookings
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
