
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Service } from '@/types/service';

interface ServiceCardProps {
  service: Service;
  onReadMore: (service: Service) => void;
}

const ServiceCard = ({ service, onReadMore }: ServiceCardProps) => {
  return (
    <Card className="service-card group flex flex-col h-full">
      <img
        src={service.image}
        alt={service.title}
        className="rounded-t-xl w-full h-40 object-cover"
      />
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          {service.icon}
        </div>
        <CardTitle className="text-xl font-heading text-primary group-hover:text-accent transition-colors duration-300">
          {service.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <p className="text-gray-600 mb-6 leading-relaxed">
          {service.description}
        </p>
        <div className="space-y-2 mb-4">
          {service.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        <button
          className="mt-auto w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          onClick={() => onReadMore(service)}
        >
          Learn More
        </button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
