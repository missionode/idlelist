document.addEventListener('DOMContentLoaded',()=>{
  const STR=window.STRINGS, PRE=window.PRESETS
  document.title=STR.brand
  document.querySelector('[data-bind="items.title"]').textContent=STR.items.title
  document.getElementById('saveBtn').textContent=STR.items.save
  document.getElementById('checkinBtn').textContent=STR.items.checkin
  document.getElementById('listSaleBtn').textContent=STR.items.listSale
  document.getElementById('listRentBtn').textContent=STR.items.listRent
  const selType=document.getElementById('type'); selType.innerHTML=PRE.types.map(t=>'<option>'+t+'</option>').join('')
  const modeSel=document.getElementById('transactionMode')
  selType.addEventListener('change',()=>{ const m=PRE.allowedModes[selType.value]||'both'; if(m==='sale') modeSel.value='sale'; else if(m==='rent') modeSel.value='rent'; else modeSel.value='both' })
  const form=document.getElementById('itemForm')
  const photoInput=document.getElementById('photos'); const preview=document.getElementById('photoPreview')
  photoInput.addEventListener('change',async e=>{
    preview.innerHTML=''
    Array.from(e.target.files||[]).slice(0,6).forEach(file=>{
      const r=new FileReader()
      r.onload=()=>{ const img=document.createElement('img'); img.src=r.result; img.className='w-full h-24 object-cover rounded-md'; preview.appendChild(img) }
      r.readAsDataURL(file)
    })
  })
  form.addEventListener('submit',async e=>{
    e.preventDefault()
    const data=await collect()
    const id=document.getElementById('itemId').value
    if(id){ Store.update(id,data) } else { Store.add(data) }
    form.reset(); preview.innerHTML=''
  })
  document.getElementById('checkinBtn').addEventListener('click',()=>{
    const id=document.getElementById('itemId').value
    if(id) Store.checkIn(id)
  })
  document.getElementById('listSaleBtn').addEventListener('click',()=>{
    const id=document.getElementById('itemId').value
    if(id) Store.setStatus(id,'listed-sale')
  })
  document.getElementById('listRentBtn').addEventListener('click',()=>{
    const id=document.getElementById('itemId').value
    if(id) Store.setStatus(id,'listed-rent')
  })
  async function collect(){
    const files=Array.from(photoInput.files||[])
    const photos=await Promise.all(files.map(f=>new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(f) })))
    return {
      title:document.getElementById('title').value.trim(),
      type:document.getElementById('type').value,
      condition:document.getElementById('condition').value,
      transactionMode:document.getElementById('transactionMode').value,
      price:document.getElementById('price').value,
      rentDay:document.getElementById('rentDay').value,
      rentWeek:document.getElementById('rentWeek').value,
      rentMonth:document.getElementById('rentMonth').value,
      description:document.getElementById('description').value.trim(),
      location:document.getElementById('location').value.trim(),
      photos
    }
  }
  const list=document.getElementById('itemList'); const q=document.getElementById('q')
  q.addEventListener('input',()=>render())
  Store.on(()=>render())
  function render(){
    const items=Store.list().filter(f=>f.title.toLowerCase().includes(q.value.toLowerCase()))
    list.innerHTML=items.map(it=>{
      const img=(it.photos[0]||('https://picsum.photos/600/400?random='+it.id))
      return '<div class="card grid-card"><img class="w-full h-36 object-cover rounded-lg" src="'+img+'"><div><div class="font-semibold">'+it.title+'</div><div class="text-sm text-slate-500">'+it.type+' • '+it.condition+' • '+it.status+'</div></div><div class="flex gap-2"><button class="btn" data-act="edit" data-id="'+it.id+'">Edit</button><button class="btn" data-act="remove" data-id="'+it.id+'">Delete</button></div></div>'
    }).join('') || '<div class="text-slate-500">No items yet.</div>'
    list.querySelectorAll('[data-act="edit"]').forEach(b=>b.onclick=()=>fill(b.dataset.id))
    list.querySelectorAll('[data-act="remove"]').forEach(b=>b.onclick=()=>Store.remove(b.dataset.id))
  }
  function fill(id){
    const it=Store.get(id); if(!it) return
    document.getElementById('itemId').value=it.id
    document.getElementById('title').value=it.title
    document.getElementById('type').value=it.type
    document.getElementById('condition').value=it.condition
    document.getElementById('transactionMode').value=it.transactionMode
    document.getElementById('price').value=it.price
    document.getElementById('rentDay').value=it.rentRates.day
    document.getElementById('rentWeek').value=it.rentRates.week
    document.getElementById('rentMonth').value=it.rentRates.month
    document.getElementById('description').value=it.description
    document.getElementById('location').value=it.location
    preview.innerHTML=(it.photos||[]).map(src=>'<img class="w-full h-24 object-cover rounded-md" src="'+src+'">').join('')
  }
})
