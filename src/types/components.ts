import { ReactNode } from 'react';

// Component Props Types
export interface CardSkillsProps {
    image: string;
    text: string;
}

export interface CardProjectsProps {
    image: string;
    title: string;
    subtitle: string;
    link: string;
    tecImg: ReactNode | ReactNode[];
}

// Layout Types
export interface RootLayoutProps {
    children: ReactNode;
}
