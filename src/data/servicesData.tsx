
import { Smartphone, Laptop, Camera, Plug, Disc, BookOpen } from 'lucide-react';
import { Service, Category } from '@/types/service';

export const serviceImages = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b", // Laptop Repair
  "https://images.unsplash.com/photo-1518770660439-4636190af475", // Circuit Board/PC
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6", // CCTV
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1", // Wiring/network
  "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7", // Software
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",  // Consultation
  "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7", // Gaming Console
  "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1", // Smart TV
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c"  // Printer & Peripherals
];

export const services: Service[] = [
  {
    title: 'Phone & Tablet Repair',
    description: 'Screen replacement, battery issues, water damage recovery, and software troubleshooting',
    category: 'repair',
    icon: <Smartphone className="text-accent" size={40} />,
    features: ['Screen Replacement', 'Battery Repair', 'Water Damage', 'Software Issues'],
    image: serviceImages[0],
    more: 'We repair a wide range of smartphones and tablets, handling both hardware and software issues with genuine parts and advanced diagnostics.'
  },
  {
    title: 'Laptop & Computer Repair',
    description: 'Hardware diagnostics, component replacement, virus removal, and performance optimization',
    category: 'repair',
    icon: <Laptop className="text-accent" size={40} />,
    features: ['Hardware Diagnostics', 'Component Replacement', 'Virus Removal', 'Performance Tuning'],
    image: serviceImages[1],
    more: 'From slow PCs to major hardware failures, our technicians restore computers and laptops to optimal performance, ensuring maximum uptime.'
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
    more: 'Get help with installing applications, recovering lost data, OS upgrades, and making your devices run like new. Fast and secure service.'
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
  }
];

export const categories: Category[] = [
  { id: 'all', name: 'All Services' },
  { id: 'repair', name: 'Repair' },
  { id: 'installation', name: 'Installation' },
  { id: 'software', name: 'Software' },
  { id: 'consultation', name: 'Consultation' }
];
