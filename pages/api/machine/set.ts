import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const machineId = request.query.machine_id;
  const ownerName = request.query.owner_name;
  const ownerRoomNumber = request.query.owner_room_number;

  if (machineId == null || ownerName == null || ownerRoomNumber == null) {
    return response.status(404).json({
      error:
        "please send a machine id, owner name, and room number with your request",
    });
  }

  const machineData = await kv.hgetall("machine:" + machineId);
  try {
    await kv.hset("machine:" + machineId, {
      ...machineData,
      owner_name: ownerName,
      owner_room_number: ownerRoomNumber,
    });
  } catch (error) {
    console.log(error);
  }

  return response.status(200).json({ status: "success" });
}
