import { ChangeEvent } from "react";

import { ExperimentFilters, ExperimentStatus } from "../types";

interface FilterPanelProps {
  filters: ExperimentFilters;
  onChange: (next: ExperimentFilters) => void;
}

const STATUS_OPTIONS: { value: ExperimentStatus | ""; label: string }[] = [
  { value: "", label: "すべて" },
  { value: "planned", label: "準備中" },
  { value: "running", label: "実行中" },
  { value: "review", label: "検証中" },
  { value: "completed", label: "完了" },
  { value: "archived", label: "アーカイブ" },
];

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="card filter-panel">
      <div className="filter-field">
        <label htmlFor="owner">担当者</label>
        <input
          id="owner"
          name="owner"
          type="text"
          value={filters.owner ?? ""}
          onChange={handleInput}
          placeholder="例: alice"
        />
      </div>
      <div className="filter-field">
        <label htmlFor="status">ステータス</label>
        <select id="status" name="status" value={filters.status ?? ""} onChange={handleInput}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value || "all"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="search">キーワード</label>
        <input
          id="search"
          name="search"
          type="search"
          value={filters.search ?? ""}
          onChange={handleInput}
          placeholder="タイトルや説明を検索"
        />
      </div>
    </div>
  );
}

export default FilterPanel;
