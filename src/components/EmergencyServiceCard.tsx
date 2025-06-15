
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const EmergencyServiceCard = () => (
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
);

export default EmergencyServiceCard;
