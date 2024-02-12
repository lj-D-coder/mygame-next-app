import BusinessSetup from "@/app/(models)/BusinessSetup";
import Users from "@/app/(models)/Users";
import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import PricingModel from "@/app/(models)/PricingModel";
//import removeNulls from "@/lib/utils/clean-json";

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
    // Fetch user data for each user
    const businessData = await BusinessSetup.findOne({
      businessID: business._id,
    });
    console.log(businessData)
    if (!businessData) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "business data not set",
      });
    }

    let PricingData = await PricingModel.findOne({
      businessID: business._id,
    });

    if (!PricingData) {
      PricingData = undefined;
    }
    // Combine the business data with the business document
    const data = { ...business._doc, businessData, PricingData };

    // Send the users with their data as the response
    return NextResponse.json({ status: 200, message: "Success", data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: "An error occurred while trying to fetch the users.",
    });
  }
}

export async function DELETE(req, { params }) {
  await connection();
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
    return NextResponse.json(
      { status: 200, message: "Business Data Deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Error", error },
      { status: 500 }
    );
  }
}

// export async function PUT(req, { params }) {
//   await connection();
//   try {
//     const { businessID } = params;
//     let fieldsToUpdate = await req.json();
//     // Remove any fields that have null values
//     const processData = removeNulls(fieldsToUpdate);

//     //console.log(fieldsToUpdate);

//     if (fieldsToUpdate.businessInfo) {
//       let patchUserData = {
//         loginId: fieldsToUpdate.businessInfo.phoneNo,
//         userName: fieldsToUpdate.businessInfo.name,
//         phoneNo: fieldsToUpdate.businessInfo.phoneNo,
//         userRole: "business",
//         email: fieldsToUpdate.businessInfo.email,
//       };
//       const updateData = removeNulls(patchUserData);
//       //console.log(patchUserData);
//       const updated = await Users.findByIdAndUpdate(businessID, {
//         ...updateData,
//       });
//     }

//     const findId = await BusinessSetup.findOne({ businessID });
//     await BusinessSetup.findByIdAndUpdate(findId._id, { ...processData });
//     return NextResponse.json(
//       { status: 200, message: "Data Updated" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { status: 500, message: "Error", error },
//       { status: 500 }
//     );
//   }
// }

export async function PATCH(req, { params }) {
  await connection();
  try {
    const { businessID } = params;

    const business = await Users.findById(businessID);
    if (!business) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "invalid business ID",
      });
    }

    let data = await req.json();

    const find = await BusinessSetup.findOne({ businessID });

    if (!business) {
      return NextResponse.json({
        status: 200,
        success: false,
        message: "Business Data not Found",
      });
    }

    // Prepare the update object
    let updateObject = {};
    function iterate(obj, stack) {
      for (let property in obj) {
        if (obj.hasOwnProperty(property)) {
          if (typeof obj[property] === "object") {
            iterate(obj[property], stack ? stack + "." + property : property);
          } else {
            if (obj[property] !== null) {
              updateObject[stack ? stack + "." + property : property] =
                obj[property];
            }
          }
        }
      }
    }
    iterate(data, "");

    // Perform the update operation
    const result = await BusinessSetup.updateOne(
      { _id: find._id },
      { $set: updateObject }
    );

    if (result) {
      return NextResponse.json(
        { status: 200, message: "Data patched" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { status: 200, message: "Data patched error" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 500, message: "Error", error },
      { status: 500 }
    );
  }
}
