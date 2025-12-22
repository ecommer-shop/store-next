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
            borderRadius: "2px"
        }
      }}
    />
  )
}
