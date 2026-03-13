export interface CaseStudy {
    problem: string;
    investigation: string;
    solution: string;
    implementation: {
        description: string;
        codeSnippet?: string;
        codeLanguage?: string;
    };
    impact: {
        metrics: { label: string; value: string; description?: string }[];
        summary: string;
    };
}

export interface Project {
    title: string;
    duration: string;
    teamSize: string;
    description: string;
    features: string[];
    challengeSummary: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
    caseStudy: CaseStudy;
}
