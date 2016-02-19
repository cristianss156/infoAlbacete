//función que crea el objeto ajax
function crearAjax(){
	var Ajax;
	if(window.XMLHttpRequest){Ajax=new XMLHttpRequest();}
	else{Ajax=new ActiveXObject("Microsoft.XMLHTTP");}
	return Ajax;
}
//función que soilicita todos los datos de la base de datos
function cargarDatos(){
	var Cargar=crearAjax();
	document.getElementById("titulo").innerHTML="Inicio";
	Cargar.open("POST","./php/operaciones.php?caso=1", true);
	Cargar.send();
	Cargar.onreadystatechange=function recibirTodosDatos(){
		if(Cargar.readyState===4 && Cargar.status===200){
			var ArrayDatos=JSON.parse(Cargar.responseText);
			formatearArrayDatos(ArrayDatos);
		}
	}
}
//función que se encarga de formatear los datos recibidos creando los elementos HTML de forma dinamica
function formatearArrayDatos(_ArrayDatos){
	$("#cabecera").css({'backgroundColor':'#9C27B0','boxShadow':'0 3px 5px rgba(0,0,0,0.26)'});
	$("#filtros").css({'display':'none'});
	while(document.getElementById("contenedor").hasChildNodes()){$("#contenedor").empty();}
	for(var i in _ArrayDatos){
		if(_ArrayDatos[i][1]!==undefined){
			var divSubHeader=document.createElement("div");
			divSubHeader.setAttribute("class","subheaderTitle");
			var titleCat=document.createElement("span");
			titleCat.setAttribute("class","textSubH");
			titleCat.innerHTML=_ArrayDatos[i][0];
			var botonSubH=document.createElement("button");
			botonSubH.className = 'masCat mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent';
			botonSubH.setAttribute('onclick','verCategoria("'+_ArrayDatos[i][0]+'"), reiComp(true)');
			botonSubH.innerHTML="Más";
			componentHandler.upgradeElement(botonSubH);
			divSubHeader.appendChild(titleCat);
			divSubHeader.appendChild(botonSubH);
			$("#contenedor").append(divSubHeader);
			for(var j=1;j<_ArrayDatos[i].length;j++){
				var tarjeta=document.createElement("div");
				tarjeta.setAttribute('class','tarjetas');
				tarjeta.setAttribute('onclick','verMas(this,"'+_ArrayDatos[i][j].ID+'","contInfo'+i+''+j+'")');
				var hero=document.createElement("div");
				hero.setAttribute('class','heroImg');
				var img=document.createElement("img");
				img.setAttribute("alt",_ArrayDatos[i][j].NOMBRE);
				if(_ArrayDatos[i][j].IMAGEN!==""){img.setAttribute('src',_ArrayDatos[i][j].IMAGEN);}
				else{img.setAttribute('src','imagenes/noDisp'+Math.floor((Math.random()*(5-1))+1)+'.jpg');}
				hero.appendChild(img);
				var info=document.createElement("div");
				info.setAttribute('class','info');
				info.setAttribute("id","contInfo"+i+""+j)
				var infoTitulo=document.createElement("span");
				infoTitulo.setAttribute('class','infoTitulo');
				infoTitulo.innerHTML=_ArrayDatos[i][j].NOMBRE;
				var infoDatos=document.createElement("span");
				infoDatos.setAttribute('class','infoDatos');
				infoDatos.setAttribute('onclick','verEnMapa('+_ArrayDatos[i][j].LAT+','+_ArrayDatos[i][j].LONG+')');
				infoDatos.innerHTML=_ArrayDatos[i][j].DIRECCION;
				var infoTipo=document.createElement("span");
				infoTipo.setAttribute('class','infoTipo');
				if(_ArrayDatos[i][j].TENEDORES){infoTipo.innerHTML=_ArrayDatos[i][j].TIPO+" - "+_ArrayDatos[i][j].TENEDORES+" Tenedores";}
				else{infoTipo.innerHTML=_ArrayDatos[i][j].TIPO;}
				var volver=document.createElement("button");
				volver.className='volver mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent';
				volver.setAttribute('onclick','cargarDatos(), reiComp(false)');
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
	$("#cabecera").css({'height':'56px','background':'none','backgroundColor':'#9C27B0'});
	if(document.getElementById("contDescp")){
		$("#contenedor").css({'marginTop':'0'});
		$("#contDescp").css({'display':'block'});
	}
	else{$("#contenedor").css({'marginTop':'56px'});}
}
//función que recibe los datos del formulario de sugerencias y los manda al servidor
function mandarCorreo(){
	var Correo=crearAjax();
	var datos={
			_de:email.value,
			_cuerpo:cuerpOpinion.value
		};
	var jsonstring=JSON.stringify(datos);
	Correo.open("POST","./php/operaciones.php?caso=6&datosCorreo="+jsonstring, true);
	Correo.send();
	Correo.onreadystatechange=function recibirCorreo(){
		if(Correo.readyState===4 && Correo.status===200){
			if(Correo.responseText==="bad"){men="Error al mandar la opinión";}
			else{
				men="Opinión enviada";
    			$("#contenedorOpinion").remove();
			}
			mensaje(men);
		}
	}
	return false;
}
//función que crea el formulario de inicio de sesión
function iniciarSesion(){
	var sec=document.createElement("section");
	sec.setAttribute("id","contIncSesion");
	var divcont=document.createElement("div");
	divcont.setAttribute("id","sesionDialog");
	var cab=document.createElement("div");
	cab.setAttribute("id","cabSesion");
	var span=document.createElement("span");
	span.innerHTML="Bienvenido a Info Albacete";
	cab.appendChild(span);
	divcont.appendChild(cab);
	var form=document.createElement("form");
	form.setAttribute("id","formSesion");
	form.setAttribute("onsubmit","return sesion()");
	var cEmail=document.createElement("div");
	cEmail.setAttribute("id","contEmail");
	var label=document.createElement("label");
	label.setAttribute("for","emailsesion");
	label.innerHTML="Email:";
	var br=document.createElement("br");
	var input=document.createElement("input");
	input.setAttribute("id","emailSesion");
	input.setAttribute("type","email");
	input.setAttribute("placeholder","Tu email");
	input.setAttribute("required","required");
	input.autofocus="true";
	cEmail.appendChild(label);
	cEmail.appendChild(br);
	cEmail.appendChild(input);
	var cPass=document.createElement("div");
	cPass.setAttribute("id","contPasswd");
	var label=document.createElement("label");
	label.setAttribute("for","password");
	label.innerHTML="Contraseña:";
	var br=document.createElement("br");
	var input=document.createElement("input");
	input.setAttribute("id","password");
	input.setAttribute("type","password");
	input.setAttribute("placeholder","Tu contraseña");
	input.setAttribute("required","required");
	cPass.appendChild(label);
	cPass.appendChild(br);
	cPass.appendChild(input);
	var iniciar=document.createElement("button");
	iniciar.setAttribute("id","iniciarSesion");
	iniciar.setAttribute("class","mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent");
	iniciar.innerHTML="Iniciar";
	componentHandler.upgradeElement(iniciar);
	var canc=document.createElement("button");
	canc.setAttribute("id","cancelarIncSesion");
	canc.setAttribute("class","mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--accent");
	canc.setAttribute("onclick","return cerrarSesion()");
	canc.innerHTML="Cancelar";
	componentHandler.upgradeElement(canc);
	form.appendChild(cEmail);
	form.appendChild(cPass);
	form.appendChild(iniciar);
	form.appendChild(canc);
	divcont.appendChild(form);
	sec.appendChild(divcont);
	$("body").append(sec);
}
//función que cierra la vnetana de inicio de sesión
function cerrarSesion(){
	$("#contIncSesion").remove();
	return false;
}
//función que comprueba si un usuario esta ya registrado en la base de datos
function sesion(){
	var Sesion=crearAjax();
	_email=emailSesion.value;
	_pass=sha1("'"+password.value+"'");
	Sesion.open("POST","./php/operaciones.php?caso=7&email="+_email, true);
	Sesion.send();
	Sesion.onreadystatechange=function recibirSesion(){
		if(Sesion.readyState===4 && Sesion.status===200){
			if(Sesion.responseText==="0"){
				codTemp=(Math.random()*1e32).toString(36);
				cambiarForm();
				enviarCodigo();
			}
			else{continuarSesion(_email,_pass);}
		}
	}
	return false;
}
//función que continua el proceso de inicio de sesión
function continuarSesion(_email,_pass){
	var ContSesion=crearAjax();
	ContSesion.open("POST","./php/operaciones.php?caso=73&email="+_email+"&passwd="+_pass, true);
	ContSesion.send();
	ContSesion.onreadystatechange=function recibirIniciar(){
		if(ContSesion.readyState===4 && ContSesion.status===200){
			if(ContSesion.responseText==="bad"){
				men="Error al iniciar sesión, cumprueba los datos";
				mensaje(men);
				$("#emailSesion").focus();
			}
			else if(ContSesion.responseText==="good"){
				$("#contIncSesion").remove();
				bienvenido(_email);
				var divUser=document.createElement("div");
				divUser.setAttribute("id","contUser");
				var divImg=document.createElement("div");
				divImg.setAttribute("id","imgUser");
				var imgUser=document.createElement("i");
				imgUser.setAttribute("class","material-icons");
				imgUser.innerHTML="account_circle";
				divImg.appendChild(imgUser);
				divUser.appendChild(divImg);
				var nUser=document.createElement("div");
				nUser.setAttribute("id","nameUser");
				var spanUser=document.createElement("span");
				spanUser.innerHTML=_email;
				nUser.appendChild(spanUser);
				divUser.appendChild(nUser);
				$("#drawerTitle").append(divUser);
				document.getElementById("opcionSesion").setAttribute("onclick","salirSesion()");
				document.getElementById("spanSesion").innerHTML="Cerrar sesión";
				var divOp=document.createElement("div");
				divOp.setAttribute("id","sitiosOption");
				divOp.setAttribute("class","itemOption");
				divOp.setAttribute("onclick","verMisSitios('"+_email+"'), reiComp(false)");
				var spanOp=document.createElement("span");
				spanOp.innerHTML="Mis sitios";
				divOp.appendChild(spanOp);
				$("#listOptions").append(divOp);
				_pass="";
				reiComp(false);
				verCategoria(cat);
			}
		}
	}
}
//función que comprueba si el codigo introducido es el mismo que el codigomandado por correo
function confirmCod(){
	_codIntro=introCod.value;
	if(_codIntro===codTemp){
		mensaje("Código corrrecto, procesando datos...");
		codTemp="";
		insertarUsuario(_email,_pass);
	}
	else{
		mensaje("Código incorrecto");
		$("#introCod").focus();
	}
	return false;
}
//función que cierra la sesión del usuario conectado en ese momento
function salirSesion(){
	mensaje("Cerrando sesión...");
	setTimeout(function(){location.reload();},500);
}
//función que envía el codigo por correo
function enviarCodigo(){
	alert(codTemp);
	// var Codigo=crearAjax();
	// Codigo.open("POST","./php/operaciones.php?caso=72&codigo="+codTemp+"&correo="+_email, true);
	// Codigo.send();
	// Codigo.onreadystatechange=function recibirCodCorreo(){
	// 	if(Codigo.readyState===4 && Codigo.status===200){
	// 		if(Codigo.responseText==="bad"){
	// 			men="Error al mandar el código";
	// 			mensaje(men);
	// 		}
	// 	}
	// }
}
//función que inserta a un nuevo usuario
function insertarUsuario(_email,_pass){
	var Usuario=crearAjax();
	Usuario.open("POST","./php/operaciones.php?caso=71&email="+_email+"&pass="+_pass, true);
	Usuario.send();
	Usuario.onreadystatechange=function recibirInsertar(){
		if(Usuario.readyState===4 && Usuario.status===200){
			if(Usuario.responseText==="good"){continuarSesion(_email,_pass);}
			else{mensaje("Opps, algo ha fallado");}
		}
	}
}