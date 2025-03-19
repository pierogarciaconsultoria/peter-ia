
import { Navigation } from "@/components/Navigation";

const EquipmentCalibration = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Calibração de Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie a calibração de equipamentos de medição e acompanhe o cronograma de calibrações.
          </p>
        </div>
      </main>
    </div>
  );
};

export default EquipmentCalibration;
