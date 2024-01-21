import Ticket from "@/app/(models)/Ticket";
import BusinessSetup from "@/app/(models)/BusinessSetup";
import Users from "@/app/(models)/Users";

import { NextResponse } from "next/server";

export async function GET(req, { params }) { 
    try {
  
        const { businessID } = params;
        const business = await Users.findById( businessID);
        // Fetch user data for each user
        const businessData = await BusinessSetup.findOne({ businessID: business._id });

        // Combine the business data with the business document
        const data = { ...business._doc, businessData };
    
        // Send the users with their data as the response
        return NextResponse.json({ status: 200, message: "Success", data});
      } catch (error) {
        console.error(error);
        return NextResponse.json({ status: 500, error: 'An error occurred while trying to fetch the users.' });
      }
}



export async function DELETE(req, { params }) { 
    try {
        const { businessID } = params;
        const businessData = await BusinessSetup.findOne({ businessID });
        const deleted = await BusinessSetup.findByIdAndDelete(businessData._id);
        if (!deleted) { 
            return NextResponse.json({
                status: 404,
                success: false,
                message: "input business ID is not valid",
              });
        }
        await Users.findByIdAndDelete(businessID);
        return NextResponse.json({status: 200, message: "Business Data Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({status: 500, message: "Error", error }, { status: 500 });
    }
}

export async function PUT(req, { params }) { 

    try {
        const { businessID } = params;
        const newData = await req.json();
    
        const newUserData = {
            loginId: newData.businessInfo.phoneNo,
            userName: newData.businessInfo.name,
            phoneNo: newData.businessInfo.phoneNo,
            userRole: "business",
            email: newData.businessInfo.email,
          };
      
        //const createId = await user.save({ omitUndefined: true });
        const updated = await Users.findByIdAndUpdate(businessID, { ...newUserData });
        if (!updated) { 
            return NextResponse.json({
                status: 404,
                success: false,
                message: "input business ID is not valid",
              });
        }
        //const newData = body.formData;
        const findId = await BusinessSetup.findOne({ businessID });
        await BusinessSetup.findByIdAndUpdate(findId._id, { ...newData});
        return NextResponse.json({status: 200 , message: "Data Updated" },{ status: 200 });
    } catch (error) {
        return NextResponse.json({  status: 500, message: "Error", error }, { status: 500 });
    }
}