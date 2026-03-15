export const skillCategories: { name: string; skills: string[] }[] = [
    {
        name: "Languages",
        skills: ["TypeScript", "JavaScript (ES6+)"],
    },
    {
        name: "Frontend",
        skills: ["React", "Next.js (App Router)", "HTML5", "CSS3"],
    },
    {
        name: "Styling",
        skills: ["Tailwind CSS", "Styled Components", "shadcn/ui", "Radix UI"],
    },
    {
        name: "Data / State",
        skills: ["TanStack Query (React Query)", "Zustand", "Redux Toolkit"],
    },
    {
        name: "Backend / DB",
        skills: ["Supabase", "MySQL (AWS RDS)"],
    },
    {
        name: "Testing",
        skills: ["Vitest", "React Testing Library (RTL)", "Playwright"],
    },
    {
        name: "DevOps / Tools",
        skills: [
            "Git",
            "GitHub",
            "Vercel",
            "AWS S3",
            "ESLint",
            "Prettier",
            "Husky",
            "lint-staged",
        ],
    },
] as const;
