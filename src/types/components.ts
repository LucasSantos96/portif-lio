import { ReactNode } from 'react';

export interface PortfolioProject {
    id: number;
    title: string;
    description: string;
    titleEn: string | null;
    descriptionEn: string | null;
    projectUrl: string;
    imageUrl: string;
    galleryImages: string[];
    videoUrls: string[];
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
    galleryImages?: string[];
    videoUrls?: string[];
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
