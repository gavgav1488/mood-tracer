"use client"

import * as React from "react"
import { Moon, Sun, Laptop, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Переключить тему</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span>Светлая</span>
                {theme === "light" && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Темная</span>
                {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
                <Laptop className="h-4 w-4" />
                <span>Системная</span>
                {theme === "system" && <span className="ml-auto text-xs">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <p>Переключить тему</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ThemeToggleSimple() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button rounded-2xl px-3 py-2 hover:scale-105 transition-all duration-300 flex items-center gap-2"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <ChevronDown className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="sr-only">Переключить тему</span>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-40 glass-card rounded-2xl shadow-xl z-20 animate-slide-up">
            <div className="p-2">
              <button
                onClick={() => {
                  setTheme("light");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${
                  theme === "light" ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                }`}
              >
                <Sun className="h-4 w-4" />
                <span className="text-sm">Светлая ☀️</span>
              </button>
              <button
                onClick={() => {
                  setTheme("dark");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${
                  theme === "dark" ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                }`}
              >
                <Moon className="h-4 w-4" />
                <span className="text-sm">Темная 🌙</span>
              </button>
              <button
                onClick={() => {
                  setTheme("system");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors text-left ${
                  theme === "system" ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                }`}
              >
                <Laptop className="h-4 w-4" />
                <span className="text-sm">Авто 💻</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
