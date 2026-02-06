/**
 * Audit metadata collection for ECOS signature workflow.
 * Captures browser context at signing time for UETA/SAM 1734 compliance.
 */

/**
 * Convert an ArrayBuffer to a hex string.
 */
function bufferToHex(buffer) {
  const bytes = new Uint8Array(buffer)
  let hex = ''
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

/**
 * Get or create a stable session ID, then return its SHA-256 hash.
 * The raw UUID is stored in sessionStorage; only the hash is exposed.
 */
async function getSessionHash() {
  const key = 'ecos_session_id'
  let sessionId = sessionStorage.getItem(key)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(key, sessionId)
  }
  const encoded = new TextEncoder().encode(sessionId)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  return bufferToHex(hashBuffer)
}

/**
 * Collect audit metadata for a signature event.
 *
 * @param {string} [formVersionHash='sha256_v1_demo_abc123'] - Hash identifying the form version being signed.
 * @returns {Promise<{ ip_address: null, user_agent: string, session_hash: string, form_version_hash: string }>}
 */
export async function getAuditMeta(formVersionHash = 'sha256_v1_demo_abc123') {
  const session_hash = await getSessionHash()

  return {
    // Client can't reliably self-report IP (NAT, proxies, VPNs).
    // This field exists in the schema for server-side population via
    // request headers (e.g., X-Forwarded-For) in a production deployment.
    ip_address: null,
    user_agent: navigator.userAgent,
    session_hash,
    form_version_hash: formVersionHash,
  }
}
