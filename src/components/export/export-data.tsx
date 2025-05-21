'use client';

import { Button } from '@/components/ui/button';
import { ExportToPdf } from './export-to-pdf';
import { ExportToCsv } from './export-to-csv';
import { ExportToJson } from './export-to-json';
import { Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExportDataProps {
  className?: string;
}

export function ExportData({ className = '' }: ExportDataProps) {
  return (
    <div className="flex gap-2">
      <ExportToPdf />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`rounded-full ${className}`}>
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Экспорт</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <ExportToCsv className="w-full justify-start" />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <ExportToJson className="w-full justify-start" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
