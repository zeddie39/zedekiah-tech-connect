
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Service } from '@/types/service';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  service: Service | null;
}

const ServiceModal = ({ isOpen, onClose, service }: ServiceModalProps) => {
  if (!service) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-heading">
            {service.title}
          </DialogTitle>
        </DialogHeader>
        <div>
          <img src={service.image} alt={service.title} className="w-full h-48 object-cover rounded-md mb-4" />
          <p className="mb-2 text-gray-700">{service.description}</p>
          <ul className="list-disc ml-6 mb-4">
            {service.features.map((feature: string, idx: number) => (
              <li key={idx} className="text-gray-800">{feature}</li>
            ))}
          </ul>
          <p className="text-gray-900">{service.more}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
