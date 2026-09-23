import { LegalDocument, DocumentAnalysis, ComparisonResult } from '../types';

export const CONTRACT_V1_TEXT = `FREELANCE SOFTWARE SERVICES & INTELLECTUAL PROPERTY AGREEMENT
(VERSION 1.0 — INITIAL DRAFT)

This Freelance Services Agreement ("Agreement") is entered into as of October 12, 2026 ("Effective Date"), by and between:
CLIENT: Apex Horizon Technologies Private Limited, having its principal office at Indiranagar, Bengaluru, Karnataka, India ("Client"); and
CONTRACTOR: DevCraft Studios / Arjun Rao, residing at Koramangala, Bengaluru, Karnataka, India ("Contractor").
Client and Contractor are individually referred to as a "Party" and collectively as the "Parties".

RECITALS
WHEREAS, Client desires to retain Contractor to develop, architect, and deliver certain proprietary software modules, design systems, and cloud infrastructure as described in Exhibit A; and
WHEREAS, Contractor possesses the technical expertise and agrees to perform such services under the terms set forth herein.

NOW, THEREFORE, the Parties agree as follows:

SECTION 1: SCOPE OF SERVICES & DELIVERABLES
1.1 Services. Contractor shall provide full-stack software development services, API architecture, frontend components, and backend database integrations for Client's automated customer intelligence platform.
1.2 Timelines. Deliverables shall be submitted in accordance with the milestones outlined in Exhibit A. Contractor shall devote sufficient commercial time to ensure timely delivery.

SECTION 2: COMPENSATION & PAYMENT TERMS
2.1 Compensation. Client agrees to pay Contractor a total fixed project fee of ₹50,000 (Fifty Thousand Indian Rupees only), payable in two tranches: fifty percent (50%) upon project commencement and fifty percent (50%) upon final code delivery.
2.2 Payment Schedule. Invoices submitted by Contractor shall be payable within thirty (30) calendar days of receipt ("Net-30").
2.3 Ambiguous Late Payment. In the event Client fails to remit payment when due, Client shall make reasonable efforts to rectify the oversight, but shall not be subject to statutory interest penalties unless delayed beyond ninety (90) days.

SECTION 3: TERM & TERMINATION
3.1 Term. This Agreement commences on the Effective Date and continues for a period of six (6) months, unless terminated earlier pursuant to this Section 3.
3.2 Termination for Convenience. Either Party may terminate this Agreement without cause upon providing thirty (30) days' prior written notice to the other Party.
3.3 Immediate Termination for Breach. Either Party may terminate immediately if the other Party commits a material breach and fails to cure such breach within fourteen (14) calendar days of written notice.

SECTION 4: INTELLECTUAL PROPERTY RIGHTS & WORK FOR HIRE
4.1 Assignment upon Creation. Contractor acknowledges and agrees that all code, software, documentation, designs, inventions, and work product developed under this Agreement shall be deemed "works made for hire". Contractor hereby unconditionally assigns all worldwide right, title, and interest in and to the Deliverables to Client immediately upon creation, irrespective of whether final invoice settlement has occurred.
4.2 Pre-Existing Tools. Contractor retains ownership of general developer utility libraries developed prior to this Agreement, but grants Client an irrevocable, royalty-free, perpetual license to use them within the Deliverable.

SECTION 5: CONFIDENTIALITY & NON-DISCLOSURE
5.1 Definition. "Confidential Information" includes all technical data, trade secrets, customer lists, architectural diagrams, and source code disclosed by Client to Contractor.
5.2 Obligations. Contractor shall protect Confidential Information with the same degree of care it uses for its own confidential materials, but no less than reasonable care. Contractor shall not disclose Confidential Information to any third party for a period of two (2) years following termination.

SECTION 6: RESTRICTIVE COVENANTS & NON-COMPETE
6.1 Non-Compete. During the term of this Agreement and for a period of twelve (12) months thereafter, Contractor shall not directly or indirectly provide software engineering services to any competitor operating in the automated customer analytics sector within Karnataka, India.
6.2 Non-Solicitation. Contractor shall not solicit Client's employees or clients for eighteen (18) months following termination.

SECTION 7: WARRANTIES & LIMITATION OF LIABILITY
7.1 Warranty. Contractor warrants that all code provided shall be original and will not knowingly infringe any third-party patent or copyright.
7.2 Unlimited Contractor Liability. Contractor shall indemnify and hold harmless Client against any claims, losses, or legal expenses arising out of any alleged infringement or breach. Contractor's liability under this Agreement shall be unlimited.

SECTION 8: DISPUTE RESOLUTION & GOVERNING LAW
8.1 Governing Law. This Agreement shall be governed by and construed in accordance with the substantive laws of India.
8.2 Dispute Resolution. Any dispute arising out of or in connection with this Agreement shall be submitted to binding arbitration before a sole arbitrator in Bengaluru, India, in accordance with the Arbitration and Conciliation Act, 1996.`;

export const CONTRACT_V2_TEXT = `FREELANCE SOFTWARE SERVICES & INTELLECTUAL PROPERTY AGREEMENT
(VERSION 2.0 — REVISED NEGOTIATION DRAFT)

This Freelance Services Agreement ("Agreement") is entered into as of October 18, 2026 ("Effective Date"), by and between:
CLIENT: Apex Horizon Technologies Private Limited, having its principal office at Indiranagar, Bengaluru, Karnataka, India ("Client"); and
CONTRACTOR: DevCraft Studios / Arjun Rao, residing at Koramangala, Bengaluru, Karnataka, India ("Contractor").
Client and Contractor are individually referred to as a "Party" and collectively as the "Parties".

RECITALS
WHEREAS, Client desires to retain Contractor to develop, architect, and deliver certain proprietary software modules, design systems, and cloud infrastructure as described in Exhibit A; and
WHEREAS, Contractor possesses the technical expertise and agrees to perform such services under the terms set forth herein.

NOW, THEREFORE, the Parties agree as follows:

SECTION 1: SCOPE OF SERVICES & DELIVERABLES
1.1 Services. Contractor shall provide full-stack software development services, API architecture, frontend components, and backend database integrations for Client's automated customer intelligence platform.
1.2 Timelines. Deliverables shall be submitted in accordance with the milestones outlined in Exhibit A. Contractor shall devote sufficient commercial time to ensure timely delivery.

SECTION 2: COMPENSATION & PAYMENT TERMS
2.1 Compensation. Client agrees to pay Contractor a renegotiated fixed project fee of ₹45,000 (Forty-Five Thousand Indian Rupees only), payable in three equal tranches of 33.33% tied to milestone acceptance criteria.
2.2 Payment Schedule. Invoices submitted by Contractor shall be payable within sixty (60) calendar days of receipt ("Net-60").
2.3 Late Payment Interest. In the event Client fails to remit payment within sixty (60) days, overdue amounts shall accrue interest at the rate of 1.5% per month or the legal maximum, whichever is lower.

SECTION 3: TERM & TERMINATION
3.1 Term. This Agreement commences on the Effective Date and continues for a period of six (6) months, unless terminated earlier pursuant to this Section 3.
3.2 Termination for Convenience. Either Party may terminate this Agreement without cause upon providing sixty (60) days' prior written notice to the other Party.
3.3 Immediate Termination for Breach. Either Party may terminate immediately if the other Party commits a material breach and fails to cure such breach within fourteen (14) calendar days of written notice.

SECTION 4: INTELLECTUAL PROPERTY RIGHTS & WORK FOR HIRE
4.1 Assignment upon Full Payment. Client and Contractor agree that all title, copyright, and intellectual property rights in the final Deliverables shall be transferred and assigned to Client only upon receipt of full, final, and cleared payment of all compensation due under Section 2. Prior to full payment, Contractor grants Client a revocable, non-exclusive evaluation license.
4.2 Pre-Existing Tools. Contractor retains ownership of all pre-existing tools and developer frameworks.

SECTION 5: CONFIDENTIALITY & NON-DISCLOSURE
5.1 Definition. "Confidential Information" includes all technical data, business plans, trade secrets, customer lists, and source code disclosed by either Party.
5.2 Indefinite Duration. Each Party agrees to protect the other's Confidential Information with strict confidence indefinitely for trade secrets, and for five (5) years for general proprietary data following termination.

SECTION 6: RESTRICTIVE COVENANTS & NON-COMPETE
6.1 Non-Compete Carveout. The Parties agree that given Contractor's independent professional status, no general non-compete covenant applies. Contractor remains free to provide software engineering services to any third party, provided Contractor does not use Client's Confidential Information.
6.2 Non-Solicitation. Contractor agrees not to solicit Client's full-time engineering staff for six (6) months following termination.

SECTION 7: WARRANTIES & LIMITATION OF LIABILITY
7.1 Mutual Warranties. Both Parties represent and warrant their legal authority to execute this Agreement.
7.2 Capped Liability. To the maximum extent permitted by law, each Party's aggregate total liability under this Agreement shall be strictly capped at the total fees actually paid to Contractor in the preceding three (3) months. Neither Party shall be liable for indirect, punitive, or consequential damages.

SECTION 8: DISPUTE RESOLUTION & GOVERNING LAW
8.1 Governing Law. This Agreement shall be governed by and construed in accordance with the laws of India.
8.2 Amicable Negotiation & Mediation. The Parties agree to first attempt 30 days of good-faith executive discussion and mediation before initiating arbitration in Bengaluru, Karnataka, India.`;

export const CONTRACT_NDA_TEXT = `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT
(DEMO STANDARD FORM)

This Mutual Non-Disclosure Agreement ("Agreement") is made on November 1, 2026, by and between:
Party A: Horizon Ventures LLC, a Delaware corporation ("Disclosing Party"); and
Party B: Zenith AI Systems Inc., a California corporation ("Receiving Party").

1. PURPOSE
The Parties wish to explore a potential strategic technology collaboration and investment opportunity ("Authorized Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" refers to any non-public technical, product, financial, algorithmic, or business information disclosed orally or in writing, marked "Confidential" or reasonably understood to be confidential.

3. EXCLUSIONS
Confidential Information does not include information that: (a) is or becomes publicly known through no breach of Receiving Party; (b) was already known prior to disclosure; (c) is independently developed without reference to the Disclosing Party's information; or (d) is rightfully received from a third party without duty of confidentiality.

4. OBLIGATIONS
The Receiving Party shall:
(a) hold all Confidential Information in strict confidence;
(b) limit access solely to employees and advisors with a need-to-know who are bound by written non-disclosure agreements;
(c) not reverse engineer, decompile, or copy any software samples without prior written consent.

5. TERM
This Agreement shall remain in effect for three (3) years from the Effective Date, after which the obligations of confidentiality shall expire, except for trade secrets which shall remain protected for as long as permitted under applicable law.

6. RETURN OF MATERIALS
Upon written demand, the Receiving Party shall return or securely destroy all physical and digital copies of Confidential Information within ten (10) business days, providing written officer certification of destruction.

7. NO LICENSE OR WARRANTY
Nothing herein grants any patent, trademark, or copyright license. All information is provided "AS IS" without warranties of any kind.

8. GOVERNING LAW
This Agreement shall be governed by the laws of the State of Delaware, without regard to conflicts of law principles.`;

export const SAMPLE_V1_ANALYSIS: DocumentAnalysis = {
  documentId: 'doc-demo-v1',
  documentTitle: 'Freelance Software Services & IP Agreement — Version 1.0',
  documentType: 'Freelance Services Agreement',
  executiveSummary:
    'This is a software development contract where Arjun Rao (Contractor) agrees to build custom customer intelligence software modules for Apex Horizon Technologies (Client) for a fixed fee of ₹50,000 payable Net-30. Key points to watch: the agreement assigns all IP to the Client immediately upon creation before payment is finalized, imposes an unlimited liability indemnity on the Contractor, and includes a 12-month post-termination non-compete restriction.',
  whatThisDocumentDoes:
    'Engages an independent software contractor for development work while establishing fee payment schedules, ownership of code deliverables, confidentiality rules, liability terms, and dispute resolution through arbitration.',
  parties: [
    {
      name: 'Apex Horizon Technologies Private Limited',
      role: 'Client / Hiring Entity',
      shortLabel: 'Client',
    },
    {
      name: 'DevCraft Studios / Arjun Rao',
      role: 'Independent Contractor / Software Developer',
      shortLabel: 'Contractor',
    },
  ],
  partyAObligations: [
    {
      id: 'po-client-1',
      party: 'Client',
      title: 'Pay Total Project Fee',
      obligation:
        'Pay fixed fee of ₹50,000 in two tranches (50% commencement, 50% code delivery).',
      deadline: 'Net-30 calendar days from receipt of invoice',
      condition: 'Upon completion of respective milestone tranches',
      consequence: 'Delayed interest waived unless delayed past 90 days',
      sectionRef: 'Section 2.1, 2.2',
      confidence: 'High',
    },
    {
      id: 'po-client-2',
      party: 'Client',
      title: 'Provide 30 Days Notice for Termination',
      obligation:
        'Deliver 30 days prior written notice if terminating without cause.',
      deadline: '30 days prior to desired termination date',
      sectionRef: 'Section 3.2',
      confidence: 'High',
    },
  ],
  partyBObligations: [
    {
      id: 'po-contractor-1',
      party: 'Contractor',
      title: 'Deliver Software Milestones',
      obligation:
        'Architect, build, and deliver full-stack software modules according to Exhibit A specifications.',
      deadline: 'According to milestone schedule',
      sectionRef: 'Section 1.1, 1.2',
      confidence: 'High',
    },
    {
      id: 'po-contractor-2',
      party: 'Contractor',
      title: 'Maintain Confidentiality for 2 Years',
      obligation:
        'Protect Client trade secrets, source code, and architectural data from third-party disclosure.',
      deadline: '2 years post termination',
      sectionRef: 'Section 5.2',
      confidence: 'High',
    },
    {
      id: 'po-contractor-3',
      party: 'Contractor',
      title: '12-Month Non-Compete Covenant',
      obligation:
        'Refrain from providing software engineering services to customer analytics competitors in Karnataka.',
      deadline: '12 months following contract termination',
      sectionRef: 'Section 6.1',
      confidence: 'High',
    },
    {
      id: 'po-contractor-4',
      party: 'Contractor',
      title: 'Indemnify Client with Unlimited Liability',
      obligation:
        'Hold harmless Client against all claims and damages with no liability monetary ceiling.',
      condition: 'In case of alleged infringement or contract breach',
      consequence: 'Contractor absorbs all legal expenses and losses',
      sectionRef: 'Section 7.2',
      confidence: 'High',
    },
  ],
  clauses: [
    {
      id: 'cl-1',
      title: 'Scope of Services & Deliverables',
      category: 'General',
      plainEnglish:
        'Defines the software work: full-stack architecture, API integration, and customer intelligence modules.',
      whoItAffects: 'Both Parties',
      obligation: 'Contractor must build modules; Client specifies scope.',
      docReference: 'Section 1.1 - 1.2',
      quote:
        'Contractor shall provide full-stack software development services, API architecture, frontend components, and backend database integrations...',
      confidence: 'High',
      sectionNumber: '1',
    },
    {
      id: 'cl-2',
      title: 'Compensation & Payment Terms',
      category: 'Payment',
      plainEnglish:
        'Fixed fee of ₹50,000 paid 50% upfront and 50% on final delivery, payable on Net-30 day terms.',
      whoItAffects: 'Client pays, Contractor receives',
      obligation: 'Client must pay invoices within 30 days.',
      docReference: 'Section 2.1 - 2.2',
      quote:
        'Client agrees to pay Contractor a total fixed project fee of ₹50,000... Invoices submitted by Contractor shall be payable within thirty (30) calendar days...',
      confidence: 'High',
      sectionNumber: '2',
    },
    {
      id: 'cl-3',
      title: 'Ambiguous Late Payment Provision',
      category: 'Penalties',
      plainEnglish:
        'If the Client pays late, they only need to make "reasonable efforts" and no interest penalties apply unless delayed beyond 90 days.',
      whoItAffects: 'Contractor absorbs cash flow delay risk',
      obligation: 'No financial penalty on Client for 3 months of delay.',
      potentialConcern: 'Weak incentive for Client to pay promptly on Net-30.',
      docReference: 'Section 2.3',
      quote:
        'In the event Client fails to remit payment when due, Client shall make reasonable efforts to rectify the oversight, but shall not be subject to statutory interest penalties unless delayed beyond ninety (90) days.',
      confidence: 'High',
      sectionNumber: '2.3',
    },
    {
      id: 'cl-4',
      title: 'Term & Termination Notice',
      category: 'Termination',
      plainEnglish:
        '6-month initial term. Either party can terminate without reason by giving 30 days written notice.',
      whoItAffects: 'Both Parties',
      obligation: 'Give 30 days advance notice.',
      duration: '6 months initial term',
      docReference: 'Section 3.1 - 3.2',
      quote:
        'Either Party may terminate this Agreement without cause upon providing thirty (30) days prior written notice...',
      confidence: 'High',
      sectionNumber: '3',
    },
    {
      id: 'cl-5',
      title: 'IP Assignment upon Creation',
      category: 'Intellectual Property',
      plainEnglish:
        'All code belongs to the Client the moment it is written, even if the Client has not paid the final invoice yet.',
      whoItAffects: 'Contractor loses leverage if payment is disputed',
      obligation: 'Contractor assigns all worldwide IP rights immediately.',
      potentialConcern:
        'Transferring IP before full payment removes Contractor payment leverage.',
      docReference: 'Section 4.1',
      quote:
        'Contractor hereby unconditionally assigns all worldwide right, title, and interest in and to the Deliverables to Client immediately upon creation, irrespective of whether final invoice settlement has occurred.',
      confidence: 'High',
      sectionNumber: '4.1',
    },
    {
      id: 'cl-6',
      title: 'Confidentiality Obligations',
      category: 'Confidentiality',
      plainEnglish:
        'Contractor must keep technical plans, source code, and trade secrets confidential for 2 years.',
      whoItAffects: 'Contractor',
      obligation: 'Reasonable care to prevent third-party disclosures.',
      duration: '2 years post termination',
      docReference: 'Section 5.1 - 5.2',
      quote:
        'Contractor shall not disclose Confidential Information to any third party for a period of two (2) years following termination.',
      confidence: 'High',
      sectionNumber: '5',
    },
    {
      id: 'cl-7',
      title: '12-Month Sector Non-Compete',
      category: 'Non-compete',
      plainEnglish:
        'Contractor is forbidden from doing software engineering work for any customer analytics competitor in Karnataka for 1 year after the contract ends.',
      whoItAffects: 'Contractor',
      obligation: 'Restricts future freelance client engagements.',
      duration: '12 months post termination',
      potentialConcern:
        'In Indian law (Section 27 of Indian Contract Act), post-employment non-competes are often void in restraint of trade, but having it in writing causes chilling disputes.',
      docReference: 'Section 6.1',
      quote:
        'During the term of this Agreement and for a period of twelve (12) months thereafter, Contractor shall not directly or indirectly provide software engineering services to any competitor...',
      confidence: 'High',
      sectionNumber: '6.1',
    },
    {
      id: 'cl-8',
      title: 'Unlimited Contractor Liability Indemnity',
      category: 'Liability',
      plainEnglish:
        'The Contractor is held solely responsible for all losses, legal fees, and infringement damages with no monetary cap, while the Client has no reciprocal liability cap.',
      whoItAffects: 'Contractor exposed to disproportionate financial risk',
      obligation: 'Contractor indemnifies Client without limitation.',
      potentialConcern:
        'For a ₹50,000 project, unlimited liability could bankrupt a solo contractor over third-party claims.',
      docReference: 'Section 7.2',
      quote:
        'Contractor shall indemnify and hold harmless Client against any claims, losses, or legal expenses... Contractors liability under this Agreement shall be unlimited.',
      confidence: 'High',
      sectionNumber: '7.2',
    },
    {
      id: 'cl-9',
      title: 'Arbitration in Bengaluru',
      category: 'Dispute resolution',
      plainEnglish:
        'Any disputes go to binding arbitration before a single arbitrator in Bengaluru under the Arbitration Act, 1996.',
      whoItAffects: 'Both Parties',
      obligation: 'Resolve disputes outside traditional civil court litigation.',
      docReference: 'Section 8.2',
      quote:
        'Any dispute arising out of or in connection with this Agreement shall be submitted to binding arbitration before a sole arbitrator in Bengaluru, India...',
      confidence: 'High',
      sectionNumber: '8.2',
    },
  ],
  potentialIssues: [
    {
      id: 'pi-1',
      title: 'Disproportionate Liability Without Cap',
      category: 'Liability',
      description:
        'Contractor agrees to unlimited liability for indemnification and breach, despite the contract value being only ₹50,000.',
      whyItMatters:
        'Standard commercial software contracts usually cap liability at the total fees paid or a fixed multiple. Unlimited liability exposes personal assets to third-party infringement claims.',
      evidence: "Contractor's liability under this Agreement shall be unlimited.",
      location: 'Section 7.2',
      confidence: 'High',
      findingType: 'One-sided provision',
      suggestedQuestion:
        'Can we cap the Contractor liability to the total fees actually received under this contract (₹50,000) or an agreed insurance policy limit?',
    },
    {
      id: 'pi-2',
      title: 'Intellectual Property Assigned Prior to Payment',
      category: 'Intellectual Property',
      description:
        'Ownership of code transfers to Client upon creation rather than upon receipt of final payment.',
      whyItMatters:
        'If the Client delays or disputes the second 50% payment tranche, the Contractor has already legally signed away the code and cannot withhold deliverables as security.',
      evidence:
        'Contractor hereby unconditionally assigns all worldwide right... immediately upon creation, irrespective of whether final invoice settlement has occurred.',
      location: 'Section 4.1',
      confidence: 'High',
      findingType: 'Potentially significant obligation',
      suggestedQuestion:
        'Should we revise Section 4.1 to state that IP ownership transfers only upon full and final payment?',
    },
    {
      id: 'pi-3',
      title: 'Post-Termination 12-Month Non-Compete',
      category: 'Restrictive Covenants',
      description:
        'Restricts the contractor from offering software engineering services to customer analytics competitors in Karnataka for 12 months.',
      whyItMatters:
        'This limits the contractor from earning a livelihood in their primary domain. Under Section 27 of the Indian Contract Act 1872, agreements in restraint of lawful profession are typically void, but having the clause in writing invites intimidation.',
      evidence:
        'Contractor shall not directly or indirectly provide software engineering services to any competitor... for a period of twelve (12) months thereafter...',
      location: 'Section 6.1',
      confidence: 'High',
      findingType: 'Potential concern',
      suggestedQuestion:
        'Is this non-compete enforceable against an independent freelance developer, and can we replace it with a focused client non-solicitation clause instead?',
    },
    {
      id: 'pi-4',
      title: 'Ambiguous Late Payment & 90-Day Interest Waiver',
      category: 'Payment',
      description:
        'No penalty or interest applies for late payment until the delay exceeds 90 days, despite invoices being Net-30.',
      whyItMatters:
        'Effectively gives the Client up to 3 months to pay without any financial penalty, creating cash flow uncertainty.',
      evidence:
        'Client shall make reasonable efforts to rectify the oversight, but shall not be subject to statutory interest penalties unless delayed beyond ninety (90) days.',
      location: 'Section 2.3',
      confidence: 'High',
      findingType: 'Ambiguous language',
      suggestedQuestion:
        'Can we include a standard late payment fee (e.g. 1.5% monthly interest) for payments delayed past 30 days?',
    },
    {
      id: 'pi-5',
      title: 'Missing Acceptance Criteria & Scope Revisions Protocol',
      category: 'Scope & Acceptance',
      description:
        'The document references Exhibit A but does not specify how milestone acceptance or revision rounds are determined.',
      whyItMatters:
        'Without a defined review period (e.g. 7 days to review deliverables), the client could indefinitely delay formal approval and subsequent tranche release.',
      evidence:
        'Deliverables shall be submitted in accordance with the milestones outlined in Exhibit A.',
      location: 'Section 1.2',
      confidence: 'Medium',
      findingType: 'Missing information',
      suggestedQuestion:
        'What formal acceptance criteria and turnaround timeframe should be specified before a milestone is deemed accepted?',
    },
  ],
  missingInformation: [
    'No explicit milestone acceptance timeline (e.g. Client has 7 business days to test and approve before deemed accepted).',
    'No limitation on rounds of revisions or out-of-scope change order hourly rates.',
    'No force majeure clause addressing unforeseeable technical outages or health emergencies.',
    'No tax allocation or GST/TDS deduction details specified.',
  ],
  legalXRayTree: [
    {
      id: 'node-1',
      title: 'Compensation & Invoicing',
      category: 'Financial',
      sectionRef: 'Section 2',
      summary: '₹50k fixed fee (50/50 split), Net-30 payment, 90-day grace on interest',
      status: 'attention',
      children: [
        {
          id: 'node-1-1',
          title: 'Fixed Project Fee (₹50,000)',
          category: 'Payment',
          sectionRef: 'Section 2.1',
          summary: 'Two 50% tranches tied to commencement and code delivery',
          status: 'normal',
        },
        {
          id: 'node-1-2',
          title: 'Net-30 Invoice Terms',
          category: 'Payment',
          sectionRef: 'Section 2.2',
          summary: 'Client must pay within 30 days of receipt',
          status: 'normal',
        },
        {
          id: 'node-1-3',
          title: '90-Day Late Penalty Waiver',
          category: 'Penalties',
          sectionRef: 'Section 2.3',
          summary: 'Client immune from statutory interest unless delayed 90+ days',
          status: 'attention',
        },
      ],
    },
    {
      id: 'node-2',
      title: 'Intellectual Property & Licensing',
      category: 'IP',
      sectionRef: 'Section 4',
      summary: 'Immediate assignment upon creation before final payment is settled',
      status: 'critical',
      children: [
        {
          id: 'node-2-1',
          title: 'Assignment Upon Creation',
          category: 'IP',
          sectionRef: 'Section 4.1',
          summary: 'Works made for hire with unconditional transfer prior to settlement',
          status: 'critical',
        },
        {
          id: 'node-2-2',
          title: 'Pre-Existing Developer Frameworks',
          category: 'IP',
          sectionRef: 'Section 4.2',
          summary: 'Contractor retains background tools, grants irrevocable license',
          status: 'normal',
        },
      ],
    },
    {
      id: 'node-3',
      title: 'Liability & Indemnification',
      category: 'Risk',
      sectionRef: 'Section 7',
      summary: 'Unlimited contractor liability and unilateral indemnity hold harmless',
      status: 'critical',
      children: [
        {
          id: 'node-3-1',
          title: 'Unlimited Contractor Liability',
          category: 'Liability',
          sectionRef: 'Section 7.2',
          summary: 'No monetary cap on losses, claims, or third-party infringement',
          status: 'critical',
        },
      ],
    },
    {
      id: 'node-4',
      title: 'Term, Termination & Restrictive Covenants',
      category: 'Governance',
      sectionRef: 'Section 3 & 6',
      summary: '30-day no-cause notice, 12-month post-contract non-compete in Karnataka',
      status: 'attention',
      children: [
        {
          id: 'node-4-1',
          title: 'Termination for Convenience (30 Days)',
          category: 'Termination',
          sectionRef: 'Section 3.2',
          summary: 'Either party can exit with 30 days written notice',
          status: 'normal',
        },
        {
          id: 'node-4-2',
          title: '12-Month Sector Non-Compete',
          category: 'Non-compete',
          sectionRef: 'Section 6.1',
          summary: 'Barred from analytics competitors in Karnataka',
          status: 'attention',
        },
      ],
    },
    {
      id: 'node-5',
      title: 'Dispute Resolution & Governing Law',
      category: 'Legal',
      sectionRef: 'Section 8',
      summary: 'Indian law, binding arbitration in Bengaluru under 1996 Act',
      status: 'normal',
      children: [
        {
          id: 'node-5-1',
          title: 'Sole Arbitrator in Bengaluru',
          category: 'Dispute resolution',
          sectionRef: 'Section 8.2',
          summary: 'Private binding arbitration avoids formal civil courts',
          status: 'normal',
        },
      ],
    },
  ],
  beforeYouSignScorecard: [
    {
      id: 'bys-1',
      topic: 'Payment Obligations & Currency',
      question: 'Are the payment tranches, amounts, and dates clearly structured?',
      status: 'needs_clarification',
      finding:
        'Amount (₹50k) and 50/50 split are clear, but late payment enforcement is weakened by a 90-day penalty waiver.',
      clauseRef: 'Section 2.1 - 2.3',
      lawyerPrompt:
        'Ask whether a standard 1.5% monthly late interest charge can replace the 90-day waiver.',
    },
    {
      id: 'bys-2',
      topic: 'Intellectual Property Transfer Point',
      question: 'Does ownership of your work transfer before or after you get paid?',
      status: 'review_recommended',
      finding:
        'Transfers immediately upon creation, even if the final invoice remains unpaid.',
      clauseRef: 'Section 4.1',
      lawyerPrompt:
        'Propose changing "upon creation" to "upon full and cleared receipt of all contractual fees".',
    },
    {
      id: 'bys-3',
      topic: 'Liability Caps & Risk Exposure',
      question: 'Is your potential financial liability capped at a reasonable sum?',
      status: 'review_recommended',
      finding:
        'Contractor liability is explicitly unlimited, exposing you to potentially massive third-party claims.',
      clauseRef: 'Section 7.2',
      lawyerPrompt:
        'Request adding a mutual liability cap equal to total fees paid under the contract.',
    },
    {
      id: 'bys-4',
      topic: 'Post-Termination Non-Compete Restrictions',
      question: 'Does the agreement prevent you from taking other freelance clients?',
      status: 'review_recommended',
      finding:
        'Contains a 12-month non-compete in Karnataka for analytics software.',
      clauseRef: 'Section 6.1',
      lawyerPrompt:
        'Clarify enforceability under Section 27 Indian Contract Act and ask to remove the non-compete.',
    },
    {
      id: 'bys-5',
      topic: 'Termination Notice Periods',
      question: 'Can either party terminate without cause on reasonable notice?',
      status: 'clear',
      finding:
        'Both parties have mutual 30 days written notice rights for convenience.',
      clauseRef: 'Section 3.2',
      lawyerPrompt: 'Verify whether work-in-progress is compensated upon early termination.',
    },
    {
      id: 'bys-6',
      topic: 'Dispute Resolution Venue',
      question: 'Is dispute resolution located in an accessible, fair jurisdiction?',
      status: 'clear',
      finding:
        'Sole arbitrator in Bengaluru, India. Convenient for Bengaluru-based contractor.',
      clauseRef: 'Section 8.2',
      lawyerPrompt: 'Confirm who bears initial arbitration filing costs.',
    },
  ],
  questionsForLawyer: [
    {
      category: 'Before signing',
      questions: [
        {
          id: 'q-bs-1',
          question:
            'How can we amend Section 4.1 so that copyright and IP transfer to the client ONLY upon receipt of full payment?',
          context:
            'Currently the contract assigns all code upon creation, leaving no leverage if the final 50% invoice is withheld.',
          sectionRef: 'Section 4.1',
        },
        {
          id: 'q-bs-2',
          question:
            'What standard language should we use to limit my total liability to the fees received (₹50,000)?',
          context:
            'Section 7.2 currently provides unlimited liability for the solo developer.',
          sectionRef: 'Section 7.2',
        },
      ],
    },
    {
      category: 'Money & payments',
      questions: [
        {
          id: 'q-mp-1',
          question:
            'Can we remove the 90-day penalty holiday in Section 2.3 and replace it with 1.5% interest after 30 days?',
          context:
            'Section 2.3 waives late interest unless the client is overdue by 90 days.',
          sectionRef: 'Section 2.3',
        },
        {
          id: 'q-mp-2',
          question:
            'Should we add a formal 7-day milestone acceptance window so payments cannot be stalled indefinitely?',
          context:
            'No testing or acceptance deadline is currently stated in the body of the agreement.',
          sectionRef: 'Section 1.2',
        },
      ],
    },
    {
      category: 'Termination',
      questions: [
        {
          id: 'q-tm-1',
          question:
            'If the client terminates with 30 days notice under Section 3.2, are they obligated to pay for all hours and milestones worked to date?',
          context:
            'The contract specifies notice but does not explicitly spell out pro-rata payment for work in progress.',
          sectionRef: 'Section 3.2',
        },
      ],
    },
    {
      category: 'Liability',
      questions: [
        {
          id: 'q-lb-1',
          question:
            'Does the indemnification clause in Section 7.2 cover indirect, consequential, or lost profit claims from the client’s end-users?',
          context:
            'The indemnification is broadly written without excluding consequential damages.',
          sectionRef: 'Section 7.2',
        },
      ],
    },
    {
      category: 'Intellectual property',
      questions: [
        {
          id: 'q-ip-1',
          question:
            'Does the license granted for pre-existing tools in Section 4.2 allow the client to sell my background tools independently to third parties?',
          context:
            'Section 4.2 grants an irrevocable, royalty-free, perpetual license.',
          sectionRef: 'Section 4.2',
        },
      ],
    },
    {
      category: 'Disputes',
      questions: [
        {
          id: 'q-dp-1',
          question:
            'Is private arbitration under the 1996 Act financially practical for a ₹50,000 contract dispute?',
          context:
            'Arbitration fees can easily exceed ₹50,000. An informal mediation step may be more proportionate.',
          sectionRef: 'Section 8.2',
        },
      ],
    },
  ],
  actionChecklist: [
    {
      id: 'act-1',
      title: 'Propose IP Transfer upon Full Payment',
      description:
        'Mark up Section 4.1 to ensure code ownership remains with Contractor until the final ₹25,000 invoice clears.',
      sectionRef: 'Section 4.1',
      completed: false,
      priority: 'High',
      category: 'Intellectual Property',
    },
    {
      id: 'act-2',
      title: 'Add Mutual Liability Cap of ₹50,000',
      description:
        'Replace "Contractor liability shall be unlimited" with a standard cap equal to the contract value.',
      sectionRef: 'Section 7.2',
      completed: false,
      priority: 'High',
      category: 'Liability',
    },
    {
      id: 'act-3',
      title: 'Delete 12-Month Non-Compete Clause',
      description:
        'Negotiate removal of Section 6.1 or narrow it to specific named accounts instead of the entire analytics industry in Karnataka.',
      sectionRef: 'Section 6.1',
      completed: false,
      priority: 'High',
      category: 'Restrictive Covenants',
    },
    {
      id: 'act-4',
      title: 'Clarify Milestone Acceptance Window',
      description:
        'Add a clause requiring Client to accept or give written punch-list feedback within 7 calendar days of submission.',
      sectionRef: 'Section 1.2',
      completed: false,
      priority: 'Medium',
      category: 'Scope & Payment',
    },
    {
      id: 'act-5',
      title: 'Shorten 90-Day Late Payment Grace Period',
      description:
        'Tighten Section 2.3 so overdue interest starts immediately if payment is delayed beyond Net-30.',
      sectionRef: 'Section 2.3',
      completed: true,
      priority: 'Medium',
      category: 'Payment',
    },
  ],
  analyzedAt: '2026-10-12T10:30:00.000Z',
  jurisdiction: 'india',
};

export const SAMPLE_COMPARISON_RESULT: ComparisonResult = {
  docAId: 'doc-demo-v1',
  docBId: 'doc-demo-v2',
  docATitle: 'Freelance Agreement — Version 1.0 (Initial Draft)',
  docBTitle: 'Freelance Agreement — Version 2.0 (Revised Negotiation)',
  executiveComparison:
    'Version 2 incorporates major protective improvements for the independent contractor regarding Intellectual Property transfer timing and Liability caps, but reflects trade-offs: total compensation is reduced from ₹50,000 to ₹45,000, invoice payment terms extend from Net-30 to Net-60, and convenience termination notice increases from 30 days to 60 days.',
  stats: {
    added: 2,
    removed: 1,
    modified: 4,
    unchanged: 2,
  },
  differences: [
    {
      id: 'diff-1',
      category: 'Payment & Total Fee',
      clauseTitle: 'Total Project Compensation & Tranches',
      changeType: 'modified',
      docAQuote:
        'Client agrees to pay Contractor a total fixed project fee of ₹50,000... payable in two tranches: fifty percent (50%) upon commencement and fifty percent (50%) upon final code delivery.',
      docBQuote:
        'Client agrees to pay Contractor a renegotiated fixed project fee of ₹45,000... payable in three equal tranches of 33.33% tied to milestone acceptance criteria.',
      whatChanged:
        'Total project fee decreased by ₹5,000 (from ₹50,000 to ₹45,000) and milestone payments split into 3 tranches rather than 2.',
      plainMeaning:
        'You receive ₹5,000 less total revenue, but payments are tied to incremental 33.33% milestones rather than having 50% held until the very end.',
      potentialSignificance:
        'Lower total income, but reduced cash-flow delay risk if the final delivery phase stretches out.',
      questionsToConsider:
        'Does the reduction in total fee align with the added legal protections you received in Version 2?',
    },
    {
      id: 'diff-2',
      category: 'Payment Terms & Invoicing',
      clauseTitle: 'Payment Schedule (Net-30 vs Net-60)',
      changeType: 'modified',
      docAQuote:
        'Invoices submitted by Contractor shall be payable within thirty (30) calendar days of receipt ("Net-30").',
      docBQuote:
        'Invoices submitted by Contractor shall be payable within sixty (60) calendar days of receipt ("Net-60"). Overdue amounts shall accrue interest at the rate of 1.5% per month...',
      whatChanged:
        'Invoice payment window increased from 30 days to 60 days, but enforceable 1.5% monthly late interest is now included.',
      plainMeaning:
        'The Client has twice as long (60 days) to pay each invoice, but can no longer delay indefinitely without paying interest.',
      potentialSignificance:
        'You must budget for a 2-month waiting period after submitting each milestone invoice.',
      questionsToConsider:
        'Can you afford to wait 60 days for each milestone payout, or should you counter-offer Net-45?',
    },
    {
      id: 'diff-3',
      category: 'Intellectual Property',
      clauseTitle: 'Timing of IP Assignment',
      changeType: 'modified',
      docAQuote:
        'Contractor hereby unconditionally assigns all worldwide right, title, and interest... immediately upon creation, irrespective of whether final invoice settlement has occurred.',
      docBQuote:
        'Client and Contractor agree that all title, copyright, and intellectual property rights in the final Deliverables shall be transferred and assigned to Client only upon receipt of full, final, and cleared payment...',
      whatChanged:
        'IP transfer changed from "immediately upon creation" to "only upon receipt of full, final payment".',
      plainMeaning:
        'You retain legal ownership of your code until the Client actually pays every rupee owed.',
      potentialSignificance:
        'Substantial increase in Contractor security. If the Client defaults, you still legally own the software.',
      questionsToConsider:
        'This is a major win for the contractor. Ensure the evaluation license clause in Version 2 is properly understood.',
    },
    {
      id: 'diff-4',
      category: 'Liability & Indemnification',
      clauseTitle: 'Contractor Liability Cap',
      changeType: 'modified',
      docAQuote: "Contractor's liability under this Agreement shall be unlimited.",
      docBQuote:
        "To the maximum extent permitted by law, each Party's aggregate total liability under this Agreement shall be strictly capped at the total fees actually paid to Contractor in the preceding three (3) months.",
      whatChanged:
        'Switched from unlimited contractor liability to a mutual cap limited to 3 months of fees.',
      plainMeaning:
        'Your maximum financial exposure in any dispute is now capped at the fees you actually received, rather than unlimited personal liability.',
      potentialSignificance:
        'Drastically reduces personal financial and legal bankruptcy risk.',
      questionsToConsider:
        'Verify if third-party IP indemnity claims are also covered under this liability cap.',
    },
    {
      id: 'diff-5',
      category: 'Termination Notice',
      clauseTitle: 'Termination for Convenience Period',
      changeType: 'modified',
      docAQuote:
        'Either Party may terminate this Agreement without cause upon providing thirty (30) days prior written notice...',
      docBQuote:
        'Either Party may terminate this Agreement without cause upon providing sixty (60) days prior written notice...',
      whatChanged:
        'Notice required to terminate without cause increased from 30 days to 60 days.',
      plainMeaning:
        'Both sides must give 2 months advance notice instead of 1 month before walking away.',
      potentialSignificance:
        'Provides more stability and advance warning, but makes it harder to exit quickly if the working relationship turns sour.',
      questionsToConsider:
        'If the client gives 60 days notice, are you required to keep delivering work for those full 60 days?',
    },
    {
      id: 'diff-6',
      category: 'Non-Compete',
      clauseTitle: '12-Month Sector Non-Compete Restriction',
      changeType: 'removed',
      docAQuote:
        'During the term of this Agreement and for a period of twelve (12) months thereafter, Contractor shall not directly or indirectly provide software engineering services to any competitor...',
      docBQuote:
        'The Parties agree that given Contractor’s independent professional status, no general non-compete covenant applies. Contractor remains free to provide software engineering services to any third party...',
      whatChanged:
        'The 12-month post-contract non-compete restriction has been completely removed in Version 2.',
      plainMeaning:
        'You are 100% free to take clients in the analytics sector immediately after this contract ends.',
      potentialSignificance:
        'Protects your core livelihood and aligns with Section 27 of the Indian Contract Act.',
      questionsToConsider:
        'Confirm that you still comply with confidentiality regarding Client trade secrets.',
    },
    {
      id: 'diff-7',
      category: 'Dispute Resolution',
      clauseTitle: 'Pre-Arbitration Amicable Negotiation & Mediation',
      changeType: 'added',
      docAQuote: 'Disputes go directly to binding arbitration in Bengaluru.',
      docBQuote:
        'The Parties agree to first attempt 30 days of good-faith executive discussion and mediation before initiating arbitration in Bengaluru...',
      whatChanged:
        'Added a mandatory 30-day informal mediation step before expensive arbitration can be initiated.',
      plainMeaning:
        'Neither party can immediately haul the other into expensive arbitration proceedings without trying to talk first.',
      potentialSignificance:
        'Saves substantial legal expenses and arbitration tribunal filing costs for minor disputes.',
      questionsToConsider:
        'Who selects the mediator if executive discussions do not resolve the issue?',
    },
  ],
  comparedAt: '2026-10-18T14:45:00.000Z',
};

export const INITIAL_DEMO_DOCUMENTS: LegalDocument[] = [
  {
    id: 'doc-demo-v1',
    title: 'Freelance Agreement — Version 1.0 (Initial Draft)',
    documentType: 'Freelance Services Agreement',
    rawText: CONTRACT_V1_TEXT,
    wordCount: 780,
    uploadedAt: '2026-10-12T10:30:00.000Z',
    isDemo: true,
    sections: [
      {
        id: 'sec-1',
        number: '1',
        title: 'SCOPE OF SERVICES & DELIVERABLES',
        content:
          '1.1 Services. Contractor shall provide full-stack software development services, API architecture, frontend components, and backend database integrations for Client\'s automated customer intelligence platform.\n1.2 Timelines. Deliverables shall be submitted in accordance with the milestones outlined in Exhibit A.',
        startLine: 18,
        endLine: 24,
      },
      {
        id: 'sec-2',
        number: '2',
        title: 'COMPENSATION & PAYMENT TERMS',
        content:
          '2.1 Compensation. Client agrees to pay Contractor a total fixed project fee of ₹50,000...\n2.2 Payment Schedule. Invoices submitted by Contractor shall be payable within thirty (30) calendar days of receipt ("Net-30").\n2.3 Ambiguous Late Payment. Client shall make reasonable efforts to rectify oversight, but shall not be subject to statutory interest penalties unless delayed beyond ninety (90) days.',
        startLine: 26,
        endLine: 34,
      },
      {
        id: 'sec-3',
        number: '3',
        title: 'TERM & TERMINATION',
        content:
          '3.1 Term. Commences on Effective Date and continues for six (6) months.\n3.2 Termination for Convenience. Either Party may terminate without cause upon providing thirty (30) days\' prior written notice.\n3.3 Immediate Termination for Breach. Immediate termination upon material breach after 14 days cure notice.',
        startLine: 36,
        endLine: 43,
      },
      {
        id: 'sec-4',
        number: '4',
        title: 'INTELLECTUAL PROPERTY RIGHTS & WORK FOR HIRE',
        content:
          '4.1 Assignment upon Creation. Contractor unconditionally assigns all worldwide right, title, and interest in Deliverables immediately upon creation, irrespective of whether final invoice settlement has occurred.\n4.2 Pre-Existing Tools. Contractor retains ownership of pre-existing utility libraries, granting irrevocable royalty-free license.',
        startLine: 45,
        endLine: 52,
      },
      {
        id: 'sec-5',
        number: '5',
        title: 'CONFIDENTIALITY & NON-DISCLOSURE',
        content:
          '5.1 Definition. Technical data, trade secrets, customer lists, and code.\n5.2 Obligations. Contractor shall protect Confidential Information with reasonable care for two (2) years following termination.',
        startLine: 54,
        endLine: 61,
      },
      {
        id: 'sec-6',
        number: '6',
        title: 'RESTRICTIVE COVENANTS & NON-COMPETE',
        content:
          '6.1 Non-Compete. During term and for twelve (12) months thereafter, Contractor shall not provide software engineering services to competitors in customer analytics in Karnataka.\n6.2 Non-Solicitation. No solicitation of employees or clients for 18 months.',
        startLine: 63,
        endLine: 69,
      },
      {
        id: 'sec-7',
        number: '7',
        title: 'WARRANTIES & LIMITATION OF LIABILITY',
        content:
          '7.1 Warranty. Code is original and non-infringing.\n7.2 Unlimited Contractor Liability. Contractor shall indemnify and hold harmless Client. Contractor\'s liability under this Agreement shall be unlimited.',
        startLine: 71,
        endLine: 77,
      },
      {
        id: 'sec-8',
        number: '8',
        title: 'DISPUTE RESOLUTION & GOVERNING LAW',
        content:
          '8.1 Governing Law. Substantive laws of India.\n8.2 Dispute Resolution. Binding arbitration before a sole arbitrator in Bengaluru, India under Arbitration and Conciliation Act, 1996.',
        startLine: 79,
        endLine: 86,
      },
    ],
    analysis: SAMPLE_V1_ANALYSIS,
  },
  {
    id: 'doc-demo-v2',
    title: 'Freelance Agreement — Version 2.0 (Revised Negotiation)',
    documentType: 'Freelance Services Agreement',
    rawText: CONTRACT_V2_TEXT,
    wordCount: 810,
    uploadedAt: '2026-10-18T14:45:00.000Z',
    isDemo: true,
    sections: [
      {
        id: 'sec-v2-1',
        number: '1',
        title: 'SCOPE OF SERVICES & DELIVERABLES',
        content: '1.1 Services & Timelines as negotiated.',
        startLine: 18,
        endLine: 24,
      },
      {
        id: 'sec-v2-2',
        number: '2',
        title: 'COMPENSATION & PAYMENT TERMS',
        content: '2.1 ₹45,000 fee in 3 tranches.\n2.2 Net-60 terms.\n2.3 1.5% monthly late interest.',
        startLine: 26,
        endLine: 35,
      },
      {
        id: 'sec-v2-3',
        number: '3',
        title: 'TERM & TERMINATION',
        content: '3.1 6-month term.\n3.2 60 days convenience notice.',
        startLine: 37,
        endLine: 44,
      },
      {
        id: 'sec-v2-4',
        number: '4',
        title: 'INTELLECTUAL PROPERTY RIGHTS',
        content: '4.1 IP transfers ONLY upon receipt of full payment.',
        startLine: 46,
        endLine: 53,
      },
      {
        id: 'sec-v2-5',
        number: '5',
        title: 'CONFIDENTIALITY & NON-DISCLOSURE',
        content: '5.1 Mutual confidentiality.\n5.2 Indefinite for trade secrets, 5 years for general data.',
        startLine: 55,
        endLine: 62,
      },
      {
        id: 'sec-v2-6',
        number: '6',
        title: 'RESTRICTIVE COVENANTS',
        content: '6.1 Non-compete explicitly excluded.\n6.2 Non-solicitation for 6 months.',
        startLine: 64,
        endLine: 71,
      },
      {
        id: 'sec-v2-7',
        number: '7',
        title: 'WARRANTIES & CAPPED LIABILITY',
        content: '7.1 Mutual warranties.\n7.2 Total aggregate liability capped at fees paid in preceding 3 months.',
        startLine: 73,
        endLine: 80,
      },
      {
        id: 'sec-v2-8',
        number: '8',
        title: 'DISPUTE RESOLUTION',
        content: '8.1 Laws of India.\n8.2 Mandatory 30-day amicable mediation prior to arbitration.',
        startLine: 82,
        endLine: 90,
      },
    ],
  },
  {
    id: 'doc-demo-nda',
    title: 'Mutual Non-Disclosure Agreement (Demo NDA)',
    documentType: 'Non-Disclosure Agreement',
    rawText: CONTRACT_NDA_TEXT,
    wordCount: 420,
    uploadedAt: '2026-11-01T09:15:00.000Z',
    isDemo: true,
    sections: [
      {
        id: 'sec-nda-1',
        number: '1',
        title: 'PURPOSE',
        content: 'Explore strategic technology collaboration and investment opportunity.',
        startLine: 8,
        endLine: 12,
      },
      {
        id: 'sec-nda-2',
        number: '2',
        title: 'CONFIDENTIAL INFORMATION & EXCLUSIONS',
        content: 'Marked or reasonably understood confidential information, excluding public domain.',
        startLine: 14,
        endLine: 24,
      },
      {
        id: 'sec-nda-3',
        number: '3',
        title: 'OBLIGATIONS & TERM',
        content: 'Strict confidence, need-to-know access only, 3-year term.',
        startLine: 26,
        endLine: 36,
      },
      {
        id: 'sec-nda-4',
        number: '4',
        title: 'RETURN OF MATERIALS & GOVERNING LAW',
        content: 'Return or destroy within 10 business days. Delaware governing law.',
        startLine: 38,
        endLine: 48,
      },
    ],
  },
];
