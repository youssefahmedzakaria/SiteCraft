export interface Policy {
    id: string;
    title: string;
    content: string;
    lastUpdated: string;
    status: 'Active' | 'Draft';
  }
  
  export interface AboutSection {
    id: string;
    title: string;
    content: string;
    type: 'Text' | 'Image' | 'Mission' | 'Team' | 'History';
    status: 'Visible' | 'Hidden';
  }
  
  // Sample policies data
  export const policies: Policy[] = [
    {
      id: "POL-001",
      title: "Return Policy",
      content: "We offer a 30-day return policy for all unused and unopened items. Please contact our customer service team to initiate a return.",
      lastUpdated: "2025-03-15",
      status: "Active"
    },
    {
      id: "POL-002",
      title: "Shipping Policy",
      content: "Orders are typically processed within 1-2 business days. Standard shipping takes 3-5 business days. Express shipping options are available at checkout.",
      lastUpdated: "2025-03-10",
      status: "Active"
    },
    {
      id: "POL-003",
      title: "Privacy Policy",
      content: "We respect your privacy and are committed to protecting your personal information. Please review our full privacy policy for details on how we collect and use your data.",
      lastUpdated: "2025-02-28",
      status: "Active"
    },
    {
      id: "POL-004",
      title: "Terms of Service",
      content: "By using our website and services, you agree to comply with our terms of service. Please read the full terms for details on acceptable use and limitations.",
      lastUpdated: "2025-01-20",
      status: "Active"
    },
    {
      id: "POL-005",
      title: "Cookie Policy",
      content: "We use cookies to enhance your browsing experience. This policy explains how we use cookies and similar technologies.",
      lastUpdated: "2025-04-01",
      status: "Draft"
    }
  ];
  
  // Sample about sections data
  export const aboutSections: AboutSection[] = [
    {
      id: "ABOUT-001",
      title: "Our Story",
      content: "Founded in 2020, SiteCraft began with a simple mission: to help small businesses establish a powerful online presence without the complexity and high costs typically associated with web development.",
      type: "History",
      status: "Visible"
    },
    {
      id: "ABOUT-002",
      title: "Our Mission",
      content: "We're dedicated to democratizing web development by providing intuitive, powerful tools that enable businesses of all sizes to create professional websites that drive growth.",
      type: "Mission",
      status: "Visible"
    },
    {
      id: "ABOUT-003",
      title: "Meet Our Team",
      content: "Our diverse team of developers, designers, and customer success specialists work together to ensure you have the best experience building your online presence.",
      type: "Team",
      status: "Visible"
    },
    {
      id: "ABOUT-004",
      title: "Company Values",
      content: "Innovation, accessibility, and customer satisfaction form the core values that drive everything we do at SiteCraft.",
      type: "Text",
      status: "Hidden"
    },
    {
      id: "ABOUT-005",
      title: "Office Location",
      content: "Our headquarters are located in the heart of the tech district in San Francisco, with satellite offices in New York, London, and Singapore.",
      type: "Text",
      status: "Visible"
    }
  ];