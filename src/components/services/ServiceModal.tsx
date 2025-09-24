import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
      <DialogContent className="max-h-screen overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="font-heading">
            {service.title}
          </DialogTitle>
          <DialogDescription>
            Detailed information and features for this service.
          </DialogDescription>
        </DialogHeader>
        <div>
          <img src={service.image} alt={service.title} className="w-full h-40 sm:h-48 object-cover rounded-md mb-4" />
          <p className="mb-2 text-gray-700 text-sm sm:text-base break-words">{service.description}</p>
          <ul className="list-disc ml-6 mb-4">
            {service.features.map((feature: string, idx: number) => (
              <li key={idx} className="text-gray-800 text-sm sm:text-base break-words">{feature}</li>
            ))}
          </ul>
          <p className="text-gray-900 text-sm sm:text-base break-words">{service.more}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
