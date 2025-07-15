import { Smartphone, Laptop, Camera, Plug, Disc, BookOpen, Shield, Server, Globe, Cloud, Smartphone as MobileIcon, Home, Sun, Wifi, Cpu, Trash2, Monitor, ShoppingCart } from 'lucide-react';
import { Service, Category } from '@/types/service';

export const serviceImages = [
  "/phonere.jpg", // Phone & Tablet Repair
  "/laptop repair.jpg", // Laptop & Computer Repair
  "/cctvin.jpg", // CCTV Installation
  "/wiring-.webp", // Home & Office Wiring
  "/smart.jpg", // Software Solutions
  "/tech consult.webp", // Tech Consultation
  "/gamingc.jpg", // Gaming Console Repair
  "/smart.jpg", // Smart TV Setup & Repair
  "/printer re.jpg", // Printer & Peripheral Support
  "/network installation.jpg", // Network Installation
  // Aligned Unsplash images for new services
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // Data Recovery & Backup
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80", // Cybersecurity & Virus Removal
  "https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=800&q=80", // POS System Setup
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80", // Website Design & Hosting
  "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80", // Cloud Services & Migration
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80", // Mobile Device Management
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", // Smart Home Automation
  "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=800&q=80", // Solar Power & Inverter Installation
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80", // Networking for Events
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80", // Custom PC Building & Upgrades
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"  // E-Waste Recycling
];

export const services: Service[] = [
  {
    title: 'Web Design & Development',
    description: 'Custom website design, web app development, and e-commerce solutions.',
    category: 'software',
    icon: <Globe className="text-accent" size={40} />,
    features: ['Website Design', 'Web App Development', 'E-commerce', 'Responsive Design'],
    image: serviceImages[13],
    more: 'We build beautiful, fast, and secure websites and web applications for businesses and individuals.',
    price: 15000
  },
  {
    title: 'Software Development',
    description: 'Custom software, mobile apps, and automation solutions for your business.',
    category: 'software',
    icon: <Cpu className="text-accent" size={40} />,
    features: ['Custom Software', 'Mobile Apps', 'Automation', 'API Integration'],
    image: serviceImages[14],
    more: 'From business automation to mobile apps, we deliver robust software tailored to your needs.',
    price: 20000
  },
  {
    title: 'Poster & Flyer Design',
    description: 'Creative design for posters, flyers, banners, and marketing materials.',
    category: 'software',
    icon: <Monitor className="text-accent" size={40} />,
    features: ['Poster Design', 'Flyer Design', 'Banner Design', 'Print & Digital'],
    image: serviceImages[15],
    more: 'Get eye-catching designs for your business or event, ready for print or digital use.',
    price: 1000
  },
  {
    title: 'Phone & Tablet Repair',
    description: 'Screen replacement, battery issues, water damage recovery, and software troubleshooting',
    category: 'repair',
    icon: <Smartphone className="text-accent" size={40} />,
    features: ['Screen Replacement', 'Battery Repair', 'Water Damage', 'Software Issues'],
    image: serviceImages[0],
    more: 'We repair a wide range of smartphones and tablets, handling both hardware and software issues with genuine parts and advanced diagnostics.',
    price: 1500
  },
  {
    title: 'Laptop & Computer Repair',
    description: 'Hardware diagnostics, component replacement, virus removal, and performance optimization',
    category: 'repair',
    icon: <Laptop className="text-accent" size={40} />,
    features: ['Hardware Diagnostics', 'Component Replacement', 'Virus Removal', 'Performance Tuning'],
    image: serviceImages[1],
    more: 'From slow PCs to major hardware failures, our technicians restore computers and laptops to optimal performance, ensuring maximum uptime.',
    price: 2500
  },
  {
    title: 'CCTV Installation',
    description: 'Professional security camera setup, monitoring systems, and remote access configuration',
    category: 'installation',
    icon: <Camera className="text-accent" size={40} />,
    features: ['Camera Installation', 'Monitoring Setup', 'Remote Access', 'System Maintenance'],
    image: serviceImages[2],
    more: 'Secure your home or business with smart and scalable CCTV systems. We offer complete installation, monitoring, and remote support services.'
  },
  {
    title: 'Home & Office Wiring',
    description: 'Electrical wiring, network cable installation, and smart home setup services',
    category: 'installation',
    icon: <Plug className="text-accent" size={40} />,
    features: ['Electrical Wiring', 'Network Cables', 'Smart Home Setup', 'Safety Inspection'],
    image: serviceImages[3],
    more: 'Our wiring experts deliver safe electrical and network installations for homes and offices, including smart device configuration and internet setup.'
  },
  {
    title: 'Software Solutions',
    description: 'Operating system installation, software setup, data recovery, and system optimization',
    category: 'software',
    icon: <Disc className="text-accent" size={40} />,
    features: ['OS Installation', 'Software Setup', 'Data Recovery', 'System Optimization'],
    image: serviceImages[4],
    more: 'Get help with installing applications, recovering lost data, OS upgrades, and making your devices run like new. Fast and secure service.',
    price: 2000
  },
  {
    title: 'Tech Consultation',
    description: 'Technology planning, system recommendations, and strategic IT advice for businesses',
    category: 'consultation',
    icon: <BookOpen className="text-accent" size={40} />,
    features: ['Tech Planning', 'System Recommendations', 'IT Strategy', 'Business Solutions'],
    image: serviceImages[5],
    more: 'Our consultants work closely with you for tailored IT strategies, digital transformation, and reliable tech roadmaps for business growth.'
  },
  {
    title: 'Gaming Console Repair',
    description: 'Troubleshooting, motherboard repair, and upgrade services for PlayStation, Xbox, and Nintendo devices',
    category: 'repair',
    icon: <Disc className="text-accent" size={40} />,
    features: ['Motherboard Fix', 'HDMI Repair', 'Storage Upgrade', 'System Cleaning'],
    image: serviceImages[6],
    more: 'Get your favorite gaming console back in action! We provide motherboard-level repairs, HDMI port fixes, storage upgrades, and cleaning for all major brands and generations.'
  },
  {
    title: 'Smart TV Setup & Repair',
    description: 'Installation, app setup, software repair, and calibration for all Smart TV brands',
    category: 'installation',
    icon: <Laptop className="text-accent" size={40} />,
    features: ['Wall Mounting', 'OS Setup', 'App Configuration', 'Screen Calibration'],
    image: serviceImages[7],
    more: 'Enjoy your Smart TV with perfect installation and setup. We handle mounting, app configuration, software repairs, and in-depth display tuning for best quality.'
  },
  {
    title: 'Printer & Peripheral Support',
    description: 'Printer setup, troubleshooting, network configuration, and peripheral optimization',
    category: 'software',
    icon: <Plug className="text-accent" size={40} />,
    features: ['Printer Setup', 'Driver Installation', 'Network Printers', 'Accessory Support'],
    image: serviceImages[8],
    more: 'From stubborn printers to finicky accessories, we set up, configure, and repair printers, scanners, and essential peripherals for home and office environments.'
  },
  {
    title: 'Network Installation',
    description: 'Professional network cable installation, router setup, and Wi-Fi optimization for homes and businesses',
    category: 'installation',
    icon: <Plug className="text-accent" size={40} />,
    features: ['Network Cabling', 'Router Setup', 'Wi-Fi Optimization', 'Troubleshooting'],
    image: serviceImages[9],
    more: 'Get fast, reliable, and secure network installations for your home or office. We handle everything from cabling to router configuration and Wi-Fi optimization.'
  },
  {
    title: 'Data Recovery & Backup',
    description: 'Recover lost files, set up automated backups, and secure data storage solutions.',
    category: 'software',
    icon: <Server className="text-accent" size={40} />,
    features: ['File Recovery', 'Backup Setup', 'Cloud Storage', 'Data Security'],
    image: serviceImages[10],
    more: 'We help you recover lost data and set up reliable backup systems to keep your information safe.'
  },
  {
    title: 'Cybersecurity & Virus Removal',
    description: 'Malware/virus removal, firewall setup, and security audits for devices and networks.',
    category: 'software',
    icon: <Shield className="text-accent" size={40} />,
    features: ['Virus Removal', 'Firewall Setup', 'Security Audit', 'Device Protection'],
    image: serviceImages[11],
    more: 'Protect your devices and data from threats with our comprehensive cybersecurity services.'
  },
  {
    title: 'POS System Setup',
    description: 'Installation and support for retail POS systems, including hardware and software.',
    category: 'installation',
    icon: <ShoppingCart className="text-accent" size={40} />,
    features: ['POS Installation', 'Software Setup', 'Training', 'Support'],
    image: serviceImages[12],
    more: 'Get your business running smoothly with our expert POS system installation and support.'
  },
  {
    title: 'Website Design & Hosting',
    description: 'Build, host, and maintain business or personal websites.',
    category: 'software',
    icon: <Globe className="text-accent" size={40} />,
    features: ['Web Design', 'Hosting', 'Maintenance', 'SEO'],
    image: serviceImages[13],
    more: 'We create beautiful, responsive websites and provide reliable hosting and ongoing support.'
  },
  {
    title: 'Cloud Services & Migration',
    description: 'Help businesses move to cloud platforms (Google Workspace, Microsoft 365, etc.).',
    category: 'software',
    icon: <Cloud className="text-accent" size={40} />,
    features: ['Cloud Migration', 'Setup', 'Training', 'Support'],
    image: serviceImages[14],
    more: 'Migrate your business to the cloud for better collaboration, security, and scalability.'
  },
  {
    title: 'Mobile Device Management',
    description: 'Set up and manage business phones/tablets, including security and app deployment.',
    category: 'software',
    icon: <MobileIcon className="text-accent" size={40} />,
    features: ['Device Setup', 'Security', 'App Deployment', 'Remote Management'],
    image: serviceImages[15],
    more: 'We manage your mobile devices for security, productivity, and easy administration.'
  },
  {
    title: 'Smart Home Automation',
    description: 'Install and configure smart lights, thermostats, security systems, and voice assistants. We use Arduino and Raspberry Pi to automate your home, including automatic water pumps, remote-controlled gates, and automatic door openers.',
    category: 'installation',
    icon: <Home className="text-accent" size={40} />,
    features: ['Smart Lights', 'Thermostats', 'Security', 'Voice Assistants', 'Arduino Automation', 'Raspberry Pi Projects', 'Automatic Pump', 'Remote Gate', 'Auto Door'],
    image: serviceImages[16],
    more: 'Upgrade your home with the latest smart technology for comfort and security. We build custom automation using Arduino and Raspberry Pi, including automatic water pumps, remote-controlled gates, and automatic door openers for a truly modern home.'
  },
  {
    title: 'Solar Power & Inverter Installation',
    description: 'Design and install solar energy systems and backup power solutions.',
    category: 'installation',
    icon: <Sun className="text-accent" size={40} />,
    features: ['Solar Panels', 'Inverters', 'Battery Backup', 'Maintenance'],
    image: serviceImages[17],
    more: 'Go green and save on energy costs with our solar and inverter installation services.'
  },
  {
    title: 'Networking for Events',
    description: 'Temporary Wi-Fi and networking for conferences, weddings, or outdoor events.',
    category: 'installation',
    icon: <Wifi className="text-accent" size={40} />,
    features: ['Event Wi-Fi', 'Temporary Networks', 'Setup & Support', 'Coverage Planning'],
    image: serviceImages[18],
    more: 'Ensure your event has fast, reliable internet and networking for all your guests.'
  },
  {
    title: 'Custom PC Building & Upgrades',
    description: 'Build gaming or workstation PCs, upgrade components, and optimize performance.',
    category: 'repair',
    icon: <Cpu className="text-accent" size={40} />,
    features: ['PC Building', 'Upgrades', 'Performance Tuning', 'Consultation'],
    image: serviceImages[19],
    more: 'Get a custom-built PC or upgrade your current system for gaming, work, or creative projects.'
  },
  {
    title: 'E-Waste Recycling',
    description: 'Safe disposal and recycling of old electronics.',
    category: 'consultation',
    icon: <Trash2 className="text-accent" size={40} />,
    features: ['Device Collection', 'Data Wipe', 'Eco-Friendly Disposal', 'Certification'],
    image: serviceImages[20],
    more: 'Dispose of your old electronics safely and responsibly with our e-waste recycling service.'
  }
];

export const categories: Category[] = [
  { id: 'all', name: 'All Services' },
  { id: 'repair', name: 'Repair' },
  { id: 'installation', name: 'Installation' },
  { id: 'software', name: 'Software' },
  { id: 'consultation', name: 'Consultation' }
];
