/* ═══════════════════════════════════════════════
   PARKLK — Shared JavaScript
   ═══════════════════════════════════════════════ */

// ── Toast ────────────────────────────────────────
function showToast(msg, type = 'info') {
    let wrap = document.querySelector('.toast-container');
    if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-container'; document.body.appendChild(wrap); }
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${msg}</span>`;
    wrap.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='all .3s ease'; setTimeout(()=>t.remove(),300); }, 3000);
}

// ── Modal ────────────────────────────────────────
function openModal(id) { const m=document.getElementById(id); if(m) m.classList.add('open'); }
function closeModal(id){ const m=document.getElementById(id); if(m) m.classList.remove('open'); }
document.addEventListener('click', e => { if(e.target.classList.contains('modal-overlay')) e.target.classList.remove('open'); });

// ── Tabs ─────────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.tabs').forEach(tabs => {
        tabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const target = btn.dataset.tab;
                if (target) {
                    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
                    const panel = document.getElementById(target);
                    if (panel) panel.style.display = 'block';
                }
            });
        });
    });
}

// ── Fee Calculator ────────────────────────────────
function calcFee(hours) {
    hours = parseFloat(hours) || 0;
    const fee = hours <= 3 ? 100 : 100 + (hours - 3) * 50;
    return {
        base: 100,
        extraHours: Math.max(0, hours - 3),
        extraCharge: Math.max(0, (hours - 3) * 50),
        total: fee,
        agentShare: +(fee * 0.20).toFixed(2),
        ownerShare: +(fee * 0.80).toFixed(2)
    };
}
function fmtLKR(n) { return `LKR ${parseFloat(n).toLocaleString('en-LK',{minimumFractionDigits:2})}`; }

function initFeeCalc(inputId, resultId) {
    const inp = document.getElementById(inputId);
    const res = document.getElementById(resultId);
    if (!inp || !res) return;
    function render() {
        const f = calcFee(inp.value);
        res.innerHTML = `
      <div class="calc-display">
        <div class="calc-row"><span>Base Rate (≤3 hrs)</span><span class="calc-amount mono">LKR 100.00</span></div>
        ${f.extraHours>0?`<div class="calc-row"><span>Extra ${f.extraHours.toFixed(1)} hr × LKR 50</span><span class="calc-amount mono">LKR ${f.extraCharge.toFixed(2)}</span></div>`:''}
        <div class="calc-row total"><span>Total Fee</span><span class="calc-amount text-saffron">${fmtLKR(f.total)}</span></div>
        <div class="calc-row"><span class="text-amber">Agent Share (20%)</span><span class="calc-amount text-amber">${fmtLKR(f.agentShare)}</span></div>
        <div class="calc-row"><span class="text-green">Owner Earn (80%)</span><span class="calc-amount text-green">${fmtLKR(f.ownerShare)}</span></div>
      </div>`;
    }
    inp.addEventListener('input', render);
    render();
}

// ── Table Search ──────────────────────────────────
function initSearch(inputId, tableId) {
    const inp = document.getElementById(inputId);
    const tbl = document.getElementById(tableId);
    if (!inp || !tbl) return;
    inp.addEventListener('input', () => {
        const q = inp.value.toLowerCase();
        tbl.querySelectorAll('tbody tr').forEach(r => {
            r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    });
}

// ── Sidebar toggle (mobile) ───────────────────────
function initSidebar() {
    const btn = document.getElementById('menu-btn');
    const sb  = document.querySelector('.sidebar');
    if (!btn || !sb) return;
    btn.addEventListener('click', () => sb.classList.toggle('open'));
    sb.querySelectorAll('.nav-item').forEach(i => i.addEventListener('click', () => { if(window.innerWidth<=960) sb.classList.remove('open'); }));
}

// ── Count-up animation ────────────────────────────
function animateCount(el, target, duration=800) {
    let start=null;
    const step = ts => {
        if(!start) start=ts;
        const p = Math.min((ts-start)/duration,1);
        el.textContent = Math.floor(p*target);
        if(p<1) requestAnimationFrame(step); else el.textContent=target;
    };
    requestAnimationFrame(step);
}
function initCountUp() {
    document.querySelectorAll('[data-count]').forEach(el => animateCount(el, parseInt(el.dataset.count)));
}

// ── Confirm ───────────────────────────────────────
function confirmDo(msg, fn) { if(confirm(msg)) fn(); }

// ── Google Maps stub ─────────────────────────────
function initMap() {
    if (typeof google === 'undefined') return;
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 6.9271, lng: 79.8612 }, zoom: 14,
        styles: [{ elementType:'geometry',stylers:[{color:'#0F1521'}] },
            { elementType:'labels.text.fill',stylers:[{color:'#8A97B4'}] },
            { featureType:'road',elementType:'geometry',stylers:[{color:'#1D2740'}] },
            { featureType:'water',stylers:[{color:'#080C14'}] }]
    });
    const slots = [
        {lat:6.9271,lng:79.8612,title:'A-204 — Galle Rd'},
        {lat:6.9005,lng:79.8553,title:'B-107 — Duplication Rd'},
        {lat:6.9185,lng:79.8680,title:'A-101 — Hospital Rd'},
        {lat:6.9223,lng:79.8601,title:'B-205 — Flower Rd'}
    ];
    slots.forEach(s => new google.maps.Marker({ position:{lat:s.lat,lng:s.lng}, map, title:s.title,
        icon:{ path:google.maps.SymbolPath.CIRCLE, scale:8, fillColor:'#FF6B2B', fillOpacity:1, strokeColor:'#fff', strokeWeight:2 }
    }));
}

// ── Backend AJAX helpers (Spring Boot) ───────────
const API_BASE = '/api';

const API = {
    get: (path) => fetch(`${API_BASE}${path}`).then(r => r.json()),
    post: (path, body) => fetch(`${API_BASE}${path}`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }).then(r => r.json()),
    put:  (path, body) => fetch(`${API_BASE}${path}`, { method:'PUT',  headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) }).then(r => r.json()),
    del:  (path) => fetch(`${API_BASE}${path}`, { method:'DELETE' }).then(r => r.json()),
};

// Parking search
function searchParking(location='Colombo') {
    const list = document.getElementById('parking-list');
    if (!list) return;
    API.get(`/parking/search?location=${encodeURIComponent(location)}`)
        .then(data => {
            list.innerHTML = data.map(spot => `
        <div class="slot-card" data-id="${spot.id}">
          <div class="slot-id">${spot.slotCode}</div>
          <div class="slot-address">${spot.address}</div>
          <span class="badge ${spot.status==='Available'?'badge-confirmed':'badge-inactive'}">${spot.status}</span>
          ${spot.status==='Available' ? `<button class="btn btn-primary btn-sm mt-1" onclick="openBookingModal('${spot.id}','${spot.address}')">Book</button>` : ''}
        </div>`).join('');
        })
        .catch(() => {
            // Demo fallback
            list.innerHTML = `<p class="text-muted" style="font-size:13px;padding:12px;">Connect your Spring Boot backend to <code>/api/parking/search</code></p>`;
        });
}

// ── DOMContentLoaded ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initSidebar();
    initCountUp();
});