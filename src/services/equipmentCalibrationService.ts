
// Mock service for equipment calibration - replace with actual implementation when equipment_calibrations table exists
export interface EquipmentCalibration {
  id: string;
  equipment_name: string;
  equipment_id: string;
  calibration_date: string;
  next_calibration_date: string;
  responsible: string;
  status: 'valid' | 'expired' | 'scheduled';
  certificate_number?: string;
  calibration_entity: string;
  observations?: string;
  created_at: string;
  updated_at: string;
}

// Mock data for demonstration
const mockCalibrations: EquipmentCalibration[] = [
  {
    id: '1',
    equipment_name: 'Balança Digital',
    equipment_id: 'BAL-001',
    calibration_date: '2024-01-15',
    next_calibration_date: '2025-01-15',
    responsible: 'João Silva',
    status: 'valid',
    certificate_number: 'CERT-2024-001',
    calibration_entity: 'Metrologia Ltda',
    observations: 'Calibração realizada conforme norma',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    equipment_name: 'Termômetro Digital',
    equipment_id: 'TERM-002',
    calibration_date: '2023-12-01',
    next_calibration_date: '2024-12-01',
    responsible: 'Maria Santos',
    status: 'expired',
    certificate_number: 'CERT-2023-002',
    calibration_entity: 'Calibra Tech',
    observations: 'Necessária nova calibração',
    created_at: '2023-12-01T09:00:00Z',
    updated_at: '2023-12-01T09:00:00Z'
  }
];

export async function getEquipmentCalibrations(): Promise<EquipmentCalibration[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockCalibrations;
}

export async function getEquipmentCalibrationById(id: string): Promise<EquipmentCalibration> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const calibration = mockCalibrations.find(cal => cal.id === id);
  if (!calibration) {
    throw new Error('Equipment calibration not found');
  }
  
  return calibration;
}

export async function createEquipmentCalibration(calibration: Omit<EquipmentCalibration, 'id' | 'created_at' | 'updated_at'>): Promise<EquipmentCalibration> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newCalibration: EquipmentCalibration = {
    ...calibration,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockCalibrations.push(newCalibration);
  return newCalibration;
}

export async function updateEquipmentCalibration(id: string, calibration: Partial<Omit<EquipmentCalibration, 'id' | 'created_at' | 'updated_at'>>): Promise<EquipmentCalibration> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockCalibrations.findIndex(cal => cal.id === id);
  if (index === -1) {
    throw new Error('Equipment calibration not found');
  }
  
  mockCalibrations[index] = {
    ...mockCalibrations[index],
    ...calibration,
    updated_at: new Date().toISOString()
  };
  
  return mockCalibrations[index];
}

export async function deleteEquipmentCalibration(id: string): Promise<void> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockCalibrations.findIndex(cal => cal.id === id);
  if (index === -1) {
    throw new Error('Equipment calibration not found');
  }
  
  mockCalibrations.splice(index, 1);
}
