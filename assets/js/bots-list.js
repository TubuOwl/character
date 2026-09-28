/* ===== BOTS LIST: fetch dari /api/bots (Postgres), render ke #js-botsList ===== */
function bioBoxHTML(o) {
  var name = o.name;
  var home = o.home ? ('https://' + o.home + '.chatango.com') : '';
  var libName = (o.library && o.library.name) || '-';
  var libUrl = o.library && o.library.public;
  var active = !!(o.status && o.status.active);
  var tags = o.tag || [];

  var badges = $.map(tags, function (t) {
    return '<span class="bioBox_badge">' + t + '</span>';
  }).join('');
  var statusHTML = '<span class="bioBox_badge' + (active ? ' is-active' : '') + '">' + (active ? 'ACTIVE' : 'INACTIVE') + '</span>';
  var linkHTML = home
    ? '<a href="' + home + '" class="bioBox_link" target="_blank">VISIT / JOIN</a>'
    : '';
  var libraryHTML = libUrl
    ? libName + ' <a href="' + libUrl + '" target="_blank">(lib)</a>'
    : libName;

  return '<div class="bioBox">'
    + '<h4 class="bioBox_name">' + name + '</h4>'
    + '<div class="bioBox_info">'
      + '<div class="bioBox_item"><span class="bioBox_label">Info</span><span>' + (o.description || 'No description yet.') + '</span></div>'
      + '<div class="bioBox_item"><span class="bioBox_label">Owner / Language / Library</span><span>' + (o.owner || '-') + ' / ' + (o.language || '-') + ' / ' + libraryHTML + '</span></div>'
      + '<div class="bioBox_item"><span class="bioBox_label">Status</span>' + statusHTML
        + (o.usage && o.usage.length ? ' <span class="bioBox_prefix">prefix: ' + o.usage.join(' or ') + '</span>' : '')
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
