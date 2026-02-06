const accessGroups = [
  {
    id: 'ecos_user',
    name: 'ECOS User',
    description: 'Basic ECOS system access for viewing and entering personnel transactions',
    category: 'standard',
  },
  {
    id: 'personnel_transactions',
    name: 'Personnel Transactions',
    description: 'Create and submit personnel action requests (PAR)',
    category: 'standard',
  },
  {
    id: 'position_control',
    name: 'Position Control',
    description: 'View and manage position allocations and classifications',
    category: 'standard',
  },
  {
    id: 'exam_unit',
    name: 'Exam Unit',
    description: 'Access examination scheduling, scoring, and certification lists',
    category: 'standard',
  },
  {
    id: 'classification_unit',
    name: 'Classification & Pay',
    description: 'View and manage classification specifications and pay scales',
    category: 'standard',
  },
  {
    id: 'fiscal_reporting',
    name: 'Fiscal & Reporting',
    description: 'Access payroll data, fiscal reports, and budget allocations',
    category: 'elevated',
  },
  {
    id: 'system_admin',
    name: 'System Administration',
    description: 'Administrative access including user management and configuration',
    category: 'elevated',
  },
  {
    id: 'audit_compliance',
    name: 'Audit & Compliance',
    description: 'View audit trails, compliance reports, and security logs',
    category: 'elevated',
  },
]

export { accessGroups }
