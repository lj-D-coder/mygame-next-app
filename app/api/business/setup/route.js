import BusinessSetup from "@/app/(models)/BusinessSetup";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";

// Controller to get business hours
export async function POST(req) {
  try {
    const {
      businessStatus,
      businessInfo,
      businessHours,
      slot,
      bookingType,
    } = await req.json();

    if (businessInfo.phoneNo) {
      //const checkloginId = await Users.findOne({ loginId });
      const user = new Users({
        loginId: businessInfo.phoneNo,
        userName: businessInfo.name,
        phoneNo: businessInfo.phoneNo,
        userRole: "business",
        email: businessInfo.email
      });

      const createId = await user.save({ omitUndefined: true });

      const businessID = await createId._id;
      
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
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


export async function PUT(req, { params }) { 
  try {
      const { id } = params;
      const body = await req.json();
      const ticketData = body.formData;

      const updateTicketData = await Ticket.findByIdAndUpdate(id, { ...ticketData, });
      return NextResponse.json({ message: "Ticket Updated" }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}