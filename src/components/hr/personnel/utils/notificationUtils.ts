
import { createNotification } from "@/services/notificationService";

/**
 * Helper function with explicit types to safely create notifications
 */
export const safeCreateNotification = async (
  userId: string,
  title: string,
  message: string,
  entityType: "task" | "document" | "procedure" | "other", 
  entityId: string,
  link?: string
): Promise<void> => {
  try {
    await createNotification(
      userId,
      title,
      message,
      entityType,
      entityId,
      link
    );
    console.log("Notificação criada com sucesso", {
      userId, title, message, entityType, entityId, link
    });
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
  }
};

/**
 * Notifies users about procedural document updates
 */
export const notifyDocumentUpdate = async (
  userIds: string[],
  documentTitle: string,
  documentId: string,
  action: "created" | "updated" | "approved" | "obsoleted"
): Promise<void> => {
  const actionMessages = {
    created: `Um novo procedimento "${documentTitle}" foi criado e pode ser relevante para você.`,
    updated: `O procedimento "${documentTitle}" foi atualizado.`,
    approved: `O procedimento "${documentTitle}" foi aprovado e está vigente.`,
    obsoleted: `O procedimento "${documentTitle}" foi marcado como obsoleto.`
  };
  
  const titleMessages = {
    created: "Novo procedimento criado",
    updated: "Procedimento atualizado",
    approved: "Procedimento aprovado",
    obsoleted: "Procedimento obsoleto"
  };
  
  const link = `/Documents?highlight=${documentId}`;
  
  for (const userId of userIds) {
    await safeCreateNotification(
      userId,
      titleMessages[action],
      actionMessages[action],
      "procedure",
      documentId,
      link
    );
  }
};
