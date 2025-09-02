document.addEventListener('DOMContentLoaded',()=>{
  const STR=window.STRINGS, PRE=window.PRESETS
  document.title=STR.brand
  document.querySelector('[data-bind="prefs.title"]').textContent=STR.prefs.title
  document.getElementById('exportBtn').textContent=STR.prefs.export
  const idleDays=document.getElementById('idleDays')
  const modesWrap=document.getElementById('modes')
  const autoStatus=document.getElementById('autoStatus')
  const importFile=document.getElementById('importFile')
  Store.on(({prefs})=>{
    idleDays.value=prefs.idleThresholdDays
    autoStatus.textContent=prefs.autosave?'On':'Off'
    modesWrap.innerHTML=PRE.types.map(t=>{
      const cur=prefs.allowedModes[t]||'both'
      return '<div class="flex items-center justify-between gap-2 border rounded-lg px-3 py-2"><span class="text-sm">'+t+'</span><select data-type="'+t+'" class="input"><option value="sale" '+(cur==='sale'?'selected':'')+'>sale</option><option value="rent" '+(cur==='rent'?'selected':'')+'>rent</option><option value="both" '+(cur==='both'?'selected':'')+'>both</option></select></div>'
    }).join('')
    modesWrap.querySelectorAll('select').forEach(s=>s.addEventListener('change',()=>Store.setAllowed(s.dataset.type,s.value)))
  })
  idleDays.addEventListener('change',()=>Store.setIdleDays(idleDays.value))
  document.getElementById('exportBtn').addEventListener('click',()=>Store.exportData())
  importFile.addEventListener('change',e=>{ const f=e.target.files[0]; if(f) Store.importFile(f) })
  document.getElementById('enableAuto').addEventListener('click',async()=>{ await Store.enableAutosave() })
  document.getElementById('disableAuto').addEventListener('click',()=>Store.disableAutosave())
})
