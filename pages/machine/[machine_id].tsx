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

  return <p>Page for machine with ID {router.query.machine_id}</p>;
}
