$(document).ready(function() {
index();
});
//var url="http://localhost/eurobano/";
var url="http://eurobano.com.tr/";
function index(){
	$.ajax({
	  type: "GET",
	  url: url+"ajax/json_index.php",
	  success: function (data) {
	$("#loading").hide();
	    $("title").text(data.SAYFA.meta_title);
	    $("#video").attr("href",data.VIDEO+"?autoplay=1");
	    $("#biz_kimiz").html(data.BIZ_KIMIZ.ACIKLAMA+" ...");
	    data['FUARLAR'].forEach(function(fuar) {
	    	$("#fuarlar").append(fuar_cart(fuar.title,fuar.aciklama,fuar.adi,fuar.salon,fuar.no,fuar.tarih,fuar.konum,fuar.resim));
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
		}
	});
}

function fuar_cart(title,aciklama,adi,salon,no,tarih,konum,resim){
   var item='<div class="Fair-item flex-column">'+
         	'<a href="/fair_detay/" onclick="fuar_detay(\''+title+'\',\''+aciklama+'\',\''+salon+'\',\''+no+'\',\''+tarih+'\',\''+konum+'\',\''+resim+'\')" class="global_link"></a>'+
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

function fuar_detay(title,aciklama,salon,no,tarih,konum,resim){

	$("#loading").show();
	setTimeout(function(){
	   $("#fuar_title").text(title);
	   $("#fuar_konum").text(konum);
	   $("#fuar_tarih").text(tarih);
	   $("#fuar_salon").text(salon);
	   $("#fuar_no").text(no);
	   $("#fuar_resim").attr("src",resim);
	   $("#fuar_aciklama").html(aciklama);
	   $("#loading").hide();
	},1000);
}

function iletisim(){
	$("#loading").show();
	$.ajax({
	  type: "GET",
	  url: url+"ajax/json_iletisim.php",
	  success: function (data) {
  		 $(".loading").remove();
  		 $("#adr").text(data.ILETISIM.adr);
  		 $("#tel").text(data.ILETISIM.tel);
  		 $("#mail").text(data.ILETISIM.mail);
  		 $("#loading").hide();
	   }
	});
}

function kurumsal(){
	$("#loading").show();
	$.ajax({
	  type: "GET",
	  url: url+"ajax/json_kurumsal.php",
	  success: function (data) {
		 $(".loading").remove();
		 $("#hakkimizda").html(data.KURUMSAL.HAKKIMIZDA);
		 $("#hakkimizda_video").attr("href",data.KURUMSAL.VIDEO+"?autoplay=1");
		 $("#hakkimizda_resim").text(data.KURUMSAL.resim);
		 $("#loading").hide();
	  }
	});
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
	$("#loading").show();
	var urunler=$.parseJSON($("#kalite_urunler_"+kaliteID).text());
	var icerik = ($("#kalite_icerik_"+kaliteID).html()).replace(/<p>|<\/p>/g, '');
	setTimeout(function(){
	   $("#urun_baslik").text(kalite);
	   $("#kalite_video").attr("href",video+"?autoplay=1");
	   $("#urun_alt_baslik").html(icerik);
	   $("#urun_koleksiyon").text(koleksiyon);
	   $("#urun_ust_resim").attr("src",resim);
	   urunler.forEach(function(urun) {
	   		$("#detay_urunler").append(urun_detay_cart(urun.KOD,urun.RESIM));
	   });
	   $("#loading").hide();
	},1000);
}

function urun_detay_cart(kod,resim){
	var item='<div class="Product_detay-item">'+
	          '<a href="'+resim+'"  class="lightview global_link  popup-open" data-lightview-group="example"></a>'+
	          '<img src="'+resim+'"class="w-100" alt="">'+
	          '<p>'+kod+'</p>'+
        	  '</div>';
    return item;
}

function koleksiyona_git(koleksiyonID){
	document.getElementById("view_products").click();
	var pozisyon=document.getElementById("kategori_"+koleksiyonID).offsetTop;
	$(".page").scrollTop(pozisyon);
}