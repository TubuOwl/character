/* ===== NEWS: fetch dari /api/news (Postgres), render ke #js-newsList ===== */
function renderNewsList() {
  var $wrap = $('#js-newsList');
  if (!$wrap.length) return;
  $wrap.html('<p class="genericTxt">Memuat berita...</p>');

  $.getJSON('/api/news?v=' + Date.now())
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
    .fail(function () {
      $wrap.html('<p class="genericTxt">Gagal memuat berita dari server. Pastikan /api/news & koneksi database sudah aktif.</p>');
    });
}
