/* ===== NEWS: fetch dari /api/news (Postgres), render ke #js-newsList =====
   API_BASE di-hardcode absolute supaya tetap jalan walau file HTML ini
   di-embed/dijalankan dari domain lain (bukan dari character-cyan.vercel.app). */
var API_BASE = 'https://character-cyan.vercel.app';

function fetchNewsApi() {
  var d = $.Deferred();
  var url = API_BASE + '/api/news?v=' + Date.now();
  $.ajax({ url: url, dataType: 'json', timeout: 15000 })
    .done(function (data) { d.resolve(data); })
    .fail(function () {
      $.ajax({ url: url, dataType: 'jsonp', jsonp: 'callback', timeout: 15000 })
        .done(function (data) { d.resolve(data); })
        .fail(function (x, t) { d.reject(t); });
    });
  return d.promise();
}

function renderNewsList() {
  var $wrap = $('#js-newsList');
  if (!$wrap.length) return;
  $wrap.html('<p class="genericTxt">Memuat berita...</p>');

  fetchNewsApi()
    .done(function (list) {
      if (list && list.error) {
        $wrap.html('<p class="genericTxt">Server error: <span style="color:#c32551">' + list.error + '</span></p>');
        return;
      }
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
    .fail(function (why) {
      $wrap.html('<p class="genericTxt">Gagal memuat berita (' + why + ').</p>');
    });
}
