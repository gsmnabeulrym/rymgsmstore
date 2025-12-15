import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "RYM GSM Nabeul - Téléphones, Smartphones & Accessoires en Tunisie | Meilleur Prix",
  description = "RYM GSM Nabeul - Votre boutique spécialisée en téléphones et smartphones en Tunisie. Samsung, iPhone, Xiaomi, OPPO, Honor. Prix compétitifs, livraison rapide partout en Tunisie, garantie officielle. Magasin à Nabeul.",
  keywords = "RYM GSM, téléphones Nabeul, smartphones Tunisie, vente téléphone Nabeul, Samsung Tunisie, iPhone Tunisie, Xiaomi Tunisie, OPPO Tunisie, téléphone pas cher Tunisie, accessoires mobile Tunisie, boutique téléphone Nabeul, GSM Nabeul, mobile Tunisie, smartphone prix Tunisie, acheter téléphone Nabeul, magasin téléphone Tunisie, vente smartphone Tunisie, téléphone occasion Tunisie",
  image = "https://rymgsm.com/images/phones/rymgsmlogo.png",
  url = "https://rymgsm.com",
  type = "website",
  structuredData = null,
  noindex = false,
  nofollow = false,
  author = "RYM GSM Nabeul",
  publishedTime = null,
  modifiedTime = null,
  locale = "fr_TN",
  alternateLocales = []
}) => {
  const siteName = "RYM GSM Nabeul";
  const siteUrl = "https://rymgsm.com";
  const fullTitle = title.includes('RYM GSM') ? title : `${title} | ${siteName}`;
  const currentDate = new Date().toISOString();
  
  // Enhanced keywords with location targeting
  const enhancedKeywords = `${keywords}, téléphone Tunisie, smartphone Tunisie, Nabeul Tunisie, magasin Nabeul, boutique mobile Tunisie, vente mobile Tunisie, réparation téléphone Nabeul`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang="fr" />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={enhancedKeywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={`${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`} />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      <meta name="geo.region" content="TN-21" />
      <meta name="geo.placename" content="Nabeul, Tunisia" />
      <meta name="geo.position" content="36.456389;10.735556" />
      <meta name="ICBM" content="36.456389, 10.735556" />
      <link rel="canonical" href={url} />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="fr-TN" />
      <link rel="alternate" hreflang="fr-TN" href={url} />
      <link rel="alternate" hreflang="fr" href={url} />
      <link rel="alternate" hreflang="ar-TN" href={url} />
      <link rel="alternate" hreflang="x-default" href={url} />
      {alternateLocales.map((locale, index) => (
        <link key={index} rel="alternate" hreflang={locale.code} href={locale.url} />
      ))}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      <meta property="og:locale:alternate" content="ar_TN" />
      <meta property="article:author" content={author} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === "product" && (
        <>
          <meta property="product:price:amount" content="" />
          <meta property="product:price:currency" content="TND" />
          <meta property="product:availability" content="in stock" />
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={fullTitle} />
      <meta name="twitter:site" content="@rymgsm" />
      <meta name="twitter:creator" content="@rymgsm" />
      <meta name="twitter:domain" content="rymgsm.com" />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      <meta name="application-name" content={siteName} />
      <meta name="msapplication-TileColor" content="#6366f1" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Mobile Optimization */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="320" />
      <meta name="format-detection" content="telephone=yes" />

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        Array.isArray(structuredData) ? (
          structuredData.map((data, index) => {
            // Clean undefined values from schema
            const cleanData = JSON.parse(JSON.stringify(data));
            return (
              <script key={index} type="application/ld+json">
                {JSON.stringify(cleanData, null, 0)}
              </script>
            );
          })
        ) : (
          <script type="application/ld+json">
            {JSON.stringify(structuredData, null, 0)}
          </script>
        )
      )}

      {/* DNS Prefetch and Preconnect for Performance */}
      <link rel="dns-prefetch" href="https://rymgsm.com" />
      <link rel="preconnect" href="https://rymgsm.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
    </Helmet>
  );
};

export default SEO;