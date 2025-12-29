// app/privacy/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <main className="relative min-h-screen bg-[#2A000A] text-white overflow-hidden">
      {/* Velvet ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#1A0006] via-[#0B0002] to-[#1A0006] opacity-95" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] bg-gradient-radial from-[#3a0a0a] via-[#230000] to-transparent opacity-35 blur-[180px] -z-10" />

      {/* Header */}
      <header className="mx-auto max-w-5xl px-6 pt-14 pb-10">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/Logo.svg"
              alt="Novation logo"
              width={40}
              height={40}
              className="opacity-95"
              priority
            />
            <span className="font-serif text-2xl text-[#F0D9A8] tracking-tight">
              Novation
            </span>
          </Link>

          {/* <nav className="hidden md:flex items-center gap-6 text-sm font-sans text-[#E0D1B6]/70">
            <Link className="hover:text-[#F0D9A8] transition" href="/termsofservice">
              Terms
            </Link>
            <Link className="hover:text-[#F0D9A8] transition" href="/contactus">
              Contact
            </Link>
          </nav> */}
        </div>

        <div className="mt-10 max-w-3xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
            Privacy
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
            Privacy Policy
          </h1>
          <p className="mt-5 text-[17px] leading-7 text-[#E0D1B6] font-sans">
            This Policy describes how Novation collects, uses, discloses, retains, and safeguards
            information in connection with the Service.
          </p>
        </div>
      </header>

      {/* Document */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative rounded-2xl border border-[#DDB982]/12 bg-white/[0.06] backdrop-blur-md overflow-hidden">
          {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(240,217,168,0.07),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(185,58,82,0.08),transparent_60%)]" /> */}

          <article className="relative px-7 sm:px-10 lg:px-14 py-12">
            {/* Title block */}
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl text-[#F0D9A8]">
                NOVATION TECHNOLOGIES, LLC
              </h2>
              <h3 className="mt-3 font-serif text-3xl sm:text-4xl text-[#F0D9A8]">
                Privacy Policy
              </h3>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-sans text-[#E0D1B6]/80">
                <span className="inline-flex items-center rounded-full px-4 py-1.5 border border-[#DDB982]/14 bg-[#120006]/55">
                  <span className="text-[#D2A679] mr-2">Effective Date:</span> December 18th, 2025
                </span>
                <span className="inline-flex items-center rounded-full px-4 py-1.5 border border-[#DDB982]/14 bg-[#120006]/55">
                  <span className="text-[#D2A679] mr-2">Last Updated:</span> December 18th, 2025
                </span>
              </div>
            </div>

            {/* <div className="mt-10 h-px w-full bg-[#DDB982]/10" /> */}

            {/* Body */}
            <div
  className="
    mt-10 text-[#E0D1B6]
    font-sans leading-7

    /* spacing between blocks */
    [&_p]:my-6
    [&_h2]:mt-14 [&_h2]:mb-5
    [&_h3]:mt-10 [&_h3]:mb-3
    [&_hr]:my-12 [&_hr]:border-[#DDB982]/10
    [&_ul]:my-6 [&_ol]:my-6
    [&_li]:my-2

    /* headings look */
    [&_h2]:font-serif [&_h2]:text-[#F0D9A8] [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:font-semibold
    [&_h2]:border-b [&_h2]:border-[#DDB982]/10 [&_h2]:pb-3
    [&_h3]:font-serif [&_h3]:text-[#F0D9A8] [&_h3]:text-xl sm:[&_h3]:text-2xl

    /* strong */
    [&_strong]:text-[#F0D9A8] [&_strong]:font-semibold

    /* lists */
    [&_ul]:pl-6 [&_ol]:pl-6
  "
>
              <p>
                This Privacy Policy (“<strong>Policy</strong>”) describes how <strong>Novation Technologies, LLC</strong> (“<strong>Novation</strong>,” “<strong>we</strong>,” “<strong>us</strong>,” or “<strong>our</strong>”) collects, uses, discloses, retains, and safeguards information in connection with access to and use of Novation’s trademark analysis software platform and related services (the “<strong>Service</strong>”).
              </p>

              <p>
                This Policy is incorporated by reference into Novation’s Subscription Agreement and applies to all customers, authorized users, website visitors, and other individuals who interact with the Service (“<strong>Users</strong>”).
              </p>

              <p>
                By accessing or using the Service, Users acknowledge that they have read and understood this Policy.
              </p>


              <h2>1. SCOPE &amp; APPLICABILITY</h2>
              
              <p>This Policy applies to:</p>
              <ul>
                <li>- law firms, organizations, and other entities that subscribe to the Service (“<strong>Customers</strong>”)</li>
                <li>- individuals authorized by Customers to access the Service (“<strong>Users</strong>”)</li>
                <li>- visitors to Novation’s websites or portals</li>
              </ul>
              <p>
                This Policy does not apply to third-party websites, platforms, or services that may be linked to or integrated with the Service. Novation is not responsible for the privacy practices of such third parties.
              </p>


              <h2>2. INFORMATION WE COLLECT</h2>
              <p>
                Novation collects information solely to operate, maintain, secure, and improve the Service. The categories of information we collect are described below.
              </p>

              <h3>2.1 Account &amp; Contact Information</h3>
              <p>Collected when a Customer subscribes to the Service or creates an account, including:</p>
              <ul>
                <li>- organization name</li>
                <li>- business email addresses</li>
                <li>- billing contact details</li>
                <li>- authorized user names and roles</li>
                <li>- subscription identifiers</li>
              </ul>

              <h3>2.2 Customer-Submitted Content</h3>
              <p>Information voluntarily submitted to the Service by Customers or Users, including:</p>
              <ul>
                <li>- trademark search queries</li>
                <li>- uploaded marks or related materials</li>
                <li>- configuration preferences</li>
                <li>- reports or outputs generated from Customer inputs</li>
              </ul>
              <p>This data may contain confidential or sensitive information related to Customer matters.</p>

              <h3>2.3 Usage &amp; Operational Data</h3>
              <p>Collected automatically when Users interact with the Service, including:</p>
              <ul>
                <li>- search counts and timestamps</li>
                <li>- feature usage metrics</li>
                <li>- session activity</li>
                <li>- error logs and system diagnostics</li>
              </ul>
              <p>This data is used to enforce usage limits, maintain system integrity, and improve performance.</p>

              <h3>2.4 Technical &amp; Device Information</h3>
              <p>Collected automatically, including:</p>
              <ul>
                <li>- IP addresses</li>
                <li>- browser type and version</li>
                <li>- operating system</li>
                <li>- device identifiers</li>
                <li>- access logs</li>
              </ul>

              <h3>2.5 Payment &amp; Billing Information</h3>
              <p>
                Payment information is processed by third-party payment processors (e.g., Stripe). Novation does not store full payment card numbers. We may receive limited billing metadata necessary for subscription management and accounting.
              </p>


              <h2>3. HOW WE USE INFORMATION</h2>
              <p>Novation uses collected information solely for legitimate business purposes, including to:</p>
              <ul>
                <li>- provide, operate, and maintain the Service</li>
                <li>- authenticate Users and manage access controls</li>
                <li>- enforce subscription limits and prevent abuse</li>
                <li>- process payments and manage billing</li>
                <li>- provide customer support and respond to inquiries</li>
                <li>- monitor system security and prevent fraud</li>
                <li>- improve Service reliability, performance, and usability</li>
                <li>- comply with legal obligations</li>
              </ul>

              <h3>No AI Training Use</h3>
              <p>
                Novation does not use Customer-submitted content or Customer Data to train, fine-tune, or develop machine learning or artificial intelligence models, whether proprietary or third-party.
              </p>

         

              <h2>4. DATA OWNERSHIP</h2>
              <p>
                Customers retain all right, title, and interest in data submitted to the Service or generated from Customer inputs (“<strong>Customer Data</strong>”).
              </p>
              <p>
                Novation obtains no ownership rights in Customer Data and processes such data solely in accordance with this Policy and the applicable Subscription Agreement.
              </p>
              <p>
                In providing the Service, Novation acts as a data processor on behalf of Customers with respect to Customer Data. Customers act as the data controller and are responsible for determining the purposes and lawful basis for processing Customer Data.
              </p>

       

              <h2>5. DATA SHARING &amp; DISCLOSURE</h2>
              <p>Novation does not sell Customer Data or User information.</p>
              <p>We disclose information only in the following limited circumstances:</p>

              <h3>5.1 Service Providers &amp; Subprocessors</h3>
              <p>
                To trusted third-party service providers that support the Service (e.g., cloud hosting, payment processing, monitoring), subject to contractual confidentiality and data protection obligations.
              </p>

              <h3>5.2 Legal Requirements</h3>
              <p>If required to comply with applicable law, regulation, legal process, or governmental request.</p>

              <h3>5.3 Protection of Rights</h3>
              <p>
                To protect the rights, property, or safety of Novation, Customers, Users, or others, including enforcement of agreements and prevention of misuse.
              </p>


              <h2>6. DATA RETENTION</h2>
              <p>
                Novation retains information only for as long as reasonably necessary to:
              </p>
              <ul>
                <li>- provide the Service</li>
                <li>- fulfill contractual obligations</li>
                <li>- comply with legal, accounting, or regulatory requirements</li>
                <li>- resolve disputes</li>
                <li>- enforce agreements</li>
              </ul>
              <p>
                Upon termination of a Customer’s subscription, Customer Data will be deleted or anonymized within a commercially reasonable period following termination, subject to backup retention cycles, legal obligations, and legitimate business purposes, except where retention is required by law or for legitimate business purposes (e.g., backups, audit logs).
              </p>

          

              <h2>7. SECURITY MEASURES</h2>
              <p>
                Novation maintains commercially reasonable administrative, technical, and physical safeguards designed to protect information from unauthorized access, disclosure, alteration, or destruction.
              </p>
              <p>These measures may include:</p>
              <ul>
                <li>- access controls and authentication mechanisms</li>
                <li>- encryption in transit and at rest, where appropriate</li>
                <li>- monitoring and logging</li>
                <li>- restricted internal access on a need-to-know basis</li>
              </ul>
              <p>
                No system is completely secure. While Novation takes reasonable precautions, we cannot guarantee absolute security.
              </p>

       

              <h2>8. CONFIDENTIALITY</h2>
              <p>
                Customer Data is treated as confidential information. Novation restricts internal access to Customer Data to authorized personnel who require access to perform their job functions and who are bound by confidentiality obligations.
              </p>


              <h2>9. CUSTOMER &amp; USER RIGHTS</h2>
              <p>
                Depending on jurisdiction, Users may have rights to:
              </p>
              <ul>
                <li>- request access to their information</li>
                <li>- request correction of inaccurate data</li>
                <li>- request deletion of data, subject to legal limitations</li>
                <li>- object to or restrict certain processing</li>
              </ul>
              <p>
                Requests may be submitted using the contact information below. Novation may require verification of identity before processing requests.
              </p>
              <p>
                Certain requests may need to be submitted by or through the applicable Customer, depending on contractual arrangements and the nature of the data.
              </p>
              <p>
                To the extent applicable, California residents may have rights under the California Consumer Privacy Act (CCPA), as amended by the CPRA. Novation does not sell or share personal information as defined under the CCPA. Requests to exercise applicable rights may be submitted as described above and may be subject to verification and contractual limitations.
              </p>

             

              <h2>10. INTERNATIONAL DATA PROCESSING</h2>
              <p>
                Novation’s infrastructure is primarily hosted in the United States. By using the Service, Users acknowledge that information may be processed and stored in jurisdictions that may have different data protection laws than their home jurisdiction.
              </p>

           

              <h2>11. COOKIES &amp; TRACKING TECHNOLOGIES</h2>
              <p>
                Novation may use cookies or similar technologies to support authentication, session management, and basic analytics. We do not use cookies for targeted advertising.
              </p>

         

              <h2>12. CHILDREN’S PRIVACY</h2>
              <p>
                The Service is intended for business and professional use only and is not directed to individuals under the age of 18. Novation does not knowingly collect personal information from children.
              </p>

             

              <h2>13. CHANGES TO THIS POLICY</h2>
              <p>
                Novation may update this Policy from time to time. Updates will be posted with a revised “Last Updated” date. Continued use of the Service after an update constitutes acceptance of the revised Policy.
              </p>

             

              <h2>14. CONTACT INFORMATION</h2>
              <p>For questions or requests related to this Privacy Policy, please contact:</p>
              <p>
                Novation Technologies, LLC
                <br />
                Email: <a href="mailto:hello@novationapp.com">hello@novationapp.com</a>
              </p>

           

              <h2>15. RELATIONSHIP TO OTHER AGREEMENTS</h2>
              <p>
                In the event of any conflict between this Policy and the Subscription Agreement, the Subscription Agreement shall control with respect to contractual rights and obligations.
              </p>

        

              <h2>ACKNOWLEDGMENT</h2>
              <p>
                By accessing or using the Service, Users acknowledge that they have read and understood this Privacy Policy.
              </p>
            </div>
          </article>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm font-sans text-[#E0D1B6]/70">
          <Link href="/" className="hover:text-[#F0D9A8] transition">
            ← Back to Home
          </Link>
          <Link href="/termsofservice" className="hover:text-[#F0D9A8] transition">
            Terms of Service
          </Link>
        </div>
      </section>
    </main>
  )
}
