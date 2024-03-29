import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import MatchModel from "@/app/(models)/MatchModel";
import Users from "@/app/(models)/Users";
import PricingModel from "@/app/(models)/PricingModel";

export async function GET(req, { params }) {
  await connection();
  try {
    const { businessID } = params;

    //console.log(businessID);
    const business = await Users.findById(businessID);
    //console.log(business)
    if (!business) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "invalid business ID",
      });
    }
    const individualPrice = await PricingModel.findOne({ businessID: businessID }).select('price.individual.Price');
    if (!individualPrice) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "Price data not found",
      });
    }
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const matches =await MatchModel.find({
    businessID,
    matchDate: { $gte: today.getTime() / 1000 } // convert to seconds since epoch
    }).select('-teams -__v');
    //console.log(matches)

    const allMatches = matches.map(match => {
      const { _id: matchId, ...rest } = match.toObject();
      return {
        matchId,
        "price": individualPrice.price.individual.Price,
        ...rest
      };
     });

    return NextResponse.json({
        status: 200,
        success: true,
        message: "fetched all matches",
        data: allMatches
      });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: "An error occurred.",
    });
  }
}