
// Where NewTrainingDialog is used
<NewTrainingDialog
  isOpen={isDialogOpen} // Changed from 'open' to 'isOpen'
  onOpenChange={setIsDialogOpen}
  departments={departments}
  employees={employees}
  procedures={procedures}
  onTrainingCreated={handleTrainingCreated}
/>
