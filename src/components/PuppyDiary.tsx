
import React from "react";
import { format } from "date-fns";
import { Image, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface PuppyDiaryProps {
  puppyId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const PuppyDiary: React.FC<PuppyDiaryProps> = ({ puppyId, isOpen, onClose }) => {
  const { events, puppies, removeEvent } = usePuppy();
  
  const puppy = puppies.find(p => p.id === puppyId);
  const puppyEvents = events
    .filter(event => event.puppy_id === puppyId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

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

  const handleImageClick = (imageUrl: string) => {
    window.open(imageUrl, '_blank');
  };

  const handleDeleteEvent = async (eventId: string) => {
    await removeEvent(eventId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[95%] sm:w-[600px] md:w-[700px] lg:max-w-[800px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{puppy?.name}s Tagebuch</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Datum</TableHead>
                  <TableHead className="whitespace-nowrap">Zeit</TableHead>
                  <TableHead className="whitespace-nowrap">Art</TableHead>
                  <TableHead className="whitespace-nowrap">Foto</TableHead>
                  <TableHead className="whitespace-nowrap">Notizen</TableHead>
                  <TableHead className="whitespace-nowrap">Aktionen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {puppyEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(event.created_at), "dd.MM.yyyy")}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(event.created_at), "HH:mm")}
                    </TableCell>
                    <TableCell>
                      <span className="text-xl">{getEventEmoji(event.type)}</span>
                    </TableCell>
                    <TableCell>
                      {event.image_url ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleImageClick(event.image_url!)}
                        >
                          <Image className="h-5 w-5" />
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px] break-words">
                      {event.notes || "-"}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ereignis löschen</AlertDialogTitle>
                            <AlertDialogDescription>
                              Sind Sie sicher, dass Sie dieses Ereignis löschen möchten?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteEvent(event.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default PuppyDiary;
