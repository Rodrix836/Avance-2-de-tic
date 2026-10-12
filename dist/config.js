'use strict';

// CLIENT FILE — edit this file for each delivery. No build or installation needed.
// Keep object keys (rivalidad, r1, etc.) unchanged: they connect the map and cycles.
// Text is plain text, not HTML. Logo paths are relative to dist/index.html.
const projectConfig = {
  company: {
    name: 'NOVA DIGITAL', industry: 'Digital Services', country: 'Peru', date: '2026',
    logo: '', // Example: 'assets/client-logo.svg'. Empty or missing image uses initials.
    description: 'A clear view of the pressures shaping the business — and the choices that move it forward.'
  },
  branding: {
    primaryColor: '#ee572b', secondaryColor: '#176c59', backgroundColor: '#f5f7f8',
    surfaceColor: '#ffffff', textColor: '#202428', mutedColor: '#626970'
  },
  forces: {
    rivalidad: {
      number: '01', title: 'Competitive Rivalry', level: 'High',
      subtitle: 'Competition within the sector', example: 'Price · quality · differentiation',
      description: 'Digital service providers compete for the same clients through price, delivery quality and customer experience.',
      drivers: ['Similar offers make comparisons easy.', 'Clients expect reliable delivery and visible results.', 'Discounting can reduce the margin available for improvement.'],
      impact: 'Focus on a clear customer need and prove the value of dependable service.',
      loop: 'b2', connection: 'B2 · Margin pressure',
      mechanism: 'Competition puts pressure on prices and delivery costs.', relationship: 'B2 · Less margin available for reinvestment.'
    },
    entrantes: {
      number: '02', title: 'Threat of New Entrants', level: 'Medium–high',
      subtitle: 'Barriers to market entry', example: 'Tools · skills · reputation',
      description: 'Accessible tools let small providers enter the market, while reputation and trusted relationships take time to build.',
      drivers: ['Low initial equipment requirements support entry.', 'Specialist skills and references are harder to replicate.', 'Established client relationships make scaling more difficult.'],
      impact: 'Build reusable expertise, a credible portfolio and consistent delivery processes.',
      loop: 'b2', connection: 'B2 · New market supply',
      mechanism: 'An attractive market encourages new providers.', relationship: 'B2 · New supply increases competitive pressure.'
    },
    proveedores: {
      number: '03', title: 'Supplier Power', level: 'Medium',
      subtitle: 'Dependence on key resources', example: 'Software · platforms · talent',
      description: 'Software platforms and specialist partners influence the cost, capacity and continuity of service delivery.',
      drivers: ['A single essential platform can create dependence.', 'Migration requires time and retraining.', 'Specialist talent may be difficult to replace quickly.'],
      impact: 'Document processes and maintain viable alternatives for critical resources.',
      loop: 'b1', connection: 'B1 · Delivery capacity',
      mechanism: 'Resource availability and cost constrain delivery capacity.', relationship: 'B1 · Limited capacity can increase saturation.'
    },
    clientes: {
      number: '04', title: 'Buyer Power', level: 'High',
      subtitle: 'Customer negotiating power', example: 'Choice · budgets · switching',
      description: 'Buyers can compare many providers and negotiate scope, price and delivery time, especially for standardized services.',
      drivers: ['Many alternatives increase negotiating power.', 'Large contracts create customer concentration risk.', 'Clear outcomes matter more than a long feature list.'],
      impact: 'Define scope and outcomes clearly, and earn repeat business through service quality.',
      loop: 'b2', connection: 'B2 · Price and perceived value',
      mechanism: 'Negotiation affects price and expected service quality.', relationship: 'B2 · Buyer demands influence reinvestment margins.'
    },
    sustitutos: {
      number: '05', title: 'Threat of Substitutes', level: 'Medium',
      subtitle: 'Alternative ways to meet a need', example: 'In-house · DIY · templates',
      description: 'Customers may use internal teams, self-service tools or ready-made templates instead of purchasing a managed service.',
      drivers: ['Templates work well for straightforward needs.', 'Internal teams offer direct control.', 'Total effort and quality influence the choice.'],
      impact: 'Show where specialist support saves time or improves results compared with doing it in-house.',
      loop: 'b2', connection: 'B2 · Relative value',
      mechanism: 'Alternative approaches limit the price buyers will accept.', relationship: 'B2 · Relative value affects demand and margins.'
    }
  },
  // Editorial assessments, not a calculated score. Ties can be written explicitly.
  executiveSummary: {
    overallPressure: 'High', strongestForce: 'Rivalry & Buyer Power',
    mainRisk: 'Price-led competition', mainOpportunity: 'Distinctive customer experience',
    strategicPriority: 'Prove value before competing on price.'
  },
  // Use 3–5 concise recommendations.
  recommendations: [
    { title: 'Make the difference visible', description: 'Package services around a specific customer outcome and demonstrate results.' },
    { title: 'Protect delivery capacity', description: 'Plan workload and maintain alternatives for critical tools and partners.' },
    { title: 'Build lasting relationships', description: 'Use clear expectations, useful follow-ups and consistent service quality.' }
  ],
  dynamics: {
    title: 'Limits to growth',
    description: 'Adoption supports improvement. Capacity constraints and competitive pressure can slow it down. All three cycles share service adoption.',
    intervention: 'Improve efficiency and capacity before demand overtakes them. Differentiate the service to protect value and the margin available for reinvestment.',
    // Each node has two short lines. signs[i] describes node i → next node.
    // R1: even number of negative links; B1/B2: odd number. Delays use zero-based edge indices.
    loops: {
      r1: {
        code: 'R1', type: 'reinforcing', name: 'Innovation that compounds', short: 'Innovation',
        nodes: [['Service', 'adoption'], ['Available', 'revenue'], ['Reinvestment', 'in improvement'], ['Perceived', 'service value']],
        signs: ['+', '+', '+', '+'], delays: [2],
        description: 'More adoption can fund improvements. When improvements add value, they encourage further adoption.',
        steps: ['Adoption → revenue (+).', 'Revenue → reinvestment (+).', 'Reinvestment → perceived value (+, delayed).', 'Perceived value → adoption (+).'],
        hypothesis: 'The service is monetized, margins are positive and reinvestment is effective. More customers do not automatically create better service.'
      },
      b1: {
        code: 'B1', type: 'balancing', name: 'The capacity constraint', short: 'Capacity',
        nodes: [['Service', 'adoption'], ['Delivery', 'workload'], ['Capacity', 'saturation'], ['Service', 'quality']],
        signs: ['+', '+', '−', '+'], delays: [],
        description: 'If demand rises without added capacity, saturation increases. Slower or less reliable delivery can limit adoption.',
        steps: ['Adoption → workload (+).', 'Workload → saturation (+).', 'Saturation → service quality (−).', 'Service quality → adoption (+).'],
        hypothesis: 'Capacity is fixed in the short term. Increasing it takes time and depends on resource availability and cost.'
      },
      b2: {
        code: 'B2', type: 'balancing', name: 'The pressure to compete', short: 'Competition',
        nodes: [['Service', 'adoption'], ['Market', 'attractiveness'], ['Competitive', 'pressure'], ['Reinvestable', 'margin'], ['Relative value', 'improvement']],
        signs: ['+', '+', '−', '+', '+'], delays: [1, 3],
        description: 'Market growth can attract new supply. Competition can reduce the margin available to improve the service and sustain adoption.',
        steps: ['Adoption → market attractiveness (+).', 'Attractiveness → competitive pressure (+, delayed).', 'Pressure → reinvestable margin (−).', 'Margin → relative value (+, delayed).', 'Relative value → adoption (+).'],
        hypothesis: 'Service adoption is a signal of segment growth. This cycle combines competitive pressures into a simplified hypothesis, not a universal rule.'
      }
    }
  },
  methodology: {
    scope: 'Porter describes industry structure. System dynamics explores feedback over time. This dashboard connects the two through explicit qualitative assumptions.',
    note: 'Illustrative demo: intensities, summary and recommendations are editorial assessments, not measured scores. Causal cycles are hypotheses, not a calibrated simulation or forecast. Replace them with evidence appropriate to each client.',
    sources: [
      { title: 'Harvard Business School', description: 'The Five Forces · Michael E. Porter', url: 'https://www.isc.hbs.edu/strategy/business-strategy/Pages/the-five-forces.aspx' },
      { title: 'The Systems Thinker', description: 'Using “Limits to Success” as a Planning Tool · Daniel H. Kim', url: 'https://thesystemsthinker.com/using-limits-to-success-as-a-planning-tool/' }
    ]
  }
};
