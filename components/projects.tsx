"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ExternalLink,
    Github,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Lightbulb,
    Search,
    Wrench,
    Code as Code2,
    TrendingUp,
    CircleAlert as AlertCircle,
    ChevronUp,
    Network,
} from "lucide-react";

const MermaidDiagram = dynamic(
    () => import("@/components/mermaid-diagram").then((m) => m.MermaidDiagram),
    { ssr: false },
);

const CodeHighlight = dynamic(
    () => import("@/components/code-highlight").then((m) => m.CodeHighlight),
    { ssr: false },
);

import { cn } from "@/lib/utils";
import type {
    CaseStudy,
    CaseStudyCodeEvidence,
    Challenge,
    DiagramPair,
    Project,
} from "@/content/types";
import { projects } from "@/content/projects";
import { ImpactMetricDescription } from "@/components/impact-metric-description";

const getMetricsGridColsClass = (metricsCount: number) => {
    if (metricsCount <= 1) return "lg:grid-cols-1";
    if (metricsCount === 2) return "lg:grid-cols-2";
    if (metricsCount === 3) return "lg:grid-cols-3";
    return "lg:grid-cols-4";
};

function ChallengeItem({
    challenge,
    index,
}: {
    challenge: Challenge;
    index: number;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const panelId = `challenge-panel-${index}`;
    const challengeItemRef = useRef<HTMLDivElement>(null);

    const handleScrollToTop = () => {
        challengeItemRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div
            ref={challengeItemRef}
            className="scroll-mt-24 flex flex-col rounded-xl border border-border bg-card/80 overflow-hidden"
        >
            {/* Challenge Header */}
            <button
                type="button"
                className={cn(
                    "flex items-start gap-4 p-4 transition-all duration-200 cursor-pointer hover:bg-muted/30",
                    isExpanded && "bg-muted/30 border-b border-border",
                )}
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
            >
                {/* Challenge Number */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold bg-foreground/5 text-foreground">
                    {String(index + 1).padStart(2, "0")}
                </div>

                {/* Challenge Content */}
                <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <div className="flex items-start gap-2">
                        <h4 className="font-medium text-foreground text-sm">
                            {challenge.title}
                        </h4>
                        <Badge
                            variant="outline"
                            className="print:hidden text-xs px-2 py-0.5 h-5 rounded shrink-0"
                        >
                            케이스 스터디
                        </Badge>
                    </div>
                    <p className="w-full text-left text-base text-muted-foreground leading-relaxed">
                        {challenge.summary}
                    </p>
                </div>

                {/* Toggle Indicator */}
                <ChevronDown
                    className={cn(
                        "print:hidden h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 mt-1",
                        isExpanded && "rotate-180",
                    )}
                />
            </button>

            {/* Expanded Case Study */}
            <div
                id={panelId}
                role="region"
                aria-label={`${challenge.title} 케이스 스터디`}
                aria-hidden={!isExpanded}
                className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                    "print:grid-rows-[1fr] print:opacity-100",
                )}
            >
                <div className="overflow-hidden print:overflow-visible">
                    <CaseStudyContent
                        caseStudy={challenge.caseStudy}
                        onScrollToTop={handleScrollToTop}
                    />
                </div>
            </div>
        </div>
    );
}

function DiagramComparison({ diagram }: { diagram: DiagramPair }) {
    const { before, after } = diagram;

    if (before && after) {
        return (
            <div className="flex flex-col gap-6">
                <div className="min-w-0 flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
                        개선 전
                    </span>
                    <MermaidDiagram diagram={before} />
                </div>
                <div className="min-w-0 flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                        개선 후
                    </span>
                    <MermaidDiagram diagram={after} />
                </div>
            </div>
        );
    }

    const single = before ?? after;
    if (!single) return null;

    return <MermaidDiagram diagram={single} />;
}

function CaseStudyCodeBlock({
    evidence,
    className,
}: {
    evidence: CaseStudyCodeEvidence;
    className?: string;
}) {
    return (
        <div className={cn("space-y-2", className)}>
            {evidence.caption ? (
                <p className="text-xs text-muted-foreground leading-relaxed">
                    {evidence.caption}
                </p>
            ) : null}
            <div className="rounded-xl border border-border/40 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-muted/35 dark:bg-muted/20">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground font-mono">
                            {evidence.codeLanguage || "code"}
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#ff5f56]/80" />
                        <span className="h-2 w-2 rounded-full bg-[#ffbd2e]/80" />
                        <span className="h-2 w-2 rounded-full bg-[#27ca40]/80" />
                    </div>
                </div>
                <CodeHighlight
                    code={evidence.codeSnippet}
                    lang={evidence.codeLanguage ?? "typescript"}
                />
            </div>
        </div>
    );
}

function CaseStudyParagraphs({
    paragraphs,
    className,
    spacing = "space-y-3",
}: {
    paragraphs: string[];
    className?: string;
    spacing?: string;
}) {
    return (
        <div className={spacing}>
            {paragraphs.map((text, i) => (
                <p
                    key={i}
                    className={cn(
                        "leading-relaxed text-base",
                        className ?? "text-muted-foreground",
                    )}
                >
                    {text}
                </p>
            ))}
        </div>
    );
}

function CaseStudyContent({
    caseStudy,
    onScrollToTop,
}: {
    caseStudy: CaseStudy;
    onScrollToTop: () => void;
}) {
    const timelineSteps = [
        {
            id: "problem",
            paarLetter: "P",
            label: "Problem",
            icon: Lightbulb,
            color: "text-rose-500",
            bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
            borderColor: "border-rose-500/30",
            dotColor: "bg-rose-500",
            content: caseStudy.problem,
            diagram: caseStudy.problemDiagram,
            code: caseStudy.problemCode,
        },
        {
            id: "investigation",
            paarLetter: "A",
            label: "Analyze",
            icon: Search,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
            borderColor: "border-amber-500/30",
            dotColor: "bg-amber-500",
            content: caseStudy.investigation,
            diagram: caseStudy.investigationDiagram,
            code: caseStudy.investigationCode,
        },
        {
            id: "solution",
            paarLetter: "A",
            label: "Action",
            icon: Wrench,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
            borderColor: "border-blue-500/30",
            dotColor: "bg-blue-500",
            content: caseStudy.solution,
            diagram: caseStudy.solutionDiagram,
            code: caseStudy.solutionCode,
        },
    ];

    return (
        <div className="bg-muted/55 border-l-4 border-l-blue-500/50 print:border-l-0 print:bg-transparent">
            <div className="px-6 py-8 lg:px-10 lg:py-10">
                <div className="mx-auto max-w-4xl">
                    {/* PAAR Identity Bar */}
                    <div
                        className="mb-8 animate-fade-in"
                        style={{
                            animationDelay: "50ms",
                            animationFillMode: "both",
                        }}
                    >
                        <div className="flex items-center gap-2 flex-wrap">
                            {(
                                [
                                    { letter: "P", label: "Problem",  color: "text-rose-500",    bg: "bg-rose-500/10 dark:bg-rose-500/15",    border: "border-rose-500/25"    },
                                    { letter: "A", label: "Analyze",  color: "text-amber-500",   bg: "bg-amber-500/10 dark:bg-amber-500/15",  border: "border-amber-500/25"   },
                                    { letter: "A", label: "Action",   color: "text-blue-500",    bg: "bg-blue-500/10 dark:bg-blue-500/15",    border: "border-blue-500/25"    },
                                    { letter: "R", label: "Result",   color: "text-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-500/15", border: "border-emerald-500/25" },
                                ] as const
                            ).map((step, i, arr) => (
                                <div key={step.letter + i} className="flex items-center gap-2">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
                                        step.bg, step.border,
                                    )}>
                                        <span className={cn("text-xs font-bold leading-none font-mono", step.color)}>
                                            {step.letter}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                            {step.label}
                                        </span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <span className="text-muted-foreground/30 text-xs select-none">→</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Layout - Problem → Analyze → Action */}
                    <div className="mb-12">
                        <div className="flex flex-col gap-8">
                            {timelineSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.id}
                                        className="animate-fade-up"
                                        style={{
                                            animationDelay: `${100 + index * 100}ms`,
                                            animationFillMode: "both",
                                        }}
                                    >
                                        {/* Content card */}
                                        <div
                                            className={cn(
                                                "rounded-xl border bg-card p-5 transition-all duration-300 hover:bg-card/70",
                                                step.borderColor,
                                            )}
                                        >
                                            <div className="flex items-center gap-3 mb-4">
                                                <div
                                                    className={cn(
                                                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-sm font-mono",
                                                        step.bgColor,
                                                        step.color,
                                                    )}
                                                >
                                                    {step.paarLetter}
                                                </div>
                                                <div
                                                    className={cn(
                                                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                                        step.bgColor,
                                                    )}
                                                >
                                                    <Icon
                                                        className={cn(
                                                            "h-3.5 w-3.5",
                                                            step.color,
                                                        )}
                                                    />
                                                </div>
                                                <h5 className="text-base font-semibold text-foreground">
                                                    {step.label}
                                                </h5>
                                            </div>
                                            <CaseStudyParagraphs
                                                paragraphs={step.content}
                                                spacing={
                                                    step.id === "solution"
                                                        ? "divide-y divide-border/30 [&>p]:py-3 [&>p:first-child]:pt-0 [&>p:last-child]:pb-0"
                                                        : "space-y-3"
                                                }
                                            />
                                            {step.code && (
                                                <CaseStudyCodeBlock
                                                    evidence={step.code}
                                                    className="mt-4"
                                                />
                                            )}
                                            {step.diagram && (
                                                <div className="mt-4">
                                                    <DiagramComparison
                                                        diagram={step.diagram}
                                                    />
                                                </div>
                                            )}
                                            {step.id === "solution" && (
                                                <>
                                                    {caseStudy.diagram && (
                                                        <div className="mt-6 pt-5 border-t border-border/40">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 dark:bg-blue-500/20">
                                                                    <Network className="h-3 w-3 text-blue-500" />
                                                                </div>
                                                                <h6 className="text-sm font-semibold text-foreground">Architecture</h6>
                                                            </div>
                                                            {caseStudy.architectureIntro?.length ? (
                                                                <div className="mb-4 space-y-2">
                                                                    {caseStudy.architectureIntro.map((line, idx) => (
                                                                        <p key={idx} className="text-base leading-relaxed text-muted-foreground">
                                                                            {line}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            ) : null}
                                                            <DiagramComparison diagram={caseStudy.diagram} />
                                                        </div>
                                                    )}
                                                    {(caseStudy.implementation.description.length > 1 || caseStudy.implementation.codeSnippet) && (
                                                        <div className="mt-6 pt-5 border-t border-border/40">
                                                            <div className="flex items-center gap-2 mb-4">
                                                                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 dark:bg-blue-500/20">
                                                                    <Code2 className="h-3 w-3 text-blue-500" />
                                                                </div>
                                                                <h6 className="text-sm font-semibold text-foreground">Implementation</h6>
                                                            </div>
                                                            <CaseStudyParagraphs paragraphs={caseStudy.implementation.description} />
                                                            {caseStudy.implementation.codeSnippet && (
                                                                <CaseStudyCodeBlock
                                                                    evidence={{
                                                                        codeSnippet: caseStudy.implementation.codeSnippet,
                                                                        codeLanguage: caseStudy.implementation.codeLanguage,
                                                                    }}
                                                                    className="mt-4"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Results Section with Metrics Cards */}
                    <div
                        className="animate-fade-up"
                        style={{
                            animationDelay: "600ms",
                            animationFillMode: "both",
                        }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 font-bold text-sm font-mono">
                                R
                            </div>
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </div>
                            <h5 className="text-base font-semibold text-foreground">
                                Result
                            </h5>
                        </div>

                        {/* Metrics Cards */}
                        <div
                            className={cn(
                                "grid grid-cols-2 gap-3 mb-6 pl-0 sm:pl-11",
                                getMetricsGridColsClass(
                                    caseStudy.impact.metrics.length,
                                ),
                            )}
                        >
                            {caseStudy.impact.metrics.map((metric, i) => (
                                <div
                                    key={i}
                                    className="@container group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-emerald-500/40 hover:bg-card/70 animate-fade-up print:break-inside-avoid"
                                    style={{
                                        animationDelay: `${550 + i * 50}ms`,
                                        animationFillMode: "both",
                                    }}
                                >
                                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                                    <div className="relative flex flex-col gap-1">
                                        <span className="text-sm font-medium text-foreground/80">
                                            {metric.label}
                                        </span>
                                        <span className="text-2xl font-bold tracking-tight text-foreground">
                                            {metric.value}
                                        </span>
                                        {metric.description &&
                                            metric.description.length > 0 && (
                                                <ImpactMetricDescription
                                                    lines={metric.description}
                                                />
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="pl-0 sm:pl-11">
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-4">
                                <CaseStudyParagraphs
                                    paragraphs={caseStudy.impact.summary}
                                    className="text-foreground/90"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Scroll To Top Button */}
                    <div
                        className="print:hidden mt-10 pt-6 border-t border-border/50 flex justify-center animate-fade-up"
                        style={{
                            animationDelay: "700ms",
                            animationFillMode: "both",
                        }}
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onScrollToTop}
                            className="gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ChevronUp className="h-4 w-4" />
                            위로 이동
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProjectImageCarousel({
    images,
    title,
}: {
    images: string[];
    title: string;
}) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurrentIndex(emblaApi.selectedScrollSnap());
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
        };
    }, [emblaApi, onSelect]);

    if (images.length === 0) {
        return (
            <div className="relative w-full aspect-video overflow-hidden bg-muted/30 border-b border-border/50">
                <div className="absolute inset-0 bg-linear-to-br from-foreground/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-bold text-muted-foreground/10 select-none">
                        {title.slice(0, 2).toUpperCase()}
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video overflow-hidden border-b border-border/50">
            <div ref={emblaRef} className="h-full overflow-hidden">
                <div className="flex h-full">
                    {images.map((src, i) => (
                        <div
                            key={i}
                            className="relative min-w-0 shrink-0 grow-0 basis-full h-full"
                        >
                            {(() => {
                                // 슬라이드 DOM은 유지하되, 실제로는 주변(prev/current/next)만 렌더링해서
                                // 네트워크 요청을 줄입니다.
                                const shouldRender =
                                    i === currentIndex ||
                                    i === currentIndex - 1 ||
                                    i === currentIndex + 1;

                                if (!shouldRender) return null;

                                return (
                                    <Image
                                        src={src}
                                        alt={`${title} screenshot ${i + 1}`}
                                        loading={i === 0 ? "eager" : "lazy"}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 100vw, 960px"
                                    />
                                );
                            })()}
                        </div>
                    ))}
                </div>
            </div>
            {images.length > 1 && (
                <>
                    {canScrollPrev && (
                        <button
                            type="button"
                            onClick={() => emblaApi?.scrollPrev()}
                            disabled={!canScrollPrev}
                            aria-label="Previous slide"
                            className={cn(
                                "absolute left-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-opacity",
                                !canScrollPrev &&
                                    "opacity-30 cursor-not-allowed",
                            )}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    )}
                    {canScrollNext && (
                        <button
                            type="button"
                            onClick={() => emblaApi?.scrollNext()}
                            disabled={!canScrollNext}
                            aria-label="Next slide"
                            className={cn(
                                "absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-opacity",
                                !canScrollNext &&
                                    "opacity-30 cursor-not-allowed",
                            )}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    )}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                            <button
                                type="button"
                                key={i}
                                onClick={() => emblaApi?.scrollTo(i)}
                                aria-label={`Slide ${i + 1}`}
                                className={cn(
                                    "h-1.5 rounded-full transition-all",
                                    i === currentIndex
                                        ? "w-4 bg-foreground"
                                        : "w-1.5 bg-foreground/40",
                                )}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <article
            ref={cardRef}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:border-foreground/20 scroll-m-16"
        >
            <div className="flex flex-col ">
                {/* Image Carousel */}
                {!project.isPrivate && (
                    <ProjectImageCarousel
                        images={project.images}
                        title={project.title}
                    />
                )}
                <div className="p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-semibold text-foreground">
                                {project.title}
                            </h3>
                            {project.isPrivate && (
                                <Badge
                                    variant="outline"
                                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                                >
                                    Private
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span>{project.duration}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            <Badge
                                variant="outline"
                                className="rounded-full px-2.5 py-0.5 text-xs font-normal"
                            >
                                {project.teamSize}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mt-1">
                            {project.description}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="pt-8 flex flex-col gap-8">
                        {/* Features */}
                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
                                주요 담당 역할
                            </h4>
                            <ul className="grid gap-1.5 text-base text-muted-foreground sm:grid-cols-2">
                                {project.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="rounded-full px-2.5 py-0.5 text-xs font-normal"
                                >
                                    {tech}
                                </Badge>
                            ))}
                        </div>

                        {/* Challenges Section */}
                        {project.challenges.length > 0 && (
                            <div className="flex flex-col gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                    <h4 className="text-base font-semibold text-foreground">
                                        주요 도전 과제 (
                                        {project.challenges.length})
                                    </h4>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {project.challenges.map(
                                        (challenge, index) => (
                                            <ChallengeItem
                                                key={index}
                                                challenge={challenge}
                                                index={index}
                                            />
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border/50">
                            {project.liveUrl && (
                                <Button
                                    size="sm"
                                    variant="default"
                                    asChild
                                    className="rounded-full"
                                >
                                    <Link
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gap-2"
                                    >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        Visit
                                    </Link>
                                </Button>
                            )}
                            {project.githubUrl && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="rounded-full"
                                >
                                    <Link
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gap-2"
                                    >
                                        <Github className="h-3.5 w-3.5" />
                                        소스 코드
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

export function Projects() {
    return (
        <section id="projects" className="border-t border-border">
            <div className="mx-auto max-w-5xl px-6 py-28 md:py-32">
                <div className="flex flex-col gap-16">
                    {/* Section Header */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            주요 프로젝트
                        </h2>
                    </div>

                    {/* Projects List */}
                    <div className="flex flex-col gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard key={index} project={project} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
