/* ===== Data & konten setiap halaman (SPA, 1 index.html) ===== */
var PAGES = {
  top: {
    title: 'TOP | TVアニメ『タイトル』公式サイト',
    eng: 'TOP',
    ja: 'トップ',
    html:
      '<div class="genericTxt">' +
      '<p>TVアニメ『タイトル』公式サイトへようこそ。最新情報は各メニューよりご覧いただけます。</p>' +
      '</div>' +
      '<ul class="topLinkLists">' +
      '<li class="topLinkList"><a href="#news" class="ah js-route">最新ニュースをチェックする</a></li>' +
      '<li class="topLinkList"><a href="#character" class="ah js-route">キャラクター紹介を見る</a></li>' +
      '<li class="topLinkList"><a href="#botslist" class="ah js-route">BOTS LISTを見る</a></li>' +
      '</ul>'
  },
  news: {
    title: 'NEWS | TVアニメ『タイトル』公式サイト',
    eng: 'NEWS',
    ja: 'ニュース',
    html:
      '<ul class="newsLists">' +
      '<li class="newsList"><span class="newsList_date rb">20XX.XX.XX</span><p class="newsList_txt">公式サイトオープンしました。</p></li>' +
      '<li class="newsList"><span class="newsList_date rb">20XX.XX.XX</span><p class="newsList_txt">キャラクター情報を公開しました。</p></li>' +
      '<li class="newsList"><span class="newsList_date rb">20XX.XX.XX</span><p class="newsList_txt">BOTS LISTを公開しました。</p></li>' +
      '</ul>'
  },
  introduction: {
    title: 'INTRODUCTION | TVアニメ『タイトル』公式サイト',
    eng: 'INTRODUCTION',
    ja: 'イントロダクション',
    html:
      '<div class="genericTxt"><p>ここに作品紹介文が入ります。舞台設定や見どころなど、作品の魅力を伝える文章をここに掲載してください。</p></div>'
  },
  character: {
    title: 'CHARACTER | TVアニメ『タイトル』公式サイト',
    eng: 'CHARACTER',
    ja: 'キャラクター',
    html:
      '<div id="charaWrap"><ul class="charaLists" id="js-charaLists"></ul></div>',
    afterRender: function () {
      renderCharaList();
    }
  },
  special: {
    title: 'SPECIAL | TVアニメ『タイトル』公式サイト',
    eng: 'SPECIAL',
    ja: 'スペシャル',
    html:
      '<div class="genericTxt"><p>壁紙やスマホ用素材などのスペシャルコンテンツをここに掲載してください。</p></div>'
  },
  botslist: {
    title: 'BOTS LIST | TVアニメ『タイトル』公式サイト',
    eng: 'BOTS LIST',
    ja: 'ボットリスト',
    html:
      '<ul class="staffcastLists botsLists">' +
      '<li class="staffcastList"><span class="role">Bot 01</span><span class="name">Nama Bot</span></li>' +
      '<li class="staffcastList"><span class="role">Bot 02</span><span class="name">Nama Bot</span></li>' +
      '<li class="staffcastList"><span class="role">Bot 03</span><span class="name">Nama Bot</span></li>' +
      '</ul>'
  },
  mytango: {
    title: 'MY TANGO | TVアニメ『タイトル』公式サイト',
    eng: 'MY TANGO',
    ja: 'マイタンゴ',
    html:
      '<div class="genericTxt"><p>Halaman MY TANGO. Isi bagian ini dengan konten profil/koleksi kamu sendiri.</p></div>'
  }
};

/* Urutan & label menu navigasi (dipakai router.js untuk membangun nav) */
var NAV_ORDER = [
  'top', 'news', 'introduction', 'character', 'special', 'botslist', 'mytango'
];
