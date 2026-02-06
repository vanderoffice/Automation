import { supabase } from '../supabase.js'

/**
 * Insert an audit log entry.
 */
export async function logAction(agreementId, actorId, action, details = {}) {
  const { data, error } = await supabase
    .from('audit_log')
    .insert({
      agreement_id: agreementId,
      actor_id: actorId,
      action,
      details,
    })
    .select()
    .single()

  if (error) console.error('logAction error:', error)
  return { data, error }
}

/**
 * Get all audit entries for an agreement, newest first.
 */
export async function getAuditLog(agreementId) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*, employees(*)')
    .eq('agreement_id', agreementId)
    .order('created_at', { ascending: false })

  if (error) console.error('getAuditLog error:', error)
  return { data, error }
}

/**
 * Get all audit entries by a specific actor, newest first.
 */
export async function getAuditLogByActor(actorId) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*, agreements(*)')
    .eq('actor_id', actorId)
    .order('created_at', { ascending: false })

  if (error) console.error('getAuditLogByActor error:', error)
  return { data, error }
}

/**
 * Get the most recent N audit entries across all agreements.
 */
export async function getRecentActivity(limit = 50) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*, employees(*), agreements(*)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) console.error('getRecentActivity error:', error)
  return { data, error }
}
