export interface DiagramPair {
    before?: string;
    after?: string;
}

export interface CaseStudy {
    problem: string[];
    problemDiagram?: DiagramPair;
    investigation: string[];
    investigationDiagram?: DiagramPair;
    solution: string[];
    solutionDiagram?: DiagramPair;
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
    features: string[];
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
    challenges: Challenge[];
}
