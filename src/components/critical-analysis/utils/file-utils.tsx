
import React from "react";
import { FileText } from "lucide-react";

export const getFileIcon = (fileType: string) => {
  if (fileType.includes("pdf")) {
    return <FileText className="text-red-500" size={16} />;
  } else if (fileType.includes("spreadsheet") || fileType.includes("excel") || fileType.includes("xlsx")) {
    return <FileText className="text-green-500" size={16} />;
  } else if (fileType.includes("document") || fileType.includes("word") || fileType.includes("docx")) {
    return <FileText className="text-blue-500" size={16} />;
  } else if (fileType.includes("presentation") || fileType.includes("powerpoint") || fileType.includes("pptx")) {
    return <FileText className="text-orange-500" size={16} />;
  } else {
    return <FileText className="text-gray-500" size={16} />;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "planned":
      return "text-yellow-500";
    case "in-progress":
      return "text-blue-500";
    case "completed":
      return "text-green-500";
    default:
      return "";
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case "planned":
      return "Planejada";
    case "in-progress":
      return "Em Andamento";
    case "completed":
      return "Concluída";
    default:
      return status;
  }
};
