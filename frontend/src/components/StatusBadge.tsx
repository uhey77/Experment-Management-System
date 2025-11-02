import { ExperimentStatus } from "../types";

const STATUS_LABELS: Record<ExperimentStatus, string> = {
  planned: "準備中",
  running: "実行中",
  review: "検証中",
  completed: "完了",
  archived: "アーカイブ",
};

export function StatusBadge({ status }: { status: ExperimentStatus }) {
  return <span className={`status-badge status-${status}`}>{STATUS_LABELS[status]}</span>;
}
