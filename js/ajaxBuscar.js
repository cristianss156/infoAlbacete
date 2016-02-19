//función que recibe la cadena de texto que se buscará en la base de datos
function buscarDatos(_datos){
	if(_datos!==""){
		compD=0;
		var Buscar=crearAjax();
		_datos=_datos.toLowerCase();
		if(_datos==="panchos" || _datos==="los panchos"){_datos="bar pancho's";}
		else if(_datos==="deposito del sol" || _datos==="biblioteca del sol" || _datos==="biblioteca el sol"){_datos="biblioteca pública municipal depósitos del sol";}
		else if(_datos==="la popular"){_datos="popular libros";}
		else if(_datos==="st patricks" || _datos==="saint patricks" || _datos==="st. patricks"){_datos="st. patricks albacete";}
		Buscar.open("POST","./php/operaciones.php?caso=2&datos="+_datos, true);
		Buscar.send();
		Buscar.onreadystatechange=function recibirDatos(){
			if(Buscar.readyState===4 && Buscar.status===200){
				if(Buscar.responseText!=="null"){
					var Datos=JSON.parse(Buscar.responseText);
					formatearDatosBusqueda(Datos);
					$("#buscar").val(_datos);
					for(compDatos in busquedasRecientes){if(busquedasRecientes[compDatos]===_datos){compD=1;}}
					if(compD===0){busquedasRecientes.push(_datos);}
				}
				else{
					mensaje("No se han encontrado datos");
					$("#buscar").focus();
				}
			}
		}
	}
	else{
		mensaje("Escribe lo que quieres buscar");
		$("#buscar").focus();
	}
}
//función que formatea los datos, si los hay, de lo buscado creando los elementos HTML de forma dinamica
function formatearDatosBusqueda(_ArrayBusquedaDatos){
	while(document.getElementById("contenedor").hasChildNodes()){$("#contenedor").empty();}
	if(document.getElementById("volverDeBuscar")){$("#volverDeBuscar").remove();}
	for(var i in _ArrayBusquedaDatos){
		var tarjeta=document.createElement("div");
		tarjeta.setAttribute('class','tarjetas');
		tarjeta.setAttribute('onclick','verMas(this,"'+_ArrayBusquedaDatos[i].ID+'","contInfo'+i+'")');
		var hero=document.createElement("div");
		hero.setAttribute('class','heroImg');
		var img=document.createElement("img");
		img.setAttribute("alt",_ArrayBusquedaDatos[i].NOMBRE);
		if(_ArrayBusquedaDatos[i].IMAGEN!==""){img.setAttribute('src',_ArrayBusquedaDatos[i].IMAGEN);}
		else{img.setAttribute('src','imagenes/noDisp'+Math.floor((Math.random()*(5-1))+1)+'.jpg');}
		hero.appendChild(img);
		var info=document.createElement("div");
		info.setAttribute('class','info');
		info.setAttribute("id","contInfo"+i);
		var infoTitulo=document.createElement("span");
		infoTitulo.setAttribute('class','infoTitulo');
		infoTitulo.innerHTML=_ArrayBusquedaDatos[i].NOMBRE;
		var infoDatos=document.createElement("span");
		infoDatos.setAttribute('class','infoDatos');
		infoDatos.setAttribute('onclick','verEnMapa('+_ArrayBusquedaDatos[i].LAT+','+_ArrayBusquedaDatos[i].LONG+')');
		infoDatos.innerHTML=_ArrayBusquedaDatos[i].DIRECCION;
		var infoTipo=document.createElement("span");
		infoTipo.setAttribute('class','infoTipo');
		if(_ArrayBusquedaDatos[i].TENEDORES){infoTipo.innerHTML=_ArrayBusquedaDatos[i].TIPO+" - "+_ArrayBusquedaDatos[i].TENEDORES+" Tenedores";}
		else{infoTipo.innerHTML=_ArrayBusquedaDatos[i].TIPO;}
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
	$("#contenedor").css({'marginTop':'96px'});
	var nav=document.createElement("nav");
	nav.setAttribute("id","volverDeBuscar");
	nav.setAttribute("class","subheader");
	var button=document.createElement("button");
	button.setAttribute("id","VolverBuscar");
	button.className='mdl-button mdl-js-button mdl-js-ripple-effect';
	button.setAttribute("onclick","volverBuscar()");
	button.innerHTML="Volver";
	componentHandler.upgradeElement(button);
	nav.appendChild(button);
	$("body").append(nav);
	$("#cabecera").css({'background':'none','backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});
	if(document.getElementById("contDescp")){$("#contDescp").css({'display':'none'});}
	$("#contentRecentSearch").css({'display':'none'});
}