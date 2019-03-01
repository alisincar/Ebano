$(document).ready(function() {
index();
});
//var url="http://localhost/eurobano/";
var url="http://eurobano.com.tr/";
var sertifika=0;
var parola="";

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function index(){
	loading("show");
	$.ajax({
	  type: "GET",
	  url: url+"ajax/json_index.php",
	  success: function (data) {
		loading("hide");
	    $("title").text(data.SAYFA.meta_title);
	    $("#video").attr("href",data.VIDEO+"?autoplay=1");
	    parola=data.PAROLA;
	    $("#biz_kimiz").html(data.BIZ_KIMIZ.ACIKLAMA+" ...");
	    data['FUARLAR'].forEach(function(fuar) {
	    	$("#fuarlar").append('<div style="display:none" id="fuar_icerik_'+fuar.salon+fuar.no+fuar.tarih+'">'+fuar.aciklama+'</div>');
	    	$("#fuarlar").append(fuar_cart(fuar.title,fuar.adi,fuar.salon,fuar.no,fuar.tarih,fuar.konum,fuar.resim));
	    });
	    var koleksiyonID=0;
	    data['KOLEKSIYONLAR'].forEach(function(koleksiyon) {
	    	$("#urunler_index").append(urun_cart("",koleksiyon.KOLEKSIYON_RESMI,koleksiyon.KOLEKSIYON_ADI,koleksiyonID));
		    $("#urunler").append('<h4 id="kategori_'+koleksiyonID+'" style="padding-bottom:10px;color:#444;">'+koleksiyon.KOLEKSIYON_ADI+'</h4>');
		    var kaliteID=0;
		    koleksiyon['KALITELER'].forEach(function(kalite) {
		    	var icerik=kalite.ICERIK.replace(/(?:\r\n|\r|\n)/g, '<br>');
				var obj= new Object();
				obj.Message = icerik;
				$("#urunler").append('<div style="display:none" id="kalite_icerik_'+kaliteID+'">'+kalite.ICERIK+'</div>');
				$("#urunler").append('<div style="display:none" id="kalite_urunler_'+kaliteID+'">'+JSON.stringify(kalite.URUNLER)+'</div>');
		   		$("#urunler").append(urun_cart(koleksiyon.KOLEKSIYON_ADI,kalite.KALITE_RESMI,kalite.KALITE_ADI,koleksiyonID,kaliteID,kalite.KALITE_VIDEO));
		    	kaliteID++;
		    });
		    koleksiyonID++;
		});
		},
		error:function(data){
			error("index");
		}
	});
}

function fuar_cart(title,adi,salon,no,tarih,konum,resim){
   var item='<div class="Fair-item flex-column">'+
         	'<a href="/fair_detay/" onclick="fuar_detay(\''+title+'\',\''+salon+'\',\''+no+'\',\''+tarih+'\',\''+konum+'\',\''+resim+'\')" class="global_link"></a>'+
       		'<div class="Fair-item-top flex a-i-c">'+
         	'<div class="Fair-item-top-left ">'+
        	'<img src=\''+resim+'\' class="w-100" alt="">'+
        	'</div>'+
        	'<div class="Fair-item-top-right flex-column">'+
        	'<h6>'+title+'</h6>'+
        	'<p>'+konum+'</p>'+
        	'</div>'+
        	'</div>'+
        	'<div class="Fair-item-bottom">'+
        	'<p class="date">'+tarih+'</p>'+
        	'</div>'+
       		'</div>';
    return item;
}

function fuar_detay(title,salon,no,tarih,konum,resim){

	loading("show");
	var icerik = ($("#fuar_icerik_"+salon+no+tarih).html()).replace(/<p>|<\/p>/g, '');

	setTimeout(function(){
	   $("#fuar_title").text(title);
	   $("#fuar_konum").text(konum);
	   $("#fuar_tarih").text(tarih);
	   $("#fuar_salon").text(salon);
	   $("#fuar_no").text(no);
	   $("#fuar_resim").attr("src",resim);
	   $("#fuar_aciklama").html(icerik);
	   loading("hide");
	},1000);
}

function iletisim(){
	loading("show");
	$.ajax({
	  type: "GET",
	  url: url+"ajax/json_iletisim.php",
	  success: function (data) {
  		 var tel=data.ILETISIM.tel;
  		 var telkisa=(data.ILETISIM.tel).replace(/ /g, '');
  		 $("#adr").text(data.ILETISIM.adr);
  		 $("#tel").text(tel);
  		 $("#tel").attr("href","tel:"+telkisa);
  		 $("#mail").text(data.ILETISIM.mail);
  		 $("#mail").attr("href","mailto:"+data.ILETISIM.mail);
  		 loading("hide");
	   },
		error:function(data){
			error("iletisim");
		}
	});
}

function kurumsal(){
	loading("show");
	$.ajax({
	  type: "GET",
	  url: url+"ajax/json_kurumsal.php",
	  success: function (data) {
		 $("#hakkimizda").html(data.KURUMSAL.HAKKIMIZDA);
		 $("#hakkimizda_video").attr("href",data.KURUMSAL.VIDEO+"?autoplay=1");
		 $("#hakkimizda_resim").text(data.KURUMSAL.resim);
		 loading("hide");
	  },
		error:function(data){
			error("kurumsal");
		}
	});
}
function sertifikalar(){
	if(sertifika==0){
	loading("show");
	$.ajax({
	  type: "GET",
	  url: url+"ajax/json_sertifika.php",
	  success: function (data) {
		 loading("hide");
		 sertifika=1;
		 data['SERTIFIKALAR'].forEach(function(sertifika) {
	    	$("#sertifikalar").append(galeri_cart(sertifika.BASLIK,sertifika.RESIM,"sertifika"));
	    });
	  },
		error:function(data){
			error("sertifikalar");
			sertifika=0;
		}
	});
	}
}

function urun_cart(koleksiyon="",resim,kalite="",koleksiyonID="",kaliteID,video=""){
	var item='<div class="Collection-item">';
	if (kaliteID==undefined) {
		item+='<a onclick="koleksiyona_git(\''+koleksiyonID+'\');" class="global_link"></a>';
	}else{
		item+='<a href="/product/" onclick="urun_detay(\''+koleksiyon+'\',\''+resim+'\',\''+kalite+'\','+kaliteID+',\''+video+'\');" class="global_link"></a>';
	}
	item+='<img src="'+resim+'" class="w-100" alt="">'+
		  '<div class="Collection-text flex ">'+
		  '<div class="Collection-text-left">'+
		  '<h6>'+kalite+'</h6>'+
		  '<p></p>'+
		  '</div>'+
		  '<p class="Collection-text-right ml-auto">'+koleksiyon+'</p>'+
		  '</div>'+
		  '</div>';
	return item;
}

function urun_detay(koleksiyon,resim,kalite,kaliteID,video=""){
	loading("show");
	var urunler=$.parseJSON($("#kalite_urunler_"+kaliteID).text());
	var icerik = ($("#kalite_icerik_"+kaliteID).html()).replace(/<p>|<\/p>/g, '');
	setTimeout(function(){
		login("show");
		$("#urun_baslik").text(kalite);
		$("#kalite_video").attr("href",video+"?autoplay=1");
		$("#urun_alt_baslik").html(icerik);
		$("#urun_koleksiyon").text(koleksiyon);
		$("#urun_ust_resim").attr("src",resim);
		urunler.forEach(function(urun) {
			var kalite_name=kalite.replace(/ /g, '_');
			$("#detay_urunler").append(galeri_cart(urun.KOD,urun.RESIM,kalite_name));
		});
		loading("hide");
	},1000);
}

function galeri_cart(aciklama,resim,grup){
	var item='<div class="Product_detay-item">'+
	          '<a href="'+resim+'" data-fancybox="images_'+grup+'" data-caption="'+aciklama+'" class=" global_link  popup-open"></a>'+
	          '<img src="'+resim+'"class="w-100" alt="">'+
	          '<p>'+aciklama+'</p>'+
        	  '</div>';
    return item;
}

function koleksiyona_git(koleksiyonID){
	document.getElementById("view_products").click();
	var pozisyon=document.getElementById("kategori_"+koleksiyonID).offsetTop;
	$(".page").scrollTop(pozisyon);
}

function loading(display){
	$("#loading").removeAttr("onclick");
	if(display=="show"){
		$("#error_info").hide();
		$("#loading").show();
		$("#loading_icon").show();
	}else{
		$("#loading").hide();
	}
}
function error(page){
	$("#loading").attr("onclick",page+"()");
	$("#loading_icon").hide();
	$("#error_info").show();
	$("#error_info" ).effect( "shake" );
}

function login(display){
  if (getCookie("login") == "") {
	  $("#password").click();
	  $("#password").focus();
		if(display=="show"){
			$("#login").show();
			$("#login_error").hide();
		}else{
			$("#login").hide();
		}
	}else{
		$("#login").hide();
	}
}

function check_login(){
	$("#login_error" ).hide();
	input_password=$("#password").val();
	input_password=input_password.trim();
	if((input_password!="" && parola!="") && input_password==parola){
		setCookie("login","asdasfghjkl532145851__*987yguio",365);
		login("hide");
		$("#password" ).val('');
	}else{
		$("#password" ).val('');
		$("#login_error" ).show();
		$("#login_error" ).effect( "shake" );
	}
}