import { NextResponse } from "next/server";
import connection from "@/lib/utils/db-connect";
import MatchModel from "@/app/(models)/MatchModel";

export async function GET(req, { params }) {
  await connection();
  try {
    const { matchId } = params;
    const findMatch = await MatchModel.findById(matchId).lean();

    const { _id, __v, teams, ...rest } = findMatch;

    const { leftTeam: leftTeamObj, rightTeam: rightTeamObj } = teams;

    let data = {
      teams: {
          leftTeam: Object.values(leftTeamObj).flatMap(x => x),
          rightTeam: Object.values(rightTeamObj).flatMap(x => x)
      },
      matchId,
      ...rest
    };

    return NextResponse.json({
      status: 200,
      success: true,
      message: "Fetched match details",
      data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      status: 500,
      error: "An error occurred",
    });
  }
}
