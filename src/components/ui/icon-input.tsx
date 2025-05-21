import * as React from "react"
import { cn } from "@/lib/utils"
import { Input, InputProps } from "./input"

interface IconInputProps extends InputProps {
  icon: React.ReactNode
  iconPosition?: "left" | "right"
}

const IconInput = React.forwardRef<HTMLInputElement, IconInputProps>(
  ({ className, icon, iconPosition = "left", ...props }, ref) => {
    return (
      <div className="relative w-full">
        <div
          className={cn(
            "absolute top-0 bottom-0 flex items-center justify-center pointer-events-none z-10",
            iconPosition === "left" ? "left-0 pl-4" : "right-0 pr-4"
          )}
        >
          {icon}
        </div>
        <Input
          ref={ref}
          className={cn(
            iconPosition === "left" ? "pl-12" : "pr-12",
            "bg-background/95 backdrop-blur-sm",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
IconInput.displayName = "IconInput"

export { IconInput }
