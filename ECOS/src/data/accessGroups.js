const accessGroups = [
  {
    id: 'ecos_user',
    name: 'ECOS User',
    description: 'Basic system access for viewing and entering personnel transactions',
  },
  {
    id: 'personnel_transactions',
    name: 'Personnel Transactions',
    description: 'Create and submit personnel action requests (PAR)',
  },
  {
    id: 'position_control',
    name: 'Position Control',
    description: 'View and manage position allocations and classifications',
  },
  {
    id: 'fiscal_reporting',
    name: 'Fiscal & Reporting',
    description: 'Access payroll data, fiscal reports, and budget allocations',
  },
  {
    id: 'system_admin',
    name: 'System Administration',
    description: 'User management, configuration, and audit access',
  },
]

export { accessGroups }
