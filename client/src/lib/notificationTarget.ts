export type NotificationTargetInput = {
  entityType?: string | null;
  entityId?: number | null;
  actionPath?: string | null;
};

export function getNotificationTarget(note: NotificationTargetInput) {
  if (note.entityType === "project" && note.entityId) return `/projetos?projeto=${note.entityId}`;
  if (note.entityType === "task" && note.entityId) return `/producao?tarefa=${note.entityId}`;
  return note.actionPath ?? null;
}

export function getTaskIdFromLocation(location: string) {
  const rawId = new URLSearchParams(location.split("?")[1] ?? "").get("tarefa");
  const taskId = Number(rawId);
  return Number.isInteger(taskId) && taskId > 0 ? taskId : null;
}
