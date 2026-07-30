import { 
  Globe, 
  PenTool, 
  Smartphone, 
  Laptop, 
  Tv, 
  Printer, 
  Wifi, 
  Camera, 
  Zap, 
  Cloud, 
  Shield, 
  Briefcase, 
  Gamepad2, 
  Users, 
  Leaf 
} from 'lucide-react';

export type PricingCategory = {
  id: string;
  title: string;
  icon: any;
  items: { service: string; price: string; note?: string }[];
  note?: string;
};

export const pricingData: PricingCategory[] = [
  {
    id: 'web-software',
    title: 'Web & Software Development',
    icon: Globe,
    items: [
      { service: 'Business Website (5–10 pages)', price: 'Ksh 25,000' },
      { service: 'E-commerce Website', price: 'Ksh 45,000' },
      { service: 'Custom Web Application', price: 'Ksh 60,000' },
      { service: 'Mobile App Development (Android/iOS)', price: 'Ksh 80,000' },
      { service: 'Custom Software Development', price: 'Ksh 70,000' },
      { service: 'API Development & Integration', price: 'Ksh 20,000' },
      { service: 'Database Design & Development', price: 'Ksh 30,000' },
      { service: 'Website Maintenance', price: 'Ksh 5,000/month' },
      { service: 'Website Hosting & Domain Setup', price: 'Ksh 8,000/year' },
      { service: 'Website Redesign', price: 'Ksh 20,000' },
    ]
  },
  {
    id: 'graphics-branding',
    title: 'Graphics & Branding',
    icon: PenTool,
    items: [
      { service: 'Poster/Flyer Design', price: 'Ksh 1,500' },
      { service: 'Social Media Banner', price: 'Ksh 1,000' },
      { service: 'Business Card Design', price: 'Ksh 1,500' },
      { service: 'Company Profile Design', price: 'Ksh 8,000' },
      { service: 'Logo Design', price: 'Ksh 6,000' },
      { service: 'Branding Package', price: 'Ksh 20,000' },
    ]
  },
  {
    id: 'phone-tablet',
    title: 'Phone & Tablet Repair',
    icon: Smartphone,
    note: 'Replacement parts charged separately.',
    items: [
      { service: 'Diagnosis', price: 'FREE', note: '(if repair proceeds)' },
      { service: 'Diagnosis Only', price: 'Ksh 800' },
      { service: 'Software Flashing/Updates', price: 'Ksh 1,500' },
      { service: 'FRP Unlock', price: 'Ksh 2,000' },
      { service: 'Screen Replacement (Labor)', price: 'Ksh 1,500' },
      { service: 'Charging Port Replacement (Labor)', price: 'Ksh 1,500' },
      { service: 'Water Damage Cleaning', price: 'Ksh 2,500' },
      { service: 'Motherboard Repair', price: 'Ksh 3,500' },
      { service: 'Data Recovery', price: 'Ksh 5,000' },
    ]
  },
  {
    id: 'computer-services',
    title: 'Computer Services',
    icon: Laptop,
    items: [
      { service: 'Computer Diagnosis', price: 'Ksh 1,000' },
      { service: 'Windows Installation', price: 'Ksh 2,500' },
      { service: 'Office Installation', price: 'Ksh 1,500' },
      { service: 'Driver Installation', price: 'Ksh 1,000' },
      { service: 'Virus Removal', price: 'Ksh 3,000' },
      { service: 'Laptop Repair (Labor)', price: 'Ksh 2,500' },
      { service: 'Desktop Repair (Labor)', price: 'Ksh 2,500' },
      { service: 'BIOS Programming', price: 'Ksh 4,000' },
      { service: 'SSD/HDD Upgrade (Labor)', price: 'Ksh 1,500' },
      { service: 'RAM Upgrade (Labor)', price: 'Ksh 1,000' },
      { service: 'Laptop Cleaning & Servicing', price: 'Ksh 2,000' },
      { service: 'Data Backup', price: 'Ksh 2,000' },
    ]
  },
  {
    id: 'smart-tv',
    title: 'Smart TV & Entertainment',
    icon: Tv,
    items: [
      { service: 'TV Mounting', price: 'Ksh 3,000' },
      { service: 'Smart TV Setup', price: 'Ksh 2,500' },
      { service: 'Smart TV Software Update', price: 'Ksh 2,000' },
      { service: 'TV Board Diagnosis', price: 'Ksh 2,000' },
      { service: 'Smart TV Repair', price: 'Ksh 4,000' },
    ]
  },
  {
    id: 'printers-office',
    title: 'Printers & Office Equipment',
    icon: Printer,
    items: [
      { service: 'Printer Installation', price: 'Ksh 2,000' },
      { service: 'Printer Troubleshooting', price: 'Ksh 2,500' },
      { service: 'Printer Servicing', price: 'Ksh 3,000' },
      { service: 'Network Printer Setup', price: 'Ksh 3,500' },
    ]
  },
  {
    id: 'networking-internet',
    title: 'Networking & Internet',
    icon: Wifi,
    items: [
      { service: 'Home Wi-Fi Setup', price: 'Ksh 5,000' },
      { service: 'Office Network Installation', price: 'Ksh 15,000' },
      { service: 'Router Configuration', price: 'Ksh 2,500' },
      { service: 'Network Troubleshooting', price: 'Ksh 3,000' },
      { service: 'Structured Cabling', price: 'Ksh 20,000' },
      { service: 'Event Networking', price: 'Ksh 20,000' },
    ]
  },
  {
    id: 'cctv-security',
    title: 'CCTV & Security Systems',
    icon: Camera,
    note: 'Equipment quoted separately unless included in the package.',
    items: [
      { service: '4-Camera CCTV Installation', price: 'Ksh 25,000' },
      { service: '8-Camera CCTV Installation', price: 'Ksh 45,000' },
      { service: 'Additional Camera Installation', price: 'Ksh 3,500 each' },
      { service: 'CCTV Maintenance', price: 'Ksh 5,000' },
      { service: 'Access Control Installation', price: 'Ksh 40,000' },
      { service: 'Biometric Attendance System', price: 'Ksh 35,000' },
    ]
  },
  {
    id: 'electrical-smart',
    title: 'Electrical & Smart Systems',
    icon: Zap,
    items: [
      { service: 'Home Wiring', price: 'Ksh 15,000' },
      { service: 'Office Wiring', price: 'Ksh 25,000' },
      { service: 'Smart Home Installation', price: 'Ksh 35,000' },
      { service: 'Automatic Water Pump System', price: 'Ksh 15,000' },
      { service: 'Remote-Controlled Gate Automation', price: 'Ksh 45,000' },
      { service: 'Arduino/Raspberry Pi Custom Projects', price: 'From Ksh 20,000' },
      { service: 'Solar & Inverter Installation', price: 'Ksh 70,000' },
      { service: 'Electrical Maintenance', price: 'Ksh 5,000' },
    ]
  },
  {
    id: 'cloud-it',
    title: 'Cloud & IT Solutions',
    icon: Cloud,
    items: [
      { service: 'Cloud Migration', price: 'Ksh 25,000' },
      { service: 'Microsoft 365 Setup', price: 'Ksh 8,000' },
      { service: 'Google Workspace Setup', price: 'Ksh 8,000' },
      { service: 'Email Server Setup', price: 'Ksh 10,000' },
      { service: 'Server Installation', price: 'Ksh 30,000' },
      { service: 'Server Maintenance', price: 'Ksh 15,000' },
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    icon: Shield,
    items: [
      { service: 'Security Audit', price: 'Ksh 10,000' },
      { service: 'Malware & Virus Removal', price: 'Ksh 5,000' },
      { service: 'Firewall Configuration', price: 'Ksh 15,000' },
      { service: 'Backup Solution Setup', price: 'Ksh 10,000' },
      { service: 'Data Recovery', price: 'Ksh 15,000' },
    ]
  },
  {
    id: 'business-solutions',
    title: 'Business Solutions',
    icon: Briefcase,
    items: [
      { service: 'POS System Installation', price: 'Ksh 30,000' },
      { service: 'Inventory Management Setup', price: 'Ksh 35,000' },
      { service: 'ERP System Setup', price: 'Ksh 100,000' },
      { service: 'Accounting Software Setup', price: 'Ksh 20,000' },
    ]
  },
  {
    id: 'gaming-custom',
    title: 'Gaming & Custom Builds',
    icon: Gamepad2,
    items: [
      { service: 'Gaming Console Repair', price: 'Ksh 3,500' },
      { service: 'Console Software Installation', price: 'Ksh 2,500' },
      { service: 'Custom PC Build (Labor)', price: 'Ksh 5,000' },
      { service: 'Gaming PC Upgrade', price: 'Ksh 3,500' },
    ]
  },
  {
    id: 'consultancy-support',
    title: 'Consultancy & Support',
    icon: Users,
    items: [
      { service: 'IT Consultation', price: 'Ksh 5,000/hour' },
      { service: 'Business Technology Assessment', price: 'Ksh 15,000' },
      { service: 'On-site Technical Support', price: 'Ksh 5,000/visit' },
      { service: 'Annual IT Support Contract', price: 'From Ksh 15,000/month' },
    ]
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    icon: Leaf,
    items: [
      { service: 'E-Waste Collection', price: 'Ksh 1,000' },
      { service: 'Secure Data Destruction', price: 'Ksh 5,000' },
    ]
  }
];
