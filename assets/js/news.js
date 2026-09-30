/* ===== NEWS: fetch dari /api/news (Postgres), render ke #js-newsList =====
   API_BASE di-hardcode absolute supaya tetap jalan walau file HTML ini
   di-embed/dijalankan dari domain lain (bukan dari character-cyan.vercel.app). */
var API_BASE = 'https://character-cyan.vercel.app';

function renderNewsList() {
  var $wrap = $('#js-newsList');
  if (!$wrap.length) return;
  $wrap.html('<p class="genericTxt">Memuat berita...</p>');

  $.getJSON(API_BASE + '/api/news?v=' + Date.now())
    .done(function (list) {
      if (!list || !list.length) {
        $wrap.html('<p class="genericTxt">Belum ada berita.</p>');
        return;
      }
      var html = $.map(list, function (n) {
        return '<article class="newsCard">'
          + '<div class="newsCard_head">'
            + '<span class="newsCard_date rb">' + (n.date || '') + '</span>'
            + (n.tag ? '<span class="newsCard_tag">' + n.tag + '</span>' : '')
          + '</div>'
          + (n.title ? '<h3 class="newsCard_title">' + n.title + '</h3>' : '')
          + (n.body ? '<p class="newsCard_body">' + n.body + '</p>' : '')
          + (n.link ? '<a href="' + n.link + '" class="newsCard_link" target="_blank" rel="noopener">BACA SELENGKAPNYA</a>' : '')
          + '</article>';
      }).join('');
      $wrap.html(html);
    })
    .fail(function (jqXHR) {
      var detail = '';
      try { detail = jqXHR.responseJSON && jqXHR.responseJSON.error; } catch (e) {}
      $wrap.html(
        '<p class="genericTxt">Gagal memuat berita dari server (status ' + jqXHR.status + ').'
        + (detail ? '<br><span style="color:#c32551">' + detail + '</span>' : '')
        + '</p>'
      );
    });
}
