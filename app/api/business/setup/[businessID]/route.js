import Ticket from "@/app/(models)/Ticket";
import BusinessSetup from "@/app/(models)/BusinessSetup";
import Users from "@/app/(models)/Users";

import { NextResponse } from "next/server";

// export async function GET(req, { params }) { 
//     try {
//         const { id } = params;
//         const foundTicket = await Ticket.findOne({ _id: id });
//         return NextResponse.json({ foundTicket }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ message: "Error", error }, { status: 500 });
//     }
// }

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