import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { StatusBadge } from "./StatusBadge";
export function ExperimentList({ items, isLoading = false }) {
    if (isLoading) {
        return _jsx("div", { className: "card", children: "\u8AAD\u307F\u8FBC\u307F\u4E2D..." });
    }
    if (items.length === 0) {
        return _jsx("div", { className: "card", children: "\u6761\u4EF6\u306B\u5408\u3046\u5B9F\u9A13\u304C\u3042\u308A\u307E\u305B\u3093\u3002" });
    }
    return (_jsx("div", { className: "card", children: _jsxs("table", { className: "experiment-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u30BF\u30A4\u30C8\u30EB" }), _jsx("th", { children: "\u30B9\u30C6\u30FC\u30BF\u30B9" }), _jsx("th", { children: "\u62C5\u5F53\u8005" }), _jsx("th", { children: "\u30BF\u30B0" }), _jsx("th", { children: "\u66F4\u65B0\u65E5" })] }) }), _jsx("tbody", { children: items.map((experiment) => (_jsxs("tr", { children: [_jsxs("td", { children: [_jsx("div", { className: "experiment-title", children: experiment.title }), experiment.description && (_jsx("div", { className: "experiment-description", children: experiment.description })), _jsxs("div", { className: "experiment-links", children: [experiment.repo_url && (_jsx("a", { href: experiment.repo_url, target: "_blank", rel: "noreferrer", children: "\u30EA\u30DD\u30B8\u30C8\u30EA" })), experiment.results_url && (_jsx("a", { href: experiment.results_url, target: "_blank", rel: "noreferrer", children: "\u7D50\u679C" }))] })] }), _jsx("td", { children: _jsx(StatusBadge, { status: experiment.status }) }), _jsx("td", { children: experiment.owner }), _jsx("td", { children: _jsx("div", { className: "tag-list", children: experiment.tags.map((tag) => (_jsx("span", { className: "tag", children: tag }, tag))) }) }), _jsx("td", { children: new Date(experiment.updated_at).toLocaleString() })] }, experiment.id))) })] }) }));
}
export default ExperimentList;
