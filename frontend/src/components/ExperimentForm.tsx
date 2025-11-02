import { FormEvent, useMemo, useState } from "react";

import { CreateExperimentPayload, ExperimentStatus } from "../types";

const STATUS_OPTIONS: { value: ExperimentStatus; label: string }[] = [
  { value: "planned", label: "準備中" },
  { value: "running", label: "実行中" },
  { value: "review", label: "検証中" },
  { value: "completed", label: "完了" },
  { value: "archived", label: "アーカイブ" },
];

interface ExperimentFormProps {
  onSubmit: (payload: CreateExperimentPayload) => Promise<void> | void;
  isSubmitting?: boolean;
}

const createDefaultFormValues = (): CreateExperimentPayload => ({
  title: "",
  description: "",
  owner: "",
  status: "planned",
  tags: [],
  repo_url: "",
  notes: "",
  results_url: "",
  external_links: [],
});

export function ExperimentForm({ onSubmit, isSubmitting = false }: ExperimentFormProps) {
  const [formState, setFormState] = useState<CreateExperimentPayload>(createDefaultFormValues);
  const [tagInput, setTagInput] = useState<string>("");
  const [linkInput, setLinkInput] = useState<string>("");

  const isDisabled = useMemo(() => {
    return isSubmitting || !formState.title || !formState.owner;
  }, [isSubmitting, formState]);

  const resetForm = () => {
    setFormState(createDefaultFormValues());
    setTagInput("");
    setLinkInput("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateExperimentPayload = {
      ...formState,
      tags: tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      external_links: linkInput
        .split(",")
        .map((link) => link.trim())
        .filter(Boolean),
    };

    await onSubmit(payload);
    resetForm();
  };

  return (
    <form className="experiment-form" onSubmit={handleSubmit}>
      <h2>新規実験の登録</h2>
      <div className="form-grid">
        <label>
          タイトル
          <input
            required
            type="text"
            value={formState.title}
            onChange={(event) => setFormState({ ...formState, title: event.target.value })}
          />
        </label>
        <label>
          担当者
          <input
            required
            type="text"
            value={formState.owner}
            onChange={(event) => setFormState({ ...formState, owner: event.target.value })}
          />
        </label>
        <label>
          ステータス
          <select
            value={formState.status}
            onChange={(event) =>
              setFormState({ ...formState, status: event.target.value as ExperimentStatus })
            }
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          リポジトリ URL
          <input
            type="url"
            value={formState.repo_url ?? ""}
            onChange={(event) => setFormState({ ...formState, repo_url: event.target.value })}
            placeholder="https://github.com/example/repo"
          />
        </label>
        <label>
          結果 URL
          <input
            type="url"
            value={formState.results_url ?? ""}
            onChange={(event) =>
              setFormState({ ...formState, results_url: event.target.value })
            }
            placeholder="https://storage.example.com/result.html"
          />
        </label>
        <label className="full">
          説明
          <textarea
            rows={3}
            value={formState.description ?? ""}
            onChange={(event) => setFormState({ ...formState, description: event.target.value })}
          />
        </label>
        <label className="full">
          メモ
          <textarea
            rows={3}
            value={formState.notes ?? ""}
            onChange={(event) => setFormState({ ...formState, notes: event.target.value })}
          />
        </label>
        <label>
          タグ（カンマ区切り）
          <input
            type="text"
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            placeholder="llm, evaluation"
          />
        </label>
        <label>
          参考リンク（カンマ区切り）
          <input
            type="text"
            value={linkInput}
            onChange={(event) => setLinkInput(event.target.value)}
            placeholder="https://slack.com/..."
          />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isDisabled}>
          {isSubmitting ? "登録中..." : "登録"}
        </button>
      </div>
    </form>
  );
}

export default ExperimentForm;
