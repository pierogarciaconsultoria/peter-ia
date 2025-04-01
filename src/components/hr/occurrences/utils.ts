
import { OccurrenceWithEmployee } from "@/services/occurrenceService";

export function filterOccurrences(
  occurrences: OccurrenceWithEmployee[],
  searchQuery: string,
  typeFilter: string,
  statusFilter: string
): OccurrenceWithEmployee[] {
  return occurrences.filter((occurrence) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      occurrence.title.toLowerCase().includes(searchLower) ||
      occurrence.description.toLowerCase().includes(searchLower) ||
      occurrence.employee.name.toLowerCase().includes(searchLower) ||
      occurrence.reported_by.toLowerCase().includes(searchLower);

    // Type filter
    const matchesType = typeFilter === "all" || occurrence.type === typeFilter;

    // Status filter
    const matchesStatus = statusFilter === "all" || occurrence.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });
}
