import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export function SEO({ 
  title = 'TabSplitr - Split Expenses with Friends | Free Expense Tracker',
  description = 'Split expenses easily with friends on trips, dinners, and group activities. Track who paid what, calculate balances, and settle debts. No accounts required!',
  image = 'https://split-easy-nine.vercel.app/tabsplitr-social.svg',
  url = 'https://split-easy-nine.vercel.app/',
  type = 'website'
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) || 
                   document.querySelector(`meta[name="${property}"]`);
      
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', url);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', url);
      document.head.appendChild(canonical);
    }
    
    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('og:type', type);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:url', url);
    
  }, [title, description, image, url, type]);

  return null; // This component doesn't render anything
}

// Predefined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: 'TabSplitr - Split Expenses with Friends | Free Expense Tracker',
    description: 'Split expenses easily with friends on trips, dinners, and group activities. Track who paid what, calculate balances, and settle debts. No accounts required!',
    url: 'https://split-easy-nine.vercel.app/'
  },
  trips: {
    title: 'My Trips - TabSplitr | Manage Your Group Expenses',
    description: 'View and manage all your trips and group expenses. Track spending, calculate balances, and settle debts with friends easily.',
    url: 'https://split-easy-nine.vercel.app/trips'
  },
  tripDetail: (tripName: string) => ({
    title: `${tripName} - Trip Details | TabSplitr`,
    description: `View expenses, balances, and settlements for ${tripName}. Track who paid what and calculate fair splits for your group.`,
    url: 'https://split-easy-nine.vercel.app/trips/'
  }),
  notFound: {
    title: 'Page Not Found - TabSplitr',
    description: 'The page you are looking for does not exist. Return to TabSplitr to continue splitting expenses with friends.',
    url: 'https://split-easy-nine.vercel.app/404'
  }
};
