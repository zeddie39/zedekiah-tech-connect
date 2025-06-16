
export interface Service {
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  features: string[];
  image: string;
  more: string;
}

export interface Category {
  id: string;
  name: string;
}
