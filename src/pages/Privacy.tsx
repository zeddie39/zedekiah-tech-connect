import React from "react";

const Privacy = () => (
  <div className="max-w-3xl mx-auto py-12 px-6 bg-white rounded-2xl shadow-lg border border-accent/20 mt-8 mb-12">
    <h1 className="text-3xl font-bold mb-2 text-primary text-center">Ztech Electronics Limited – Privacy Policy</h1>
    <p className="text-xs text-muted-foreground mb-6 text-center">Last Updated: June 18, 2025</p>
    <div className="space-y-4 text-base text-gray-700">
      <p>At Ztech Electronics Limited, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit or use our services.</p>
      <ol className="list-decimal pl-6 space-y-2">
        <li><b>Information We Collect</b>
          <ul className="list-disc pl-6">
            <li><b>Personal Information:</b> Name, email, phone number, address, billing and shipping information, ID or verification documents (if needed)</li>
            <li><b>Technical Data:</b> IP address, browser type, device type, usage logs, interaction behavior on the platform</li>
            <li><b>Uploaded Content:</b> Photos of devices, chat conversations, repair descriptions, listings in the marketplace</li>
          </ul>
        </li>
        <li><b>How We Use Your Data</b>
          <ul className="list-disc pl-6">
            <li>Provide and improve services</li>
            <li>Facilitate payments and deliveries</li>
            <li>Offer customer support</li>
            <li>Power AI features (image analysis, chat)</li>
            <li>Detect fraud and ensure security</li>
            <li>Send notifications, updates, and offers</li>
          </ul>
        </li>
        <li><b>Data Sharing</b>
          <ul className="list-disc pl-6">
            <li>We do not sell your data. We may share data only with:</li>
            <li>Service providers (e.g., payment gateways, hosting providers)</li>
            <li>Law enforcement (only when legally required)</li>
            <li>Analytics or research partners (in anonymized form)</li>
          </ul>
        </li>
        <li><b>Cookies and Tracking</b><br/>
          We use cookies and similar technologies to enhance user experience and analyze platform performance. You can manage cookie preferences via your browser settings.
        </li>
        <li><b>Data Security</b><br/>
          We implement strong safeguards, including SSL encryption, secure authentication, regular backups and audits. However, no method of transmission over the internet is 100% secure.
        </li>
        <li><b>Your Rights</b>
          <ul className="list-disc pl-6">
            <li>Access your data</li>
            <li>Correct or delete your data</li>
            <li>Request data export</li>
            <li>Opt out of promotional communications</li>
          </ul>
        </li>
        <li><b>Children’s Privacy</b><br/>
          Our services are not intended for children under 13. We do not knowingly collect personal data from minors without parental consent.
        </li>
        <li><b>Third-Party Links</b><br/>
          Our site may link to external platforms. We are not responsible for their content or privacy practices.
        </li>
        <li><b>Policy Changes</b><br/>
          We may update this Privacy Policy periodically. We will notify users through the platform or email.
        </li>
      </ol>
      <div className="mt-8 border-t pt-4 text-sm text-gray-600">
        <b>Contact Us About Privacy</b><br/>
        <span className="block">Email: zeedy028@gmail.com</span>
        <span className="block">Phone: +254 757 756 763</span><br/>
        <span className="block">Ztech Electronics Limited, Kenya</span>
      </div>
    </div>
  </div>
);

export default Privacy;
