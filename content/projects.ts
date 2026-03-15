import type { CaseStudy, Project } from "./types";

const placeholderCaseStudy: CaseStudy = {
    problem:
        "Problem placeholder — 실제 내용을 입력해주세요.",
    investigation:
        "Investigation placeholder — 실제 내용을 입력해주세요.",
    solution:
        "Solution placeholder — 실제 내용을 입력해주세요.",
    implementation: {
        description:
            "Implementation placeholder — 실제 내용을 입력해주세요.",
    },
    impact: {
        metrics: [
            { label: "Metric 1", value: "—", description: "placeholder" },
            { label: "Metric 2", value: "—", description: "placeholder" },
        ],
        summary: "Impact summary placeholder — 실제 내용을 입력해주세요.",
    },
};

export const projects: Project[] = [
    {
        title: "Harvesters-LALA",
        duration: "2026.01 ~ 진행 중",
        teamSize: "팀 프로젝트 (6명)",
        description:
            "댓글 수집 및 AI 분석을 기반으로, 사용자의 추가 관여 없이 평판을 자동 수집·분석·관리하는 B2B 웹 서비스입니다.",
        features: [
            "Feature placeholder 1",
            "Feature placeholder 2",
            "Feature placeholder 3",
        ],
        techStack: [
            "Next.js 15",
            "React 18",
            "TypeScript 5",
            "TanStack Query 5",
            "Zustand 4",
            "Axios",
            "Tailwind CSS",
            "Radix UI",
            "ESLint 9",
            "Husky",
        ],
        liveUrl: "https://lala.harvester.kr",
        githubUrl: "",
        challenges: [
            {
                title: "Challenge placeholder 1",
                summary: "Challenge summary placeholder 1",
                caseStudy: placeholderCaseStudy,
            },
            {
                title: "Challenge placeholder 2",
                summary: "Challenge summary placeholder 2",
                caseStudy: placeholderCaseStudy,
            },
            {
                title: "Challenge placeholder 3",
                summary: "Challenge summary placeholder 3",
                caseStudy: placeholderCaseStudy,
            },
        ],
    },
    {
        title: "Myblog",
        duration: "2025.08 ~ 2025.09",
        teamSize: "개인 프로젝트 (100%)",
        description:
            '"다른 사람은 읽을 수 있지만, 업로드는 나만 가능한" 콘셉트의 기술 블로그로, 해시태그 기반 분류·검색을 직접 구현해 내가 쓴 글을 위키처럼 빠르게 다시 찾을 수 있도록 설계한 서비스입니다.',
        features: [
            "Feature placeholder 1",
            "Feature placeholder 2",
            "Feature placeholder 3",
        ],
        techStack: [
            "Next.js 15",
            "React 19",
            "TypeScript 5",
            "TanStack Query 5",
            "Zustand 5",
            "Supabase (PostgreSQL/Auth/Storage)",
            "Tailwind CSS 4",
            "shadcn/ui",
            "Zod",
        ],
        liveUrl: "https://myblog-navy-kappa.vercel.app",
        githubUrl: "https://github.com/kimyoungyin/myblog",
        challenges: [
            {
                title: "Challenge placeholder 1",
                summary: "Challenge summary placeholder 1",
                caseStudy: placeholderCaseStudy,
            },
            {
                title: "Challenge placeholder 2",
                summary: "Challenge summary placeholder 2",
                caseStudy: placeholderCaseStudy,
            },
            {
                title: "Challenge placeholder 3",
                summary: "Challenge summary placeholder 3",
                caseStudy: placeholderCaseStudy,
            },
        ],
    },
    {
        title: "승룡이네집 도서 검색 시스템",
        duration: "2025.03 ~ 2025.04",
        teamSize: "개인 프로젝트 (100%)",
        description:
            "군 복무 중 700~800권 규모 도서에 대한 검색 시스템이 없고 수기·분산 관리로 자료와 실제 위치가 어긋나던 문제를 해결하기 위해 개발한 도서 위치 안내 서비스입니다.",
        features: [
            "Feature placeholder 1",
            "Feature placeholder 2",
            "Feature placeholder 3",
        ],
        techStack: [
            "Next.js 15",
            "React 19",
            "TypeScript",
            "Tailwind CSS",
            "MySQL (AWS RDS)",
            "AWS S3",
            "Vercel",
        ],
        liveUrl: "https://seongryung.vercel.app",
        githubUrl: "https://github.com/kimyoungyin/seongryung",
        challenges: [
            {
                title: "Challenge placeholder 1",
                summary: "Challenge summary placeholder 1",
                caseStudy: placeholderCaseStudy,
            },
            {
                title: "Challenge placeholder 2",
                summary: "Challenge summary placeholder 2",
                caseStudy: placeholderCaseStudy,
            },
            {
                title: "Challenge placeholder 3",
                summary: "Challenge summary placeholder 3",
                caseStudy: placeholderCaseStudy,
            },
        ],
    },
] as const;
