import { Service, Project, StatItem, TeamMember, Testimonial } from '../types';

export const OFFICIAL_ASSETS = {
  // Official Video Reel from deweg-engineering.com (comp-meceesbn / 4th video.mov)
  heroVideo1080: 'https://video.wixstatic.com/video/5080f1_411c2c70ee1741d8aa1eeaad7a5220ac/1080p/mp4/file.mp4',
  heroVideo720: 'https://video.wixstatic.com/video/5080f1_411c2c70ee1741d8aa1eeaad7a5220ac/720p/mp4/file.mp4',
  heroVideoPoster: 'https://static.wixstatic.com/media/5080f1_411c2c70ee1741d8aa1eeaad7a5220acf000.jpg',

  // Section 1 Background: High-tech Engineering Plant Drawing / CAD Model (comp-m8jv6y90: 4.jpg)
  section1DrawingImg: 'https://static.wixstatic.com/media/5080f1_e651054849a8429db80150eb4efb155c~mv2.jpg',

  // Section 3: Engineering In-Action Reel (comp-mecees9q)
  section3Video: 'https://video.wixstatic.com/video/5080f1_411c2c70ee1741d8aa1eeaad7a5220ac/1080p/mp4/file.mp4',

  // Section 5 Background: Ultra-High-Resolution Heavy Field Fabrication & Erection (comp-m8jzo6h4: DSC03474.jpg - 7008x4672px)
  section5ExecutionImg: 'https://static.wixstatic.com/media/5080f1_4be68d43cc364bb6bfae148ccab22470~mv2.jpg',

  // On-Site Heavy Steel Truss Assembly Photography from Deweg Engineering
  structuralErectionImg: 'https://static.wixstatic.com/media/7b7d72_312674e4c96541f99c9c3e98fc66b2fe~mv2.jpg',

  // Heavy Structural Assembly Video Reel (4D Construction Erection Simulation 1080p)
  structuralErectionReel: 'https://video.wixstatic.com/video/5080f1_9d5a50b68d2d46b58a50515d596842cb/1080p/mp4/file.mp4',

  // Official Domain SVG Vector Shapes from Wix
  domainIcons: {
    pmc: 'https://static.wixstatic.com/shapes/5080f1_a21eb356bcf24df2bdf44129342d2df7.svg',
    sde: 'https://static.wixstatic.com/shapes/5080f1_767d80266b374d2e946ff4bb2d69af2e.svg',
    bim: 'https://static.wixstatic.com/shapes/5080f1_199c671f75464021b8820e6c9cbaa366.svg',
    sme: 'https://static.wixstatic.com/shapes/5080f1_a5b292732121449990b84054d3953114.svg',
    oge: 'https://static.wixstatic.com/shapes/5080f1_0af5b711bf344f85973f03a8ae22207a.svg',
    mep: 'https://static.wixstatic.com/shapes/5080f1_fbe59b8ce5a24dc7b81c8aebdf07e52c.svg',
    it: 'https://static.wixstatic.com/shapes/5080f1_5719f60444dc4a38ac85cd55ec07d641.svg',
    journey: 'https://static.wixstatic.com/shapes/11062b_51280e0bc3274f6d88442b9a971718b6.svg'
  },

  // Official Social Icon Assets from Deweg
  socialIcons: {
    linkedin: 'https://static.wixstatic.com/media/11062b_72c275822d4344358ee379f14e7e115f~mv2.png',
    instagram: 'https://static.wixstatic.com/media/11062b_ca1d837ce7194421b781ee7384061a8e~mv2.png',
    facebook: 'https://static.wixstatic.com/media/11062b_362ef89dec51403eb0ee59a21bde967c~mv2.png'
  },

  // Official Reference Page Assets from https://www.deweg-engineering.com/reference
  referenceHero: 'https://static.wixstatic.com/media/5080f1_927162da936842dd8b80a0990fafcb37~mv2.jpg',
  referenceVideos: {
    sdeDynamic3D: 'https://video.wixstatic.com/video/5080f1_ab0488352c29439b99818467cd3e9c3e/1080p/mp4/file.mp4',
    sdePoster: 'https://static.wixstatic.com/media/5080f1_ab0488352c29439b99818467cd3e9c3ef000.jpg',
    bimClash: 'https://video.wixstatic.com/video/5080f1_e337a4d98df8430c960c3312b4d4a0e7/1080p/mp4/file.mp4',
    bimClashPoster: 'https://static.wixstatic.com/media/5080f1_e337a4d98df8430c960c3312b4d4a0e7f000.jpg',
    bimPhasing: 'https://video.wixstatic.com/video/5080f1_9d5a50b68d2d46b58a50515d596842cb/1080p/mp4/file.mp4',
    bimPhasingPoster: 'https://static.wixstatic.com/media/5080f1_9d5a50b68d2d46b58a50515d596842cbf000.jpg'
  },
  referenceGifs: {
    ogeTankModel: 'https://static.wixstatic.com/media/5080f1_163f6aa3a5a3408c95273f97b549fc8c~mv2.gif'
  }
};

// Official Sections Structure Mapped Directly from https://www.deweg-engineering.com/
export const SITE_SECTIONS = [
  {
    id: 'hero',
    name: 'Section 01: Concept to Creation',
    wixCompId: 'comp-m8jv6y90',
    title: 'DE WEG — PATH TO PERFECTION',
    subtitle: 'From Concept to Creation',
    mediaType: 'image & video',
    mediaUrl: OFFICIAL_ASSETS.section1DrawingImg,
    cta: 'BEGIN YOUR JOURNEY'
  },
  {
    id: 'domains',
    name: 'Section 02: Domain We Expertise',
    wixCompId: 'comp-mbx7ghfa',
    title: 'Domain We Expertise',
    subtitle: '7 Core Engineering Practices',
    statement: 'Our practice is grounded in how design information flows—from first intent to issued execution output. Every project begins with problem framing, passes through collaborative detailing, and ends in auditable, construction-ready documentation.',
    mediaType: 'svg-icons',
    domainsCount: 7
  },
  {
    id: 'reel',
    name: 'Section 03: Engineering In-Action Reel',
    wixCompId: 'comp-mecees9q',
    title: 'Technical Execution in Motion',
    subtitle: 'Official Engineering Showcase Reel',
    mediaType: 'video',
    mediaUrl: OFFICIAL_ASSETS.heroVideo1080,
    poster: OFFICIAL_ASSETS.heroVideoPoster
  },
  {
    id: 'principles',
    name: 'Section 04: To Define The Path',
    wixCompId: 'comp-m9585mz2',
    title: 'To Define The Path',
    subtitle: 'Your Journey Starts Here',
    mediaType: 'svg-icon',
    mediaUrl: OFFICIAL_ASSETS.domainIcons.journey,
    principlesCount: 5
  },
  {
    id: 'field-execution',
    name: 'Section 05: Field Fabrication & Erection',
    wixCompId: 'comp-m8jzo6h4',
    title: 'Field Execution & Heavy Assembly',
    subtitle: 'Micro-Tolerance Fabrication On Site',
    mediaType: 'high-res-image',
    mediaUrl: OFFICIAL_ASSETS.section5ExecutionImg,
    secondaryMediaUrl: OFFICIAL_ASSETS.structuralErectionImg
  }
];

export const CORE_PRINCIPLES = [
  {
    number: '01',
    title: 'Load Path Clarity',
    statement: 'Load path clarity, with openness and honesty in business.',
    description: 'Every structural transfer is mapped with absolute analytical transparency, verified against international building standards.'
  },
  {
    number: '02',
    title: 'Code Compliance',
    statement: 'Code compliance at the detail level, and buildability feedback integration.',
    description: 'Meticulous alignment with regional and global engineering codes (IS, Eurocode, ASCE, AISC, API) with direct contractor buildability inputs.'
  },
  {
    number: '03',
    title: 'BIM-Ready Outputs',
    statement: 'BIM-ready outputs when required, backed by a history of quality delivery.',
    description: 'LOD 300 to LOD 500 digital twins, parametric models, and collision-free coordination workflows across multi-disciplinary teams.'
  },
  {
    number: '04',
    title: 'Version-Controlled Workflows',
    statement: 'Version-controlled workflows, offering innovative solutions to complex projects.',
    description: 'Rigorous engineering change management that prevents design drift and delivers verifiable calculation histories.'
  },
  {
    number: '05',
    title: 'Error-Proof Review Systems',
    statement: 'Error-proof review systems, using cutting-edge technologies and tools.',
    description: 'Multi-tiered structural peer auditing, automated clash detections, and finite element validation prior to execution issuance.'
  }
];

// The 7 Official Domains of Expertise from www.deweg-engineering.com & www.deweg-engineering.com/reference
export const SERVICES_DATA: Service[] = [
  {
    id: 'pmc',
    number: '01',
    officialCode: 'PMC',
    title: 'Project Management and Controlling',
    tagline: 'Orchestrating multi-disciplinary delivery with mathematical rigor and timeline fidelity.',
    description: 'Comprehensive PMC governance ensuring schedule adherence, cost efficiency, quality control, contract administration, and statutory compliances from concept to handover.',
    referencePhilosophy: 'Our systems manage design flow across stakeholders using milestone mapping, risk flagging, and control-point reviews. We manage visibility and predictability.',
    detailedScope: [
      'Critical Path Method (CPM) 4D/5D time-cost algorithmic schedule integration',
      'Quantitative cost estimation, probabilistic risk modeling, and value engineering',
      'On-site independent quality assurance and non-destructive material testing audits',
      'FIDIC / EPC contract administration, claims defense & change-order governance',
      'Health, Safety & Environmental (HSE) zero-harm regulatory compliance'
    ],
    deliverables: [
      'Weekly Multi-tier Milestone Tracking Dashboards',
      'Technical Value Engineering Feasibility Reports',
      'Handover Handshake Documentation & Asset Commissioning Registers'
    ],
    icon: 'Briefcase',
    svgIconUrl: OFFICIAL_ASSETS.domainIcons.pmc,
    image: 'https://static.wixstatic.com/media/5080f1_cc3dbc3b00da43c293f5cdead7583a73~mv2.jpg',
    referenceAssets: [
      {
        id: 'pmc-ref-1',
        type: 'image',
        title: 'Project Management & Risk Control Flow Architecture',
        caption: 'Detailed stakeholder communication routing, control-point review milestones, and risk governance workflow matrix.',
        url: 'https://static.wixstatic.com/media/5080f1_cc3dbc3b00da43c293f5cdead7583a73~mv2.jpg',
        fileName: 'Chart_1.jpg',
        resolution: 'High Resolution System Flowchart'
      }
    ]
  },
  {
    id: 'sde',
    number: '02',
    officialCode: 'SDE',
    title: 'Structural Design & Detailed Engineering',
    tagline: 'Defying gravity through calculated structural logic and computational resilience.',
    description: 'Advanced analysis and engineering design for reinforced concrete, post-tensioned systems, substructures, high-rise frameworks, and heavy foundations.',
    referencePhilosophy: 'From concept to construction-level, we execute reinforced concrete and steel systems that meet design intent and code compliance across industries. Our detailing ensures clarity for constructability. Design concept development for Removing, Demolition and Replacement of existing structures.',
    detailedScope: [
      'Non-linear Finite Element Analysis (FEA) & dynamic blast vibration simulations',
      'High-rise lateral load resisting systems (shear walls, outriggers, diagrids)',
      'Seismic vulnerability assessment & performance-based design (IS 1893, Eurocodes, ASCE 7)',
      'Substructure pile foundation design & soil-structure interaction analysis',
      'Industrial crane runways, heavy equipment foundations & vibrating machinery isolation'
    ],
    deliverables: [
      'Statutory Structural Design Calculations & Stamped Drawing Packages',
      'Comprehensive Bar Bending Schedules (BBS) & Rebar Placement Guides',
      'Structural Stability Certification & Independent Peer Review Reports'
    ],
    icon: 'Layers',
    svgIconUrl: OFFICIAL_ASSETS.domainIcons.sde,
    image: 'https://static.wixstatic.com/media/5080f1_7e7a04d49bd34cb2aea57752fc3259a7~mv2.jpg',
    referenceAssets: [
      {
        id: 'sde-vid-1',
        type: 'video',
        title: '3D Dynamic Structural Stress & Deflection Simulation',
        caption: 'Full computational model showcasing spatial deflection modes, member bending stresses, and modal load response in motion.',
        url: OFFICIAL_ASSETS.referenceVideos.sdeDynamic3D,
        posterUrl: OFFICIAL_ASSETS.referenceVideos.sdePoster,
        fileName: '1st Video.mov',
        resolution: '1080p High Definition MP4'
      },
      {
        id: 'sde-ref-1',
        type: 'image',
        title: 'Reinforced Concrete Structural Framing & Joint Analysis',
        caption: '3D multi-level concrete frame FEA analytical grid showing column axial loads and floor diaphragm behavior.',
        url: 'https://static.wixstatic.com/media/5080f1_7e7a04d49bd34cb2aea57752fc3259a7~mv2.jpg',
        fileName: '1.1.1.jpg',
        resolution: '3000x2000 px High-Res'
      },
      {
        id: 'sde-ref-2',
        type: 'image',
        title: 'Substructure Mat Foundation & Heavy Rebar Placement Matrix',
        caption: 'Foundation slab top and bottom reinforcement layout with column punching shear reinforcement detailing.',
        url: 'https://static.wixstatic.com/media/5080f1_c05f1fbd09574a78b34e514060c1db6c~mv2.jpg',
        fileName: '1.1.2.jpg',
        resolution: '3000x2000 px High-Res'
      },
      {
        id: 'sde-ref-3',
        type: 'image',
        title: 'Industrial Heavy Portal Framing & Gantry Beam System',
        caption: 'Long-span structural steel portal frame with runway crane bracket moment connections and bracing layout.',
        url: 'https://static.wixstatic.com/media/5080f1_75501b6bc0eb49b1aabae72cd58676c5~mv2.jpg',
        fileName: '1.2.1.jpg',
        resolution: 'High-Res Engineering Model'
      },
      {
        id: 'sde-ref-4',
        type: 'image',
        title: 'High-Rise Lateral Shear Wall Core & Outrigger Analysis',
        caption: 'Seismic drift evaluation and dual-core shear wall dynamic response under lateral wind pressure profiles.',
        url: 'https://static.wixstatic.com/media/5080f1_5eef496ed8f94cf5b2f3090d869cd19f~mv2.jpg',
        fileName: '1.2.2.jpg',
        resolution: 'High-Res Analytical Model'
      },
      {
        id: 'sde-ref-5',
        type: 'image',
        title: 'Deep Pile Cap & Foundation Soil-Structure Interaction',
        caption: 'Subgrade structural detailing for massive vibrating industrial equipment base with anchor embedded elements.',
        url: 'https://static.wixstatic.com/media/5080f1_157a04e9f69b42ad8ff76c6db10cdbb3~mv2.jpg',
        fileName: '1.3.2.jpg',
        resolution: 'High-Res Detailing Model'
      }
    ]
  },
  {
    id: 'bim',
    number: '03',
    officialCode: 'BIM',
    title: 'Building Information Modelling (BIM)',
    tagline: 'Transforming geometric models into intelligent, data-rich digital twins.',
    description: 'Full-lifecycle BIM solutions facilitating seamless coordination, clash detection, 4D construction sequencing, and asset lifecycle management.',
    referencePhilosophy: 'We operate across various "LEVEL OF DETAILING" depending on the project stage and requirement. BIM is used not only for visualisation, it contains multidisciplinary data for coordination, clash detection, quantity reliability, and schedule simulation. Output integrity is prioritised over digital aesthetics. Also prepare as-built model "POINT CLOUD DATA TO MODEL" for retrofitting analysis.',
    detailedScope: [
      'LOD 200 through LOD 500 parametric BIM model authoring and federation',
      'Automated multi-disciplinary clash detection & resolution matrices',
      '4D time simulation and 5D quantity extraction for commercial governance',
      'Scan-to-BIM laser point cloud conversion for existing structures and retrofits',
      'Common Data Environment (CDE) setup following ISO 19650 standards'
    ],
    deliverables: [
      'Federated Multi-Disciplinary Navisworks / Solibri Clash Reports',
      'Fabrication-ready Parametric Component Libraries',
      'As-Built Asset Information Models (AIM) for Facilities Management'
    ],
    icon: 'Compass',
    svgIconUrl: OFFICIAL_ASSETS.domainIcons.bim,
    image: 'https://static.wixstatic.com/media/5080f1_b1627f6b36894b5e9e6f1d6d17e1a300~mv2.jpg',
    referenceAssets: [
      {
        id: 'bim-vid-1',
        type: 'video',
        title: '3D Multidisciplinary Spatial Clash Detection Flythrough',
        caption: 'Zero-clash digital twin flythrough auditing interference between complex structural members, HVAC ducts, and process pipes.',
        url: OFFICIAL_ASSETS.referenceVideos.bimClash,
        posterUrl: OFFICIAL_ASSETS.referenceVideos.bimClashPoster,
        fileName: '3rd video.mov',
        resolution: '1080p High Definition MP4'
      },
      {
        id: 'bim-vid-2',
        type: 'video',
        title: '4D Construction Schedule & Erection Phasing Model',
        caption: 'Time-linked digital construction animation depicting crane radius, structural steel modular delivery, and daily site assembly.',
        url: OFFICIAL_ASSETS.referenceVideos.bimPhasing,
        posterUrl: OFFICIAL_ASSETS.referenceVideos.bimPhasingPoster,
        fileName: '2nd video.mov',
        resolution: '1080p High Definition MP4'
      },
      {
        id: 'bim-ref-1',
        type: 'image',
        title: 'LOD 400 Federated Plant BIM Architecture',
        caption: 'Integrated parametric multi-story facility model incorporating structural frame, architectural envelope, and service corridors.',
        url: 'https://static.wixstatic.com/media/5080f1_b1627f6b36894b5e9e6f1d6d17e1a300~mv2.jpg',
        fileName: '2.1.1.jpg',
        resolution: 'High-Res Federated Model'
      },
      {
        id: 'bim-ref-2',
        type: 'image',
        title: 'Spatial Clash Matrix & Clearance Verification',
        caption: 'Algorithmic geometric overlap diagnostics between high-velocity piping, cable trays, and structural beams.',
        url: 'https://static.wixstatic.com/media/5080f1_69909d2e9af546ffbe97041702aed690~mv2.jpg',
        fileName: '2.1.2.jpg',
        resolution: 'High-Res Clash Audit'
      },
      {
        id: 'bim-ref-3',
        type: 'image',
        title: 'Point Cloud Scan-to-BIM As-Built Retrofitting Model',
        caption: 'Laser point cloud survey converted into accurate parametric Revit elements for structural retrofitting and modifications.',
        url: 'https://static.wixstatic.com/media/5080f1_f3bf0452b6fd47b9835bfe21af1d41b2~mv2.jpg',
        fileName: '2.3.2.jpg',
        resolution: 'High-Res Scan-to-BIM'
      },
      {
        id: 'bim-ref-4',
        type: 'image',
        title: 'MEP & Structural Multi-Service BIM Coordination',
        caption: 'Detailed coordination view showing sleeve penetrations, service hangars, and structural slab clearances.',
        url: 'https://static.wixstatic.com/media/5080f1_23d77749ee87426ca7214e8eb529c17a~mv2.jpg',
        fileName: '2.3.1.jpg',
        resolution: 'High-Res Coordinated BIM'
      }
    ]
  },
  {
    id: 'sme',
    number: '04',
    officialCode: 'SME',
    title: 'Structural Steel Modelling & Detailing',
    tagline: 'Precision micro-tolerance detailing for flawless shop fabrication and swift erection.',
    description: 'High-precision Tekla structural steel 3D modeling, advanced connection design, erection engineering, and CNC machine data generation.',
    referencePhilosophy: 'Our steel deliverables are focused on erection logic, bolt design, connection detailing, and fabrication-ready drawings. This includes integration with shop drawing ecosystems and revision-tracked outputs.',
    detailedScope: [
      'Tekla Structures 3D model authoring with mill-level connection details',
      'Moment, shear, and braced seismic connection design to AISC / Eurocode 3',
      'Erection sequence plans, temporary shoring design, and rigging studies',
      'Long-span space trusses, canopy cantilevers, and conveyor gantry systems',
      'Export and verification of DSTV / NC files for automated beam-line drilling'
    ],
    deliverables: [
      'Shop Fabrication Assembly Drawings & Advanced Bill of Materials',
      'General Arrangement Erection Plans & Anchor Bolt Setting Templates',
      'CNC Machine Data Files (DSTV / DXF) for Precision Plate Cutting'
    ],
    icon: 'Cpu',
    svgIconUrl: OFFICIAL_ASSETS.domainIcons.sme,
    image: 'https://static.wixstatic.com/media/5080f1_0d40622da5464c4fa598406d7132f0ab~mv2.jpg',
    referenceAssets: [
      {
        id: 'sme-ref-1',
        type: 'image',
        title: 'Tekla 3D High-Strength Bolted Moment Connection',
        caption: 'Millimeter-accurate Tekla detailing for complex moment connection with stiffener plates, gussets, and high-tensile bolt patterns.',
        url: 'https://static.wixstatic.com/media/5080f1_0d40622da5464c4fa598406d7132f0ab~mv2.jpg',
        fileName: '3.1.1.jpg',
        resolution: 'High-Res Tekla 3D Model'
      },
      {
        id: 'sme-ref-2',
        type: 'image',
        title: 'Heavy Industrial Space Truss Fabrication Isometric',
        caption: 'Shop assembly drawing of heavy tubular truss node showing weld bevel prep, gusset plates, and camber profile.',
        url: 'https://static.wixstatic.com/media/5080f1_330659392d9f4fb386cbb5415db679db~mv2.jpg',
        fileName: '3.1.2.jpg',
        resolution: 'High-Res Shop Detailing'
      },
      {
        id: 'sme-ref-3',
        type: 'image',
        title: 'Gantry Crane Beam & Multi-Tier Column Assembly',
        caption: 'Crane girder surge plate detailing, rail clip connections, and stepped column transfer stiffeners.',
        url: 'https://static.wixstatic.com/media/5080f1_2cba47f4712e42af93325e48116d76ee~mv2.jpg',
        fileName: '3.2.1.jpg',
        resolution: 'High-Res Fabrication Model'
      },
      {
        id: 'sme-ref-4',
        type: 'image',
        title: 'Anchor Bolt Setting Template & Column Base Plate',
        caption: 'Anchor bolt cluster configuration, grout pocket detailing, and shear lug design for heavy column overturning moments.',
        url: 'https://static.wixstatic.com/media/5080f1_02017922add94d5890f411c97d7ed3c6~mv2.jpg',
        fileName: '3.2.2.jpg',
        resolution: 'High-Res GA & Anchor Plan'
      }
    ]
  },
  {
    id: 'oge',
    number: '05',
    officialCode: 'OGE',
    title: 'Oil & Gas Structural Engineering',
    tagline: 'Engineered resilience for the harshest marine and high-pressure process environments.',
    description: 'Specialized structural design for onshore refineries, petrochemical modules, offshore topsides, pipe racks, and heavy equipment skids.',
    referencePhilosophy: 'High-risk sectors demand high-precision workflows. We operate with strict adherence to offshore/onshore standards, ensuring safety-critical structures are verified at both design and review stages.',
    detailedScope: [
      'Heavy process pipe rack frameworks & modular skid structural analysis',
      'Offshore jacket and topside module in-place, lifting, and load-out simulations',
      'Blast resistance design for blast-proof control buildings and shelter structures',
      'API, ASME, and NORSOK compliant design calculations for harsh environments',
      'Thermal fatigue, wind buffeting, and vortex shedding dynamic mitigation'
    ],
    deliverables: [
      'Modular Transport & Heavy Crane Lift Rigging Calculation Packs',
      'Blast Mitigation Structural Hardening Certification Reports',
      'Detailed Offshore / Refinery Structural Erection Dossiers'
    ],
    icon: 'Shield',
    svgIconUrl: OFFICIAL_ASSETS.domainIcons.oge,
    image: 'https://static.wixstatic.com/media/5080f1_56d6babca4eb4d3e9dce1a9ac3e23ef0~mv2.jpg',
    referenceAssets: [
      {
        id: 'oge-ref-1',
        type: 'gif',
        title: '360° Rotating Storage Tank & Process Piping Model',
        caption: 'Dynamic 3D geometric model of vertical storage tank with exterior spiral stair, roof truss framing, and piping manifold connections.',
        url: OFFICIAL_ASSETS.referenceGifs.ogeTankModel,
        fileName: 'OT1.25.gif',
        resolution: 'Dynamic 3D Animation'
      },
      {
        id: 'oge-ref-2',
        type: 'image',
        title: 'Refinery Modular Process Unit & Heavy Skid Framing',
        caption: 'Multi-tiered structural skid designed for sea-transport acceleration loads, four-point crane lifting, and operating vibrations.',
        url: 'https://static.wixstatic.com/media/5080f1_56d6babca4eb4d3e9dce1a9ac3e23ef0~mv2.jpg',
        fileName: '2.2.3.jpg',
        resolution: 'Ultra High-Res Process Model'
      }
    ]
  },
  {
    id: 'mep',
    number: '06',
    officialCode: 'MEP',
    title: 'MEP Design & Detailed Engineering',
    tagline: 'Engineering thermal equilibrium and kinetic efficiency into the built environment.',
    description: 'Integrated Mechanical, Electrical, and Plumbing design engineered for energy performance, occupant comfort, and lifecycle economy.',
    referencePhilosophy: 'We offer MEP design where integration is key—balancing electrical, and plumbing layouts in confined or complex structural zones. Emphasis is on zoning clarity, load efficiency, and maintenance accessibility.',
    detailedScope: [
      'HVAC central plant, chiller matrix, and cleanroom air ventilation design',
      'Substation, HT/LT electrical distribution, lighting, and emergency power systems',
      'Comprehensive public health engineering, water treatment, and drainage loops',
      'NFPA-compliant fire detection, automatic sprinkler, and gas suppression networks',
      'Energy modeling, building physics simulations, and Net-Zero optimization'
    ],
    deliverables: [
      'Coordinated MEP Services Schematics & Layout Drawing Packages',
      'Electrical Single Line Diagrams (SLD) & Fault Level Calculations',
      'Hydraulic Pipe Sizing Schedules & Equipment Technical Data Sheets'
    ],
    icon: 'Zap',
    svgIconUrl: OFFICIAL_ASSETS.domainIcons.mep,
    image: 'https://static.wixstatic.com/media/5080f1_8a581fbb25b140b493b739606c83ea57~mv2.jpg',
    referenceAssets: [
      {
        id: 'mep-ref-1',
        type: 'image',
        title: 'HVAC Air Handling & Chilled Water Distribution Layout',
        caption: 'Primary ductwork velocity routing, variable air volume (VAV) branches, and acoustic attenuator placement.',
        url: 'https://static.wixstatic.com/media/5080f1_8a581fbb25b140b493b739606c83ea57~mv2.jpg',
        fileName: 'Image 1.JPG',
        resolution: 'High-Res Engineering Schematic'
      },
      {
        id: 'mep-ref-2',
        type: 'image',
        title: 'Electrical Cable Containment & Switchgear Matrix',
        caption: 'High-voltage transformer feeding, segregated LV cable ladder layout, and emergency diesel generator transfer loops.',
        url: 'https://static.wixstatic.com/media/5080f1_32c02c46c745402b886f2bf0a218fbdd~mv2.jpg',
        fileName: 'Image 2.JPG',
        resolution: 'High-Res Electrical Schematic'
      },
      {
        id: 'mep-ref-3',
        type: 'image',
        title: 'Fire Suppression Sprinkler Grid & Hydraulic Loop',
        caption: 'NFPA 13 hazard category zone sizing, main riser distribution, and fire hydrant flow calculation schematic.',
        url: 'https://static.wixstatic.com/media/5080f1_96f150ab9af247e4b9d0369a21264fe2~mv2.jpg',
        fileName: 'Image 3.JPG',
        resolution: 'High-Res Piping Schematic'
      },
      {
        id: 'mep-ref-4',
        type: 'image',
        title: 'Public Health Sanitation & Industrial Drainage Isometric',
        caption: 'Dual-pipe blackwater and greywater drainage stacks, vent risers, and storm attenuation reservoir integration.',
        url: 'https://static.wixstatic.com/media/5080f1_657cdea5c8c646d1a4734f63321fd421~mv2.jpg',
        fileName: 'Image 4.JPG',
        resolution: 'High-Res Hydraulic Isometric'
      }
    ]
  },
  {
    id: 'it',
    number: '07',
    officialCode: 'IT',
    title: 'Information Technology Solutions',
    tagline: 'Bridging physical engineering with algorithmic automation and software tools.',
    description: 'Custom engineering automation scripts, parametric calculation engines, data management pipelines, and cloud-hosted collaboration platforms.',
    referencePhilosophy: 'Our proprietary internal tools and automations support drawing checks, quantity generation, and file tracking. We also develop custom engineering dashboards for project health, drawing submissions, and version history.',
    detailedScope: [
      'Custom Revit / Tekla API plugin development for automated model generation',
      'Python and C# computational engineering scripts for bulk load verification',
      'Cloud-based engineering documentation repositories with role-based access',
      'Interactive visual dashboarding for project stakeholders and portfolio tracking',
      'Database integration for material inventories and real-time QA/QC logging'
    ],
    deliverables: [
      'Bespoke Engineering Calculation Plugins & Algorithmic Toolkits',
      'Project Management Portal & Secure Cloud Data Workspaces',
      'Automated Reporting Pipelines & Multi-Discipline Integrations'
    ],
    icon: 'Code',
    svgIconUrl: OFFICIAL_ASSETS.domainIcons.it,
    image: 'https://static.wixstatic.com/media/5080f1_3d5b1b84a27245b68bdc266f3502ced0~mv2.jpg',
    referenceAssets: [
      {
        id: 'it-ref-1',
        type: 'image',
        title: 'Proprietary Engineering QA/QC Automation Dashboard',
        caption: 'Custom analytics dashboard developed by Deweg for real-time drawing revision tracking, clash metric logging, and automated schedule auditing.',
        url: 'https://static.wixstatic.com/media/5080f1_3d5b1b84a27245b68bdc266f3502ced0~mv2.jpg',
        fileName: 'InfoT_edited.jpg',
        resolution: 'High-Res Software Interface'
      }
    ]
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'industrial-plant',
    title: 'Petrochemical & Energy Infrastructure Facility',
    category: 'Oil & Gas & Heavy Industry',
    year: '2024',
    location: 'Coastal Refinery Zone, India',
    client: 'Industrial Energy Group',
    image: OFFICIAL_ASSETS.section1DrawingImg,
    summary: 'Turnkey structural and pipe rack engineering for heavy petrochemical process units with high-temperature thermal dissipation.',
    fullDescription: 'Deweg Engineering delivered the complete structural analysis, heavy steel pipe rack arrays, and foundation design for a coastal process facility. The engineering integrated blast-resistant control room calculations, dynamic seismic response, and vibration isolation for centrifugal pumps.',
    keyStats: [
      { label: 'Structural Steel', value: '4,600 MT' },
      { label: 'Pipe Rack Length', value: '1.8 km' },
      { label: 'Design Code', value: 'API / IS 800' }
    ],
    disciplines: ['Oil & Gas Engineering', 'Structural Steel Detailing', 'BIM LOD 400']
  },
  {
    id: 'structural-erection',
    title: 'Heavy Structural Fabrication & On-Site Assembly',
    category: 'Structural Steel Modelling (SME)',
    year: '2024',
    location: 'Industrial Corridor, Chennai',
    client: 'Major Infrastructure Developer',
    image: OFFICIAL_ASSETS.section5ExecutionImg,
    summary: 'Direct field execution, high-bay structural erection, and micro-tolerance steel joint detailing photographed on-site.',
    fullDescription: 'Photographed during live field assembly, this heavy engineering engagement required zero-tolerance shop detailing in Tekla Structures, ultrasonic weld inspection oversight, and multi-tier erection sequencing for deep industrial clear spans.',
    keyStats: [
      { label: 'Clear Span', value: '54 m' },
      { label: 'Erection Speed', value: '14 Weeks' },
      { label: 'Fabrication Accuracy', value: '±1.5 mm' }
    ],
    disciplines: ['Tekla Steel Modeling', 'Heavy Foundation Design', 'PMC Oversight']
  },
  {
    id: 'steel-truss-erection',
    title: 'Industrial Heavy Steel Frame & Truss System',
    category: 'Structural Steel & Detailing',
    year: '2023',
    location: 'Manufacturing Corridor, Tamil Nadu',
    client: 'Apex Industrial Dynamics',
    image: OFFICIAL_ASSETS.structuralErectionImg,
    summary: 'Long-span steel trusses and high-load portal frames engineered for overhead crane operations.',
    fullDescription: 'Engineered to support heavy gantry cranes up to 80 tonnes, this facility combined parametric column base plates, moment-resisting connections, and vibration absorption calculations.',
    keyStats: [
      { label: 'Truss Span', value: '48 m' },
      { label: 'Crane Load', value: '80 Tonnes' },
      { label: 'Site Rework', value: '0.0%' }
    ],
    disciplines: ['Tekla Steel Detailing', 'Portal Frame FEA', 'Erection Rigging']
  },
  {
    id: 'commercial-highrise',
    title: 'Metropolitan Commercial Diagrid Tower',
    category: 'Commercial & High-Rise',
    year: '2024',
    location: 'Urban Financial District',
    client: 'Skyline Capital Developments',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85',
    summary: '38-story composite diagrid tower balancing structural transparency with wind-vortex shedding aerodynamic stability.',
    fullDescription: 'Deweg engineered the hybrid steel-concrete central core and exterior structural diagrid. Non-linear time history dynamic analysis and wind tunnel data informed tuned mass damping and high-efficiency lateral stiffness.',
    keyStats: [
      { label: 'Building Height', value: '168 m' },
      { label: 'Lateral Stiffness', value: 'H / 550' },
      { label: 'Concrete Savings', value: '14%' }
    ],
    disciplines: ['High-Rise Engineering', 'BIM Coordination', 'Wind FEA']
  },
  {
    id: 'multidiscipline-mep',
    title: 'Advanced Technology Campus & Cleanroom Facility',
    category: 'MEP & Building Systems',
    year: '2023',
    location: 'Tech Corridor, South India',
    client: 'Vertex Technologies',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=85',
    summary: 'Integrated MEP design featuring ISO Class 5 cleanrooms, high-efficiency chiller plants, and automated energy management.',
    fullDescription: 'Addressing demanding thermal and air filtration requirements, Deweg created an end-to-end digital twin coordinating complex HVAC duct runs, gas piping, and clean electrical distributions without inter-service clashes.',
    keyStats: [
      { label: 'Cleanroom Area', value: '18,500 m²' },
      { label: 'HVAC Capacity', value: '2,400 TR' },
      { label: 'Clash Resolution', value: '100% Digital' }
    ],
    disciplines: ['MEP Engineering', 'BIM LOD 400', 'Energy Optimization']
  }
];

export const STATS_DATA: StatItem[] = [
  {
    id: 'exp',
    value: 20,
    suffix: '+',
    label: 'Years of Technical Mastery',
    detail: 'Decades of combined engineering excellence across civil, industrial, and infrastructure landscapes.'
  },
  {
    id: 'projects',
    value: 250,
    suffix: '+',
    label: 'Engineering Engagements',
    detail: 'Delivering precision calculations, BIM models, and structural certifications with zero compromise.'
  },
  {
    id: 'disciplines',
    value: 7,
    suffix: '',
    label: 'Integrated Disciplines',
    detail: 'Unified practice bridging PMC, Structural, BIM, Steel, Oil & Gas, MEP, and Technology.'
  },
  {
    id: 'accuracy',
    value: 100,
    suffix: '%',
    label: 'Auditable Compliance',
    detail: 'Zero deviation from statutory safety codes and construction-ready peer-reviewed standards.'
  }
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'test-1',
    quote: 'Deweg Engineering brings an uncompromising analytical precision to high-stakes industrial framing. Their connection detailing and BIM workflows eliminated site fabrication clashes completely.',
    clientName: 'Senior Project Director',
    clientRole: 'Head of Industrial Projects',
    company: 'Apex Industrial Dynamics',
    project: 'Manufacturing Complex'
  },
  {
    id: 'test-2',
    quote: 'From load path clarity to error-proof peer reviews, Deweg defines the standard for structural consultants. Their response time and technical mastery make them our go-to partner.',
    clientName: 'Julian Sterling',
    clientRole: 'Principal Infrastructure Lead',
    company: 'Sterling & Morath Associates',
    project: 'Commercial High-Rise Framework'
  },
  {
    id: 'test-3',
    quote: 'Their deep knowledge of API and process piping civil interfaces on our energy facility ensured our statutory approvals sailed through without a single query.',
    clientName: 'Chief Operating Engineer',
    clientRole: 'Petrochemical Infrastructure',
    company: 'Coastal Energy Group',
    project: 'Oil & Gas Facility'
  }
];

export const TEAM_DATA: TeamMember[] = [
  {
    name: 'Gayathri Devaraj',
    role: 'Director & Principal Consultant',
    credentials: 'M.Tech (Structural Engineering), Chartered Engineer',
    bio: 'Directs overall technical strategy, high-complexity structural calculations, and cross-border client commissions. Brings extensive institutional experience across heavy industrial and commercial developments.',
    specialty: 'Advanced Structural Dynamics, Heavy Steel & Corporate Direction'
  },
  {
    name: 'Revathi S.',
    role: 'Director & Operations Head',
    credentials: 'B.E. (Civil Engineering), PMP, Lead Quality Auditor',
    bio: 'Directs multi-disciplinary project governance, contractual compliance, quality assurance frameworks, and buildability feedback loops across all project lifecycles.',
    specialty: 'PMC Governance, QA/QC Systems & Statutory Compliance'
  },
  {
    name: 'Technical Advisory Panel',
    role: 'Senior Engineering Specialists',
    credentials: 'Licensed Structural Engineers & BIM Managers',
    bio: 'A dedicated team of senior structural modelers, MEP specialists, Tekla detailers, and computational engineers delivering code-compliant construction documentation.',
    specialty: 'Finite Element Analysis, Tekla Detailing & MEP Coordination'
  }
];

export const COMPANY_DETAILS = {
  legalName: 'DEWEG ENGINEERING PRIVATE LIMITED',
  shortName: 'DEWEG Engineering',
  tagline: 'To Define The Path',
  subTagline: 'Engineering the Future, Building with Precision',
  journeyText: 'Your Journey Starts Here',
  motto: 'Load Path Clarity • Code Compliance • BIM-Ready Execution',
  practiceStatement: 'Our practice is grounded in how design information flows—from first intent to issued execution output. Every project begins with problem framing, passes through collaborative detailing, and ends in auditable, construction-ready documentation.',
  address: 'Plot No. 7A, Second Street, Lakshmi Nagar, Chitlapakkam, Kancheepuram, Chengalput, Tamil Nadu, India — 600064',
  cin: 'U74999TN2020PTC136479',
  phone: '+91 (44) 2822 5900',
  mobile: '+91 98401 22941',
  email: 'info@deweg-engineering.com',
  careersEmail: 'careers@deweg-engineering.com',
  workingHours: 'Monday – Friday: 08:30 – 18:30 IST | Saturday: 09:00 – 13:00 IST',
  social: {
    linkedin: 'https://linkedin.com/company/deweg-engineering',
    instagram: 'https://instagram.com/deweg.engineering',
    facebook: 'https://facebook.com/dewegengineering'
  }
};
