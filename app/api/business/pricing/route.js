import PricingModel from "@/app/(models)/PricingModel";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";

// Controller to get business hours
export async function POST(req) {
  await connection;
  try {
    const { businessID, price, coupon} = await req.json();

    const business = await Users.findById(businessID);
        if (!business) { 
            return NextResponse.json({
                status: 404,
                success: false,
                message: "invalid business ID",
              });
        }
            
    
    const addPricing = new PricingModel({
      businessID,
      price,
      coupon
      });
      const data = await addPricing.save({ omitUndefined: true });


    return NextResponse.json({
      success: true,
      message: "Business Data Saved",
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


// export async function GET() {
//   await connection;
//   try {
//     const { userId } = await req.json();
//     const findUser = await Users.findById(userId);
//         if (!findUser) { 
//             return NextResponse.json({
//                 status: 404,
//                 success: false,
//                 message: "invalid User ID",
//               });
//         }
    
//     // Send the users with their data as the response
//     return NextResponse.json({ status: 200, message: "Success", "data": businessWithData });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ status: 500, error: 'An error occurred while trying to fetch the users.' });
//   }
// }