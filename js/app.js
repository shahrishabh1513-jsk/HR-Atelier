/* RT_Fashion World - shared store logic. Needs data.js loaded first. */

const DM=new Proxy(function(){},{get:()=>DM,set:()=>true,apply:()=>DM}),$=s=>document.querySelector(s)||DM,fmt=n=>'₹'+n.toLocaleString('en-IN');
const ld=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}},sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const TN=[["Natural","none","#cfc8f0"],["Graphite","grayscale(1)","#555"],["Sand","sepia(.45) saturate(1.1)","#d9bf94"],["Dusk","hue-rotate(-18deg) saturate(.9)","#a98be0"],["Bloom","hue-rotate(14deg) saturate(1.3)","#ff8fb1"]];
const CATS=[["Women","var(--lil)"],["Men","var(--sky)"],["Footwear","var(--mint)"],["Bags","var(--but)"],["Jewelry","#FFD9E6"],["Accessories","#D9F3F0"]];
const SZ=["XS","S","M","L","XL","XXL","UK 4","UK 5","UK 6","UK 7","UK 8","UK 9","UK 10","One size"];
let F={c:'All',q:'',s:'pop',z:'',m:5000,o:false,n:24},cart=ld('rtc',[]),wish=ld('rtw',[]),cp=ld('rtp',null),sel={};
const pid=i=>P.find(p=>p.id==i),im=k=>k;
const list=()=>{let r=P.filter(p=>(F.c=='All'||p.c==F.c)&&p.p<=F.m&&(!F.o||p.o)&&(!F.u||p.s==F.u)&&(!F.nw||p.nw)&&(!F.z||p.sz.includes(F.z))&&(!F.q||(p.n+' '+p.c+' '+p.s).toLowerCase().includes(F.q)));
const o={lo:(a,b)=>a.p-b.p,hi:(a,b)=>b.p-a.p,rt:(a,b)=>b.r-a.r,new:(a,b)=>b.id-a.id,pop:(a,b)=>b.rv-a.rv};return r.sort(o[F.s])};
function card(p){const t=TN[p.cl[0]];return `<article class="pc" style="animation-delay:${(p.id%8)*40}ms"><div class="im" data-q="${p.id}">${p.o?`<span class="tag">-${Math.round((1-p.p/p.o)*100)}%</span>`:p.nw?'<span class="tag n">New</span>':''}<img src="${im(p.img[0])}" alt="${p.n}" loading="lazy">${p.img[1]?`<img src="${im(p.img[1])}" alt="" loading="lazy">`:''}<button class="hrt ${wish.includes(p.id)?'on':''}" data-h="${p.id}" aria-label="Wishlist">${wish.includes(p.id)?'♥':'♡'}</button><button class="qa" data-q="${p.id}">Quick view · pick size</button></div><h3>${p.n}</h3><small>${p.c} · ${p.s} · ★ ${p.r} (${p.rv})</small><div class="pr">${fmt(p.p)}${p.o?`<s>${fmt(p.o)}</s>`:''}</div><div class="dots">${p.cl.map(c=>`<i style="background:${TN[c][2]}" title="${TN[c][0]}"></i>`).join('')}</div></article>`}
function render(){const L=list(),sh=L.slice(0,F.n);$('#gr').innerHTML=sh.length?sh.map(card).join(''):'<div class="empty" style="grid-column:1/-1"><h3 class="dsp">Nothing matches yet</h3><p>Try a bigger price limit or reset the filters.</p></div>';
$('#rc').textContent=`Showing ${sh.length} of ${L.length} products`;$('#st').textContent=F.c=='All'?'All products':F.c;$('#lm').style.display=L.length>sh.length?'':'none';$('#pv').textContent=fmt(F.m);
$('#fc').innerHTML=['All',...CATS.map(c=>c[0])].map(c=>`<button class="chip ${F.c==c?'on':''}" data-c="${c}">${c}</button>`).join('');
$('#fs').innerHTML=SZ.map(z=>`<button class="chip ${F.z==z?'on':''}" data-z="${z}">${z}</button>`).join('');$('#wc').textContent=wish.length;
const n=cart.reduce((a,i)=>a+i.q,0);$('#cc').textContent=n}
function toast(m){const t=$('#ts');t.textContent=m;t.classList.add('on');clearTimeout(t.h);t.h=setTimeout(()=>t.classList.remove('on'),2200)}
const open=e=>{$('#ov').classList.add('on');e.classList.add('on')},shut=()=>{document.querySelectorAll('.on:is(.ov,.mod,.dr)').forEach(e=>e.classList.remove('on'))};
function quick(id){const p=pid(id);sel={id,z:'',c:p.cl[0],q:1,g:0};const m=window.PDT||$('#md');
m.innerHTML=`<button class="x" aria-label="Close">✕</button><div class="qv"><div class="gal"><div class="big"><img id="bg" src="${im(p.img[0])}" alt="${p.n}"></div><div class="th">${p.img.length<2?'':p.img.map((k,i)=>`<img src="${im(k)}" data-g="${i}" class="${i?'':'on'}" alt="View ${i+1}">`).join('')}</div></div>
<div><small>${p.c} · ${p.s}</small><h2>${p.n}</h2><div class="pr" style="font-size:22px;margin:0">${fmt(p.p)}${p.o?`<s>${fmt(p.o)}</s><em>Save ${fmt(p.o-p.p)}</em>`:''}</div><small>★ ${p.r} · ${p.rv} reviews</small>${window.PDT?'':` · <a href="ProductDetails.html?id=${p.id}" style="color:var(--pk);font-weight:600">Full details</a>`}
<h4>Colour: <span id="cn">${TN[sel.c][0]}</span></h4><div class="sw">${p.cl.map(c=>`<button data-k="${c}" class="${c==sel.c?'on':''}" style="background:${TN[c][2]}" aria-label="${TN[c][0]}"></button>`).join('')}</div>
<h4>Size</h4><div class="sz">${p.sz.map((z,i)=>`<button data-s="${z}" ${p.no.includes(z)?'disabled':''}>${z}</button>`).join('')}</div><p class="err" id="er"></p>
<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><div class="q"><button data-d="-1" aria-label="Less">−</button><span id="qn">1</span><button data-d="1" aria-label="More">+</button></div><button class="btn" data-add>Add to cart</button><button class="btn alt" data-buy>Buy now</button></div>
<details><summary>Size guide</summary><table><tr><th>Size</th><th>Chest (in)</th><th>Waist (in)</th></tr><tr><td>XS</td><td>32</td><td>26</td></tr><tr><td>S</td><td>34</td><td>28</td></tr><tr><td>M</td><td>36</td><td>30</td></tr><tr><td>L</td><td>38–40</td><td>32–34</td></tr><tr><td>XL</td><td>42</td><td>36</td></tr></table></details></div></div>`;
window.PDT||open(m);m.scrollTop=0;sel.p=p}
function tint(){$('#bg').style.filter=TN[sel.c][1];$('#cn').textContent=TN[sel.c][0]}
function add(go){const p=sel.p;if(!sel.z){$('#er').textContent='Please choose a size first.';return false}
const k=`${p.id}|${sel.z}|${sel.c}`,e=cart.find(i=>i.k==k);e?e.q+=sel.q:cart.push({k,id:p.id,z:sel.z,c:sel.c,q:sel.q});sv('rtc',cart);render();toast(`Added ${p.n} (${sel.z}) to cart`);return true}
function tot(){const s=cart.reduce((a,i)=>a+pid(i.id).p*i.q,0),d=cp=='RT10'?Math.round(s*.1):0,sh=s-d>=1999||!s?0:99;return{s,d,sh,t:s-d+sh}}
function drawer(){const T=tot(),d=window.CPT||$('#dr');d.innerHTML=`<button class="x" aria-label="Close">✕</button><h2 class="dsp" style="font-size:30px">Your cart</h2>
<div><small>${T.s-T.d>=1999?'You unlocked free shipping 🎉':`Add ${fmt(1999-T.s+T.d)} more for free shipping`}</small><div class="fs"><i style="width:${Math.min(100,(T.s-T.d)/19.99)}%"></i></div></div>
<div class="ls">${cart.length?cart.map(i=>{const p=pid(i.id);return `<div class="ci"><img src="${im(p.img[0])}" style="filter:${TN[i.c][1]}" alt=""><div><b>${p.n}</b><small>Size ${i.z} · ${TN[i.c][0]}</small><div class="q" style="margin-top:6px"><button data-ci="${i.k}" data-d="-1">−</button><span>${i.q}</span><button data-ci="${i.k}" data-d="1">+</button></div></div><div style="text-align:right"><b>${fmt(p.p*i.q)}</b><br><button data-rm="${i.k}" style="color:var(--pk);font-size:13px">Remove</button></div></div>`}).join(''):'<div class="empty">Your cart is empty.<br>Find something you love.</div>'}</div>
<div class="cp"><input id="cpi" placeholder="Coupon code" value="${cp||''}" aria-label="Coupon code"><button class="btn alt" id="cpb">Apply</button></div>
<div class="tot"><div><span>Subtotal</span><span>${fmt(T.s)}</span></div>${T.d?`<div style="color:var(--pk)"><span>Coupon RT10</span><span>-${fmt(T.d)}</span></div>`:''}<div><span>Shipping</span><span>${T.sh?fmt(T.sh):'Free'}</span></div><div class="g"><span>Total</span><span>${fmt(T.t)}</span></div></div>
<button class="btn" id="ck" style="justify-content:center;margin-top:12px" ${cart.length?'':'disabled'}>Checkout</button>`}
function checkout(){shut();const m=window.CKT||$('#md'),T=tot();m.innerHTML=`<button class="x" aria-label="Close">✕</button><h2 class="dsp" style="font-size:32px;margin-bottom:16px">Checkout · ${fmt(T.t)}</h2><form class="f" id="cf"><div class="two"><input required placeholder="Full name" autocomplete="name"><input required pattern="[0-9]{10}" placeholder="Phone (10 digits)" autocomplete="tel"></div><input required placeholder="Address" autocomplete="street-address"><div class="two"><input required placeholder="City" autocomplete="address-level2"><input required pattern="[0-9]{6}" placeholder="Pincode (6 digits)" autocomplete="postal-code"></div>
<div class="pay"><label class="chip"><input type="radio" name="py" checked> UPI</label><label class="chip"><input type="radio" name="py"> Card</label><label class="chip"><input type="radio" name="py"> Cash on delivery</label></div><button class="btn" style="justify-content:center">Place order</button></form>`;window.CKT||open(m);
$('#cf').onsubmit=e=>{e.preventDefault();const id='RT'+Math.floor(100000+Math.random()*900000);sv('rto',[{id,ts:Date.now(),t:T.t,items:cart.map(i=>({...i}))},...ld('rto',[])]);cart=[];cp=null;sv('rtc',cart);sv('rtp',null);render();$('#sm').style.display='none';
m.innerHTML=`<button class="x" aria-label="Close">✕</button><div style="text-align:center;padding:30px"><div style="font-size:70px">🎉</div><h2 class="dsp" style="font-size:38px">Order placed!</h2><p>Thanks for shopping at RT_Fashion World.<br>Your order number is <b>${id}</b>. We will text you the tracking link.</p><button class="btn" data-x>Keep shopping</button> <a class="btn alt" href="account.html">My orders</a></div>`;
for(let i=0;i<60;i++){const c=document.createElement('i');c.className='cf';c.style.cssText=`left:${Math.random()*100}vw;background:${['#FF5D8F','#8f6bff','#FFD36B','#5fd3a6'][i%4]};animation-delay:${Math.random()*.8}s`;document.body.appendChild(c);setTimeout(()=>c.remove(),3600)}}}
document.addEventListener('click',e=>{const t=e.target,g=a=>t.closest('['+a+']'),a=n=>g(n)?.getAttribute(n);
if(g('data-x')&&window.CKT)return location.href='index.html';if(t.closest('.x')||t==$('#ov')||g('data-x'))return shut();
if(a('data-h')){const i=+a('data-h');wish=wish.includes(i)?wish.filter(x=>x!=i):[...wish,i];sv('rtw',wish);render();return}
if(g('data-q'))return quick(+a('data-q'));
if(g('data-c')){if(!SH)return location.href='products.html?c='+encodeURIComponent(a('data-c'));F.c=a('data-c');F.n=24;render();return}if(g('data-z')){F.z=F.z==a('data-z')?'':a('data-z');F.n=24;render();return}
if(g('data-go')&&!SH)return location.href='products.html';if(g('data-go'))return $('#'+a('data-go')).scrollIntoView();if(g('data-sale')){if(!SH)return location.href='products.html?sale=1';F.o=true;$('#so').checked=true;F.n=24;render();return $('#shop').scrollIntoView()}
if(g('data-g')){const i=+a('data-g');$('#bg').src=im(sel.p.img[i]);document.querySelectorAll('.th img').forEach((x,j)=>x.classList.toggle('on',j==i));return}
if(g('data-k')){sel.c=+a('data-k');document.querySelectorAll('.sw button').forEach(b=>b.classList.toggle('on',b==g('data-k')));return tint()}
if(g('data-s')){sel.z=a('data-s');$('#er').textContent='';document.querySelectorAll('.sz button').forEach(b=>b.classList.toggle('on',b==g('data-s')));return}
if(g('data-d')&&!g('data-ci')){sel.q=Math.max(1,Math.min(9,sel.q+ +a('data-d')));$('#qn').textContent=sel.q;return}
if(g('data-add')){if(add())shut();return}if(g('data-buy')){if(add()){shut();drawer();open($('#dr'))}return}
if(g('data-ci')){const i=cart.find(x=>x.k==a('data-ci'));i.q=Math.max(1,i.q+ +a('data-d'));sv('rtc',cart);render();return drawer()}
if(g('data-rm')){cart=cart.filter(x=>x.k!=a('data-rm'));sv('rtc',cart);render();return drawer()}
if(t.id=='cpb'){const v=$('#cpi').value.trim().toUpperCase();cp=v=='RT10'?v:null;sv('rtp',cp);toast(cp?'Coupon applied: 10% off':'That code is not valid');return drawer()}
if(t.id=='ck')return location.href='checkout.html';if(t.closest('#cb')){drawer();open($('#dr'))}
if(t.closest('#wb')){F.c='All';F.q='';const w=P.filter(p=>wish.includes(p.id));if(!w.length)return toast('Tap ♡ on any product to save it');$('#md').innerHTML=`<button class="x" aria-label="Close">✕</button><h2 class="dsp" style="font-size:32px;margin-bottom:16px">Your wishlist</h2><div class="grid">${w.map(card).join('')}</div>`;open($('#md'))}});
document.addEventListener('keydown',e=>e.key=='Escape'&&shut());
$('#q').oninput=e=>{F.q=e.target.value.toLowerCase().trim();F.n=24;render()};$('#sr').onchange=e=>{F.s=e.target.value;render()};
$('#pr').oninput=e=>{F.m=+e.target.value;F.n=24;render()};$('#so').onchange=e=>{F.o=e.target.checked;render()};$('#lm').onclick=()=>{F.n+=24;render()};
$('#rs').onclick=()=>{F={c:'All',q:'',s:'pop',z:'',m:5000,o:false,n:24};$('#q').value='';$('#pr').value=5000;$('#so').checked=false;$('#sr').value='pop';render()};
$('#nf').onsubmit=e=>{e.preventDefault();e.target.reset();toast('You are in! Check your inbox for ₹200 off')};
$('#nv').innerHTML=['Women','Men','Footwear','Bags','Jewelry'].map(c=>`<li><button data-c="${c}" data-go="shop">${c}</button></li>`).join('')+'<li><button data-sale>Sale</button></li>';
$('#mq').innerHTML=Array(8).fill('<span>New drops weekly</span><span>✦</span><span>Free shipping ₹1,999+</span><span>✦</span><span>Easy size exchange</span><span>✦</span>').join('');
$('#cats').innerHTML=CATS.map(([c,bg])=>{const p=P.find(x=>x.c==c);return `<button class="cat" style="background:${bg}" data-c="${c}" data-go="shop"><div><h3>${c}</h3><small>${P.filter(x=>x.c==c).length} styles</small></div><img src="${im(p.img[0])}" alt=""></button>`}).join('');
$('#tr').innerHTML=[...P].sort((a,b)=>b.rv-a.rv).slice(0,12).map(card).join('');
['a1','a2','a3'].forEach((k,i)=>{$('.'+k).innerHTML=`<img src="${im(P[[61,71,45][i]].img[0])}" alt="">`});
$('#arch').onmousemove=e=>{const r=e.currentTarget.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;document.querySelectorAll('#arch div:not(.sticker)').forEach((d,i)=>d.style.transform=`translate(${x*(i+1)*14}px,${y*(i+1)*14}px)`)};
const end=new Date();end.setHours(23,59,59);setInterval(()=>{const s=Math.max(0,end-new Date()),v=[s/36e5|0,s/6e4%60|0,s/1e3%60|0];$('#cd').innerHTML=['Hours','Mins','Secs'].map((l,i)=>`<div>${String(v[i]).padStart(2,'0')}<small>${l}</small></div>`).join('')},1000);
render();
/* ---------- shared: floating navbar, search palette, auth, page logic ---------- */
const SH=!!document.getElementById('gr'),pg=document.body.dataset.page,U=new URLSearchParams(location.search),cur=' aria-current="page"';
const users=()=>ld('rtu',[]),me=ld('rts',null),esc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const SUBS=c=>{const m={};P.filter(p=>p.c==c).forEach(p=>m[p.s]=(m[p.s]||0)+1);return Object.entries(m).sort((a,b)=>b[1]-a[1])};
const TOPP=c=>[...P.filter(p=>c=='*'||p.c==c)].sort((a,b)=>b.rv-a.rv)[0],BG=Object.fromEntries(CATS);
const DOT={Women:'#b9a7ff',Men:'#8cc8ff',Footwear:'#72deb0',Bags:'#ffd36b',Jewelry:'#ff8fb1',Accessories:'#6fd6cc'};
const CH='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const sub=(c,n)=>`products.html?c=${c}&u=${encodeURIComponent(n)}`;
const ftc=(f,bg)=>`<a class="ft" href="ProductDetails.html?id=${f.id}" style="background:${bg}"><img src="${f.img[0]}" alt=""><b>${f.n}</b><span>${fmt(f.p)}</span></a>`;
const dd=c=>`<div class="dd"><div class="ddi"><div><h5>${c}</h5><div class="cl">${SUBS(c).map(([n,k])=>`<a class="l" href="${sub(c,n)}">${n}<small>${k}</small></a>`).join('')}<a class="l all" href="products.html?c=${c}">View all ${c} →</a></div></div>${ftc(TOPP(c),BG[c])}</div></div>`;
const mega=`<div class="dd mega"><div class="ddi"><div class="mg3">${CATS.map(([c])=>`<div><a class="mh" href="products.html?c=${c}"><i style="background:${DOT[c]}"></i>${c}<small>${P.filter(p=>p.c==c).length}</small></a><div class="chs">${SUBS(c).map(([n])=>`<a href="${sub(c,n)}">${n}</a>`).join('')}</div></div>`).join('')}</div><div class="side">${ftc(TOPP('*'),'var(--lil)')}<button type="button" class="cc cpb">Use code <b>RT10</b> · 10% off<small>Click to copy</small></button></div></div></div>`;
const plain=!U.get('c')&&!U.get('sale')&&!U.get('new');
$('#nv').innerHTML=`<li><a class="top" href="index.html"${pg=='home'?cur:''}>Home</a></li><li class="has wide"><a class="top" href="products.html"${SH&&plain?cur:''}>Shop${CH}</a>${mega}</li>`
+['Women','Men','Jewelry'].map(c=>`<li class="has"><a class="top" href="products.html?c=${c}"${SH&&U.get('c')==c&&!U.get('sale')&&!U.get('new')?cur:''}>${c}${CH}</a>${dd(c)}</li>`).join('')
+`<li><a class="top" href="products.html?new=1"${SH&&U.get('new')?cur:''}>New in</a></li><li><a class="top sl" href="products.html?sale=1"${SH&&U.get('sale')?cur:''}>Sale</a></li><li class="has"><button class="top" type="button" aria-haspopup="true">More${CH}</button><div class="dd sm"><div class="ddi"><a class="l" href="track.html">Track order</a><a class="l" href="about.html">About us</a><a class="l" href="contact.html">Contact</a></div></div></li>`;
/* sliding hover highlight */
const pill=document.querySelector('.pill'),nv=$('#nv'),hl=document.createElement('span');hl.className='hl';pill.prepend(hl);
const mv=t=>{const r=t.getBoundingClientRect(),p=pill.getBoundingClientRect();hl.style.cssText=`opacity:1;width:${r.width}px;height:${r.height}px;transform:translate(${r.left-p.left}px,${r.top-p.top}px)`};
nv.addEventListener('mouseover',e=>{const t=e.target.closest('.top');if(t)mv(t)});nv.addEventListener('focusin',e=>{const t=e.target.closest('.top');if(t)mv(t)});
nv.addEventListener('mouseleave',()=>hl.style.opacity=0);nv.addEventListener('focusout',()=>hl.style.opacity=0);
nv.addEventListener('keydown',e=>{const t=e.target;if(e.key=='ArrowDown'&&t.classList.contains('top')){const l=t.parentElement.querySelector('.dd a');if(l){e.preventDefault();l.focus()}}if(e.key=='Escape')document.activeElement.blur()});
/* account menu */
const ab=$('#ab'),am=$('#am');
if(me){ab.classList.add('av');ab.textContent=me.name[0].toUpperCase();ab.setAttribute('aria-label','Account menu for '+me.name)}
am.innerHTML=me?`<div style="padding:10px 12px"><b>${esc(me.name)}</b><br><small style="color:var(--mut)">${esc(me.email)}</small></div><a href="account.html">My orders</a><a href="track.html">Track order</a><a href="account.html#saved">Saved items</a><button data-logout>Log out</button>`:`<div style="padding:10px 12px"><b>Welcome!</b><br><small style="color:var(--mut)">Log in to track orders and save favourites.</small></div><a class="btn" href="login.html" style="justify-content:center;margin:6px 0">Log in</a><a class="btn alt" href="signup.html" style="justify-content:center">Create account</a><a href="track.html" style="display:block;text-align:center;padding:10px">Track an order</a>`;
ab.onclick=e=>{e.stopPropagation();const o=!am.classList.contains('on');am.classList.toggle('on',o);ab.setAttribute('aria-expanded',o)};
/* search palette (press / or Ctrl+K) */
const cmd=$('#cmd'),cq=$('#cq'),cr=$('#cr'),POP=['Sunglasses','Backpack','Sneaker','Necklace','Hoodie','Cardigan'];let ai=-1;
const GO=[['Track my order','track.html'],['Shop sale','products.html?sale=1'],['New arrivals','products.html?new=1'],['My cart','cartPage.html']];
const sr=p=>`<a class="s" href="ProductDetails.html?id=${p.id}"><img src="${p.img[0]}" alt=""><span><b>${p.n}</b><small>${p.c} · ${p.s}</small></span><b>${fmt(p.p)}</b></a>`;
function cres(){const v=cq.value.trim().toLowerCase();let h;
if(!v)h=`<div class="hh">Quick links</div><div class="pp">${GO.map(([t,u])=>`<a class="chip" href="${u}">${t}</a>`).join('')}</div><div class="hh">Popular searches</div><div class="pp">${POP.map(t=>`<a class="chip" href="products.html?q=${t}">${t}</a>`).join('')}</div><div class="hh">Trending now</div>`+[...P].sort((a,b)=>b.rv-a.rv).slice(0,4).map(sr).join('');
else{const cs=CATS.filter(([c])=>c.toLowerCase().includes(v)),r=P.filter(p=>(p.n+' '+p.c+' '+p.s).toLowerCase().includes(v));
h=(cs.length?'<div class="hh">Departments</div>'+cs.map(([c])=>`<a class="s" href="products.html?c=${c}"><span class="gi">→</span><span><b>${c}</b><small>${P.filter(p=>p.c==c).length} styles</small></span><b></b></a>`).join(''):'')+(r.length?`<div class="hh">${r.length} match${r.length>1?'es':''}</div>`+r.slice(0,6).map(sr).join('')+`<a class="all" href="products.html?q=${encodeURIComponent(v)}"><b>See all ${r.length} results for “${esc(v)}”</b></a>`:`<div class="empty" style="padding:24px">No match for “${esc(v)}”. Try “bag” or “ring”.</div>`)}
cr.innerHTML=h;ai=-1}
const openCmd=()=>{shut();$('#ov').classList.add('on');cmd.classList.add('on');cq.value='';cres();setTimeout(()=>cq.focus(),60)},closeCmd=()=>{cmd.classList.remove('on');$('#ov').classList.remove('on')};
cq.addEventListener('input',cres);
cq.addEventListener('keydown',e=>{const it=[...cr.querySelectorAll('a.s,a.all')];
if(e.key=='ArrowDown'||e.key=='ArrowUp'){e.preventDefault();if(!it.length)return;ai=(ai+(e.key=='ArrowDown'?1:-1)+it.length)%it.length;it.forEach((x,i)=>x.classList.toggle('act',i==ai))}
else if(e.key=='Enter'){e.preventDefault();if(ai>=0&&it[ai])location.href=it[ai].getAttribute('href');else if(cq.value.trim())location.href='products.html?q='+encodeURIComponent(cq.value.trim())}});
document.addEventListener('keydown',e=>{const typing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
if((e.key=='/'&&!typing)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()=='k')){e.preventDefault();openCmd()}
if(e.key=='Escape'){closeCmd();am.classList.remove('on')}});
/* mobile drawer + dock */
const mn=document.createElement('aside');mn.className='dr lf mnav';mn.setAttribute('aria-label','Menu');
mn.innerHTML=`<button class="x" aria-label="Close menu">✕</button><a class="logo" href="index.html"><i>RT</i><span>RT_Fashion World</span></a><form id="mq2" style="margin:14px 0"><input type="search" placeholder="Search products" aria-label="Search" style="width:100%;padding:12px 16px;border-radius:99px;border:1.5px solid var(--ln);font:inherit"></form><div class="ls">${CATS.map(([c])=>`<details><summary>${c}</summary><div class="sl"><a href="products.html?c=${c}"><b>All ${c}</b></a>${SUBS(c).map(([n,k])=>`<a href="${sub(c,n)}">${n}<small>${k}</small></a>`).join('')}</div></details>`).join('')}<a class="mt" href="products.html?new=1">New in</a><a class="mt" href="products.html?sale=1" style="color:var(--pk)">Sale</a><a class="mt" href="track.html">Track order</a><a class="mt" href="about.html">About us</a><a class="mt" href="contact.html">Contact</a><a class="mt" href="${me?'account.html':'login.html'}">${me?'My account':'Log in / Sign up'}</a></div>`;
document.body.appendChild(mn);$('#mb').onclick=()=>open(mn);
$('#mq2').onsubmit=e=>{e.preventDefault();location.href='products.html?q='+encodeURIComponent(e.target.querySelector('input').value.trim())};
new MutationObserver(()=>$('#mb').setAttribute('aria-expanded',mn.classList.contains('on'))).observe(mn,{attributes:true,attributeFilter:['class']});
document.querySelectorAll('.dock a[data-p]').forEach(a=>a.dataset.p==pg&&a.classList.add('on'));
/* hide on scroll down, show on scroll up */
const fh=$('#fh');let ly=0;const sc=()=>{const y=scrollY;fh.classList.toggle('sc',y>20);if(y<=240||y<ly-4)fh.classList.remove('hid');else if(y>ly+4&&!fh.matches(':hover,:focus-within'))fh.classList.add('hid');ly=y};addEventListener('scroll',sc,{passive:true});sc();
/* badges + shop type chips (wrap render) */
const bump=s=>{const e=document.querySelector(s);if(!e)return;if(e._v!==undefined&&e._v!==e.textContent){e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}e._v=e.textContent};
const R0=render;render=function(){if(F.u&&!P.some(p=>p.s==F.u&&(F.c=='All'||p.c==F.c)))F.u='';R0();
if(SH){const s=F.c=='All'?[]:SUBS(F.c);$('#fub').style.display=s.length?'':'none';$('#fu').innerHTML=s.map(([n])=>`<button class="chip ${F.u==n?'on':''}" data-u="${n}">${n}</button>`).join('');
$('#st').textContent=F.nw?'New in':F.o&&F.c=='All'?'Sale':(F.c=='All'?'All products':F.c)+(F.u?' · '+F.u:'');$('#qc').innerHTML=F.q?`<button class="chip on" data-cq>“${esc(F.q)}” ✕</button>`:''}
['#cc','#wc'].forEach(s=>{const e=$(s);e.style.display=e.textContent=='0'?'none':''});
document.querySelectorAll('[data-cnt]').forEach(e=>{const n=$(e.dataset.cnt=='c'?'#cc':'#wc').textContent;e.textContent=n;e.style.display=n=='0'?'none':''});bump('#cc');bump('#wc')};
document.addEventListener('click',e=>{const t=e.target,b=t.closest('[data-eye]');if(b){const i=$(b.dataset.eye);i.type=i.type=='password'?'text':'password';b.textContent=i.type=='password'?'Show':'Hide'}
const a=t.closest('[data-act]');if(a){const k=a.dataset.act;k=='search'?openCmd():k=='cart'?$('#cb').click():$('#wb').click()}
if(t.id=='ov')closeCmd();
if(t.closest('[data-logout]')||t.id=='lo'){sv('rts',null);location.href='index.html'}
const z=t.closest('.gal .big');if(z)z.classList.toggle('z');
const u=t.closest('[data-u]');if(u){F.u=F.u==u.dataset.u?'':u.dataset.u;F.n=24;render()}
if(t.closest('[data-cq]')){F.q='';F.n=24;render()}
if(t.closest('.cc')){try{navigator.clipboard.writeText('RT10')}catch(x){}toast('Code RT10 copied. Apply it in your cart.')}
if(!t.closest('.acc')){am.classList.remove('on');ab.setAttribute('aria-expanded','false')}});
document.addEventListener('mousemove',e=>{const z=e.target.closest('.gal .big.z');if(z){const r=z.getBoundingClientRect();z.firstElementChild.style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%'}});

const pdesc=p=>`${p.n} is part of our ${p.c} collection. Easy to style and comfortable all day, in ${p.sz.length>1?p.sz.length+' sizes':'one size'} and 3 colours. Free exchange within 15 days.`;
if(SH){if(U.get('c'))F.c=U.get('c');if(U.get('u'))F.u=U.get('u');if(U.get('new'))F.nw=true;if(U.get('q')){F.q=U.get('q').toLowerCase();$('#q').value=U.get('q')}if(U.get('sale')){F.o=true;$('#so').checked=true}render()}
if(pg=='pd'){const p=pid(+U.get('id'))||P[0];document.title=p.n+' | RT_Fashion World';window.PDT=$('#pd');quick(p.id);
const R=[['Aanya','Fits true to size and feels great.'],['Rohan','Better quality than I expected for the price.'],['Meera','Arrived fast and the colour matches the photos.']];
$('#pdx').innerHTML=`<div class="card"><h3 class="dsp">About this ${p.s.toLowerCase()}</h3><p>${pdesc(p)}</p></div><div class="card" style="margin-top:14px"><h3 class="dsp">Reviews (${p.rv})</h3>${R.map(r=>`<p><b>${r[0]}</b> ★★★★★<br>${r[1]}</p>`).join('')}</div>`;
$('#rel').innerHTML=P.filter(x=>x.c==p.c&&x.id!=p.id).slice(0,4).map(card).join('')}
if(pg=='cart'){window.CPT=$('#cpg');drawer()}
if(pg=='login')$('#lf').onsubmit=e=>{e.preventDefault();const em=$('#le').value.trim().toLowerCase(),u=users().find(x=>x.e==em&&x.p==btoa($('#lp').value));
if(!/^\S+@\S+\.\S+$/.test(em))return $('#lm').textContent='Enter a valid email address.';if(!u)return $('#lm').textContent='Email or password is incorrect. Check them or create an account.';
sv('rts',{name:u.n,email:u.e});location.href=U.get('next')||'index.html'};
if(pg=='signup'){const pw=$('#sp');pw.oninput=()=>{const v=pw.value,s=(v.length>=8)+/[A-Z]/.test(v)+/[0-9]/.test(v)+/[^A-Za-z0-9]/.test(v);$('#sb').style.width=s*25+'%';$('#sb').style.background=['#d6204f','#d6204f','#f0a020','#5fd3a6','#2fb67f'][s]};
$('#sf').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target)),em=f.email.trim().toLowerCase();let m='';
if(f.name.trim().length<2)m='Enter your full name.';else if(!/^\S+@\S+\.\S+$/.test(em))m='Enter a valid email address.';else if(!/^[0-9]{10}$/.test(f.phone))m='Phone must be 10 digits.';else if(f.pw.length<8||!/[0-9]/.test(f.pw))m='Password needs 8+ characters and a number.';else if(f.pw!=f.pw2)m='Passwords do not match.';else if(!f.terms)m='Please accept the terms.';else if(users().some(u=>u.e==em))m='This email already has an account. Log in instead.';
$('#sg').textContent=m;if(m)return;sv('rtu',[...users(),{n:f.name.trim(),e:em,p:btoa(f.pw),h:f.phone}]);sv('rts',{name:f.name.trim(),email:em});toast('Account created. Welcome!');setTimeout(()=>location.href='index.html',900)}}
if(pg=='ct')$('#cm').onsubmit=e=>{e.preventDefault();const m=ld('rtm',[]);m.push({...Object.fromEntries(new FormData(e.target)),ts:Date.now()});sv('rtm',m);e.target.reset();toast('Message sent. We reply within 24 hours.')};
if(pg=='ab'){const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target,to=+el.dataset.n;let n=0;const t=setInterval(()=>{n=Math.min(to,n+Math.ceil(to/40));el.textContent=n.toLocaleString('en-IN')+(el.dataset.s||'');if(n>=to)clearInterval(t)},30);io.unobserve(el)}));document.querySelectorAll('[data-n]').forEach(e=>io.observe(e))}
/* ---------- orders: checkout, tracking, invoice, account ---------- */
const STG=['Order placed','Packed','Shipped','Out for delivery','Delivered'],STD=['We have received your order.','Your items are packed and sealed.','Handed over to the RT Express courier.','The courier is on the way to you.','Delivered. Enjoy your new look!'];
const fD=t=>new Date(t).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'}),fT=t=>new Date(t).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'});
const norm=o=>{o.items=(o.items||[]).map(i=>{const p=pid(i.id)||{};return{...i,p:i.p||p.p||0,n:i.n||p.n||'Item',img:i.img||(p.img&&p.img[0])||''}});o.sub=o.sub??o.items.reduce((a,i)=>a+i.p*i.q,0);o.disc=o.disc||0;o.ship=o.ship||0;o.fee=o.fee||0;o.t=o.t??(o.sub-o.disc+o.ship+o.fee);o.addr=o.addr||{};o.pay=o.pay||{m:'cod',d:'Cash on delivery'};o.dl=o.dl||'std';o.ev=o.ev||{};o.tr=o.tr||'RTX'+String(o.ts).slice(-9);return o};
const orders=()=>ld('rto',[]).map(norm),saveO=a=>sv('rto',a),UNIT=o=>864e5*(o.dl=='exp'?.5:1);
const stage=o=>o.cx?-1:Math.min(4,Math.max(o.st||0,Math.floor((Date.now()-o.ts)/UNIT(o)))),stT=(o,i)=>o.ev[i]||o.ts+i*UNIT(o),eta=o=>o.ts+(o.dl=='exp'?2:5)*864e5;
const upd=(id,fn)=>{const a=orders(),o=a.find(x=>x.id==id);if(o){fn(o);saveO(a)}return o};
const confetti=()=>{for(let i=0;i<60;i++){const c=document.createElement('i');c.className='cf';c.style.cssText=`left:${Math.random()*100}vw;background:${['#FF5D8F','#8f6bff','#FFD36B','#5fd3a6'][i%4]};animation-delay:${Math.random()*.8}s`;document.body.appendChild(c);setTimeout(()=>c.remove(),3600)}};
const thumbs=o=>`<div class="thr">${o.items.map(i=>`<img src="${i.img}" title="${esc(i.n)} · ${i.z} x ${i.q}" style="filter:${TN[i.c][1]}" alt="${esc(i.n)}">`).join('')}</div>`;
const addr=o=>`${esc(o.addr.n||'')}<br>${esc(o.addr.a1||'')}<br>${esc(o.addr.city||'')}, ${esc(o.addr.st||'')} ${esc(o.addr.pin||'')}<br>Phone: ${esc(o.addr.ph||'')}`;
/* ---------- CHECKOUT ---------- */
if(pg=='ck'){const root=$('#ckp');
if(!cart.length)root.innerHTML='<div class="empty"><h2 class="dsp">Your cart is empty</h2><p>Add something first.</p><a class="btn" href="products.html">Shop now</a></div>';
else{
const STS='Andhra Pradesh,Assam,Bihar,Chhattisgarh,Delhi,Goa,Gujarat,Haryana,Himachal Pradesh,Jharkhand,Karnataka,Kerala,Madhya Pradesh,Maharashtra,Odisha,Punjab,Rajasthan,Tamil Nadu,Telangana,Uttar Pradesh,Uttarakhand,West Bengal,Jammu and Kashmir,Chandigarh,Puducherry,Other'.split(',');
const sa=ld('rta',{}),u0=users().find(x=>me&&x.e==me.email)||{};
const val={n:sa.n||(me&&me.name)||'',ph:sa.ph||u0.h||'',em:sa.em||(me&&me.email)||'',a1:sa.a1||'',city:sa.city||'',st:sa.st||'',pin:sa.pin||''};
const fd=(id,l,a='')=>`<label class="fd" id="f_${id}">${l}<input name="${id}" value="${esc(val[id]||'')}" ${a}><span class="er" role="alert"></span></label>`;
const op=(n,v,t,s,c)=>`<label class="opt"><input type="radio" name="${n}" value="${v}" ${c?'checked':''}><span><b>${t}</b><br><small>${s}</small></span></label>`;
root.innerHTML=`<form id="ckf2" class="cko" novalidate><div>
<div class="cs"><h3><i>1</i>Delivery address</h3><div class="g2">${fd('n','Full name','autocomplete="name"')}${fd('ph','Mobile number','inputmode="numeric" maxlength="10" autocomplete="tel"')}</div>${fd('em','Email','type="email" autocomplete="email"')}${fd('a1','Address (house, street, area)','autocomplete="street-address"')}<div class="g2">${fd('city','City','autocomplete="address-level2"')}<label class="fd" id="f_st">State<select name="st"><option value="">Select state</option>${STS.map(s=>`<option ${s==val.st?'selected':''}>${s}</option>`).join('')}</select><span class="er" role="alert"></span></label></div>${fd('pin','Pincode','inputmode="numeric" maxlength="6" autocomplete="postal-code"')}</div>
<div class="cs"><h3><i>2</i>Delivery speed</h3>${op('dl','std','Standard delivery','3 to 5 days · free over ₹1,999, otherwise ₹99',1)}${op('dl','exp','Express delivery','1 to 2 days · ₹149')}</div>
<div class="cs"><h3><i>3</i>Payment</h3><div class="pm">${op('pm','upi','UPI','GPay, PhonePe, Paytm',1)}${op('pm','card','Card','Credit or debit')}${op('pm','cod','Cash on delivery','₹49 handling fee')}</div>
<div class="pn on" id="p_upi"><div class="ups">${['@okaxis','@ybl','@paytm','@oksbi'].map(s=>`<button type="button" data-ups="${s}">${s}</button>`).join('')}</div>${fd('up','UPI ID','placeholder="yourname@okaxis" autocomplete="off"')}<p class="note">You will get a payment request in your UPI app (demo: it is approved automatically).</p></div>
<div class="pn" id="p_card"><div class="card3d" id="c3"><div><div class="kf" id="kf"><div class="kt"><span class="chipk"></span><b id="kb">CARD</b></div><div class="kn" id="kn">•••• •••• •••• ••••</div><div class="kr"><span id="kh">YOUR NAME</span><span id="ke">MM/YY</span></div></div><div class="kb"><div class="stripe"></div><div class="cvw" id="kc">•••</div></div></div></div>
${fd('cn','Card number','inputmode="numeric" autocomplete="cc-number" placeholder="4242 4242 4242 4242"')}${fd('ch','Name on card','autocomplete="cc-name"')}<div class="g2">${fd('ce','Expiry (MM/YY)','inputmode="numeric" maxlength="5" placeholder="MM/YY" autocomplete="cc-exp"')}${fd('cv','CVV','type="password" inputmode="numeric" maxlength="4" autocomplete="cc-csc" placeholder="•••"')}</div><p class="note">Demo checkout: nothing is charged. Try 4242 4242 4242 4242 with any future date and CVV. Only the card brand and last 4 digits are saved.</p></div>
<div class="pn" id="p_cod"><p class="note">Pay in cash or UPI when your order arrives. A ₹49 handling fee is added.</p></div></div></div>
<aside class="cs" style="position:sticky;top:100px"><h3 class="dsp">Order summary</h3><div id="cks" class="cks"></div><p class="note" id="eta" style="margin:12px 0"></p><button class="btn" id="cbtn" style="width:100%;justify-content:center"></button><p style="text-align:center;margin:12px 0 0"><a href="cartPage.html" style="color:var(--pk);font-weight:600">Edit cart</a></p></aside></form>`;
const form=$('#ckf2'),g=n=>form.elements[n],E=(d=>new Date(Date.now()+d*864e5));
const sum=()=>{const dl=g('dl').value,pm=g('pm').value,T=tot(),ship=dl=='exp'?149:T.sh,fee=pm=='cod'?49:0,t=T.s-T.d+ship+fee;
$('#cks').innerHTML=cart.map(i=>{const p=pid(i.id);return `<div class="ci"><img src="${p.img[0]}" style="filter:${TN[i.c][1]}" alt=""><div><b>${p.n}</b><small>Size ${i.z} · ${TN[i.c][0]} · Qty ${i.q}</small></div><b>${fmt(p.p*i.q)}</b></div>`}).join('')+`<div style="margin-top:10px"><div class="row2"><span>Subtotal</span><span>${fmt(T.s)}</span></div>${T.d?`<div class="row2" style="color:var(--pk)"><span>Coupon RT10</span><span>-${fmt(T.d)}</span></div>`:''}<div class="row2"><span>Delivery</span><span>${ship?fmt(ship):'Free'}</span></div>${fee?`<div class="row2"><span>COD fee</span><span>${fmt(fee)}</span></div>`:''}<div class="row2 big2"><span>Total</span><span>${fmt(t)}</span></div></div>`;
$('#eta').textContent='Estimated delivery: '+fD(E(dl=='exp'?2:5));$('#cbtn').textContent=(pm=='cod'?'Place order':'Pay ')+(pm=='cod'?'':fmt(t))+(pm=='cod'?' · '+fmt(t):'');};
const brand=v=>{const d=v.replace(/\D/g,'');return /^4/.test(d)?'Visa':/^(5[1-5]|2[2-7])/.test(d)?'Mastercard':/^3[47]/.test(d)?'Amex':/^(60|65|81|82|508)/.test(d)?'RuPay':'Card'};
const luhn=d=>{let s=0,a=false;for(let i=d.length-1;i>=0;i--){let n=+d[i];if(a){n*=2;if(n>9)n-=9}s+=n;a=!a}return s%10==0};
const pv=()=>{const v=g('cn').value,b=brand(v);$('#kb').textContent=b.toUpperCase();$('#kn').textContent=v||'•••• •••• •••• ••••';$('#kh').textContent=g('ch').value||'YOUR NAME';$('#ke').textContent=g('ce').value||'MM/YY';$('#kc').textContent=g('cv').value.replace(/./g,'•')||'•••';
$('#kf').style.background={Visa:'linear-gradient(135deg,#1a4fd8,#6aa3ff)',Mastercard:'linear-gradient(135deg,#d6491f,#f5a623)',Amex:'linear-gradient(135deg,#0f8a6a,#5fd3a6)',RuPay:'linear-gradient(135deg,#3b2fa0,#f06a2d)'}[b]||''};
const panel=()=>{const pm=g('pm').value;['upi','card','cod'].forEach(k=>$('#p_'+k).classList.toggle('on',k==pm))};
form.addEventListener('change',()=>{panel();sum()});
form.addEventListener('input',e=>{const t=e.target;
if(t.name=='cn'){const am=brand(t.value)=='Amex',d=t.value.replace(/\D/g,'').slice(0,am?15:16);t.value=am?[d.slice(0,4),d.slice(4,10),d.slice(10)].filter(Boolean).join(' '):d.replace(/(.{4})(?=.)/g,'$1 ')}
if(t.name=='ce'){let d=t.value.replace(/\D/g,'').slice(0,4);if(d.length>2)d=d.slice(0,2)+'/'+d.slice(2);t.value=d}
if(t.name=='cv'||t.name=='ph'||t.name=='pin')t.value=t.value.replace(/\D/g,'').slice(0,t.name=='pin'?6:t.name=='ph'?10:4);
if(['cn','ch','ce','cv'].includes(t.name))pv();const f=t.closest('.fd');if(f)f.classList.remove('bad')});
g('cv').addEventListener('focus',()=>$('#c3').classList.add('fl'));g('cv').addEventListener('blur',()=>$('#c3').classList.remove('fl'));
form.addEventListener('click',e=>{const s=e.target.closest('[data-ups]');if(s){const i=g('up');i.value=i.value.split('@')[0]+s.dataset.ups;i.focus()}});
const setE=(id,m)=>{const f=$('#f_'+id);f.classList.toggle('bad',!!m);f.querySelector('.er').textContent=m||''};
const check=()=>{const v=n=>g(n).value.trim(),pm=g('pm').value,bad={};
if(v('n').length<2)bad.n='Enter your full name';if(!/^[6-9]\d{9}$/.test(v('ph')))bad.ph='Enter a valid 10-digit mobile number';if(!/^\S+@\S+\.\S+$/.test(v('em')))bad.em='Enter a valid email address';
if(v('a1').length<8)bad.a1='Enter your full address';if(v('city').length<2)bad.city='Enter your city';if(!g('st').value)bad.st='Choose your state';if(!/^[1-9]\d{5}$/.test(v('pin')))bad.pin='Enter a valid 6-digit pincode';
if(pm=='card'){const d=v('cn').replace(/\D/g,''),am=brand(d)=='Amex';if(d.length!=(am?15:16)||!luhn(d))bad.cn='Enter a valid card number';if(!/^[A-Za-z .'-]{2,}$/.test(v('ch')))bad.ch='Enter the name on your card';
const m=+v('ce').slice(0,2),y=2000+ +v('ce').slice(3,5),N=new Date();if(!/^\d\d\/\d\d$/.test(v('ce'))||m<1||m>12)bad.ce='Use MM/YY';else if(y<N.getFullYear()||(y==N.getFullYear()&&m<N.getMonth()+1))bad.ce='This card has expired';if(!new RegExp('^\\d{'+(am?4:3)+'}$').test(v('cv')))bad.cv=am?'4 digits':'3 digits'}
if(pm=='upi'&&!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v('up')))bad.up='Enter a valid UPI ID like name@okaxis';return bad};
form.onsubmit=e=>{e.preventDefault();['n','ph','em','a1','city','st','pin','up','cn','ch','ce','cv'].forEach(k=>setE(k,''));const bad=check(),ks=Object.keys(bad);
if(ks.length){ks.forEach(k=>setE(k,bad[k]));const f=$('#f_'+ks[0]);f.scrollIntoView({block:'center'});f.querySelector('input,select').focus();form.classList.remove('shake');void form.offsetWidth;form.classList.add('shake');toast('Please fix the highlighted fields');return}
const b=$('#cbtn'),pm=g('pm').value;b.disabled=true;b.innerHTML='<span class="spin"></span> '+(pm=='cod'?'Placing order…':'Processing payment…');setTimeout(()=>place(pm),pm=='cod'?600:1700)};
const place=pm=>{const v=n=>g(n).value.trim(),dl=g('dl').value,T=tot(),ship=dl=='exp'?149:T.sh,fee=pm=='cod'?49:0,all=orders();let id;do id='RT'+Math.floor(100000+Math.random()*900000);while(all.some(o=>o.id==id));
const d=v('cn').replace(/\D/g,''),pay=pm=='card'?{m:'card',d:brand(d)+' •••• '+d.slice(-4)}:pm=='upi'?{m:'upi',d:'UPI · '+v('up')}:{m:'cod',d:'Cash on delivery'};
const ad={n:v('n'),ph:v('ph'),em:v('em'),a1:v('a1'),city:v('city'),st:g('st').value,pin:v('pin')};
const o={id,ts:Date.now(),items:cart.map(i=>{const p=pid(i.id);return{...i,p:p.p,n:p.n,img:p.img[0]}}),sub:T.s,disc:T.d,cp,ship,fee,t:T.s-T.d+ship+fee,addr:ad,pay,dl,st:0,ev:{},tr:'RTX'+String(Math.floor(1e8+Math.random()*9e8))};
saveO([o,...all]);sv('rta',ad);cart=[];cp=null;sv('rtc',cart);sv('rtp',null);render();
root.innerHTML=`<div class="okb"><div class="tick"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1d9a6c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.500 4.500L19 7.500"/></svg></div><h2 class="dsp" style="font-size:42px">Thank you, ${esc(ad.n.split(' ')[0])}!</h2><p>Your order <b>${id}</b> is confirmed. A confirmation was sent to ${esc(ad.em)} (demo).</p>
<div class="okg"><div><small>Estimated delivery</small><b>${fD(eta(o))}</b></div><div><small>Total ${pm=='cod'?'to pay on delivery':'paid'}</small><b>${fmt(o.t)}</b></div><div><small>Ship to</small>${addr(o)}</div><div><small>Payment</small><b>${esc(pay.d)}</b></div></div>
<div class="rw"><a class="btn" href="track.html?id=${id}">Track order</a><a class="btn alt" href="invoice.html?id=${id}">Print invoice</a><a class="btn alt" href="products.html">Keep shopping</a></div></div>`;scrollTo(0,0);confetti()};
panel();sum();pv()}}
/* ---------- TRACKING ---------- */
if(pg=='tr'){const res=$('#tres'),inp=$('#ti'),find=v=>{v=v.trim().toUpperCase();return orders().find(o=>o.id==v||o.tr==v)};
const show=o=>{const s=stage(o),paid=o.pay.m!='cod';
const tl=o.cx?`<div class="cxb"><b>Order cancelled</b> on ${fT(o.cxT)}. ${paid?'Your refund of '+fmt(o.t)+' to '+esc(o.pay.d)+' will arrive in 3 to 5 working days.':'No payment was taken.'}</div>`:`<div class="tl2">${STG.map((t,i)=>`<div class="st2 ${i<=s?'done':''} ${i==s?'cur':''} ${i<s?'lk':''}" style="--i:${i}"><i>${i<=s?'✓':i+1}</i><b>${t}</b><small>${i<=s?fT(stT(o,i)):'Expected '+fD(stT(o,i))}</small><p>${STD[i]}</p></div>`).join('')}</div>`;
res.innerHTML=`<div class="two2"><div class="card"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><div><h3 class="dsp" style="font-size:26px">Order ${o.id}</h3><small style="color:var(--mut)">Placed ${fT(o.ts)}</small></div><span class="badge ${o.cx?'x':''}">${o.cx?'Cancelled':STG[s]}</span></div>${o.cx||s==4?'':`<p class="note" style="margin-top:14px">Estimated delivery: <b>${fD(eta(o))}</b> · Tracking no. <b>${o.tr}</b></p>`}${tl}
<div class="rw" style="justify-content:flex-start;margin-top:12px">${!o.cx&&s<4?'<button class="btn alt" data-adv="'+o.id+'">Simulate next step (demo)</button>':''}${!o.cx&&s<2?'<button class="btn alt" data-cx="'+o.id+'" style="color:#d6204f">Cancel order</button>':''}</div></div>
<div style="display:grid;gap:14px"><div class="card"><h3 class="dsp">Delivery details</h3><p style="margin:0">${addr(o)}</p><p style="margin:12px 0 0"><b>Courier:</b> RT Express · ${o.dl=='exp'?'Express':'Standard'}<br><b>Payment:</b> ${esc(o.pay.d)} (${paid?'Paid':'Pay on delivery'})</p></div><div class="card"><h3 class="dsp">${o.items.length} item${o.items.length>1?'s':''} · ${fmt(o.t)}</h3>${thumbs(o)}<div class="rw" style="justify-content:flex-start;margin-top:14px"><a class="btn" href="invoice.html?id=${o.id}">View and print invoice</a></div></div></div></div>`};
const look=v=>{const o=find(v);if(!o)return res.innerHTML=`<div class="card empty"><h3 class="dsp">No order found for “${esc(v)}”</h3><p>Check the order ID from your confirmation. Orders placed in this browser can be tracked here.</p></div>`;inp.value=o.id;show(o)};
$('#tf').onsubmit=e=>{e.preventDefault();look(inp.value)};
const rc=orders().slice(0,5);$('#rcnt').innerHTML=rc.length?'<small style="color:var(--mut)">Your recent orders:</small> '+rc.map(o=>`<button class="chip" data-t="${o.id}">${o.id}</button>`).join(''):'';
res.addEventListener('click',e=>{const a=e.target.closest('[data-adv]'),c=e.target.closest('[data-cx]');
if(a){const o=upd(a.dataset.adv,o=>{o.st=Math.min(4,stage(o)+1);o.ev[o.st]=Date.now()});toast('Status updated: '+STG[stage(o)]);show(o)}
if(c&&confirm('Cancel this order?')){const o=upd(c.dataset.cx,o=>{o.cx=true;o.cxT=Date.now()});toast('Order cancelled');show(o)}});
document.addEventListener('click',e=>{const t=e.target.closest('[data-t]');if(t)look(t.dataset.t)});
if(U.get('id')){inp.value=U.get('id');look(U.get('id'))}}
/* ---------- INVOICE ---------- */
if(pg=='iv'){const root=$('#ivb'),all=orders(),o=all.find(x=>x.id==(U.get('id')||'').toUpperCase());
const W=n=>{const a='One Two Three Four Five Six Seven Eight Nine Ten Eleven Twelve Thirteen Fourteen Fifteen Sixteen Seventeen Eighteen Nineteen'.split(' '),b='Twenty Thirty Forty Fifty Sixty Seventy Eighty Ninety'.split(' '),f=n=>n<20?a[n-1]:b[(n/10|0)-2]+(n%10?' '+a[n%10-1]:''),g=n=>n>99?a[(n/100|0)-1]+' Hundred'+(n%100?' '+f(n%100):''):f(n);let r='';[[1e7,'Crore'],[1e5,'Lakh'],[1e3,'Thousand']].forEach(([d,l])=>{const c=Math.floor(n/d)%100;if(c)r+=g(c)+' '+l+' '});if(n%1000)r+=g(n%1000);return(r.trim()||'Zero')+' Rupees Only'};
if(!o)root.innerHTML=`<div class="card empty"><h3 class="dsp">Invoice not found</h3><p>${all.length?'Pick one of your orders:':'Place an order first.'}</p><div class="rw">${all.map(x=>`<a class="btn alt" href="invoice.html?id=${x.id}">${x.id}</a>`).join('')}</div></div>`;
else{const tax=o.t-o.t/1.12,paid=o.pay.m!='cod';
root.innerHTML=`<div class="ivbar noprint"><a class="btn alt" href="account.html">← My orders</a><div class="rw"><a class="btn alt" href="track.html?id=${o.id}">Track order</a><button class="btn" id="pr">Print / Save as PDF</button></div></div>
<article class="inv"><div class="ivh"><div><div class="mk">RT</div><h2>RT_Fashion World</h2><small>Your store address, City, State 000000<br>GSTIN: 00AAAAA0000A1Z0 · hello@rtfashionworld.com</small></div><div class="ivr"><h1>TAX INVOICE</h1><b>Invoice no. INV-${o.id}</b><br>Order ${o.id}<br>Date: ${fD(o.ts)}<br><span class="paid ${paid?'':'due'}">${paid?'PAID':'PAY ON DELIVERY'}</span></div></div>
<div class="ivp"><div><h5>Billed to</h5><p>${addr(o)}<br>${esc(o.addr.em||'')}</p></div><div><h5>Shipped to</h5><p>${addr(o)}<br>${o.dl=='exp'?'Express':'Standard'} delivery</p></div></div>
<table><thead><tr><th>#</th><th>Item</th><th>Size</th><th>Colour</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead><tbody>${o.items.map((i,k)=>`<tr><td>${k+1}</td><td>${esc(i.n)}</td><td>${i.z}</td><td>${TN[i.c][0]}</td><td class="r">${i.q}</td><td class="r">${fmt(i.p)}</td><td class="r">${fmt(i.p*i.q)}</td></tr>`).join('')}</tbody></table>
<div class="ivt"><div><span>Subtotal</span><span>${fmt(o.sub)}</span></div>${o.disc?`<div><span>Coupon ${o.cp||'RT10'}</span><span>-${fmt(o.disc)}</span></div>`:''}<div><span>Delivery</span><span>${o.ship?fmt(o.ship):'Free'}</span></div>${o.fee?`<div><span>COD handling fee</span><span>${fmt(o.fee)}</span></div>`:''}<div class="g"><span>Grand total</span><span>${fmt(o.t)}</span></div><div style="color:var(--mut);font-size:13px"><span>Taxable value</span><span>${fmt(Math.round(o.t-tax))}</span></div><div style="color:var(--mut);font-size:13px"><span>CGST 6% + SGST 6% (included)</span><span>${fmt(Math.round(tax))}</span></div></div>
<p class="words"><b>Amount in words:</b> ${W(Math.round(o.t))}</p>
<div class="ivs"><div><h5>Payment</h5>${esc(o.pay.d)}<br>Status: ${paid?'Paid in full':'To be paid on delivery'}</div><div><h5>Notes</h5>Free size exchange within 15 days of delivery. Keep this invoice for returns.</div></div><p class="foot">Thank you for shopping at RT_Fashion World. This is a computer-generated invoice.</p></article>`;
$('#pr').onclick=()=>print();if(U.get('print'))setTimeout(print,500)}}
/* ---------- ACCOUNT ---------- */
if(pg=='acct'){if(!me)location.href='login.html?next=account.html';else{$('#ah').textContent='Hello, '+me.name;$('#ae').textContent=me.email;
const all=orders();$('#ol').innerHTML=all.length?all.map(o=>{const s=stage(o);return `<div class="card oc"><div class="hd" style="margin:0 0 10px"><div><b>Order ${o.id}</b><br><small style="color:var(--mut)">${fT(o.ts)} · ${fmt(o.t)} · ${esc(o.pay.d)}</small></div><span class="badge ${o.cx?'x':''}">${o.cx?'Cancelled':STG[s]}</span></div>${thumbs(o)}<div class="rw"><a class="btn" href="track.html?id=${o.id}">Track</a><a class="btn alt" href="invoice.html?id=${o.id}">Invoice</a><button class="btn alt" data-re="${o.id}">Order again</button></div></div>`}).join(''):'<div class="empty">No orders yet. <a href="products.html" style="color:var(--pk)">Start shopping</a></div>';
const w=P.filter(p=>wish.includes(p.id));$('#sv2').innerHTML=w.length?w.map(card).join(''):'<div class="empty" style="grid-column:1/-1">Tap the heart on any product to save it here.</div>';
document.addEventListener('click',e=>{const r=e.target.closest('[data-re]');if(!r)return;const o=all.find(x=>x.id==r.dataset.re);o.items.forEach(i=>{const k=`${i.id}|${i.z}|${i.c}`,x=cart.find(c=>c.k==k);x?x.q+=i.q:cart.push({k,id:i.id,z:i.z,c:i.c,q:i.q})});sv('rtc',cart);render();toast('Items added to your cart')})}}
