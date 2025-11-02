import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const STATUS_OPTIONS = [
    { value: "", label: "すべて" },
    { value: "planned", label: "準備中" },
    { value: "running", label: "実行中" },
    { value: "review", label: "検証中" },
    { value: "completed", label: "完了" },
    { value: "archived", label: "アーカイブ" },
];
export function FilterPanel({ filters, onChange }) {
    const handleInput = (event) => {
        const { name, value } = event.target;
        onChange({ ...filters, [name]: value });
    };
    return (_jsxs("div", { className: "card filter-panel", children: [_jsxs("div", { className: "filter-field", children: [_jsx("label", { htmlFor: "owner", children: "\u62C5\u5F53\u8005" }), _jsx("input", { id: "owner", name: "owner", type: "text", value: filters.owner ?? "", onChange: handleInput, placeholder: "\u4F8B: alice" })] }), _jsxs("div", { className: "filter-field", children: [_jsx("label", { htmlFor: "status", children: "\u30B9\u30C6\u30FC\u30BF\u30B9" }), _jsx("select", { id: "status", name: "status", value: filters.status ?? "", onChange: handleInput, children: STATUS_OPTIONS.map((option) => (_jsx("option", { value: option.value, children: option.label }, option.value || "all"))) })] }), _jsxs("div", { className: "filter-field", children: [_jsx("label", { htmlFor: "search", children: "\u30AD\u30FC\u30EF\u30FC\u30C9" }), _jsx("input", { id: "search", name: "search", type: "search", value: filters.search ?? "", onChange: handleInput, placeholder: "\u30BF\u30A4\u30C8\u30EB\u3084\u8AAC\u660E\u3092\u691C\u7D22" })] })] }));
}
export default FilterPanel;
