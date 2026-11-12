const main = document.querySelector('main');
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[char]));
const code = (sql, label = 'SQL') => `<div class="codebox"><div class="codehead"><span>${label}</span><button type="button" data-copy>Copiar</button></div><pre><code>${escapeHtml(sql)}</code></pre></div>`;
const table = (cols, rows) => `<div class="tablewrap"><table><thead><tr>${cols.map(c=>`<th scope="col">${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${x===null?'<code>NULL</code>':escapeHtml(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const headings = {
 DDL:'Estructura de la base',DML:'Cambios en los datos',DQL:'Consultas de datos',
 DCL:'Permisos de acceso',TCL:'Control de transacciones',Utilidad:'Herramientas del motor'
};
const setup = [
 ['Descargá XAMPP para Windows','Abrí la página oficial de Apache Friends, elegí el instalador para Windows y ejecutalo. <a href="https://www.apachefriends.org/es/download.html">Descargar XAMPP</a>'],
 ['Instalá los componentes','Conservá Apache, MySQL, PHP y phpMyAdmin. Elegí una carpeta como <code>C:\\xampp</code> y terminá la instalación.'],
 ['Encendé Apache y MySQL','Abrí XAMPP Control Panel y presioná Start en Apache y en MySQL. Apache sirve phpMyAdmin. El módulo rotulado MySQL inicia el motor MariaDB incluido.'],
 ['Entrá a phpMyAdmin','Abrí <code>http://localhost/phpmyadmin/</code> en la PC con XAMPP. Podés llegar también con el botón Admin de la fila MySQL. En la pestaña SQL, ejecutá '+code('SELECT VERSION() AS version_motor;')+' para confirmar que responde.'],
 ['Importá la base de práctica','Descargá <a href="reproductor.sql" download>reproductor.sql</a>. En la pantalla principal de phpMyAdmin, abrí Importar, elegí el archivo y ejecutá la importación una sola vez. Luego seleccioná <code>reproductor_sql</code> en la barra izquierda y abrí SQL.']
];
function readStored(key, fallback) {
 try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
 catch { return fallback; }
}
function saveStored(key, value) {
 try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
let done = readStored('mysql-setup',[]);
let selected = 8, category = 'Todos', search = '';
const queries = commands.filter(c=>c.rows);
let queryIndex = 0;
let showJoinComparison = false;
function xampp() {
 main.innerHTML = `<h2>Instalación de XAMPP</h2><p class="intro">Prepará el servidor en Windows y verificá tu primera consulta. Marcá los pasos que completes.</p><div class="choices"><progress max="5" value="${done.length}" aria-label="Pasos completados"></progress><span id="progress-text">${done.length} de 5 completados</span></div>
 ${setup.map(([title,body],i)=>`<div class="box"><h3 style="margin-top:0">${i+1}. ${title}</h3><div>${body}</div><label class="check"><input type="checkbox" data-step="${i}" ${done.includes(i)?'checked':''}> Completado</label></div>`).join('')}
 <h3>Si algo falla</h3><details><summary>Apache no arranca</summary><p>Revisá el mensaje del panel y el registro de Apache. Si el puerto HTTP 80 está ocupado, identificá el servicio que lo usa o elegí otro puerto en la configuración. Si usás 8080, abrí <code>http://localhost:8080/phpmyadmin/</code>.</p></details>
 <details><summary>MySQL no arranca</summary><p>Revisá el registro del módulo. Si el puerto 3306 está ocupado, comprobá si ya hay un servicio MySQL o MariaDB ejecutándose. Si cambiás el puerto, ajustá también la conexión de phpMyAdmin y de tus aplicaciones.</p></details>
 <details><summary>phpMyAdmin abre, pero da error de conexión</summary><p>Confirmá que el módulo MySQL esté en ejecución y que phpMyAdmin use el host, puerto y credenciales de tu instalación.</p></details>
 <div class="callout">XAMPP está pensado para desarrollo local. Para esta práctica, usá la base <code>reproductor_sql</code>.</div><a href="#introduccion">Continuar a Introducción →</a>`;
}
function intro(){
 main.innerHTML = `<h2>Introducción a SQL</h2><p class="intro">SQL es el lenguaje que usamos para definir estructuras, consultar y modificar datos en una base relacional. MySQL y MariaDB son motores que interpretan ese lenguaje. phpMyAdmin es la interfaz web desde la que vamos a enviar las sentencias.</p>
 <h3>La base del reproductor</h3>${table(['Tabla','Qué guarda','Claves'],[
 ['usuario','Personas que crean listas','id_usuario (PK)'],['cancion','Título, artista y duración en segundos','id_cancion (PK)'],['lista','Listas de cada usuario','id_lista (PK), id_usuario (FK)'],['lista_cancion','Qué canciones pertenecen a cada lista','id_lista + id_cancion (PK compuesta y dos FK)']
 ])}<p>Una clave primaria identifica una fila. Una clave foránea referencia una fila de otra tabla. Un usuario puede tener varias listas y cada lista puede incluir varias canciones. La tabla puente permite que una misma canción figure en distintas listas.</p>
 <a class="cta" href="reproductor.sql" download>Descargar reproductor.sql ↓</a>
 <h3>Tu primera consulta</h3>${code('USE reproductor_sql;\n\nSELECT titulo, artista\nFROM cancion\nWHERE duracion_seg >= 200\nORDER BY titulo;')}
 ${table(['Parte','Qué indica'],[['SELECT','Qué columnas mostrar'],['FROM','De qué tabla salen'],['WHERE','Qué filas cumplen la condición'],['ORDER BY','En qué orden mostrar el resultado']])}
 <p>Terminá cada sentencia con punto y coma. Usá comillas simples para textos como <code>'Sur'</code>. <code>NULL</code> indica ausencia de valor y se comprueba con <code>IS NULL</code>.</p>
 <h3>Familias de sentencias</h3>${table(['Familia','Para qué se usa','Ejemplos'],[['DDL','Definir estructuras','CREATE, ALTER, DROP'],['DML','Modificar filas','INSERT, UPDATE, DELETE'],['DQL','Consultar datos','SELECT'],['DCL','Administrar permisos','GRANT, REVOKE'],['TCL','Controlar transacciones','COMMIT, ROLLBACK']])}<p class="intro">DQL es una separación didáctica para las consultas. Algunas referencias agrupan SELECT dentro de DML.</p><a href="#comandos">Explorar comandos →</a>`;
}
function catalog() {
 main.innerHTML = `<h2>Catálogo de comandos</h2><div class="workspace"><aside class="sidebar"><label for="search">Buscar comando</label><input id="search" type="search" placeholder="Ej. JOIN, WHERE" value="${escapeHtml(search)}"><div class="filter" aria-label="Filtrar por familia">${['Todos',...Object.keys(headings)].map(c=>`<button type="button" data-filter="${c}" aria-pressed="${c===category}">${c}</button>`).join('')}</div><button class="item join-entry" type="button" data-join-entry>Comparar JOIN</button><div id="catalog" class="catalog"></div></aside><article id="command-detail" aria-live="polite"></article></div>`;
 renderList();
}
function renderList() {
 document.querySelector('[data-join-entry]').setAttribute('aria-pressed',showJoinComparison);
 const filtered = commands.map((c,i)=>({c,i})).filter(({c})=>(category==='Todos'||c.cat===category)&&`${c.name} ${c.description}`.toLowerCase().includes(search.trim().toLowerCase()));
 if (filtered.length && !filtered.some(({i})=>i===selected)) selected=filtered[0].i;
 document.querySelector('#catalog').innerHTML = filtered.map(({c,i})=>`<button class="item" data-command="${i}" aria-pressed="${!showJoinComparison && i===selected}">${escapeHtml(c.name)}</button>`).join('');
 if(showJoinComparison){ joins(); return; }
 const c=commands[selected];
 document.querySelector('#command-detail').innerHTML=filtered.length?`<p class="eyebrow">${c.cat} · ${headings[c.cat]}</p><h2>${escapeHtml(c.name)}</h2><p>${escapeHtml(c.description)}</p>${code(c.sql)}${c.rows?`<h3>Resultado con los datos iniciales</h3>${table(c.columns,c.rows)}`:`<p class="intro">Ejecutá el ejemplo en la pestaña SQL de phpMyAdmin. Usá una base de práctica y revisá el efecto antes de continuar.</p>`}`:'<p>No encontramos comandos para esa búsqueda.</p>';
}
function lab() {
 const c=queries[queryIndex];
 main.innerHTML=`<h2>Consultas y resultados</h2><p class="intro">Elegí una consulta y compará la sentencia con la tabla que produce sobre los datos iniciales. Para cambiar el SQL y ejecutarlo, copiá el ejemplo a phpMyAdmin.</p><div class="choices"><label for="query">Consulta</label><select id="query">${queries.map((q,i)=>`<option value="${i}" ${i===queryIndex?'selected':''}>${escapeHtml(q.name)}</option>`).join('')}</select></div>${code(c.sql)}<h3>Resultado esperado · ${c.rows.length} filas</h3>${table(c.columns,c.rows)}<div class="callout">Los resultados son ejemplos calculados con el conjunto inicial de datos. Si agregás o modificás canciones, el resultado en tu base puede cambiar.</div><a href="#ejercicios">Ir a los ejercicios →</a>`;
}
function practice() {
 main.innerHTML=`<h2>10 ejercicios SQL</h2><p class="intro">Importá <a href="reproductor.sql" download>la base de práctica</a> y resolvé cada consigna desde la pestaña SQL de phpMyAdmin. Desplegá la pista o la solución después de intentarlo.</p>${exercises.map(([task,name,hint],i)=>{const c=commands.find(x=>x.name===name);return `<div class="box"><h3 style="margin-top:0">${i+1}. ${task}</h3><details><summary>Ver pista</summary><p>${hint}</p></details><details><summary>Ver solución y resultado</summary>${code(c.sql)}${table(c.columns,c.rows)}</details></div>`;}).join('')}`;
}
const joinModes = {
 'INNER JOIN': {description:'Conserva las filas con coincidencia en las dos tablas.', rows:[['Ana','SQL']]},
 'LEFT JOIN': {description:'Conserva a todos los alumnos. Si un alumno no tiene inscripción, el curso aparece como NULL.', rows:[['Ana','SQL'],['Luis',null]]},
 'RIGHT JOIN': {description:'Conserva todas las inscripciones. Si una inscripción no tiene alumno en los datos de ejemplo, el nombre aparece como NULL.', rows:[['Ana','SQL'],[null,'Java']]}
};
let joinMode = 'INNER JOIN';
function joins() {
 const example = joinModes[joinMode];
 const statement = 'WITH alumno AS (\n    SELECT 1 AS id_alumno, \'Ana\' AS nombre\n    UNION ALL SELECT 2, \'Luis\'\n), inscripcion AS (\n    SELECT 1 AS id_alumno, \'SQL\' AS curso\n    UNION ALL SELECT 3, \'Java\'\n)\nSELECT a.nombre, i.curso\nFROM alumno AS a\n' + joinMode + ' inscripcion AS i\n    ON a.id_alumno = i.id_alumno\nORDER BY COALESCE(a.id_alumno, i.id_alumno);';
 const demos = commands.filter(c => ['INNER JOIN','LEFT JOIN','RIGHT JOIN','IS NULL'].includes(c.name));
 document.querySelector('#command-detail').innerHTML = `<h2>Combiná tablas con JOIN</h2>
 <p class="intro">La condición <code>ON</code> indica cómo se relacionan las filas. Cambiá el tipo de JOIN para ver qué pasa cuando un identificador no tiene coincidencia.</p>
 <div class="join-grid"><div><h3>Izquierda · alumno</h3>${table(['id_alumno','nombre'],[[1,'Ana'],[2,'Luis']])}</div><div><h3>Derecha · inscripcion</h3>${table(['id_alumno','curso'],[[1,'SQL'],[3,'Java']])}</div></div>
 <p class="intro">El ID 1 coincide. El 2 aparece solo a la izquierda y el 3 solo a la derecha. Son tablas temporales de ejemplo definidas con <code>WITH</code>, sin claves foráneas.</p>
 <div class="filter" aria-label="Tipo de JOIN">${Object.keys(joinModes).map(name=>`<button type="button" data-join="${name}" aria-pressed="${name===joinMode}">${name}</button>`).join('')}</div>
 <div aria-live="polite"><p>${example.description}</p>${table(['nombre','curso'],example.rows)}</div>
 <details><summary>Ver consulta completa para copiar a phpMyAdmin</summary>${code(statement)}</details>
 <h3>Probalo en el reproductor musical</h3>
 <p>Importá <a href="reproductor.sql" download>reproductor.sql</a> y seleccioná <code>reproductor_sql</code> antes de ejecutar estas consultas.</p>
 ${demos.map(c=>`<details><summary>${c.name==='IS NULL'?'LEFT JOIN + IS NULL · canciones sin lista':c.name}</summary><p>${escapeHtml(c.description)}</p>${code(c.sql)}${table(c.columns,c.rows)}</details>`).join('')}
 <a href="#ejercicios">Practicar con los ejercicios 7 a 10 →</a>`;
}
const views={xampp,introduccion:intro,comandos:catalog,laboratorio:lab,ejercicios:practice};
function route(){
 let key=location.hash.slice(1);
 if(key==='joins'){
  history.replaceState(null,'','#comandos');
  key='comandos';
  showJoinComparison=true;
 }
 const current=Object.hasOwn(views,key)?key:'xampp';
 views[current]();
 document.querySelectorAll('nav a').forEach(a=>a.hash==='#'+current?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
 if(key===current) main.scrollIntoView();
}
window.addEventListener('hashchange',route);
main.addEventListener('input',e=>{if(e.target.id==='search'){search=e.target.value;showJoinComparison=false;renderList();}});
main.addEventListener('change',e=>{
 if(e.target.id==='query'){queryIndex=Number(e.target.value);lab();document.querySelector('#query').focus();}
 if(e.target.matches('[data-step]')){
  const n=Number(e.target.dataset.step);
  done=e.target.checked?[...new Set([...done,n])]:done.filter(x=>x!==n);
  saveStored('mysql-setup',done);
  main.querySelector('progress').value=done.length;
  document.querySelector('#progress-text').textContent=done.length+' de 5 completados';
 }
});
main.addEventListener('click',async e=>{
 const b=e.target.closest('button');
 if(!b)return;
 if(b.matches('[data-join-entry]')){
  showJoinComparison=true;
  renderList();
 }
 if(b.matches('[data-join]')){
  joinMode=b.dataset.join;
  joins();
  main.querySelector('[data-join="'+joinMode+'"]').focus();
 }
 if(b.matches('[data-filter]')){
  showJoinComparison=false;
  category=b.dataset.filter;
  main.querySelectorAll('[data-filter]').forEach(f=>f.setAttribute('aria-pressed',f===b));
  renderList();
 }
 if(b.matches('[data-command]')){
  showJoinComparison=false;
  selected=Number(b.dataset.command);
  renderList();
  main.querySelector('[data-command="'+selected+'"]').focus();
 }
 if(b.matches('[data-copy]')){
  const snippet=b.closest('.codebox').querySelector('code');
  try { await navigator.clipboard.writeText(snippet.textContent); b.textContent='Copiado'; }
  catch { const range=document.createRange();range.selectNodeContents(snippet);const sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);b.textContent='Seleccionado · Ctrl+C'; }
  setTimeout(()=>b.textContent='Copiar',2200);
 }
});
route();
