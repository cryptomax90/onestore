// Helpers
const $ = (sel)=>document.querySelector(sel);
const set = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
const get = (k, fallback=null)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):fallback}catch(e){return fallback}};

// Defaults for demo
if(!get('store')) set('store',{ url:"alexphoto.shop", product:{ name:"Photography Preset Pack", price:29, desc:"A pack of 10 Lightroom presets to enhance your photos instantly.", type:"digital" } , monthRevenue:1240, orders:[
  {buyer:"Maya R.", item:"Photography Preset Pack", price:29},
  {buyer:"Leo K.", item:"Photography Preset Pack", price:29},
  {buyer:"Anika S.", item:"Photography Preset Pack", price:29}
]});

// Fill shared bits if elements exist
window.addEventListener('DOMContentLoaded',()=>{
  const s = get('store');
  // Landing mock
  if($('#mock-title')) $('#mock-title').textContent = s.product.name;
  if($('#mock-price')) $('#mock-price').textContent = `$${s.product.price}`;
  // Signup
  if($('#store-url')) $('#store-url').value = s.url;
  // Add Product form
  if($('#name')) $('#name').value = s.product.name;
  if($('#price')) $('#price').value = s.product.price;
  if($('#desc')) $('#desc').value = s.product.desc;
  if($('#type-'+s.product.type)) $('#type-'+s.product.type).checked = true;
  // Store Live
  if($('#live-url')) $('#live-url').textContent = s.url;
  // Dashboard
  if($('#rev')) $('#rev').textContent = `$${s.monthRevenue}`;
  if($('#orders')){
    const list = $('#orders');
    list.innerHTML = '';
    s.orders.forEach(o=>{
      const row = document.createElement('div');
      row.className='order';
      row.innerHTML = `<div><div><strong>${o.item}</strong></div><div class="small">${o.buyer}</div></div><div class="price">$${o.price}</div>`;
      list.appendChild(row);
    });
  }
});

// Save handlers
function saveSignup(){
  const s = get('store');
  const v = $('#store-url').value.trim() || 'alexphoto.shop';
  s.url = v; set('store', s);
  window.location.href = 'add-product.html';
}
function saveProduct(){
  const s = get('store');
  s.product.name = $('#name').value.trim() || 'Photography Preset Pack';
  s.product.price = Number($('#price').value||29);
  s.product.desc = $('#desc').value.trim() || s.product.desc;
  s.product.type = document.querySelector('input[name="ptype"]:checked')?.value || 'digital';
  set('store', s);
  window.location.href = 'connect-stripe.html';
}

// Copy helper
function copyURL(){
  const s = get('store');
  navigator.clipboard.writeText(`https://${s.url}`).then(()=>{
    const pill = $('#copy-pill');
    if(!pill) return; pill.style.outline='2px solid var(--mint)';
    setTimeout(()=>pill.style.outline='none',600);
  });
}

// Confetti
function burstConfetti(){
  const root = document.createElement('div');
  root.className='confetti';
  document.body.appendChild(root);
  const colors = ['#7B5BFF','#A6FFDC','#FFD166','#FF6B6B'];
  for(let i=0;i<120;i++){
    const p = document.createElement('i');
    const size = 6 + Math.random()*10;
    p.style.left = Math.random()*100 + 'vw';
    p.style.background = colors[i%colors.length];
    p.style.width = size+'px'; p.style.height=size+'px';
    p.style.animationDelay = (Math.random()*0.6)+'s';
    p.style.borderRadius = Math.random()>.5?'2px':'999px';
    root.appendChild(p);
  }
  setTimeout(()=>root.remove(),3000);
}

// Fire confetti on Store Live page
window.addEventListener('load',()=>{
  if(document.body.dataset.page==='store-live'){
    setTimeout(burstConfetti, 250);
  }
});

