"use client";

import { Badge } from "@/components/ui/badge";
import { skillCategories } from "@/content/skills";

export function Skills() {
    return (
        <section id="skills" className="border-t border-border bg-section-alt">
            <div className="mx-auto max-w-5xl px-6 py-28 md:py-32">
                <div className="flex flex-col gap-16">
                    {/* Section Header */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Technical Skills
                        </h2>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {skillCategories.map((category, categoryIndex) => (
                            <div
                                key={category.name}
                                className="flex flex-col gap-5"
                            >
                                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
                                    {category.name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {category.skills.map(
                                        (skill, skillIndex) => (
                                            <Badge
                                                key={`${category.name}-${skillIndex}`}
                                                variant="secondary"
                                                className="rounded-full px-2.5 py-0.5 text-xs font-normal"
                                            >
                                                {skill}
                                            </Badge>
                                        ),
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
