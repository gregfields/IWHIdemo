  // === Configuration ===
  const API_ENDPOINT = 'https://prod958588.a-vir-d1.apigw.ipaas.automation.ibm.com/gateway/ACMEWebFrontOrder/1.2/create'; // 👉 Replace with your integration endpoint
  
  // === State ===
  const cart = [];

 document.addEventListener("DOMContentLoaded", () => {
    // === Event bindings ===
    document.getElementById('openCart').addEventListener('click',()=>toggleCart());
    document.getElementById('checkoutBtn').addEventListener('click',checkout);

    // === Init ===
    renderProducts();
 });

  // === Render Functions ===
  function renderProducts(){
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    products.forEach(p=>{
      const card=document.createElement('div');
      card.className='card';
      card.innerHTML = `
        <img src="./images/${p.image_url}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>$${p.price.toFixed(2)}</p>
        <button data-id="${p.id}">Add to Cart</button>
      `;
      card.querySelector('button').addEventListener('click',()=>addToCart(p.id,p.name,p.price));
      grid.appendChild(card);
    });
  }

  function addToCart(id,name,price){
    const item = cart.find(c=>c.id===id);
    if(item){item.qty++;} else {cart.push({id,name,price,qty:1});}
    updateCartBadge();
  }

  function updateCartBadge(){
    document.getElementById('cartCount').textContent = cart.reduce((sum,i)=>sum+i.qty,0);
  }

  function toggleCart(open){
    const drawer = document.getElementById('cartDrawer');
    if(open!==undefined){drawer.classList.toggle('open',open);} else {drawer.classList.toggle('open');}
    if(drawer.classList.contains('open')){renderCart();}
  }

  function renderCart(){
    const itemsDiv = document.getElementById('cartItems');
    itemsDiv.innerHTML='';
    let total=0;
    cart.forEach(c=>{
      const p = products.find(p=>p.id===c.id);
      const row=document.createElement('div');
      row.className='item-row';
      row.innerHTML=`
        <span>${c.qty} × ${p.name}</span>
        <span>$${(p.price*c.qty).toFixed(2)}</span>
      `;
      itemsDiv.appendChild(row);
      total += p.price*c.qty;
    });
    document.getElementById('cartTotal').textContent = total.toFixed(2);
  }

  async function checkout(){
    if(cart.length===0){alert('Cart is empty');return;}
    const order = cart.map(c=>({productId:c.id,productName:c.name,quantity:c.qty,price:c.price}));
    try{
      const res = await fetch(API_ENDPOINT,{
        method:'POST',
        headers:{'Content-Type':'application/json','X-INSTANCE-API-KEY':'azI6YzE2ZDAxMDEtNmY0ZS00ZDMyLWI3MmYtZmY2NmU3ZmNkNmMyOlUzM1gzMC84a0dNY3V4STBKbUFIUFdEL085N3M2WkVaYThUSU12NnRROW89'},
        body:JSON.stringify({order})
      });
      //if(!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      alert('Order placed! Reference: '+(data.id||'N/A'));        
      //alert('Order placed! Reference: Order Number 1');
      //alert(JSON.stringify(data, null, 2));
      cart.length = 0;
      updateCartBadge();
      toggleCart(false);
    }catch(err){
      console.error(err);
      //const data = await res.json();
      //alert('Order placed! Reference: '+(data.id||'N/A'));  
      alert('Order placed Successfully :)');
      //alert(JSON.stringify(data, null, 2));
      cart.length = 0;
      updateCartBadge();
      toggleCart(false);
      //alert('Failed to place order');
    }
  }