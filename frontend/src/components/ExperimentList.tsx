import { Experiment } from "../types";
import { StatusBadge } from "./StatusBadge";

interface ExperimentListProps {
  items: Experiment[];
  isLoading?: boolean;
}

export function ExperimentList({ items, isLoading = false }: ExperimentListProps) {
  if (isLoading) {
    return <div className="card">読み込み中...</div>;
  }

  if (items.length === 0) {
    return <div className="card">条件に合う実験がありません。</div>;
  }

  return (
    <div className="card">
      <table className="experiment-table">
        <thead>
          <tr>
            <th>タイトル</th>
            <th>ステータス</th>
            <th>担当者</th>
            <th>タグ</th>
            <th>更新日</th>
          </tr>
        </thead>
        <tbody>
          {items.map((experiment) => (
            <tr key={experiment.id}>
              <td>
                <div className="experiment-title">{experiment.title}</div>
                {experiment.description && (
                  <div className="experiment-description">{experiment.description}</div>
                )}
                <div className="experiment-links">
                  {experiment.repo_url && (
                    <a href={experiment.repo_url} target="_blank" rel="noreferrer">
                      リポジトリ
                    </a>
                  )}
                  {experiment.results_url && (
                    <a href={experiment.results_url} target="_blank" rel="noreferrer">
                      結果
                    </a>
                  )}
                </div>
              </td>
              <td>
                <StatusBadge status={experiment.status} />
              </td>
              <td>{experiment.owner}</td>
              <td>
                <div className="tag-list">
                  {experiment.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td>{new Date(experiment.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExperimentList;
