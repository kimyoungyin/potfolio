"use client";

import { Badge } from "@/components/ui/badge";
import { skillCategories } from "@/content/skills";

export function Skills() {
    return (
        <section id="skills" className="border-t border-border/50 bg-muted/30">
            <div className="mx-auto max-w-5xl px-6 py-24 md:py-28">
                <div className="flex flex-col gap-16">
                    {/* Section Header */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Technical Skills
                        </h2>
                        <p className="text-muted-foreground max-w-lg">
                            Technologies and tools I use to bring ideas to life
                        </p>
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
                                                key={skill}
                                                variant="secondary"
                                                className="rounded-full px-3.5 py-1.5 text-sm font-normal transition-all duration-200 hover:bg-foreground hover:text-background cursor-default"
                                                style={{
                                                    animationDelay: `${(categoryIndex * 4 + skillIndex) * 50}ms`,
                                                }}
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
