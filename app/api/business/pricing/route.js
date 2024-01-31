import PricingModel from "@/app/(models)/PricingModel";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import BusinessSetup from "@/app/(models)/BusinessSetup";

// Controller to get business hours
export async function POST(req) {
  await connection();
  try {
    const { businessID, price, coupon } = await req.json();

    const business = await Users.findById(businessID);
    if (!business || business.userRole !== "business") {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Business ID not Found",
      });
    }

    const PricingData = await PricingModel.findOne({
      businessID: business._id,
    });
    if (PricingData) {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Fetching Business Pricing",
        data: PricingData,
      });
    }

    if (price) {
      const addPricing = new PricingModel({
        businessID,
        price,
        coupon,
      });
      const data = await addPricing.save({ omitUndefined: true });

      if (data) {
        const update = { "businessStatus.setupComplete": true };
        await BusinessSetup.updateOne({ businessID }, { $set: update });
      }
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Business pricing data saved",
        data,
      });
    }
    return NextResponse.json({
      status: 404,
      success: false,
      message: "pricing Data Not found!",
      data,
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

// export async function GET(req) {
//   await connection();
//   try {
//     const url = new URL(req.url, `http://${req.headers.host}`);
//     const businessID = url.searchParams.get('businessID');
//     console.log(businessID);
//     const findUser = await Users.findById(businessID);
//       if (!findUser) {
//           return NextResponse.json({
//               status: 404,
//               success: false,
//               message: "invalid User ID",
//             });
//       }
//     //check if business is open close open in that day business is not holiday
//     const pricingData = await PricingModel.findOne({ businessID});
//     if (!pricingData) {
//       return NextResponse.json({
//         status: 404,
//         success: false,
//         message: "404 Pricing Data not Found!"
//       });
//     }
//     // Send the users with their data as the response
//     return NextResponse.json({ status: 200, message: "Success Pricing Fetched", "data": pricingData });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ status: 500, error: 'An error occurred while trying to fetch the data.' });
//   }
// }
