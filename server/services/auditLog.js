/**
 * Login Audit Log Service
 * In-memory store for login audit entries (success + failure).
 * Automatically caps at MAX_ENTRIES to prevent unbounded growth.
 * Consistent with the memoryStore.js approach used throughout the codebase.
 */

const MAX_ENTRIES = 1000;

/** @type {AuditEntry[]} */
let entries = [];

/**
 * @typedef {Object} AuditEntry
 * @property {string} id         - UUID for the entry
 * @property {string} timestamp  - ISO 8601 datetime
 * @property {string} ip         - Client IP address
 * @property {string} userAgent  - Browser/OS user-agent string
 * @property {string} email      - Email used in the login attempt
 * @property {number|null} userId     - Numeric user ID (null if not found)
 * @property {string|null} fullName   - Full name (null if not found)
 * @property {string|null} role       - User role (null if not found)
 * @property {boolean} success   - Whether login succeeded
 * @property {string|null} failReason - 'user_not_found' | 'bad_password' | null
 */

/**
 * Add a new audit log entry.
 * @param {Omit<AuditEntry, 'id'>} entry
 */
function addEntry(entry) {
  const { randomUUID } = require('node:crypto');
  const record = { id: randomUUID(), ...entry };
  entries.push(record);
  // Evict oldest entries if cap exceeded
  if (entries.length > MAX_ENTRIES) {
    entries = entries.slice(entries.length - MAX_ENTRIES);
  }
  return record;
}

/**
 * Get audit entries with optional filtering.
 * @param {Object} [filters]
 * @param {string}  [filters.email]    - Filter by email (partial, case-insensitive)
 * @param {string}  [filters.success]  - 'true' | 'false' | undefined (all)
 * @param {string}  [filters.from]     - ISO datetime lower bound
 * @param {string}  [filters.to]       - ISO datetime upper bound
 * @param {number}  [filters.page]     - 1-indexed page number (default: 1)
 * @param {number}  [filters.limit]    - Page size (default: 50, max: 100)
 * @returns {{ data: AuditEntry[], total: number, page: number, limit: number, pages: number }}
 */
function getEntries(filters = {}) {
  const { email, success, from, to } = filters;
  const page = Math.max(1, parseInt(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(filters.limit) || 50));

  let result = [...entries].reverse(); // newest first

  if (email) {
    const q = email.toLowerCase();
    result = result.filter(e => e.email.toLowerCase().includes(q));
  }
  if (success === 'true') result = result.filter(e => e.success === true);
  if (success === 'false') result = result.filter(e => e.success === false);
  if (from) {
    const fromTime = new Date(from).getTime();
    if (!isNaN(fromTime)) result = result.filter(e => new Date(e.timestamp).getTime() >= fromTime);
  }
  if (to) {
    const toTime = new Date(to).getTime();
    if (!isNaN(toTime)) result = result.filter(e => new Date(e.timestamp).getTime() <= toTime);
  }

  const total = result.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const data = result.slice((page - 1) * limit, page * limit);

  return { data, total, page, limit, pages };
}

/** Clear all entries — intended for test environments only. */
function clearAll() {
  entries = [];
}

/** Get total count of stored entries. */
function count() {
  return entries.length;
}

module.exports = { addEntry, getEntries, clearAll, count };
