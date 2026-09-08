import { TeamMember } from '../types';

export const ABOUT_PAGE_ASSETS = {
  heroBanner: 'https://static.wixstatic.com/media/5080f1_1b1a16d115924be5bb70dc702b895b7d~mv2.jpg',
  aboutEdited: 'https://static.wixstatic.com/media/5080f1_43d421cd889745b7a8340fe9b17ef9ab~mv2.jpg',
  officeDrawing: 'https://static.wixstatic.com/media/5080f1_309ccd829fa74696a5e1f630b7977b2b~mv2.jpg',
  teamWorkplace: 'https://static.wixstatic.com/media/5080f1_b294f0af920d490792aff66782130a05~mv2.jpg',
  teamOuting: 'https://static.wixstatic.com/media/585635_528779f175374d9790c5c600848a24e5~mv2.jpg',
  leadership: {
    devaraj: 'https://static.wixstatic.com/media/5080f1_74309a38154740f18fa0aa159cb0f92b~mv2.jpg',
    karthikeyan: 'https://static.wixstatic.com/media/5080f1_d63324c34acf42b4a0f61268ef24209b~mv2.jpg',
    vijayakumar: 'https://static.wixstatic.com/media/5080f1_8547fce6e6a44dfbbbe1a4d6ad2e5691~mv2.jpg',
    jayakumar: 'https://static.wixstatic.com/media/5080f1_3b7fac4e9acd4ce4b85fc67572741773~mv2.jpg',
    venkatesan: 'https://static.wixstatic.com/media/5080f1_13c2bc686a1041809b7581456e73fe7e~mv2.jpg',
    sankar: 'https://static.wixstatic.com/media/5080f1_cf296258b2e5420daf239ec9bd661bd7~mv2.png'
  }
};

export const ABOUT_PAGE_CONTENT = {
  badge: 'WHO ARE WE',
  title: 'Defining the Path to Build Better',
  foundingStory:
    'Founded in 2020 and headquartered in Chennai, India, DEWEG ENGINEERING PRIVATE LIMITED is a Structural Engineering Consultancy defined by precision, performance, and process clarity. We are dedicated specialized professionals providing Engineering Solutions for infrastructure development projects. Our core strength lies in transforming design codes, loading criteria, and material behavior into robust constructible frameworks.',
  tagline: 'EVERY LINE WE DRAW DEFINES THE PATH TO BUILD BETTER.',
  
  philosophyAndMantra: {
    title: 'THE PHILOSOPHY AND THE MANTRA',
    quote:
      'At DEWEG, every project is more than a milestone—it is a marker of excellence. Every solution is a reflection of our ethos: to lead by DEFINING THE PATH.',
    context:
      'We believe every resilient structure begins with a precise decision—made at the intersection of design intelligence, digital integration, and domain expertise. By setting a defined unison path from complexity to clarity, we turn complex requirements into constructible, value-driven outcomes—bringing certainty to every phase of the project.'
  },

  vision: {
    title: 'VISION',
    statement:
      'WE NURTURE ENGINEERING TALENTS TO PROVIDE UNIQUE, QUALITY-DRIVEN CONSULTING SOLUTIONS, EMPOWERING INDIVIDUALS BY TRANSFORMING HOMEGROWN INTELLECT INTO WORLD-CLASS INFRASTRUCTURE SOLUTION EXPERTISE.',
    subtext:
      'By focusing on structured growth, technical mentorship, and system-driven delivery, we set a long-term course for dependable, high-value project partnerships.'
  },

  mission: {
    title: 'MISSION',
    statement:
      'DELIVERING LEADING DIGITAL STRUCTURAL ENGINEERING SOLUTIONS THROUGH CUTTING-EDGE TECHNOLOGY FOR INFRASTRUCTURE DEVELOPMENT PROJECTS AROUND THE WORLD.',
    subtext:
      'We believe every resilient structure begins with a precise decision—made at the intersection of design intelligence, digital integration, and domain expertise. By setting a defined unison path from complexity to clarity, we turn complex requirements into constructible, value-driven outcomes—bringing certainty to every phase of the project.'
  },

  teamIntro: {
    title: 'Team Behind DEWEG',
    description:
      'At DEWEG, success is shaped by a dedicated team built over time through commitment, reliability, and a deep-rooted sense of integrity. The company stands on the brawn of its illustrious team, a league of experts meticulously cultivated over time. Their dedication to quality and ethics form the bedrock of DEWEG’s enduring success.'
  }
};

export const DEWEG_LEADERSHIP: TeamMember[] = [
  {
    name: 'Mr. Devaraj Sadhanantham',
    role: 'Managing Director',
    credentials: 'B.E. Civil | M.E. Structural Engineering',
    education: "Bachelor's in Civil Engineering & Master's in Structural Engineering",
    experience: '24+ Years International Projects',
    specialty: 'Engineering Services, BIM Solutions, Global Project Direction & Commercial Strategy',
    image: ABOUT_PAGE_ASSETS.leadership.devaraj,
    bio: "Mr. Devaraj Sadhanantham leads DEWEG with over 24 years of hands-on experience in international projects, specializing in Engineering Services and Building Information Modelling (BIM) solutions. BIM enables future smart planning, with demanding digital procedure that allows designing, and management of infrastructure using intelligent 3D models, fostering seamless collaboration and enhanced project efficiency. His career has been shaped by strong associations with the leading European Construction and Engineering sector, enhancing both his technical acumen and strategic foresight. Mr. Devaraj is acclaimed as a 'visionary' for his competency in timely project completion alongside adherence to quality standards, handling large-scale assignments under tight deadlines, and disciplined resource management.",
    leadershipStatement: 'Clear goal-setting, strategic foresight, and disciplined execution define the path to uncompromised engineering quality.'
  },
  {
    name: 'MR. KARTHIKEYAN VARADHARAJAN',
    role: 'Executive Manager',
    credentials: 'M.E. Structural | PMP Standards',
    secondaryRole: 'Head of Structural Design, Detailed Engineering & BIM Division',
    experience: '20+ Years International Projects',
    specialty: 'Computational FEA, Multi-Discipline BIM, Schedule Integrity & Fiscal Control',
    image: ABOUT_PAGE_ASSETS.leadership.karthikeyan,
    bio: "Mr. Karthikeyan heads the Structural Design and Detailed Engineering with Building Information Modelling (BIM) division at DEWEG. With over 20 years of experience in international projects, he provides a flawless technical background in specialized proficiency. His skills in project coordination, client rapport, supervision of complex workflows, and formulation of innovative technical solutions support schedule integrity and fiscal constraints. He is recognized for his analytical mindset, dedication to achieving project goals, and his honest, results-driven approach. His capabilities have earned him a key role in project controlling and management.",
    leadershipStatement: 'Flawless technical precision and honest, results-driven management strengthen the backbone of every project phase.'
  },
  {
    name: 'MR. VIJAYAKUMAR ANGAIASAMY',
    role: 'Project Manager',
    credentials: 'Lead Structural Engineer | Codes Specialist',
    secondaryRole: 'Training Head & Technical Mentorship Director',
    experience: '23 Years Industry Doyen',
    specialty: 'Structural Detailed Engineering, International Codes (Eurocodes, AISC, IS), Engineering Training',
    image: ABOUT_PAGE_ASSETS.leadership.vijayakumar,
    bio: "Mr. Vijayakumar brings 23 years of rich experience in the Structural Detailed Engineering service industry and has played an active role in several major international infrastructure projects. This service involves producing articulate designs, plans, and specifications for infrastructure construction. His tenure spans project management, technical coordination, and developing harmonious team relationships. His exposure to several international standards and codes has made him an industry doyen. A cohesion of experience, innovation, and leadership—he inspires growth by turning challenges into prospects. His passion for excellence and problem-solving has led to his role as Training Head, shaping the organization's future through team development.",
    leadershipStatement: 'Turning structural challenges into constructible prospects through generational engineering mentorship.'
  },
  {
    name: 'MR. JAYAKUMAR NATARAJ',
    role: 'Project Manager',
    credentials: 'Lead Project Manager | Certified Lead Auditor',
    secondaryRole: 'Quality Assurance Head & ISO Audit Lead',
    experience: '23+ Years Structural Detailing',
    specialty: 'Power Plants, Deep Tunnels, Heavy Industrial Complexes, ISO Audits & Quality Control',
    image: ABOUT_PAGE_ASSETS.leadership.jayakumar,
    bio: "With an astounding 23+ years of experience in the field of Structural Detailed Engineering, Mr. Jayakumar is a cornerstone of the pivotal team at DEWEG. His extensive professional fluency embodies handling international projects with sophisticated structural framework, including power plants, tunnels, and buildings. He is known for being meticulous and always produces incomparable quality work without letting his poise and methodical work demeanor get swayed. Mr. Jayakumar's rich experience with ISO audits and rigid commitment to quality have led him to assume the added role of Quality Assurance Head, where his leadership drives operational excellence.",
    leadershipStatement: 'Methodical rigor, ISO compliance, and unwavering poise produce incomparable structural deliverables.'
  },
  {
    name: 'MR. VENKATESAN SRINIVASAN',
    role: 'BIM Manager',
    credentials: 'BIM Specialist | Computational Design',
    secondaryRole: 'Technology Innovation Lead & Emerging Tech Director',
    experience: '10+ Years BIM & Digital Twin',
    specialty: 'Building Information Modelling (LOD 200-500), 3D Model Creation, Parametric Programming',
    image: ABOUT_PAGE_ASSETS.leadership.venkatesan,
    bio: "Mr. Venkatesan is a success-centric professional with 10+ years of experience in Building Information Modelling (BIM) and Engineering Services Solutions. With comprehensive expertise in software skills, 3D model creation, programming, he persistently propels ground-breaking strategies for project output improvisation. His expertise amplifies to market research and the strategic application of emerging technologies, ensuring DEWEG remains at the epicenter of industry advancements. Recognized for his visionary approach, Mr. Venkatesan assumes a managerial role with the responsibility of leading technology innovation within the organization.",
    leadershipStatement: 'Accelerating project output improvisation through intelligent 3D algorithms and parametric automation.'
  },
  {
    name: 'MR. SANKAR RAMASAMY',
    role: 'Information Technology Head',
    credentials: 'IT Infrastructure & Systems Architect',
    secondaryRole: 'Director of Technology Infrastructure & Digital Security',
    experience: '20+ Years Diverse IT Systems',
    specialty: 'High-Availability IT Administration, Engineering Cloud Infrastructure, CAD/BIM Server Farms',
    image: ABOUT_PAGE_ASSETS.leadership.sankar,
    bio: "Mr. Sankar has over 20 years of diverse experience in the Information Technology industry. He specializes in IT administration, analysis, and delivering effective solutions. At DEWEG, he heads the IT department, playing a critical role in maintaining and upgrading the organization's technological infrastructure to meet evolving business needs. He ensures seamless connectivity, cloud backup systems, data integrity, and high-performance computing capabilities for heavy FEA simulations.",
    leadershipStatement: 'Maintaining an enterprise-grade digital foundation to empower uninterrupted global engineering collaboration.'
  }
];

export const FIRM_MILESTONES = [
  {
    year: '2020',
    title: 'Inception in Chennai',
    description: 'Founded by senior structural engineers with European practice backgrounds to bridge design intelligence and precision detailing.'
  },
  {
    year: '2021',
    title: 'Global Delivery Expansion',
    description: 'Scaled international operations into UK, Europe, Middle East, and Asia-Pacific infrastructure markets across heavy steel and BIM.'
  },
  {
    year: '2023',
    title: 'ISO & LOD 500 Certification',
    description: 'Established rigorous ISO quality control frameworks and integrated multi-disciplinary clash detection pipelines.'
  },
  {
    year: '2025-2026',
    title: '100+ Strong Engineering Brawn',
    description: 'Nurturing homegrown Indian engineering talent to deliver world-class infrastructure consulting across 7 specialized practices.'
  }
];
