"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

type SidebarContextType = {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  mobileOpen: boolean
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Automatically collapse sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setCollapsed(true)
    } else {
      setCollapsed(false)
      setMobileOpen(false)
    }
  }, [isMobile])

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        mobileOpen,
        setMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
