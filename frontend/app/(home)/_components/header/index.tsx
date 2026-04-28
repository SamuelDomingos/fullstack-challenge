import { HeaderActions } from "./header-actions"
import Image from "next/image"
import AvatarProfile from "./avatar"
import { Separator } from "@/components/ui/separator"

export function Header({ balance }: { balance: number }) {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-4">
        <Image
          src="/logo.svg"
          alt="Jungle Gaming Logo"
          width={150}
          height={40}
          className="h-8 w-auto"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center rounded-full border border-border bg-muted">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              R$
            </span>
            <Separator orientation="vertical" />
            <span className="text-sm font-bold text-primary">{balance.toFixed(2)}</span>
          </div>
          <HeaderActions />
        </div>

        <AvatarProfile />
      </div>
    </header>
  )
}
