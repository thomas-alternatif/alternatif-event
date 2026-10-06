(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var FORMSPREE='https://formspree.io/f/mbgdddkg';

/* compteur */
var d=Math.floor((Date.now()-new Date('2024-06-22').getTime())/864e5);
$('#days').textContent=d.toLocaleString('fr-FR');

/* header transparent tout en haut */
var top_=$('#top');
function onScroll(){top_.classList.toggle('clear',window.scrollY<40&&!$('#navmenu').classList.contains('on'))}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* menu */
var bg=$('#burger'),nm=$('#navmenu');
function menu(on){nm.classList.toggle('on',on);bg.setAttribute('aria-expanded',on);nm.setAttribute('aria-hidden',!on);document.body.style.overflow=on?'hidden':'';onScroll()}
bg.addEventListener('click',function(){menu(!nm.classList.contains('on'))});
$$('a',nm).forEach(function(a){a.addEventListener('click',function(){menu(false)})});

/* modales */
var lastFocus;
function open(id){var m=document.getElementById(id);lastFocus=document.activeElement;menu(false);m.hidden=false;document.body.style.overflow='hidden';var f=$('input:not([type=hidden]):not(.hp)',m);if(f)f.focus()}
function close(m){m.hidden=true;document.body.style.overflow='';if(lastFocus)lastFocus.focus()}
$$('[data-open]').forEach(function(b){b.addEventListener('click',function(){open(b.dataset.open)})});
$$('.modal').forEach(function(m){
  m.addEventListener('click',function(e){if(e.target===m||e.target.hasAttribute('data-close'))close(m)});
});
addEventListener('keydown',function(e){
  if(e.key==='Escape'){$$('.modal').forEach(function(m){if(!m.hidden)close(m)});lbClose();menu(false)}
  if(!$('#lb').hidden){if(e.key==='ArrowRight')lbGo(1);if(e.key==='ArrowLeft')lbGo(-1)}
});

/* formulaires -> Formspree */
$$('.form').forEach(function(f){
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var msg=$('.fmsg',f),btn=$('button[type=submit]',f);
    if($('.hp',f).value)return;
    btn.disabled=true;msg.className='fmsg';msg.textContent='Envoi…';
    var data={};new FormData(f).forEach(function(v,k){if(k!=='_gotcha')data[k]=v});
    fetch(FORMSPREE,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){if(!r.ok)throw 0;msg.textContent=f.dataset.ok;f.reset()})
      .catch(function(){msg.className='fmsg err';msg.textContent='Échec de l\'envoi. Écris-nous à contact@alternatif-event.com.'})
      .then(function(){btn.disabled=false});
  });
});

/* galerie + lightbox */
var NG=30,strip=$('#strip'),cur=0;
var alts=['Chanteuse à la guitare','Festival en plein jour','Chanteur sur scène bleue','Rappeur en concert','Public et violon','Rappeur sur scène','DJ en soirée','Chanteur au clavier','Rappeur sous les lumières','Guitariste','Décors du festival','Rappeur en concert','Portrait de scène','Scène du festival','Scène rouge et bleue'];
var EV=15;for(var i=1;i<=NG;i++){
  var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Agrandir la photo '+i);
  var im=document.createElement('img');var j=i<=EV?i:i-EV;im.src='img/'+(i<=EV?'e':'g')+(j<10?'0':'')+j+'.webp';im.alt=i<=EV?'Fête de la Musique, 20 juin 2026':alts[j-1];im.loading='lazy';
  b.appendChild(im);(function(n){b.addEventListener('click',function(){lbOpen(n)})})(i-1);strip.appendChild(b);
}
var lb=$('#lb'),lbi=$('#lb-img');
function lbShow(){var s=strip.children[cur].firstChild;lbi.src=s.src;lbi.alt=s.alt}
function lbOpen(n){cur=n;lbShow();lb.hidden=false;document.body.style.overflow='hidden'}
function lbClose(){if(lb.hidden)return;lb.hidden=true;document.body.style.overflow=''}
function lbGo(k){cur=(cur+k+NG)%NG;lbShow()}
$('.lb-x').addEventListener('click',lbClose);
$('.lb-p').addEventListener('click',function(){lbGo(-1)});
$('.lb-nx').addEventListener('click',function(){lbGo(1)});
lb.addEventListener('click',function(e){if(e.target===lb)lbClose()});

/* reveal (≥ 901px) */
if(innerWidth>900&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  var els=$$('.sec-h,.manif-q,.bc,.pa,.dc,.don-l,.don-r,.ct-l,.form:not(.m-box .form)');
  els.forEach(function(e){var r=e.getBoundingClientRect();if(r.top>innerHeight)e.classList.add('rv')});
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{rootMargin:'0px 0px -8% 0px'});
  $$('.rv').forEach(function(e){io.observe(e)});
}
})();
