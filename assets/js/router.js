/* ===== Router SPA (satu index.html, konten diganti via JS) ===== */
var DEFAULT_ROUTE = 'top';

function getRoute() {
  var h = (location.hash || '').replace('#', '').trim();
  return PAGES[h] ? h : DEFAULT_ROUTE;
}

function renderRoute() {
  var route = getRoute();
  var p = PAGES[route];

  // Tutup modal karakter & hentikan voice kalau lagi kebuka pas pindah halaman
  if (typeof stopVoice === 'function') stopVoice();
  $('.modalBox, .oneModal').hide();
  $('#js-modalCont').html('');
  $('body').css({ overflow: '' });

  // Judul tab & heading section
  document.title = p.title;
  $('#js-pageContent').html(
    '<h2 class="cont_h2">' +
      '<span class="cont_h2_eng">' + p.eng + '</span>' +
      '<span class="cont_h2_ja"><span>' + p.ja + '</span></span>' +
    '</h2>' +
    '<div class="contIn">' + p.html + '</div>'
  );
  $('#js-pageSection').attr('id', route === 'character' ? 'character' : 'page-' + route);

  // Aktifkan menu yang sesuai
  $('.headerNav_link').removeClass('is-active');
  $('.headerNav_link[data-route="' + route + '"]').addClass('is-active');

  // Tutup menu mobile kalau masih terbuka
  $('.js-menu').removeClass('active');
  $('.menuTxt').text('MENU');
  $('.js-headerIn').removeClass('is-active');

  // Scroll ke atas konten setiap ganti halaman
  window.scrollTo(0, 0);

  if (typeof p.afterRender === 'function') p.afterRender();
  if (typeof scrCom === 'function') scrCom();
}

$(window).on('hashchange', renderRoute);
$(function () {
  if (!location.hash) location.hash = '#' + DEFAULT_ROUTE;
  renderRoute();
});
