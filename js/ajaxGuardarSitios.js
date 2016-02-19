//función que guarda un sitio concreto pasado por parametro en la tabla "sitios_usuario"
function guardarSitio(_sitio){
	var Sitio=crearAjax();
	Sitio.open("POST","./php/operaciones.php?caso=8&email="+_email+"&sitio="+_sitio, true);
	Sitio.send();
	Sitio.onreadystatechange=function recibirConfirmGuardar(){
		if(Sitio.readyState===4 && Sitio.status===200){
			if(Sitio.responseText!=="good"){men="Error al guardar el sitio";}
			else{men="Sitio añadido a tus sitios";}
			mensaje(men);
			reiComp(false);
			verCategoria(cat);
		}
	}
}
//función que lista los sitios guardados por el usuario
function verMisSitios(){
	var MisSitios=crearAjax();
	document.getElementById("titulo").innerHTML="Mis sitios";
	MisSitios.open("POST","./php/operaciones.php?caso=9&email="+_email, true);
	MisSitios.send();
	MisSitios.onreadystatechange=function recibirListaSitios(){
		if(MisSitios.readyState===4 && MisSitios.status===200){
			if(MisSitios.responseText!=="[[null],[null],[null],[null],[null],[null],[null]]"){
				var ArraySitios=JSON.parse(MisSitios.responseText);
				formatearArraySitios(ArraySitios);
			}
			else{
				$("#cabecera").css({'background':'none','backgroundColor':'#9C27B0','height':'56px','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});
				$("#listOptions").css({'display':'none'});
				while(document.getElementById("contenedor").hasChildNodes()){$("#contenedor").empty();}
				while(document.getElementById("itemsFiltros").hasChildNodes()){$("#itemsFiltros").empty();}
				$("#filtros").css({'display':'none'});
				if(document.getElementById("contDescp")){$("#contDescp").css({'display':'none'});}
				mensaje("No tienes sitios guardados");
			}
		}
	}
}
//función que recibe la lista de sitios y la formatea para mostrarla
function formatearArraySitios(_aSitios){
	$("#cabecera").css({'backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});
	$("#filtros").css({'display':'none'});
	$("#listOptions").css({'display':'none'});
	while(document.getElementById("contenedor").hasChildNodes()){$("#contenedor").empty();}
	for(var i in _aSitios){
		if(_aSitios[i][1]!==undefined){
			var divSubHeader=document.createElement("div");
			divSubHeader.setAttribute("class","subheaderTitle");
			var titleCat=document.createElement("span");
			titleCat.setAttribute("class","textSubH");
			titleCat.innerHTML=_aSitios[i][0];
			divSubHeader.appendChild(titleCat);
			$("#contenedor").append(divSubHeader);
			for(var j=1;j<_aSitios[i].length;j++){
				var tarjeta=document.createElement("div");
				tarjeta.setAttribute('class','tarjetas');
				tarjeta.setAttribute('onclick','verMas(this,"'+_aSitios[i][j].ID+'","contInfo'+i+''+j+'")');
				var hero=document.createElement("div");
				hero.setAttribute('class','heroImg');
				var img=document.createElement("img");
				img.setAttribute("alt",_aSitios[i][j].NOMBRE);
				if(_aSitios[i][j].IMAGEN!==""){img.setAttribute('src',_aSitios[i][j].IMAGEN);}
				else{img.setAttribute('src','imagenes/noDisp'+Math.floor((Math.random()*(5-1))+1)+'.jpg');}
				hero.appendChild(img);
				var info=document.createElement("div");
				info.setAttribute('class','info');
				info.setAttribute("id","contInfo"+i+""+j);
				var infoTitulo=document.createElement("span");
				infoTitulo.setAttribute('class','infoTitulo');
				infoTitulo.innerHTML=_aSitios[i][j].NOMBRE;
				var infoDatos=document.createElement("span");
				infoDatos.setAttribute('class','infoDatos');
				infoDatos.setAttribute('onclick','verEnMapa('+_aSitios[i][j].LAT+','+_aSitios[i][j].LONG+')');
				infoDatos.innerHTML=_aSitios[i][j].DIRECCION;
				var infoTipo=document.createElement("span");
				infoTipo.setAttribute('class','infoTipo');
				if(_aSitios[i][j].TENEDORES){infoTipo.innerHTML=_aSitios[i][j].TIPO+" - "+_aSitios[i][j].TENEDORES+" Tenedores";}
				else{infoTipo.innerHTML=_aSitios[i][j].TIPO;}
				var volver=document.createElement("button");
				volver.className='volver mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent';
				volver.setAttribute('onclick','verCategoria("null"), reiComp(false)');
				volver.innerHTML="Volver";
				componentHandler.upgradeElement(volver);
				info.appendChild(infoTitulo);
				info.appendChild(infoDatos);
				info.appendChild(infoTipo);
				info.appendChild(volver);
				tarjeta.appendChild(hero);
				tarjeta.appendChild(info);
				$("#contenedor").append(tarjeta);
			}
		}
	}
	$("#cabecera").css({'background':'none','backgroundColor':'#9C27B0','height':'56px'});
	$("#contenedor").css({'marginTop':'56px'});
	if(document.getElementById("contDescp")){$("#contDescp").css({'display':'none'});}
	cat="Mis sitios";
}
//función que borrar un sitio de "Mis sitios"
function borrarSitio(_idSitio){
	var BorrSitio=crearAjax();
	BorrSitio.open("POST","./php/operaciones.php?caso=10&email="+_email+"&sitio="+_idSitio, true);
	BorrSitio.send();
	BorrSitio.onreadystatechange=function recibirConfirmBorrar(){
		if(BorrSitio.readyState===4 && BorrSitio.status===200){
			if(BorrSitio.responseText!=="good"){men="Error al borrar el sitio";}
			else{men="Sitio borrado de Mis sitios";}
			mensaje(men);
			reiComp(false);
			verCategoria(cat);
		}
	}
}
//función que comprueba si un sitio hasido guardado por un usuario y tambieén muestra el botón para añadir un comentario
function compsitio(_compSitio,_id){
	if(_email!==""){
		var CompSitio=crearAjax();
		CompSitio.open("POST","./php/operaciones.php?caso=11&email="+_email+"&sitio="+_compSitio, true);
		CompSitio.send();
		CompSitio.onreadystatechange=function recibirComp(){
			if(CompSitio.readyState===4 && CompSitio.status===200){
				var gS=document.createElement("button");
				gS.setAttribute("id","miniFAB");
				gS.className="botonSitio mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored mdl-js-ripple-effect";
				var divTool=document.createElement("div");
				divTool.className="mdl-tooltip";
				divTool.setAttribute("for","miniFAB");
				var icon=document.createElement("i");
				icon.className="material-icons";
				if(CompSitio.responseText!=="good"){
					gS.setAttribute("onclick","guardarSitio('"+_compSitio+"')");
					icon.innerHTML="favorite_border";
					divTool.innerHTML="Guardar sitio";
				}
				else{
					gS.setAttribute("onclick","borrarSitio('"+_compSitio+"')");
					icon.innerHTML="favorite";
					divTool.innerHTML="Borrar sitio";
				}
				gS.appendChild(icon);
				componentHandler.upgradeElement(gS);
				document.getElementById(_id).parentNode.appendChild(gS);
				componentHandler.upgradeElement(divTool);
				document.getElementById(_id).parentNode.appendChild(divTool);
			}
		}
	}
	var coment=document.createElement("button");
	coment.className='comentar mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent';
	coment.setAttribute("onclick","comentDialog('"+_compSitio+"')");
	coment.innerHTML="Añadir comentario";
	componentHandler.upgradeElement(coment);
	document.getElementById(_id).appendChild(coment);
}
//función que muestra el cuadro de dialogo para enviar un comentario
function comentDialog(_id){
	var div=document.createElement("div");
    div.setAttribute("id","contenedorFormComent");
    var h=document.createElement("h2");
    h.innerHTML="Escribe tu comentario";
    var form=document.createElement("form");
    form.setAttribute("onsubmit","return mandarComent('"+_id+"')");
    form.setAttribute("method","POST");
    var label=document.createElement("label");
    label.setAttribute("for","email");
    label.innerHTML="Tu correo:";
    var input=document.createElement("input");
    input.setAttribute("id","emailComentario");
    input.setAttribute("name","email");
    input.setAttribute("type","email");
    input.setAttribute("readonly","readonly");
    if(_email!==""){input.setAttribute("value",_email);}
    else{input.setAttribute("value","Usuario anónimo");}
    input.setAttribute("required","required");
    form.appendChild(label);
    form.appendChild(input);
    var br=document.createElement("br");
    form.appendChild(br);
    var label=document.createElement("label");
    label.setAttribute("for","cuerpComentario");
    label.innerHTML="Escribe aqui tu comentario:";
    var text=document.createElement("textarea");
    text.setAttribute("id","cuerpComentario");
    text.setAttribute("name","cuerpo");
    text.setAttribute("placeholder","Tu comentario...");
    text.setAttribute("maxlength","250");
    text.autofocus="true";
    text.setAttribute("required","required");
    form.appendChild(label);
    form.appendChild(text);
    var input=document.createElement("button");
    input.setAttribute("id","enviarComent");
    input.className='mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent';
    input.innerHTML="Enviar";
    componentHandler.upgradeElement(input);
    form.appendChild(input);
    var button=document.createElement("button");
    button.setAttribute("id","cancelarComent");
    button.className='mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent';
    button.setAttribute("onclick","return cancelarComentario()");
    button.innerHTML="Cancelar";
    componentHandler.upgradeElement(button);
    form.appendChild(button);
    div.appendChild(h);
    div.appendChild(form);
    var sec=document.createElement("section");
    sec.setAttribute("id","contenedorComentario");
    sec.appendChild(div);
    $("body").append(sec);
}
//función que cierra el formulario para enviar comentarios
function cancelarComentario(){
	$("#contenedorComentario").remove();
	return false;
}
//función que manda y guarda el comentario en la base de datos
function mandarComent(_id){
	var Coment=crearAjax();
	_usuarioComenta=emailComentario.value;
	_cuerpo=cuerpComentario.value;
	Coment.open("POST","./php/operaciones.php?caso=12&idsitio="+_id+"&email="+_usuarioComenta+"&cuerpoCom="+_cuerpo, true);
	Coment.send();
	Coment.onreadystatechange=function recibirComentario(){
		if(Coment.readyState===4 && Coment.status===200){
			if(Coment.responseText==="bad"){mensaje("Fallo al enviar el comentario");}
			else{
				mensaje("Comentario enviado con exito");
				$("#contenedorComentario").remove();
			}
		}
	}
	return false;
}
//función que muestra el mapa con la dirreción del sitio
function verEnMapa(_lat,_lng){
	$("#cont_map").css({'display':'block'});
	var geocoder=new google.maps.Geocoder();
  	var map=new google.maps.Map(document.getElementById('map'),{
    	center:new google.maps.LatLng(0,0),
    	zoom:16
  	});
  	var marker=new google.maps.Marker({
  		map:map
  	});
    var div=document.createElement("div");
	div.setAttribute("id","cerrar_map");
  	div.setAttribute("onclick","cerrar_map()");
  	div.innerHTML="<i class='material-icons'>clear</i>";
  	$("#cont_map").append(div);
  	var newcenter=new google.maps.LatLng(_lat, _lng);
  	map.panTo(newcenter);
  	marker.setPosition({lat: _lat, lng: _lng});
  	mensaje("Función en desarrollo");
}