(() => {
  const cfg = window.SUPABASE_CONFIG || {};
  const $ = id => document.getElementById(id);
  const loginPanel = $('loginPanel'), appPanel = $('appPanel'), message = $('message');
  let db, products = [], editingId = null, currentImages = [];
  const categories = {smartphones:'Смартфоны',phones_new:'Новые смартфоны',phones_used:'Смартфоны б/у',headphones:'Наушники',chargers:'Зарядные устройства',cables:'Кабели',watches:'Умные часы',other:'Разное'};
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const say = (text, error=false) => { message.textContent = text; message.classList.remove('admin-hidden'); message.style.background = error ? '#fff0f0' : '#eef4ff'; };
  const hideMessage = () => message.classList.add('admin-hidden');
  const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45) || 'product';
  if (!window.supabase || !cfg.url || !cfg.anonKey || !cfg.url.startsWith('https://')) {
    $('loginBtn').disabled = true; say('Сначала настройте js/supabase-config.js по инструкции в README-SUPABASE.md.', true); return;
  }
  db = window.supabase.createClient(cfg.url, cfg.anonKey);
  const setLoggedIn = async session => {
    loginPanel.classList.toggle('admin-hidden', !!session); appPanel.classList.toggle('admin-hidden', !session);
    if (session) { $('who').textContent = session.user.email; await loadProducts(); }
  };
  async function loadProducts() {
    hideMessage(); const {data,error} = await db.from('products').select('id,data').order('created_at');
    if (error) return say('Не удалось загрузить товары: '+error.message, true);
    products = (data || []).map(row => ({...row.data, id:row.id})); renderList();
  }
  function renderList() {
    const q = $('search').value.trim().toLowerCase(); const shown = products.filter(p => p.name.toLowerCase().includes(q));
    $('count').textContent = `(${products.length})`;
    $('productList').innerHTML = shown.length ? shown.map(p => `<article class="admin-item"><img src="${esc((p.images||[])[0] || 'assets/img/cat-other.webp')}" alt=""><div><b>${esc(p.name)}</b><small>${esc(categories[p.category] || p.category)} · ${Number(p.price||0).toLocaleString('ru-RU')} ₸ · ${p.availability==='out'?'Нет в наличии':p.availability==='order'?'Под заказ':'В наличии'}</small></div><div class="admin-actions"><button class="btn" data-edit="${esc(p.id)}">Изменить</button><button class="btn" data-delete="${esc(p.id)}">Удалить</button></div></article>`).join('') : '<p class="admin-muted">Товары не найдены.</p>';
  }
  function parseSpecs(text) { const out={}; text.split('\n').forEach(line => { const i=line.indexOf(':'); if(i>0){const k=line.slice(0,i).trim(),v=line.slice(i+1).trim();if(k&&v)out[k]=v;} }); return out; }
  function specsText(obj) { return Object.entries(obj||{}).map(([k,v])=>`${k}: ${v}`).join('\n'); }
  function openForm(p=null) {
    editingId = p?.id || null; currentImages = [...(p?.images || [])]; $('formTitle').textContent = p ? 'Редактирование товара' : 'Новый товар';
    $('pName').value=p?.name||''; $('pBrand').value=p?.brand||''; $('pCategory').value=p?.category||'other'; $('pPrice').value=p?.price??''; $('pOldPrice').value=p?.oldPrice??''; $('pAvailability').value=p?.availability||'in_stock'; $('pDescription').value=p?.description||''; $('pSpecs').value=specsText(p?.specifications); $('pFeatured').checked=!!p?.featured; $('pNew').checked=!!p?.isNew; $('pSale').checked=!!p?.isSale; $('pImages').value=''; showImages(); $('editPanel').classList.remove('admin-hidden'); $('editPanel').scrollIntoView({behavior:'smooth',block:'start'});
  }
  function showImages(){ $('imagePreview').textContent = currentImages.length ? `Текущие фото: ${currentImages.length}\n${currentImages.join('\n')}` : 'Фотографии пока не добавлены.'; }
  async function uploadImages(files, id) {
    const paths=[];
    for (const file of files) {
      if (!file.type.startsWith('image/')) throw new Error('Можно загружать только изображения.');
      if (file.size > 8*1024*1024) throw new Error('Каждая фотография должна быть меньше 8 МБ.');
      const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
      const path=`${id}/${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const {error}=await db.storage.from('product-images').upload(path,file,{upsert:false,contentType:file.type}); if(error)throw error;
      const {data}=db.storage.from('product-images').getPublicUrl(path); paths.push(data.publicUrl);
    }
    return paths;
  }
  $('loginBtn').onclick = async () => { hideMessage(); const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value}); if(error)say('Не удалось войти: '+error.message,true); };
  $('logoutBtn').onclick = async () => { await db.auth.signOut(); };
  $('addBtn').onclick=()=>openForm(); $('cancelBtn').onclick=()=> $('editPanel').classList.add('admin-hidden'); $('search').oninput=renderList;
  $('pImages').onchange=()=>{const f=$('pImages').files; $('imagePreview').textContent=`Выбрано новых фотографий: ${f.length}. Существующие: ${currentImages.length}.`;};
  $('productList').onclick=async e=>{
    const edit=e.target.closest('[data-edit]'), del=e.target.closest('[data-delete]');
    if(edit){const p=products.find(x=>x.id===edit.dataset.edit);if(p)openForm(p);}
    if(del){const p=products.find(x=>x.id===del.dataset.delete);if(!p||!confirm(`Удалить товар «${p.name}»?`))return;const {error}=await db.from('products').delete().eq('id',p.id);if(error)say('Ошибка удаления: '+error.message,true);else{say('Товар удалён.');await loadProducts();}}
  };
  $('productForm').onsubmit=async e=>{
    e.preventDefault(); hideMessage(); $('saveBtn').disabled=true;
    try {
      const name=$('pName').value.trim(); const id=editingId || `${slug(name)}-${Date.now().toString(36)}`;
      const added=await uploadImages([...$('pImages').files],id); const images=[...currentImages,...added];
      const data={id,name,brand:$('pBrand').value.trim(),category:$('pCategory').value,price:Number($('pPrice').value),oldPrice:$('pOldPrice').value?Number($('pOldPrice').value):null,description:$('pDescription').value.trim(),images,specifications:parseSpecs($('pSpecs').value),availability:$('pAvailability').value,featured:$('pFeatured').checked,isNew:$('pNew').checked,isSale:$('pSale').checked};
      const {error}=await db.from('products').upsert({id,data},{onConflict:'id'}); if(error)throw error;
      $('editPanel').classList.add('admin-hidden'); $('productForm').reset(); say('Товар сохранён. Каталог сайта обновится автоматически.'); await loadProducts();
    } catch(err){say('Не удалось сохранить: '+(err.message||String(err)),true);} finally {$('saveBtn').disabled=false;}
  };
  db.auth.onAuthStateChange((_event,session)=>{setLoggedIn(session);});
  db.auth.getSession().then(({data})=>setLoggedIn(data.session));
})();
