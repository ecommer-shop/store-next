"use client"

import { UserProfile } from "@clerk/nextjs"
import { useTheme } from "next-themes"
import { dark } from "@clerk/themes"

export default function UserProfileClient() {
  const { theme } = useTheme()

  return (
    <UserProfile
      appearance={{
        baseTheme: theme === "dark" ? dark : undefined,
        variables: {
            borderRadius: "2px",
            colorBackground: theme === "dark" ? "#12123F" : "#F1F1F1",
            colorShadow: theme === "dark" ? "#F1F1F1" : "#12123f",
        },
        elements: {
          modalContent: "bg-background/95 backdrop-blur-md w-full",
        }
      }}
    />
  )
}
