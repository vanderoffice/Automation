import { useState } from 'react'
import { Card } from '../ui/Card'
import { TextInput } from '../ui/TextInput'
import { Checkbox } from '../ui/Checkbox'
import { Button } from '../ui/Button'
import { getAuditMeta } from '../../lib/auditMeta'

const ROLE_TITLES = {
  employee: 'Employee Signature',
  manager: 'Manager Approval',
  admin: 'Department Admin Approval',
}

const PREVIOUS_ROLE = {
  manager: 'employee',
  admin: 'manager',
}

function SignedState({ existingSignature }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        className="w-6 h-6 text-green-400 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <div>
        <p className="text-sm text-green-400 font-medium">
          Signed by {existingSignature.typed_name}
        </p>
        <p className="text-xs text-neutral-500 font-mono mt-0.5">
          {new Date(existingSignature.signed_at).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

function DisabledState({ signerRole }) {
  const prev = PREVIOUS_ROLE[signerRole]
  const label = prev
    ? 'Awaiting ' + ROLE_TITLES[prev].toLowerCase()
    : 'Awaiting prior signature'
  return (
    <p className="text-sm text-neutral-500 italic">{label}</p>
  )
}

function ActiveState({ signerName, onSign }) {
  const [typedName, setTypedName] = useState(signerName || '')
  const [certified, setCertified] = useState(false)
  const [signing, setSigning] = useState(false)

  const canSign = typedName.trim().length > 0 && certified && !signing

  async function handleSign() {
    if (!canSign) return
    setSigning(true)
    try {
      const auditMeta = await getAuditMeta()
      await onSign({
        typed_name: typedName.trim(),
        certified: true,
        ...auditMeta,
      })
    } finally {
      setSigning(false)
    }
  }

  return (
    <div className="space-y-4">
      <TextInput
        label="Type your full legal name to sign"
        name="signature-typed-name"
        value={typedName}
        onChange={(e) => setTypedName(e.target.value)}
        required
      />

      <Checkbox
        label="I certify that I have read, understand, and agree to comply with the terms of this ECOS Security Agreement."
        name="signature-certified"
        checked={certified}
        onChange={(e) => setCertified(e.target.checked)}
      />

      <Button
        variant="primary"
        size="lg"
        disabled={!canSign}
        onClick={handleSign}
        className="w-full"
      >
        {signing ? 'Signing...' : 'Sign Agreement'}
      </Button>

      <p className="text-xs text-neutral-500 text-center">
        By signing, you agree under UETA (Civil Code 1633.7) that your typed
        name constitutes a valid electronic signature.
      </p>
    </div>
  )
}

function SignatureBlock({
  signerRole,
  signerName,
  onSign,
  disabled,
  existingSignature,
}) {
  const title = ROLE_TITLES[signerRole] || 'Signature'

  let content
  if (existingSignature) {
    content = <SignedState existingSignature={existingSignature} />
  } else if (disabled) {
    content = <DisabledState signerRole={signerRole} />
  } else {
    content = <ActiveState signerName={signerName} onSign={onSign} />
  }

  return (
    <Card title={title}>
      {content}
    </Card>
  )
}

export { SignatureBlock }
