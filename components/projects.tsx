"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    ExternalLink,
    Github,
    ChevronDown,
    Lightbulb,
    Search,
    Wrench,
    Code2,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CaseStudy, Project } from "@/content/types";
import { projects } from "@/content/projects";

function ProjectCard({
    project,
    isExpanded,
    onToggle,
}: {
    project: Project;
    isExpanded: boolean;
    onToggle: () => void;
}) {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:border-border">
            {/* Main Card Content */}
            <div className="flex flex-col lg:flex-row">
                {/* Project Image Placeholder */}
                <div className="relative flex h-48 items-center justify-center bg-muted/30 lg:h-auto lg:w-72 lg:shrink-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent" />
                    <div className="relative text-5xl font-bold text-muted-foreground/10 select-none">
                        {project.title.slice(0, 2).toUpperCase()}
                    </div>
                </div>

                {/* Project Content */}
                <div className="flex flex-1 flex-col gap-5 p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-xl font-semibold text-foreground">
                                {project.title}
                            </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span>{project.duration}</span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                            <Badge
                                variant="outline"
                                className="rounded-full text-xs font-normal"
                            >
                                {project.teamSize}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground leading-relaxed mt-1">
                            {project.description}
                        </p>
                    </div>

                    {/* Features */}
                    <ul className="grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
                        {project.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                                {feature}
                            </li>
                        ))}
                    </ul>

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

                    {/* Challenge Summary */}
                    <div className="rounded-lg bg-muted/40 px-4 py-3 border-l-2 border-foreground/10">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                Challenge:
                            </span>{" "}
                            {project.challengeSummary}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
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
                                Live Demo
                            </Link>
                        </Button>
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
                                Source
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={onToggle}
                            className={cn(
                                "ml-auto rounded-full gap-2 transition-colors",
                                isExpanded && "bg-muted",
                            )}
                        >
                            View Case Study
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform duration-300",
                                    isExpanded && "rotate-180",
                                )}
                            />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Expanded Case Study Section */}
            <div
                className={cn(
                    "grid transition-all duration-500 ease-in-out",
                    isExpanded
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0",
                )}
            >
                <div className="overflow-hidden">
                    <div className="border-t border-border/50 bg-muted/20">
                        <CaseStudyContent caseStudy={project.caseStudy} />
                    </div>
                </div>
            </div>
        </article>
    );
}

function CaseStudyContent({ caseStudy }: { caseStudy: CaseStudy }) {
    const timelineSteps = [
        {
            id: "problem",
            label: "Problem",
            icon: Lightbulb,
            color: "text-rose-500",
            bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
            borderColor: "border-rose-500/30",
            content: caseStudy.problem,
        },
        {
            id: "investigation",
            label: "Investigation",
            icon: Search,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
            borderColor: "border-amber-500/30",
            content: caseStudy.investigation,
        },
        {
            id: "solution",
            label: "Solution",
            icon: Wrench,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
            borderColor: "border-emerald-500/30",
            content: caseStudy.solution,
        },
    ];

    return (
        <div className="px-6 py-10 lg:px-12 lg:py-14">
            <div className="mx-auto max-w-5xl">
                {/* Case Study Header */}
                <div
                    className="mb-12 animate-fade-in"
                    style={{
                        animationDelay: "50ms",
                        animationFillMode: "both",
                    }}
                >
                    <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-muted-foreground mb-4">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Case Study
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">
                        Technical Deep Dive
                    </h4>
                    <p className="text-muted-foreground">
                        From problem identification to measurable impact
                    </p>
                </div>

                {/* Timeline Layout */}
                <div className="relative mb-14">
                    {/* Timeline connector line */}
                    <div className="absolute left-[19px] top-0 hidden h-full w-px bg-gradient-to-b from-border via-border/50 to-transparent md:block" />

                    <div className="flex flex-col gap-10">
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
                                    <div className="relative z-10 hidden shrink-0 md:flex">
                                        <div
                                            className={cn(
                                                "flex h-10 w-10 items-center justify-center rounded-xl border-2 bg-card shadow-sm transition-transform hover:scale-110",
                                                step.borderColor,
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    "h-4.5 w-4.5",
                                                    step.color,
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Content card */}
                                    <div
                                        className={cn(
                                            "flex-1 rounded-2xl border bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-card/80",
                                            step.borderColor,
                                        )}
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div
                                                className={cn(
                                                    "flex h-8 w-8 items-center justify-center rounded-lg md:hidden",
                                                    step.bgColor,
                                                )}
                                            >
                                                <Icon
                                                    className={cn(
                                                        "h-4 w-4",
                                                        step.color,
                                                    )}
                                                />
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={cn(
                                                        "text-xs font-semibold uppercase tracking-wider",
                                                        step.color,
                                                    )}
                                                >
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )}
                                                </span>
                                                <h5 className="text-base font-semibold text-foreground">
                                                    {step.label}
                                                </h5>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed text-[15px]">
                                            {step.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Implementation Section */}
                <div
                    className="mb-14 animate-fade-up"
                    style={{
                        animationDelay: "400ms",
                        animationFillMode: "both",
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-blue-500/30 bg-blue-500/10 dark:bg-blue-500/20">
                            <Code2 className="h-4.5 w-4.5 text-blue-500" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                                04
                            </span>
                            <h5 className="text-base font-semibold text-foreground">
                                Implementation
                            </h5>
                        </div>
                    </div>
                    <div className="flex flex-col gap-5 pl-0 md:pl-16">
                        <p className="text-muted-foreground leading-relaxed text-[15px]">
                            {caseStudy.implementation.description}
                        </p>
                        {caseStudy.implementation.codeSnippet && (
                            <div className="rounded-2xl bg-[#0d1117] dark:bg-[#0a0a0a] border border-border/30 overflow-hidden shadow-lg">
                                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#161b22] dark:bg-[#111]">
                                    <div className="flex items-center gap-2">
                                        <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {caseStudy.implementation
                                                .codeLanguage || "code"}
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80" />
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#27ca40]/80" />
                                    </div>
                                </div>
                                <pre className="p-5 overflow-x-auto text-sm leading-relaxed">
                                    <code className="text-[#e6edf3] dark:text-gray-300 font-mono">
                                        {caseStudy.implementation.codeSnippet}
                                    </code>
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Section with Highlighted Metrics */}
                <div
                    className="animate-fade-up"
                    style={{
                        animationDelay: "500ms",
                        animationFillMode: "both",
                    }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-500/20">
                            <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                                05
                            </span>
                            <h5 className="text-base font-semibold text-foreground">
                                Results & Impact
                            </h5>
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4 pl-0 md:pl-16">
                        {caseStudy.impact.metrics.map((metric, i) => (
                            <div
                                key={i}
                                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
                                style={{ animationDelay: `${550 + i * 50}ms` }}
                            >
                                {/* Highlight glow effect */}
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl transition-opacity duration-300 opacity-0 group-hover:opacity-100" />

                                <div className="relative flex flex-col gap-2">
                                    <span className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
                                        {metric.value}
                                    </span>
                                    <span className="text-sm font-medium text-foreground/80">
                                        {metric.label}
                                    </span>
                                    {metric.description && (
                                        <span className="text-xs text-muted-foreground">
                                            {metric.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="pl-0 md:pl-16">
                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-6">
                            <p className="text-foreground/90 leading-relaxed text-[15px]">
                                {caseStudy.impact.summary}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function Projects() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section id="projects" className="border-t border-border/50">
            <div className="mx-auto max-w-5xl px-6 py-24 md:py-28">
                <div className="flex flex-col gap-16">
                    {/* Section Header */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Featured Projects
                        </h2>
                        <p className="text-muted-foreground max-w-lg">
                            Selected work showcasing problem-solving and
                            technical implementation
                        </p>
                    </div>

                    {/* Projects List */}
                    <div className="flex flex-col gap-6">
                        {projects.map((project, index) => (
                            <ProjectCard
                                key={index}
                                project={project}
                                isExpanded={expandedIndex === index}
                                onToggle={() => handleToggle(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
