import { jsx as _jsx } from "react/jsx-runtime";
const STATUS_LABELS = {
    planned: "準備中",
    running: "実行中",
    review: "検証中",
    completed: "完了",
    archived: "アーカイブ",
};
export function StatusBadge({ status }) {
    return _jsx("span", { className: `status-badge status-${status}`, children: STATUS_LABELS[status] });
}
