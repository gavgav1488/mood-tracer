'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bold, Italic, Underline, List, ListOrdered, Quote } from "lucide-react";

export interface TextFormatToolbarProps {
  onFormat: (format: string) => void;
  className?: string;
}

export function TextFormatToolbar({
  onFormat,
  className,
}: TextFormatToolbarProps) {
  return (
    <div className={cn("flex flex-wrap gap-1 mb-2", className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('bold')}
        className="h-8 w-8 p-0"
        title="Полужирный"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('italic')}
        className="h-8 w-8 p-0"
        title="Курсив"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('underline')}
        className="h-8 w-8 p-0"
        title="Подчеркнутый"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('ul')}
        className="h-8 w-8 p-0"
        title="Маркированный список"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('ol')}
        className="h-8 w-8 p-0"
        title="Нумерованный список"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onFormat('quote')}
        className="h-8 w-8 p-0"
        title="Цитата"
      >
        <Quote className="h-4 w-4" />
      </Button>
    </div>
  );
}
