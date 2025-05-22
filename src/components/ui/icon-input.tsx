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
        {/* Иконка отображается над полем ввода, а не внутри него */}
        <label className="block text-sm font-medium mb-1 flex items-center gap-2">
          {icon}
          {props.placeholder && <span>{props.placeholder}</span>}
        </label>
        <Input
          ref={ref}
          className={cn(
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
