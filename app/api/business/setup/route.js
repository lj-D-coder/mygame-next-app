import BusinessSetup from "@/app/(models)/BusinessSetup";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";

// Controller to get business hours
export async function POST(req) {
  try {
    const { businessStatus, businessInfo, businessHours, slot, bookingType } =
      await req.json();

    if (!businessInfo.phoneNo || businessInfo.phoneNo === null) {
      return NextResponse.json({
        success: false,
        message: "Missing PhoneNo in businessInfo",
      });
    }

    const findBusId = await Users.findOne({ loginId: businessInfo.phoneNo });
    if (findBusId) {
      const findBusiness = await BusinessSetup.findOne({
        businessID: findBusId._id,
      });
      if (!findBusiness) {
        return NextResponse.json({
          success: false,
          message: "Business Data Not Available",
        });
      }
      return NextResponse.json({
        success: true,
        message: "Fetched Business Data",
        findBusiness,
      });
    }

    const user = new Users({
      loginId: businessInfo.phoneNo,
      userName: businessInfo.name,
      phoneNo: businessInfo.phoneNo,
      userRole: "business",
      email: businessInfo.email,
    });

    const createId = await user.save({ omitUndefined: true });
    const businessID = await createId._id;
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


export async function GET() {
  try {

    // Query the 'users' collection for users with the role 'business'
    const business = await Users.find({ userRole: 'business' });

    // Fetch user data for each user
    const businessWithData = await Promise.all(business.map(async (business) => {
      const businessData = await BusinessSetup.findOne({ businessID: business._id });
      return { ...business._doc, businessData };
    }));

    // Send the users with their data as the response
    return NextResponse.json({ status: 200, message: "Success", "data": businessWithData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ status: 500, error: 'An error occurred while trying to fetch the users.' });
  }
}