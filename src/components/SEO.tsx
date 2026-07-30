import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
}

const DEFAULT_TITLE = 'ZTech Electronics - Professional ICT Solutions in Kenya';
const DEFAULT_DESCRIPTION =
  'ZTech Electronics Ltd. offers professional ICT solutions including web development, phone & laptop repair, CCTV installation, networking, smart home automation, and more across Kenya.';

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'ICT solutions Kenya, phone repair, laptop repair, CCTV installation, web development, networking, smart home, ZTech Electronics',
  ogImage = '/ZTech electrictronics logo.png',
  ogUrl,
  ogType = 'website',
}) => {
  const fullTitle = title ? `${title} | ZTech Electronics` : DEFAULT_TITLE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogUrl && <meta property="og:url" content={ogUrl} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </Helmet>
  );
};

export default SEO;
