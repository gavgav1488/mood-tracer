'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CaretDownOutlined } from '../icons/ant-icons';
import { cn } from '@/lib/utils';

interface FilterOption {
  value: string;
  label: string;
  emoji?: string;
}

interface DropdownFilterProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DropdownFilter({
  options,
  value,
  onChange,
  placeholder = "Выберите опцию",
  className
}: DropdownFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-button rounded-2xl px-4 py-3 font-medium text-sm hover:scale-105 transition-all duration-300 inline-flex items-center justify-between gap-3 min-w-[200px]"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.emoji && (
            <span className="text-lg">{selectedOption.emoji}</span>
          )}
          <span>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <CaretDownOutlined
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-2xl shadow-xl z-20 animate-slide-up">
            <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-left",
                    value === option.value
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  {option.emoji && (
                    <span className="text-lg">{option.emoji}</span>
                  )}
                  <span className="text-sm font-medium">{option.label}</span>
                  {value === option.value && (
                    <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
