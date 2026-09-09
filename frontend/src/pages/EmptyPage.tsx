interface EmptyPageProps {
    title: string;
}

export default function EmptyPage({ title }: EmptyPageProps) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 rounded-xl p-12 bg-white/50">
            <h2 className="text-2xl font-medium mb-2">{title}</h2>
            <p className="text-sm text-center max-w-sm">
                This screen is currently a placeholder. Start adding UI elements tailored to {title.toLowerCase()}.
            </p>
        </div>
    );
}
