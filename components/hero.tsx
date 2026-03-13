"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Mail, Linkedin, ArrowRight, MapPin } from "lucide-react";
import { heroProfile, heroIntro, heroContacts, heroCtas } from "@/content/hero";

export function Hero() {
    return (
        <section
            id="about"
            className="mx-auto max-w-5xl px-6 py-24 md:py-32 lg:py-40"
        >
            <div className="flex flex-col gap-12">
                {/* Avatar - Now at the top */}
                <div
                    className="flex justify-start opacity-0 animate-fade-up"
                    style={{ animationFillMode: "forwards" }}
                >
                    <div className="relative">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-foreground/5 to-foreground/10 blur-xl" />
                        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-border/50 bg-muted">
                            <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground/20 select-none">
                                {heroProfile.initials}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-8 md:max-w-2xl">
                    <div
                        className="flex flex-col gap-4 opacity-0 animate-fade-up animation-delay-100"
                        style={{ animationFillMode: "forwards" }}
                    >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{heroProfile.location}</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-emerald-600 dark:text-emerald-400">
                                {heroProfile.statusText}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                            {heroProfile.title}
                        </h1>
                    </div>

                    <p
                        className="text-lg text-muted-foreground leading-relaxed text-pretty opacity-0 animate-fade-up animation-delay-200"
                        style={{ animationFillMode: "forwards" }}
                    >
                        {heroIntro}
                    </p>

                    {/* Contact Links */}
                    <div
                        className="flex flex-wrap items-center gap-6 opacity-0 animate-fade-up animation-delay-300"
                        style={{ animationFillMode: "forwards" }}
                    >
                        {heroContacts.map((contact) => {
                            const Icon =
                                contact.type === "email"
                                    ? Mail
                                    : contact.type === "github"
                                      ? Github
                                      : contact.type === "linkedin"
                                        ? Linkedin
                                        : Mail;

                            const isExternal = contact.type !== "email";

                            return (
                                <Link
                                    key={contact.label}
                                    href={contact.href}
                                    target={isExternal ? "_blank" : undefined}
                                    rel={
                                        isExternal
                                            ? "noopener noreferrer"
                                            : undefined
                                    }
                                    className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    <Icon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                                    {contact.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* CTA Buttons */}
                    <div
                        className="flex flex-wrap gap-4 pt-2 opacity-0 animate-fade-up animation-delay-400"
                        style={{ animationFillMode: "forwards" }}
                    >
                        {heroCtas.map((cta) => {
                            const isPrimary = cta.variant === "primary";
                            const Icon =
                                cta.icon === "github" ? Github : ArrowRight;

                            return (
                                <Button
                                    key={cta.label}
                                    asChild
                                    size="lg"
                                    className={isPrimary ? "group" : undefined}
                                    variant={isPrimary ? "default" : "outline"}
                                >
                                    <Link
                                        href={cta.href}
                                        target={
                                            cta.icon === "github"
                                                ? "_blank"
                                                : undefined
                                        }
                                        rel={
                                            cta.icon === "github"
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                        className="gap-2"
                                    >
                                        {cta.label}
                                        <Icon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
