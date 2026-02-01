/* frontend/assets/js/main.js
   Loads data from API and provides UI interactions:
   - loadProjects(), filterProjects(), project modal
   - quote calculation + submit to /api/quotes
   - loadTenders(), loadTeam()
*/

async function apiGet(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('API error: ' + res.status);
  return res.json();
}

/* ---------- Projects ---------- */
async function loadProjects() {
  try {
    const projects = await apiGet('/api/projects');
    const container = document.getElementById('project-list');
    if (!container) return;
    container.innerHTML = projects.map(p => `
      <div class="card" data-type="${p.type || ''}" >
        <img src="${p.featured_image ? '/uploads/' + p.featured_image : 'assets/img/default-project.jpg'}" alt="${escapeHtml(p.title)}">
        <div class="body">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h4>${escapeHtml(p.title)}</h4>
            <span class="tag">${escapeHtml(p.type || 'Project')}</span>
          </div>
          <p class="muted small">${escapeHtml(p.location || '')} • ${p.year || ''}</p>
          <p>${escapeHtml(truncate(p.description || '', 140))}</p>
          <div style="display:flex;gap:8px;margin-top:8px">
            <button class="secondary" onclick="openProject(${p.id})">Details</button>
            <button onclick="openQuoteModal(${p.id}, '${escapeHtml(p.title)}')">Get Quote</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('loadProjects', err);
    const container = document.getElementById('project-list');
    if (container){
      const demo = [
        { id: 1, title: 'Provincial Road Upgrade', type:'Road Construction', location:'Limpopo', year:2024, description:'Upgrading 12km of provincial road including drainage and signage.' },
        { id: 2, title: 'Bulk Earthworks for Housing', type:'Bulk Earthworks', location:'Gauteng', year:2023, description:'Mass excavation, compaction and platform preparation for 250 units.' },
        { id: 3, title: 'Water Reticulation Upgrade', type:'Water & Sanitation', location:'KZN', year:2022, description:'Pipe replacement, chambers and consumer connections across 4 wards.' }
      ];
      container.innerHTML = demo.map(p => `
        <div class="card" data-type="${p.type || ''}" >
          <img src="assets/img/default-project.jpg" alt="${escapeHtml(p.title)}">
          <div class="body">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <h4>${escapeHtml(p.title)}</h4>
              <span class="tag">${escapeHtml(p.type || 'Project')}</span>
            </div>
            <p class="muted small">${escapeHtml(p.location || '')} • ${p.year || ''}</p>
            <p>${escapeHtml(truncate(p.description || '', 140))}</p>
            <div style="display:flex;gap:8px;margin-top:8px">
              <button class="secondary" onclick="alert('Details available when connected to backend')">Details</button>
              <button onclick="openQuoteModal(null, '${escapeHtml(p.type)}')">Get Quote</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }
}

async function openProject(id) {
  try {
    const p = await apiGet('/api/projects/' + id);
    showProjectModal(p);
  } catch (err) {
    console.error('openProject', err);
  }
}

function showProjectModal(p) {
  let modal = document.getElementById('project-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'modal';
    modal.innerHTML = `<div class="box"><div style="display:flex;gap:12px">
      <div style="flex:1"><img id="modal-img" style="width:100%;height:320px;object-fit:cover"></div>
      <div style="flex:1;padding:16px"><h2 id="modal-title"></h2><p id="modal-desc"></p><p id="modal-meta" class="small muted"></p><div style="margin-top:12px"><button onclick="closeModal()" class="secondary">Close</button> <button onclick="openQuoteModal(${p.id},'${escapeHtml(p.title)}')">Request Quote</button></div></div>
    </div></div>`;
    document.body.appendChild(modal);
  }
  document.getElementById('modal-img').src = p.featured_image ? '/uploads/' + p.featured_image : 'assets/img/default-project.jpg';
  document.getElementById('modal-title').textContent = p.title;
  document.getElementById('modal-desc').textContent = p.description || '';
  document.getElementById('modal-meta').textContent = `${p.location || ''} • ${p.year || ''}`;
  modal.classList.add('active');
}

function closeModal() { const m = document.getElementById('project-modal'); if (m) m.classList.remove('active'); }

/* ---------- Quote Modal & Calculator ---------- */
function openQuoteModal(projectId = null, projectTitle = '') {
  // build modal if not exists
  let q = document.getElementById('quote-modal');
  if (!q) {
    q = document.createElement('div');
    q.id = 'quote-modal'; q.className='modal';
    q.innerHTML = `<div class="box" style="padding:18px">
      <h3>Request a Quote</h3>
      <form id="quoteForm" class="form">
        <input name="name" placeholder="Full name" required>
        <input name="email" placeholder="Email" required>
        <input name="phone" placeholder="Phone">
        <select name="project_type">
          <option value="">Select project type</option>
          <option>Road Construction</option>
          <option>Bulk Earthworks</option>
          <option>Water & Sanitation</option>
          <option>Waste Management</option>
          <option>Other</option>
        </select>
        <input name="area" placeholder="Project area (m²)" type="number" min="0">
        <label>Complexity</label>
        <select name="complexity">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
        <textarea name="message" placeholder="Additional details"></textarea>
        <div style="display:flex;gap:10px;align-items:center">
          <button type="button" onclick="estimateQuote()">Estimate Cost</button>
          <div id="estResult" style="flex:1"></div>
        </div>
        <div style="text-align:right;margin-top:10px">
          <button type="button" onclick="closeQuoteModal()" class="secondary">Cancel</button>
          <button type="submit">Submit Quote Request</button>
        </div>
      </form>
    </div>`;
    document.body.appendChild(q);

    // form logic
    document.getElementById('quoteForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const body = {
        name: fd.get('name'),
        email: fd.get('email'),
        phone: fd.get('phone'),
        project_type: fd.get('project_type'),
        area_sq_m: parseFloat(fd.get('area')) || 0,
        complexity: fd.get('complexity'),
        estimated_cost: parseFloat(document.getElementById('estResult').dataset.estimate) || 0,
        message: fd.get('message'),
      };
      const res = await fetch('/api/quotes', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body) });
      if (res.ok) {
        e.target.reset();
        document.getElementById('estResult').textContent = 'Request saved — we will contact you shortly.';
      } else {
        document.getElementById('estResult').textContent = 'Error saving request.';
      }
    });
  }
  // prefills
  q.querySelector('select[name=project_type]').value = projectTitle || '';
  q.classList.add('active');
}

function closeQuoteModal(){ const q=document.getElementById('quote-modal'); if(q) q.classList.remove('active'); }

// Estimation formula (simple but transparent):
// baseRate by type * area * complexityMultiplier + contingency
function estimateQuote() {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  const type = form.project_type.value;
  const area = parseFloat(form.area.value) || 0;
  const complexity = form.complexity.value || 'medium';
  // base rates per m2 (ZAR) — adjust as needed
  const baseRates = {
    'Road Construction': 950,
    'Bulk Earthworks': 450,
    'Water & Sanitation': 700,
    'Waste Management': 550,
    'Other': 600,
    '': 600
  };
  const complexityMultiplier = { low: 0.9, medium: 1.0, high: 1.25 };
  const base = baseRates[type] || baseRates[''];
  const estimate = (area * base * (complexityMultiplier[complexity] || 1.0)) * 1.12; // 12% contingency
  const el = document.getElementById('estResult');
  el.dataset.estimate = estimate.toFixed(2);
  el.textContent = 'Estimated cost: ZAR ' + Number(estimate).toLocaleString();
}

/* ---------- Tenders ---------- */
async function loadTenders() {
  try {
    const tenders = await apiGet('/api/tenders');
    const container = document.getElementById('tender-list');
    if (!container) return;
    container.innerHTML = tenders.map(t => `
      <div class="card">
        <div class="body">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <h4>${escapeHtml(t.title)}</h4>
            ${t.featured ? '<span class="tag">Featured</span>' : ''}
          </div>
          <p>${escapeHtml(truncate(t.description || '',200))}</p>
          <p class="small muted">Closes: ${t.closing_date || 'N/A'}</p>
          ${t.file ? `<a class="cta" href="/uploads/${t.file}" target="_blank" rel="noopener">Download</a>` : ''}
        </div>
      </div>`).join('');
  } catch (err) { console.error('loadTenders', err); }
}

/* ---------- Team ---------- */
async function loadTeam() {
  try {
    const team = await apiGet('/api/team');
    const container = document.getElementById('team-list');
    if (!container) return;
    container.innerHTML = team.map(m => `
      <div class="member">
        <img src="${m.photo ? '/uploads/' + m.photo : 'assets/img/default-project.jpg'}" alt="${escapeHtml(m.name)}">
        <h4>${escapeHtml(m.name)}</h4>
        <div style="font-weight:600;color:var(--teal)">${escapeHtml(m.role)}</div>
        <p style="margin-top:8px">${escapeHtml(truncate(m.bio||'',120))}</p>
        <div style="margin-top:8px;">
          ${m.linkedin ? `<a href="${escapeHtml(m.linkedin)}" target="_blank">LinkedIn</a>` : ''}
        </div>
      </div>
    `).join('');
  } catch (err) { console.error('loadTeam', err); }
}

/* ---------- Utilities ---------- */
function truncate(s,n){ return s && s.length>n ? s.slice(0,n)+'...' : (s||'') }
function escapeHtml(str=''){ return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

/* ---------- Auto-init on page load ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // These safely no-op if the container does not exist
  try { loadProjects(); } catch (e) {}
  try { loadTenders(); } catch (e) {}
  try { loadTeam(); } catch (e) {}

  // Theme toggle persistence
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') document.body.classList.add('theme-dark');
  document.body.addEventListener('click', (e)=>{
    const t = e.target.closest('[data-toggle-theme]');
    if (!t) return;
    document.body.classList.toggle('theme-dark');
    localStorage.setItem('theme', document.body.classList.contains('theme-dark') ? 'dark' : 'light');
  });

  // Mobile nav toggle
  document.body.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-mobile-toggle]');
    if (btn){
      const nav = document.querySelector('.nav');
      if (nav) nav.classList.toggle('open');
    }
  });

  // Active link highlight
  const here = location.pathname.split('/').pop();
  document.querySelectorAll('.nav a').forEach(a=>{ if (a.getAttribute('href')===here) a.classList.add('active'); });

  // Back to top
  let btt = document.getElementById('backToTop');
  if (!btt){
    btt = document.createElement('button'); btt.id='backToTop'; btt.title='Back to top'; btt.innerHTML='↑';
    document.body.appendChild(btt);
  }
  window.addEventListener('scroll', ()=>{
    if (window.scrollY > 400) btt.classList.add('show'); else btt.classList.remove('show');
  });
  btt.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
});