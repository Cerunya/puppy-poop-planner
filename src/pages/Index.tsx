
import React from "react";
import Layout from "@/components/Layout";
import { usePuppy } from "@/context/PuppyContext";
import * as puppyService from "@/services/puppyService";
import { QuickActions } from "@/components/entry/QuickActions";
import { DailyStats } from "@/components/entry/DailyStats";
import { DetailedEntryForm } from "@/components/entry/DetailedEntryForm";

const Index = () => {
  const { puppies, events, addEvent, selectedPuppyId, setSelectedPuppyId } = usePuppy();

  const handleQuickAdd = async (type: "pee" | "poop" | "both") => {
    if (!selectedPuppyId) {
      return;
    }
    
    const now = new Date();
    const eventTime = now.toISOString();
    
    await addEvent({
      puppy_id: selectedPuppyId,
      type,
      created_at: eventTime,
    });
  };

  // Filter today's events
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.created_at);
    return (
      eventDate >= todayStart && 
      eventDate <= todayEnd && 
      (!selectedPuppyId || event.puppy_id === selectedPuppyId)
    );
  });
  
  const peeCount = todayEvents.filter(event => event.type === "pee" || event.type === "both").length;
  const poopCount = todayEvents.filter(event => event.type === "poop" || event.type === "both").length;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Neuer Eintrag</h1>
        
        <QuickActions onQuickAdd={handleQuickAdd} />
        <DailyStats peeCount={peeCount} poopCount={poopCount} />
        
        <DetailedEntryForm
          selectedPuppyId={selectedPuppyId}
          puppies={puppies}
          onSubmit={addEvent}
          onImageUpload={puppyService.uploadImageToStorage}
        />
      </div>
    </Layout>
  );
};

export default Index;
