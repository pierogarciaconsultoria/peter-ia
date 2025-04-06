
// This file is maintained for backward compatibility
// It re-exports all the functionality from the refactored modules

import {
  Employee,
  mockEmployees,
  getEmployees,
  getEmployeeById,
  getEmployeesByDepartment,
  getEmployeesByStatus,
  searchEmployees,
  getQualityInspectors,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "./employee";

export {
  // Types
  type Employee,
  mockEmployees,
  
  // Basic operations
  getEmployees,
  getEmployeeById,
  
  // Filtering operations
  getEmployeesByDepartment,
  getEmployeesByStatus,
  searchEmployees,
  getQualityInspectors,
  
  // CRUD operations
  createEmployee,
  updateEmployee,
  deleteEmployee
};
