/* ===== BOTS LIST: fetch dari /api/bots (Postgres), render ke #js-botsList ===== */
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
      php: 'lang-php', go: 'lang-go', rust: 'lang-rust'
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

  var avatarHTML = '<img src="' + esc(getChatangoAvatar(name)) + '" alt="' + esc(name) + '" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">'
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

  $.getJSON('/api/bots?v=' + Date.now())
    .done(function (list) {
      if (!list || !list.length) {
        $wrap.html('<p class="genericTxt">Belum ada bot.</p>');
        return;
      }
      $wrap.html($.map(list, function (o) { return bioBoxHTML(o); }).join(''));
    })
    .fail(function () {
      $wrap.html('<p class="genericTxt">Gagal memuat daftar bot dari server. Pastikan /api/bots & koneksi database sudah aktif.</p>');
    });
}
