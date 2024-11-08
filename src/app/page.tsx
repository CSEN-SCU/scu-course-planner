"use client"; // "The component gets prerendered with SSR or ISR/SSG if possible on the server. The html is send to the client and the javascript is send too. So it gets hydrated on the client and is interactive"

import DragDropCourses from "@/components/DraggableCards/DragDropCourses";
import React, { Dispatch, useState, SetStateAction, useEffect } from "react";
import { userCourses } from "@/components/UserData/userCourses";
import { CourseData } from "./utils/interfaces";
import { UserCourseData } from "./utils/types";
import NavBar from "../components/Navigation/NavBar";
import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth,db } from "./utils/firebase";
import { useRouter } from 'next/navigation';
import { signOut } from "../components/Authentication/GoogleSignIn"
import { Button } from "@/components/ui/button";
import { doc, setDoc } from "firebase/firestore"; 
import SaveButton from "@/components/SaveButton";

export default function Home() {
  const [selectedQuarter, setSelectedQuarter]: [
    [string, string],
    Dispatch<SetStateAction<[string, string]>>
  ] = useState(["", ""]);

  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userPlan, setUserPlan] = useState<UserCourseData[]>(userCourses);
  const [addingClass, setAddingClass] = useState<boolean>(false);

  useEffect(() =>  {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // If the user somehow gets in our home page without an SCU email
        if (!user?.email?.includes("@scu.edu")) {
          console.warn("Non-SCU Emails are not allowed");
          await signOut(); // Sign the user out if domain doesn't match
          setUser(null);
          return;
        }    
        setUser(user);

      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      login_hint: "user@scu.edu",
    });
    try {
      const UserCredential = await signInWithPopup(auth, provider);
      const user = UserCredential.user;
      
      // When registering, don't create the user profile if non-SCU
      if (user?.email?.includes("@scu.edu")) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          profilePicture: user.photoURL,
          major: "n/a",
          minor: "n/a"
        });
      }    
      else return
      router.push("/")
    } catch (error) {
      console.error("error signing in:", error);
    }
  }

  const onSubmit = (addedCourse: CourseData) => {
    setUserPlan((prevUserPlan) =>
      prevUserPlan.map((quarter) => {
        // find the matching quarter + year pair. Then add the course to that.
        if (
          quarter.season === selectedQuarter[0] &&
          quarter.year === selectedQuarter[1]
        ) {
          return {
            ...quarter,
            courses: [...quarter.courses, addedCourse],
          };
        }
        return quarter;
      })
    );
    // reset the selected quarter and the state of adding classes
    setSelectedQuarter(["", ""]);
    setAddingClass(false);
  };

  return (
    <div>
      {user ? (
      <div className="flex flex-col">
      <div className="flex w-full">
        <NavBar isLoggedIn={true} selectedPage={"Home"}></NavBar>
      </div>
      <div className="grid items-start justify-items-end min-h-screen p-8 pb-10 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <DragDropCourses
          setSelectedQuarter={setSelectedQuarter}
          selectedQuarter={selectedQuarter}
          onSubmit={onSubmit}
          setUserPlan={setUserPlan}
          setAddingClass={setAddingClass}
          isAddingClass={addingClass}
          userPlan={userPlan}
        />
        <SaveButton userPlan={userPlan}/>
      </div>
    </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
            <Button onClick={async () => {
            try {
                await signInWithGoogle(); // Runs the signInWithGoogle function when clicked
            } catch (error) {
                console.error("Error signing in:", error); // Log any errors from sign-in
            }
        }} className="px-5 py-2 text-lg bg-blue-500 text-white rounded">
                Sign in with Google
            </Button>
        </div>
      )}
    </div>
  );
}
