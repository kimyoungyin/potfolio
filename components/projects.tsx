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
                )}
            >
                <div className="overflow-hidden">
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
}: {
    paragraphs: string[];
    className?: string;
}) {
    return (
        <div className="space-y-3">
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
            label: "Investigation",
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
            label: "Solution",
            icon: Wrench,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
            borderColor: "border-emerald-500/30",
            dotColor: "bg-emerald-500",
            content: caseStudy.solution,
            diagram: caseStudy.solutionDiagram,
            code: caseStudy.solutionCode,
        },
    ];

    return (
        <div className="bg-muted/55 border-l-4 border-l-emerald-500/50">
            <div className="px-6 py-8 lg:px-10 lg:py-10">
                <div className="mx-auto max-w-4xl">
                    {/* Case Study Header */}
                    <div
                        className="mb-8 animate-fade-in"
                        style={{
                            animationDelay: "50ms",
                            animationFillMode: "both",
                        }}
                    >
                        <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground mb-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Technical Deep Dive
                        </div>
                    </div>

                    {/* Timeline Layout - Problem → Investigation → Solution */}
                    <div className="relative mb-12">
                        {/* Vertical timeline line */}
                        <div className="absolute left-4 top-6 bottom-6 w-px bg-linear-to-b from-rose-500/50 via-amber-500/50 to-emerald-500/50 hidden sm:block" />

                        <div className="flex flex-col gap-8">
                            {timelineSteps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.id}
                                        className="relative flex gap-6 animate-fade-up"
                                        style={{
                                            animationDelay: `${100 + index * 100}ms`,
                                            animationFillMode: "both",
                                        }}
                                    >
                                        {/* Timeline node */}
                                        <div className="relative z-10 hidden sm:flex shrink-0">
                                            <div
                                                className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 bg-card",
                                                    step.borderColor,
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "h-2.5 w-2.5 rounded-full",
                                                        step.dotColor,
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {/* Content card */}
                                        <div
                                            className={cn(
                                                "flex-1 rounded-xl border bg-card p-5 transition-all duration-300 hover:bg-card/70",
                                                step.borderColor,
                                            )}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div
                                                    className={cn(
                                                        "flex h-7 w-7 items-center justify-center rounded-lg",
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
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Architecture Diagram */}
                    {caseStudy.diagram && (
                        <div
                            className="mb-12 animate-fade-up"
                            style={{
                                animationDelay: "400ms",
                                animationFillMode: "both",
                            }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 dark:bg-violet-500/20">
                                    <Network className="h-4 w-4 text-violet-500" />
                                </div>
                                <h5 className="text-base font-semibold text-foreground">
                                    Architecture
                                </h5>
                            </div>
                            <div className="pl-0 sm:pl-11">
                                {caseStudy.architectureIntro ? (
                                    <p className="mb-4 text-base leading-relaxed text-muted-foreground">
                                        {caseStudy.architectureIntro}
                                    </p>
                                ) : null}
                                <DiagramComparison
                                    diagram={caseStudy.diagram}
                                />
                            </div>
                        </div>
                    )}

                    {/* Implementation Section */}
                    <div
                        className="mb-12 animate-fade-up"
                        style={{
                            animationDelay: "500ms",
                            animationFillMode: "both",
                        }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 dark:bg-blue-500/20">
                                <Code2 className="h-4 w-4 text-blue-500" />
                            </div>
                            <h5 className="text-base font-semibold text-foreground">
                                Implementation
                            </h5>
                        </div>
                        <div className="flex flex-col gap-4 pl-0 sm:pl-11">
                            <CaseStudyParagraphs
                                paragraphs={
                                    caseStudy.implementation.description
                                }
                            />
                            {caseStudy.implementation.codeSnippet && (
                                <CaseStudyCodeBlock
                                    evidence={{
                                        codeSnippet:
                                            caseStudy.implementation
                                                .codeSnippet,
                                        codeLanguage:
                                            caseStudy.implementation
                                                .codeLanguage,
                                    }}
                                />
                            )}
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                            </div>
                            <h5 className="text-base font-semibold text-foreground">
                                Results & Impact
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
                                    className="@container group relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-emerald-500/40 hover:bg-card/70 animate-fade-up"
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
                            <Image
                                src={src}
                                alt={`${title} screenshot ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 960px"
                            />
                        </div>
                    ))}
                </div>
            </div>
            {images.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={() => emblaApi?.scrollPrev()}
                        disabled={!canScrollPrev}
                        aria-label="Previous slide"
                        className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-opacity",
                            !canScrollPrev && "opacity-30 cursor-not-allowed",
                        )}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => emblaApi?.scrollNext()}
                        disabled={!canScrollNext}
                        aria-label="Next slide"
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/70 backdrop-blur-sm border border-border/50 flex items-center justify-center transition-opacity",
                            !canScrollNext && "opacity-30 cursor-not-allowed",
                        )}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
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
                                    비공개 프로젝트
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
                                담당 역할 요약
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
                                        라이브 데모
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
