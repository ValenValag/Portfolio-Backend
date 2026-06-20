const API_BASE = 'http://' + window.location.hostname + ':8080';

const els = {
  statusDot: document.getElementById('statusDot'),
  statusText: document.getElementById('statusText'),
  serverStatus: document.getElementById('serverStatus'),
  baseUrl: document.getElementById('baseUrl'),
  epReposDot: document.getElementById('epReposDot'),
  epEmailDot: document.getElementById('epEmailDot'),
  reposTableBody: document.getElementById('reposTableBody'),
  repoCount: document.getElementById('repoCount'),
  emailForm: document.getElementById('emailForm'),
  subject: document.getElementById('subject'),
  message: document.getElementById('message'),
  sendBtn: document.getElementById('sendBtn'),
  emailResult: document.getElementById('emailResult'),
  metaServer: document.getElementById('metaServer'),
  metaResponseTime: document.getElementById('metaResponseTime'),
  metaStatus: document.getElementById('metaStatus'),
  metaLastCheck: document.getElementById('metaLastCheck'),
  logContainer: document.getElementById('logContainer'),
};

els.baseUrl.textContent = API_BASE;

function setStatus(state) {
  els.statusDot.className = 'status-dot ' + state;
  if (state === 'online') {
    els.statusText.textContent = 'Online';
    els.serverStatus.style.borderColor = 'rgba(52, 211, 153, 0.3)';
  } else if (state === 'offline') {
    els.statusText.textContent = 'Offline';
    els.serverStatus.style.borderColor = 'rgba(248, 113, 113, 0.3)';
  } else {
    els.statusText.textContent = 'Checking...';
  }
}

function setEndpointStatus(dotEl, state) {
  dotEl.className = 'status-dot ' + state;
}

function logEntry(method, path, status, duration) {
  const entry = document.createElement('div');
  entry.className = 'log-entry';

  const empty = els.logContainer.querySelector('.log-empty');
  if (empty) empty.remove();

  const time = new Date().toLocaleTimeString();
  const statusClass = status >= 200 && status < 300 ? 'success' : 'error';

  entry.innerHTML = `
    <span class="log-time">${time}</span>
    <span class="log-method ${method.toLowerCase()}">${method}</span>
    <span class="log-path">${path}</span>
    <span class="log-status ${statusClass}">${status}</span>
    <span class="log-duration">${duration}ms</span>
  `;

  els.logContainer.prepend(entry);

  if (els.logContainer.children.length > 100) {
    els.logContainer.lastChild.remove();
  }
}

function updateMeta(statusCode, duration) {
  els.metaServer.textContent = 'PortfolioBackend';
  els.metaResponseTime.textContent = duration + 'ms';
  els.metaStatus.textContent = statusCode + ' ' + (statusCode >= 200 && statusCode < 300 ? 'OK' : 'Error');
  els.metaLastCheck.textContent = new Date().toLocaleTimeString();
}

async function checkHealth() {
  const start = performance.now();
  try {
    const res = await fetch(API_BASE + '/repositories', { method: 'GET' });
    const duration = Math.round(performance.now() - start);
    setStatus('online');
    setEndpointStatus(els.epReposDot, 'online');
    logEntry('GET', '/repositories', res.status, duration);
    updateMeta(res.status, duration);
  } catch {
    const duration = Math.round(performance.now() - start);
    setStatus('offline');
    setEndpointStatus(els.epReposDot, 'offline');
    logEntry('GET', '/repositories', 0, duration);
    updateMeta(0, duration);
  }
}

async function fetchRepositories() {
  const start = performance.now();
  els.reposTableBody.innerHTML = '<tr><td colspan="6" class="loading-msg">Loading repositories...</td></tr>';

  try {
    const res = await fetch(API_BASE + '/repositories');
    const duration = Math.round(performance.now() - start);
    setEndpointStatus(els.epReposDot, res.ok ? 'online' : 'offline');
    logEntry('GET', '/repositories', res.status, duration);

    if (!res.ok) {
      els.reposTableBody.innerHTML = `<tr><td colspan="6" class="loading-msg">Error: ${res.status} ${res.statusText}</td></tr>`;
      return;
    }

    const repos = await res.json();
    els.repoCount.textContent = repos.length + ' repos';

    if (repos.length === 0) {
      els.reposTableBody.innerHTML = '<tr><td colspan="6" class="loading-msg">No repositories found.</td></tr>';
      return;
    }

    const rows = repos.map(repo => {
      const lang = repo.language
        ? `<span class="repo-language">${escapeHtml(repo.language)}</span>`
        : '<span style="color: var(--text-muted)">—</span>';
      const desc = repo.description
        ? escapeHtml(repo.description.length > 60 ? repo.description.slice(0, 60) + '...' : repo.description)
        : '<span style="color: var(--text-muted)">No description</span>';
      const created = new Date(repo.created_at).toLocaleDateString();
      const updated = new Date(repo.updated_at).toLocaleDateString();

      return `<tr>
        <td><strong>${escapeHtml(repo.name)}</strong></td>
        <td>${lang}</td>
        <td>${created}</td>
        <td>${updated}</td>
        <td>${desc}</td>
        <td><a href="${escapeHtml(repo.html_url)}" target="_blank">View →</a></td>
      </tr>`;
    });

    els.reposTableBody.innerHTML = rows.join('');
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    setEndpointStatus(els.epReposDot, 'offline');
    logEntry('GET', '/repositories', 0, duration);
    els.reposTableBody.innerHTML = `<tr><td colspan="6" class="loading-msg">Network error: ${err.message}</td></tr>`;
  }
}

async function sendTestEmail(e) {
  e.preventDefault();

  const subject = els.subject.value.trim();
  const message = els.message.value.trim();

  if (!subject || !message) return;

  els.sendBtn.disabled = true;
  els.sendBtn.textContent = 'Sending...';
  els.emailResult.classList.add('hidden');

  const start = performance.now();

  try {
    const res = await fetch(API_BASE + '/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, message }),
    });

    const duration = Math.round(performance.now() - start);
    const data = await res.json();
    logEntry('POST', '/send-email', res.status, duration);
    setEndpointStatus(els.epEmailDot, res.ok ? 'online' : 'offline');

    els.emailResult.className = 'result-box ' + (res.ok ? 'success' : 'error');
    els.emailResult.textContent = JSON.stringify(data, null, 2);
    els.emailResult.classList.remove('hidden');

    if (res.ok) {
      els.subject.value = '';
      els.message.value = '';
    }
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    logEntry('POST', '/send-email', 0, duration);
    setEndpointStatus(els.epEmailDot, 'offline');

    els.emailResult.className = 'result-box error';
    els.emailResult.textContent = 'Network error: ' + err.message;
    els.emailResult.classList.remove('hidden');
  } finally {
    els.sendBtn.disabled = false;
    els.sendBtn.textContent = 'Send Test Email';
  }
}

function clearLog() {
  els.logContainer.innerHTML = '<p class="log-empty">No requests yet.</p>';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

checkHealth();
fetchRepositories();

setInterval(() => {
  checkHealth();
}, 30000);

setInterval(() => {
  fetchRepositories();
}, 120000);
