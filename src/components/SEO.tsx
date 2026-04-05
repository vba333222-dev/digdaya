import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

export const SEO = ({
    title = 'Digdaya Teknokraf | Engineering the Digital & Physical Frontier',
    description = 'Multi-disciplinary industrial and digital engineering conglomerate.',
    image = 'https://res.cloudinary.com/jh12t0xdsqheie36vvq7/image/upload/q_auto:best/digdaya-og.jpg', // Placeholder image URL from Cloudinary cloud name provided previously or fallback
    url = 'https://www.digdayateknokraf.com'
}: SEOProps) => {
    const schemaOrg = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Digdaya Teknokraf Indonesia',
        url: 'https://www.digdayateknokraf.com',
        logo: 'https://www.digdayateknokraf.com/logo.png', // Ideally point to an absolute real logo path
        description: 'Multi-disciplinary industrial and digital engineering conglomerate.',
    };

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* Open Graph tags */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter Card tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Schema Markup */}
            <script type="application/ld+json">
                {JSON.stringify(schemaOrg)}
            </script>
        </Helmet>
    );
};
