import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { createExperiment, listExperiments } from "./api/client";
import ExperimentForm from "./components/ExperimentForm";
import ExperimentList from "./components/ExperimentList";
import FilterPanel from "./components/FilterPanel";
export default function App() {
    const [experiments, setExperiments] = useState([]);
    const [filters, setFilters] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const fetchExperiments = useCallback(async (currentFilters) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await listExperiments(currentFilters);
            setExperiments(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "データ取得に失敗しました");
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchExperiments(filters);
    }, [fetchExperiments, filters]);
    const handleCreate = useCallback(async (payload) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createExperiment(payload);
            await fetchExperiments(filters);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "登録に失敗しました");
        }
        finally {
            setIsSubmitting(false);
        }
    }, [fetchExperiments, filters]);
    return (_jsxs("div", { className: "layout", children: [_jsxs("header", { className: "header", children: [_jsxs("div", { children: [_jsx("h1", { children: "\u5B9F\u9A13\u7BA1\u7406\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9" }), _jsx("p", { className: "subtitle", children: "\u7814\u7A76\u5BA4\u5185\u3067\u306E\u6A5F\u68B0\u5B66\u7FD2\u30FBLLM \u5B9F\u9A13\u3092\u4E00\u89A7\u7BA1\u7406\u3057\u307E\u3059\u3002" })] }), _jsx("button", { className: "refresh-button", onClick: () => fetchExperiments(filters), children: "\u6700\u65B0\u306E\u72B6\u614B\u3092\u53D6\u5F97" })] }), error && _jsx("div", { className: "alert", children: error }), _jsx(FilterPanel, { filters: filters, onChange: (nextFilters) => setFilters(nextFilters) }), _jsxs("section", { className: "content-grid", children: [_jsx("div", { className: "left-column", children: _jsx(ExperimentList, { items: experiments, isLoading: isLoading }) }), _jsx("div", { className: "right-column", children: _jsx(ExperimentForm, { onSubmit: handleCreate, isSubmitting: isSubmitting }) })] }), _jsxs("footer", { className: "footer", children: ["\u30D0\u30FC\u30B8\u30E7\u30F3: ", __APP_VERSION__ ?? "dev"] })] }));
}
