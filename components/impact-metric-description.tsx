import type { ReactNode } from "react";

function lineIsAfterChange(line: string | undefined): boolean {
    return typeof line === "string" && line.trimStart().startsWith("→");
}

/**
 * impact.metrics[].description 줄 배열에서
 * "이전" 줄 + 다음 줄이 "→ …"이면 한 그룹으로 묶습니다.
 * 카드에 @container가 있을 때, 좁으면 세로·넓으면 같은 행에 배치됩니다.
 */
export function ImpactMetricDescription({ lines }: { lines: string[] }) {
    const blocks: ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const next = lines[i + 1];

        if (lineIsAfterChange(next)) {
            blocks.push(
                <div
                    key={i}
                    className="flex w-full min-w-0 flex-col gap-0.5 @[240px]:flex-row @[240px]:flex-wrap @[240px]:items-baseline @[240px]:gap-x-2"
                >
                    <span className="min-w-0 text-[10px] leading-relaxed text-muted-foreground">
                        {line}
                    </span>
                    <span className="min-w-0 text-[10px] leading-relaxed text-muted-foreground">
                        {next}
                    </span>
                </div>,
            );
            i += 2;
        } else {
            blocks.push(
                <span
                    key={i}
                    className="text-[10px] leading-relaxed text-muted-foreground"
                >
                    {line}
                </span>,
            );
            i += 1;
        }
    }

    return <div className="mt-1 flex flex-col gap-1">{blocks}</div>;
}
