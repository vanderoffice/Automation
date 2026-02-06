import { supabase } from '../supabase.js'

/**
 * Save access groups for an agreement.
 * Inserts rows into the agreement_access_groups junction table.
 * @param {string} agreementId - UUID of the agreement
 * @param {string[]} groupNames - Array of group_name values to associate
 */
export async function saveAccessGroups(agreementId, groupNames) {
  const rows = groupNames.map((groupName) => ({
    agreement_id: agreementId,
    group_name: groupName,
  }))

  const { data, error } = await supabase
    .from('agreement_access_groups')
    .insert(rows)
    .select()

  if (error) console.error('saveAccessGroups error:', error)
  return { data, error }
}

/**
 * Get access groups for an agreement.
 * @param {string} agreementId - UUID of the agreement
 */
export async function getAccessGroups(agreementId) {
  const { data, error } = await supabase
    .from('agreement_access_groups')
    .select('*')
    .eq('agreement_id', agreementId)

  if (error) console.error('getAccessGroups error:', error)
  return { data, error }
}
