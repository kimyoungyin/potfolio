import Link from "next/link";
import { Button } from "@/components/ui/button";
import { heroContacts, heroProfile } from "@/content/hero";

export function Footer() {
    return (
        <footer className="border-t border-border/60 bg-section-alt">
            <div className="mx-auto max-w-5xl px-6 py-16">
                {/* Bottom Section */}
                <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} {heroProfile.name}
                    </p>

                    {/* Links */}
                    <div className="flex items-center gap-1">
                        {heroContacts.map((contact) => (
                            <Button
                                key={contact.label}
                                variant="ghost"
                                size="icon"
                                asChild
                                className="h-9 w-9 rounded-full"
                            >
                                {contact.type === "email" ? (
                                    <Link
                                        href={contact.href}
                                        aria-label={contact.label}
                                    >
                                        <contact.icon className="h-4 w-4" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={contact.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={contact.label}
                                    >
                                        <contact.icon className="h-4 w-4" />
                                    </Link>
                                )}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
