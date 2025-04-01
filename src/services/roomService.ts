
// Define types for rooms and reservations
export interface Room {
  id: string;
  name: string;
  type: 'meeting' | 'training' | 'service' | 'other';
  capacity: number;
  description?: string;
  amenities: string[];
  location?: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  organizer: string;
  attendees?: string[];
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}

// Mock data for rooms
const mockRooms: Room[] = [
  {
    id: '1',
    name: 'Sala de Reuniões A',
    type: 'meeting',
    capacity: 8,
    description: 'Sala de reuniões com projetor e quadro branco',
    amenities: ['Projetor', 'Quadro branco', 'Ar condicionado', 'Internet'],
    location: '1º andar'
  },
  {
    id: '2',
    name: 'Sala de Treinamento B',
    type: 'training',
    capacity: 20,
    description: 'Sala de treinamento com 20 estações de trabalho',
    amenities: ['Projetor', 'Computadores', 'Ar condicionado', 'Internet'],
    location: '2º andar'
  },
  {
    id: '3',
    name: 'Sala de Atendimento C',
    type: 'service',
    capacity: 4,
    description: 'Sala para atendimento de clientes e parceiros',
    amenities: ['Ar condicionado', 'Internet', 'Cafeteira'],
    location: 'Térreo'
  }
];

// Mock data for reservations
const mockReservations: Reservation[] = [
  {
    id: '1',
    roomId: '1',
    title: 'Reunião de Planejamento',
    description: 'Discussão do planejamento estratégico para o próximo trimestre',
    startTime: new Date(new Date().getTime() + 3600000),
    endTime: new Date(new Date().getTime() + 7200000),
    organizer: 'Ana Silva',
    attendees: ['João Lima', 'Maria Souza', 'Pedro Santos'],
    status: 'confirmed',
    createdAt: new Date()
  },
  {
    id: '2',
    roomId: '2',
    title: 'Treinamento de Onboarding',
    description: 'Treinamento para os novos colaboradores',
    startTime: new Date(new Date().getTime() + 86400000),
    endTime: new Date(new Date().getTime() + 100800000),
    organizer: 'Carlos Oliveira',
    attendees: ['Novos colaboradores'],
    status: 'confirmed',
    createdAt: new Date()
  }
];

// Service functions for rooms
export const roomService = {
  getRooms: (): Promise<Room[]> => {
    return Promise.resolve(mockRooms);
  },

  getRoomById: (id: string): Promise<Room | undefined> => {
    return Promise.resolve(mockRooms.find(room => room.id === id));
  },

  addRoom: (room: Omit<Room, 'id'>): Promise<Room> => {
    const newRoom = { ...room, id: Date.now().toString() };
    mockRooms.push(newRoom);
    return Promise.resolve(newRoom);
  },

  updateRoom: (id: string, room: Partial<Room>): Promise<Room | undefined> => {
    const index = mockRooms.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRooms[index] = { ...mockRooms[index], ...room };
      return Promise.resolve(mockRooms[index]);
    }
    return Promise.resolve(undefined);
  },

  deleteRoom: (id: string): Promise<boolean> => {
    const index = mockRooms.findIndex(r => r.id === id);
    if (index !== -1) {
      mockRooms.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
};

// Service functions for reservations
export const reservationService = {
  getReservations: (): Promise<Reservation[]> => {
    return Promise.resolve(mockReservations);
  },

  getReservationById: (id: string): Promise<Reservation | undefined> => {
    return Promise.resolve(mockReservations.find(res => res.id === id));
  },

  getReservationsByRoomId: (roomId: string): Promise<Reservation[]> => {
    return Promise.resolve(mockReservations.filter(res => res.roomId === roomId));
  },

  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> => {
    const newReservation = { 
      ...reservation, 
      id: Date.now().toString(), 
      createdAt: new Date() 
    };
    mockReservations.push(newReservation);
    return Promise.resolve(newReservation);
  },

  updateReservation: (id: string, reservation: Partial<Reservation>): Promise<Reservation | undefined> => {
    const index = mockReservations.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReservations[index] = { ...mockReservations[index], ...reservation };
      return Promise.resolve(mockReservations[index]);
    }
    return Promise.resolve(undefined);
  },

  deleteReservation: (id: string): Promise<boolean> => {
    const index = mockReservations.findIndex(r => r.id === id);
    if (index !== -1) {
      mockReservations.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  },
  
  checkAvailability: (roomId: string, startTime: Date, endTime: Date, excludeReservationId?: string): Promise<boolean> => {
    const hasOverlap = mockReservations.some(res => {
      // Skip the reservation we're trying to update
      if (excludeReservationId && res.id === excludeReservationId) {
        return false;
      }
      
      return res.roomId === roomId && 
             res.status !== 'cancelled' &&
             ((startTime >= res.startTime && startTime < res.endTime) ||
              (endTime > res.startTime && endTime <= res.endTime) ||
              (startTime <= res.startTime && endTime >= res.endTime));
    });
    
    return Promise.resolve(!hasOverlap);
  }
};
