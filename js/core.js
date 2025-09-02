(function(){
  const sEl=document.getElementById('strings')
  window.STRINGS = sEl?JSON.parse(sEl.textContent):{brand:"IdleList"}
  const pEl=document.getElementById('presets')
  window.PRESETS = pEl?JSON.parse(pEl.textContent):{idleThresholdDays:30,types:["other"],allowedModes:{"other":"both"}}
  document.addEventListener('DOMContentLoaded',()=>{
    const STR=window.STRINGS
    const titleEl=document.querySelector('[data-bind="brand"]'); if(titleEl) titleEl.textContent=STR.brand
    const tagline=document.querySelector('[data-bind="tagline"]'); if(tagline) tagline.textContent=STR.tagline||""
    const navLabels=document.querySelectorAll('.nav-link')
    if(navLabels.length>=5){
      navLabels[0].textContent=STR.nav?.dashboard||"Dashboard"
      navLabels[1].textContent=STR.nav?.items||"Items"
      navLabels[2].textContent=STR.nav?.market||"Marketplace"
      navLabels[3].textContent=STR.nav?.prefs||"Preferences"
      navLabels[4].textContent=STR.nav?.help||"Help"
    }
    const m=document.getElementById('logoMark'); if(m) m.textContent=(STR.brand||"I")[0]
  })
})()
