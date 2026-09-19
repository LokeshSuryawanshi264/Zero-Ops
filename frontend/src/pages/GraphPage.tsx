import React, { useState, useEffect, useRef, useCallback } from "react";
import { FileText, ShieldAlert, CheckCircle2, AlertCircle, X } from "lucide-react";
import ForceGraph2D from "react-force-graph-2d";
import demoData from "../data/demo_data.json";

const NODE_COLORS: Record<string, string> = {
    person:   "#E03131", // Stronger red for light mode
    phone:    "#1971C2", // Stronger blue
    location: "#099268", // Stronger green
    vehicle:  "#F59F00", // Stronger amber
};

const LEGEND = [
    { type: "person",   label: "Person"   },
    { type: "phone",    label: "Phone"    },
    { type: "location", label: "Location" },
    { type: "vehicle",  label: "Vehicle"  },
];

export default function GraphPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [selectedLink, setSelectedLink] = useState<any>(null);
    const [hoverNode, setHoverNode] = useState<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(([e]) => {
            setDimensions({ width: e.contentRect.width, height: e.contentRect.height });
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const isHovered = hoverNode === node;
        const color = NODE_COLORS[node.type] ?? "#868E96";
        const radius = isHovered ? 7 : node.isBridge ? 6 : 5;

        // Glow ring for bridge or hovered
        if (node.isBridge || isHovered) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius + 5, 0, 2 * Math.PI);
            ctx.fillStyle = isHovered
                ? "rgba(25,113,194,0.15)"
                : "rgba(224,49,49,0.1)";
            ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // Inner dot for depth
        ctx.beginPath();
        ctx.arc(node.x - radius * 0.25, node.y - radius * 0.25, radius * 0.3, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fill();

        // Label
        const fontSize = Math.max(8, 11 / globalScale);
        ctx.font = `500 ${fontSize}px 'Geist Variable', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = isHovered ? "#212529" : "#495057";
        ctx.fillText(node.name, node.x, node.y + radius + 3);
    }, [hoverNode]);

    return (
        <div className="flex w-full h-full gap-4 p-8">

            {/* ── Graph Canvas ───────────────────────── */}
            <div
                ref={containerRef}
                className="flex-1 relative overflow-hidden rounded-[20px] shadow-sm"
                style={{
                    background: "#F8F7F4", // Very light warm gray/beige
                    border: "1px solid var(--c-border)",
                }}
            >
                {/* Top legend strip */}
                <div
                    className="absolute top-4 left-4 z-10 flex items-center gap-4 px-4 py-2.5 rounded-xl shadow-sm"
                    style={{
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid var(--c-border-light)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    {LEGEND.map(({ type, label }) => (
                        <div key={type} className="flex items-center gap-1.5">
                            <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ background: NODE_COLORS[type] }}
                            />
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                        </div>
                    ))}
                    <div
                        className="ml-2 pl-3 flex items-center gap-1.5"
                        style={{ borderLeft: "1px solid var(--c-border)" }}
                    >
                        <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: "#E03131", opacity: 0.6 }}
                        />
                        <span className="text-sm font-medium text-gray-700">Bridge Link</span>
                    </div>
                </div>

                <ForceGraph2D
                    width={dimensions.width}
                    height={dimensions.height}
                    graphData={demoData}
                    nodeCanvasObject={paintNode}
                    nodeRelSize={6}
                    linkColor={(link: any) =>
                        selectedLink === link
                            ? "#1971C2"
                            : link.isResolution
                            ? "#E03131"
                            : "#CED4DA"
                    }
                    linkWidth={(link: any) => (selectedLink === link ? 2.5 : link.isResolution ? 2 : 1)}
                    linkDirectionalArrowLength={4}
                    linkDirectionalArrowRelPos={1}
                    linkDirectionalParticles={(link: any) => (link.isResolution ? 2 : 0)}
                    linkDirectionalParticleColor={() => "#E03131"}
                    linkDirectionalParticleSpeed={0.004}
                    backgroundColor="transparent"
                    onNodeHover={setHoverNode}
                    onLinkClick={(link) => setSelectedLink(link)}
                />

                {/* Time slider */}
                <div
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 rounded-full shadow-sm"
                    style={{
                        width: "60%",
                        maxWidth: 520,
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid var(--c-border-light)",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <span className="text-xs font-mono font-medium text-gray-500 flex-shrink-0">
                        Jan 2026
                    </span>
                    <div
                        className="flex-1 h-2 rounded-full relative overflow-hidden"
                        style={{ background: "#F1F3F5" }}
                    >
                        <div
                            className="absolute left-0 top-0 h-full rounded-full"
                            style={{
                                width: "65%",
                                background: "var(--c-green-primary)",
                            }}
                        />
                        <div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 cursor-ew-resize shadow-sm"
                            style={{
                                left: "65%",
                                transform: "translate(-50%, -50%)",
                                background: "#fff",
                                borderColor: "var(--c-green-primary)",
                            }}
                        />
                    </div>
                    <span className="text-xs font-mono font-medium text-gray-500 flex-shrink-0">
                        Sep 2026
                    </span>
                </div>
            </div>

            {/* ── Evidence Card ──────────────────────── */}
            <aside
                className="flex flex-col overflow-hidden rounded-[20px] shadow-sm"
                style={{
                    width: 380,
                    flexShrink: 0,
                    background: "var(--c-bg-card)",
                    border: "1px solid var(--c-border)",
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-5"
                    style={{ borderBottom: "1px solid var(--c-border-light)" }}
                >
                    <div className="flex items-center gap-2">
                        <ShieldAlert size={18} style={{ color: "var(--c-green-primary)" }} />
                        <span className="text-base font-semibold" style={{ color: "var(--c-text-primary)" }}>
                            Evidence Details
                        </span>
                    </div>
                    {selectedLink && (
                        <button
                            onClick={() => setSelectedLink(null)}
                            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                            style={{ color: "var(--c-text-secondary)" }}
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!selectedLink ? (
                        <div
                            className="flex flex-col items-center justify-center h-full text-center gap-4"
                            style={{ color: "var(--c-text-secondary)" }}
                        >
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-50 border border-gray-100"
                            >
                                <FileText size={24} className="text-gray-300" />
                            </div>
                            <div>
                                <div className="text-base font-medium mb-1 text-gray-800">
                                    No connection selected
                                </div>
                                <div className="text-sm max-w-[240px] mx-auto text-gray-500">
                                    Click any edge on the graph to view its source evidence document
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 step-in">

                            {/* Connection title */}
                            <div
                                className="rounded-xl p-5 border shadow-sm"
                                style={{
                                    background: "#FAFAFA",
                                    borderColor: "var(--c-border-light)",
                                    borderLeft: "4px solid var(--c-green-primary)",
                                }}
                            >
                                <div className="text-xs font-semibold uppercase tracking-wider mb-1.5 text-gray-500">
                                    Connection Type
                                </div>
                                <div className="text-lg font-serif text-gray-900">
                                    {selectedLink.label}
                                </div>
                                <div className="text-sm mt-2 text-gray-700 font-medium">
                                    {selectedLink.source.name ?? selectedLink.source}
                                    <span className="text-gray-400 font-normal mx-2"> ↔ </span>
                                    {selectedLink.target.name ?? selectedLink.target}
                                </div>
                            </div>

                            {/* Confidence + Status */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">
                                        Confidence Score
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">
                                        {(selectedLink.evidence.confidence * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <div
                                    className="h-2 w-full rounded-full overflow-hidden bg-gray-100"
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-700"
                                        style={{
                                            width: `${selectedLink.evidence.confidence * 100}%`,
                                            background: selectedLink.evidence.confidence > 0.9
                                                ? "var(--c-green-primary)"
                                                : "#F59F00",
                                        }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    {selectedLink.evidence.verified ? (
                                        <div
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                            style={{
                                                background: "var(--c-green-light)",
                                                color: "var(--c-green-text)",
                                            }}
                                        >
                                            <CheckCircle2 size={12} />
                                            Analyst Verified
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                                            style={{
                                                background: "var(--c-amber-light)",
                                                color: "var(--c-amber-text)",
                                            }}
                                        >
                                            <AlertCircle size={12} />
                                            Pending Review
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Source file + snippet */}
                            <div className="flex flex-col gap-3">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                                    Source Document
                                </div>
                                <div
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
                                    style={{
                                        background: "var(--c-blue-light)",
                                        color: "var(--c-blue-text)",
                                    }}
                                >
                                    <FileText size={16} />
                                    <span className="font-semibold truncate">{selectedLink.evidence.sourceFile}</span>
                                </div>
                                <div
                                    className="relative rounded-xl p-5 text-sm leading-relaxed border"
                                    style={{
                                        background: "#F8F9FA",
                                        borderColor: "var(--c-border-light)",
                                        borderLeft: "3px solid #1C7ED6",
                                        color: "#495057",
                                        fontFamily: "'Geist Variable', monospace",
                                    }}
                                >
                                    "{selectedLink.evidence.snippet}"
                                </div>
                            </div>

                            {/* Actions */}
                            <div
                                className="flex gap-3 pt-4"
                                style={{ borderTop: "1px solid var(--c-border-light)" }}
                            >
                                {!selectedLink.evidence.verified && (
                                    <button
                                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                                        style={{
                                            background: "var(--c-green-primary)",
                                            color: "white",
                                        }}
                                    >
                                        Approve Link
                                    </button>
                                )}
                                <button
                                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-50"
                                    style={{
                                        background: "white",
                                        border: "1px solid var(--c-border)",
                                        color: "var(--c-text-primary)",
                                    }}
                                >
                                    View Full Document
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}

