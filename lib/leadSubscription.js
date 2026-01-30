/**
 * @typedef {Object} LeadSubmission
 * @property {string} name
 * @property {string} email
 * @property {boolean} consent
 */

/**
 * @typedef {Object} LeadSubmissionResult
 * @property {"success" | "duplicate" | "error"} status
 * @property {string=} message
 */

/**
 * @param {LeadSubmission} payload
 * @param {{ supabaseUrl: string; supabaseAnonKey: string; fetcher?: typeof fetch }} options
 * @returns {Promise<LeadSubmissionResult>}
 */
const submitLead = async (payload, options) => {
  const response = await (options.fetcher ?? fetch)(
    `${options.supabaseUrl}/rest/v1/lead_emails`,
    {
      method: "POST",
      headers: {
        apikey: options.supabaseAnonKey,
        Authorization: `Bearer ${options.supabaseAnonKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        consent: payload.consent,
      }),
    }
  );

  if (response.ok) {
    return { status: "success" };
  }

  if (response.status === 409) {
    return { status: "duplicate" };
  }

  const errorPayload = await response.json().catch(() => null);

  if (errorPayload?.message?.includes("duplicate key")) {
    return { status: "duplicate" };
  }

  return { status: "error", message: errorPayload?.message };
};

export { submitLead };
