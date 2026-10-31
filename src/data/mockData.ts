import { Grievance, NotificationItem } from '../types/grievance';

export const INITIAL_GRIEVANCES: Grievance[] = [
  // 1. SPECIFIC DEMO CASE (Step 1-13 in hackathon demo)
  {
    id: 'PG-2026-00124',
    title: 'Hazardous deep pothole near junction',
    category: 'Roads & Infrastructure',
    subcategory: 'Pothole & Surface Damage',
    description: 'Large pothole reported near a busy junction causing difficulty for two-wheelers and cars. Water accumulates during rains, making it an invisible danger for commuters.',
    incidentDate: '2026-10-30',
    area: 'Gachibowli',
    address: 'Near Bio-Diversity Junction, Old Mumbai Highway, Gachibowli',
    attachmentName: 'pothole_junction_photo.jpg',
    reporterName: 'Karthik Varma',
    reporterEmail: 'karthik.v@example.com',
    reporterPhone: '+91 98765 43210',
    status: 'Submitted',
    priority: 'HIGH',
    department: 'Roads & Infrastructure',
    assignedOfficer: 'Rahul Kumar',
    submittedAt: '2026-10-31T09:30:00.000Z',
    targetResolutionDate: '2026-11-03T09:30:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    auditTrail: [
      {
        id: 'aud-101',
        timestamp: '2026-10-31T09:30:00.000Z',
        user: 'Citizen (Karthik Varma)',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Grievance submitted via Citizen Portal.',
        note: 'Uploaded photo attachment pothole_junction_photo.jpg'
      }
    ],
    internalNotes: [
      {
        id: 'not-01',
        author: 'System Intake',
        role: 'System',
        text: 'Automated geo-tag matched Gachibowli civic maintenance zone 4.',
        createdAt: '2026-10-31T09:31:00.000Z'
      }
    ]
  },

  // 2. Overdue Case 1
  {
    id: 'PG-2026-00118',
    title: 'Contaminated tap water supply in apartment cluster',
    category: 'Water Supply',
    subcategory: 'Water Quality & Contamination',
    description: 'Muddy and pungent smelling water flowing from municipal pipeline for the past 4 days. Multiple residents reported illness.',
    incidentDate: '2026-10-24',
    area: 'Kukatpally',
    address: 'Phase 3, KPHB Colony, 5th Cross Road',
    attachmentName: 'water_sample_sample.jpg',
    reporterName: 'Srinivas Murthy',
    reporterEmail: 'smurthy@example.com',
    reporterPhone: '+91 91234 56789',
    status: 'In Progress',
    priority: 'HIGH',
    department: 'Water Supply',
    assignedOfficer: 'Suresh Varma',
    submittedAt: '2026-10-25T11:00:00.000Z',
    targetResolutionDate: '2026-10-28T11:00:00.000Z', // Overdue
    simulatedTimeShiftHours: 0,
    isEscalated: true,
    escalationReason: 'Deadline exceeded',
    escalationNote: 'Target SLA was 72 hours. Pipe leak test underway but delayed due to heavy traffic on main arterial road.',
    escalatedAt: '2026-10-29T10:00:00.000Z',
    auditTrail: [
      {
        id: 'aud-201',
        timestamp: '2026-10-25T11:00:00.000Z',
        user: 'Srinivas Murthy',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Reported water contamination issue.'
      },
      {
        id: 'aud-202',
        timestamp: '2026-10-25T11:45:00.000Z',
        user: 'Operations Desk',
        role: 'System',
        action: 'Case Assigned',
        description: 'Assigned to Water Supply -> Suresh Varma'
      },
      {
        id: 'aud-203',
        timestamp: '2026-10-26T08:30:00.000Z',
        user: 'Suresh Varma',
        role: 'Staff',
        action: 'Status Changed',
        description: 'Submitted → Acknowledged',
        note: 'Notified water quality testing lab.'
      },
      {
        id: 'aud-204',
        timestamp: '2026-10-26T14:15:00.000Z',
        user: 'Suresh Varma',
        role: 'Staff',
        action: 'Status Changed',
        description: 'Acknowledged → In Progress',
        note: 'Inspection crew deployed to locate pipeline fissure.'
      },
      {
        id: 'aud-205',
        timestamp: '2026-10-29T10:00:00.000Z',
        user: 'Ananya Sharma',
        role: 'Manager',
        action: 'Case Escalated',
        description: 'Case marked as Escalated.',
        note: 'Reason: Deadline exceeded. Priority escalated to Level 2.'
      }
    ],
    internalNotes: [
      {
        id: 'not-02',
        author: 'Suresh Varma',
        role: 'Staff',
        text: 'Valve check completed on feeder line. Sump cleaning recommended for Phase 3 block.',
        createdAt: '2026-10-27T16:00:00.000Z'
      }
    ]
  },

  // 3. Overdue Case 2
  {
    id: 'PG-2026-00115',
    title: 'Non-functional streetlights along school corridor',
    category: 'Street Lighting',
    subcategory: 'Block Blackout',
    description: 'Eight consecutive street lamps have been dark for two weeks. Creates unsafe conditions for students returning from evening tuition.',
    incidentDate: '2026-10-22',
    area: 'Madhapur',
    address: 'Near Little Angels School, Ayyappa Society Road',
    reporterName: 'Meenakshi Iyer',
    reporterEmail: 'meenakshi.i@example.com',
    reporterPhone: '+91 98877 66554',
    status: 'In Progress',
    priority: 'MEDIUM',
    department: 'Street Lighting',
    assignedOfficer: 'Arun Venkatesh',
    submittedAt: '2026-10-23T14:20:00.000Z',
    targetResolutionDate: '2026-10-28T14:20:00.000Z', // Overdue
    simulatedTimeShiftHours: 0,
    isEscalated: true,
    escalationReason: 'Citizen follow-up',
    escalationNote: 'Citizen called helplines multiple times citing safety risks for women and children.',
    escalatedAt: '2026-10-29T12:30:00.000Z',
    auditTrail: [
      {
        id: 'aud-301',
        timestamp: '2026-10-23T14:20:00.000Z',
        user: 'Meenakshi Iyer',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Streetlights failure lodged.'
      },
      {
        id: 'aud-302',
        timestamp: '2026-10-24T09:00:00.000Z',
        user: 'Arun Venkatesh',
        role: 'Staff',
        action: 'Status Changed',
        description: 'Submitted → In Progress',
        note: 'Replaced ballast capacitors on 3 poles. Remaining poles require underground cable trenching.'
      },
      {
        id: 'aud-303',
        timestamp: '2026-10-29T12:30:00.000Z',
        user: 'Ananya Sharma',
        role: 'Manager',
        action: 'Case Escalated',
        description: 'Case escalated upon repetitive citizen distress inquiries.'
      }
    ],
    internalNotes: []
  },

  // 4. Overdue Case 3 (Critical)
  {
    id: 'PG-2026-00119',
    title: 'Exposed high-voltage wire touching metal pedestrian railing',
    category: 'Electricity',
    subcategory: 'Electric Shock Hazard',
    description: 'Storm damaged branch fell on overhead distribution box. Live wire is hanging in direct contact with pedestrian footpath railing.',
    incidentDate: '2026-10-29',
    area: 'Secunderabad',
    address: 'Near Railway Station Clock Tower bus shelter',
    attachmentName: 'live_wire_railing.jpg',
    reporterName: 'Vikramaditya Rao',
    reporterEmail: 'v.rao@example.com',
    reporterPhone: '+91 97711 22334',
    status: 'In Progress',
    priority: 'CRITICAL',
    department: 'Electricity',
    assignedOfficer: 'Ramesh Chandran',
    submittedAt: '2026-10-29T18:00:00.000Z',
    targetResolutionDate: '2026-10-30T18:00:00.000Z', // 24h SLA expired -> Overdue
    simulatedTimeShiftHours: 0,
    isEscalated: true,
    escalationReason: 'High priority',
    escalationNote: 'Life-safety emergency. Transformer feeder de-energized temporarily; permanent line repair still pending.',
    escalatedAt: '2026-10-30T19:00:00.000Z',
    auditTrail: [
      {
        id: 'aud-401',
        timestamp: '2026-10-29T18:00:00.000Z',
        user: 'Vikramaditya Rao',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Emergency safety hazard logged.'
      },
      {
        id: 'aud-402',
        timestamp: '2026-10-29T18:15:00.000Z',
        user: 'System Emergency Dispatch',
        role: 'System',
        action: 'Priority Auto-Set',
        description: 'Assigned Priority CRITICAL and notified electrical line emergency squad.'
      },
      {
        id: 'aud-403',
        timestamp: '2026-10-29T18:30:00.000Z',
        user: 'Ramesh Chandran',
        role: 'Staff',
        action: 'Status Changed',
        description: 'Acknowledged → In Progress',
        note: 'Substation isolated feeder 4B. Emergency caution tape erected around railing.'
      }
    ],
    internalNotes: [
      {
        id: 'not-03',
        author: 'Ramesh Chandran',
        role: 'Staff',
        text: 'Insulator bracket replaced; final clearance certification needed from safety inspector before line re-energization.',
        createdAt: '2026-10-30T22:00:00.000Z'
      }
    ]
  },

  // 5. Active Case (At Risk)
  {
    id: 'PG-2026-00121',
    title: 'Overflowing commercial waste bin attracting stray animals',
    category: 'Sanitation',
    subcategory: 'Garbage Dump Overflow',
    description: 'Garbage compactor vehicle has missed collections for 3 days. Commercial food waste is rotting on the walkway and blocking school bus access.',
    incidentDate: '2026-10-30',
    area: 'Banjara Hills',
    address: 'Road No. 12, Opposite City Center Mall service lane',
    reporterName: 'Farhan Akhtar',
    reporterEmail: 'farhan.a@example.com',
    reporterPhone: '+91 94455 66778',
    status: 'In Progress',
    priority: 'HIGH',
    department: 'Sanitation',
    assignedOfficer: 'Sunita Devi',
    submittedAt: '2026-10-30T08:00:00.000Z',
    targetResolutionDate: '2026-10-31T20:00:00.000Z', // Due in a few hours (At Risk)
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    auditTrail: [
      {
        id: 'aud-501',
        timestamp: '2026-10-30T08:00:00.000Z',
        user: 'Farhan Akhtar',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Sanitation complaint lodged.'
      },
      {
        id: 'aud-502',
        timestamp: '2026-10-30T09:30:00.000Z',
        user: 'Sunita Devi',
        role: 'Staff',
        action: 'Status Changed',
        description: 'Submitted → In Progress',
        note: 'Special truck fleet requested from secondary transfer station.'
      }
    ],
    internalNotes: []
  },

  // 6. Active Case (Awaiting Information)
  {
    id: 'PG-2026-00122',
    title: 'Missing drainage grating cover on residential street',
    category: 'Roads & Infrastructure',
    subcategory: 'Stormwater Drain Cover',
    description: 'Cast iron storm drain cover was dislodged by heavy delivery vehicle. Open storm ditch is 4 feet deep.',
    incidentDate: '2026-10-30',
    area: 'Hitech City',
    address: 'Near Cyber Towers lane 7, lane identifier missing',
    reporterName: 'Priya Sharma',
    reporterEmail: 'priya.sharma@example.com',
    reporterPhone: '+91 98223 34455',
    status: 'Awaiting Information',
    priority: 'MEDIUM',
    department: 'Roads & Infrastructure',
    assignedOfficer: 'Ananya Sharma',
    submittedAt: '2026-10-30T10:15:00.000Z',
    targetResolutionDate: '2026-11-04T10:15:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    auditTrail: [
      {
        id: 'aud-601',
        timestamp: '2026-10-30T10:15:00.000Z',
        user: 'Priya Sharma',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Grievance submitted.'
      },
      {
        id: 'aud-602',
        timestamp: '2026-10-30T14:00:00.000Z',
        user: 'Ananya Sharma',
        role: 'Staff',
        action: 'Status Changed',
        description: 'In Progress → Awaiting Information',
        note: 'Requested citizen to provide exact building or pillar number near lane 7 to locate drain ditch accurately.'
      }
    ],
    internalNotes: [
      {
        id: 'not-04',
        author: 'Ananya Sharma',
        role: 'Staff',
        text: 'SMS notification dispatched to citizen requesting exact landmark.',
        createdAt: '2026-10-30T14:05:00.000Z'
      }
    ]
  },

  // 7. Active Case (On Track, Acknowledged)
  {
    id: 'PG-2026-00123',
    title: 'Low voltage fluctuations destroying home electronics',
    category: 'Electricity',
    subcategory: 'Voltage Stability',
    description: 'Voltage dropping to 140V during peak evening hours (7 PM to 10 PM). Multiple air conditioners and refrigerators tripping.',
    incidentDate: '2026-10-30',
    area: 'Secunderabad',
    address: 'Padmarao Nagar, Sector C, Street 4',
    reporterName: 'Girish Kulkarni',
    reporterEmail: 'girish.k@example.com',
    reporterPhone: '+91 93456 78901',
    status: 'Acknowledged',
    priority: 'MEDIUM',
    department: 'Electricity',
    assignedOfficer: 'Sneha Patel',
    submittedAt: '2026-10-30T16:45:00.000Z',
    targetResolutionDate: '2026-11-04T16:45:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    auditTrail: [
      {
        id: 'aud-701',
        timestamp: '2026-10-30T16:45:00.000Z',
        user: 'Girish Kulkarni',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Complaint submitted.'
      },
      {
        id: 'aud-702',
        timestamp: '2026-10-31T08:15:00.000Z',
        user: 'Sneha Patel',
        role: 'Staff',
        action: 'Status Changed',
        description: 'Submitted → Acknowledged',
        note: 'Transformer load audit scheduled for 1st Nov.'
      }
    ],
    internalNotes: []
  },

  // 8. Resolved Case 1
  {
    id: 'PG-2026-00112',
    title: 'Burst pipeline flooding street and basement parking',
    category: 'Water Supply',
    subcategory: 'Main Feeder Pipeline Burst',
    description: 'High pressure drinking water feeder pipeline fractured under road pressure. Water flooding street and nearby residential parking.',
    incidentDate: '2026-10-21',
    area: 'Jubilee Hills',
    address: 'Road No. 36, Near Metro Pillar 1045',
    attachmentName: 'pipe_burst_photo.jpg',
    reporterName: 'Dr. Anand Mahindra',
    reporterEmail: 'anand.m@example.com',
    reporterPhone: '+91 98112 23344',
    status: 'Resolved',
    priority: 'HIGH',
    department: 'Water Supply',
    assignedOfficer: 'Kavitha Rao',
    submittedAt: '2026-10-21T07:30:00.000Z',
    targetResolutionDate: '2026-10-24T07:30:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    resolutionNote: 'Main DI pipeline sleeve replaced and clamped. Pressure tested up to 6 bar with zero seepage. Road resurfacing patch completed.',
    resolutionEvidence: 'water_pipeline_completion_certificate.pdf',
    resolvedAt: '2026-10-23T16:40:00.000Z',
    auditTrail: [
      {
        id: 'aud-801',
        timestamp: '2026-10-21T07:30:00.000Z',
        user: 'Dr. Anand Mahindra',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Emergency water leak registered.'
      },
      {
        id: 'aud-802',
        timestamp: '2026-10-21T08:10:00.000Z',
        user: 'Kavitha Rao',
        role: 'Staff',
        action: 'Status Changed',
        description: 'Submitted → In Progress',
        note: 'Emergency maintenance crew dispatched with vacuum suction trucks.'
      },
      {
        id: 'aud-803',
        timestamp: '2026-10-23T16:40:00.000Z',
        user: 'Kavitha Rao',
        role: 'Staff',
        action: 'Case Resolved',
        description: 'In Progress → Resolved',
        note: 'Main DI pipeline sleeve replaced and clamped. Pressure tested up to 6 bar with zero seepage. Road resurfacing patch completed.'
      }
    ],
    internalNotes: []
  },

  // 9. Resolved Case 2
  {
    id: 'PG-2026-00114',
    title: 'Malfunctioning traffic signals causing gridlock at prime intersection',
    category: 'Transportation',
    subcategory: 'Traffic Signal Controller Failure',
    description: 'Signals blinking amber intermittently on all 4 directions during morning peak hours. Causes massive bottleneck towards IT corridor.',
    incidentDate: '2026-10-22',
    area: 'Hitech City',
    address: 'Cyber Towers Junction to Mindspace Flyover ingress',
    reporterName: 'Naveen Teja',
    reporterEmail: 'nteja@example.com',
    reporterPhone: '+91 97001 23456',
    status: 'Resolved',
    priority: 'HIGH',
    department: 'Transportation',
    assignedOfficer: 'Divya Nambiar',
    submittedAt: '2026-10-22T08:45:00.000Z',
    targetResolutionDate: '2026-10-25T08:45:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    resolutionNote: 'SCATS junction microcontroller board replaced. Loop detectors recalibrated and signal synchronization tested with traffic police command control.',
    resolutionEvidence: 'traffic_controller_diag.pdf',
    resolvedAt: '2026-10-24T11:20:00.000Z',
    auditTrail: [
      {
        id: 'aud-901',
        timestamp: '2026-10-22T08:45:00.000Z',
        user: 'Naveen Teja',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Traffic signal failure submitted.'
      },
      {
        id: 'aud-902',
        timestamp: '2026-10-24T11:20:00.000Z',
        user: 'Divya Nambiar',
        role: 'Staff',
        action: 'Case Resolved',
        description: 'In Progress → Resolved',
        note: 'SCATS junction microcontroller board replaced. Loop detectors recalibrated.'
      }
    ],
    internalNotes: []
  },

  // 10. Resolved Case 3
  {
    id: 'PG-2026-00109',
    title: 'Fallen tree blocking arterial residential colony entrance',
    category: 'Public Safety',
    subcategory: 'Storm Debris / Tree Fall',
    description: 'Large banyan branch snapped during thunderstorm, completely obstructing ambulance and car access into layout.',
    incidentDate: '2026-10-18',
    area: 'Begumpet',
    address: 'Near Old Airport Road, Prakash Nagar Gate 2',
    reporterName: 'Ayesha Siddiqui',
    reporterEmail: 'ayesha.s@example.com',
    reporterPhone: '+91 98866 55443',
    status: 'Resolved',
    priority: 'CRITICAL',
    department: 'Public Safety',
    assignedOfficer: 'Inspector R. Naidu',
    submittedAt: '2026-10-18T19:00:00.000Z',
    targetResolutionDate: '2026-10-19T19:00:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    resolutionNote: 'Forest department woodcutters cleared fallen banyan branch using heavy chainsaws. Street swept clean and traffic flow restored within 4 hours.',
    resolvedAt: '2026-10-19T02:30:00.000Z',
    auditTrail: [
      {
        id: 'aud-1001',
        timestamp: '2026-10-18T19:00:00.000Z',
        user: 'Ayesha Siddiqui',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Emergency tree obstruction reported.'
      },
      {
        id: 'aud-1002',
        timestamp: '2026-10-19T02:30:00.000Z',
        user: 'Inspector R. Naidu',
        role: 'Staff',
        action: 'Case Resolved',
        description: 'In Progress → Resolved',
        note: 'Debris completely cleared and access restored.'
      }
    ],
    internalNotes: []
  },

  // 11. Closed Case 1
  {
    id: 'PG-2026-00105',
    title: 'Sewage backflow in public park jogging track',
    category: 'Sanitation',
    subcategory: 'Manhole Choke',
    description: 'Clogged subterranean drainage line caused untreated sewage to seep across morning jogging track and children play area.',
    incidentDate: '2026-10-14',
    area: 'Kondapur',
    address: 'Botanical Garden peripheral track, Pillar 42',
    reporterName: 'Sanjay Dutt',
    reporterEmail: 'sanjay.d@example.com',
    reporterPhone: '+91 99001 12233',
    status: 'Closed',
    priority: 'HIGH',
    department: 'Sanitation',
    assignedOfficer: 'Kalyan Chakravarthy',
    submittedAt: '2026-10-14T09:00:00.000Z',
    targetResolutionDate: '2026-10-17T09:00:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    resolutionNote: 'High pressure super-sucker jetting machine cleared plastic debris obstruction. Bleaching powder and bio-sanitizer sprayed across entire perimeter.',
    resolvedAt: '2026-10-16T15:00:00.000Z',
    closedAt: '2026-10-18T10:00:00.000Z',
    auditTrail: [
      {
        id: 'aud-1101',
        timestamp: '2026-10-14T09:00:00.000Z',
        user: 'Sanjay Dutt',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Lodged sanitation grievance.'
      },
      {
        id: 'aud-1102',
        timestamp: '2026-10-16T15:00:00.000Z',
        user: 'Kalyan Chakravarthy',
        role: 'Staff',
        action: 'Case Resolved',
        description: 'In Progress → Resolved',
        note: 'Line unclogged and park sanitized.'
      },
      {
        id: 'aud-1103',
        timestamp: '2026-10-18T10:00:00.000Z',
        user: 'Ananya Sharma',
        role: 'Manager',
        action: 'Case Closed',
        description: 'Resolved → Closed',
        note: 'Citizen confirmed satisfaction via telephonic verification.'
      }
    ],
    internalNotes: []
  },

  // 12. Closed Case 2
  {
    id: 'PG-2026-00102',
    title: 'Damaged speed breaker without reflective paint causing vehicle underbody hits',
    category: 'Roads & Infrastructure',
    subcategory: 'Speed Breaker Maintenance',
    description: 'Unmarked concrete hump constructed without municipal standards. Cars bottom out and two-wheelers lose balance at night.',
    incidentDate: '2026-10-10',
    area: 'Madhapur',
    address: '100 Feet Road, Near Durgam Cheruvu cable bridge exit',
    reporterName: 'Rohit Khandelwal',
    reporterEmail: 'rohit.k@example.com',
    reporterPhone: '+91 97123 45678',
    status: 'Closed',
    priority: 'LOW',
    department: 'Roads & Infrastructure',
    assignedOfficer: 'Vikram Singh',
    submittedAt: '2026-10-10T11:20:00.000Z',
    targetResolutionDate: '2026-10-17T11:20:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    resolutionNote: 'Speed breaker leveled as per IRC specifications and coated with thermoplastic yellow retro-reflective chevron markings. Warning signboards installed 30m prior.',
    resolvedAt: '2026-10-15T17:00:00.000Z',
    closedAt: '2026-10-17T09:30:00.000Z',
    auditTrail: [
      {
        id: 'aud-1201',
        timestamp: '2026-10-10T11:20:00.000Z',
        user: 'Rohit Khandelwal',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Road safety issue reported.'
      },
      {
        id: 'aud-1202',
        timestamp: '2026-10-15T17:00:00.000Z',
        user: 'Vikram Singh',
        role: 'Staff',
        action: 'Case Resolved',
        description: 'In Progress → Resolved'
      },
      {
        id: 'aud-1203',
        timestamp: '2026-10-17T09:30:00.000Z',
        user: 'Vikram Singh',
        role: 'Staff',
        action: 'Case Closed',
        description: 'Resolved → Closed',
        note: 'Final site inspection verified.'
      }
    ],
    internalNotes: []
  },

  // 13. Active Case (Submitted, Unassigned)
  {
    id: 'PG-2026-00125',
    title: 'Open construction debris dumped on public sidewalk',
    category: 'Waste Management',
    subcategory: 'Illegal Debris Dumping',
    description: 'Contractor dumped 3 truckloads of demolition rubble directly on the pedestrian sidewalk, forcing pedestrians to walk on the busy motor carriageway.',
    incidentDate: '2026-10-31',
    area: 'Ameerpet',
    address: 'Near Metro Station Pillar 108, Main Road',
    reporterName: 'Murali Krishna',
    reporterEmail: 'murali.k@example.com',
    reporterPhone: '+91 94901 23456',
    status: 'Submitted',
    priority: 'MEDIUM',
    department: 'Waste Management',
    assignedOfficer: 'Unassigned',
    submittedAt: '2026-10-31T07:15:00.000Z',
    targetResolutionDate: '2026-11-05T07:15:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    auditTrail: [
      {
        id: 'aud-1301',
        timestamp: '2026-10-31T07:15:00.000Z',
        user: 'Murali Krishna',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Debris dumping logged.'
      }
    ],
    internalNotes: []
  },

  // 14. Active Case (Acknowledged, On Track)
  {
    id: 'PG-2026-00126',
    title: 'Loose manhole lid clattering and rattling with passing buses',
    category: 'Sanitation',
    subcategory: 'Loose Sewer Cover',
    description: 'Heavy metal lid tilts whenever bus wheels pass over it. Already flipped once, dangerous risk of tyre puncturing or pedestrian falling through.',
    incidentDate: '2026-10-31',
    area: 'Miyapur',
    address: 'Near Allwyn X Roads, In front of Bus Terminal Gate 1',
    reporterName: 'Swathi Reddy',
    reporterEmail: 'swathi.r@example.com',
    reporterPhone: '+91 96180 98765',
    status: 'Acknowledged',
    priority: 'HIGH',
    department: 'Sanitation',
    assignedOfficer: 'Sunita Devi',
    submittedAt: '2026-10-31T08:00:00.000Z',
    targetResolutionDate: '2026-11-03T08:00:00.000Z',
    simulatedTimeShiftHours: 0,
    isEscalated: false,
    auditTrail: [
      {
        id: 'aud-1401',
        timestamp: '2026-10-31T08:00:00.000Z',
        user: 'Swathi Reddy',
        role: 'Citizen',
        action: 'Case Created',
        description: 'Loose lid safety issue logged.'
      },
      {
        id: 'aud-1402',
        timestamp: '2026-10-31T08:50:00.000Z',
        user: 'Sunita Devi',
        role: 'Staff',
        action: 'Status Changed',
        description: 'Submitted → Acknowledged',
        note: 'Bitumen sealing crew alerted.'
      }
    ],
    internalNotes: []
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    caseId: 'PG-2026-00119',
    title: 'High Voltage Hazard Overdue',
    message: 'Case PG-2026-00119 has exceeded its 24-hour Critical SLA deadline.',
    type: 'alert',
    read: false,
    createdAt: '2026-10-30T19:00:00.000Z'
  },
  {
    id: 'notif-2',
    caseId: 'PG-2026-00118',
    title: 'Case Escalated to Level 2',
    message: 'Case PG-2026-00118 (Water Supply) has been escalated by Manager.',
    type: 'warning',
    read: false,
    createdAt: '2026-10-29T10:00:00.000Z'
  },
  {
    id: 'notif-3',
    caseId: 'PG-2026-00124',
    title: 'New Grievance Registered',
    message: 'Case PG-2026-00124 (Roads & Infrastructure) submitted by Karthik Varma in Gachibowli.',
    type: 'info',
    read: true,
    createdAt: '2026-10-31T09:30:00.000Z'
  },
  {
    id: 'notif-4',
    caseId: 'PG-2026-00112',
    title: 'Water Pipe Burst Resolved',
    message: 'Case PG-2026-00112 was resolved by Kavitha Rao.',
    type: 'success',
    read: true,
    createdAt: '2026-10-23T16:40:00.000Z'
  }
];
