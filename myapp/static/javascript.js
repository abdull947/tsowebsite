/* ===== PARTICLES ===== */
(function(){
  const canvas=document.getElementById('particles-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W=canvas.width=window.innerWidth,H=canvas.height=window.innerHeight;
  const N=window.innerWidth<600?45:90;
  const particles=[];
  const palette=['hsl(221, 87%, 50%)','hsl(307, 88%, 48%)','hsl(96, 93%, 50%)','hsl(213, 94%, 49%)','hsl(0, 92%, 49%)'];
  function rand(a,b){return Math.random()*(b-a)+a;}
  for(let i=0;i<N;i++){
    particles.push({x:rand(0,W),y:rand(0,H),vx:rand(-.28,.28),vy:rand(-.28,.28),
      r:rand(2.0,6.0),a:rand(.13,.45),color:palette[Math.floor(Math.random()*palette.length)]});
  }
  const CONN=130;
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.color;ctx.globalAlpha=p.a;ctx.fill();
    });
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<CONN){ctx.globalAlpha=.40*(1-d/CONN);ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle='rgba(56,189,248,0.8)';ctx.lineWidth=2.5;ctx.stroke();
        }
      }
    }
    ctx.globalAlpha=1;requestAnimationFrame(draw);
  }
  draw();
  let rt;
  window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;},200);});
})();

/* ===== THEME ===== */
function toggleTheme(){
  document.body.classList.toggle('day');
  const btn=document.getElementById('themeBtn');
  if(btn)btn.innerHTML=document.body.classList.contains('day')?'&#9728;&#65039;':'&#127769;';
  localStorage.setItem('tso-theme',document.body.classList.contains('day')?'day':'night');
}
(function(){
  if(localStorage.getItem('tso-theme')==='day'){
    document.body.classList.add('day');
    const btn=document.getElementById('themeBtn');if(btn)btn.innerHTML='&#9728;&#65039;';
  }
})();

/* ===== NAV ===== */
function toggleMenu(){
  document.getElementById('ham').classList.toggle('open');
  document.getElementById('navLinks').classList.toggle('open');
}
function closeMenu(){
  const h=document.getElementById('ham'),l=document.getElementById('navLinks');
  if(h)h.classList.remove('open');if(l)l.classList.remove('open');
}
document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',closeMenu));

/* ===== ANNOUNCEMENT ===== */
let annTitle='',annMsg='';
(function(){
  const bar=document.getElementById('ann-bar'),nav=document.getElementById('main-nav');
  fetch('/api/announcement/').then(r=>r.json()).then(d=>{
    if(d.active){
      annTitle=d.title;annMsg=d.message;
      document.getElementById('ann-text').textContent=d.title+' — tap to read';
      bar.style.display='flex';
      if(nav)nav.classList.add('with-ann');
      bar.querySelector('span').onclick=function(){
        document.getElementById('ann-modal-title').textContent=annTitle;
        document.getElementById('ann-modal-msg').textContent=annMsg;
        document.getElementById('ann-modal').classList.add('open');
      };
    } else {
      bar.style.display='none';if(nav)nav.classList.add('no-ann');
    }
  }).catch(()=>{const n=document.getElementById('main-nav');if(n)n.classList.add('no-ann');});
})();

/* ===== SCROLL REVEAL ===== */
const revObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revObs.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal-left,.reveal-right,.reveal-up,.vm-card').forEach(el=>revObs.observe(el));

/* ===== GALLERY SLIDESHOW ===== */
(function(){
  const slides=document.querySelectorAll('.slide'),dotsBox=document.getElementById('dots'),slCount=document.getElementById('slCount');
  let cur=0;if(!slides.length||!dotsBox)return;
  slides.forEach((_,i)=>{const d=document.createElement('span');d.className='dot'+(i===0?' active':'');d.onclick=()=>go(i);dotsBox.appendChild(d);});
  function go(n){
    slides[cur].classList.remove('active');document.querySelectorAll('.dot')[cur].classList.remove('active');
    cur=(n+slides.length)%slides.length;slides[cur].classList.add('active');document.querySelectorAll('.dot')[cur].classList.add('active');
    if(slCount)slCount.textContent=(cur+1)+' / '+slides.length;
  }
  window.changeSlide=function(d){go(cur+d);};
  if(slides.length>1)setInterval(()=>window.changeSlide(1),4200);
})();

/* ===== STAR RATING ===== */
let selStar=0;
(function(){
  const box=document.getElementById('star-box');if(!box)return;
  box.querySelectorAll('.star').forEach(s=>{
    s.addEventListener('mouseover',()=>hlStar(+s.dataset.v));
    s.addEventListener('mouseout',()=>hlStar(selStar));
    s.addEventListener('click',()=>{selStar=+s.dataset.v;hlStar(selStar);});
  });
})();
function hlStar(v){
  const box=document.getElementById('star-box');if(!box)return;
  box.querySelectorAll('.star').forEach(s=>{s.style.color=+s.dataset.v<=v?'#FCD34D':'rgba(255,255,255,.15)';});
}

/* ===== HELPERS ===== */
function showErr(id,msg){const e=document.getElementById(id);if(e){e.textContent=msg;e.style.display='block';}}
function hideErr(id){const e=document.getElementById(id);if(e)e.style.display='none';}
function validEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}
function validPhone(p){return/^[+]?[\d\s\-]{10,16}$/.test(p);}
function getCookie(n){
  let v=null;document.cookie.split(';').forEach(c=>{c=c.trim();if(c.startsWith(n+'='))v=decodeURIComponent(c.slice(n.length+1));});return v;
}

/* ===== FEEDBACK ===== */
function submitFeedback(){
  const name=(document.getElementById('fb-name')||{}).value?.trim();
  const msg=(document.getElementById('fb-msg')||{}).value?.trim();
  let ok=true;['fb-name-err','fb-star-err','fb-msg-err'].forEach(hideErr);
  if(!name){showErr('fb-name-err','Please enter your name.');ok=false;}
  if(!selStar){showErr('fb-star-err','Please select a rating.');ok=false;}
  if(!msg){showErr('fb-msg-err','Please write a message.');ok=false;}
  if(!ok)return;
  fetch('/api/feedback/',{method:'POST',headers:{'Content-Type':'application/json','X-CSRFToken':getCookie('csrftoken')},
    body:JSON.stringify({name,message:msg,rating:selStar})})
    .then(r=>r.json()).then(d=>{
      if(d.success){document.getElementById('fb-form').style.display='none';document.getElementById('fb-success').style.display='block';}
      else showErr('fb-msg-err','Error: '+(d.error||'Try again.'));
    }).catch(()=>showErr('fb-msg-err','Server error.'));
}

/* ===== JOIN TABS ===== */
function switchJoinTab(id,btn){
  document.querySelectorAll('.join-tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.member-tabs .tab-btn').forEach(b=>b.classList.remove('active'));
  const el=document.getElementById(id);if(el)el.classList.add('active');if(btn)btn.classList.add('active');
}

/* ===== JOIN SUBMIT ===== */
function submitJoin(type){
  const maps={
    TSO:{prefix:'tso',fields:{name:'tso-name',fname:'tso-fname',email:'tso-email',phone:'tso-phone',inst:'tso-inst',prog:'tso-prog',education:'tso-edu',area:'tso-area'}},
    CABINET:{prefix:'cab',fields:{name:'cab-name',fname:'cab-fname',email:'cab-email',phone:'cab-phone',inst:'cab-inst',prog:'cab-prog',education:'cab-edu',area:'cab-area'}},
    DONATOR:{prefix:'don',fields:{name:'don-name',fname:'don-fname',email:'don-email',phone:'don-phone',job_designation:'don-job',area:'don-area'}}
  };
  const {prefix,fields}=maps[type];let ok=true;const data={reg_type:type};
  Object.entries(fields).forEach(([key,id])=>{
    const el=document.getElementById(id);if(!el)return;
    hideErr(id+'-err');const val=el.value.trim();
    if(!val){showErr(id+'-err','This field is required.');ok=false;}
    else if(key==='email'&&!validEmail(val)){showErr(id+'-err','Enter a valid email.');ok=false;}
    else if(key==='phone'&&!validPhone(val)){showErr(id+'-err','Enter a valid phone number.');ok=false;}
    else data[key]=val;
  });
  if(!ok)return;
  fetch('/api/register/',{method:'POST',headers:{'Content-Type':'application/json','X-CSRFToken':getCookie('csrftoken')},body:JSON.stringify(data)})
    .then(r=>r.json()).then(d=>{
      if(d.success){
        const fi=document.getElementById(prefix+'-form-inner'),su=document.getElementById(prefix+'-success');
        if(fi)fi.style.display='none';if(su)su.style.display='block';
      } else alert('Error: '+(d.error||'Please try again.'));
    }).catch(()=>alert('Server error.'));
}

/* ===== MEMBERS TABS ===== */
function switchTab(name,btn){
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.member-tabs .tab-btn').forEach(b=>b.classList.remove('active'));
  const el=document.getElementById('tab-'+name);if(el)el.classList.add('active');if(btn)btn.classList.add('active');
}

/* ===== MEMBER PHOTO PREVIEW ===== */
function previewMemberPhoto(input){
  const preview=document.getElementById('photo-preview');
  const removeBtn=document.getElementById('remove-photo-btn');
  if(!input.files||!input.files[0])return;
  const reader=new FileReader();
  reader.onload=function(e){
    preview.innerHTML=`<img src="${e.target.result}" style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:2.5px solid rgba(56,189,248,.5);box-shadow:0 0 20px rgba(56,189,248,.3);"/>`;
    if(removeBtn)removeBtn.style.display='inline-block';
  };
  reader.readAsDataURL(input.files[0]);
}
function removeMemberPhoto(){
  document.getElementById('m-photo').value='';
  document.getElementById('photo-preview').innerHTML=`
    <i class="fa-solid fa-camera" style="font-size:1.8rem;color:var(--cyan);opacity:.6;"></i>
    <span style="font-size:.75rem;color:var(--muted);margin-top:.4rem;">Click to upload photo</span>
    <span style="font-size:.65rem;color:var(--faint);">JPG, PNG — max 5MB</span>`;
  const rb=document.getElementById('remove-photo-btn');if(rb)rb.style.display='none';
}
function resetPhotoPreview(currentPhotoUrl){
  const preview=document.getElementById('photo-preview');
  const removeBtn=document.getElementById('remove-photo-btn');
  document.getElementById('m-photo').value='';
  if(currentPhotoUrl){
    preview.innerHTML=`<img src="${currentPhotoUrl}" style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:2.5px solid rgba(56,189,248,.5);box-shadow:0 0 20px rgba(56,189,248,.3);"/>`;
    if(removeBtn)removeBtn.style.display='inline-block';
  } else {
    preview.innerHTML=`
      <i class="fa-solid fa-camera" style="font-size:1.8rem;color:var(--cyan);opacity:.6;"></i>
      <span style="font-size:.75rem;color:var(--muted);margin-top:.4rem;">Click to upload photo</span>
      <span style="font-size:.65rem;color:var(--faint);">JPG, PNG — max 5MB</span>`;
    if(removeBtn)removeBtn.style.display='none';
  }
}

/* ===== MEMBER CRUD ===== */
function onMemberTypeChange(){
  const t=document.getElementById('m-type').value;
  const eg=document.getElementById('edu-group'),jg=document.getElementById('job-group');
  if(t==='DONATOR'){if(eg)eg.style.display='none';if(jg)jg.style.display='block';}
  else{if(eg)eg.style.display='block';if(jg)jg.style.display='none';}
}
function openAddModal(){
  document.getElementById('modal-title-txt').textContent='Add New Member';
  document.getElementById('m-edit-id').value='';
  ['m-name','m-role','m-edu'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  const mj=document.getElementById('m-job');if(mj)mj.value='';
  document.getElementById('m-type').value='TSO';
  ['m-name-err','m-role-err','m-edu-err','m-job-err'].forEach(hideErr);
  resetPhotoPreview(null);
  onMemberTypeChange();
  document.getElementById('member-modal').classList.add('open');
}
function openEditModal(id,name,role,type,edu,job,photoUrl){
  document.getElementById('modal-title-txt').textContent='Edit Member';
  document.getElementById('m-edit-id').value=id;
  document.getElementById('m-name').value=name;
  document.getElementById('m-role').value=role;
  document.getElementById('m-type').value=type;
  const me=document.getElementById('m-edu');if(me)me.value=edu||'';
  const mj=document.getElementById('m-job');if(mj)mj.value=job||'';
  ['m-name-err','m-role-err','m-edu-err','m-job-err'].forEach(hideErr);
  resetPhotoPreview(photoUrl||null);
  onMemberTypeChange();
  document.getElementById('member-modal').classList.add('open');
}
function closeMemberModal(){document.getElementById('member-modal').classList.remove('open');}

function saveMember(){
  const editId=document.getElementById('m-edit-id').value;
  const name=document.getElementById('m-name').value.trim();
  const role=document.getElementById('m-role').value.trim();
  const mtype=document.getElementById('m-type').value;
  const eduEl=document.getElementById('m-edu');const edu=eduEl?eduEl.value.trim():'';
  const jobEl=document.getElementById('m-job');const job=jobEl?jobEl.value.trim():'';
  const photoInput=document.getElementById('m-photo');
  let ok=true;
  ['m-name-err','m-role-err','m-edu-err','m-job-err'].forEach(hideErr);
  if(!name){showErr('m-name-err','Name is required.');ok=false;}
  if(!role){showErr('m-role-err','Role is required.');ok=false;}
  if(mtype!=='DONATOR'&&!edu){showErr('m-edu-err','Education is required.');ok=false;}
  if(mtype==='DONATOR'&&!job){showErr('m-job-err','Job designation is required.');ok=false;}
  if(!ok)return;

  const fd=new FormData();
  fd.append('name',name);fd.append('role',role);fd.append('member_type',mtype);
  fd.append('education',mtype!=='DONATOR'?edu:'');
  fd.append('job_designation',mtype==='DONATOR'?job:'');
  if(photoInput&&photoInput.files[0])fd.append('photo',photoInput.files[0]);

  const url=editId?`/api/members/${editId}/`:'/api/members/';
  const btn=document.getElementById('m-submit-btn');
  if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Saving...';}

  fetch(url,{method:'POST',headers:{'X-CSRFToken':getCookie('csrftoken')},body:fd})
    .then(r=>r.json()).then(d=>{
      if(d.success||d.member){closeMemberModal();window.location.reload();}
      else{alert('Error saving member.');if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-floppy-disk"></i> &nbsp;Save Member';}}
    }).catch(()=>{alert('Server error.');if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-floppy-disk"></i> &nbsp;Save Member';}});
}

function deleteMember(id){
  if(!confirm('Remove this member?'))return;
  fetch(`/api/members/${id}/`,{method:'DELETE',headers:{'X-CSRFToken':getCookie('csrftoken')}})
    .then(r=>r.json()).then(d=>{
      if(d.success){const c=document.getElementById('mcard-'+id);if(c)c.remove();}
      else alert('Error.');
    }).catch(()=>alert('Server error.'));
}

/* ===== GALLERY MANAGEMENT ===== */
function openGalleryModal(){
  document.getElementById('gallery-modal').classList.add('open');
  loadGalleryAdmin();
}
function closeGalleryModal(){document.getElementById('gallery-modal').classList.remove('open');}

function previewGalleryPhoto(input){
  const prev=document.getElementById('g-photo-preview');
  if(!input.files||!input.files[0])return;
  const reader=new FileReader();
  reader.onload=e=>{
    prev.innerHTML=`<img src="${e.target.result}" style="width:100%;height:140px;object-fit:cover;border-radius:10px;border:1px solid rgba(56,189,248,.3);"/>`;
  };
  reader.readAsDataURL(input.files[0]);
}

function loadGalleryAdmin(){
  const list=document.getElementById('g-admin-list');
  if(!list)return;
  list.innerHTML='<div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:.8rem;"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>';
  fetch('/api/gallery/').then(r=>r.json()).then(d=>{
    if(!d.images||!d.images.length){
      list.innerHTML='<div style="text-align:center;padding:1.5rem;color:var(--muted);font-size:.78rem;"><i class="fa-solid fa-image" style="display:block;font-size:2rem;opacity:.3;margin-bottom:.6rem;"></i>No images yet. Add one below.</div>';
      return;
    }
    list.innerHTML=d.images.map(img=>`
      <div class="g-admin-item" id="gadm-${img.id}">
        <img src="${img.image}" alt="${img.caption||''}" class="g-admin-thumb"/>
        <div class="g-admin-info">
          <span class="g-admin-cap">${img.caption||'<em style="opacity:.5">No caption</em>'}</span>
          <span class="g-admin-ord">Order: ${img.order}</span>
        </div>
        <button class="g-del-btn" onclick="deleteGalleryImage(${img.id})" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`).join('');
  }).catch(()=>{list.innerHTML='<div style="color:#F87171;font-size:.78rem;padding:1rem;">Failed to load.</div>';});
}

function addGalleryImage(){
  const photoInput=document.getElementById('g-photo');
  const caption=(document.getElementById('g-caption')||{}).value?.trim()||'';
  const order=parseInt((document.getElementById('g-order')||{}).value||'0')||0;
  hideErr('g-photo-err');
  if(!photoInput||!photoInput.files[0]){showErr('g-photo-err','Please select a photo.');return;}
  const fd=new FormData();
  fd.append('image',photoInput.files[0]);fd.append('caption',caption);fd.append('order',order);
  const btn=document.getElementById('g-add-btn');
  if(btn){btn.disabled=true;btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Uploading...';}
  fetch('/api/gallery/',{method:'POST',headers:{'X-CSRFToken':getCookie('csrftoken')},body:fd})
    .then(r=>r.json()).then(d=>{
      if(d.success){
        photoInput.value='';
        document.getElementById('g-photo-preview').innerHTML=`
          <i class="fa-solid fa-image" style="font-size:2rem;color:var(--cyan);opacity:.4;"></i>
          <span style="font-size:.73rem;color:var(--muted);margin-top:.4rem;">Click to select image</span>`;
        const capEl=document.getElementById('g-caption');if(capEl)capEl.value='';
        const ordEl=document.getElementById('g-order');if(ordEl)ordEl.value='0';
        loadGalleryAdmin();
        if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-plus"></i> Add to Gallery';}
      } else {
        showErr('g-photo-err',d.error||'Upload failed.');
        if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-plus"></i> Add to Gallery';}
      }
    }).catch(()=>{
      showErr('g-photo-err','Server error.');
      if(btn){btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-plus"></i> Add to Gallery';}
    });
}

function deleteGalleryImage(id){
  if(!confirm('Remove this photo from gallery?'))return;
  fetch(`/api/gallery/${id}/`,{method:'DELETE',headers:{'X-CSRFToken':getCookie('csrftoken')}})
    .then(r=>r.json()).then(d=>{
      if(d.success){const el=document.getElementById('gadm-'+id);if(el)el.remove();}
      else alert('Error deleting image.');
    }).catch(()=>alert('Server error.'));
}

/* ===== MODAL CLOSE ON OVERLAY CLICK ===== */
document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('.modal-overlay').forEach(o=>{
    o.addEventListener('click',function(e){if(e.target===this)this.classList.remove('open');});
  });
});