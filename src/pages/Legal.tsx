
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Legal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Legal Information
          </h1>
          <p className="text-xl text-gray-600">
            Our terms, privacy policy, and legal documents
          </p>
        </div>

        <div className="space-y-8">
          {/* Terms of Service */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Terms of Service</CardTitle>
                <Badge>Last updated: January 2024</Badge>
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>1. Service Description</h3>
              <p>
                AnswerAssist AI provides artificial intelligence-powered phone answering services 
                for service-based businesses. Our platform connects to your phone system and 
                handles customer calls using advanced AI technology.
              </p>

              <h3>2. Free Trial Terms</h3>
              <p>
                New users receive a 3-day free trial with the following limitations:
              </p>
              <ul>
                <li>Maximum 10 outbound calls</li>
                <li>Maximum 3 minutes per call</li>
                <li>Service limited to 2 registered phone numbers</li>
                <li>No credit card required for trial activation</li>
              </ul>

              <h3>3. Subscription and Billing</h3>
              <p>
                Paid subscriptions are billed monthly in advance. Minute bundles are 
                one-time purchases that do not expire. All billing is processed through 
                Stripe with industry-standard security.
              </p>

              <h3>4. Acceptable Use</h3>
              <p>
                Users must comply with all applicable laws and regulations. Prohibited 
                uses include but are not limited to: spam calls, fraudulent activities, 
                harassment, or any illegal purposes.
              </p>

              <h3>5. Data and Privacy</h3>
              <p>
                We collect and process call data to provide our services. All recordings 
                and transcripts are stored securely and are accessible only to the account 
                owner and authorized personnel.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Privacy Policy</CardTitle>
                <Badge>Last updated: January 2024</Badge>
              </div>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h3>Information We Collect</h3>
              <p>
                We collect information you provide directly, such as account registration 
                details, payment information, and AI configuration settings. We also 
                collect call recordings and metadata to provide our services.
              </p>

              <h3>How We Use Your Information</h3>
              <ul>
                <li>To provide and maintain our AI answering service</li>
                <li>To process payments and manage subscriptions</li>
                <li>To improve our AI models and service quality</li>
                <li>To provide customer support</li>
                <li>To comply with legal obligations</li>
              </ul>

              <h3>Data Security</h3>
              <p>
                We implement industry-standard security measures to protect your data, 
                including encryption in transit and at rest, regular security audits, 
                and compliance with applicable data protection regulations.
              </p>

              <h3>Third-Party Services</h3>
              <p>
                Our service integrates with Twilio (telephony), ElevenLabs (voice synthesis), 
                and Stripe (payments). Each service has its own privacy policy and data 
                handling practices.
              </p>
            </CardContent>
          </Card>

          {/* Cookie Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                We use cookies and similar technologies to enhance your experience, 
                analyze usage patterns, and provide personalized content. You can 
                control cookie preferences through your browser settings.
              </p>

              <h3>Types of Cookies We Use</h3>
              <ul>
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you have questions about these legal terms or our practices, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> legal@answerassist.ai</p>
                <p><strong>Address:</strong> [Company Address]</p>
                <p><strong>Phone:</strong> 1-800-ANSWER-AI</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Legal;
