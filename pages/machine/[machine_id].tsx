import "../../app/globals.css";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type MachineStatus = {
  type: string;
  dorm: string;
  floor: number;
  machine_number: number;
  owner_name?: string;
  owner_room_number?: number;
  salt?: string;
};

export default function MachineStatus() {
  const router = useRouter();
  const [machineStatus, setMachineStatus] = useState<MachineStatus | null>(
    null
  );

  useEffect(() => {
    const getMachineStatus = async () => {
      try {
        const response = await fetch(
          "/api/machine/get?machine_id=" + router.query.machine_id
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setMachineStatus(data);
      } catch (error) {
        setMachineStatus(null);
      }
    };

    getMachineStatus();
  }, [router.query.machine_id]);

  return (
    <div>
      {machineStatus ? (
        <div>
          <div className="text-3xl">New Livingstone</div>
          <div className="text-2xl">Floor {machineStatus.floor}</div>
          <div className="text-xl">
            Floor {machineStatus.type} {machineStatus.number}
          </div>
          <div>
            {
              machineStatus.owner_name ? <>
                <div>Owner: {machineStatus.owner_name}</div>
                <div>Owner's Room Number: {machineStatus.owner_room_number}</div>
              </> : <></>
            }
          </div>
        </div>
      ) : (
        "No"
      )}
    </div>
  );
}
