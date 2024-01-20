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
        await BusinessSetup.findByIdAndDelete(businessData._id);
        await Users.findByIdAndDelete(businessID);
        return NextResponse.json({ message: "Business Data Deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}

export async function PUT(req, { params }) { 
    try {
        const { businessID } = params;
        const body = await req.json();
        const newData = body.formData;
        const findId = await BusinessSetup.findOne({ businessID });
        const updateTicketData = await BusinessSetup.findByIdAndUpdate(findId._id, { ...newData, });
        return NextResponse.json({ message: "Data Updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error", error }, { status: 500 });
    }
}