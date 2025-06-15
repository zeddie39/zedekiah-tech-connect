import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, phone, service, message } = formData;
    const { error } = await supabase.from('contact_messages').insert([
      {
        name,
        email,
        phone,
        service,
        message
      }
    ]);
    setLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
      variant: "default"
    });

    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-primary mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to solve your tech challenges? Contact us today for a free consultation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-orbitron font-bold text-primary mb-6">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Location</h4>
                    <p className="text-gray-600">Find us for in-person consultations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl">
                    <Phone size={26} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-TECH</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl">
                    <Mail size={26} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Email</h4>
                    <p className="text-gray-600">info@zedekiahtechclinic.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl">
                    <Clock size={26} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Hours</h4>
                    <p className="text-gray-600">Mon-Fri 9AM-6PM, Sat 10AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-primary text-white">
              <CardHeader>
                <CardTitle className="font-orbitron">Emergency Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Need urgent tech support? We offer 24/7 emergency services for critical issues.
                </p>
                <a
                  href="tel:0757756763"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-lg shadow hover:bg-accent/90 transition text-lg"
                  style={{ letterSpacing: "1px" }}
                >
                  Call Emergency Line: 0757 756 763
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl font-orbitron text-primary">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                      Service Needed
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select a service</option>
                      <option value="phone-repair">Phone/Tablet Repair</option>
                      <option value="computer-repair">Computer Repair</option>
                      <option value="cctv">CCTV Installation</option>
                      <option value="wiring">Home/Office Wiring</option>
                      <option value="software">Software Solutions</option>
                      <option value="consultation">Tech Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full"
                    placeholder="Tell us about your tech needs..."
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-accent hover:bg-accent/90 text-white py-3 text-lg font-semibold rounded-lg transform hover:scale-105 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
