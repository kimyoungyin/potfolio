export interface EducationItem {
    type: "degree" | "other";
    title: string;
    institution: string;
    period: string;
    description?: string;
}

export interface CertificationItem {
    title: string;
    issuer: string;
    year: string;
}

export interface TrainingItem {
    title: string;
    organization: string;
    period: string;
    description?: string;
}

export const educationList: EducationItem[] = [
    {
        type: "degree",
        title: "Bachelor of Science in Computer Science",
        institution: "State University",
        period: "2019 - 2023",
        description: "Focus on software engineering and web technologies",
    },
] as const;

export const certificationList: CertificationItem[] = [
    {
        title: "Meta Frontend Developer Professional Certificate",
        issuer: "Coursera",
        year: "2023",
    },
    {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        year: "2023",
    },
] as const;

export const trainingList: TrainingItem[] = [
    {
        title: "Frontend Development Bootcamp",
        organization: "CodeCamp",
        period: "2023",
        description:
            "Intensive 12-week program focused on React and modern JavaScript",
    },
] as const;
