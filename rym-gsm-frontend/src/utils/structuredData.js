// Structured Data Helper for SEO
// Generates Schema.org JSON-LD markup

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RYM GSM Nabeul",
    "alternateName": "RYM GSM",
    "image": "https://rymgsm.com/images/phones/rymgsmlogo.png",
    "logo": "https://rymgsm.com/images/phones/rymgsmlogo.png",
    "description": "Boutique spécialisée en téléphones et smartphones à Nabeul, Tunisie. Samsung, iPhone, Xiaomi, OPPO, Honor. Prix compétitifs, livraison rapide, garantie officielle.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "126, Avenue Habib Bourguiba",
      "addressLocality": "Nabeul",
      "addressRegion": "Nabeul",
      "postalCode": "8000",
      "addressCountry": "TN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "36.456389",
      "longitude": "10.735556"
    },
    "url": "https://rymgsm.com",
    "telephone": "+21626419140",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/rymgsm",
      "https://www.instagram.com/rym.gsm.nabeul"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
};

export const generateWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RYM GSM Nabeul",
    "alternateName": "RYM GSM",
    "url": "https://rymgsm.com",
    "description": "Boutique en ligne spécialisée en téléphones et smartphones en Tunisie. Samsung, iPhone, Xiaomi, OPPO, Honor. Prix compétitifs, livraison rapide partout en Tunisie.",
    "inLanguage": ["fr-TN", "ar-TN", "fr"],
    "publisher": {
      "@type": "LocalBusiness",
      "name": "RYM GSM Nabeul"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://rymgsm.com/products?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateProductSchema = (product) => {
  if (!product) return null;
  
  const images = Array.isArray(product.images) 
    ? product.images.map(img => `https://rymgsm.com${img}`)
    : product.images 
      ? [`https://rymgsm.com${product.images}`]
      : ["https://rymgsm.com/images/phones/rymgsmlogo.png"];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": images,
    "description": product.description || `${product.name} disponible chez RYM GSM Nabeul. Meilleur prix en Tunisie, livraison rapide, garantie officielle.`,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "RYM GSM"
    },
    "sku": product.id?.toString(),
    "mpn": product.id?.toString(),
    "category": product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "Téléphone",
    "offers": {
      "@type": "Offer",
      "url": `https://rymgsm.com/products/${product.id}`,
      "priceCurrency": "TND",
      "price": product.price?.toString() || "0",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "RYM GSM Nabeul"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "TND"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "TN"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 3,
            "unitCode": "DAY"
          }
        }
      }
    }
  };

  // Add aggregate rating if available
  if (product.rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": product.rating.toString(),
      "reviewCount": (product.review_count || 1).toString(),
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  // Add specifications if available
  if (product.specs) {
    const specs = typeof product.specs === 'string' 
      ? JSON.parse(product.specs || '{}') 
      : (product.specs || {});
    
    schema.additionalProperty = [];
    
    if (specs.ram) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "RAM",
        "value": specs.ram
      });
    }
    if (specs.storage) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "Stockage",
        "value": specs.storage
      });
    }
    if (specs.battery) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "Batterie",
        "value": specs.battery
      });
    }
    if (specs.camera) {
      schema.additionalProperty.push({
        "@type": "PropertyValue",
        "name": "Caméra",
        "value": specs.camera
      });
    }
  }

  return schema;
};

export const generateBreadcrumbSchema = (items) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateItemListSchema = (products, listName = "Produits") => {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listName,
    "description": `${listName} disponibles chez RYM GSM Nabeul`,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "url": `https://rymgsm.com/products/${product.id}`,
        "image": product.images?.[0] 
          ? `https://rymgsm.com${product.images[0]}` 
          : "https://rymgsm.com/images/phones/rymgsmlogo.png",
        "offers": {
          "@type": "Offer",
          "priceCurrency": "TND",
          "price": product.price?.toString() || "0",
          "availability": product.stock > 0 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock"
        }
      }
    }))
  };
};

export const generateFAQSchema = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateReviewSchema = (reviews) => {
  if (!reviews || reviews.length === 0) return null;
  
  return reviews.map(review => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": review.user_name || "Client"
    },
    "datePublished": review.created_at || new Date().toISOString(),
    "reviewBody": review.comment || "",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.rating?.toString() || "5",
      "bestRating": "5",
      "worstRating": "1"
    }
  }));
};

