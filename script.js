var W=[
["你好","nǐ hǎo","hello","Greetings"],["谢谢","xièxie","thank you","Greetings"],["再见","zàijiàn","goodbye","Greetings"],["对不起","duìbuqǐ","sorry","Greetings"],["请","qǐng","please","Greetings"],["不客气","bú kèqi","you’re welcome","Greetings"],
["一","yī","one","Numbers"],["二","èr","two","Numbers"],["三","sān","three","Numbers"],["四","sì","four","Numbers"],["五","wǔ","five","Numbers"],["六","liù","six","Numbers"],["七","qī","seven","Numbers"],["八","bā","eight","Numbers"],["九","jiǔ","nine","Numbers"],["十","shí","ten","Numbers"],
["我","wǒ","I, me","First words"],["你","nǐ","you","First words"],["他","tā","he","First words"],["她","tā","she","First words"],["是","shì","to be","First words"],["好","hǎo","good","First words"],["人","rén","person","First words"],["水","shuǐ","water","First words"],["大","dà","big","First words"],["小","xiǎo","small","First words"],
["妈妈","māma","mom","Family"],["爸爸","bàba","dad","Family"],["哥哥","gēge","older brother","Family"],["姐姐","jiějie","older sister","Family"],["弟弟","dìdi","younger brother","Family"],["妹妹","mèimei","younger sister","Family"],["朋友","péngyou","friend","Family"],
["今天","jīntiān","today","Time"],["明天","míngtiān","tomorrow","Time"],["昨天","zuótiān","yesterday","Time"],["星期一","xīngqīyī","Monday","Time"],["日","rì","sun, day","Time"],["月","yuè","moon, month","Time"],
["吃","chī","to eat","Food and drink"],["喝","hē","to drink","Food and drink"],["米饭","mǐfàn","cooked rice","Food and drink"],["茶","chá","tea","Food and drink"],["水果","shuǐguǒ","fruit","Food and drink"],["好吃","hǎochī","delicious","Food and drink"],
["我不懂","wǒ bù dǒng","I don’t understand","Useful phrases"],["你叫什么名字","nǐ jiào shénme míngzi","what’s your name?","Useful phrases"],["我是学生","wǒ shì xuéshēng","I am a student","Useful phrases"],["多少钱","duōshao qián","how much is it?","Useful phrases"],["没关系","méi guānxi","it’s okay","Useful phrases"],["请再说一遍","qǐng zài shuō yí biàn","please say it again","Useful phrases"],
["口","kǒu","mouth","Nature and body"],["山","shān","mountain","Nature and body"],["木","mù","tree, wood","Nature and body"],["火","huǒ","fire","Nature and body"],["女","nǚ","woman","Nature and body"],["子","zǐ","child","Nature and body"],["中","zhōng","middle","Nature and body"],["天","tiān","sky, day","Nature and body"]];
var T=[["mā","妈","mother"],["má","麻","hemp"],["mǎ","马","horse"],["mà","骂","to scold"]];
var TN=["1st: high and flat","2nd: rising","3rd: dip, then rise","4th: sharp fall"];
var GR=["Greetings","Numbers","First words","Family","Time","Food and drink","Useful phrases","Nature and body"];
var WC=["一","二","三","十","八","人","大","小","口","山","日","月","木","火","女","子","中","天","水","四","五","六","七","九","好","他","她","你","我"];
var SC={"一":1,"二":2,"三":3,"十":2,"八":2,"人":2,"大":3,"小":3,"口":3,"山":3,"日":4,"月":4,"木":4,"火":4,"女":3,"子":3,"中":4,"天":4,"水":4,"四":5,"五":4,"六":4,"七":2,"九":2,"好":6,"他":5,"她":6,"你":7,"我":7};
function info(c){var w=W.filter(function(x){return x[0]==c})[0];return c+" · "+w[1]+" · "+w[2]+" · "+SC[c]+" strokes"}
var $=function(s){return document.querySelector(s)};
function ld(k,d){try{var x=localStorage.getItem(k);return x?JSON.parse(x):d}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var zv=null,warned=false;
function pickVoice(){try{zv=speechSynthesis.getVoices().filter(function(x){return /^zh/i.test(x.lang.replace("_","-"))})[0]||null}catch(e){}}
try{pickVoice();speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
function toast(m){var d=document.createElement("div");d.className="toast";d.textContent=m;document.body.appendChild(d);setTimeout(function(){d.remove()},4500)}
function unlock(){try{var u=new SpeechSynthesisUtterance(" ");u.volume=0;speechSynthesis.speak(u)}catch(e){}}
function say(t){if(!t)return;try{var ss=speechSynthesis;if(!zv)pickVoice();if(!zv&&!warned&&ss.getVoices().length){warned=true;toast("No Chinese voice found on this phone. Add one in your phone’s text-to-speech settings.")}
 var u=new SpeechSynthesisUtterance(t);u.lang="zh-CN";if(zv)u.voice=zv;u.rate=.8;ss.resume();
 if(ss.speaking||ss.pending){ss.cancel();setTimeout(function(){ss.speak(u)},150)}else ss.speak(u)}catch(e){}}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
var V=[["path","Path","🌱"],["learn","Learn","📖"],["cards","Cards","🃏"],["quiz","Quiz","⭐"],["write","Write","✍️"],["chat","Talk","🎤"]];
var cur="path";
function tabs(){$("#tabs").innerHTML=V.map(function(t){return '<button role="tab" data-v="'+t[0]+'" aria-selected="'+(t[0]==cur)+'"><span class="ic">'+t[2]+'</span>'+t[1]+'</button>'}).join("");
 document.querySelectorAll("#tabs button").forEach(function(b){b.onclick=function(){cur=b.dataset.v;tabs();R[cur]()}})}
function sp(t){return '<button class="sp" aria-label="Listen" data-s="'+t+'">🔊</button>'}
function bindSay(){document.querySelectorAll("[data-s]").forEach(function(b){b.onclick=function(e){e.stopPropagation();say(b.dataset.s)}})}
var R={};
R.learn=function(){
 var h='<div class="card"><h2>Step 1: the four tones</h2><p class="note">Same sound, different pitch, different meaning. Tap each one and listen.</p><div class="tones">'+
 T.map(function(t,i){return '<button data-s="'+t[1]+'"><b>'+t[0]+'</b><span class="zh">'+t[1]+'</span><br><span class="note">'+t[2]+'</span><br><span class="note">'+TN[i]+'</span></button>'}).join("")+'</div></div>';
 GR.forEach(function(g,i){
  h+='<div class="card"><h2>Step '+(i+2)+': '+g+'</h2>'+W.filter(function(w){return w[3]==g}).map(function(w){return '<div class="row"><span class="h zh">'+w[0]+'</span><div><div class="p">'+w[1]+'</div><div class="e">'+w[2]+'</div></div>'+sp(w[0])+'</div>'}).join("")+'</div>'});
 $("#v").innerHTML=h;bindSay()};
var deck=[],ci=0,fl=false,known=ld("known",[]);
R.cards=function(){
 if(!deck.length||ci>=deck.length){deck=shuf(W.filter(function(w){return known.indexOf(w[0])<0}));ci=0;fl=false}
 if(!deck.length){$("#v").innerHTML='<div class="card"><h2>You know every card 🎉</h2><button class="btn" id="rs">Start over</button></div>';$("#rs").onclick=function(){known=[];sv("known",known);deck=[];R.cards()};return}
 var w=deck[ci];
 $("#v").innerHTML='<p class="note">Known: '+known.length+' of '+W.length+'</p><div class="card flip" id="fc" tabindex="0"><div class="big zh">'+w[0]+'</div>'+(fl?'<div class="p" style="font-size:1.3rem;font-weight:600;color:var(--jade)">'+w[1]+'</div><div>'+w[2]+'</div>':'<div class="note">Tap to flip</div>')+sp(w[0])+'</div>'+
 '<div style="display:flex;gap:10px"><button class="btn alt" id="ag">Again</button><button class="btn" id="gt">I know it</button></div>';
 $("#fc").onclick=function(){fl=!fl;R.cards()};
 $("#ag").onclick=function(){ci++;fl=false;R.cards()};
 $("#gt").onclick=function(){if(known.indexOf(w[0])<0)known.push(w[0]);sv("known",known);ci++;fl=false;R.cards()};bindSay()};
var qs=[],qi=0,sc=0;
R.quiz=function(){
 if(!qs.length){qs=shuf(W).slice(0,10);qi=0;sc=0}
 if(qi>=qs.length){var b=Math.max(ld("best",0),sc);sv("best",b);$("#v").innerHTML='<div class="card"><h2>Score: '+sc+' / '+qs.length+'</h2><p class="note">Best so far: '+b+'</p><button class="btn" id="rq">Try again</button></div>';$("#rq").onclick=function(){qs=[];R.quiz()};return}
 var w=qs[qi],o=shuf(shuf(W.filter(function(x){return x[2]!=w[2]})).slice(0,3).concat([w]));
 $("#v").innerHTML='<p class="note">Question '+(qi+1)+' of '+qs.length+'. What does this mean?</p><div class="card" style="text-align:center"><div class="big zh">'+w[0]+'</div><div class="note">'+w[1]+'</div>'+sp(w[0])+'</div><div class="opts">'+o.map(function(x){return '<button class="opt" data-a="'+x[2]+'">'+x[2]+'</button>'}).join("")+'</div>';
 document.querySelectorAll(".opt").forEach(function(b){b.onclick=function(){
  var ok=b.dataset.a==w[2];if(ok)sc++;
  document.querySelectorAll(".opt").forEach(function(c){c.disabled=true;if(c.dataset.a==w[2])c.classList.add("ok")});
  if(!ok)b.classList.add("no");
  setTimeout(function(){qi++;R.quiz()},900)}});bindSay()};
var wc=WC[0],cv,cx,dr=false;
R.write=function(){
 $("#v").innerHTML='<div class="card"><h2>Trace the character</h2><p class="note">Write with your finger or mouse over the faint guide. Chinese strokes go top to bottom and left to right, and a horizontal stroke is drawn before a vertical one that crosses it.</p><div class="chars">'+
 WC.map(function(c){return '<button class="zh" aria-pressed="'+(c==wc)+'" data-c="'+c+'">'+c+'</button>'}).join("")+'</div>'+
 '<div class="pad"><div class="g zh">'+wc+'</div><canvas id="cv" width="640" height="640"></canvas></div><p class="note" style="text-align:center">'+info(wc)+'</p><div style="display:flex;gap:10px;justify-content:center"><button class="btn alt" id="cl">Clear</button><button class="btn" id="hr">Hear it</button></div></div>';
 document.querySelectorAll("[data-c]").forEach(function(b){b.onclick=function(){wc=b.dataset.c;R.write()}});
 $("#hr").onclick=function(){say(wc)};
 cv=$("#cv");cx=cv.getContext("2d");cx.lineWidth=22;cx.lineCap="round";cx.lineJoin="round";cx.strokeStyle=getComputedStyle(document.body).color;
 $("#cl").onclick=function(){cx.clearRect(0,0,640,640)};
 function pt(e){var r=cv.getBoundingClientRect();return[(e.clientX-r.left)*640/r.width,(e.clientY-r.top)*640/r.height]}
 cv.onpointerdown=function(e){dr=true;cv.setPointerCapture(e.pointerId);var p=pt(e);cx.beginPath();cx.moveTo(p[0],p[1]);cx.lineTo(p[0]+.1,p[1]);cx.stroke()};
 cv.onpointermove=function(e){if(!dr)return;var p=pt(e);cx.lineTo(p[0],p[1]);cx.stroke()};
 cv.onpointerup=cv.onpointercancel=function(){dr=false}};
var hist=[],smp=null,busy=false;
var SYS="You are a patient Chinese (Mandarin) tutor for a complete beginner. This is a spoken conversation, so keep replies to 3 short lines at most. Use only simple words. Always write Chinese characters, then pinyin with tone marks, then the English meaning. Gently correct mistakes. End with one easy question in Chinese (with pinyin and English) to keep the chat going.";
R.chatText=function(){
 $("#v").innerHTML='<div class="card"><h2>Practice with a tutor</h2><p class="note" id="cn">Say hello in Chinese, or type English and ask how to say something.</p><div id="log"></div><div class="in"><input id="ci" placeholder="Type here, e.g. nǐ hǎo" aria-label="Message"><button class="btn" id="sd">Send</button></div></div>';
 function add(c,t){var d=document.createElement("div");d.className="m "+c;d.textContent=t;$("#log").appendChild(d);$("#log").scrollTop=1e9;return d}
 hist.forEach(function(m){add(m.role=="user"?"u":"a",m.content)});
 if(!hist.length)add("a","你好！Nǐ hǎo! Hello! 你好吗？Nǐ hǎo ma? How are you?");
 async function go(){var t=$("#ci").value.trim();if(!t||busy)return;
  if(!smp){try{smp=await claude.use("sample")}catch(e){smp=null}}
  if(!smp){add("a","The chat tutor isn’t available in this view. Open the page from your claude.ai account to use it.");return}
  $("#ci").value="";hist.push({role:"user",content:t});add("u",t);busy=true;var d=add("a","…");
  var msgs=hist.map(function(m,i){return{role:m.role,content:i==0?SYS+"\n\n"+m.content:m.content}});
  try{var r=await ask(msgs,function(x){d.textContent=x.text});d.textContent=r.text;hist.push({role:"assistant",content:r.text})}
  catch(e){d.textContent="Couldn’t reach the tutor. Wait a moment and try again. If it keeps failing, check the API key in Vercel.";hist.pop()}
  busy=false}
 $("#sd").onclick=go;$("#ci").onkeydown=function(e){if(e.key=="Enter")go()}};
var SR=window.SpeechRecognition||window.webkitSpeechRecognition,rec=null,lang="zh-CN",aloud=true,live=false;
function zhOnly(t){return (t.match(/[\u4e00-\u9fff，。！？、]+/g)||[]).join(" ")}
R.chat=function(){
 $("#v").innerHTML='<div class="card"><h2>Talk with your tutor</h2><p class="note" id="cn">Tap the microphone and speak. Your tutor answers out loud and in writing.</p>'+
 '<div class="in" style="margin-bottom:10px;flex-wrap:wrap"><label class="note">I will speak <select id="lg"><option value="zh-CN">Chinese</option><option value="en-US">English</option></select></label><label class="note"><input type="checkbox" id="al"> Read replies aloud</label></div>'+
 '<div id="log"></div><div style="text-align:center;margin-bottom:10px"><button class="btn" id="mic">🎤 Tap to talk</button></div>'+
 '<div class="in"><input id="ci" placeholder="Or type here" aria-label="Message"><button class="btn alt" id="sd">Send</button></div></div>';
 $("#lg").value=lang;$("#al").checked=aloud;
 $("#lg").onchange=function(){lang=this.value};$("#al").onchange=function(){aloud=this.checked;if(!aloud)try{speechSynthesis.cancel()}catch(e){}};
 function add(c,t){var d=document.createElement("div");d.className="m "+c;d.textContent=t;$("#log").appendChild(d);$("#log").scrollTop=1e9;return d}
 hist.forEach(function(m){add(m.role=="user"?"u":"a",m.content)});
 if(!hist.length)add("a","你好！Nǐ hǎo! Hello! 你好吗？Nǐ hǎo ma? How are you?");
 async function send(t){t=(t||"").trim();if(!t||busy)return;
  if(!smp){try{smp=await claude.use("sample")}catch(e){smp=null}}
  
  $("#ci").value="";hist.push({role:"user",content:t});add("u",t);busy=true;var d=add("a","…");
  var msgs=hist.map(function(m,i){return{role:m.role,content:i==0?SYS+"\n\n"+m.content:m.content}});
  try{var r=await ask(msgs,function(x){d.textContent=x.text});d.textContent=r.text;hist.push({role:"assistant",content:r.text});if(aloud)say(zhOnly(r.text))}
  catch(e){d.textContent="Couldn’t reach the tutor. Wait a moment and try again. If it keeps failing, check the API key in Vercel.";hist.pop()}
  busy=false}
 $("#sd").onclick=function(){unlock();send($("#ci").value)};$("#ci").onkeydown=function(e){if(e.key=="Enter")send($("#ci").value)};
 $("#mic").onclick=function(){unlock();
  if(!SR){$("#cn").textContent="Voice input isn’t available here. Open the link in Chrome (Android) or Safari (iPhone), not inside another app, or type below.";return}
  if(live){rec.stop();return}
  try{speechSynthesis.cancel()}catch(e){}
  var fin="";rec=new SR();rec.lang=lang;rec.interimResults=true;
  rec.onstart=function(){live=true;$("#mic").classList.add("live");$("#mic").textContent="⏹ Listening… tap to stop"};
  rec.onresult=function(e){var s="";for(var i=0;i<e.results.length;i++)s+=e.results[i][0].transcript;$("#ci").value=s;if(e.results[e.results.length-1].isFinal)fin=s};
  rec.onerror=function(e){$("#cn").textContent=(e.error=="not-allowed"||e.error=="service-not-allowed")?"The microphone is blocked here. Allow microphone access in your browser, or type below.":"I didn’t catch that. Tap the microphone and try again."};
  rec.onend=function(){live=false;var m=$("#mic");if(m){m.textContent="🎤 Tap to talk";m.classList.remove("live")}if(fin)send(fin)};
  try{rec.start()}catch(e){live=false}}};
var P=[
{t:"The four tones",i:T.map(function(x){return[x[1],x[0],x[2]]}),tips:TN,w:[]},
{t:"Say hello",h:["你好","谢谢","再见","对不起","请","不客气"],w:["你","好"]},
{t:"Numbers 1 to 5",h:["一","二","三","四","五"],w:["一","二","三"]},
{t:"Numbers 6 to 10",h:["六","七","八","九","十"],w:["十","八","七","九"]},
{t:"Talking about people",h:["我","你","他","她","是","人"],w:["人","我","他","她"]},
{t:"Describing things",h:["好","大","小","水"],w:["大","小","水","好"]},
{t:"Family",h:["妈妈","爸爸","哥哥","姐姐","弟弟","妹妹","朋友"],w:["女","子"]},
{t:"Days and time",h:["今天","明天","昨天","星期一","日","月"],w:["日","月"]},
{t:"Food and drink",h:["吃","喝","米饭","茶","水果","好吃"],w:["口"]},
{t:"Nature and body",h:["口","山","木","火","女","子","中","天"],w:["山","木","火","中","天"]},
{t:"Useful phrases",h:["我不懂","你叫什么名字","我是学生","多少钱","没关系","请再说一遍"],w:[]}];
function items(s){return s.i||s.h.map(function(h){return W.filter(function(x){return x[0]==h})[0]})}
var pd=ld("pathdone",0),ps=null;
function bindPad(){var cv=$("#cv"),cx=cv.getContext("2d"),dr=false;cx.lineWidth=22;cx.lineCap="round";cx.lineJoin="round";cx.strokeStyle=getComputedStyle(document.body).color;
 function pt(e){var r=cv.getBoundingClientRect();return[(e.clientX-r.left)*640/r.width,(e.clientY-r.top)*640/r.height]}
 cv.onpointerdown=function(e){dr=true;cv.setPointerCapture(e.pointerId);var p=pt(e);cx.beginPath();cx.moveTo(p[0],p[1]);cx.lineTo(p[0]+.1,p[1]);cx.stroke()};
 cv.onpointermove=function(e){if(!dr)return;var p=pt(e);cx.lineTo(p[0],p[1]);cx.stroke()};
 cv.onpointerup=cv.onpointercancel=function(){dr=false};
 $("#cl").onclick=function(){cx.clearRect(0,0,640,640)}}
R.path=function(){
 var v=$("#v");
 if(!ps){
  v.innerHTML='<p class="note">Do the steps in order. Each one teaches a few words, checks you, then has you write. '+pd+' of '+P.length+' done.</p>'+P.map(function(s,i){var st=i<pd?"✓":i==pd?"▶":"🔒";return '<button class="opt" style="width:100%;margin-bottom:8px" data-p="'+i+'"'+(i>pd?' disabled':'')+'>'+st+'  Step '+(i+1)+': '+s.t+'</button>'}).join("");
  document.querySelectorAll("[data-p]").forEach(function(b){b.onclick=function(){var n=+b.dataset.p;ps={n:n,ph:"learn",k:0,q:0,sc:0,qs:shuf(items(P[n])),wi:0};R.path()}});return}
 var s=P[ps.n],it=items(s),h='<p class="note">Step '+(ps.n+1)+' of '+P.length+': '+s.t+'</p>',nav='<button class="btn alt" id="mp">All steps</button>';
 if(ps.ph=="check"&&ps.q>=ps.qs.length){
  if(ps.sc<Math.ceil(ps.qs.length*.6)){v.innerHTML=h+'<div class="card"><h2>'+ps.sc+' of '+ps.qs.length+' right</h2><p>Let’s go over the words once more, then try again.</p></div><div style="display:flex;gap:10px">'+nav+'<button class="btn" id="rv">Review the words</button></div>';$("#rv").onclick=function(){ps.ph="learn";ps.k=0;ps.qs=shuf(it);R.path()};$("#mp").onclick=function(){ps=null;R.path()};return}
  ps.ph=s.w.length?"write":"fin";ps.wi=0}
 if(ps.ph=="learn"){
  var w=it[ps.k],last=ps.k==it.length-1;
  v.innerHTML=h+'<div class="card" style="text-align:center"><p class="note">Word '+(ps.k+1)+' of '+it.length+'</p><div class="big zh">'+w[0]+'</div><div style="font-size:1.4rem;font-weight:600;color:var(--jade)">'+w[1]+'</div><div>'+w[2]+'</div>'+(s.tips?'<div class="note">'+s.tips[ps.k]+'</div>':'')+sp(w[0])+'<p class="note">Tap 🔊, listen, then say it out loud three times.</p></div><div style="display:flex;gap:10px">'+nav+'<button class="btn" id="nx">'+(last?"Start the quick check":"Next word")+'</button></div>';
  $("#nx").onclick=function(){if(last){ps.ph="check";ps.q=0;ps.sc=0;ps.qs=shuf(it)}else ps.k++;R.path()};
 }else if(ps.ph=="check"){
  var w=ps.qs[ps.q],seen={},o=shuf(shuf(it).concat(shuf(W)).filter(function(x){if(x[2]==w[2]||seen[x[2]])return false;seen[x[2]]=1;return true}).slice(0,3).concat([w]));
  v.innerHTML=h+'<p class="note">Quick check, question '+(ps.q+1)+' of '+ps.qs.length+'. What does this mean?</p><div class="card" style="text-align:center"><div class="big zh">'+w[0]+'</div><div class="note">'+w[1]+'</div>'+sp(w[0])+'</div><div class="opts">'+o.map(function(x){return '<button class="opt" data-a="'+x[2]+'">'+x[2]+'</button>'}).join("")+'</div>'+nav;
  document.querySelectorAll(".opt").forEach(function(b){b.onclick=function(){var ok=b.dataset.a==w[2];if(ok)ps.sc++;document.querySelectorAll(".opt").forEach(function(c){c.disabled=true;if(c.dataset.a==w[2])c.classList.add("ok")});if(!ok)b.classList.add("no");setTimeout(function(){ps.q++;R.path()},1000)}});
 }else if(ps.ph=="write"){
  var c=s.w[ps.wi],last=ps.wi==s.w.length-1;
  v.innerHTML=h+'<div class="card"><h2>Write it: '+(ps.wi+1)+' of '+s.w.length+'</h2><p class="note">Trace the faint character three times. Start at the top and move left to right.</p><div class="pad"><div class="g zh">'+c+'</div><canvas id="cv" width="640" height="640"></canvas></div><p class="note" style="text-align:center">'+info(c)+'</p><div style="display:flex;gap:10px;justify-content:center"><button class="btn alt" id="cl">Clear</button><button class="btn alt" data-s="'+c+'">🔊 Hear it</button></div></div><div style="display:flex;gap:10px">'+nav+'<button class="btn" id="nx">'+(last?"Finish step":"Next character")+'</button></div>';
  bindPad();$("#nx").onclick=function(){if(last)ps.ph="fin";else ps.wi++;R.path()};
 }else{
  pd=Math.max(pd,ps.n+1);sv("pathdone",pd);bar();if(!ps.cf){ps.cf=1;confetti()}
  v.innerHTML='<div class="card" style="text-align:center"><div class="big">🎉</div><h2>Step '+(ps.n+1)+' complete</h2><p>'+(ps.n+1<P.length?'Next up: '+P[ps.n+1].t+'.':'You finished the whole path. Keep practising with Flashcards, Quiz and Chat.')+'</p><button class="btn" id="mp">Continue</button></div>';
 }
 var m=$("#mp");if(m)m.onclick=function(){ps=null;R.path()};bindSay()};
function confetti(){var c=["#1a9a86","#ff9a76","#f2c14e","#8f7cf0"];for(var i=0;i<30;i++){var s=document.createElement("i");s.className="cf";s.style.left=Math.random()*100+"vw";s.style.background=c[i%4];s.style.animationDelay=Math.random()*.5+"s";s.style.setProperty("--dx",(Math.random()*160-80)+"px");document.body.appendChild(s);setTimeout(function(x){x.remove()},3000,s)}}
function streak(){var t=new Date().toDateString(),s=ld("streak",{d:"",n:0});if(s.d!=t){var y=new Date(Date.now()-864e5).toDateString();s={d:t,n:s.d==y?s.n+1:1};sv("streak",s)}$("#st").textContent="🔥 "+s.n+(s.n==1?" day":" days")}
function bar(){$("#pb").style.width=Math.round(pd/P.length*100)+"%"}
async function ask(msgs,cb){
 if(smp)return await smp(msgs,{cache:false,onText:cb});
 var q=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:hist})});
 var d=await q.json();if(!q.ok||!d.text)throw new Error(d.error||"fail");return{text:d.text}}
tabs();R.path();streak();bar();
