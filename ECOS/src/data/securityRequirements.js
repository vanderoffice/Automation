const securityRequirements = [
  {
    id: 'authorized-use',
    title: 'Authorized Use',
    required: true,
    content: [
      'System access is granted solely for the performance of official state duties and authorized job functions.',
      'Personal use of ECOS or any connected state information system is prohibited.',
      'You may not access, view, or retrieve data unless it is directly related to your assigned responsibilities.',
      'Unauthorized access to records, including those of co-workers, family members, or public figures, is a violation of state policy and may result in disciplinary action.',
    ],
  },
  {
    id: 'data-confidentiality',
    title: 'Data Confidentiality',
    required: true,
    content: [
      'All data accessed through ECOS is confidential and protected under the Information Practices Act (Civil Code Section 1798 et seq.).',
      'You may not disclose, copy, or transmit confidential data to any unauthorized individual, organization, or system.',
      'Confidential information includes but is not limited to employee records, salary data, personnel actions, and benefits information.',
      'Obligations under this section survive any change in position, transfer, or separation from state service.',
    ],
  },
  {
    id: 'password-authentication',
    title: 'Password & Authentication',
    required: true,
    content: [
      'Protect your login credentials at all times. Never share your password, PIN, or any authentication token with anyone, including supervisors or IT staff.',
      'Use strong, unique passwords that meet or exceed state password complexity requirements.',
      'Lock your workstation (Ctrl+L or equivalent) whenever you leave it unattended, even briefly.',
      'Report any suspected compromise of your credentials immediately to your supervisor and your department Information Security Officer (ISO).',
      'Multi-factor authentication must be enabled where available and must not be bypassed or delegated.',
    ],
  },
  {
    id: 'incident-reporting',
    title: 'Incident Reporting',
    required: true,
    content: [
      'Report any suspected or confirmed security incident immediately to your supervisor and your department ISO.',
      'Security incidents include unauthorized access, data breaches, lost or stolen devices, phishing attacks, and suspicious system behavior.',
      'Preserve all evidence related to the incident — do not delete files, clear logs, or power off devices unless directed by security personnel.',
      'Cooperate fully with any investigation conducted by your department, CalHR, or the California Department of Technology (CDT).',
    ],
  },
  {
    id: 'software-system-integrity',
    title: 'Software & System Integrity',
    required: true,
    content: [
      'Do not install, download, or execute unauthorized software on any state device or system.',
      'Do not attempt to circumvent, disable, or interfere with any security controls, monitoring tools, or access restrictions.',
      'Do not connect personal or unauthorized devices (USB drives, external hard drives, personal phones) to state systems without written approval.',
      'Keep all state-issued software and operating systems updated with the latest security patches as directed by your IT department.',
    ],
  },
  {
    id: 'remote-access-telework',
    title: 'Remote Access & Telework',
    required: true,
    content: [
      'When accessing state systems remotely, use only approved VPN connections and encrypted communication channels.',
      'Secure your home network with a strong password and current firmware. Do not access state data over public or unsecured WiFi networks.',
      'Maintain physical security of state-issued devices — do not leave laptops or mobile devices unattended in vehicles, public spaces, or shared areas.',
      'Remote access privileges may be revoked at any time based on operational need or security concerns.',
    ],
  },
  {
    id: 'termination-of-access',
    title: 'Termination of Access',
    required: true,
    content: [
      'System access will be revoked immediately upon separation from state service, transfer to a position that does not require ECOS access, or a change in job duties.',
      'Upon termination or transfer, return all state-issued equipment, data, and access tokens to your supervisor or designated property custodian.',
      'You may not retain copies of any confidential data accessed through ECOS after your access has been revoked.',
      'Your obligations regarding data confidentiality and incident reporting survive the termination of your access.',
    ],
  },
]

const adminResponsibilities = {
  id: 'admin-responsibilities',
  title: 'User Administrator Responsibilities',
  required: true,
  isAdmin: true,
  content: [
    'Maintain accurate and up-to-date records of all users under your administrative authority, including access levels, role assignments, and approval dates.',
    'Conduct periodic access reviews (at minimum quarterly) to ensure each user\'s access level remains appropriate for their current duties.',
    'Ensure all subordinate users have completed and signed the current ECOS Security Agreement before granting or renewing access.',
    'Report access anomalies — including orphaned accounts, excessive privileges, and unauthorized role changes — immediately to the department ISO.',
    'You are accountable for ensuring compliance within your area of responsibility. Failure to maintain access records or conduct reviews may result in administrative action.',
  ],
}

export { securityRequirements, adminResponsibilities }
