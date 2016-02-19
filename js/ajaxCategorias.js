var comp_cat="";
//función que vuelve al estado anterior al salir de los resultados de busqueda
function volverBuscar(){
	$("#buscar").val("");
	document.getElementById("imagen").innerHTML="menu";
	$("#imagen").attr("class","menu material-icons");
	$("#contenedorBuscar").css({'display':'none'});
	setTimeout(function(){$("#contenedorTitulo").css({'display':'block'});});
	$("#search").css({'display':'block'});
	$("#options").css({'display':'block'});
	$("#volverDeBuscar").remove();
	reiComp(false);
	verCategoria(cat);
}
//función que solicita al servidor los datos de una categoria concreta
function verCategoria(_categoria){
	scroll(0,0);
	if(_categoria==="null"){_categoria=cat;}
	if(_categoria==="Inicio"){
		cat=_categoria;
		cargarDatos();
	}
	else if(_categoria==="Mis sitios"){
		cat=_categoria;
		verMisSitios();
	}
	else{
		var Categoria=crearAjax();
		document.getElementById("titulo").innerHTML=capitalize(_categoria);
		cat=_categoria.toLowerCase();
		Categoria.open("POST","./php/operaciones.php?caso=3&categoria="+cat, true);
		Categoria.send();
		Categoria.onreadystatechange=function(){recibirCategoria(Categoria);}
		comp_cat=true;
	}
}
//función que solicita al servidor los distintos filtros da la categoria seleccionada
function sacarTipos(){
	var Tipos=crearAjax();
	Tipos.open("POST","./php/operaciones.php?caso=4&categoria="+cat, true);
	Tipos.send();
	Tipos.onreadystatechange=function recibirTipos(){
		if(Tipos.readyState===4 && Tipos.status===200){
			var ArrayFiltros=JSON.parse(Tipos.responseText);
			formatearArrayFiltros(ArrayFiltros);
		}
	}
}
//funcion busca en el servidor los datos de una categoria atendiendo al filtro establecido
function filtrarCat(_filtro){
	if($("#filtros").attr("class")==="active"){
		var Filtros=crearAjax();
		_filtro=_filtro.childNodes[0].innerHTML;
		Filtros.open("POST","./php/operaciones.php?caso=5&filtro="+_filtro+"&categoria="+cat, true);
		Filtros.send();
		Filtros.onreadystatechange=function(){recibirCategoria(Filtros);}
		comp_cat=false;
		scroll(0,0);
	}
}
//función que recibe los datos solicitados de la categoria seleccionada
function recibirCategoria(_objAjax){
	if(_objAjax.readyState===4 && _objAjax.status===200){
		if(_objAjax.responseText!=="null"){
			var ArrayDatosCat=JSON.parse(_objAjax.responseText);
			formatearArrayDatosCat(ArrayDatosCat);
		}
		else{
			$("#cabecera").css({'background':'none','backgroundColor':'#9C27B0','height':'56px','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});
			while(document.getElementById("contenedor").hasChildNodes()){$("#contenedor").empty();}
			while(document.getElementById("itemsFiltros").hasChildNodes()){$("#itemsFiltros").empty();}
			$("#filtros").css({'display':'none'});
			mensaje("No hay datos de esta categoria");
		}
	}
}
//función que formatea los datos de la categoria elegida creando los elementos HTML de forma dinamica
function formatearArrayDatosCat(_ArrayCat){
	$("#cabecera").css({'background':'none','backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});
	if(document.getElementById("contDescp")){$("#contDescp").css({'display':'none'});}
	while(document.getElementById("contenedor").hasChildNodes()){$("#contenedor").empty();}
	for(var i in _ArrayCat){
		if(_ArrayCat[i]!==null){
			var tarjeta=document.createElement("div");
			tarjeta.setAttribute('class','tarjetas');
			tarjeta.setAttribute('onclick','verMas(this,"'+_ArrayCat[i].ID+'","contInfo'+i+'")');
			var hero=document.createElement("div");
			hero.setAttribute('class','heroImg');
			var img=document.createElement("img");
			img.setAttribute("alt",_ArrayCat[i].NOMBRE);
			if(_ArrayCat[i].IMAGEN!==""){img.setAttribute('src',_ArrayCat[i].IMAGEN);}
			else{img.setAttribute('src','imagenes/noDisp'+Math.floor((Math.random()*(5-1))+1)+'.jpg');}
			hero.appendChild(img);
			var info=document.createElement("div");
			info.setAttribute('class','info');
			info.setAttribute("id","contInfo"+i);
			var infoTitulo=document.createElement("span");
			infoTitulo.setAttribute('class','infoTitulo');
			infoTitulo.innerHTML=_ArrayCat[i].NOMBRE;
			var infoDatos=document.createElement("span");
			infoDatos.setAttribute('class','infoDatos');
			infoDatos.setAttribute('onclick','verEnMapa('+_ArrayCat[i].LAT+','+_ArrayCat[i].LONG+')');
			infoDatos.innerHTML=_ArrayCat[i].DIRECCION;
			var infoTipo=document.createElement("span");
			infoTipo.setAttribute('class','infoTipo');
			if(_ArrayCat[i].TENEDORES){infoTipo.innerHTML=_ArrayCat[i].TIPO+" - "+_ArrayCat[i].TENEDORES+" Tenedores";}
			else{infoTipo.innerHTML=_ArrayCat[i].TIPO;}
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
	if(comp_cat){sacarTipos();}
}
//función que formatea los filtros de la categoria seleccionada creando los elementos HTML de forma dinamica
function formatearArrayFiltros(_arrayFiltros){
	while(document.getElementById("itemsFiltros").hasChildNodes()){$("#itemsFiltros").empty();}
	var itemTodo=document.createElement("div");
	itemTodo.setAttribute('name',"0");
	itemTodo.setAttribute('class','select_item');
	itemTodo.setAttribute('onclick','filtrar(this), filtrarCat(this)');
	var itemTodoTexto=document.createElement("span");
	itemTodoTexto.innerHTML="Todo";
	itemTodo.appendChild(itemTodoTexto);
	$("#itemsFiltros").append(itemTodo);
	var o=1;
	for(var i in _arrayFiltros){
		var item=document.createElement("div");
		item.setAttribute('name',o);
		item.setAttribute('class','select_item');
		item.setAttribute('onclick','filtrar(this), filtrarCat(this)');
		var itemTexto=document.createElement("span");
		itemTexto.innerHTML=_arrayFiltros[i].tipo;
		item.appendChild(itemTexto);
		$("#itemsFiltros").append(item);
		o++;
	}
	setTimeout(function(){$("#filtros").css({'display':'block'});},250);
	$("#cabecera").css({'height':'112px'});
	$("#contenedor").css({'marginTop':'112px'});
}
//función que pone la primera letra en mayuscula para el titulo de la cabecera de la aplicación
function capitalize(_s){return _s[0].toUpperCase() + _s.slice(1);}