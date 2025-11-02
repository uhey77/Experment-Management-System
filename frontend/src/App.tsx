import { useCallback, useEffect, useState } from "react";

import { createExperiment, listExperiments } from "./api/client";
import ExperimentForm from "./components/ExperimentForm";
import ExperimentList from "./components/ExperimentList";
import FilterPanel from "./components/FilterPanel";
import { CreateExperimentPayload, Experiment, ExperimentFilters } from "./types";

export default function App() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [filters, setFilters] = useState<ExperimentFilters>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiments = useCallback(
    async (currentFilters: ExperimentFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listExperiments(currentFilters);
        setExperiments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "データ取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchExperiments(filters);
  }, [fetchExperiments, filters]);

  const handleCreate = useCallback(
    async (payload: CreateExperimentPayload) => {
      setIsSubmitting(true);
      setError(null);
      try {
        await createExperiment(payload);
        await fetchExperiments(filters);
      } catch (err) {
        setError(err instanceof Error ? err.message : "登録に失敗しました");
      } finally {
        setIsSubmitting(false);
      }
    },
    [fetchExperiments, filters]
  );

  return (
    <div className="layout">
      <header className="header">
        <div>
          <h1>実験管理ダッシュボード</h1>
          <p className="subtitle">研究室内での機械学習・LLM 実験を一覧管理します。</p>
        </div>
        <button className="refresh-button" onClick={() => fetchExperiments(filters)}>
          最新の状態を取得
        </button>
      </header>

      {error && <div className="alert">{error}</div>}

      <FilterPanel
        filters={filters}
        onChange={(nextFilters) => setFilters(nextFilters)}
      />

      <section className="content-grid">
        <div className="left-column">
          <ExperimentList items={experiments} isLoading={isLoading} />
        </div>
        <div className="right-column">
          <ExperimentForm onSubmit={handleCreate} isSubmitting={isSubmitting} />
        </div>
      </section>

      <footer className="footer">バージョン: {__APP_VERSION__ ?? "dev"}</footer>
    </div>
  );
}
