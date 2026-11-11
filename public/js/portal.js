const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const J = { 'Content-Type': 'application/json' };
async function api(url, method = 'GET', body) {
  const res = await fetch(url, { method, headers: J, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 401) { location.href = '/login.html'; throw new Error('auth'); }
  return { ok: res.ok, data: await res.json() };
}
const table = (cols, rows) => `<table><thead><tr>${cols.map((c) => `<th>${esc(c[0])}</th>`).join('')}</tr></thead><tbody>${
  rows.map((r) => `<tr>${cols.map((c) => `<td>${c[1](r)}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${cols.length}">No records</td></tr>`}</tbody></table>`;
const field = (id, label, type = 'text', extra = '') => `<div><label for="${id}">${label}</label><input id="${id}" type="${type}" ${extra}></div>`;
const msg = (el, r, ok) => { el.className = 'msg ' + (r.ok ? 'ok' : 'err'); el.textContent = r.ok ? ok : (r.data.details || [r.data.error]).join(', '); };
let user;

const sections = [
  { title: 'My fees', roles: ['student'], async render(box) {
    const { data } = await api('/api/fees/mine');
    box.innerHTML = table([['Description', (r) => esc(r.description)], ['Amount', (r) => esc(r.amount)], ['Paid', (r) => esc(r.paid_amount)], ['Due', (r) => esc(String(r.due_date).slice(0, 10))], ['Status', (r) => esc(r.status)]], data);
  } },
  { title: 'Fee records', roles: ['admin'], async render(box) {
    const students = (await api('/api/students')).data;
    const load = async () => { const { data } = await api('/api/fees'); $('feeTbl').innerHTML = table([['SRN', (r) => esc(r.srn)], ['Name', (r) => esc(r.name)], ['Amount', (r) => esc(r.amount)], ['Paid', (r) => esc(r.paid_amount)], ['Due', (r) => esc(String(r.due_date).slice(0, 10))], ['Status', (r) => esc(r.status)], ['Record payment', (r) => `<input size="6" id="pay${r.fee_id}" placeholder="paid total"> <button data-fee="${r.fee_id}">Save</button>`]], data);
      document.querySelectorAll('[data-fee]').forEach((b) => (b.onclick = async () => { const r = await api('/api/fees/' + b.dataset.fee, 'PUT', { paid_amount: $('pay' + b.dataset.fee).value }); msg($('feeMsg'), r, 'Updated'); load(); })); };
    box.innerHTML = `<div class="grid"><div><label>Student</label><select id="feeStu">${students.map((s) => `<option value="${s.student_id}">${esc(s.srn)} - ${esc(s.name)}</option>`).join('')}</select></div>${field('feeAmt', 'Amount', 'number')}${field('feeDue', 'Due date', 'date')}</div><button id="feeAdd">Add fee</button> <span id="feeMsg" class="msg"></span><div id="feeTbl"></div>`;
    $('feeAdd').onclick = async () => { const r = await api('/api/fees', 'POST', { student_id: $('feeStu').value, amount: $('feeAmt').value, due_date: $('feeDue').value }); msg($('feeMsg'), r, 'Fee added'); load(); };
    load();
  } },
  { title: 'Complaints', roles: ['student'], async render(box) {
    const load = async () => { const { data } = await api('/api/complaints/mine'); $('cTbl').innerHTML = table([['Category', (r) => esc(r.category)], ['Description', (r) => esc(r.description)], ['Status', (r) => esc(r.status)]], data); };
    box.innerHTML = `<div class="grid"><div><label for="cCat">Category</label><select id="cCat">${['plumbing', 'electrical', 'furniture', 'cleanliness', 'internet', 'other'].map((c) => `<option>${c}</option>`).join('')}</select></div>${field('cDesc', 'Description')}</div><button id="cAdd">Submit complaint</button> <span id="cMsg" class="msg"></span><div id="cTbl"></div>`;
    $('cAdd').onclick = async () => { const r = await api('/api/complaints', 'POST', { category: $('cCat').value, description: $('cDesc').value }); msg($('cMsg'), r, 'Complaint submitted'); load(); };
    load();
  } },
  { title: 'Complaints (assign)', roles: ['admin', 'warden'], async render(box) {
    const staff = (await api('/api/complaints/staff')).data;
    const opts = staff.map((s) => `<option value="${s.user_id}">${esc(s.full_name)}</option>`).join('');
    const load = async () => { const { data } = await api('/api/complaints'); $('caTbl').innerHTML = table([['SRN', (r) => esc(r.srn)], ['Category', (r) => esc(r.category)], ['Description', (r) => esc(r.description)], ['Status', (r) => esc(r.status)], ['Assigned to', (r) => esc(r.assigned_name || '-')], ['Assign', (r) => r.status === 'resolved' ? '' : `<select id="as${r.complaint_id}">${opts}</select> <button data-as="${r.complaint_id}">Assign</button>`]], data);
      document.querySelectorAll('[data-as]').forEach((b) => (b.onclick = async () => { const r = await api(`/api/complaints/${b.dataset.as}/assign`, 'PUT', { assigned_to: $('as' + b.dataset.as).value }); msg($('caMsg'), r, 'Assigned'); load(); })); };
    box.innerHTML = '<span id="caMsg" class="msg"></span><div id="caTbl"></div>'; load();
  } },
  { title: 'Assigned maintenance requests', roles: ['maintenance'], async render(box) {
    const load = async () => { const { data } = await api('/api/complaints/assigned'); box.innerHTML = '<span id="mMsg" class="msg"></span>' + table([['Category', (r) => esc(r.category)], ['Description', (r) => esc(r.description)], ['Status', (r) => esc(r.status)], ['Update', (r) => r.status === 'resolved' ? 'Done' : `<button data-st="in_progress" data-id="${r.complaint_id}">In progress</button> <button data-st="resolved" data-id="${r.complaint_id}">Resolved</button>`]], data);
      box.querySelectorAll('[data-st]').forEach((b) => (b.onclick = async () => { await api(`/api/complaints/${b.dataset.id}/status`, 'PUT', { status: b.dataset.st }); load(); })); };
    load();
  } },
  { title: 'Leave / outpass', roles: ['student'], async render(box) {
    const load = async () => { const { data } = await api('/api/leave/mine'); $('lTbl').innerHTML = table([['From', (r) => esc(r.from_date)], ['To', (r) => esc(r.to_date)], ['Reason', (r) => esc(r.reason)], ['Status', (r) => esc(r.status)]], data); };
    box.innerHTML = `<div class="grid">${field('lFrom', 'From', 'date')}${field('lTo', 'To', 'date')}${field('lReason', 'Reason')}${field('lDest', 'Destination')}</div><button id="lAdd">Submit request</button> <span id="lMsg" class="msg"></span><div id="lTbl"></div>`;
    $('lAdd').onclick = async () => { const r = await api('/api/leave', 'POST', { from_date: $('lFrom').value, to_date: $('lTo').value, reason: $('lReason').value, destination: $('lDest').value }); msg($('lMsg'), r, 'Request submitted'); load(); };
    load();
  } },
  { title: 'Leave / outpass review', roles: ['warden', 'admin'], async render(box) {
    const load = async () => { const { data } = await api('/api/leave'); box.innerHTML = '<span id="lrMsg" class="msg"></span>' + table([['SRN', (r) => esc(r.srn)], ['Name', (r) => esc(r.student_name)], ['From', (r) => esc(r.from_date)], ['To', (r) => esc(r.to_date)], ['Reason', (r) => esc(r.reason)], ['Status', (r) => esc(r.status)], ['Decision', (r) => r.status === 'pending' ? `<button data-d="approved" data-id="${r.leave_id}">Approve</button> <button class="secondary" data-d="rejected" data-id="${r.leave_id}">Reject</button>` : '']], data);
      box.querySelectorAll('[data-d]').forEach((b) => (b.onclick = async () => { await api(`/api/leave/${b.dataset.id}/decision`, 'PUT', { decision: b.dataset.d }); load(); })); };
    load();
  } },
  { title: 'Visitors', roles: ['warden', 'admin'], async render(box) {
    const load = async () => { const { data } = await api('/api/visitors'); $('vTbl').innerHTML = table([['Visitor', (r) => esc(r.visitor_name)], ['Purpose', (r) => esc(r.purpose)], ['Time', (r) => esc(String(r.visit_time).replace('T', ' ').slice(0, 16))], ['Student', (r) => esc(r.srn || '-')]], data); };
    box.innerHTML = `<div class="grid">${field('vName', 'Visitor name')}${field('vPurpose', 'Purpose')}${field('vSrn', 'Student SRN (optional)')}</div><button id="vAdd">Record visitor</button> <span id="vMsg" class="msg"></span><div id="vTbl"></div>`;
    $('vAdd').onclick = async () => { const r = await api('/api/visitors', 'POST', { visitor_name: $('vName').value, purpose: $('vPurpose').value, srn: $('vSrn').value }); msg($('vMsg'), r, 'Visitor recorded'); load(); };
    load();
  } },
  { title: 'Announcements', roles: ['student', 'warden', 'admin', 'maintenance'], async render(box) {
    const canPost = ['admin', 'warden'].includes(user.role);
    const load = async () => { const { data } = await api('/api/announcements'); $('aTbl').innerHTML = data.map((a) => `<p><strong>${esc(a.title)}</strong> <small>(${esc(a.audience)}, ${esc(a.posted_by)})</small><br>${esc(a.body)}</p>`).join('') || 'No announcements'; };
    box.innerHTML = (canPost ? `<div class="grid">${field('aTitle', 'Title')}${field('aBody', 'Message')}<div><label for="aAud">Audience</label><select id="aAud"><option>all</option><option>students</option><option>staff</option></select></div></div><button id="aAdd">Publish</button> <span id="aMsg" class="msg"></span>` : '') + '<div id="aTbl"></div>';
    if (canPost) $('aAdd').onclick = async () => { const r = await api('/api/announcements', 'POST', { title: $('aTitle').value, body: $('aBody').value, audience: $('aAud').value }); msg($('aMsg'), r, 'Published'); load(); };
    load();
  } },
  { title: 'Reports', roles: ['admin'], async render(box) {
    const { data: d } = await api('/api/reports/summary');
    box.innerHTML = `<table><tr><th>Occupancy</th><td>${d.occupancy.occupied_beds} of ${d.occupancy.total_beds} beds (${d.occupancy.occupancy_percent}%), ${d.occupancy.available_beds} available</td></tr>
<tr><th>Fees</th><td>Paid ${d.fees.paid}, Partially paid ${d.fees.partially_paid}, Pending ${d.fees.pending} | Billed ${d.fees.total_billed}, Collected ${d.fees.total_collected}</td></tr>
<tr><th>Complaints</th><td>Open ${d.complaints.open_count}, Assigned ${d.complaints.assigned}, In progress ${d.complaints.in_progress}, Resolved ${d.complaints.resolved}</td></tr></table>`;
  } },
];

(async () => {
  user = (await api('/api/auth/me')).data.user;
  $('who').textContent = `${user.name} (${user.role}) `;
  $('logout').onclick = async () => { await api('/api/auth/logout', 'POST').catch(() => {}); location.href = '/login.html'; };
  for (const s of sections.filter((x) => x.roles.includes(user.role))) {
    const sec = document.createElement('section');
    sec.innerHTML = `<h2>${s.title}</h2><div class="body"></div>`;
    $('main').appendChild(sec);
    await s.render(sec.querySelector('.body'));
  }
})();
