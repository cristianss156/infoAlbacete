var _email="";
var _pass="";
var cat="Inicio";
var temp;
var comp=0;
var activo=false;
var reicomp=false;
var margen_arriba=null;
var busquedasRecientes=[];
//funciones que se cargan cuando la aplicación esta lista
$(document).ready(function(){
	//función que activa la barra de busqueda de la aplicación
	$("#search").click(function(){
		document.getElementById("imagen").innerHTML="arrow_back";
		$("#imagen").attr("class","back material-icons");
		$("#contenedorTitulo,#search,#options,#contenedorVaciar").css({'display':'none'});
		$("#contenedorBuscar").fadeIn(150);
		$("#buscar").focus();
		if($("#cabecera").height()===112){
   			$("#cabecera").css({'height':'56px'});
   			$("#contenedor").css({'marginTop':'56px'});
   			$("#filtros").css({'display':'none'});
   		}
   		mostrarBusRecientes();
	});
	//función que muestra el menu lateral o, si esta activa la barra de busqueda, cierra la busqueda
	$("#contenedorImg").click(function(){
		if($("#imagen").attr("class")==="back material-icons"){
			if(comp===0){$("#cabecera").css({'backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});}
			else{$("#cabecera").css({'background':'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0))','boxShadow':'none'});}
			$("#buscar").val("");
			document.getElementById("imagen").innerHTML="menu";
			$("#imagen").attr("class","menu material-icons");
			$("#contentRecentSearch").slideUp(150);
			$("#contenedorBuscar").fadeOut(150);
			setTimeout(function(){
				$("#contenedorTitulo,#search,#options").css({'display':'block'});
				if(cat!=="Inicio" && comp===0){$("#filtros").css({'display':'block'});}
   				if(!$("#filtros").is(":hidden")){
					$("#cabecera").css({'height':'112px'});
					$("#contenedor").css({'marginTop':'112px'});
					if(document.getElementById("volverDeBuscar")){
						$("#volverDeBuscar").css({'marginTop':'112px'});
						$("#contenedor").css({'marginTop':'158px'});
					}
					else{$("#contenedor").css({'marginTop':'112px'});}
   				}
   			},250);
		}
		else{
			if($(window).width()<1024){
				$("#menu").css({'marginLeft':'0','width':'100%'});
				$("#left_drawer").css({'marginLeft':'0'});
			}
		}
	});
	//función que oculta el menu lateral
	$("#menu").click(function(){
		if($(window).width()<=1024){
			$(this).css({'marginLeft':'-250px','width':'250px'});
			$("#left_drawer").css({'marginLeft':'-250px'});
		}
	});
	//función que muestra el cuadro de dialogo con la información acerca de la aplicación
    $("#acercaDe").click(function(){
    	var div=document.createElement("div");
    	div.setAttribute("id","acercaDialog");
    	var h=document.createElement("h2");
    	h.setAttribute("id","TituloDialog");
    	h.innerHTML="Info Albacete";
    	var span=document.createElement("span");
    	span.setAttribute("id","desDialog");
    	span.innerHTML="Cristian Silvestre Sánchez, 19/02/2016 12:59";
    	var button=document.createElement("button");
    	button.setAttribute("id","aceptarDialog");
    	button.className='mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent';
    	button.setAttribute("onclick","aceptarInfo()");
    	button.innerHTML="Aceptar";
    	componentHandler.upgradeElement(button);
    	div.appendChild(h);
    	div.appendChild(span);
    	div.appendChild(button);
    	var sec=document.createElement("section");
    	sec.setAttribute("id","contenedorAcerca");
    	sec.appendChild(div);
    	$("body").append(sec);
    });
    //función que muestra el formulario para enviar opiniones y sugerencias
    $("#opinion").click(function(){
    	var div=document.createElement("div");
    	div.setAttribute("id","contenedorFormOpinion");
    	var h=document.createElement("h2");
    	h.innerHTML="Envíame tu opinión";
    	var form=document.createElement("form");
    	form.setAttribute("onsubmit","return mandarCorreo()");
    	form.setAttribute("method","POST");
    	var label=document.createElement("label");
    	label.setAttribute("for","email");
    	label.innerHTML="Tu correo:";
    	var input=document.createElement("input");
    	input.setAttribute("id","email");
    	input.setAttribute("name","email");
    	input.setAttribute("type","email");
    	input.setAttribute("placeholder","ejemplo@ejem.com");
    	if(_email!==""){input.setAttribute("value",_email);}
    	input.autofocus="true";
    	input.setAttribute("required","required");
    	form.appendChild(label);
    	form.appendChild(input);
    	var br=document.createElement("br");
    	form.appendChild(br);
    	var label=document.createElement("label");
    	label.setAttribute("for","cuerpOpinion");
    	label.innerHTML="Escribe aqui tu opinión:";
    	var text=document.createElement("textarea");
    	text.setAttribute("id","cuerpOpinion");
    	text.setAttribute("name","cuerpo");
    	text.setAttribute("placeholder","Tu opinión...");
    	text.setAttribute("required","required");
    	form.appendChild(label);
    	form.appendChild(text);
    	var input=document.createElement("button");
    	input.setAttribute("id","enviarOpinion");
    	input.className='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent';
    	input.innerHTML="Enviar";
    	componentHandler.upgradeElement(input);
    	form.appendChild(input);
    	var button=document.createElement("button");
    	button.setAttribute("id","cancelarOpinion");
    	button.className='mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent';
    	button.setAttribute("onclick","return cancelar()");
    	button.innerHTML="Cancelar";
    	componentHandler.upgradeElement(button);
    	form.appendChild(button);
    	div.appendChild(h);
    	div.appendChild(form);
    	var sec=document.createElement("section");
    	sec.setAttribute("id","contenedorOpinion");
    	sec.appendChild(div);
    	$("body").append(sec);
    });
    //función que muestra el boton para limpiar la barra de busqueda al escribir algo
    $("#buscar").keyup(function(event){
    	if($(this).val()!==""){$("#contenedorVaciar").fadeIn(150);}
    	else{$("#contenedorVaciar").fadeOut(150);}
    	if(event.which===13){buscarDatos($(this).val());}
    });
    //función que muestra los distintos filtros que existen en cada categoria
    $(".select").click(function(){
		if(activo===false){
			$(this).attr("class","active");
			$(".container_items",this).css({'marginTop':'0','width':'150px'});
			$("#filtrosImg").css({'display':'none'});
			activo=true;
		}
		else{
			$(this).attr("class","select");
			$(".container_items",this).css({'width':'110px'});
			$("#filtrosImg").css({'display':'block'});
			activo=false;
		}
	});
    //función que muestra u oculta el menu de opciones
	$("#options").click(function(){$("#listOptions").css({'display':'block'});});
	//funciones que oculta el menu de opciones y los filtros desplegados al pulsar sobre cualquier parte de la aplicación
	$("#filtros").mouseleave(function(){
		if(!$("#filtros").hasClass("select")){
			$("#filtros").attr("class","select");
			$("#filtros .container_items").css({'width':'110px'});
			if(margen_arriba!==null){$(".container_items").css({'marginTop':'-'+margen_arriba+'px'});}
			$("#filtrosImg").css({'display':'block'});
			activo=false;
		}
	});
	$("div").not("#options").click(function(){if($("#listOptions").is(":visible")){$("#listOptions").css({'display':'none'});}});
	//función que eleminia la descripción en la pantalla de inicio
	$("#botonEntendido").click(function(){
		$("#contDescp").animate({height:['toggle','swing']},350);
		setTimeout(function(){$("#contDescp").remove();},500);
		$("#contenedor").css({'marginTop':'56px'});
	});
});
//función que se ejecuta al redimensionar la ventana del navegador reajustando el tamaño de distintos elementos de la aplicación
$(window).resize(function(){
	if($(document).width()>1024){
	 	$("#menu").css({'marginLeft':'0','width':'250px'});
	 	$("#left_drawer").css({'marginLeft':'0'});
	 	$("#cabecera,.subheader,#contenedor").css({'marginLeft':'250px','width':'calc(100% - 250px)'});
		if(document.getElementById("contDescp")){$("#contDescp").css({'marginLeft':'250px','width':'calc(100% - 250px)'});}
	}
	if($(document).width()<=1024){
	 	$("#menu").css({'marginLeft':'-250px','width':'250px'});
		$("#left_drawer").css({'marginLeft':'-250px'});
		$("#cabecera,.subheader,#contenedor").css({'marginLeft':'0','width':'100%'});
		if(document.getElementById("contDescp")){$("#contDescp").css({'marginLeft':'0','width':'100%'});}
	}
	if($(window).width()<=720 && comp==1){
		if($("#imagen").attr("class")!="back material-icons"){$("#cabecera").css({'background':'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0))','boxShadow':'none'});}
		if($(window).scrollTop()>=244){$("#cabecera").css({'backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});}
		else{$("#cabecera").css({'background':'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0))','boxShadow':'none'});}
		$(".heroImg").css({'width':'100%','height':'280px','borderRadius':'0','marginLeft':'0','marginTop':'0','border':'none'});
		$(".info").css({'marginLeft':'0','width':'100%','borderRadius':'0','marginTop':'0','marginBottom':'2%','boxShadow':'0 2px 5px 0 rgba(0,0,0,0.16),0 2px 5px 0 rgba(0,0,0,0.23)'});
		$(".tarjetas").css({'cursor':'auto','marginTop':'-56px','width':'100%','height':'auto','marginLeft':'0','borderRadius':'0','borderBottom':'none','backgroundColor':'rgba(0,0,0,0)'});
	}
	else if($(window).width()>720 && comp==1){
		if($("#imagen").attr("class")!="back material-icons"){$("#cabecera").css({'background':'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0))','boxShadow':'none'});}
		if($(window).scrollTop()>=244){$("#cabecera").css({'backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});}
		else{$("#cabecera").css({'background':'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0))','boxShadow':'none'});}
		$(".heroImg").css({'height':'490px'});
		$(".info").css({'marginLeft':'15%','marginTop':'-90px','marginBottom':'2%','borderRadius':'3px','width':'70%','height':'auto','boxShadow':'0 2px 5px 0 rgba(0,0,0,0.16),0 2px 5px 0 rgba(0,0,0,0.23)'});
		$(".tarjetas").css({'cursor':'auto','marginTop':'-56px','width':'100%','height':'auto','marginLeft':'0','borderRadius':'0','borderBottom':'none','backgroundColor':'rgba(0,0,0,0)'});
	}
});
//función que se ejecuta al hacer scroll mostrando u ocultando el botón para volver arriba, tambien controlando el aspecto de la cabecera de la aplicación
$(window).scroll(function(){
	if($(this).scrollTop()===0){
		$("#contenedorArriba").css({'bottom':'-70px'});
		$("#cabecera").css({'marginTop':'0'});
		if($(".subheader").is(":visible")){$(".subheader").css({'marginTop':'56px'});}
	}
	else if($(this).scrollTop()>=250 && $("#informacion").css("bottom")==="0px" && $(window).width()<625){$("#contenedorArriba").css({'bottom':'70px'});}
	else{$("#contenedorArriba").css({'bottom':'20px'});}
	if($(this).scrollTop()>=250){
		if($("#imagen").attr("class")!=="back material-icons" && $(window).width()<=1024 && $("#listOptions").is(":hidden")){$("#cabecera").css({'marginTop':'-56px'});}
		if($(".subheader").is(":visible")){$(".subheader").css({'marginTop':'0'});}
	}
	if($(this).scrollTop()<244 && comp===1 && $("#imagen").attr("class")!=="back material-icons"){$("#cabecera").css({'background':'linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0))','boxShadow':'none'});}
	else if($(this).scrollTop()>=244 && comp===1 && $("#imagen").attr("class")!=="back material-icons"){$("#cabecera").css({'background':'none','backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});}
});
//función para volver arriba en la aplicación
function arriba(){$("html,body").animate({scrollTop:"0"},250);}
//función que despliega la tarjeta seleccionada para mostrar mas información
function verMas(elemento,_sitio,_id){
	if(reicomp===false){
		$("html,body").animate({scrollTop:"0"},50);
		compsitio(_sitio,_id);
   		$(".tarjetas").not($(elemento)).remove();
    	if($(window).width()>720){
   	   		$(".heroImg").css({'height':'490px'});
   	   		$(".info").css({'background':'none','paddingBottom':'2%','backgroundColor':'white','marginLeft':'15%','marginTop':'-90px','marginBottom':'2%','borderRadius':'2px','width':'70%','height':'auto','boxShadow':'0 2px 5px 0 rgba(0,0,0,0.16),0 2px 5px 0 rgba(0,0,0,0.23)'});
   		}
   		else{
	   		$(".heroImg").css({'width':'100%','height':'280px','borderRadius':'0','border':'0','marginTop':'0','marginLeft':'0'});
			$(".info").css({'background':'none','paddingBottom':'2%','backgroundColor':'white','width':'100%','height':'auto','marginLeft':'0','marginBottom':'2%','marginTop':'0','boxShadow':'0 2px 5px 0 rgba(0,0,0,0.16),0 2px 5px 0 rgba(0,0,0,0.23)'});
   		}
	   	if($("#cabecera").height()===112){$("#cabecera").css({'height':'56px'});}
   		$(".infoTitulo,.infoTipo").css({'color':'black'});
   		$(".infoTitulo").css({'top':'18px','width':'90%'});
   		$(".infoDatos").css({'top':'28px','width':'88%','color':'#3F51B5'});
   		$(".verMapaBoton,button").css({'display':'block'});
   		$(".infoTipo").css({'top':'38px','right':'15px'});
   		$("#cabecera").css({'background':'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0))','boxShadow':'none'});
   		$(elemento).css({'cursor':'auto','marginTop':'-56px','width':'100%','height':'auto','marginLeft':'0','borderRadius':'0','boxShadow':'none','borderBottom':'none','backgroundColor':'rgba(0,0,0,0)'});
   		$(".heroImg img").css({'height':'140%'});
   		$(".subheaderTitle").remove();
   		$("#contenedor").css({'marginTop':'56px'});
   		if($("#volverDeBuscar").is(":visible")){$("#volverDeBuscar").slideUp(250);}
   		if($("#filtros").is(":visible")){$("#filtros").css({'display':'none'});}
   		if(document.getElementById("contDescp")){$("#contDescp").css({'display':'none'});}
   		document.getElementById("titulo").innerHTML=$(".infoTitulo",elemento).html();
   		comp=1;
   		reicomp=true;
   }
}
//función que vuelve a igualar a 0 la variable global "comp" y varios elementos de la interfaz
function reiComp(B){
	if(B===false){event.stopPropagation();}
	$("#filtros").attr("class","select");
	$("#filtrosImg").css({'display':'block'});
	$(".container_items").css({'marginTop':'0','width':'110px'});
	margen_arriba=null;
	if($("#volverDeBuscar").is(":visible")){$("#volverDeBuscar").slideUp(250);}
	if($("#imagen").attr("class")==="back material-icons"){
		if(comp===0){$("#cabecera").css({'background':'none','backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});}
		else{$("#cabecera").css({'background':'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0))','boxShadow':'none'});}
		$("#buscar").val("");
		document.getElementById("imagen").innerHTML="menu";
		$("#imagen").attr("class","menu material-icons");
		$("#contenedorTitulo,#search,#options").css({'display':'block'});
		$("#contenedorBuscar").css({'display':'none'});
		if(document.getElementById("contentRecentSearch")){$("#contentRecentSearch").css({'display':'none'});}
	}
	comp=0;
	reicomp=false;
	activo=false;
}
//función que vacia la caja de texto de la barra de busqueda
function vaciar(){
	$("#buscar").val("").focus();
	$("#contenedorVaciar").fadeOut(250);
}
//función que muestra como selecionado el filtro elegido por el usuario
function filtrar(objeto){
	var margen=40;
	margen_arriba=margen*$(objeto).attr("name");
	$(".container_items").has(objeto).css({'marginTop':'-'+margen_arriba+'px'});
}
//función que quita la pantalla de carga de la aplicación mostrando la pagina inicial
function mostrarInicio(){
	setTimeout(function(){$("#carga").remove();},1000);
	setTimeout(function(){$("html").css({'overflow':'auto'});},1100);
	cargarDatos();
}
//función que cierra el formulario para enviar opiniones y sugerencias
function cancelar(){
	$("#contenedorOpinion").remove();
	return false;
}
//función que crear un mensaje de información cuando se realiza alguna acción en la aplicación
function mensaje(_mensaje){
	if(document.getElementById("mensaje_info")){
		$("#mensaje_info").remove();
		clearTimeout(temp);
	}
	var div=document.createElement("div");
	div.setAttribute("id","informacion");
	var h=document.createElement("span");
	h.setAttribute("id","mensaje");
	h.innerHTML=_mensaje;
	div.appendChild(h);
	var sec=document.createElement("section");
	sec.setAttribute("id","mensaje_info");
	sec.appendChild(div);
	$("body").append(sec);
	setTimeout(function(){
		$("#informacion").animate({bottom:['0','swing']},500);
		if($("#contenedorArriba").css("bottom")==="20px" && $(window).width()<625){
			$("#contenedorArriba").css({'bottom':'70px'});
		}
	},100);
	temp=setTimeout(function(){
		$("#informacion").animate({bottom:['-100px','swing']},500);
		if($("#contenedorArriba").css("bottom")==="70px"){
			$("#contenedorArriba").css({'bottom':'20px'});
		}
		setTimeout(function(){$("#mensaje_info").remove();},350);
	},3500);
}
//función que muestra el mensaje de bienvenida tras iniciar sesión
function bienvenido(_user){
	var secBien=document.createElement("section");
	secBien.setAttribute("id","contBienvenida");
	var divBien=document.createElement("div");
	divBien.setAttribute("id","bienvenida");
	var spanBien=document.createElement("span");
	spanBien.innerHTML="¡Bienvenido/a!<br/>"+_user;
	divBien.appendChild(spanBien);
	secBien.appendChild(divBien);
	$("body").append(secBien);
	setTimeout(function(){$("#contBienvenida").animate({top:['8px','swing']},500);},100);
	setTimeout(function(){
		$("#contBienvenida").animate({top:['-80px','swing']},500);
		setTimeout(function(){$("#contBienvenida").remove();},350);
	},3500);
}
//función que oculta el cuadro de dialogo con la información acerca de la aplicación
function aceptarInfo(){$("#contenedorAcerca").remove();}
//función que muestra el formulario para introducir el codigo de verificación
function cambiarForm(){
	$("#formSesion").remove();
	$("#cabSesion").css({'height':'74px'});
	$("#cabSesion span").css({'marginTop':'27px'});
	var formCod=document.createElement("form");
	formCod.setAttribute("id","formCodigo");
	formCod.setAttribute("onsubmit","return confirmCod()");
	var spanCod=document.createElement("span");
	spanCod.setAttribute("id","titCodigo");
	spanCod.innerHTML="Un poco más";
	formCod.appendChild(spanCod);
	var pCod=document.createElement("p");
	pCod.setAttribute("id","pCodigo");
	pCod.innerHTML="No cierres la aplicación en breves recibirás un código en tu correo, copialo e introducelo aquí para continuar."
	formCod.appendChild(pCod);
	var inputCod=document.createElement("input");
	inputCod.setAttribute("id","introCod");
	inputCod.setAttribute("type","text");
	inputCod.setAttribute("required","required");
	inputCod.setAttribute("maxlength","36");
	inputCod.setAttribute("placeholder","Tu código");
	formCod.appendChild(inputCod);
	var inputEnvCod=document.createElement("button");
    inputEnvCod.setAttribute("id","enviarCodigo");
    inputEnvCod.className='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent';
    inputEnvCod.innerHTML="Enviar";
    componentHandler.upgradeElement(inputEnvCod);
    formCod.appendChild(inputEnvCod);
    $("#sesionDialog").css({'height':'300px'}).append(formCod);
}
//función que cierra el mapa
function cerrar_map(){
	$("#cerrar_map").remove();
	$("#cont_map").css({'display':'none'});
}
//función que muestra las busquedas busquedasRecientes
function mostrarBusRecientes(){
	if(busquedasRecientes.length!==0){
		$("#contenedorBuscar").css({'borderRadius':'2px 2px 0 0'});
		if($(".recentSearchItem")){$(".recentSearchItem").remove();}
		for(var bqR=0;bqR<busquedasRecientes.length && bqR<5;bqR++){
			var contItem=document.createElement("div");
			contItem.setAttribute("class","recentSearchItem");
			var contEventoBuscar=document.createElement("div");
			contEventoBuscar.setAttribute("class","contEventBuscarRecent");
			contEventoBuscar.setAttribute("onclick",'buscarDatos("'+busquedasRecientes[bqR]+'")');
			var contImg=document.createElement("div");
			contImg.setAttribute("class","recentImg");
			var iItem=document.createElement("i");
			iItem.className="material-icons";
			iItem.innerHTML="history";
			contImg.appendChild(iItem);
			contEventoBuscar.appendChild(contImg);
			var textItem=document.createElement("span");
			textItem.setAttribute("class","recent");
			textItem.innerHTML=busquedasRecientes[bqR];
			contEventoBuscar.appendChild(textItem);
			contItem.appendChild(contEventoBuscar);
			var contImgBorrar=document.createElement("div");
			contImgBorrar.setAttribute("class","recentBorrar");
			contImgBorrar.setAttribute("onclick","borrarReciente("+bqR+")");
			var iBorrarItem=document.createElement("i");
			iBorrarItem.className="material-icons";
			iBorrarItem.innerHTML="delete";
			contImgBorrar.appendChild(iBorrarItem);
			contItem.appendChild(contImgBorrar);
			$("#contentRecentSearch").append(contItem);
		}
		$("#contentRecentSearch").slideDown(300);
	}
	else{
		if($(".recentSearchItem")){$(".recentSearchItem").remove();}
		$("#contenedorBuscar").css({'borderRadius':'2px 2px 2px 2px'});
	}
}
//función que borra un elemento de la lista de busquedas recientes
function borrarReciente(_indice){
	busquedasRecientes.splice(_indice,1);
	mostrarBusRecientes();
}