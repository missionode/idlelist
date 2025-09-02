const Store=(function(){
  const LS_ITEMS='idlelist.items.v1'
  const LS_PREFS='idlelist.prefs.v1'
  const listeners=new Set()
  let items=JSON.parse(localStorage.getItem(LS_ITEMS)||'[]')
  let prefs=JSON.parse(localStorage.getItem(LS_PREFS)||'null')||{
    idleThresholdDays: window.PRESETS.idleThresholdDays,
    allowedModes: window.PRESETS.allowedModes,
    autosave:false
  }
  let autosaveHandle=null
  function save(){
    localStorage.setItem(LS_ITEMS,JSON.stringify(items))
    localStorage.setItem(LS_PREFS,JSON.stringify(prefs))
    if(prefs.autosave && autosaveHandle) writeFile()
    emit()
  }
  function emit(){ listeners.forEach(fn=>fn({items,prefs})) }
  function on(fn){ listeners.add(fn); fn({items,prefs}); return ()=>listeners.delete(fn) }
  function nowISO(){ return new Date().toISOString() }
  function uid(){ return 'id-'+Math.random().toString(36).slice(2)+Date.now().toString(36) }
  function daysSince(iso){
    const d=iso?new Date(iso):new Date(); return Math.floor((Date.now()-d.getTime())/86400000)
  }
  function refreshIdle(){
    const th=prefs.idleThresholdDays||30
    items=items.map(it=>{
      const idle=daysSince(it.lastUsedAt)
      if(idle>=th && !String(it.status).startsWith('listed')) return {...it,status:'idle'}
      return it
    })
  }
  function add(data){
    const it={
      id:uid(),
      title:data.title||'Untitled',
      type:data.type||'other',
      condition:data.condition||'used',
      description:data.description||'',
      photos:data.photos||[],
      transactionMode:data.transactionMode||'sale',
      price:Number(data.price||0),
      rentRates:{day:Number(data.rentDay||0),week:Number(data.rentWeek||0),month:Number(data.rentMonth||0)},
      location:data.location||'',
      lastUsedAt:data.lastUsedAt||nowISO(),
      createdAt:nowISO(),
      status:data.status||'in-use'
    }
    items.push(it); refreshIdle(); save(); return it
  }
  function update(id,patch){
    const i=items.findIndex(x=>x.id===id); if(i<0) return
    items[i]={...items[i],...patch}; refreshIdle(); save()
  }
  function setStatus(id,status){ update(id,{status}) }
  function checkIn(id){ update(id,{lastUsedAt:nowISO(),status:'in-use'}) }
  function list(){ refreshIdle(); return [...items] }
  function remove(id){ items=items.filter(x=>x.id!==id); save() }
  function get(id){ return items.find(x=>x.id===id) }
  async function writeFile(){
    try{
      const writable=await autosaveHandle.createWritable()
      const data={items,prefs,exportedAt:nowISO()}
      await writable.write(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}))
      await writable.close()
    }catch(e){}
  }
  async function enableAutosave(){
    if(!window.showSaveFilePicker){ prefs.autosave=false; save(); return false }
    autosaveHandle=await window.showSaveFilePicker({suggestedName:'idlelist-backup.json',types:[{description:'JSON',accept:{'application/json':['.json']}}]})
    prefs.autosave=true; save(); return true
  }
  function disableAutosave(){ prefs.autosave=false; autosaveHandle=null; save() }
  function setIdleDays(d){ prefs.idleThresholdDays=Number(d||30); save() }
  function setAllowed(type,mode){ prefs.allowedModes[type]=mode; save() }
  function exportData(){
    const data={items,prefs,exportedAt:nowISO()}
    const a=document.createElement('a')
    a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}))
    a.download='idlelist-backup.json'; a.click(); URL.revokeObjectURL(a.href)
  }
  async function importFile(file){
    const text=await file.text()
    const data=JSON.parse(text)
    items=Array.isArray(data.items)?data.items:[]
    prefs=Object.assign({idleThresholdDays:30,allowedModes:{}},data.prefs||{})
    autosaveHandle=null
    save()
  }
  refreshIdle(); save()
  return {on,add,update,setStatus,checkIn,list,remove,get,exportData,importFile,setIdleDays,setAllowed,enableAutosave,disableAutosave}
})()
