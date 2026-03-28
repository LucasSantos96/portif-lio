import { ReactNode } from 'react';

// Component Props Types
export interface CardSkillsProps {
    icon: ReactNode;
    text: string;
}

export interface CardProjectsProps {
    image: string;
    title: string;
    subtitle: string;
    link: string;
    tecImg: ReactNode | ReactNode[];
}

export interface PortfolioProject {
    id: number;
    title: string;
    description: string;
    projectUrl: string;
    imageUrl: string;
    technologies: string[];
    githubRepo: string | null;
    source: "manual" | "github";
    published: boolean;
    sortOrder: number;
    createdAt: string;
}

export interface NewPortfolioProjectInput {
    title: string;
    description: string;
    projectUrl: string;
    imageUrl: string;
    technologies: string[];
    githubRepo?: string | null;
    source?: "manual" | "github";
    published?: boolean;
    sortOrder?: number;
}

// Layout Types
export interface RootLayoutProps {
    children: ReactNode;
}
