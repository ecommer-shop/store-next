"use client"

import { SignedIn, UserProfile } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"

export default function UserProfileClient() {
  const { resolvedTheme } = useTheme()
  return (
    <SignedIn>
      <UserProfile
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
          variables: {
              borderRadius: "2px",
              colorBackground: resolvedTheme === "dark" ? "#12123F" : "#F1F1F1",
              colorShadow: resolvedTheme === "dark" ? "#F1F1F1" : "#12123f",
          },
          elements: {
            modalContent: "bg-background/95 backdrop-blur-md w-full",
          },
        }}
      />
    </SignedIn>
  )
}
