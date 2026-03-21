"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { codeToHtml } from "shiki";
import type { BundledLanguage } from "shiki";

interface Props {
    code: string;
    lang?: string;
}

export function CodeHighlight({ code, lang = "typescript" }: Props) {
    const { resolvedTheme } = useTheme();
    const [html, setHtml] = useState<string | null>(null);

    useEffect(() => {
        if (!resolvedTheme) return;
        codeToHtml(code, {
            lang: lang as BundledLanguage,
            theme: resolvedTheme === "dark" ? "github-dark" : "github-light",
        }).then((result) => {
            setHtml(result);
        });
    }, [code, lang, resolvedTheme]);

    if (!html) {
        return (
            <pre className="p-4 overflow-x-auto text-xs leading-relaxed font-mono text-[#e6edf3]">
                {code}
            </pre>
        );
    }

    return (
        <div
            className="code-highlight [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:leading-relaxed [&_pre]:m-0 [&_pre]:rounded-none [&_pre]:font-mono"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
