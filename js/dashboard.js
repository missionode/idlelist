document.addEventListener('DOMContentLoaded',()=>{
  const STR=window.STRINGS
  document.title=STR.brand
  document.querySelector('[data-bind="dashboard.title"]').textContent=STR.dashboard.title
  document.querySelector('[data-bind="items.add"]').textContent=STR.items.add
  renderStats([])
  Store.on(({items,prefs})=>{
    renderStats(items)
    renderNeeds(items,prefs)
  })
  function renderStats(items){
    const s=STR.dashboard.stats
    const c={total:items.length,inUse:items.filter(x=>x.status==='in-use').length,idle:items.filter(x=>x.status==='idle').length,planned:items.filter(x=>x.status==='planned').length,forSale:items.filter(x=>x.status==='listed-sale').length,forRent:items.filter(x=>x.status==='listed-rent').length}
    const stats=document.getElementById('stats'); stats.innerHTML=''
    ;[
      [s.total,c.total,'bg-slate-100'],
      [s.inUse,c.inUse,'bg-emerald-100'],
      [s.idle,c.idle,'bg-amber-100'],
      [s.planned,c.planned,'bg-sky-100'],
      [s.forSale,c.forSale,'bg-fuchsia-100'],
      [s.forRent,c.forRent,'bg-indigo-100']
    ].forEach(([label,val,clr])=>{
      const el=document.createElement('div')
      el.className='card'
      el.innerHTML='<div class="text-sm text-slate-500">'+label+'</div><div class="text-2xl font-semibold">'+val+'</div>'
      stats.appendChild(el)
    })
  }
  function renderNeeds(items,prefs){
    const list=document.getElementById('needsAction'); list.innerHTML=''
    const need=items.filter(x=>x.status==='idle')
    if(!need.length){ list.innerHTML='<div class="text-slate-500">No idle items. Keep enjoying your things.</div>'; return }
    need.forEach(it=>{
      const card=document.createElement('div')
      card.className='card grid-card'
      const img=(it.photos[0]||('https://picsum.photos/600/400?random='+it.id))
      card.innerHTML='<img class="w-full h-40 object-cover rounded-lg" src="'+img+'"><div><div class="font-semibold">'+it.title+'</div><div class="text-sm text-slate-500">'+it.type+' • '+it.condition+'</div></div><div class="flex gap-2"><button class="btn flex-1" data-act="sale">'+STR.items.listSale+'</button><button class="btn flex-1" data-act="rent">'+STR.items.listRent+'</button></div>'
      card.querySelector('[data-act="sale"]').onclick=()=>Store.setStatus(it.id,'listed-sale')
      card.querySelector('[data-act="rent"]').onclick=()=>Store.setStatus(it.id,'listed-rent')
      list.appendChild(card)
    })
  }
})
