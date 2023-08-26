import "../../app/globals.css";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type MachineStatus = {
  type: string;
  dorm: string;
  floor: number;
  number: number;
  owner_name?: string;
  owner_room_number?: number;
  salt?: string;
};

export default function MachineStatus() {
  const router = useRouter();
  const [machineStatus, setMachineStatus] = useState<MachineStatus | null>(
    null
  );
  // we use forceDataRefresh to force the page to refresh when a user rests
  // the page or uploads their data to the page
  const [forceDataRefresh, setForceDataRefresh] = useState<number>(0);

  const [ownerNameValue, setOwnerNameValue] = useState<string | null>(null);
  const [ownerRoomNumberValue, setOwnerRoomNumberValue] = useState<
    number | null
  >(null);

  async function setOwner() {
    try {
      const response = await fetch(
        "/api/machine/set?machine_id=" +
          router.query.machine_id +
          "&owner_name=" +
          ownerNameValue +
          "&owner_room_number=" +
          ownerRoomNumberValue
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setOwnerNameValue(null);
      setOwnerRoomNumberValue(null);

      alert("successful. thank you for being a good new livite.");
      setForceDataRefresh(forceDataRefresh + 1);
    } catch (error) {
      alert("there was an error");
    }
  }

  async function resetOwner() {
    if (
      confirm(
        "are you sure you want to reset this? please do not do this if the clothes in the machine are not yours."
      )
    ) {
      try {
        const response = await fetch(
          "/api/machine/reset?machine_id=" + router.query.machine_id
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setForceDataRefresh(forceDataRefresh + 1);
      } catch (error) {
        alert("there was an error");
      }
    }
  }

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
  }, [router.query.machine_id, forceDataRefresh]);

  return (
    <div>
      {machineStatus ? (
        <div>
          <div className="text-3xl">new livingstone</div>
          <div className="text-2xl">floor {machineStatus.floor}</div>
          <div className="text-xl">
            {machineStatus.type} {machineStatus.number}
          </div>
          <div>
            {machineStatus.owner_name ? (
              <>
                <div>Owner: {machineStatus.owner_name}</div>
                <div>
                  Owner&apos;s Room Number: {machineStatus.owner_room_number}
                </div>
                <button
                  onClick={resetOwner}
                  className="bg-red-600 text-white px-4 py-4"
                >
                  clear owner data
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  className="form-input"
                  placeholder="your name"
                  onChange={(e) => setOwnerNameValue(e.target.value)}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="room number"
                  onChange={(e) =>
                    setOwnerRoomNumberValue(parseInt(e.target.value))
                  }
                />
                <button
                  className="bg-blue-600 text-white px-8 py-9 hover:bg-blue-700 transition-all"
                  onClick={setOwner}
                >
                  submit info
                </button>
              </>
            )}
          </div>
          <p className="text-sm">
            this thing is ugly. but it works. lol. - okezie
          </p>
        </div>
      ) : (
        <>ummm.. something went wrong. try refreshing two or three times. if it still doesn't work, contact okezie</>
      )}
    </div>
  );
}
