"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { renderMermaid } from "beautiful-mermaid";
import type { DiagramColors } from "beautiful-mermaid";

const LIGHT: DiagramColors = {
    bg: "#fafafa",
    fg: "#18181b",
    line: "#a1a1aa",
    accent: "#3f3f46",
    muted: "#71717a",
};

const DARK: DiagramColors = {
    bg: "#09090b",
    fg: "#e4e4e7",
    line: "#52525b",
    accent: "#a1a1aa",
    muted: "#71717a",
};

export function MermaidDiagram({ diagram }: { diagram: string }) {
    const { resolvedTheme } = useTheme();
    const [svg, setSvg] = useState<string | null>(null);

    useEffect(() => {
        renderMermaid(
            diagram,
            resolvedTheme === "dark" ? DARK : LIGHT,
        ).then(setSvg);
    }, [diagram, resolvedTheme]);

    if (!svg)
        return <div className="h-40 rounded-xl bg-muted/30 animate-pulse" />;

    return (
        <div
            className="overflow-x-auto rounded-xl border border-border/30 bg-card p-4 [&_svg]:max-w-full [&_svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
