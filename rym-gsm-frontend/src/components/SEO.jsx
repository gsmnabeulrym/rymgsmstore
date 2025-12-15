import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "RYM GSM Nabeul - Téléphones, Smartphones & Accessoires en Tunisie",
  description = "RYM GSM Nabeul - Votre boutique spécialisée en téléphones et smartphones en Tunisie. Samsung, iPhone, Xiaomi, OPPO. Prix compétitifs, livraison rapide, garantie officielle.",
  keywords = "RYM GSM, téléphones Nabeul, smartphones Tunisie, vente téléphone, Samsung Tunisie, iPhone Tunisie, Xiaomi, OPPO, téléphone pas cher, accessoires mobile, boutique téléphone Nabeul, GSM Nabeul, mobile Tunisie",
  image = "https://rymgsm.com/images/phones/rymgsmlogo.png",
  url = "https://rymgsm.com",
  type = "website",
  structuredData = null
}) => {
  const fullTitle = title.includes('RYM GSM') ? title : `${title} | RYM GSM Nabeul`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="RYM GSM Nabeul" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      {structuredData && (
        Array.isArray(structuredData) ? (
          structuredData.map((data, index) => (
            <script key={index} type="application/ld+json">
              {JSON.stringify(data)}
            </script>
          ))
        ) : (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )
      )}
    </Helmet>
  );
};

export default SEO;
