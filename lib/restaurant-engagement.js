import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server.browser';
import {MessageCircle,Send,X,ChevronRight,Sparkles} from 'lucide-react';
const icons={chat:MessageCircle,send:Send,close:X,right:ChevronRight,sparkles:Sparkles};
const icon=n=>renderToStaticMarkup(createElement(icons[n],{width:20,height:20,'aria-hidden':true,strokeWidth:1.8}));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function foodCarousel(meals,title='A taste of home'){
 const cards=meals.map(m=>`<button class="carousel-dish" data-dish="${m.id}" aria-label="View ${esc(m.name)}"><img src="/photos/${m.img}.jpg" alt="${esc(m.name)}" width="330" height="220" loading="lazy"><span><strong>${esc(m.short)}</strong><small>₦${m.price.toLocaleString('en-NG')}</small></span></button>`).join('');
 const copy=meals.map(m=>`<button class="carousel-dish" data-dish="${m.id}" tabindex="-1"><img src="/photos/${m.img}.jpg" alt="" width="330" height="220" loading="lazy"><span><strong>${esc(m.short)}</strong><small>₦${m.price.toLocaleString('en-NG')}</small></span></button>`).join('');
 return `<section class="food-carousel" aria-label="Food gallery"><div class="carousel-heading"><div><span class="eyebrow">FROM OUR KITCHEN</span><h2>${title}</h2></div></div><div class="carousel-viewport" tabindex="0" aria-label="Scroll to explore all 11 menu items"><div class="carousel-track"><div class="carousel-group">${cards}</div><div class="carousel-group" aria-hidden="true">${copy}</div></div></div><p class="carousel-hint">Swipe or scroll to explore. Tap a dish to make it yours.</p></section>`;
}
export function mountEngagement({root,meals,onDish,onView}){
 const controller=new AbortController(),signal=controller.signal;
 const container=document.createElement('div');container.className='ile-concierge';root.append(container);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let open=false,welcome=true,mode='guide',chatBusy=false,error='',textDraft='',stopCarousel=()=>{},lastFocus=null;
 const messages=[{role:'assistant',content:'Welcome to ILÉ! Pull up a chair. I can help you find a favourite, explore our Nigerian menu or book a table. What are you craving?',dishIds:[],action:''}];
 try{welcome=sessionStorage.getItem('ile-host-dismissed')!=='yes'}catch{}
 function hideWelcome(){welcome=false;try{sessionStorage.setItem('ile-host-dismissed','yes')}catch{}}
 function renderChat(enter=false){
  if(open){container.innerHTML=`<section class="chat-panel ${enter?'chat-enter':''}" role="dialog" aria-labelledby="ile-chat-title"><header class="chat-header"><span class="host-mark">${icon('sparkles')}</span><div><h2 id="ile-chat-title">Your ILÉ host</h2><p>${mode==='ai'?'AI menu assistant':'Menu guide · AI connection pending'}</p></div><button data-chat="close" aria-label="Close chat">${icon('close')}</button></header><div class="chat-transcript" role="log" aria-live="polite" aria-relevant="additions" aria-busy="${chatBusy}">${messages.map(m=>`<div class="chat-message ${m.role}"><span class="chat-speaker">${m.role==='assistant'?'ILÉ host':'You'}</span><p>${esc(m.content)}</p>${m.notice?`<small class="chat-notice">${esc(m.notice)}</small>`:''}${m.dishIds?.length?`<div class="chat-dishes">${m.dishIds.map(id=>{const dish=meals.find(d=>d.id===id);return dish?`<button data-chat-dish="${id}"><img src="/photos/${dish.img}.jpg" alt=""><span>${esc(dish.short)}<small>₦${dish.price.toLocaleString('en-NG')}</small></span>${icon('right')}</button>`:''}).join('')}</div>`:''}${m.action?`<button class="chat-action" data-chat-view="${m.action}">${{Menu:'Explore the menu',Reserve:'Book a table',Bag:'Open your bag',Help:'Restaurant information'}[m.action]}</button>`:''}</div>`).join('')}${chatBusy?'<p class="chat-thinking" role="status">Your host is replying…</p>':''}</div><div class="chat-prompts">${['Recommend a dish','Food under ₦7,000','Book a table'].map(q=>`<button data-chat-prompt="${esc(q)}" ${chatBusy?'disabled':''}>${q}</button>`).join('')}</div><form class="chat-form"><label class="sr-only" for="ile-chat-input">Ask your ILÉ host</label><input id="ile-chat-input" name="message" placeholder="Ask about a dish or price…" maxlength="1000" required autocomplete="off"><button type="submit" aria-label="Send message" ${chatBusy?'disabled':''}>${icon('send')}</button></form>${error?`<p class="chat-error" role="alert">${esc(error)}</p>`:''}<p class="chat-footnote">${mode==='ai'?'AI can make mistakes. Confirm allergy needs with the restaurant.':'Menu answers are available now. AI replies activate after connection.'}</p></section>`;
   container.querySelector('input').value=textDraft;
   const log=container.querySelector('.chat-transcript');log.scrollTop=log.scrollHeight;
  }else container.innerHTML=`${welcome?`<aside class="host-welcome"><button data-chat="dismiss" class="welcome-dismiss" aria-label="Dismiss welcome">${icon('close')}</button><span class="eyebrow">YOUR ILÉ HOST</span><strong>Welcome. What are you craving?</strong><p>Let’s find something you’ll love.</p><button data-chat="open" class="host-welcome-cta">Let’s chat ${icon('chat')}</button></aside>`:''}<button class="chat-launcher" data-chat="open" aria-haspopup="dialog" aria-label="Chat with your ILÉ host">${icon('chat')}<span>${welcome?'Welcome! Chat with ILÉ':'Chat with ILÉ'}</span><span class="host-dot" aria-hidden="true"></span></button>`;
 }
 function openChat(){lastFocus=document.activeElement;hideWelcome();open=true;renderChat(true);container.querySelector('input')?.focus()}
 function closeChat(){textDraft=container.querySelector('input')?.value||textDraft;open=false;renderChat();container.querySelector('.chat-launcher')?.focus()}
 async function send(text){if(chatBusy||!text.trim())return;const content=text.trim().slice(0,1000);const history=messages.slice(-8).map(m=>({role:m.role,content:m.content}));messages.push({role:'user',content});textDraft='';chatBusy=true;error='';renderChat();
  try{const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:content,history}),signal});const data=await res.json();if(!res.ok)throw new Error(data.error||'Please try again.');mode=data.mode;messages.push({role:'assistant',content:data.reply,dishIds:data.dishIds,action:data.action,notice:data.notice});}
  catch(e){if(e.name==='AbortError')return;error=e.message||'Connection lost. Please try again.';textDraft=content;messages.pop()}
  finally{chatBusy=false;if(open){renderChat();container.querySelector('input')?.focus()}}
 }
 container.addEventListener('input',e=>{if(e.target.id==='ile-chat-input')textDraft=e.target.value},{signal});
 container.addEventListener('submit',e=>{if(e.target.matches('.chat-form')){e.preventDefault();send(container.querySelector('input').value)}},{signal});
 container.addEventListener('keydown',e=>{if(e.key==='Escape'&&open){e.preventDefault();closeChat()}},{signal});
 container.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.chat==='open')openChat();if(b.dataset.chat==='close')closeChat();if(b.dataset.chat==='dismiss'){hideWelcome();renderChat()}if(b.dataset.chatPrompt)send(b.dataset.chatPrompt);if(b.dataset.chatDish){closeChat();onDish(b.dataset.chatDish)}if(b.dataset.chatView){closeChat();onView(b.dataset.chatView)}},{signal});
 function refreshCarousel(){stopCarousel();const viewport=root.querySelector('.carousel-viewport');if(!viewport)return;let frame=0,last=0,position=viewport.scrollLeft,hover=false,focus=false,touch=false,interactionUntil=0;const local=new AbortController();const opts={signal:local.signal};
  viewport.addEventListener('pointerenter',()=>{hover=true},opts);viewport.addEventListener('pointerleave',()=>{hover=false},opts);
  viewport.addEventListener('focusin',()=>{focus=true},opts);viewport.addEventListener('focusout',e=>{focus=viewport.contains(e.relatedTarget)},opts);
  viewport.addEventListener('pointerdown',()=>{touch=true},opts);viewport.addEventListener('pointerup',()=>{touch=false;interactionUntil=performance.now()+1400},opts);viewport.addEventListener('pointercancel',()=>{touch=false;interactionUntil=performance.now()+1400},opts);
  viewport.addEventListener('wheel',()=>{interactionUntil=performance.now()+1400},{...opts,passive:true});viewport.addEventListener('scroll',()=>{if(hover||focus||touch||performance.now()<interactionUntil)position=viewport.scrollLeft},{...opts,passive:true});
  function tick(time){const delta=last?Math.min(time-last,50):0;last=time;const box=viewport.getBoundingClientRect();if(time>=interactionUntil&&!reduced.matches&&!hover&&!focus&&!touch&&document.visibilityState==='visible'&&box.bottom>0&&box.top<innerHeight){const groups=viewport.querySelectorAll('.carousel-group');const cycle=groups[1].offsetLeft-groups[0].offsetLeft;if(cycle>0){position=(position+delta*.04)%cycle;viewport.scrollLeft=position}}
   frame=requestAnimationFrame(tick)}
  frame=requestAnimationFrame(tick);stopCarousel=()=>{cancelAnimationFrame(frame);local.abort()};
 }
 fetch('/api/chat',{signal}).then(r=>r.json()).then(data=>{mode=data.mode==='ai'?'ai':'guide';if(open)renderChat()}).catch(()=>{});
 renderChat();
 return {refreshCarousel,stop(){stopCarousel();controller.abort();container.remove()}};
}
