import { kv } from "@vercel/kv";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const machineId = request.query.machine_id;

  if (machineId == null) {
    return response.status(404).json({
      error: "please send a machine id with your request",
    });
  }

  const machineData = await kv.hgetall("machine:" + machineId);
  try {
    await kv.hset("machine:" + machineId, {
      ...machineData,
      owner_name: null,
      owner_room_number: null,
    });
  } catch (error) {
    console.log(error);
  }

  return response.status(200).json({ status: "success" });
}
