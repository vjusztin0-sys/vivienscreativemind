(function(){
  // Mobil menü
  var btn=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  if(btn){btn.addEventListener('click',function(){
    var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o);
  });}
  var sub=document.querySelector('.has-sub>button');
  if(sub){sub.addEventListener('click',function(){
    var p=sub.parentNode,o=p.classList.toggle('open');sub.setAttribute('aria-expanded',o);
  });}

  // Főoldali képváltó (3 másodpercenként)
  var imgs=document.querySelectorAll('.slider img');
  if(imgs.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var s=0;setInterval(function(){
      imgs[s].classList.remove('active');s=(s+1)%imgs.length;imgs[s].classList.add('active');
    },3000);
  }

  // Nagyító: kattintásra nagy kép, lapozható
  var links=[].slice.call(document.querySelectorAll('a.lb'));
  if(links.length){
    var box=document.createElement('div');
    box.className='lightbox';box.hidden=true;
    box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Image viewer');
    box.innerHTML='<button class="lb-close" aria-label="Close">&times;</button>'+
      '<button class="lb-prev" aria-label="Previous image">&#8249;</button>'+
      '<figure><img alt=""><figcaption></figcaption></figure>'+
      '<button class="lb-next" aria-label="Next image">&#8250;</button>';
    document.body.appendChild(box);
    var big=box.querySelector('img'),cap=box.querySelector('figcaption');
    var closeBtn=box.querySelector('.lb-close'),i=0,last=null,x0=null;

    function show(n){
      i=(n+links.length)%links.length;
      big.src=links[i].href;
      big.alt=links[i].querySelector('img').alt;
      var t=links[i].getAttribute('data-caption');
      cap.textContent=(t?t+'  ·  ':'')+(i+1)+' / '+links.length;
      new Image().src=links[(i+1)%links.length].href;
    }
    function open(n){
      last=document.activeElement;show(n);
      box.hidden=false;document.body.style.overflow='hidden';closeBtn.focus();
    }
    function close(){
      box.hidden=true;document.body.style.overflow='';big.removeAttribute('src');
      if(last)last.focus();
    }
    links.forEach(function(a,n){
      a.addEventListener('click',function(e){e.preventDefault();open(n);});
    });
    closeBtn.addEventListener('click',close);
    box.querySelector('.lb-prev').addEventListener('click',function(){show(i-1);});
    box.querySelector('.lb-next').addEventListener('click',function(){show(i+1);});
    box.addEventListener('click',function(e){if(e.target===box)close();});
    box.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    box.addEventListener('touchend',function(e){
      if(x0===null)return;
      var d=e.changedTouches[0].clientX-x0;x0=null;
      if(d>50)show(i-1);else if(d<-50)show(i+1);
    });
    document.addEventListener('keydown',function(e){
      if(box.hidden)return;
      if(e.key==='Escape')close();
      else if(e.key==='ArrowLeft')show(i-1);
      else if(e.key==='ArrowRight')show(i+1);
      else if(e.key==='Tab'){
        var f=box.querySelectorAll('button'),first=f[0],end=f[f.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();end.focus();}
        else if(!e.shiftKey&&document.activeElement===end){e.preventDefault();first.focus();}
      }
    });
  }
})();
