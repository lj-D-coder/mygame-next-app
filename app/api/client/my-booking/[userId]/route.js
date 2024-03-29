import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import BookingModel from "@/app/(models)/BookingModel";


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
    const allBookings = myBookings.map(booking => {
      const { _id: bookingId, createdAt, ...rest } = booking.toObject();
      return {
        bookingId,
        ...rest
      };
     });
    
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
