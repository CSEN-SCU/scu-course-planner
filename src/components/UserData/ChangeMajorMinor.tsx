import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { years } from "./YearOptions";
import { majors } from "./MajorOptions";
import { minors } from "./MinorOptions";
import { pathways } from "./PathwayOptions";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { auth, db } from "@/app/utils/firebase";

const ChangeYearMajorMinorPathStand = () => {
  const [newYear, setNewYear] = useState<string | null>(null);
  const [newMajor, setNewMajor] = useState<string | null>(null);
  const [newMinor, setNewMinor] = useState<string | null>(null);
  const [newPathway, setNewPathway] = useState<string | null>(null);

  const editUserYearMajorMinorPathStand = async () => {
    const userId = auth.currentUser?.uid;
    try {
      const collectionRef = collection(db, "users");
      const userDocRef = doc(collectionRef, userId);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        // Don't update fields that the user didnt specify
        const updateData: { [key: string]: string } = {};
        if (newYear) updateData.year = newYear;
        if (newMajor) updateData.major = newMajor;
        if (newMinor) updateData.minor = newMinor;
        if (newPathway) updateData.pathway = newPathway;

        // only update if there's anything changed
        if (Object.keys(updateData).length > 0) {
          await updateDoc(userDocRef, updateData);
          console.log("User data updated successfully");
        }
      } else {
        console.log("User doesn't exist somehow? -- Or user data is lost");
      }
    } catch (error) {
      console.log("Editing Major-Minor Failed", error);
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <p className="font-bold">Edit Grade Year:</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"outline"} className="font-bold text-white" size="sm">
              {newYear === null ? <p>Select a New Grade Year</p> : <p>{newYear}</p>}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {years.map((years, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => setNewYear(years.years)}
              >
                {years.years}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <p className="font-bold">Edit Major: </p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"outline"} className="font-bold text-white" size="sm">
            {newMajor === null ? <p>Select a New Major</p> : <p>{newMajor}</p>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {majors.map((major, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => setNewMajor(major.major)}
              >
                {major.major}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <p className="font-bold">Edit Minor:</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"outline"} className="font-bold text-white" size="sm">
            {newMinor === null ? <p>Select a New Minor</p> : <p>{newMinor}</p>}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {minors.map((minor, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => setNewMinor(minor.minor)}
              >
                {minor.minor}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <p className="font-bold">Edit Pathway:</p>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant={"outline"} className="font-bold text-white" size="sm">
              {newPathway === null ? <p>Select Pathway</p> : <p>{newPathway}</p>}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            {pathways.map((pathway, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => setNewPathway(pathway.pathway)}
              >
                {pathway.pathway}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Button
        variant={"outline"}
        className="bg-blue-600 font-bold text-white mt-3 ml-10 self-end justify-end"
        onClick={() => {
          editUserYearMajorMinorPathStand();
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default ChangeYearMajorMinorPathStand;
