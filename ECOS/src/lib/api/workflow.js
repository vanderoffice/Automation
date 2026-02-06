import { supabase } from '../supabase.js'

/**
 * Status progression map: signer_role -> next status after signing.
 */
const STATUS_AFTER_SIGN = {
  employee: 'pending_manager',
  manager: 'pending_admin',
  admin: 'completed',
}

/**
 * Which role is expected to sign at each pending status.
 */
const PENDING_SIGNER = {
  pending_employee: 'employee',
  pending_manager: 'manager',
  pending_admin: 'admin',
}

/**
 * Submit a draft agreement for employee signature.
 * Transitions: draft -> pending_employee
 */
export async function submitForSignature(agreementId) {
  const { data, error } = await supabase
    .from('agreements')
    .update({ status: 'pending_employee', updated_at: new Date().toISOString() })
    .eq('id', agreementId)
    .eq('status', 'draft')
    .select()
    .single()

  if (error) console.error('submitForSignature error:', error)
  return { data, error }
}

/**
 * After a signature is recorded, advance the agreement to the next workflow status.
 * @param {string} agreementId
 * @param {{ signer_role: string }} signature - must include signer_role
 */
export async function advanceWorkflow(agreementId, signature) {
  const nextStatus = STATUS_AFTER_SIGN[signature.signer_role]
  if (!nextStatus) {
    const error = { message: `Unknown signer_role: ${signature.signer_role}` }
    console.error('advanceWorkflow error:', error)
    return { data: null, error }
  }

  const updates = {
    status: nextStatus,
    updated_at: new Date().toISOString(),
  }

  // If admin signed, the agreement is completed
  if (nextStatus === 'completed') {
    updates.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('agreements')
    .update(updates)
    .eq('id', agreementId)
    .select()
    .single()

  if (error) console.error('advanceWorkflow error:', error)
  return { data, error }
}

/**
 * Get current workflow status for an agreement, including who needs to sign next.
 */
export async function getWorkflowStatus(agreementId) {
  const { data, error } = await supabase
    .from('agreements')
    .select('id, status, created_at, updated_at, completed_at, signatures(*)')
    .eq('id', agreementId)
    .single()

  if (error) {
    console.error('getWorkflowStatus error:', error)
    return { data: null, error }
  }

  const nextSigner = PENDING_SIGNER[data.status] || null

  return {
    data: {
      ...data,
      next_signer_role: nextSigner,
    },
    error: null,
  }
}

/**
 * Get all agreements waiting for a specific role's signature.
 */
export async function getPendingForRole(role) {
  const statusForRole = Object.entries(PENDING_SIGNER).find(
    ([, signerRole]) => signerRole === role
  )

  if (!statusForRole) {
    const error = { message: `No pending status maps to role: ${role}` }
    console.error('getPendingForRole error:', error)
    return { data: null, error }
  }

  const [status] = statusForRole

  const { data, error } = await supabase
    .from('agreements')
    .select('*, employees(*, departments(*))')
    .eq('status', status)
    .order('updated_at')

  if (error) console.error('getPendingForRole error:', error)
  return { data, error }
}
