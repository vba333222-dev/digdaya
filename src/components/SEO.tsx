import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
}

/**
 * Shared SEO component for per-page `<title>` and `<meta>` tags.
 * Usage: `<SEO title="About" description="…" />`
 */
export function SEO({ title, description }: SEOProps) {
    const fullTitle = title
        ? `${title} — Digdaya Teknokraf`
        : 'Digdaya Teknokraf — Engineering the Physical Frontier';

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
        </Helmet>
    );
}
