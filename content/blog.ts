export interface BlogPost {
    title: string;
    summary: string;
    url: string;
    date: string;
    readTime: string;
}

export const blogUrl = "https://myblog-navy-kappa.vercel.app";

export const blogPosts: BlogPost[] = [
    {
        title: "Building Performant React Applications with Virtualization",
        summary:
            "How I improved rendering performance by 90% using windowing techniques and react-window in a task management app.",
        url: `${blogUrl}/react-virtualization`,
        date: "Feb 2024",
        readTime: "8 min read",
    },
    {
        title: "A Deep Dive into Next.js App Router",
        summary:
            "Exploring the new App Router paradigm, server components, and how to structure modern Next.js applications.",
        url: `${blogUrl}/nextjs-app-router`,
        date: "Jan 2024",
        readTime: "12 min read",
    },
    {
        title: "Implementing Dark Mode the Right Way",
        summary:
            "Best practices for implementing dark mode with CSS custom properties, system preferences, and smooth transitions.",
        url: `${blogUrl}/dark-mode`,
        date: "Nov 2023",
        readTime: "6 min read",
    },
    {
        title: "TypeScript Tips for React Developers",
        summary:
            "Practical TypeScript patterns and utilities that will make your React code more type-safe and maintainable.",
        url: `${blogUrl}/typescript-react`,
        date: "Sep 2023",
        readTime: "10 min read",
    },
] as const;
