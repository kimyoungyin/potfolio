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
        title: "식품생명공학과 졸업",
        institution: "동국대학교(서울)",
        period: "2018.02 ~ 2023.07",
    },
];

export const certificationList: CertificationItem[] = [];

export const trainingList: TrainingItem[] = [];
