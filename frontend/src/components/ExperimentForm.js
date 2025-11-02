import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
const STATUS_OPTIONS = [
    { value: "planned", label: "準備中" },
    { value: "running", label: "実行中" },
    { value: "review", label: "検証中" },
    { value: "completed", label: "完了" },
    { value: "archived", label: "アーカイブ" },
];
const createDefaultFormValues = () => ({
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
export function ExperimentForm({ onSubmit, isSubmitting = false }) {
    const [formState, setFormState] = useState(createDefaultFormValues);
    const [tagInput, setTagInput] = useState("");
    const [linkInput, setLinkInput] = useState("");
    const isDisabled = useMemo(() => {
        return isSubmitting || !formState.title || !formState.owner;
    }, [isSubmitting, formState]);
    const resetForm = () => {
        setFormState(createDefaultFormValues());
        setTagInput("");
        setLinkInput("");
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const payload = {
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
    return (_jsxs("form", { className: "experiment-form", onSubmit: handleSubmit, children: [_jsx("h2", { children: "\u65B0\u898F\u5B9F\u9A13\u306E\u767B\u9332" }), _jsxs("div", { className: "form-grid", children: [_jsxs("label", { children: ["\u30BF\u30A4\u30C8\u30EB", _jsx("input", { required: true, type: "text", value: formState.title, onChange: (event) => setFormState({ ...formState, title: event.target.value }) })] }), _jsxs("label", { children: ["\u62C5\u5F53\u8005", _jsx("input", { required: true, type: "text", value: formState.owner, onChange: (event) => setFormState({ ...formState, owner: event.target.value }) })] }), _jsxs("label", { children: ["\u30B9\u30C6\u30FC\u30BF\u30B9", _jsx("select", { value: formState.status, onChange: (event) => setFormState({ ...formState, status: event.target.value }), children: STATUS_OPTIONS.map((status) => (_jsx("option", { value: status.value, children: status.label }, status.value))) })] }), _jsxs("label", { children: ["\u30EA\u30DD\u30B8\u30C8\u30EA URL", _jsx("input", { type: "url", value: formState.repo_url ?? "", onChange: (event) => setFormState({ ...formState, repo_url: event.target.value }), placeholder: "https://github.com/example/repo" })] }), _jsxs("label", { children: ["\u7D50\u679C URL", _jsx("input", { type: "url", value: formState.results_url ?? "", onChange: (event) => setFormState({ ...formState, results_url: event.target.value }), placeholder: "https://storage.example.com/result.html" })] }), _jsxs("label", { className: "full", children: ["\u8AAC\u660E", _jsx("textarea", { rows: 3, value: formState.description ?? "", onChange: (event) => setFormState({ ...formState, description: event.target.value }) })] }), _jsxs("label", { className: "full", children: ["\u30E1\u30E2", _jsx("textarea", { rows: 3, value: formState.notes ?? "", onChange: (event) => setFormState({ ...formState, notes: event.target.value }) })] }), _jsxs("label", { children: ["\u30BF\u30B0\uFF08\u30AB\u30F3\u30DE\u533A\u5207\u308A\uFF09", _jsx("input", { type: "text", value: tagInput, onChange: (event) => setTagInput(event.target.value), placeholder: "llm, evaluation" })] }), _jsxs("label", { children: ["\u53C2\u8003\u30EA\u30F3\u30AF\uFF08\u30AB\u30F3\u30DE\u533A\u5207\u308A\uFF09", _jsx("input", { type: "text", value: linkInput, onChange: (event) => setLinkInput(event.target.value), placeholder: "https://slack.com/..." })] })] }), _jsx("div", { className: "form-actions", children: _jsx("button", { type: "submit", disabled: isDisabled, children: isSubmitting ? "登録中..." : "登録" }) })] }));
}
export default ExperimentForm;
