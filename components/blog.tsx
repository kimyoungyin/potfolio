"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/content/blog";

export function Blog() {
    return (
        <section id="blog" className="border-t border-border bg-section-alt">
            <div className="mx-auto max-w-5xl px-6 py-28 md:py-32">
                <div className="flex flex-col gap-16">
                    {/* Section Header */}
                    <div className="flex flex-col gap-3">
                        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Writing
                        </h2>
                    </div>

                    {/* Blog Posts Grid */}
                    <div className="grid gap-5 sm:grid-cols-2">
                        {blogPosts.map((post, index) => (
                            <Link
                                key={index}
                                href={post.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-foreground/20 hover:shadow-md"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-medium text-foreground leading-snug transition-colors group-hover:text-foreground">
                                        {post.title}
                                    </h3>
                                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                    {post.summary}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                                    <span>{post.date}</span>
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                                    <span>{post.readTime}</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* View All Link */}
                    <div className="flex justify-center">
                        <Link
                            href="https://blog.example.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            View all posts
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
