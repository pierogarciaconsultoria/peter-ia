
export interface VisualizarAtaProps {
  reuniaoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface ReunioesHeaderProps {
  onNewReuniao?: () => void;
}

export interface ReunioesTabSelectProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface ReunioesTabContentProps {
  activeTab: string;
}

export interface FormProps {
  onSuccess: () => void;
}
