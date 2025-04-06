
// This file re-exports all employee filter functions from the separate modules
// to maintain backward compatibility

export { getEmployeesByDepartment } from './filters/departmentFilter';
export { getEmployeesByStatus } from './filters/statusFilter';
export { searchEmployees } from './filters/searchFilter';
export { getQualityInspectors } from './filters/qualityInspectorFilter';
