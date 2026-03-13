"use client";

import { GraduationCap, Award, BookOpen } from "lucide-react";
import {
    educationList,
    certificationList,
    trainingList,
} from "@/content/education";

export function Education() {
    return (
        <section id="education" className="border-t border-border/50">
            <div className="mx-auto max-w-5xl px-6 py-24 md:py-28">
                <div className="flex flex-col gap-16">
                    {/* Section Header */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Education
                        </h2>
                        <p className="text-muted-foreground max-w-lg">
                            Academic background and professional development
                        </p>
                    </div>

                    {/* Content Grid */}
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Education */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                                    Education
                                </span>
                            </div>
                            <div className="flex flex-col gap-5">
                                {educationList.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card/50 p-5 transition-colors hover:border-border"
                                    >
                                        <h3 className="font-medium text-foreground leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.institution}
                                        </p>
                                        <p className="text-xs text-muted-foreground/70">
                                            {item.period}
                                        </p>
                                        {item.description && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                    <Award className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                                    Certifications
                                </span>
                            </div>
                            <div className="flex flex-col gap-4">
                                {certificationList.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-1.5 rounded-xl border border-border/50 bg-card/50 p-5 transition-colors hover:border-border"
                                    >
                                        <h3 className="font-medium text-foreground leading-snug">
                                            {cert.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {cert.issuer}
                                            <span className="mx-2 text-muted-foreground/40">
                                                ·
                                            </span>
                                            {cert.year}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Training */}
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                                    Training
                                </span>
                            </div>
                            <div className="flex flex-col gap-4">
                                {trainingList.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col gap-2 rounded-xl border border-border/50 bg-card/50 p-5 transition-colors hover:border-border"
                                    >
                                        <h3 className="font-medium text-foreground leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.organization}
                                            <span className="mx-2 text-muted-foreground/40">
                                                ·
                                            </span>
                                            {item.period}
                                        </p>
                                        {item.description && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
