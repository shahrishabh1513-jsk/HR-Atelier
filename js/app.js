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
/* ---------- shared: navbar, auth, page logic ---------- */
const SH=!!document.getElementById('gr'),pg=document.body.dataset.page,U=new URLSearchParams(location.search);
const users=()=>ld('rtu',[]),me=ld('rts',null),esc=s=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const SUBS=c=>{const m={};P.filter(p=>p.c==c).forEach(p=>m[p.s]=(m[p.s]||0)+1);return Object.entries(m).sort((a,b)=>b[1]-a[1])};
const FEAT=c=>[...P.filter(p=>p.c==c)].sort((a,b)=>b.rv-a.rv)[0];
const CH='<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
const onC=c=>SH&&U.get('c')==c&&!U.get('sale')&&!U.get('new')?' aria-current="page"':'';
$('#nv').innerHTML=CATS.map(([c,bg])=>{const s=SUBS(c),f=FEAT(c);return `<li class="has"><a class="top" href="products.html?c=${c}" aria-haspopup="true"${onC(c)}>${c}${CH}</a><div class="mega"><div class="w mg"><div><h5>Shop ${c.toLowerCase()} by type</h5><div class="cl">${s.map(([n,k])=>`<a class="l" href="products.html?c=${c}&u=${encodeURIComponent(n)}">${n}<small>${k}</small></a>`).join('')}<a class="l" href="products.html?c=${c}"><b>View all ${c}</b></a></div></div><a class="ft" href="ProductDetails.html?id=${f.id}" style="background:${bg}"><img src="${f.img[0]}" alt=""><div><small>Top pick</small><b>${f.n}</b><span>${fmt(f.p)}</span></div></a></div></div></li>`}).join('')
+`<li><a class="top" href="products.html?new=1"${SH&&U.get('new')?' aria-current="page"':''}>New in</a></li><li><a class="top sl" href="products.html?sale=1"${SH&&U.get('sale')?' aria-current="page"':''}>Sale</a></li>`;
document.querySelectorAll('.ann a[data-p]').forEach(a=>a.dataset.p==pg&&a.setAttribute('aria-current','page'));
$('#nv').addEventListener('keydown',e=>{const t=e.target;if(e.key=='ArrowDown'&&t.classList.contains('top')){const l=t.parentElement.querySelector('.mega a');if(l){e.preventDefault();l.focus()}}if(e.key=='Escape'&&document.activeElement)document.activeElement.blur()});
/* announcement bar */
const AN=['Free shipping on orders over ₹1,999','Use code <b class="cc" title="Click to copy">RT10</b> for 10% off your cart','Free size exchange within 15 days'];let ak=0;const am2=$('#ann2');
const tick=()=>{am2.style.opacity=0;setTimeout(()=>{am2.innerHTML=AN[ak++%AN.length];am2.style.opacity=1},300)};tick();setInterval(tick,4500);
if(ld('rtan',0))$('#ann').classList.add('hide');$('#annx').onclick=()=>{$('#ann').classList.add('hide');sv('rtan',1)};
/* account menu */
const ab=$('#ab'),am=$('#am');
if(me){ab.classList.add('av');ab.textContent=me.name[0].toUpperCase();ab.setAttribute('aria-label','Account menu for '+me.name)}
am.innerHTML=me?`<div style="padding:10px 12px"><b>${esc(me.name)}</b><br><small style="color:var(--mut)">${esc(me.email)}</small></div><a href="account.html">My orders</a><a href="account.html#saved">Saved items</a><a href="cartPage.html">My cart</a><button data-logout>Log out</button>`:`<div style="padding:10px 12px"><b>Welcome!</b><br><small style="color:var(--mut)">Log in to track orders and save favourites.</small></div><a class="btn" href="login.html" style="justify-content:center;margin:6px 0">Log in</a><a class="btn alt" href="signup.html" style="justify-content:center">Create account</a>`;
ab.onclick=e=>{e.stopPropagation();const o=!am.classList.contains('on');am.classList.toggle('on',o);ab.setAttribute('aria-expanded',o);sg.classList.remove('on')};
/* live search */
const q=$('#q'),sg=$('#sg2'),POP=['Sunglasses','Backpack','Sneaker','Necklace','Hoodie','Cardigan'];let ai=-1;
const sr=p=>`<a class="s" href="ProductDetails.html?id=${p.id}"><img src="${p.img[0]}" alt=""><span><b>${p.n}</b><small>${p.c} · ${p.s}</small></span><b>${fmt(p.p)}</b></a>`;
function sug(){const v=q.value.trim().toLowerCase();let h;
if(!v)h='<div class="hh">Popular searches</div><div class="pp">'+POP.map(t=>`<a class="chip" href="products.html?q=${t}">${t}</a>`).join('')+'</div><div class="hh">Trending now</div>'+[...P].sort((a,b)=>b.rv-a.rv).slice(0,4).map(sr).join('');
else{const r=P.filter(p=>(p.n+' '+p.c+' '+p.s).toLowerCase().includes(v));h=r.length?`<div class="hh">${r.length} match${r.length>1?'es':''}</div>`+r.slice(0,6).map(sr).join('')+`<a class="all" href="products.html?q=${encodeURIComponent(v)}"><b>See all ${r.length} results for “${esc(v)}”</b></a>`:`<div class="empty" style="padding:20px">No match for “${esc(v)}”. Try “bag” or “ring”.</div>`}
sg.innerHTML=h;sg.classList.add('on');am.classList.remove('on');ai=-1}
q.addEventListener('input',sug);q.addEventListener('focus',sug);
q.addEventListener('keydown',e=>{const it=[...sg.querySelectorAll('a.s,a.all')];
if(e.key=='ArrowDown'||e.key=='ArrowUp'){e.preventDefault();if(!sg.classList.contains('on'))sug();if(!it.length)return;ai=(ai+(e.key=='ArrowDown'?1:-1)+it.length)%it.length;it.forEach((x,i)=>x.classList.toggle('act',i==ai))}
else if(e.key=='Enter'){if(ai>=0&&it[ai]){e.preventDefault();location.href=it[ai].getAttribute('href')}else if(!SH&&q.value.trim())location.href='products.html?q='+encodeURIComponent(q.value.trim());else sg.classList.remove('on')}
else if(e.key=='Escape'){sg.classList.remove('on');q.blur()}});
/* mobile drawer */
const mn=document.createElement('aside');mn.className='dr lf mnav';mn.setAttribute('aria-label','Menu');
mn.innerHTML=`<button class="x" aria-label="Close menu">✕</button><a class="logo" href="index.html"><i>RT</i><span>RT_Fashion World</span></a><form id="mq2" style="margin:14px 0"><input type="search" placeholder="Search products" aria-label="Search" style="width:100%;padding:12px 16px;border-radius:99px;border:1.5px solid var(--ln);font:inherit"></form><div class="ls">${CATS.map(([c])=>`<details><summary>${c}</summary><div class="sl"><a href="products.html?c=${c}"><b>All ${c}</b></a>${SUBS(c).map(([n,k])=>`<a href="products.html?c=${c}&u=${encodeURIComponent(n)}">${n}<small>${k}</small></a>`).join('')}</div></details>`).join('')}<a class="mt" href="products.html?new=1">New in</a><a class="mt" href="products.html?sale=1" style="color:var(--pk)">Sale</a><a class="mt" href="about.html">About us</a><a class="mt" href="contact.html">Contact</a><a class="mt" href="${me?'account.html':'login.html'}">${me?'My account':'Log in / Sign up'}</a></div>`;
document.body.appendChild(mn);$('#mb').onclick=()=>open(mn);
$('#mq2').onsubmit=e=>{e.preventDefault();location.href='products.html?q='+encodeURIComponent(e.target.querySelector('input').value.trim())};
new MutationObserver(()=>$('#mb').setAttribute('aria-expanded',mn.classList.contains('on'))).observe(mn,{attributes:true,attributeFilter:['class']});
/* scroll: shrink, shadow, progress */
const hdr=document.querySelector('header'),hp=$('#hp');
const sc=()=>{hdr.classList.toggle('sc',scrollY>10);const h=document.documentElement;hp.style.width=(scrollY/Math.max(1,h.scrollHeight-innerHeight)*100)+'%'};addEventListener('scroll',sc,{passive:true});sc();
/* badge bump + shop type chips (wrap render) */
const bump=s=>{const e=document.querySelector(s);if(!e)return;if(e._v!==undefined&&e._v!==e.textContent){e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}e._v=e.textContent};
const R0=render;render=function(){if(F.u&&!P.some(p=>p.s==F.u&&(F.c=='All'||p.c==F.c)))F.u='';R0();
if(SH){const s=F.c=='All'?[]:SUBS(F.c);$('#fub').style.display=s.length?'':'none';$('#fu').innerHTML=s.map(([n])=>`<button class="chip ${F.u==n?'on':''}" data-u="${n}">${n}</button>`).join('');
$('#st').textContent=F.nw?'New in':F.o&&F.c=='All'?'Sale':(F.c=='All'?'All products':F.c)+(F.u?' · '+F.u:'')}bump('#cc');bump('#wc')};
document.addEventListener('click',e=>{const b=e.target.closest('[data-eye]');if(b){const i=$(b.dataset.eye);i.type=i.type=='password'?'text':'password';b.textContent=i.type=='password'?'Show':'Hide'}
if(e.target.closest('[data-logout]')||e.target.id=='lo'){sv('rts',null);location.href='index.html'}
const z=e.target.closest('.gal .big');if(z)z.classList.toggle('z');
const u=e.target.closest('[data-u]');if(u){F.u=F.u==u.dataset.u?'':u.dataset.u;F.n=24;render()}
if(e.target.closest('.cc')){try{navigator.clipboard.writeText('RT10')}catch(x){}toast('Code RT10 copied. Apply it in your cart.')}
if(!e.target.closest('.acc')){am.classList.remove('on');ab.setAttribute('aria-expanded','false')}if(!e.target.closest('.srch'))sg.classList.remove('on')});
document.addEventListener('mousemove',e=>{const z=e.target.closest('.gal .big.z');if(z){const r=z.getBoundingClientRect();z.firstElementChild.style.transformOrigin=((e.clientX-r.left)/r.width*100)+'% '+((e.clientY-r.top)/r.height*100)+'%'}});
document.addEventListener('keydown',e=>{if(e.key=='Escape'){am.classList.remove('on');sg.classList.remove('on')}});

const pdesc=p=>`${p.n} is part of our ${p.c} collection. Easy to style and comfortable all day, in ${p.sz.length>1?p.sz.length+' sizes':'one size'} and 3 colours. Free exchange within 15 days.`;
if(SH){if(U.get('c'))F.c=U.get('c');if(U.get('u'))F.u=U.get('u');if(U.get('new'))F.nw=true;if(U.get('q')){F.q=U.get('q').toLowerCase();$('#q').value=U.get('q')}if(U.get('sale')){F.o=true;$('#so').checked=true}render()}
if(pg=='pd'){const p=pid(+U.get('id'))||P[0];document.title=p.n+' | RT_Fashion World';window.PDT=$('#pd');quick(p.id);
const R=[['Aanya','Fits true to size and feels great.'],['Rohan','Better quality than I expected for the price.'],['Meera','Arrived fast and the colour matches the photos.']];
$('#pdx').innerHTML=`<div class="card"><h3 class="dsp">About this ${p.s.toLowerCase()}</h3><p>${pdesc(p)}</p></div><div class="card" style="margin-top:14px"><h3 class="dsp">Reviews (${p.rv})</h3>${R.map(r=>`<p><b>${r[0]}</b> ★★★★★<br>${r[1]}</p>`).join('')}</div>`;
$('#rel').innerHTML=P.filter(x=>x.c==p.c&&x.id!=p.id).slice(0,4).map(card).join('')}
if(pg=='cart'){window.CPT=$('#cpg');drawer()}
if(pg=='ck'){if(!cart.length)$('#ckf').innerHTML='<div class="empty"><h2 class="dsp">Your cart is empty</h2><p>Add something first.</p><a class="btn" href="products.html">Shop now</a></div>';
else{window.CKT=$('#ckf');checkout();if(me)document.querySelector('#cf input').value=me.name;const T=tot();
$('#sm').innerHTML='<h3 class="dsp">Order summary</h3>'+cart.map(i=>{const p=pid(i.id);return `<div class="ci" style="grid-template-columns:60px 1fr auto"><img src="${im(p.img[0])}" style="width:60px;height:76px;filter:${TN[i.c][1]}" alt=""><div><b>${p.n}</b><small>Size ${i.z} · Qty ${i.q}</small></div><b>${fmt(p.p*i.q)}</b></div>`}).join('')+`<div class="tot" style="margin-top:12px"><div><span>Subtotal</span><span>${fmt(T.s)}</span></div>${T.d?`<div><span>Coupon RT10</span><span>-${fmt(T.d)}</span></div>`:''}<div><span>Shipping</span><span>${T.sh?fmt(T.sh):'Free'}</span></div><div class="g"><span>Total</span><span>${fmt(T.t)}</span></div></div>`}}
if(pg=='login')$('#lf').onsubmit=e=>{e.preventDefault();const em=$('#le').value.trim().toLowerCase(),u=users().find(x=>x.e==em&&x.p==btoa($('#lp').value));
if(!/^\S+@\S+\.\S+$/.test(em))return $('#lm').textContent='Enter a valid email address.';if(!u)return $('#lm').textContent='Email or password is incorrect. Check them or create an account.';
sv('rts',{name:u.n,email:u.e});location.href=U.get('next')||'index.html'};
if(pg=='signup'){const pw=$('#sp');pw.oninput=()=>{const v=pw.value,s=(v.length>=8)+/[A-Z]/.test(v)+/[0-9]/.test(v)+/[^A-Za-z0-9]/.test(v);$('#sb').style.width=s*25+'%';$('#sb').style.background=['#d6204f','#d6204f','#f0a020','#5fd3a6','#2fb67f'][s]};
$('#sf').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target)),em=f.email.trim().toLowerCase();let m='';
if(f.name.trim().length<2)m='Enter your full name.';else if(!/^\S+@\S+\.\S+$/.test(em))m='Enter a valid email address.';else if(!/^[0-9]{10}$/.test(f.phone))m='Phone must be 10 digits.';else if(f.pw.length<8||!/[0-9]/.test(f.pw))m='Password needs 8+ characters and a number.';else if(f.pw!=f.pw2)m='Passwords do not match.';else if(!f.terms)m='Please accept the terms.';else if(users().some(u=>u.e==em))m='This email already has an account. Log in instead.';
$('#sg').textContent=m;if(m)return;sv('rtu',[...users(),{n:f.name.trim(),e:em,p:btoa(f.pw)}]);sv('rts',{name:f.name.trim(),email:em});toast('Account created. Welcome!');setTimeout(()=>location.href='index.html',900)}}
if(pg=='acct'){if(!me)location.href='login.html?next=account.html';else{$('#ah').textContent='Hello, '+me.name;$('#ae').textContent=me.email;const ST=['Placed','Packed','Shipped','Out for delivery','Delivered'];
$('#ol').innerHTML=ld('rto',[]).map(o=>{const s=Math.min(4,Math.floor((Date.now()-o.ts)/864e5));return `<div class="card" style="margin-bottom:14px"><div class="hd" style="margin:0 0 10px"><div><b>Order ${o.id}</b><br><small>${new Date(o.ts).toLocaleDateString('en-IN')} · ${fmt(o.t)}</small></div><b style="color:var(--pk)">${ST[s]}</b></div><div class="fs"><i style="width:${s*25+10}%"></i></div><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">${o.items.map(i=>{const p=pid(i.id);return `<img src="${im(p.img[0])}" title="${p.n} · ${i.z} x ${i.q}" style="width:56px;height:72px;object-fit:cover;border-radius:10px;filter:${TN[i.c][1]}" alt="${p.n}">`}).join('')}</div></div>`}).join('')||'<div class="empty">No orders yet. <a href="products.html" style="color:var(--pk)">Start shopping</a></div>';
const w=P.filter(p=>wish.includes(p.id));$('#sv2').innerHTML=w.length?w.map(card).join(''):'<div class="empty" style="grid-column:1/-1">Tap the heart on any product to save it here.</div>'}}
if(pg=='ct')$('#cm').onsubmit=e=>{e.preventDefault();const m=ld('rtm',[]);m.push({...Object.fromEntries(new FormData(e.target)),ts:Date.now()});sv('rtm',m);e.target.reset();toast('Message sent. We reply within 24 hours.')};
if(pg=='ab'){const io=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;const el=en.target,to=+el.dataset.n;let n=0;const t=setInterval(()=>{n=Math.min(to,n+Math.ceil(to/40));el.textContent=n.toLocaleString('en-IN')+(el.dataset.s||'');if(n>=to)clearInterval(t)},30);io.unobserve(el)}));document.querySelectorAll('[data-n]').forEach(e=>io.observe(e))}
