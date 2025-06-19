import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";

interface WhyChooseUsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WhyChooseUsModal: React.FC<WhyChooseUsModalProps> = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Why Choose Zedekiah Tech Electronics?</DialogTitle>
        <DialogDescription>
          <ul className="list-disc pl-5 space-y-3 text-gray-700 text-base mt-2">
            <li><span className="font-semibold text-primary">Trusted Expertise:</span> Our certified technicians and consultants have years of experience in electronics repair, IT, and security solutions.</li>
            <li><span className="font-semibold text-primary">Customer-Centric Service:</span> We prioritize your satisfaction with transparent pricing, honest advice, and fast turnaround times.</li>
            <li><span className="font-semibold text-primary">Cutting-Edge Solutions:</span> From AI-powered diagnostics to secure e-commerce and AR support, we leverage the latest technology to serve you better.</li>
            <li><span className="font-semibold text-primary">Secure & Reliable:</span> Your data and devices are handled with utmost care, privacy, and security. We are fully insured and compliant with industry standards.</li>
            <li><span className="font-semibold text-primary">Community Commitment:</span> We support local businesses, empower youth with tech skills, and give back through outreach and training programs.</li>
          </ul>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
);

export default WhyChooseUsModal;
