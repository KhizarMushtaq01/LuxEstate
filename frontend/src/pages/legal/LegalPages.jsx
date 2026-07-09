import { Link } from 'react-router-dom';

function LegalPage({ title, children }) {
  return (
    <div className="pt-20 bg-cream min-h-screen">
      <div className="bg-navy-500 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="font-display text-4xl text-white">{title}</h1>
          <p className="text-white/40 text-sm mt-2">LuxEstate Realty Group · Last updated: January 1, 2024</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white border border-gray-100 p-8 prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-6">
          {children}
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">Questions? <Link to="/contact" className="text-gold-500 hover:underline">Contact us</Link></p>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <h2 className="font-display text-2xl text-navy-500">Information We Collect</h2>
      <p>LuxEstate Realty Group ("LuxEstate," "we," "our," or "us") collects information you provide directly, including name, email address, phone number, and property preferences when you register, contact us, or use our services. We also collect usage data such as pages visited, search queries, and browser information through cookies and analytics tools.</p>

      <h2 className="font-display text-2xl text-navy-500">How We Use Your Information</h2>
      <p>We use collected information to provide and improve our services, match you with relevant properties, communicate about listings and appointments, send market updates (with your consent), and comply with legal obligations. We do not sell your personal information to third parties.</p>

      <h2 className="font-display text-2xl text-navy-500">GDPR & CCPA Rights</h2>
      <p>Depending on your location, you may have rights to access, correct, or delete your personal data. California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what data is collected and the right to opt out of data sales. European residents have rights under GDPR including data portability and the right to be forgotten. To exercise these rights, contact us at privacy@luxestate.com.</p>

      <h2 className="font-display text-2xl text-navy-500">Cookies</h2>
      <p>We use essential cookies for website functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings. You can control cookie preferences through your browser settings. Disabling cookies may affect site functionality.</p>

      <h2 className="font-display text-2xl text-navy-500">Data Security</h2>
      <p>We implement industry-standard security measures including SSL encryption, secure password hashing, and regular security audits. However, no method of transmission over the internet is 100% secure.</p>

      <h2 className="font-display text-2xl text-navy-500">Contact</h2>
      <p>For privacy-related questions, contact our Privacy Officer at privacy@luxestate.com or (520) 544-4400. LuxEstate Realty Group, 1234 East Broadway Blvd, Tucson, AZ 85719.</p>
    </LegalPage>
  );
}

export function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <h2 className="font-display text-2xl text-navy-500">Acceptance of Terms</h2>
      <p>By accessing and using the LuxEstate Realty Group website ("Site"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our Site. We reserve the right to modify these terms at any time.</p>

      <h2 className="font-display text-2xl text-navy-500">Listing Information Disclaimer</h2>
      <p>Property information displayed on this Site is deemed reliable but not guaranteed. Listing data is provided for personal, non-commercial use and may not be used for any purpose other than identifying prospective properties you may be interested in purchasing or renting. Square footage, lot size, room counts, and other data are approximate and should be independently verified.</p>

      <h2 className="font-display text-2xl text-navy-500">IDX & MLS Data</h2>
      <p>This Site contains information from the Multiple Listing Service (MLS). MLS data is © {new Date().getFullYear()} Multiple Listing Service of Southern Arizona, Inc. All Rights Reserved. The information being provided is for consumers' personal, non-commercial use and may not be used for any purpose other than to identify prospective properties.</p>

      <h2 className="font-display text-2xl text-navy-500">Intellectual Property</h2>
      <p>All content on this Site, including text, images, logos, and software, is the property of LuxEstate Realty Group or its content suppliers and is protected by U.S. and international copyright laws. Reproduction or distribution without express written permission is prohibited.</p>

      <h2 className="font-display text-2xl text-navy-500">Limitation of Liability</h2>
      <p>LuxEstate shall not be liable for any indirect, incidental, or consequential damages arising from use of this Site or reliance on information contained herein. Our total liability shall not exceed $100.</p>

      <h2 className="font-display text-2xl text-navy-500">Governing Law</h2>
      <p>These Terms are governed by the laws of the State of Arizona, without regard to conflict of law principles. Any disputes shall be resolved in the state or federal courts located in Pima County, Arizona.</p>
    </LegalPage>
  );
}

export function AccessibilityPage() {
  return (
    <LegalPage title="Accessibility Statement">
      <h2 className="font-display text-2xl text-navy-500">Our Commitment</h2>
      <p>LuxEstate Realty Group is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards. Our goal is to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.</p>

      <h2 className="font-display text-2xl text-navy-500">Measures Taken</h2>
      <p>We have taken the following steps to ensure accessibility: semantic HTML structure for screen reader compatibility, sufficient color contrast ratios (minimum 4.5:1 for normal text), keyboard navigation support throughout the site, alternative text for all meaningful images, form labels and error descriptions, and responsive design for all device sizes.</p>

      <h2 className="font-display text-2xl text-navy-500">Known Limitations</h2>
      <p>While we strive for full WCAG 2.1 AA compliance, some older content or third-party integrations (such as virtual tour embeds) may not fully meet all guidelines. We are actively working to remediate these issues.</p>

      <h2 className="font-display text-2xl text-navy-500">Feedback & Contact</h2>
      <p>We welcome your feedback on the accessibility of our website. If you experience any barriers or have suggestions for improvement, please contact us at accessibility@luxestate.com or call (520) 544-4400. We aim to respond to feedback within 2 business days.</p>

      <h2 className="font-display text-2xl text-navy-500">Formal Complaints</h2>
      <p>If you are not satisfied with our response, you may contact the U.S. Department of Justice, Civil Rights Division, or file a complaint with the relevant enforcement body in your jurisdiction.</p>
    </LegalPage>
  );
}

export function DMCAPage() {
  return (
    <LegalPage title="DMCA Notice & Copyright Policy">
      <h2 className="font-display text-2xl text-navy-500">Copyright Notice</h2>
      <p>All listing photographs, virtual tours, floor plans, and visual content displayed on this Site are protected by U.S. copyright law. Unauthorized reproduction, distribution, or use of any images is strictly prohibited and may result in legal action.</p>

      <h2 className="font-display text-2xl text-navy-500">DMCA Takedown Procedure</h2>
      <p>If you believe that content on our Site infringes your copyright, please send a written notice to our designated DMCA Agent containing: (1) your physical or electronic signature; (2) identification of the copyrighted work claimed to be infringed; (3) identification of the infringing material and its location on our Site; (4) your contact information; (5) a statement of good faith belief; and (6) a statement of accuracy under penalty of perjury.</p>

      <h2 className="font-display text-2xl text-navy-500">DMCA Agent Contact</h2>
      <p>DMCA Agent: Legal Department<br />LuxEstate Realty Group<br />1234 East Broadway Blvd<br />Tucson, AZ 85719<br />Email: dmca@luxestate.com<br />Phone: (520) 544-4400</p>

      <h2 className="font-display text-2xl text-navy-500">Counter-Notification</h2>
      <p>If you believe your content was removed in error, you may submit a counter-notification with: your signature, identification of the removed material, a statement under penalty of perjury that the removal was a mistake, your contact information, and consent to jurisdiction of federal court in Pima County, Arizona.</p>

      <h2 className="font-display text-2xl text-navy-500">Repeat Infringers</h2>
      <p>LuxEstate has a policy of terminating accounts of users who are repeat copyright infringers in appropriate circumstances.</p>
    </LegalPage>
  );
}
