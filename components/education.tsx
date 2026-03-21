"use client";

import { GraduationCap } from "lucide-react";
import { educationList } from "@/content/education";

export function Education() {
    return (
        <section id="education" className="border-t border-border bg-section-alt">
            <div className="mx-auto max-w-5xl px-6 py-28 md:py-32">
                <div className="flex flex-col gap-16">
                    {/* Section Header */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Education
                        </h2>
                    </div>

                    {/* Education List */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                                학력
                            </span>
                        </div>
                        <div className="flex flex-col gap-5">
                            {educationList.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-md"
                                >
                                    <h3 className="font-medium text-foreground leading-snug">
                                        {item.institution} {item.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
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
        </section>
    );
}
