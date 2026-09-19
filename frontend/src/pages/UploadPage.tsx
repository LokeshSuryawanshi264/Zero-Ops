import React, { useState } from "react";
import { Search, CheckCircle2, UploadCloud, Database, Hash, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
    const navigate = useNavigate();
    const [isUploading, setIsUploading] = useState(false);
    const [progressStep, setProgressStep] = useState(-1);

    const handleUploadClick = () => {
        setIsUploading(true);
        setProgressStep(0);
        setTimeout(() => setProgressStep(1), 1200);
        setTimeout(() => setProgressStep(2), 2600);
        setTimeout(() => setProgressStep(3), 3800);
        setTimeout(() => navigate("/graph"), 5000);
    };

    return (
        <div className="p-10 max-w-6xl mx-auto flex flex-col gap-8 h-full">

            {/* Header section like in the image */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="font-serif text-4xl text-gray-900 mb-2">Good Evening, 👋</h1>
                    <p className="text-gray-500">Here's what's happening with your investigations today.</p>
                </div>
                <button 
                    className="px-6 py-2.5 rounded-full text-sm font-semibold transition-opacity hover:opacity-90 flex items-center gap-2"
                    style={{ background: "var(--c-green-primary)", color: "white" }}
                >
                    <span>+</span> New Case File
                </button>
            </div>

            {/* Success Banner */}
            <div 
                className="flex items-center gap-3 px-5 py-4 rounded-xl"
                style={{ background: "var(--c-green-light)", border: "1px solid rgba(27,94,60,0.1)" }}
            >
                <div className="w-5 h-5 rounded-full border border-green-600 flex items-center justify-center">
                    <CheckCircle2 size={14} style={{ color: "var(--c-green-text)" }} />
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--c-green-text)" }}>
                    System is up to date. Ready for new evidence ingestion. ✅
                </span>
            </div>

            {/* Section Title & Search */}
            <div className="flex flex-col gap-6 mt-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-serif text-2xl text-gray-800">Your Cases</h2>
                    <div 
                        className="flex items-center gap-2 px-4 py-2.5 rounded-full w-80 shadow-sm"
                        style={{ background: "white", border: "1px solid var(--c-border)" }}
                    >
                        <Search size={16} className="text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search FIRs, CDRs..." 
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-gray-200">
                    <button className="pb-3 text-sm font-semibold border-b-2" style={{ color: "var(--c-green-primary)", borderColor: "var(--c-green-primary)" }}>Active (2)</button>
                    <button className="pb-3 text-sm font-medium text-gray-500">Processing (0)</button>
                    <button className="pb-3 text-sm font-medium text-gray-500">Closed (14)</button>
                </div>

                {/* Main Content Area */}
                <div className="flex gap-6">
                    {/* Upload Card */}
                    <div 
                        className="flex-1 rounded-[20px] p-8 shadow-sm flex flex-col justify-center items-center relative overflow-hidden group"
                        style={{ background: "var(--c-bg-card)", border: "1px solid var(--c-border)", minHeight: 320 }}
                    >
                        {!isUploading ? (
                            <div className="flex flex-col items-center cursor-pointer" onClick={handleUploadClick}>
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-sm border border-gray-100">
                                    <UploadCloud size={28} style={{ color: "var(--c-green-primary)" }} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">Upload New Evidence</h3>
                                <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
                                    Drop FIRs (PDF), CDRs (CSV), or transaction logs here to extract entities.
                                </p>
                                <button 
                                    className="px-6 py-2 rounded-full text-sm font-semibold"
                                    style={{ background: "var(--c-green-primary)", color: "white" }}
                                >
                                    Browse Files
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full max-w-md">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--c-green-primary)", borderTopColor: "transparent" }} />
                                    <div>
                                        <div className="text-base font-semibold text-gray-900">Processing Case_Extortion_vs_Arms.zip</div>
                                        <div className="text-sm text-gray-500">Extracting intelligence...</div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-5">
                                    {[
                                        "OCR & Text Extraction",
                                        "Named Entity Recognition",
                                        "Cross-Case Identity Resolution",
                                        "Sealing Hash Ledger"
                                    ].map((label, i) => {
                                        const done = progressStep > i;
                                        const active = progressStep === i;
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                {done ? (
                                                    <CheckCircle2 size={18} style={{ color: "var(--c-green-primary)" }} />
                                                ) : active ? (
                                                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin ml-0.5" style={{ borderColor: "var(--c-green-primary)", borderTopColor: "transparent" }} />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 ml-0.5" style={{ borderColor: "#E5E7EB" }} />
                                                )}
                                                <span className={`text-sm ${active || done ? 'font-medium text-gray-900' : 'text-gray-400'}`}>
                                                    {label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right column - Recent Ledger */}
                    <div 
                        className="w-[360px] rounded-[20px] shadow-sm flex flex-col overflow-hidden"
                        style={{ background: "var(--c-bg-card)", border: "1px solid var(--c-border)" }}
                    >
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Database size={16} className="text-gray-400" />
                                Evidence Ledger
                            </h3>
                        </div>
                        <div className="flex-1 p-4 flex flex-col gap-3">
                            {[
                                { name: "FIR_104_Andheri.pdf",           size: "2.1 MB", hash: "a3f8e1c4" },
                                { name: "CDR_August_2026.csv",           size: "8.7 MB", hash: "7b2d3f01" },
                                { name: "FIR_221_NhavaSheva.pdf",         size: "3.4 MB", hash: "f1a9c820" },
                                { name: "Arms_Smuggling_Intel_Report.pdf", size: "1.8 MB", hash: "9e3c4d77" },
                            ].map((file) => (
                                <div 
                                    key={file.name} 
                                    className="p-3 rounded-xl border border-gray-100 hover:shadow-sm cursor-pointer transition-shadow"
                                    onClick={() => navigate("/graph")}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText size={14} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-800 truncate">{file.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <div className="flex items-center gap-1 font-mono bg-gray-50 px-2 py-1 rounded">
                                            <Hash size={10} /> {file.hash}
                                        </div>
                                        <span>{file.size}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

