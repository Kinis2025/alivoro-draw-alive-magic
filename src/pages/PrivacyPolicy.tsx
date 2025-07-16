import React from "react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 text-gray-900 text-left">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>

      <p><strong>Effective Date:</strong> July 16, 2025</p>

      <h2 className="mt-6 font-semibold text-lg">1. Introduction</h2>
      <p>
        Alivoro is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
      </p>

      <h2 className="mt-6 font-semibold text-lg">2. Information We Collect</h2>
      <p>
        We collect personal information you provide directly to us, such as your name, email address, and uploaded images. We may also collect technical data such as browser type, operating system, and usage information.
      </p>

      <h2 className="mt-6 font-semibold text-lg">3. How We Use Your Information</h2>
      <p>
        We use the collected information to:
        <ul className="list-disc list-inside ml-6">
          <li>Process payments and generate videos</li>
          <li>Provide and maintain our services</li>
          <li>Respond to inquiries and support requests</li>
          <li>Improve and personalize user experience</li>
        </ul>
      </p>

      <h2 className="mt-6 font-semibold text-lg">4. Sharing Your Information</h2>
      <p>
        We do not sell or rent your personal information to third parties. We may share information with trusted third-party service providers who assist in operating our website or conducting our business, provided they agree to keep your information confidential.
      </p>

      <h2 className="mt-6 font-semibold text-lg">5. Data Retention</h2>
      <p>
        We retain personal data only as long as necessary to fulfill the purposes for which it was collected, including any legal, accounting, or reporting requirements.
      </p>

      <h2 className="mt-6 font-semibold text-lg">6. Your Rights</h2>
      <p>
        You may request to access, correct, or delete your personal information at any time by contacting us.
      </p>

      <h2 className="mt-6 font-semibold text-lg">7. Data Security</h2>
      <p>
        We implement appropriate technical and organizational security measures to protect your data against unauthorized access, alteration, or destruction.
      </p>

      <h2 className="mt-6 font-semibold text-lg">8. Children’s Privacy</h2>
      <p>
        Our services are intended for use by parents or guardians. We do not knowingly collect personal information from children under 13 without parental consent.
      </p>

      <h2 className="mt-6 font-semibold text-lg">9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
      </p>

      <h2 className="mt-6 font-semibold text-lg">10. Contact Us</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy, contact us at: <strong>alivoro.help@gmail.com</strong>
      </p>

      {/* 🔙 Back to Home button */}
      <div className="mt-10 text-center">
        <Button
          onClick={() => (window.location.href = "/")}
          className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition-colors font-semibold"
        >
          🔙 Back to Home
        </Button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
