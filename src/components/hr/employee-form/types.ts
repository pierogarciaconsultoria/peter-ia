
import { JobPosition } from "../types";

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  birthDate: Date | null;
  hireDate: Date | null;
  department: string;
  jobTitle: string;
  salary: string;
  emergencyContact: string;
  emergencyPhone: string;
  documentId: string;
  documentType: string;
  cpf: string;
  carteiraDigitalLink: string;
  spouse: string;
  dependents: {
    name: string;
    relationship: string;
    phone: string;
    birthDate: Date | null;
  }[];
  notes: string;
}

export interface DocumentFile {
  name: string;
  file: File | null;
}
