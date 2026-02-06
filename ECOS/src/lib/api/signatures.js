import { supabase } from '../supabase.js'

/**
 * Get all signatures for an agreement.
 */
export async function getSignatures(agreementId) {
  const { data, error } = await supabase
    .from('signatures')
    .select('*, employees(*)')
    .eq('agreement_id', agreementId)
    .order('signed_at')

  if (error) console.error('getSignatures error:', error)
  return { data, error }
}

/**
 * Record a new signature.
 * @param {Object} data - { agreement_id, signer_id, signer_role, typed_name, certified, ip_address, user_agent, session_hash, form_version_hash }
 */
export async function createSignature(data) {
  const { data: created, error } = await supabase
    .from('signatures')
    .insert(data)
    .select()
    .single()

  if (error) console.error('createSignature error:', error)
  return { data: created, error }
}

/**
 * Get all signatures by a specific employee.
 */
export async function getSignaturesByEmployee(employeeId) {
  const { data, error } = await supabase
    .from('signatures')
    .select('*, agreements(*)')
    .eq('signer_id', employeeId)
    .order('signed_at', { ascending: false })

  if (error) console.error('getSignaturesByEmployee error:', error)
  return { data, error }
}
