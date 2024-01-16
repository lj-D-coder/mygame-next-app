import BusinessSetup from "@/app/(models)/BusinessSetup";
import { NextResponse } from "next/server";

// Controller to get business hours
export async function POST(req) {
  try {
    const {
      businessID,
      businessStatus,
      businessInfo,
      businessHours,
      slot,
      bookingType,
    } = await req.json();
      
      const findBusiness = await BusinessSetup.findOne({ businessID });
      if (findBusiness) {
        return NextResponse.json({
            success: true,
            message: "Fetched Business Data",
            findBusiness,
          });
      }

    const newBusiness = new BusinessSetup({
      businessID,
      businessStatus,
      businessInfo,
      businessHours,
      slot,
      bookingType,
    });

    const savedBusiness = await newBusiness.save({ omitUndefined: true });

    return NextResponse.json({
      success: true,
      message: "Business Data Saved",
      savedBusiness,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
