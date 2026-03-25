export interface BlogPost {
    title: string;
    summary: string;
    url: string;
    date: string;
}

export const blogUrl = "https://myblog-navy-kappa.vercel.app";

export const blogPosts: BlogPost[] = [
    {
        title: "Singleton Promise 기반 JWT 유저 인증 기능 구현",
        summary:
            "Axios 인터셉터와 세션 검증 훅에서 발생하던 JWT refresh 이중 호출 Race Condition을 Singleton Promise로 단일화해, 토큰 갱신과 리다이렉트 과정의 불안정성을 제거했습니다.",
        url: `${blogUrl}/posts/145`,
        date: "Feb 2026",
    },
    {
        title: "인증과 Next.js (1): CORS 에러 제대로 이해하기 with Next.js",
        summary:
            "Next.js 환경에서 CORS 에러가 왜 발생하는지 Same-Origin Policy 관점으로 정리하고, Route Handler 프록시 등 해결 전략을 구조적으로 설명합니다.",
        url: `${blogUrl}/posts/146`,
        date: "Mar 2026",
    },
    {
        title: "TanStack Query 캐시 키 안정화로 댓글·증거 조회 성능 개선하기: 시나리오 토글 상태를 정렬 기반 집합으로 리팩토링",
        summary:
            "시나리오 토글 순서에 따라 TanStack Query queryKey가 달라져 캐시 분산/재요청이 늘어나는 문제를, 스토어 레벨에서 ID 집합을 정렬해 키를 안정화했습니다.",
        url: `${blogUrl}/posts/144`,
        date: "Feb 2026",
    },
    {
        title: "AppSidebar: 웹 접근성(WAI-ARIA) 준수 및 rAF 인터랙션 최적화",
        summary:
            "WAI-ARIA 역할과 키보드 핸들러로 접근성을 보강하고, mousemove에 rAF 기반 렌더 스케줄링을 적용해 사이드바 리사이즈 jank를 줄였습니다.",
        url: `${blogUrl}/posts/142`,
        date: "Feb 2026",
    },
] as const;
