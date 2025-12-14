"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Calendar as Cal } from "@heroui/react"
import {today, getLocalTimeZone} from "@internationalized/date";

export function Calendar(){
  return(
    <Cal isReadOnly aria-label="Date (Read Only)" value={today(getLocalTimeZone())} />
  )
}
