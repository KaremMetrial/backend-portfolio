import { useState, useEffect } from 'react';

interface ContactData {
  email: string;
  phone: string | null;
  location: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  contactFormConfig: {
    enabled: boolean;
    fields: string[];
  } | null;
}

interface UseContactReturn {
  contact: ContactData | null;
  loading: boolean;
  error: string | null;
}

export const useContact = (): UseContactReturn => {
  const [contact, setContact] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://127.0.0.1:8000/api/contact');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform the API response to match our frontend types
        // Note: API resources already decode JSON, so no need to parse again
        const transformedContact: ContactData = {
          email: data.email,
          phone: data.phone,
          location: data.location,
          socialLinks: data.social_links,
          contactFormConfig: data.contact_form_config
        };
        
        setContact(transformedContact);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contact content');
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  return { contact, loading, error };
};