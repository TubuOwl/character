/* ===== Data & konten setiap halaman (SPA, 1 index.html) ===== */
var PAGES = {
  top: {
    title: 'CHARACTER | TVアニメ『タイトル』公式サイト',
    eng: 'TOP',
    ja: 'トップ',
    html:
      '<div class="genericTxt">' +
      '<p>TVアニメ『タイトル』公式サイトへようこそ。最新情報は各メニューよりご覧いただけます。</p>' +
      '</div>' +
      '<ul class="topLinkLists">' +
      '<li class="topLinkList"><a href="#news" class="ah js-route">最新ニュースをチェックする</a></li>' +
      '<li class="topLinkList"><a href="#character" class="ah js-route">キャラクター紹介を見る</a></li>' +
      '<li class="topLinkList"><a href="#onair" class="ah js-route">放送情報を確認する</a></li>' +
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
      '<li class="newsList"><span class="newsList_date rb">20XX.XX.XX</span><p class="newsList_txt">放送情報を公開しました。</p></li>' +
      '</ul>'
  },
  onair: {
    title: 'ON AIR | TVアニメ『タイトル』公式サイト',
    eng: 'ON AIR',
    ja: '放送情報',
    html:
      '<ul class="onairLists">' +
      '<li class="onairList"><p class="onairList_area rb">TOKYO MX</p><p class="onairList_time">毎週XX曜日 XX:XX〜</p></li>' +
      '<li class="onairList"><p class="onairList_area rb">BS XX</p><p class="onairList_time">毎週XX曜日 XX:XX〜</p></li>' +
      '<li class="onairList"><p class="onairList_area rb">配信サービス</p><p class="onairList_time">放送同時配信予定</p></li>' +
      '</ul>'
  },
  introduction: {
    title: 'INTRODUCTION | TVアニメ『タイトル』公式サイト',
    eng: 'INTRODUCTION',
    ja: 'イントロダクション',
    html:
      '<div class="genericTxt"><p>ここに作品紹介文が入ります。舞台設定や見どころなど、作品の魅力を伝える文章をここに掲載してください。</p></div>'
  },
  story: {
    title: 'STORY | TVアニメ『タイトル』公式サイト',
    eng: 'STORY',
    ja: 'ストーリー',
    html:
      '<div class="genericTxt"><p>ここに物語のあらすじが入ります。第一話の導入や物語の背景など、ストーリーの概要をここに掲載してください。</p></div>'
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
  staffcast: {
    title: 'STAFF/CAST | TVアニメ『タイトル』公式サイト',
    eng: 'STAFF/CAST',
    ja: 'スタッフ・キャスト',
    html:
      '<div class="staffcastGrid">' +
      '<div class="staffcastCol"><h3 class="staffcastCol_ttl rb">CAST</h3><ul class="staffcastLists">' +
      '<li class="staffcastList"><span class="role">主人公役</span><span class="name">声優名</span></li>' +
      '<li class="staffcastList"><span class="role">ヒロイン役</span><span class="name">声優名</span></li>' +
      '</ul></div>' +
      '<div class="staffcastCol"><h3 class="staffcastCol_ttl rb">STAFF</h3><ul class="staffcastLists">' +
      '<li class="staffcastList"><span class="role">原作</span><span class="name">作者名</span></li>' +
      '<li class="staffcastList"><span class="role">監督</span><span class="name">監督名</span></li>' +
      '</ul></div>' +
      '</div>'
  },
  music: {
    title: 'MUSIC | TVアニメ『タイトル』公式サイト',
    eng: 'MUSIC',
    ja: 'ミュージック',
    html:
      '<ul class="musicLists">' +
      '<li class="musicList"><p class="musicList_type rb">OPテーマ</p><p class="musicList_ttl">「曲名」</p><p class="musicList_artist">アーティスト名</p></li>' +
      '<li class="musicList"><p class="musicList_type rb">EDテーマ</p><p class="musicList_ttl">「曲名」</p><p class="musicList_artist">アーティスト名</p></li>' +
      '</ul>'
  },
  movie: {
    title: 'MOVIE | TVアニメ『タイトル』公式サイト',
    eng: 'MOVIE',
    ja: 'ムービー',
    html:
      '<ul class="movieLists">' +
      '<li class="movieList"><div class="ph movieList_ph">PV第1弾</div></li>' +
      '<li class="movieList"><div class="ph movieList_ph">PV第2弾</div></li>' +
      '</ul>'
  },
  bluray: {
    title: 'Blu-ray | TVアニメ『タイトル』公式サイト',
    eng: 'Blu-ray',
    ja: 'ブルーレイ',
    html:
      '<div class="genericTxt"><p>Blu-ray / DVD の商品情報をここに掲載してください。発売日・価格・特典などの詳細を記載します。</p></div>'
  },
  special: {
    title: 'SPECIAL | TVアニメ『タイトル』公式サイト',
    eng: 'SPECIAL',
    ja: 'スペシャル',
    html:
      '<div class="genericTxt"><p>壁紙やスマホ用素材などのスペシャルコンテンツをここに掲載してください。</p></div>'
  }
};

/* Urutan & label menu navigasi (dipakai router.js untuk membangun nav) */
var NAV_ORDER = [
  'top', 'news', 'onair', 'introduction', 'story',
  'character', 'staffcast', 'music', 'movie', 'bluray', 'special'
];
