export interface BlogPost {
    title: string;
    summary: string;
    url: string;
    date: string;
    readTime: string;
}

export const blogPosts: BlogPost[] = [
    {
        title: "Building Performant React Applications with Virtualization",
        summary:
            "How I improved rendering performance by 90% using windowing techniques and react-window in a task management app.",
        url: "https://blog.example.com/react-virtualization",
        date: "Feb 2024",
        readTime: "8 min read",
    },
    {
        title: "A Deep Dive into Next.js App Router",
        summary:
            "Exploring the new App Router paradigm, server components, and how to structure modern Next.js applications.",
        url: "https://blog.example.com/nextjs-app-router",
        date: "Jan 2024",
        readTime: "12 min read",
    },
    {
        title: "Implementing Dark Mode the Right Way",
        summary:
            "Best practices for implementing dark mode with CSS custom properties, system preferences, and smooth transitions.",
        url: "https://blog.example.com/dark-mode",
        date: "Nov 2023",
        readTime: "6 min read",
    },
    {
        title: "TypeScript Tips for React Developers",
        summary:
            "Practical TypeScript patterns and utilities that will make your React code more type-safe and maintainable.",
        url: "https://blog.example.com/typescript-react",
        date: "Sep 2023",
        readTime: "10 min read",
    },
] as const;
