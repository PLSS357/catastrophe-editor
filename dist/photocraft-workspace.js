/** PhotoCraft-inspired docked workspace. Keeps the existing document schema. */
export function installPhotoWorkspace(E){
 const $=s=>document.querySelector(s);
 const storageKey='catastrophe-workspace-v1';
 let prefs={left:true,right:true,layers:true,width:285,rulers:true};
 try{prefs={...prefs,...JSON.parse(localStorage.getItem(storageKey)||'{}')};}catch{}
 const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(prefs));}catch{}};
 const perform=selector=>{const target=$(selector);if(target&&!target.disabled)target.click();};
 const pro=action=>document.dispatchEvent(new CustomEvent('studio-command',{detail:action}));
 const editorCommand=action=>document.dispatchEvent(new CustomEvent('photo-workspace-command',{detail:action}));
 const menus=[
 ['Arquivo',[['Nova ficha',()=>perform('#startNewBtn')],['Abrir minhas fichas',()=>perform('[data-view="library"]')],['Importar JSON',()=>perform('#importBtn')],['Salvar agora',()=>perform('[data-pro="save-now"]')],['Versões',()=>perform('[data-pro="versions"]')],['Exportar',()=>perform('#exportBtn')]]],
 ['Editar',[['Desfazer',()=>perform('#undoBtn')],['Refazer',()=>perform('#redoBtn')],['Duplicar elemento',()=>editorCommand('duplicate-block')],['Excluir elemento',()=>editorCommand('delete-block')],['Agrupar seleção',()=>perform('#groupBtn')],['Desagrupar seleção',()=>perform('#ungroupBtn')]]],
 ['Inserir',[['Novo bloco',()=>editorCommand('add-block')],['Texto, formas e imagens',()=>pro('content')],['Dado vinculado',()=>pro('linked')],['Biblioteca de elementos',()=>perform('[data-pro="library"]')]]],
 ['Camadas',[['Mostrar painel de camadas',()=>{prefs.right=true;prefs.layers=true;apply();}],['Trazer para frente',()=>editorCommand('front')],['Enviar para trás',()=>editorCommand('back')],['Duplicar',()=>editorCommand('duplicate-block')]]],
 ['Exibir',[['Ajustar página',()=>pro('fit-page')],['Ajustar largura',()=>pro('fit-width')],['Focar seleção',()=>pro('focus-selection')],['Alternar réguas',()=>{prefs.rulers=!prefs.rulers;apply();}],['Modo de foco',()=>pro('focus')],['Visualizar ficha',()=>perform('#playMode')],['Editar ficha',()=>perform('#editMode')]]],
 ['Janela',[['Dados do personagem',()=>{prefs.left=true;apply();perform('[data-view="character"]');}],['Blocos e layout',()=>{prefs.left=true;apply();perform('[data-view="layout"]');}],['Mostrar/ocultar painel esquerdo',()=>{prefs.left=!prefs.left;apply();}],['Mostrar/ocultar painel direito',()=>{prefs.right=!prefs.right;apply();}],['Restaurar painéis',()=>{prefs={left:true,right:true,layers:true,width:285,rulers:true};apply();}]]],
 ['Ajuda',[['Como usar',()=>perform('#helpBtn')]]]
 ];
 const top=$('.topbar');const menu=document.createElement('nav');menu.id='photoMenu';menu.className='photo-menu';menu.setAttribute('aria-label','Menu do editor');
 menu.innerHTML=menus.map(([name,actions],i)=>`<div class="photo-menu-item"><button type="button" class="photo-menu-trigger" data-menu="${i}" aria-expanded="false" aria-haspopup="true">${name}</button><div class="photo-menu-dropdown" hidden>${actions.map(([label],j)=>`<button type="button" data-menu-action="${i}:${j}">${label}</button>`).join('')}</div></div>`).join('');
 top.insertBefore(menu,$('.document-title'));
 function closeMenus(){menu.querySelectorAll('.photo-menu-dropdown').forEach(d=>d.hidden=true);menu.querySelectorAll('.photo-menu-trigger').forEach(b=>b.setAttribute('aria-expanded','false'));}
 menu.addEventListener('click',e=>{const trigger=e.target.closest('[data-menu]');if(trigger){const popup=trigger.nextElementSibling,was=popup.hidden;closeMenus();popup.hidden=!was;trigger.setAttribute('aria-expanded',String(was));return;}const b=e.target.closest('[data-menu-action]');if(!b)return;const [i,j]=b.dataset.menuAction.split(':').map(Number);closeMenus();menus[i][1][j][1]();});
 document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target))closeMenus();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenus();});
 const brand=$('.brand');brand.title='Catastrophe · editor de fichas';
 const rail=$('.rail');const originalRailButtons=[...rail.querySelectorAll('[data-view],#helpBtn')];rail.innerHTML=`<div class="photo-rail-main" aria-label="Ferramentas de edição"><button class="photo-tool active" data-photo-tool="select" title="Selecionar (V)" aria-label="Selecionar">↖</button><button class="photo-tool" data-photo-tool="hand" title="Mover tela (segure espaço e arraste)" aria-label="Mover tela">✋</button><button class="photo-tool" data-photo-tool="zoom" title="Zoom e ajustes" aria-label="Zoom">⌕</button><span class="rail-separator"></span><button class="photo-tool" data-photo-tool="text" title="Inserir texto" aria-label="Inserir texto">T</button><button class="photo-tool" data-photo-tool="image" title="Inserir imagem" aria-label="Inserir imagem">▧</button><button class="photo-tool" data-photo-tool="elements" title="Inserir formas e elementos" aria-label="Inserir elementos">▢</button><button class="photo-tool" data-photo-tool="data" title="Inserir dado vinculado" aria-label="Dado vinculado">◇</button><span class="rail-separator"></span><button class="photo-tool" data-photo-tool="guides" title="Guias e alinhamento" aria-label="Guias">⌗</button></div><div class="photo-rail-bottom"><button class="photo-tool" id="photoLeftToggle" title="Mostrar ou ocultar painel esquerdo" aria-label="Alternar painel esquerdo">☷</button><button class="photo-tool" id="photoRightToggle" title="Mostrar ou ocultar painel direito" aria-label="Alternar painel direito">◫</button><button class="photo-tool" id="photoHelp" title="Ajuda" aria-label="Ajuda">?</button></div>`;
 const views=document.createElement('div');views.className='photo-view-switch';views.setAttribute('aria-label','Área lateral');
 views.innerHTML='<button type="button" class="photo-view active" data-photo-view="character">Personagem</button><button type="button" class="photo-view" data-photo-view="library">Fichas</button><button type="button" class="photo-view" data-photo-view="layout">Layout</button><button type="button" class="photo-view" data-photo-view="elements">Elementos</button>';
 const left=$('#leftPanel');left.insertBefore(views,left.querySelector('.panel-heading'));
 const legacy=document.createElement('div');legacy.hidden=true;legacy.append(...originalRailButtons);left.append(legacy);
 views.addEventListener('click',e=>{const b=e.target.closest('[data-photo-view]');if(!b)return;if(b.dataset.photoView==='elements')perform('[data-pro="library"]');else perform(`[data-view="${b.dataset.photoView}"]`);views.querySelectorAll('button').forEach(x=>x.classList.toggle('active',x===b));});
 const inspector=$('#inspector');const resize=document.createElement('div');resize.className='photo-resize';resize.title='Arraste para ajustar a largura do painel';inspector.prepend(resize);
 const dock=document.createElement('section');dock.id='photoLayersDock';dock.className='photo-layers-dock';dock.innerHTML='<div class="photo-dock-head"><strong>CAMADAS</strong><button id="photoLayersToggle" title="Recolher ou expandir camadas" aria-expanded="true">⌄</button></div><div id="photoLayersContent" class="photo-layers-content"></div>';inspector.append(dock);
 const toolbar=$('.studio-toolbar:not(.composition-tools)');
 const contextual=document.createElement('div');contextual.id='photoContext';contextual.className='photo-context';contextual.innerHTML='<span class="photo-context-mode">SELEÇÃO</span><span id="photoContextLabel">Nenhum elemento selecionado</span><div id="photoContextFields" class="photo-context-fields"></div><div class="photo-context-actions"><button data-photo-direct="duplicate-block" title="Duplicar camada">Duplicar</button><button data-photo-direct="front" title="Trazer à frente">↑</button><button data-photo-direct="back" title="Enviar para trás">↓</button></div>';toolbar.after(contextual);
 function refresh(){const content=$('#inspectorContent'),layers=[...content.children].find(n=>n.classList.contains('section')&&n.querySelector('.section-title')?.textContent.includes('Camadas'));if(layers){const place=$('#photoLayersContent');place.replaceChildren(layers);}
  const block=E.getBlock();$('#photoContextLabel').textContent=block?(block.layerName||block.title||'Elemento'):'Nenhum elemento selecionado';
  const fields=$('#photoContextFields');const editing=document.activeElement?.closest('#photoContextFields');if(!editing){fields.innerHTML=block?['x','y','w','h'].map((k,i)=>`<label>${['X','Y','L','A'][i]}<input data-photo-field="${k}" type="number" step="1" ${i>1?'min="25"':''} value="${Math.round(block[k]||0)}" ${block.locked?'disabled':''}></label>`).join(''):'<span class="photo-context-placeholder">Clique em um elemento da ficha para editar.</span>';}
  contextual.classList.toggle('has-selection',!!block);$('#photoLayersDock').classList.toggle('is-collapsed',!prefs.layers);$('#photoLayersToggle').setAttribute('aria-expanded',String(prefs.layers));
  const view=$('.photo-view-switch');const old=document.querySelector('.rail-btn[data-view].active');if(old){view.querySelectorAll('.photo-view').forEach(b=>b.classList.toggle('active',b.dataset.photoView===old.dataset.view));}
 }
 contextual.addEventListener('change',e=>{const field=e.target.closest('[data-photo-field]');if(!field)return;const b=E.getBlock();if(!b||b.locked)return;const key=field.dataset.photoField;let value=Number(field.value);if(!Number.isFinite(value))return;value=Math.max(['w','h'].includes(key)?25:-500,Math.min(4000,value));E.change(()=>{b[key]=value;},true,true);});
 contextual.addEventListener('click',e=>{const button=e.target.closest('[data-photo-direct]');if(button)editorCommand(button.dataset.photoDirect);});
 document.addEventListener('photo-workspace-command',e=>{const action=e.detail,el=document.createElement('button');el.dataset.action=action;el.hidden=true;document.body.append(el);el.click();el.remove();});
 rail.addEventListener('click',e=>{const b=e.target.closest('[data-photo-tool]');if(!b)return;const type=b.dataset.photoTool;
  if(type==='select'){$('.photo-tool.active')?.classList.remove('active');b.classList.add('active');return;}
  if(type==='hand'){E.toast('Para mover o canvas: segure Espaço e arraste, ou use a rolagem.');return;}
  if(type==='zoom'){pro('fit-width');return;}
  if(type==='text'||type==='image'||type==='elements'){editorCommand('add-block');return;}
  if(type==='data'){pro('linked');return;}
  if(type==='guides'){perform('[data-pro="guides"]');return;}
 });
 $('#photoLeftToggle').onclick=()=>{prefs.left=!prefs.left;apply();};$('#photoRightToggle').onclick=()=>{prefs.right=!prefs.right;apply();};$('#photoHelp').onclick=()=>perform('#helpBtn');
 $('#photoLayersToggle').onclick=()=>{prefs.layers=!prefs.layers;apply();};
 let start=null;resize.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,w:prefs.width};resize.setPointerCapture(e.pointerId);e.preventDefault();});
 resize.addEventListener('pointermove',e=>{if(!start)return;prefs.width=Math.max(240,Math.min(450,start.w+start.x-e.clientX));apply(false);});
 function finish(){if(!start)return;start=null;save();E.fit();}resize.addEventListener('pointerup',finish);resize.addEventListener('lostpointercapture',finish);
 function apply(refit=true){document.body.classList.toggle('photo-no-left',!prefs.left);document.body.classList.toggle('photo-no-right',!prefs.right);document.body.classList.toggle('photo-no-rulers',!prefs.rulers);document.documentElement.style.setProperty('--photo-inspector-width',prefs.width+'px');dock.classList.toggle('is-collapsed',!prefs.layers);$('#photoLayersToggle').setAttribute('aria-expanded',String(prefs.layers));save();if(refit)requestAnimationFrame(()=>E.fit());}
 document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.key.toLowerCase()==='v'){$('[data-photo-tool="select"]')?.click();}});
 apply(false);return {refresh,apply};
}
