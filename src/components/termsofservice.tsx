// app/termsofservice/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <main className="relative min-h-screen bg-[#2A000A] text-white overflow-hidden">
      {/* Velvet ambience */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[#2A000A] opacity-95" />
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
            <Link className="hover:text-[#F0D9A8] transition" href="/features">
              Features
            </Link>
            <Link className="hover:text-[#F0D9A8] transition" href="/contactus">
              Contact
            </Link>
          </nav> */}
        </div>

        <div className="mt-10 max-w-3xl">
          <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
            Terms of Service
          </p>
          <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-[#F0D9A8] drop-shadow-[0_2px_0_rgba(0,0,0,0.55)]">
            Subscription Agreement
          </h1>
          <p className="mt-5 text-[16px] leading-7 text-[#E0D1B6] font-sans">
            Please read this Agreement carefully. By accessing or using the Service,
            you agree to be bound by it.
          </p>
        </div>
      </header>

      {/* Document */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        {/* Subtle “paper” surface inside the velvet world */}
        <div className="relative rounded-2xl border border-[#DDB982]/12 bg-white/[0.06] backdrop-blur-md overflow-hidden">
          {/* <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(240,217,168,0.07),transparent_55%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(185,58,82,0.08),transparent_60%)]" /> */}

          <article className="relative px-7 sm:px-10 lg:px-14 py-12">
            {/* Title block (matches your doc hierarchy) */}
            <div className="text-center">
              <h2 className="font-serif text-xl sm:text-2xl text-[#F0D9A8]">
                NOVATION TECHNOLOGIES, LLC
              </h2>
              <p className="mt-2 font-sans text-xs tracking-[0.18em] uppercase text-[#D2A679]">
                Trademark Analysis Platform
              </p>
              <h3 className="mt-3 font-serif text-3xl sm:text-4xl text-[#F0D9A8]">
                Subscription Agreement
              </h3>
            </div>

            <div className="mt-10 h-px w-full bg-[#DDB982]/10" />

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
                This Subscription Agreement (“<strong>Agreement</strong>”) is entered into by and between{' '}
                <strong>Novation Technologies, LLC</strong>, a limited liability company (“<strong>Novation</strong>,” “<strong>we</strong>,” or “<strong>us</strong>”),
                and the subscribing law firm or organization (“<strong>Customer</strong>”).
              </p>
<p></p>
              <p>
                This Agreement governs Customer’s access to and use of Novation’s trademark analysis software platform and related services (the “<strong>Service</strong>”).
              </p>

              <p>
                “<strong>Order Form</strong>” means any written or electronic ordering document, subscription summary, checkout flow, payment link, invoice, or similar instrument,
                including, without limitation, any electronic checkout or payment process, that references or incorporates this Agreement and specifies subscription details such as pricing,
                usage limits, and term.
              </p>

              <p>
                This Agreement is effective as of the date Customer first accesses or uses the Service, completes an Order Form, or otherwise accepts this Agreement through an electronic checkout,
                payment, or click-wrap process that references or incorporates this Agreement (the “<strong>Effective Date</strong>”).
              </p>

              

              <h2>1. LICENSE GRANT &amp; ACCESS</h2>

              <h3>1.1 License Grant</h3>
              <p>
                Subject to Customer’s compliance with this Agreement and payment of applicable fees, Novation grants Customer a limited, non-exclusive, non-transferable, non-sublicensable,
                revocable license to access and use the Service solely for Customer’s internal business purposes.
              </p>

              <h3>1.2 Organization-Based Access</h3>
              <p>
                Customer’s subscription is provisioned at the organization level and includes a defined number of authorized users (“<strong>Users</strong>”) and a defined monthly allotment
                of searches (“<strong>Search Credits</strong>”). All Users share the same Search Credits.
              </p>

              <h3>1.3 Usage Limits</h3>
              <p>
                Search Credits reset monthly and do not roll over. Upon exhaustion of Search Credits, Customer’s ability to perform additional searches will be suspended until the next billing cycle
                unless Customer upgrades its subscription.
              </p>

              <h3>1.4 Upgrades</h3>
              <p>
                Customer may request additional Search Credits or User seats at any time. Approved upgrades will be billed at Novation’s then-current rates and applied pro rata for the remainder of the billing period.
              </p>

              

              <h2>2. RESTRICTIONS &amp; ACCEPTABLE USE</h2>

              <h3>2.1 No Resale or Third-Party Use</h3>
              <p>
                Customer may not resell, sublicense, distribute, assign, or otherwise make the Service or Search Credits available to any third party, including, without limitation, Customer’s clients,
                affiliates, contractors, or partner organizations.
              </p>

              <h3>2.2 Prohibited Conduct</h3>
              <p>Customer shall not:</p>
              <ul>
                <li>- circumvent usage limits or access controls;</li>
                <li>- use automated tools to extract data or inflate usage;</li>
                <li>- reverse engineer, scrape, or copy the Service;</li>
                <li>- use the Service for competitive analysis or to develop competing products.</li>
                <li>
                  - engage in any other conduct that materially interferes with, disrupts, circumvents, or attempts to bypass the Service, its technical limitations, or its intended use,
                  as reasonably determined by Novation.
                </li>
              </ul>

              <h3>2.3 Monitoring &amp; Enforcement</h3>
              <p>
                Novation reserves the right to monitor usage to ensure compliance with subscription limits and this Agreement. Novation may suspend or restrict access, in its reasonable discretion,
                for suspected abuse, misuse, or violation of this Agreement. Novation’s failure to suspend or restrict access in any particular instance shall not constitute approval of such conduct
                or a waiver of Novation’s rights.
              </p>

              <h3>2.4 Reservation of Rights</h3>
              <p>
                All rights not expressly granted to Customer under this Agreement are reserved by Novation. No implied licenses or rights are granted.
              </p>

             

              <h2>3. NO LEGAL ADVICE; NO RELIANCE</h2>

              <h3>3.1 Informational Tool Only</h3>
              <p>
                The Service provides automated analysis and aggregated information related to trademark research. The Service does <strong>not</strong> provide legal advice, legal opinions, or legal recommendations.
              </p>

              <h3>3.2 No Attorney-Client Relationship</h3>
              <p>
                Use of the Service does not create an attorney-client relationship, fiduciary relationship, or any other professional relationship between Novation and Customer, Customer’s Users, or any third party.
              </p>

              <h3>3.3 No Reliance</h3>
              <p>
                Customer acknowledges and agrees that it does not rely on the Service as the sole or primary basis for any legal conclusion, clearance decision, filing, opinion, or client advice.
                Professional judgment and independent review remain solely Customer’s responsibility.
              </p>

             

              <h2>4. DATA OWNERSHIP &amp; SECURITY</h2>

              <h3>4.1 Data Ownership</h3>
              <p>
                Customer retains all rights in data submitted to the Service or generated from Customer’s inputs (“<strong>Customer Data</strong>”).
              </p>

              <h3>4.2 No Training Use</h3>
              <p>
                Novation will not use Customer Data to train machine learning or AI models or for any purpose other than providing, maintaining, securing, and improving the Service.
              </p>

              <h3>4.3 Security Measures</h3>
              <p>
                Novation maintains commercially reasonable, industry-standard administrative, technical, and physical safeguards designed to protect Customer Data from unauthorized access, disclosure, or loss.
              </p>

              <h3>4.4 Confidentiality</h3>
              <p>
                Novation will not disclose Customer Data to third parties except: (a) as required by law, or (b) to authorized subprocessors bound by confidentiality obligations.
              </p>

              <h3>4.5 Data Processing</h3>
              <p>
                Novation’s processing of Customer Data is governed by the Data Processing Addendum attached as Exhibit A.
              </p>

            

              <h2>5. MARKETING &amp; PUBLICITY</h2>

              <h3>5.1 Logo &amp; Name Use</h3>
              <p>
                Customer grants Novation a non-exclusive, revocable license to use Customer’s name and logo for marketing purposes, including customer lists, website content, pitch materials, and non-confidential case studies.
              </p>

              <h3>5.2 Opt-Out</h3>
              <p>
                Customer may revoke this permission with written notice, except for use in already-published historical materials.
              </p>

            

              <h2>6. FEES &amp; PAYMENT</h2>

              <h3>6.1 Subscription Fees</h3>
              <p>Customer shall pay the applicable monthly subscription fees in advance.</p>

              <h3>6.2 Billing &amp; Nonpayment</h3>
              <p>Failure to pay fees may result in suspension or termination of access after reasonable notice.</p>

              <h3>6.3 Payment Processing</h3>
              <p>
                Customer authorizes Novation and its payment processor to charge Customer’s designated payment method on a recurring basis in accordance with the applicable Order Form until the subscription is terminated.
              </p>

         

              <h2>7. WARRANTIES &amp; DISCLAIMERS</h2>

              <h3>7.1 As-Is Service</h3>
              <p>
                <strong>
                  THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” NOVATION DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                  ACCURACY, COMPLETENESS, AND NON-INFRINGEMENT.
                </strong>
              </p>

              <h3>7.2 No Outcome Guarantees</h3>
              <p>
                Novation does not guarantee that the Service will identify all potential trademark conflicts or that results will be error-free, complete, or legally sufficient.
              </p>

          
              <h2>8. LIMITATION OF LIABILITY</h2>

              <h3>8.1 Excluded Damages</h3>
              <p>
                <strong>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, NOVATION SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES.
                </strong>
              </p>

              <h3>8.2 Liability Cap</h3>
              <p>
                <strong>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, NOVATION’S TOTAL LIABILITY ARISING FROM THIS AGREEMENT SHALL NOT EXCEED THE FEES PAID BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                </strong>
              </p>

        

              <h2>9. INDEMNIFICATION</h2>

              <h3>9.1 Customer Indemnity</h3>
              <p>
                Customer shall indemnify, defend, and hold harmless Novation from and against any claims, damages, liabilities, and expenses (including attorneys’ fees) arising from:
              </p>
              <ul>
                <li>Customer’s legal services or professional advice;</li>
                <li>claims by Customer’s clients or third parties;</li>
                <li>Customer’s misuse of or reliance on the Service beyond its intended informational purpose;</li>
                <li>Customer’s violation of this Agreement.</li>
              </ul>

           

              <h2>10. BETA &amp; EVOLVING SERVICE</h2>
              <p>
                Customer acknowledges that the Service is an evolving platform. Features, methodologies, data sources, and outputs may change over time. Novation does not guarantee backward compatibility
                or consistency of results across versions.
              </p>

            

              <h2>11. FEEDBACK</h2>
              <p>
                Customer grants Novation a perpetual, irrevocable, royalty-free license to use, modify, and incorporate any feedback, suggestions, or ideas provided by Customer without obligation or compensation.
              </p>

             

              <h2>12. FORCE MAJEURE</h2>
              <p>
                Novation shall not be liable for delays or failures caused by events beyond its reasonable control, including acts of God, internet outages, third-party data source failures, government actions,
                or force majeure events.
              </p>

              

              <h2>13. EXPORT CONTROL &amp; SANCTIONS</h2>
              <p>
                Customer represents that it is not subject to U.S. sanctions and will not use the Service in violation of export control laws or applicable regulations.
              </p>

             

              <h2>14. TERM &amp; TERMINATION</h2>

              <h3>14.1 Term</h3>
              <p>This Agreement continues on a month-to-month basis unless terminated.</p>

              <h3>14.2 Termination</h3>
              <p>Either party may terminate with thirty (30) days’ written notice, including notice by email.</p>

              <h3>14.3 Effect of Termination</h3>
              <p>Upon termination:</p>
              <ul>
                <li>access to the Service ceases;</li>
                <li>no refunds are issued for partial months;</li>
                <li>Customer Data will be deleted after a reasonable retention period unless legally required.</li>
              </ul>

             

              <h2>15. DISPUTE RESOLUTION &amp; GOVERNING LAW</h2>

              <h3>15.1 Governing Law</h3>
              <p>This Agreement is governed by the laws of the State of Texas, without regard to conflict-of-law principles.</p>

              <h3>15.2 Venue</h3>
              <p>Any dispute shall be brought exclusively in the state or federal courts located in Texas.</p>

             

              <h2>16. MISCELLANEOUS</h2>

              <p><strong>Entire Agreement.</strong> This Agreement, together with any applicable Order Forms or electronic checkout or payment records incorporating this Agreement, constitutes the entire agreement between the parties and supersedes all prior or contemporaneous agreements, representations, or understandings.</p>
              <p><strong>Severability.</strong> If any provision is unenforceable, the remainder remains in effect.</p>
              <p><strong>Assignment.</strong> Customer may not assign without Novation’s consent.</p>
              <p><strong>Survival.</strong> Any provisions which by their nature should survive termination shall survive, including, but not limited to, intellectual property, disclaimers, indemnification, limitations of liability, confidentiality, and payment obligations.</p>
              <p><strong>Independent Contractors.</strong> The parties are independent contractors. Nothing in this Agreement creates a partnership, joint venture, agency, fiduciary, or employment relationship.</p>
              <p><strong>Authority.</strong> Each party represents that the individual accepting or executing this Agreement has full authority to bind that party.</p>
              <p><strong>Electronic Acceptance.</strong> This Agreement may be accepted electronically, including via click-through acceptance, electronic signature, or execution of an Order Form incorporating this Agreement by reference, each of which shall be deemed legally binding.</p>
              <p><strong>No Waiver.</strong> Any failure or delay by Novation in enforcing any provision of this Agreement shall not constitute a waiver of that provision or any other provision.</p>
              <p><strong>Construction.</strong> Headings are for convenience only and shall not affect interpretation. This Agreement shall not be construed against either party as the drafter.</p>
              <p><strong>Counterparts.</strong> This Agreement may be executed in counterparts, each of which is deemed an original, and all of which together constitute one agreement.</p>
              <p><strong>Amendments.</strong> Novation may update this Agreement upon written notice. Continued use of the Service after the effective date of any update constitutes acceptance.</p>

              

              <h2>ACCEPTANCE</h2>
              <p>
                <strong>
                  BY ACCESSING OR USING THE SERVICE, COMPLETING A SUBSCRIPTION OR PAYMENT THROUGH AN ORDER FORM OR ELECTRONIC CHECKOUT OR PAYMENT PROCESS, OR OTHERWISE INDICATING ACCEPTANCE OF THIS AGREEMENT
                  (INCLUDING BY CHECKING A BOX OR CLICKING “I AGREE”), CUSTOMER ACKNOWLEDGES THAT IT HAS READ, UNDERSTANDS, AND AGREES TO BE BOUND BY THIS AGREEMENT.
                </strong>
              </p>
            </div>
          </article>
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-sm font-sans text-[#E0D1B6]/70">
          <Link href="/" className="hover:text-[#F0D9A8] transition">
            ← Back to Home
          </Link>
          <Link href="/privacypolicy" className="hover:text-[#F0D9A8] transition">
            Privacy Policy
          </Link>
        </div>
      </section>
    </main>
  )
}
