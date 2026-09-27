const $ = (s) => document.querySelector(s),
  api = async (path, options = {}) => {
    const r = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.token ? { Authorization: `Bearer ${localStorage.token}` } : {}),
      },
    });
    if (r.status === 204) return;
    if (!r.ok) {
      const d = await r.json();
      throw new Error(d.error?.message || 'Request failed');
    }
    return r.json();
  },
  toast = (m) => {
    const e = $('#toast');
    e.textContent = m;
    e.classList.add('show');
    setTimeout(() => e.classList.remove('show'), 2500);
  };
function session() {
  const on = !!localStorage.token;
  $('#auth').hidden = on;
  $('#app').hidden = !on;
  if (on) loadLinks();
}
document.querySelectorAll('#auth form').forEach(
  (f) =>
    (f.onsubmit = async (e) => {
      e.preventDefault();
      try {
        const body = Object.fromEntries(new FormData(f));
        const d = await api(`/api/auth/${f.id}`, { method: 'POST', body: JSON.stringify(body) });
        if (f.id === 'register') {
          toast('Account created. Sign in now.');
          f.reset();
        } else {
          localStorage.token = d.data.token;
          session();
        }
      } catch (e) {
        toast(e.message);
      }
    }),
);
$('#shorten').onsubmit = async (e) => {
  e.preventDefault();
  try {
    await api('/api/links', {
      method: 'POST',
      body: JSON.stringify({ url: new FormData(e.target).get('url') }),
    });
    e.target.reset();
    toast('Short link created');
    loadLinks();
  } catch (e) {
    toast(e.message);
  }
};
async function loadLinks() {
  try {
    const d = await api('/api/links?page=1&limit=50');
    $('#links').innerHTML = d.data.length
      ? d.data
          .map(
            (l) =>
              `<div class="link"><div><b>${l.shortUrl}</b><p>${l.originalUrl}</p><small>${new Date(l.createdAt).toLocaleDateString()} · ${l.totalClicks} clicks</small></div><div><button onclick="copy('${l.shortUrl}')">Copy</button> <button onclick="analytics('${l.id}')">View</button></div></div>`,
          )
          .join('')
      : '<p>No links yet.</p>';
    if (d.data[0]) analytics(d.data[0].id);
  } catch (e) {
    if (e.message.includes('Token')) logout();
    else toast(e.message);
  }
}
window.copy = (u) => navigator.clipboard.writeText(u).then(() => toast('Copied'));
window.analytics = async (id) => {
  try {
    const { data: d } = await api(`/api/links/${id}/analytics`);
    $('#total').textContent = d.totalClicks;
    $('#today').textContent = d.clicksToday;
    $('#week').textContent = d.clicksLast7Days;
    const max = Math.max(1, ...d.clicksByDate.map((x) => x.count));
    $('#chart').innerHTML = d.clicksByDate
      .map(
        (x) =>
          `<div class="bar" style="height:${Math.max(2, (x.count / max) * 100)}%" data-tip="${x.date}: ${x.count}"></div>`,
      )
      .join('');
    const groups = [
      ['Browsers', d.browsers],
      ['Devices', d.devices],
      ['Referrers', d.topReferrers],
    ];
    $('#breakdown').innerHTML = groups
      .map(
        ([n, x]) =>
          `<h3>${n}</h3>${
            x
              .slice(0, 4)
              .map((v) => `<div class="break"><span>${v.name}</span><b>${v.count}</b></div>`)
              .join('') || '<p>No data yet</p>'
          }`,
      )
      .join('');
  } catch (e) {
    toast(e.message);
  }
};
function logout() {
  localStorage.removeItem('token');
  session();
}
$('#logout').onclick = logout;
$('#theme').onclick = () => document.body.classList.toggle('dark');
session();
