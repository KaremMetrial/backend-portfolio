import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
  structuredData?: any;
  noIndex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Alex Rivera - Backend Engineer Portfolio",
  description = "Portfolio of Alex Rivera, Backend Engineer specializing in PHP, Laravel, and scalable API development.",
  keywords = ["Backend Engineer", "PHP Developer", "Laravel Developer", "API Developer", "Full Stack Developer"],
  canonicalUrl,
  ogImage = "https://picsum.photos/seed/portfolio/1200/630",
  ogType = "website",
  twitterHandle = "@alexriv_dev",
  structuredData,
  noIndex = false,
}) => {
  const siteUrl = "https://alexriviera.dev";
  const fullTitle = title.includes("Alex Rivera") ? title : `${title} | Alex Rivera`;
  
  // Default structured data for portfolio
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alex Rivera",
    url: siteUrl,
    image: "https://picsum.photos/seed/profile/400/400",
    sameAs: [
      "https://github.com/alexriv",
      "https://linkedin.com/in/alexriv",
      "https://twitter.com/alexriv_dev"
    ],
    jobTitle: "Backend Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Tech Company"
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University Name"
    },
    knowsAbout: ["PHP", "Laravel", "API Development", "Backend Architecture", "Database Design"]
  };

  const finalStructuredData = structuredData || defaultStructuredData;

  return (
    <>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />
      <meta name="author" content="Alex Rivera" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      
      {/* Robots Meta Tag */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || siteUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl || siteUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Alex Rivera Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags for Performance */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://api.alexriviera.dev" />
      
      {/* DNS Prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//api.alexriviera.dev" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Manifest for PWA */}
      <link rel="manifest" href="/manifest.json" />
    </>
  );
};

// Component for page-specific SEO
export const PageSEO: React.FC<{
  pageTitle: string;
  pageDescription?: string;
  pageKeywords?: string[];
  structuredData?: any;
}> = ({ pageTitle, pageDescription, pageKeywords, structuredData }) => {
  return (
    <SEO
      title={pageTitle}
      description={pageDescription}
      keywords={pageKeywords}
      structuredData={structuredData}
    />
  );
};

// Component for project-specific SEO
export const ProjectSEO: React.FC<{
  projectTitle: string;
  projectDescription: string;
  projectImage?: string;
  projectUrl?: string;
  technologies: string[];
}> = ({ projectTitle, projectDescription, projectImage, projectUrl, technologies }) => {
  const projectStructuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: projectTitle,
    description: projectDescription,
    image: projectImage,
    url: projectUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    keywords: technologies.join(", "),
    author: {
      "@type": "Person",
      name: "Alex Rivera"
    },
    datePublished: new Date().toISOString().split('T')[0],
    inLanguage: "en"
  };

  return (
    <SEO
      title={`${projectTitle} - Project`}
      description={projectDescription}
      keywords={technologies}
      ogImage={projectImage}
      ogType="article"
      structuredData={projectStructuredData}
    />
  );
};