(() => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const STORAGE_KEY = 'mamanSoloDemoV1';
  const today = new Date();
  const future = (days) => { const d = new Date(); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); };
  const sampleOutings = [
    {id:'demo1',title:'Pique-nique et jeux au parc',activity:'Pique-nique',area:'Exemple : centre-ville',date:future(4),time:'10:00',spots:6,joined:2,kids:true,description:'Une rencontre tranquille en lieu public. Chacune peut apporter son goûter.',sample:true,distance:4},
    {id:'demo2',title:'Petite promenade en famille',activity:'Promenade',area:'Exemple : quartier voisin',date:future(6),time:'09:30',spots:5,joined:1,kids:true,description:'Balade facile, rythme adapté aux enfants. Vérifier la météo avant de partir.',sample:true,distance:8},
    {id:'demo3',title:'Atelier créatif partagé',activity:'Loisirs créatifs',area:'Exemple : salle associative',date:future(8),time:'14:00',spots:4,joined:2,kids:true,description:'Apporter si possible du papier et quelques crayons. Lieu réel à confirmer par l’organisateur.',sample:true,distance:12},
    {id:'demo4',title:'Jeux au parc et goûter',activity:'Jeux au parc',area:'Exemple : parc public',date:future(10),time:'15:00',spots:8,joined:3,kids:true,description:'Une idée de sortie gratuite pour faire connaissance en groupe.',sample:true,distance:17},
    {id:'demo5',title:'Découverte culturelle en famille',activity:'Culture',area:'Exemple : médiathèque',date:future(12),time:'10:30',spots:5,joined:1,kids:true,description:'Consulter les horaires et conditions d’accueil du lieu avant de vous déplacer.',sample:true,distance:19}
  ];
  let state = loadState();
  function loadState(){
    try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); return {outings:Array.isArray(saved.outings)?saved.outings:[], joined:Array.isArray(saved.joined)?saved.joined:[], tasks:Array.isArray(saved.tasks)?saved.tasks:[]}; }
    catch(e){ return {outings:[],joined:[],tasks:[]}; }
  }
  function save(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) { showToast('Le navigateur ne permet pas de sauvegarder ces changements.'); } }
  function esc(value){ return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function showToast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); window.setTimeout(()=>t.classList.remove('show'),3000); }
  function dateLabel(date){ if(!date) return 'Date à confirmer'; const d=new Date(date+'T12:00:00'); return new Intl.DateTimeFormat('fr-FR',{weekday:'short',day:'numeric',month:'short'}).format(d); }
  function allOutings(){ return [...state.outings,...sampleOutings]; }
  function renderOutings(){
    const activity=$('#activityFilter').value;
    const area=$('#areaFilter').value.trim().toLocaleLowerCase('fr-FR');
    const maxDistance=Number($('#distanceFilter').value);
    const items=allOutings().filter(o => (activity==='all'||o.activity===activity) && (!area||o.area.toLocaleLowerCase('fr-FR').includes(area)) && (o.distance===undefined || o.distance<=maxDistance));
    $('#outingList').innerHTML=items.map(o=>{
      const joined=state.joined.includes(o.id);
      const full=o.joined>=o.spots;
      return `<article class="outing-card">
        <div class="outing-top"><span class="tag">${esc(o.activity)}</span><span class="tag ${o.sample?'sample':''}">${o.sample?'Exemple':'Proposition locale'}</span></div>
        <h3>${esc(o.title)}</h3>
        <div class="outing-meta"><span>📅 ${esc(dateLabel(o.date))} · ${esc(o.time)}</span><span>📍 ${esc(o.area)}</span><span>${o.kids?'👧 Enfants bienvenus':'👩 Sortie entre adultes'}</span><span>🧭 ${o.distance===undefined?'Distance non calculée':o.distance+' km (indicatif)'}</span></div>
        <p>${esc(o.description||'Une sortie à partager dans un lieu public.')}</p>
        <div class="outing-footer"><span class="spots">${Math.max(0,o.spots-o.joined)} place(s) · ${o.joined} participante(s)</span>
        <button class="button ${joined?'secondary':'primary'} join-button" data-id="${esc(o.id)}" ${full&&!joined?'disabled':''}>${joined?'Annuler':'Demander à rejoindre'}</button></div>
      </article>`;
    }).join('');
    $('#emptyState').classList.toggle('hidden',items.length>0);
    $$('.join-button').forEach(b=>b.addEventListener('click',()=>toggleJoin(b.dataset.id)));
  }
  function toggleJoin(id){
    const outing=allOutings().find(o=>o.id===id);
    if(!outing)return;
    if(outing.sample){showToast('Sortie d’exemple : aucune demande n’est envoyée.');return;}
    if(state.joined.includes(id)){state.joined=state.joined.filter(x=>x!==id);outing.joined=Math.max(0,outing.joined-1);showToast('Participation annulée sur cet appareil.');}
    else { if(outing.joined>=outing.spots){showToast('Il n’y a plus de place dans cette démo.');return;} state.joined.push(id); outing.joined++; showToast('Demande ajoutée dans cette démo, sans notification à l’organisatrice.');}
    const local=state.outings.find(o=>o.id===id); if(local)local.joined=outing.joined;
    save();renderOutings();
  }
  $('#showCreate').addEventListener('click',()=>{$('#createPanel').classList.remove('hidden');$('#createPanel').scrollIntoView({behavior:'smooth',block:'start'});});
  function closeCreate(){$('#createPanel').classList.add('hidden');}
  $('#closeCreate').addEventListener('click',closeCreate);$('#cancelCreate').addEventListener('click',closeCreate);
  $('#outingForm').addEventListener('submit',e=>{
    e.preventDefault();const f=new FormData(e.currentTarget);
    const date=f.get('date');
    if(date<future(0)){showToast('Choisis une date à venir.');return;}
    const o={id:'local'+Date.now(),title:f.get('title').trim(),activity:f.get('activity'),area:f.get('area').trim(),date,time:f.get('time'),spots:Number(f.get('spots')),joined:0,kids:f.get('kids')==='on',description:f.get('description').trim(),sample:false,distance:undefined};
    if(!o.title||!o.area){showToast('Complète le titre et le secteur.');return;}
    state.outings.unshift(o);save();e.currentTarget.reset();e.currentTarget.querySelector('[name="spots"]').value=5;e.currentTarget.querySelector('[name="kids"]').checked=true;closeCreate();renderOutings();showToast('Sortie ajoutée à la démo sur cet appareil.');
  });
  ['activityFilter','areaFilter','distanceFilter'].forEach(id=>$('#'+id).addEventListener(id==='areaFilter'?'input':'change',renderOutings));
  const tips=['Prépare une petite chose pour demain, puis arrête-toi là.','Regarde les activités gratuites de ta commune.','Prends cinq minutes pour respirer ou t’étirer si cela te convient.','Demande de l’aide pour une tâche précise à une personne de confiance.','Note une dépense à venir pour éviter une surprise.'];
  $('#newTip').addEventListener('click',()=>{$('#tipOutput').textContent=tips[Math.floor(Math.random()*tips.length)];});
  function renderTasks(){
    $('#taskList').innerHTML=state.tasks.map(t=>`<li class="${t.done?'task-done':''}"><input type="checkbox" data-task="${esc(t.id)}" ${t.done?'checked':''} aria-label="Marquer la tâche terminée"><span>${esc(t.text)}</span><button class="task-remove" data-remove="${esc(t.id)}" aria-label="Supprimer la tâche">✕</button></li>`).join('');
    $$('#taskList input[data-task]').forEach(el=>el.addEventListener('change',()=>{const t=state.tasks.find(x=>x.id===el.dataset.task);if(t)t.done=el.checked;save();renderTasks();}));
    $$('#taskList button[data-remove]').forEach(el=>el.addEventListener('click',()=>{state.tasks=state.tasks.filter(x=>x.id!==el.dataset.remove);save();renderTasks();}));
  }
  $('#taskForm').addEventListener('submit',e=>{e.preventDefault();const text=$('#taskInput').value.trim();if(!text)return;state.tasks.push({id:'t'+Date.now(),text,done:false});$('#taskInput').value='';save();renderTasks();});
  $('#calculateBudget').addEventListener('click',()=>{
    const income=Number($('#income').value||0),expenses=Number($('#expenses').value||0);
    if(income<0||expenses<0){$('#budgetResult').textContent='Les montants doivent être positifs.';return;}
    const balance=income-expenses;const formatted=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(balance);
    $('#budgetResult').textContent=balance>=0?`Reste estimé : ${formatted}. Pense à garder une marge pour les dépenses imprévues.`:`Écart estimé : ${formatted}. Tu peux consulter les organismes officiels pour vérifier les aides et accompagnements possibles.`;
  });
  $('#menuToggle').addEventListener('click',()=>{const nav=$('#mainNav');const open=nav.classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(open));});
  $$('#mainNav a').forEach(a=>a.addEventListener('click',()=>{$('#mainNav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false');}));
  $('#year').textContent=new Date().getFullYear();
  // Keep the contact placeholder from pretending to be a real support channel.
  $('#contactLink').addEventListener('click',e=>{e.preventDefault();showToast('Le contact du projet doit être configuré avant la mise en ligne publique.');});
  renderOutings();renderTasks();
})();
