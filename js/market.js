document.addEventListener('DOMContentLoaded',()=>{
  const STR=window.STRINGS, PRE=window.PRESETS
  document.title=STR.brand
  document.querySelector('[data-bind="market.title"]').textContent=STR.market.title
  const typeSel=document.getElementById('fType'); typeSel.innerHTML='<option value="all">'+(STR.market.filters.all||'All')+'</option>'+PRE.types.map(t=>'<option value="'+t+'">'+t+'</option>').join('')
  const q=document.getElementById('q'), fMode=document.getElementById('fMode'), fType=document.getElementById('fType')
  q.placeholder=STR.market.filters.search
  ;[q,fMode,fType].forEach(el=>el.addEventListener('input',render))
  Store.on(()=>render())
  function render(){
    const list=document.getElementById('listings')
    const items=Store.list().filter(x=>x.status==='listed-sale'||x.status==='listed-rent')
    const term=q.value.toLowerCase()
    let filtered=items.filter(x=>x.title.toLowerCase().includes(term)||x.description.toLowerCase().includes(term))
    if(fMode.value!=='all') filtered=filtered.filter(x=>x.status==='listed-'+fMode.value)
    if(fType.value!=='all') filtered=filtered.filter(x=>x.type===fType.value)
    list.innerHTML=filtered.map(it=>{
      const img=(it.photos[0]||('https://picsum.photos/600/400?random='+it.id))
      const isSale=it.status==='listed-sale'
      const price=isSale?('₹'+it.price):('₹'+it.rentRates.day+'/day')
      const mode=isSale?'Sale':'Rent'
      return '<div class="card grid-card"><img class="w-full h-40 object-cover rounded-lg" src="'+img+'"><div><div class="flex items-center justify-between"><div class="font-semibold">'+it.title+'</div><span class="badge">'+mode+'</span></div><div class="text-sm text-slate-500">'+it.type+' • '+it.condition+' • '+price+'</div><p class="text-sm mt-1 line-clamp-3">'+it.description+'</p></div><div class="flex items-center gap-2"><button class="btn flex-1" data-act="share" data-id="'+it.id+'">Copy share text</button><div class="text-xs text-slate-600">'+STR.market.contact+'</div></div></div>'
    }).join('') || '<div class="text-slate-500">No listings yet.</div>'
    list.querySelectorAll('[data-act="share"]').forEach(b=>b.onclick=()=>copyShare(b.dataset.id))
  }
  function copyShare(id){
    const it=Store.get(id); if(!it) return
    const isSale=it.status==='listed-sale'
    const price=isSale?('₹'+it.price):('₹'+it.rentRates.day+'/day')
    const text=[it.title,it.description,('Type: '+it.type+', Condition: '+it.condition),('Mode: '+(isSale?'Sale':'Rent')+', Price: '+price),('Location: '+it.location),'DM to discuss'].join('\n')
    navigator.clipboard.writeText(text)
  }
})
