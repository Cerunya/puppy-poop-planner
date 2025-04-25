
import React, { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { usePuppy } from "@/context/PuppyContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PuppyDiaryProps {
  puppyId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PuppyDiary: React.FC<PuppyDiaryProps> = ({ puppyId, isOpen, onClose }) => {
  const { events, puppies } = usePuppy();
  
  const puppy = puppies.find(p => p.id === puppyId);
  const puppyEvents = events
    .filter(event => event.puppyId === puppyId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getEventEmoji = (type: 'pee' | 'poop' | 'both') => {
    switch (type) {
      case 'pee':
        return '💧';
      case 'poop':
        return '💩';
      case 'both':
        return '💧💩';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{puppy?.name}s Tagebuch</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Zeit</TableHead>
                <TableHead>Art</TableHead>
                <TableHead>Notizen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {puppyEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    {format(new Date(event.timestamp), "dd.MM.yyyy")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(event.timestamp), "HH:mm")}
                  </TableCell>
                  <TableCell>
                    <span className="text-xl">{getEventEmoji(event.type)}</span>
                  </TableCell>
                  <TableCell>{event.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PuppyDiary;
