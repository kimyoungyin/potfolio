export interface DiagramPair {
    before?: string;
    after?: string;
}

/** 타임라인(Problem / Investigation / Solution) 카드에 붙이는 코드 증거 */
export interface CaseStudyCodeEvidence {
    caption?: string;
    codeSnippet: string;
    codeLanguage?: string;
}

export interface CaseStudy {
    problem: string[];
    problemDiagram?: DiagramPair;
    problemCode?: CaseStudyCodeEvidence;
    investigation: string[];
    investigationDiagram?: DiagramPair;
    investigationCode?: CaseStudyCodeEvidence;
    solution: string[];
    solutionDiagram?: DiagramPair;
    solutionCode?: CaseStudyCodeEvidence;
    /** Architecture 다이어그램 위에 표시하는 한 줄 요약(선택) */
    architectureIntro?: string;
    diagram?: DiagramPair;
    implementation: {
        description: string[];
        codeSnippet?: string;
        codeLanguage?: string;
    };
    impact: {
        metrics: { label: string; value: string; description?: string[] }[];
        summary: string[];
    };
}

export interface Challenge {
    title: string;
    summary: string;
    caseStudy: CaseStudy;
}

export interface Project {
    title: string;
    duration: string;
    teamSize: string;
    description: string;
    images: string[];
    /** private 저장소/서비스 등 공개 제약 여부 */
    isPrivate?: boolean;
    features: string[];
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
    challenges: Challenge[];
}
