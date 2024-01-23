import Ticket from "@/app/(models)/Ticket";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";


export async function POST(req) {
    await connection();
    try {
        const body = await req.json();
        const ticketData = body.formData;
        await Ticket.create(ticketData);
        return NextResponse.json({ messsage: "Ticket Created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ messsage: "Error", error }, { status: 500 });
    }
}

export async function GET() { 
    await connection();
    try {
        const tickets = await Ticket.find();
        return NextResponse.json({ tickets }, {status: 200})

    } catch (error) {
        return NextResponse.json({ messsage: "Error", error }, { status: 500 });
    }
}

