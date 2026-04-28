"use client"

import { CheckIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"

const AvatarProfile = () => {
  const { data: session } = useSession()

  return (
    <div className="group relative w-fit cursor-pointer">
      <Avatar
        className={cn(
          "transition-transform group-hover:scale-105",
          session &&
            "ring-2 ring-primary ring-offset-2 ring-offset-background dark:ring-primary/80"
        )}
      >
        <AvatarImage
          src={
            session?.user?.image ||
            "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
          }
          alt={session?.user?.name || "User"}
        />
        <AvatarFallback className="text-xs">
          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      {session && (
        <span className="absolute -right-1.5 -bottom-1.5 inline-flex size-4 items-center justify-center rounded-full border-2 border-background bg-primary dark:bg-primary/80">
          <CheckIcon className="size-3 text-white" />
        </span>
      )}
    </div>
  )
}

export default AvatarProfile
