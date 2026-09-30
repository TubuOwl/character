/* ===== BOTS LIST: fetch dari /api/bots (Postgres), render ke #js-botsList =====
   File ini berdiri sendiri: tampilan kartu (avatar 45x45, dll) disuntikkan lewat
   <style> di bawah, jadi tidak tergantung isi styles.css.

   API_BASE di-hardcode absolute supaya tetap jalan walau file HTML ini
   di-embed/dijalankan dari domain lain (bukan dari character-cyan.vercel.app). */
var API_BASE = 'https://character-cyan.vercel.app';

(function injectBotCss() {
  if (document.getElementById('botsListCss')) return;
  var css = ''
    + '#js-botsList,#js-botBoxes{display:flex!important;flex-wrap:wrap;gap:32px;width:100%;grid-template-columns:none}'
    + '.bioBox{width:280px;min-height:280px;background:#fff;border:2px solid #000;box-shadow:6px 6px 0 #f0005a;padding:16px;display:flex;flex-direction:column;justify-content:space-between}'
    + '.bioBox .bioBox_header{display:flex;align-items:center;gap:12px;margin:0}'
    + '.bioBox .bioBox_avatar{width:45px!important;height:45px!important;min-width:45px;max-width:45px;min-height:45px;max-height:45px;flex:0 0 45px;background:#000;overflow:hidden;display:flex;justify-content:center;align-items:center}'
    + '.bioBox .bioBox_avatar img{width:45px!important;height:45px!important;max-width:none;object-fit:cover;display:block}'
    + '.bioBox .bioBox_avatar_ph{color:#fff;font-weight:700;font-size:18px;font-family:"Roboto Condensed",sans-serif}'
    + '.bioBox .bioBox_name{font-size:16px;font-weight:700;color:#000;line-height:1.2;margin:0;word-break:break-all}'
    + '.bioBox .bioBox_info{display:flex;flex-direction:column;gap:8px;border-top:2px solid #000;padding-top:10px;margin:10px 0 0;flex-grow:1}'
    + '.bioBox .bioBox_item{font-size:11px;color:#333;line-height:1.4;margin:0}'
    + '.bioBox .bioBox_label{font-weight:700;color:#000;display:block;margin-bottom:1px;text-transform:uppercase;font-size:10px;letter-spacing:.5px}'
    + '.bioBox .bioBox_badge{background:#f0005a;color:#fff;padding:1px 5px;font-size:10px;font-weight:600;margin:0 2px 2px 0;display:inline-block;border-radius:0}'
    + '.bioBox .bioBox_badge.is-active{background:#1aad55}'
    + '.bioBox .bioBox_prefix{font-size:10px;color:#666;margin-left:4px}'
    + '.bioBox .bioBox_link{display:block;text-align:center;margin-top:12px;padding:8px 0;background:#000;color:#fff;font-size:11px;font-weight:700;letter-spacing:.1em;text-decoration:none;transition:.2s}'
    + '.bioBox .bioBox_link:hover{background:#f0005a}'
    + '.bioBox .bioBox_ghLink{color:#000}.bioBox .bioBox_ghLink:hover{color:#f0005a}'
    + '@media screen and (max-width:768px){#js-botsList,#js-botBoxes{gap:6.4vw;justify-content:center}}';
  var s = document.createElement('style');
  s.id = 'botsListCss';
  s.textContent = css;
  document.head.appendChild(s);
})();

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

if (typeof getChatangoAvatar !== 'function') {
  var getChatangoAvatar = function (name) {
    if (typeof name !== 'string' || !name.length) return '';
    var lower = name.toLowerCase();
    var h1 = lower.charAt(0);
    var h2 = lower.length > 1 ? lower.charAt(1) : lower.charAt(0);
    return 'https://ust.chatango.com/profileimg/' + h1 + '/' + h2 + '/' + lower + '/thumb_m.jpg';
  };
}

if (typeof getLanguageLogo !== 'function') {
  var getLanguageLogo = function (language) {
    var lang = (language || '').toLowerCase();
    var logos = {
      ruby: 'lang-ruby', javascript: 'lang-javascript', cpp: 'lang-cpp',
      typescript: 'lang-typescript', python: 'lang-python', kotlin: 'lang-kotlyn',
      csharp: 'lang-csharp', 'c#': 'lang-csharp', java: 'lang-java',
      php: 'lang-php', golang: 'lang-go-old', rust: 'lang-rust'
    };
    return logos[lang]
      ? '<i class="programming ' + logos[lang] + '"></i> ' + esc(language)
      : esc(language || '-');
  };
}

function bioBoxHTML(o) {
  var name = o.name || '';
  var home = o.home ? ('https://' + encodeURIComponent(o.home) + '.chatango.com') : '';
  var libName = (o.library && o.library.name) || '-';
  var libUrl = o.library && o.library.public;
  var active = !!(o.status && o.status.active);
  var tags = o.tag || [];

  var avatarHTML = '<img src="' + esc(getChatangoAvatar(name)) + '" width="45" height="45" alt="' + esc(name) + '" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
    + '<span class="bioBox_avatar_ph" style="display:none">' + esc(name ? name.charAt(0).toUpperCase() : '?') + '</span>';

  var badges = $.map(tags, function (t) {
    return '<span class="bioBox_badge">' + esc(t) + '</span>';
  }).join('');

  var statusHTML = '<span class="bioBox_badge' + (active ? ' is-active' : '') + '">' + (active ? 'ACTIVE' : 'INACTIVE') + '</span>';

  var linkHTML = home
    ? '<a href="' + home + '" class="bioBox_link" target="_blank" rel="noopener">VISIT / JOIN</a>'
    : '';

  var libraryHTML = libUrl
    ? esc(libName) + ' <a href="' + esc(libUrl) + '" class="bioBox_ghLink" target="_blank" rel="noopener" title="View on GitHub"><i class="fa-brands fa-github"></i></a>'
    : esc(libName);

  return '<div class="bioBox">'
    + '<div class="bioBox_header">'
      + '<div class="bioBox_avatar">' + avatarHTML + '</div>'
      + '<h4 class="bioBox_name">' + esc(name) + '</h4>'
    + '</div>'
    + '<div class="bioBox_info">'
      + '<div class="bioBox_item"><span class="bioBox_label">Info</span><span>' + esc(o.description || 'No description yet.') + '</span></div>'
      + '<div class="bioBox_item"><span class="bioBox_label">Owner / Language / Library</span><span>' + esc(o.owner || '-') + ' / ' + getLanguageLogo(o.language) + ' / ' + libraryHTML + '</span></div>'
      + '<div class="bioBox_item"><span class="bioBox_label">Status</span>' + statusHTML
        + (o.usage && o.usage.length ? ' <span class="bioBox_prefix">prefix: ' + esc(o.usage.join(' or ')) + '</span>' : '')
      + '</div>'
      + '<div class="bioBox_item"><span class="bioBox_label">Tags</span>' + badges + '</div>'
    + '</div>'
    + linkHTML
    + '</div>';
}

function renderBotsList() {
  var $wrap = $('#js-botsList');
  if (!$wrap.length) return;
  $wrap.html('<p class="genericTxt">Memuat daftar bot...</p>');

  // JSONP (lewat <script>) supaya tetap jalan di halaman yang memblokir XHR
  // lintas-domain, misal profil Chatango (status 0 = diblokir browser).
  $.ajax({
    url: API_BASE + '/api/bots?v=' + Date.now(),
    dataType: 'jsonp',
    jsonp: 'callback',
    timeout: 15000
  })
    .done(function (list) {
      if (list && list.error) {
        $wrap.html('<p class="genericTxt">Server error: <span style="color:#c32551">' + esc(list.error) + '</span></p>');
        return;
      }
      if (!list || !list.length) {
        $wrap.html('<p class="genericTxt">Belum ada bot.</p>');
        return;
      }
      $wrap.html($.map(list, function (o) { return bioBoxHTML(o); }).join(''));
    })
    .fail(function (jqXHR, textStatus) {
      $wrap.html(
        '<p class="genericTxt">Gagal memuat daftar bot (' + esc(textStatus) + ').<br>'
        + '<span style="color:#c32551">Kemungkinan script ke ' + esc(API_BASE) + ' diblokir (CSP / ad blocker) atau API belum ter-deploy.</span></p>'
      );
    });
}
