import { Mail, Github, LucideIcon } from "lucide-react";

export const heroProfile = {
    initials: "YY",
    name: "김영인",
    title: `Frontend Developer`,
    location: "서울 강동구",
    statusText: "구직 중",
    photoUrl: "/images/profile.jpeg",
} as const;

const intro = [
    "기술의 가치는 사용자의 편의성에서 완성된다고 믿으며, 더 나은 UX를 위해 코드의 품질과 성능을 끊임없이 의심하고 개선합니다.",
    "데이터 중심의 사고로 복잡한 문제를 최적화하고 견고한 설계를 더해, 서비스의 지속 가능한 성장을 뒷받침하는 단단한 환경을 만듭니다.",
] as const;

export const heroIntro = intro.join(" ");

export type HeroContactType = "email" | "github" | "linkedin" | "other";

export interface HeroContact {
    label: string;
    href: string;
    type: HeroContactType;
    icon: LucideIcon;
}

export const heroContacts: HeroContact[] = [
    {
        label: "yin199859@gmail.com",
        href: "mailto:yin199859@gmail.com",
        type: "email",
        icon: Mail,
    },
    {
        label: "GitHub",
        href: "https://github.com/kimyoungyin",
        type: "github",
        icon: Github,
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
] as const;
