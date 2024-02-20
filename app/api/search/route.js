import BusinessSetup from "@/app/(models)/BusinessSetup";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";

export async function POST(req) {
  await connection();
    try {
      
        const { name, address } = await req.json();
    // const businesses = await BusinessSetup.find(
    //     { businessName: { $regex: `^${query}`, $options: 'i' } }
    // ).limit(5).toArray();
        console.log(name, address);
    const businesses = await BusinessSetup
      .find(
        {
          $or: [
            { "businessInfo.name": { $regex: name, $options: "i" } },
            { "businessInfo.address": { $regex: address, $options: "i" } },
          ],
        },
        {
          projection: {
            "businessID": 1,
            "businessInfo.name": 1,
            "businessInfo.address": 1,
          },
        }
      ).toArray();

    console.log(businesses);

    if (businesses) {
      return NextResponse.json({
        status: 200,
        success: true,
        message: "Search list Fetched",
        businesses,
      });
    }
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Error", error }, { status: 500 });
  }
}
