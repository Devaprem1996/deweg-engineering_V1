export interface ExpertiseDomainAsset {
  id: string;
  title: string;
  caption: string;
  url: string;
  type: 'image' | 'gif';
  tag?: string;
}

export interface ExpertiseDomain {
  id: string;
  number: string;
  code: string;
  title: string;
  summary: string;
  description: string;
  keyPillars: string[];
  deliverables: string[];
  softwareStack: string[];
  standards: string[];
  featuredAsset?: ExpertiseDomainAsset;
  gallery: ExpertiseDomainAsset[];
}

export const EXPERTISE_HERO_ASSET = {
  url: 'https://static.wixstatic.com/media/5080f1_927162da936842dd8b80a0990fafcb37~mv2.jpg',
  title: 'Engineering Reference & Blueprint Gallery',
  alt: 'Deweg Engineering Reference Portfolio and Technical Blueprint Model'
};

export const EXPERTISE_DOMAINS: ExpertiseDomain[] = [
  {
    id: 'project-management',
    number: '01',
    code: 'PM-CTRL',
    title: 'Project Management and Controlling',
    summary:
      'Our systems manage design flow across stakeholders using milestone mapping, risk flagging, and control-point reviews. We manage visibility and predictability.',
    description:
      'We bring institutional certainty and predictability to engineering execution. Using rigorous milestone mapping, proactive risk flagging, and control-point verification gates, our project management protocols ensure multi-disciplinary design synchronization between structural, architectural, MEP, and site contractor teams.',
    keyPillars: [
      'Milestone Mapping & Target Critical Paths',
      'Proactive Risk Flagging & Mitigation Protocols',
      'Control-Point Reviews & Multi-Stage Gate Checks',
      'Cross-Disciplinary Stakeholder Coordination',
      'Executive Visibility & Delivery Predictability'
    ],
    deliverables: [
      'Master Design Schedule & Work Breakdown Structure (WBS)',
      'Engineering Design Flow Approval Matrices',
      'Weekly Risk & Variance Tracking Registers',
      'Design Change Notice (DCN) Audit Transmittals',
      'Integrated Project Review Deliverables'
    ],
    softwareStack: ['Primavera P6', 'MS Project', 'Proprietary DEWEG Controlling Portal', 'BIM 360', 'Asana PM'],
    standards: ['PMI PMBOK Standards', 'ISO 9001:2015 Quality Management', 'Agile Engineering Delivery Protocol'],
    featuredAsset: {
      id: 'pm-chart-1',
      title: 'Engineering Design Flow & Controlling Framework (Chart 1)',
      caption:
        'Official Deweg project management architecture mapping out design inputs, milestone control-points, peer review stages, client transmittals, and field erection feedback loops.',
      url: 'https://static.wixstatic.com/media/5080f1_cc3dbc3b00da43c293f5cdead7583a73~mv2.jpg',
      type: 'image',
      tag: 'Workflow Chart'
    },
    gallery: [
      {
        id: 'pm-chart-1-gallery',
        title: 'Project Management & Controlling Process Flow',
        caption:
          'Comprehensive engineering milestone mapping, stakeholder alignment matrix, and risk mitigation protocol diagram.',
        url: 'https://static.wixstatic.com/media/5080f1_cc3dbc3b00da43c293f5cdead7583a73~mv2.jpg',
        type: 'image',
        tag: 'Controlling Flow'
      }
    ]
  },
  {
    id: 'structural-design',
    number: '02',
    code: 'STR-ENG',
    title: 'Structural Design and Detailed Engineering',
    summary:
      'From concept to construction-level, we execute reinforced concrete and steel systems that meet design intent and code compliance across industries. Our detailing ensures clarity for constructability. Design concept development for Removing, Demolition and Replacement of existing structures.',
    description:
      'We turn complex loading criteria, seismic conditions, and architectural designs into constructible, code-compliant structural frameworks. Our engineering covers foundations, high-rise frames, shear cores, transfer slabs, and specialized protocols for structural removal, demolition sequencing, and retrofitting replacement.',
    keyPillars: [
      'Concept-to-Construction Reinforced Concrete & Steel Systems',
      'Constructability-Driven Rebar & Joint Detailing',
      'Code Compliance across IS, ACI, Eurocode, and British Standards',
      'Foundation & Deep Substructure Load Engineering',
      'Demolition, Removal & Structural Replacement Sequences'
    ],
    deliverables: [
      'Comprehensive Structural Design Calculations & Analysis Models',
      'Reinforced Concrete General Arrangement & Section Drawings',
      'Column-Beam Splice & Shear Wall Reinforcement Schedules',
      'Substructure Foundation, Raft & Pile Cap Reinforcement Plans',
      'Demolition Phasing, Propping & Replacement Method Statements'
    ],
    softwareStack: ['STAAD.Pro', 'ETABS', 'SAFE', 'AutoCAD', 'Revit Structure'],
    standards: ['IS 456 / IS 1893 / IS 875', 'ACI 318-19', 'Eurocode 2 / BS 8110', 'AISC 360-16'],
    featuredAsset: {
      id: 'struct-model-1',
      title: 'High-Rise Structural Finite Element Model',
      caption:
        '3D structural analysis elevation visualizing gravity load dispersal, lateral seismic forces, and shear core performance.',
      url: 'https://static.wixstatic.com/media/5080f1_75501b6bc0eb49b1aabae72cd58676c5~mv2.jpg',
      type: 'image',
      tag: 'FEA Analysis'
    },
    gallery: [
      {
        id: 'struct-1',
        title: 'Reinforced Concrete Framing & Column Detailing',
        caption:
          'High-density structural concrete framing model with beam-column junction reinforcement and clear cover compliance.',
        url: 'https://static.wixstatic.com/media/5080f1_7e7a04d49bd34cb2aea57752fc3259a7~mv2.jpg',
        type: 'image',
        tag: 'RC Framing'
      },
      {
        id: 'struct-2',
        title: 'Foundation Mat & Shear Reinforcement Layout',
        caption:
          'Substructure foundation detailing verifying heavy vertical column loads, punching shear resistance, and tie beams.',
        url: 'https://static.wixstatic.com/media/5080f1_c05f1fbd09574a78b34e514060c1db6c~mv2.jpg',
        type: 'image',
        tag: 'Substructure'
      },
      {
        id: 'struct-3',
        title: 'High-Rise 3D Structural System Render',
        caption:
          'Complete tower structural skeleton showing continuous load paths from penthouse transfers to pile caps.',
        url: 'https://static.wixstatic.com/media/5080f1_75501b6bc0eb49b1aabae72cd58676c5~mv2.jpg',
        type: 'image',
        tag: 'Tower Frame'
      },
      {
        id: 'struct-4',
        title: 'Column-Slab Junction & Rebar Detailing Plan',
        caption:
          'Precision structural reinforcement layout prepared for casting, bar bending schedules (BBS), and site placement.',
        url: 'https://static.wixstatic.com/media/5080f1_5eef496ed8f94cf5b2f3090d869cd19f~mv2.jpg',
        type: 'image',
        tag: 'Rebar BBS'
      },
      {
        id: 'struct-5',
        title: 'Structural Constructability & 3D Simulation Walkthrough',
        caption:
          '3D simulation verify erection access, formwork strike cycles, and concrete pour staging.',
        url: 'https://static.wixstatic.com/media/5080f1_ab0488352c29439b99818467cd3e9c3ef000.jpg',
        type: 'image',
        tag: 'Simulation'
      }
    ]
  },
  {
    id: 'bim-solutions',
    number: '03',
    code: 'BIM-LOD',
    title: 'Building Information Modelling - BIM Solutions',
    summary:
      'We operate across various “LEVEL OF DETAILING” depending on the project stage and requirement. BIM is used not only for visualisation, it contains multidisciplinary data for coordination, clash detection, quantity reliability, and schedule simulation. Output integrity is prioritised over digital aesthetics. Also prepare as-built model “POINT CLOUD DATA TO MODEL” for retrofitting analysis.',
    description:
      'Our BIM solutions prioritize engineering truth and data reliability over cosmetic graphics. Delivering LOD 100 through LOD 500 information models, we combine multi-disciplinary data for real-time clash resolution, exact material quantities, 4D schedule simulation, and point-cloud scan-to-BIM modeling for historic or existing structures.',
    keyPillars: [
      'Multi-Tier LOD Delivery (LOD 100 Conceptual to LOD 500 As-Built)',
      'Zero-Tolerance Multi-Disciplinary Clash Detection & Spatial Audits',
      'Point Cloud Laser Scan-to-BIM Conversion for Retrofitting',
      '4D Construction Scheduling & Time-Lapse Site Simulation',
      '5D Cost & High-Precision Material Take-Off (MTO) Verification'
    ],
    deliverables: [
      'Federated Navisworks BIM Coordination Models & Clash Reports',
      'LOD 350 / 400 Shop & Fabrication Ready BIM Models',
      'Point-Cloud Laser Survey Calibrated As-Built Revit Models',
      '4D Time-Lined Erection Animation Deliverables',
      'COBie Data Sheets & Facility Asset Management Parameters'
    ],
    softwareStack: ['Autodesk Revit', 'Navisworks Manage', 'Autodesk Recap Pro', 'BIM 360', 'Solibri Model Checker'],
    standards: ['ISO 19650-1 & 2 Standards', 'AIA BIM Protocol (E202/G202)', 'BuildingSMART openBIM (IFC)'],
    featuredAsset: {
      id: 'bim-federated-1',
      title: 'Federated Multi-Disciplinary Coordination Model',
      caption:
        'Complete spatial coordination combining architectural skin, structural reinforced concrete, and dense MEP distribution.',
      url: 'https://static.wixstatic.com/media/5080f1_157a04e9f69b42ad8ff76c6db10cdbb3~mv2.jpg',
      type: 'image',
      tag: 'Federated Model'
    },
    gallery: [
      {
        id: 'bim-1',
        title: 'Federated Multi-Disciplinary Coordination Model',
        caption:
          'Fully integrated structural, architectural, and building services spatial verification in Autodesk Revit.',
        url: 'https://static.wixstatic.com/media/5080f1_157a04e9f69b42ad8ff76c6db10cdbb3~mv2.jpg',
        type: 'image',
        tag: 'LOD 400'
      },
      {
        id: 'bim-2',
        title: 'MEP-to-Structural Clash Detection & Penetration Routing',
        caption:
          'Automated clash detection pinpointing hard/soft collisions between primary duct mains and structural beams.',
        url: 'https://static.wixstatic.com/media/5080f1_b1627f6b36894b5e9e6f1d6d17e1a300~mv2.jpg',
        type: 'image',
        tag: 'Clash Audit'
      },
      {
        id: 'bim-3',
        title: 'Point Cloud Laser Scan to As-Built BIM Model',
        caption:
          'Million-point LiDAR scan registration converted into sub-millimeter BIM geometry for retrofitting existing facilities.',
        url: 'https://static.wixstatic.com/media/5080f1_69909d2e9af546ffbe97041702aed690~mv2.jpg',
        type: 'image',
        tag: 'Scan to BIM'
      },
      {
        id: 'bim-4',
        title: '4D Construction Milestone & Staging Simulation',
        caption:
          'Time-linked BIM sequencing validating logistical crane radii, pour staging, and steel erection schedules.',
        url: 'https://static.wixstatic.com/media/5080f1_e337a4d98df8430c960c3312b4d4a0e7f000.jpg',
        type: 'image',
        tag: '4D Staging'
      },
      {
        id: 'bim-5',
        title: 'High-Density Mechanical Plant Room Detailing',
        caption:
          'LOD 400 mechanical pump room detailing with precise valve elevations, hanger locations, and maintenance access clearance.',
        url: 'https://static.wixstatic.com/media/5080f1_f3bf0452b6fd47b9835bfe21af1d41b2~mv2.jpg',
        type: 'image',
        tag: 'Plant Room'
      },
      {
        id: 'bim-6',
        title: 'Architectural & Structural Synchronized BIM View',
        caption:
          'Synchronized model slice highlighting perimeter spandrels, window wall connections, and ceiling void coordination.',
        url: 'https://static.wixstatic.com/media/5080f1_23d77749ee87426ca7214e8eb529c17a~mv2.jpg',
        type: 'image',
        tag: 'Arch-Sync'
      },
      {
        id: 'bim-7',
        title: 'Virtual Facility Operations & Walkthrough Review',
        caption:
          'High-integrity digital twin configured for client review, contractor constructability workshops, and asset tags.',
        url: 'https://static.wixstatic.com/media/5080f1_9d5a50b68d2d46b58a50515d596842cbf000.jpg',
        type: 'image',
        tag: 'Digital Twin'
      },
      {
        id: 'bim-8',
        title: 'Steel-to-Concrete Embedded Connection Detailing',
        caption:
          'Cast-in steel baseplates, anchor bolts, and shear lug embeds modeled to eliminate field welding rework.',
        url: 'https://static.wixstatic.com/media/5080f1_0d40622da5464c4fa598406d7132f0ab~mv2.jpg',
        type: 'image',
        tag: 'Embeds'
      },
      {
        id: 'bim-9',
        title: 'Facade Enclosure & Fenestration BIM Model',
        caption:
          'Curtain wall mullion anchoring, perimeter expansion joints, and thermal barrier alignment in 3D.',
        url: 'https://static.wixstatic.com/media/5080f1_330659392d9f4fb386cbb5415db679db~mv2.jpg',
        type: 'image',
        tag: 'Envelope'
      }
    ]
  },
  {
    id: 'structural-steel',
    number: '04',
    code: 'STL-DET',
    title: 'Structural Steel Modelling and Detailed Engineering',
    summary:
      'Our steel deliverables are focused on erection logic, bolt design, connection detailing, and fabrication-ready drawings. This includes integration with shop drawing ecosystems and revision-tracked outputs.',
    description:
      'Precision structural steel detailing bridging the gap between design engineering and fabrication shop floors. We engineer every connection, bolt pattern, weld detail, and erection mark in Tekla Structures, delivering CNC NC1 files, assembly drawings, and mill order schedules that eliminate fabrication error.',
    keyPillars: [
      'Fabrication-Ready Tekla Structures 3D Modeling',
      'Erection Logic & Crane Rigging Sequence Analysis',
      'Bolt Group Engineering & Moment-Resisting Connection Design',
      'Integration with Automated CNC/NC1 Steel Fabrication Lines',
      'Revision-Controlled Drawing Packages & Part Marking Trees'
    ],
    deliverables: [
      'Advanced Bill of Materials (ABM) for Mill Ordering',
      'Erection Marking Plans & 3D Site Erection Isometric Sheets',
      'Single-Part & Multi-Part Shop Assembly Fabrication Drawings',
      'CNC Machine Data (DSTV, NC1, and DXF Output Files)',
      'Connection Design Calculation Packages with Stamped Reports'
    ],
    softwareStack: ['Tekla Structures', 'IDEA StatiCa', 'AutoCAD Structural Detailing', 'SDS/2', 'RAM Connection'],
    standards: ['AISC 303 (Code of Standard Practice)', 'AISC 360 & 341 (Seismic)', 'NISD Detailing Standards', 'BS 5950 / EN 1993'],
    featuredAsset: {
      id: 'steel-featured-1',
      title: 'Heavy Industrial Truss & Moment Connection Detailing',
      caption:
        'Detailed Tekla Structures steel model highlighting high-strength bolted gusset plates, chord splices, and stiffener plates.',
      url: 'https://static.wixstatic.com/media/5080f1_2cba47f4712e42af93325e48116d76ee~mv2.jpg',
      type: 'image',
      tag: 'Tekla Model'
    },
    gallery: [
      {
        id: 'steel-1',
        title: 'Heavy Industrial Truss & Moment Connection Detailing',
        caption:
          'High-capacity bolted moment connection with fitted stiffeners, coping clearances, and weld preparation details.',
        url: 'https://static.wixstatic.com/media/5080f1_2cba47f4712e42af93325e48116d76ee~mv2.jpg',
        type: 'image',
        tag: 'Truss Detailing'
      },
      {
        id: 'steel-2',
        title: 'Fabrication-Ready Structural Steel Assembly & Node Model',
        caption:
          'Full structural steel assembly generated in Tekla showing shop welds, bolt gauges, and piece mark allocations.',
        url: 'https://static.wixstatic.com/media/5080f1_02017922add94d5890f411c97d7ed3c6~mv2.jpg',
        type: 'image',
        tag: 'Assembly'
      }
    ]
  },
  {
    id: 'oil-and-gas',
    number: '05',
    code: 'O&G-OFF',
    title: 'Oil & Gas Structural Design and Detailed Engineering',
    summary:
      'High-risk sectors demand high-precision workflows. We operate with strict adherence to offshore/onshore standards, ensuring safety-critical structures are verified at both design and review stages.',
    description:
      'Offshore and onshore energy infrastructure demands zero room for error. We provide rigorous structural analysis and detailed engineering for fixed jacket platforms, topside process modules, flare booms, helidecks, and heavy industrial petrochemical pipe racks adhering to stringent international safety standards.',
    keyPillars: [
      'Strict Adherence to API, DNV-GL, and AISC Offshore Standards',
      'Hydrodynamic Wave, Current, and Vortex-Induced Vibration (VIV) Analysis',
      'Extreme Storm, Blast Overpressure, and Fatigue Life Verification',
      'Modular Topside Skids & Heavy Lift Rigging Engineering',
      'Safety-Critical Structure Peer Audits and Design Review Verification'
    ],
    deliverables: [
      'Offshore Jacket & Topside Primary Structural Design Reports',
      'Hydrodynamic Wave & Current In-Service Analysis Deliverables',
      'Lifting, Transportation & Load-Out Rigging Calculation Packages',
      'Fatigue Life Evaluation & Joint S-N Curve Analysis',
      'Pipe Rack & Industrial Skid Fabrication Drawing Transmittals'
    ],
    softwareStack: ['SACS', 'STAAD.Pro Offshore', 'ANSYS', 'AutoCAD', 'Navisworks'],
    standards: ['API RP 2A-WSD / LRFD', 'DNV-GL Offshore Standards', 'AISC 360-16', 'ASME B31.3 Pipe Support Criteria'],
    featuredAsset: {
      id: 'oil-gas-gif-1',
      title: 'Offshore Platform Dynamic Marine Loading Simulation',
      caption:
        'Live engineering animation validating hydrodynamic wave impact, cyclical crest forces, and jacket tubular deflection (OT1.25.gif).',
      url: 'https://static.wixstatic.com/media/5080f1_163f6aa3a5a3408c95273f97b549fc8c~mv2.gif',
      type: 'gif',
      tag: 'Dynamic GIF'
    },
    gallery: [
      {
        id: 'oil-gas-1',
        title: 'Offshore Dynamic Hydrodynamic Simulation',
        caption:
          'Simulated wave crest and ocean current interaction across multi-leg jacket platform tubular members.',
        url: 'https://static.wixstatic.com/media/5080f1_163f6aa3a5a3408c95273f97b549fc8c~mv2.gif',
        type: 'gif',
        tag: 'Marine Simulation'
      },
      {
        id: 'oil-gas-2',
        title: 'Offshore Jacket & Topside Module Structural Engineering (2.2.3)',
        caption:
          '3D engineering model of full offshore production facility including multi-deck process module and cantilevered helideck.',
        url: 'https://static.wixstatic.com/media/5080f1_56d6babca4eb4d3e9dce1a9ac3e23ef0~mv2.jpg',
        type: 'image',
        tag: 'Jacket Topside'
      },
      {
        id: 'oil-gas-3',
        title: 'Petrochemical Pipe Rack & Equipment Support Skid',
        caption:
          'Heavy industrial process facility pipe rack engineered for thermal pipe friction, anchor thrusts, and lateral seismic loads.',
        url: 'https://static.wixstatic.com/media/5080f1_8a581fbb25b140b493b739606c83ea57~mv2.jpg',
        type: 'image',
        tag: 'Pipe Rack'
      }
    ]
  },
  {
    id: 'mep-design',
    number: '06',
    code: 'MEP-ENG',
    title: 'MEP Design and Detailed Engineering',
    summary:
      'We offer MEP design where integration is key—balancing electrical, and plumbing layouts in confined or complex structural zones. Emphasis is on zoning clarity, load efficiency, and maintenance accessibility.',
    description:
      'Modern buildings depend on seamless building services integration. We design Mechanical, Electrical, and Plumbing (MEP) systems with deep structural alignment, ensuring that ductwork, cable trays, and drainage piping integrate cleanly within tight ceiling voids and vertical shafts without structural clashes.',
    keyPillars: [
      'Multi-Disciplinary Integration within Constrained Structural Zones',
      'HVAC Duct Zoning, Air Balance & Pressure Drop Optimization',
      'Electrical Cable Containment, Busway Routing & EMI Separation',
      'Public Health (Plumbing, Stormwater & Fire Suppression) Alignment',
      'Guaranteed Maintenance Clearances & Operational Accessibility'
    ],
    deliverables: [
      'Coordinated MEP General Arrangement Plans & Riser Schematics',
      'HVAC Air Flow Sizing & Duct Routing Construction Drawings',
      'Electrical Cable Tray & Main Distribution Board Layouts',
      'Water Supply, Drainage & Fire Standpipe Engineered Packages',
      'Builders Work in Connection (BWIC) Penetration Opening Schedules'
    ],
    softwareStack: ['Revit MEP', 'AutoCAD MEP', 'Navisworks Manage', 'Dialux evo', 'HAP (Carrier)'],
    standards: ['ASHRAE Fundamentals & 62.1', 'NFPA 13 / 14 / 20 Standards', 'NEC (National Electrical Code)', 'IPC / UPC Plumbing Codes'],
    featuredAsset: {
      id: 'mep-featured-1',
      title: 'HVAC Air Distribution & Primary Ductwork Coordination',
      caption:
        'Engineered duct routing through structural web openings maintaining aerodynamic efficiency and ceiling elevation.',
      url: 'https://static.wixstatic.com/media/5080f1_32c02c46c745402b886f2bf0a218fbdd~mv2.jpg',
      type: 'image',
      tag: 'HVAC Duct'
    },
    gallery: [
      {
        id: 'mep-1',
        title: 'HVAC Air Distribution & Primary Ductwork Coordination',
        caption:
          'Precision duct layout balanced for minimum friction loss, silencer placement, and structural clearance.',
        url: 'https://static.wixstatic.com/media/5080f1_32c02c46c745402b886f2bf0a218fbdd~mv2.jpg',
        type: 'image',
        tag: 'HVAC Air'
      },
      {
        id: 'mep-2',
        title: 'Electrical Containment & Low-Voltage Cable Tray Routing',
        caption:
          'Tiered cable tray routing separating high-voltage power conduits, data cabling, and emergency backup feeds.',
        url: 'https://static.wixstatic.com/media/5080f1_96f150ab9af247e4b9d0369a21264fe2~mv2.jpg',
        type: 'image',
        tag: 'Electrical'
      },
      {
        id: 'mep-3',
        title: 'Plumbing Drainage & Fire Suppression Piping Network',
        caption:
          'Gravity drainage fall slopes, vent stacks, and sprinkler branch lines coordinated through service corridors.',
        url: 'https://static.wixstatic.com/media/5080f1_657cdea5c8c646d1a4734f63321fd421~mv2.jpg',
        type: 'image',
        tag: 'PHE & Fire'
      }
    ]
  },
  {
    id: 'information-technology',
    number: '07',
    code: 'IT-AUTO',
    title: 'Information Technology',
    summary:
      'Our proprietary internal tools and automations support drawing checks, quantity generation, and file tracking. We also develop custom engineering dashboards for project health, drawing submissions, and version history.',
    description:
      'Digital infrastructure accelerates engineering accuracy. DEWEG pioneers custom automation scripts, algorithmic drawing auditors, parametric quantity take-off engines, and cloud-hosted project health dashboards that monitor submission cycles, revision deltas, and client milestone delivery in real time.',
    keyPillars: [
      'Proprietary Automated Drawing QA/QC Validation Scripts',
      'Algorithmic Quantity Generation & Parameter Discrepancy Checks',
      'Automated Revision Delta & Document Transmittal Tracking',
      'Custom Real-Time Engineering Dashboards & Health Metrics',
      'API Integrations across Tekla, Revit, and Cloud Workspaces'
    ],
    deliverables: [
      'DEWEG Internal Quality Verification Tool Suite',
      'Live Web-Based Client Project Progress & Submission Dashboards',
      'Automated BOM/MTO Generation Utilities & Excel Bridges',
      'Cloud File Versioning & Transmittal Tracking Audit Trails',
      'Custom Parametric Plug-ins for Autodesk Revit & Tekla API'
    ],
    softwareStack: ['Python / Dynamo / .NET', 'Tekla Open API', 'Revit API', 'React / TypeScript Dashboards', 'PostgreSQL / Cloud Engine'],
    standards: ['CMMI-aligned Software Practices', 'SOC-2 Data Security Protocols', 'ISO 27001 Information Security'],
    featuredAsset: {
      id: 'it-dashboard-1',
      title: 'Custom Engineering Dashboard & Automated Project Tracking (InfoT_edited)',
      caption:
        'Proprietary DEWEG software dashboard providing live telemetry on drawing completion rates, QA checklists, revision history, and transmittal approvals.',
      url: 'https://static.wixstatic.com/media/5080f1_3d5b1b84a27245b68bdc266f3502ced0~mv2.jpg',
      type: 'image',
      tag: 'Custom Dashboard'
    },
    gallery: [
      {
        id: 'it-1',
        title: 'Custom Engineering Dashboard & Project Health Metrics',
        caption:
          'Proprietary engineering workflow portal tracking live deliverables, model clash history, and milestone sign-offs.',
        url: 'https://static.wixstatic.com/media/5080f1_3d5b1b84a27245b68bdc266f3502ced0~mv2.jpg',
        type: 'image',
        tag: 'IT Portal'
      }
    ]
  }
];
