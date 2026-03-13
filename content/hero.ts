export const heroProfile = {
    initials: "AC",
    name: "Alex",
    title: "Frontend Developer",
    location: "San Francisco, CA",
    statusText: "Available for work",
} as const;

export const heroIntro =
    "I build accessible, pixel-perfect user interfaces that blend thoughtful design with robust engineering. Focused on creating experiences that are fast, beautiful, and built to last." as const;

export type HeroContactType = "email" | "github" | "linkedin" | "other";

export interface HeroContact {
    label: string;
    href: string;
    type: HeroContactType;
}

export const heroContacts: HeroContact[] = [
    {
        label: "alex@example.com",
        href: "mailto:alex@example.com",
        type: "email",
    },
    {
        label: "GitHub",
        href: "https://github.com",
        type: "github",
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com",
        type: "linkedin",
    },
] as const;

export type HeroCtaVariant = "primary" | "outline";

export type HeroCtaIcon = "arrowRight" | "github";

export interface HeroCta {
    label: string;
    href: string;
    variant: HeroCtaVariant;
    icon: HeroCtaIcon;
}

export const heroCtas: HeroCta[] = [
    {
        label: "View Projects",
        href: "#projects",
        variant: "primary",
        icon: "arrowRight",
    },
    {
        label: "GitHub",
        href: "https://github.com",
        variant: "outline",
        icon: "github",
    },
] as const;
