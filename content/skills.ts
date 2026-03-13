export const skillCategories: { name: string; skills: string[] }[] = [
    {
        name: "Core",
        skills: ["JavaScript", "TypeScript", "React", "Next.js"],
    },
    {
        name: "Styling",
        skills: ["Tailwind CSS", "CSS Modules", "Styled Components"],
    },
    {
        name: "Tools",
        skills: ["Git", "GitHub", "Figma", "Vercel"],
    },
    {
        name: "Other",
        skills: ["REST APIs", "GraphQL", "Testing", "Accessibility"],
    },
] as const;
