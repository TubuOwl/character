function pad(i){return ('0'+(i+1)).slice(-2)}
function im(u,alt,cls,label){return u?'<img src="'+u+'" alt="'+alt+'" class="'+(cls||'')+'" referrerpolicy="no-referrer" loading="lazy">':'<div class="ph">'+(label||'')+'</div>'}
function cv(c){return c.cover}

/* daftar (cover depan) */
$('#js-charaLists').html($.map(CHARACTERS,function(c,i){
 return '<li class="charaList"><a href="#" data-chara="'+pad(i)+'" class="charalink"><div class="chara_thumb">'
  +im(cv(c),c.ja,'chara_thumbIMG','COVER '+(i+1))+'</div><p class="chara_name">'+c.ja+'</p></a></li>';
}).join(''));

/* template detail */
function tpl(no){
 var i=parseInt(no,10)-1,n=CHARACTERS.length,c=CHARACTERS[i],pi=(i-1+n)%n,ni=(i+1)%n,p=CHARACTERS[pi],x=CHARACTERS[ni];
 var hasV=!!(c.voice&&c.voice.length);
 return '<div class="charaModalIn js-modal_charaeng'+(c.eng.length>10?' englong':'')+'" data-chara_eng_name="'+c.eng+'">'
 +'<div class="chara_datailWrap">'
 +'<div class="chara_detail_r"><h2 class="charaName">'
 +'<span class="charaName_ja">'+c.ja+'<span>'+c.yomi+'</span></span>'
 +'<span class="charaName_alias"><span>'+c.alias+'</span></span>'
 +'<span class="charaName_voice">'+c.voice_name+'</span></h2>'
 +'<p class="chara_detailTxt">'+c.text+'</p>'
 +'<div class="chara_voiceWrap"><button type="button" class="js-voiceBtn" data-voice="'+i+'"'+(hasV?'':' disabled')+'>'
 +'<span class="vi">▶</span><span class="vt">'+(hasV?'PLAY VOICE':'NO VOICE')+'</span></button>'
 +'<div class="voice_bar"><i></i></div></div></div>'
 +'<div class="chara_detail_c"><div class="chara_imgWrap">'+im(c.main,c.ja,'','FOTO UTAMA '+(i+1))+'</div></div>'
 +'<div class="chara_detail_l"><ul class="chara_detail_faceLists">'
 +'<li class="chara_detail_faceList">'+im(c.face1,c.ja,'','FACE 1')+'</li>'
 +'<li class="chara_detail_faceList">'+im(c.face2,c.ja,'','FACE 2')+'</li></ul></div>'
 +'<div class="charaModal_sticky"><div class="charaModal_stickyIn"><div class="charaENGName">'
 +'<div class="charaEngName_top js-charaengNameWrap"><p class="js-charaengname">'+c.eng+'</p></div>'
 +'<div class="charaEngName_bottom js-charaengNameWrap"><p class="js-charaengname">'+c.eng+'</p></div>'
 +'</div></div></div>'
 +'<div class="charaModal_sticky charaNav_sticky"><div class="charaModal_stickyIn">'
 +'<div class="charaModal_prev"><a href="#" data-nxpv="'+pad(pi)+'" class="charaModal_btn"><div class="charaModal_btnIMG">'+im(cv(p),p.ja,'','')+'</div><p class="charaModal_btnName">'+p.ja+'</p></a></div>'
 +'<div class="charaModal_next"><a href="#" data-nxpv="'+pad(ni)+'" class="charaModal_btn"><div class="charaModal_btnIMG">'+im(cv(x),x.ja,'','')+'</div><p class="charaModal_btnName">'+x.ja+'</p></a></div>'
 +'</div></div></div></div>';
}

/* ===== BGM (lagu latar global, terpisah dari voice karakter) ===== */
var BGM = (function(){
	var SRC = 'audio/renai.mp3';        // <-- ganti dengan nama file lagu kamu
	var VOL_NORMAL = 0.4;       // volume normal BGM (0 - 1)
	var VOL_DUCK   = 0.08;      // volume BGM saat voice karakter sedang bicara
	var K_PLAY = 'bgm_playing', K_TIME = 'bgm_time', K_VOL = 'bgm_vol';

	var audio = new Audio(SRC);
	audio.loop = true;
	audio.preload = 'auto';

	var savedVol = parseFloat(localStorage.getItem(K_VOL));
	VOL_NORMAL = isNaN(savedVol) ? VOL_NORMAL : savedVol;
	audio.volume = VOL_NORMAL;

	/* lanjutkan dari posisi terakhir saat pindah halaman */
	var savedTime = parseFloat(localStorage.getItem(K_TIME));
	if(!isNaN(savedTime) && savedTime > 0){
		audio.addEventListener('loadedmetadata', function(){
			if(savedTime < audio.duration) audio.currentTime = savedTime;
		}, {once:true});
	}

	function setBtn(isPlaying){
		$('.js-bgmBtn').toggleClass('is-play', isPlaying)
			.find('.bgmIcon').text(isPlaying ? '❚❚' : '▶');
	}
	function play(){
		audio.play().then(function(){
			localStorage.setItem(K_PLAY,'1');
			setBtn(true);
		}).catch(function(){ setBtn(false); });
	}
	function pause(){
		audio.pause();
		localStorage.setItem(K_PLAY,'0');
		setBtn(false);
	}
	function duck(){ audio.volume = VOL_DUCK; }
	function restore(){ audio.volume = VOL_NORMAL; }

	/* simpan posisi tiap detik + saat pindah/keluar halaman, biar nyambung di halaman lain */
	setInterval(function(){ if(!audio.paused) localStorage.setItem(K_TIME, audio.currentTime); },1000);
	$(window).on('beforeunload', function(){ if(!audio.paused) localStorage.setItem(K_TIME, audio.currentTime); });

	$(function(){
		/* otomatis lanjut main kalau sebelumnya sedang diputar (butuh 1x klik awal krn kebijakan browser) */
		if(localStorage.getItem(K_PLAY) === '1') play(); else setBtn(false);
		$(document).on('click','.js-bgmBtn',function(e){
			e.preventDefault();
			audio.paused ? play() : pause();
		});
	});

	return {duck:duck, restore:restore};
})();

/* ===== VOICE ===== */
var VOICE=null;
function stopVoice(){
	if(VOICE){VOICE.pause();VOICE=null}
	$('.js-voiceBtn').removeClass('is-play').find('.vi').text('▶');
	$('.js-voiceBtn:not([disabled])').find('.vt').text('PLAY VOICE');
	$('.voice_bar i').css('width','0');
	BGM.restore();
}
function pickSrc(v){
	var list=$.isArray(v)?v:[v], a=document.createElement('audio'), map={mp3:'audio/mpeg',ogg:'audio/ogg',oga:'audio/ogg',wav:'audio/wav',m4a:'audio/mp4',aac:'audio/aac'};
	for(var k=0;k<list.length;k++){
		var ext=(list[k].split('?')[0].split('.').pop()||'').toLowerCase();
		if(!map[ext]||a.canPlayType(map[ext])) return list[k];
	}
	return list[0];
}
function playVoice($b){
	if(!$b.length||$b.prop('disabled')) return;
	stopVoice();
	var c=CHARACTERS[$b.data('voice')];
	VOICE=new Audio(pickSrc(c.voice));
	VOICE.addEventListener('timeupdate',function(){
		if(VOICE&&VOICE.duration) $b.closest('.chara_voiceWrap').find('.voice_bar i').css('width',(VOICE.currentTime/VOICE.duration*100)+'%');
	});
	VOICE.addEventListener('ended',stopVoice);
	VOICE.addEventListener('error',function(){ stopVoice(); $b.find('.vt').text('FILE TIDAK DITEMUKAN'); });
	VOICE.play().then(function(){
		$b.addClass('is-play').find('.vi').text('■');
		$b.find('.vt').text('STOP');
		BGM.duck();
	}).catch(function(){ stopVoice(); });
}
/* otomatis putar saat karakter dipilih / pindah lewat prev-next */
function autoVoice(){ playVoice($('.js-voiceBtn').first()); }
/* tombol manual: putar / stop */
$(document).on('click','.js-voiceBtn',function(){
	var $b=$(this);
	if($b.hasClass('is-play')) stopVoice(); else playVoice($b);
});

/* ===== jquery.character.js (asli, load('.php') diganti tpl()) ===== */
function chara(_chara){
	stopVoice();
	$("#js-modalCont").html(tpl(_chara));
	$("#modal").fadeIn('fast','linear',function(){
		$(".modalBox").fadeIn(500);
		var chraeng = $(".js-modal_charaeng").data('chara_eng_name');
		$(".js-charaengname").text(chraeng);
		$("body").css({'overflow':'hidden'});
		setTimeout(function(){ $(".js-charaengNameWrap").addClass('is-active'); autoVoice(); },100);
	});
}
function chara_nxpv(_chara_nxpv){
	stopVoice();
	$("#modal").fadeOut(200);
	setTimeout(function(){
		$("#js-modalCont").html('');
		setTimeout(function(){
			$("#js-modalCont").html(tpl(_chara_nxpv));
			setTimeout(function(){
				$("#modal").fadeIn(300);
				var chraeng = $(".js-modal_charaeng").data('chara_eng_name');
				$(".js-charaengname").text(chraeng);
				setTimeout(function(){ $(".js-charaengNameWrap").addClass('is-active'); autoVoice(); },100);
			},500);
		},100);
	},400);
}
$(document).on('click','[data-chara]',function(e){e.preventDefault();chara($(this).data('chara'))});
$(document).on('click','[data-nxpv]',function(e){e.preventDefault();chara_nxpv($(this).data('nxpv'))});
$(function(){
	$(".js-modalClose").on('click', function(e){
		e.preventDefault();
		stopVoice();
		$(".modalBox, .oneModal").fadeOut(500);
		setTimeout(function(){ $("#modal #js-modalCont").html(''); },500);
		$("body").css({'overflow':''});
	});
});

/* ===== jquery.common.js (asli) ===== */
$(function(){
	$(".js-anchor").on('click', function(){
		var speed = 1000;
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$('body,html').animate({scrollTop:position}, speed, 'easeOutQuart');
		return false;
	});
	$(".js-menu").on('click', function(){
		$(this).toggleClass('active');
		if($(this).hasClass('active')){
			$(".menuTxt").text('CLOSE');
			$(".js-headerIn").addClass('is-active');
			$("body").css({'overflow':'hidden'});
		} else {
			$(".menuTxt").text('MENU');
			$(".js-headerIn").removeClass('is-active');
			$("body").css({'overflow':''});
		}
	});
});
function scrCom(){
	var scT = $(window).scrollTop();
	var ww = window.innerWidth;
	var wh = window.innerHeight;
	if(ww > 769){
		var fooH = $(".footer").outerHeight();
		var fooT = $(".footer").offset().top;
		var fullWrapH = $("#fullWrap").outerHeight();
		$(".header").css({"height": fullWrapH-fooH+160});
		var navH = $(".headerNav").outerHeight();
		var navContH = navH + 400;
		var navHIndex = navH + 100;
		$(".headerIn").css({"min-height": navHIndex});
		$(".sub .headerIn").css({"min-height": navContH});
		if(wh < navContH){ $(".headerNav").addClass('js-hmin'); }else{ $(".headerNav").removeClass('js-hmin'); }
		if (fooT - wh < scT - 160) { $(".header_twLink").css({"position":'absolute'}); }
		else{ $(".header_twLink").css({"position":'fixed'}); }
	} else{
		$(".header").css({"height": 'auto'});
		var sp_navListsH = $(".headerNav").outerHeight();
		$(".navTitleWrap_sp").css({'height': sp_navListsH});
	}
}
$(window).on('load scroll resize', scrCom);
$(window).on('load',function(){
	$("body").css({'overflow':'hidden'});
	setTimeout(function(){
		$(".js-ldWrap.sub_load").addClass('a3');
		setTimeout(function(){
			$(".js-ldWrap.sub_load").fadeOut(500);
			$("body.subbody").css({'overflow':''});
		},500);
	},400);
});
$(function(){
	var bp = 768, ww = window.innerWidth;
	var loadP = (bp < ww) ? 'pc' : 'sp', viewP;
	$(window).on("resize", function(){
		ww = window.innerWidth;
		viewP = (bp < ww) ? 'pc' : 'sp';
		if (loadP != viewP) { setTimeout(function(){window.location.reload()}, 1); }
	});
});
