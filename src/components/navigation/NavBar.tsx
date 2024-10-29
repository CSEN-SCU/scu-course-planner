import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../ui/navigation-menu";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";

interface NavBarProps {
  // For the edge case in the future if a user manages to access this site without an SCU Email (they shouldn't be able to access resources)
  isLoggedIn: boolean;
  selectedPage: string;
}

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <div className="flex flex-row w-full justify-between border-b-2 pb-4 #000">
      {/* Side Sheet */}
      <div className="mt-4">
        <Sheet>
          <SheetTrigger
            className={
              buttonVariants({ variant: "outline" }) + "items-center ml-4"
            }
            asChild
          >
            <p className="text-base text-white font-semibold hover:cursor-pointer">Menu</p>
          </SheetTrigger>

          <SheetContent side={"left"}></SheetContent>
        </Sheet>
      </div>

      {/* Navigation Bar */}
      <NavigationMenu className="flex mt-4 w-screen">
        <NavigationMenuList className="space-x-6">
          <NavigationMenuItem>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/"
              passHref
            >
              <p className="text-base text-white">Academic Plan</p>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/tools"
              passHref
            >
              <p className="text-base text-white">Tools and Useful Links </p>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem className="pr-4">
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/"
              passHref
            >
              <p className="text-base text-white">Search Class</p>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default NavBar;