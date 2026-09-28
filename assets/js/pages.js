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
    html: '<div id="js-newsList"></div>',
    afterRender: function () {
      renderNewsList();
    }
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
    html: '<div id="js-botsList" class="botBoxWrap"></div>',
    afterRender: function () {
      renderBotsList();
    }
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
