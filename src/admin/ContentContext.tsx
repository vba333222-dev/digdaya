import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import {
    type SiteContent,
    type HomeService,
    type DetailedService,
    type Project,
    type HeroContent,
    type SiteSettings,
    type Message,
    defaultSiteContent,
} from './siteContent';

// ── localStorage key ──
const STORAGE_KEY = 'DIGDAYA_CMS_CONTENT';

// ── Load from localStorage (merge with defaults for forward-compat) ──
function loadContent(): SiteContent {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as Partial<SiteContent>;
            return { ...defaultSiteContent, ...parsed };
        }
    } catch {
        // corrupted data — fall back to defaults
    }
    return { ...defaultSiteContent };
}

function saveContent(content: SiteContent) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {
        // quota exceeded — silently fail
    }
}

// ── Context shape ──
interface ContentContextType {
    content: SiteContent;

    // Mutations
    updateHomeServices: (services: HomeService[]) => void;
    updateServices: (services: DetailedService[]) => void;
    updateProjects: (projects: Project[]) => void;
    updateHero: (hero: HeroContent) => void;
    updateSettings: (settings: SiteSettings) => void;
    updateMessages: (messages: Message[]) => void;

    // Utility
    resetToDefaults: () => void;
}

const ContentContext = createContext<ContentContextType | null>(null);

// ── Provider ──
export function ContentProvider({ children }: { children: ReactNode }) {
    const [content, setContent] = useState<SiteContent>(loadContent);

    // Persist on every change
    useEffect(() => {
        saveContent(content);
    }, [content]);

    const update = useCallback((patch: Partial<SiteContent>) => {
        setContent(prev => ({ ...prev, ...patch }));
    }, []);

    const ctx: ContentContextType = {
        content,
        updateHomeServices: useCallback((homeServices) => update({ homeServices }), [update]),
        updateServices: useCallback((services) => update({ services }), [update]),
        updateProjects: useCallback((projects) => update({ projects }), [update]),
        updateHero: useCallback((hero) => update({ hero }), [update]),
        updateSettings: useCallback((settings) => update({ settings }), [update]),
        updateMessages: useCallback((messages) => update({ messages }), [update]),
        resetToDefaults: useCallback(() => {
            setContent({ ...defaultSiteContent });
            localStorage.removeItem(STORAGE_KEY);
        }, []),
    };

    return <ContentContext.Provider value={ctx}>{children}</ContentContext.Provider>;
}

// ── Hook ──
export function useContent(): ContentContextType {
    const ctx = useContext(ContentContext);
    if (!ctx) throw new Error('useContent must be used within <ContentProvider>');
    return ctx;
}
