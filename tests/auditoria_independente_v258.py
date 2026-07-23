import json,time,urllib.request,websocket,itertools,subprocess,tempfile,sys,socket,shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
with socket.socket() as sock:
    sock.bind(('127.0.0.1',0));PORT=sock.getsockname()[1]
profile=tempfile.mkdtemp(prefix='chrome-marco-v258-')
proc=subprocess.Popen(['/usr/bin/chromium','--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--disable-extensions','--disable-features=MediaRouter,OptimizationHints',f'--remote-debugging-port={PORT}','--remote-debugging-address=127.0.0.1','--remote-allow-origins=*',f'--user-data-dir={profile}','about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
    for _ in range(60):
        try:
            pages=json.load(urllib.request.urlopen(f'http://127.0.0.1:{PORT}/json'));
            if pages: break
            raise RuntimeError('sem página ainda')
        except Exception: time.sleep(.1)
    else: raise RuntimeError('Chromium não iniciou')
    page=pages[0]
    ws=websocket.create_connection(page['webSocketDebuggerUrl'],timeout=120,origin=f'http://127.0.0.1:{PORT}',max_size=30_000_000)
    seq=itertools.count(1)
    def cmd(method,params=None,timeout=120):
        i=next(seq);ws.send(json.dumps({'id':i,'method':method,'params':params or {}}));end=time.time()+timeout
        while time.time()<end:
            msg=json.loads(ws.recv())
            if msg.get('id')==i:
                if 'error' in msg: raise RuntimeError(msg['error'])
                return msg.get('result',{})
        raise TimeoutError(method)
    def ev(expr,await_promise=False):
        r=cmd('Runtime.evaluate',{'expression':expr,'returnByValue':True,'awaitPromise':await_promise})['result']
        if r.get('subtype')=='error': raise RuntimeError(r.get('description'))
        return r.get('value')

    css_files=['css/app.css','css/mobile-borion.css','css/borion-hub.css','css/pts-completo.css','css/validacao-final.css','css/personalization-v221.css','css/v227-corrections.css','css/v255-marco-review.css','css/v256-final-adjustments.css']
    js_files=['js/data/initial-data.js','js/services/storage.js','js/services/identifiers.js','js/services/phone.js','js/services/money.js','js/services/finance-status.js','js/services/stock-health.js','js/services/google-drive.js','js/vendor/qrcode-local.js','js/services/pdf.js','js/services/borion-interop-source.js','js/app.js','js/legacy-migration-v253.js','js/personalization-v221.js','js/pts-completo.js','js/mobile-experience.js','js/borion-hub.js','js/v227-corrections.js','js/v255-marco-review.js','js/v256-final-adjustments.js']
    poly='''<script>(()=>{const mk=()=>{const s={};return {getItem:k=>Object.prototype.hasOwnProperty.call(s,k)?s[k]:null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k],clear:()=>Object.keys(s).forEach(k=>delete s[k]),key:i=>Object.keys(s)[i]??null,get length(){return Object.keys(s).length}}};Object.defineProperty(window,'localStorage',{value:mk(),configurable:true});Object.defineProperty(window,'sessionStorage',{value:mk(),configurable:true});Object.defineProperty(window,'indexedDB',{value:{deleteDatabase(){const req={};queueMicrotask(()=>req.onsuccess&&req.onsuccess());return req;}},configurable:true});try{Object.defineProperty(navigator,'onLine',{value:true,configurable:true});}catch(_){};window.scrollTo=()=>{};window.__auditErrors=[];window.addEventListener('error',e=>window.__auditErrors.push('error:'+String(e.message||e.error||'')));window.addEventListener('unhandledrejection',e=>window.__auditErrors.push('rejection:'+String(e.reason?.message||e.reason||'')));const ce=console.error.bind(console);console.error=(...a)=>{window.__auditErrors.push('console:'+a.map(x=>x?.message||String(x)).join(' '));ce(...a);};})();</script>'''
    styles=''.join('<style>'+ (ROOT/f).read_text(encoding='utf-8') +'</style>' for f in css_files)
    scripts=[]
    for f in js_files:
        s=(ROOT/f).read_text(encoding='utf-8').replace('</script','<\\/script')
        scripts.append(f'<script data-src="{f}">{s}</script>')
    html='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+styles+'</head><body><div id="root"></div><div id="modal-root"></div><div id="toast-root"></div><div id="confirm-root"></div><input id="json-import" type="file" hidden><input id="media-import" type="file" hidden>'+poly+''.join(scripts)+'</body></html>'
    cmd('Page.navigate',{'url':'about:blank'});time.sleep(.2)
    frame=cmd('Page.getFrameTree')['frameTree']['frame']['id']
    cmd('Page.setDocumentContent',{'frameId':frame,'html':html});time.sleep(2)
    cmd('Emulation.setDeviceMetricsOverride',{'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})

    setup=r'''(async()=>{
      persist=async()=>({ok:true});
      if(window.GoogleDriveMarco){GoogleDriveMarco.isConfigured=()=>true;GoogleDriveMarco.writeForceSave=async()=>({});}
      const d=data();
      d.clients=[{id:'CLI-000001',name:'Cliente Teste',phone:'(17) 99999-9999',phoneNormalized:'5517999999999',city:'Catanduva',createdAt:'2026-07-20T10:00:00Z',status:'Ativo'}];
      d.services=[{id:'SRV-000001',description:'Formatação',price:150,status:'Ativo'}];
      d.products=[{id:'PRD-000001',description:'SSD',brand:'Marca X',supplier:'Fornecedor Y',cost:100,margin:.5,salePrice:200,minimumStock:1,initialStock:5,status:'Ativo'}];
      d.supplies=[{id:'INS-000001',description:'Pasta térmica',brand:'Marca Z',supplier:'Fornecedor W',cost:20,minimumStock:1,initialStock:10,status:'Ativo'}];
      d.serviceOrders=[{id:'OSV-000001',clientId:'CLI-000001',clientName:'Cliente Teste',openedAt:'2026-07-23T09:00:00Z',createdAt:'2026-07-23T09:00:00Z',equipmentType:'Notebook',brandModel:'Modelo A',status:'Em andamento',registrationStatus:'Ativo',reportedIssue:'Não liga',diagnosis:'Teste',total:350,photos:[],attachments:[],pdfs:[{id:'PDF-1',fileName:'OSV-000001.pdf',createdAt:'2026-07-23T12:00:00Z',official:true}]}];
      d.orderItems=[{id:'ITM-000001',orderId:'OSV-000001',type:'Serviço',serviceId:'SRV-000001',description:'Formatação',quantity:1,unitPrice:150,subtotal:150},{id:'ITM-000002',orderId:'OSV-000001',type:'Produto',productId:'PRD-000001',description:'SSD',quantity:1,unitPrice:200,subtotal:200}];
      d.payments=[{id:'REC-000001',code:'REC-000001',orderId:'OSV-000001',type:'Receita',value:350,grossValue:350,fee:5,paymentMethod:'Pix',paymentDate:'2026-07-23',dueDate:'2026-07-23',status:'Pago',createdAt:'2026-07-23T12:00:00Z',active:true},{id:'DES-000001',code:'DES-000001',type:'Despesa',value:40,fee:0,paymentMethod:'Pix',paymentDate:'2026-07-23',status:'Pago',notes:'Energia',createdAt:'2026-07-23T13:00:00Z',active:true}];
      d.stockMovements=[{id:'MOV-000001',date:'2026-07-23',movementType:'Saída',quantity:1,stockBefore:5,stockAfter:4,productId:'PRD-000001',orderId:'OSV-000001',notes:'Automática'}];
      d.settings.dashboardPrivacy=false;d.settings.modules.agenda=false;d.settings.periodFilters={};d.settings.orderStatusFilterV256='Todos';
      normalizeState();
      LOCKED=false;CURRENT_VIEW='dashboard';renderShell();
      await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
      return true;
    })()'''
    ev(setup,True)

    audit=(ROOT/'tests/auditoria_independente_v258.js').read_text(encoding='utf-8')
    result=ev(audit,True)
    cmd('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
    mobile=ev("""(async()=>{CURRENT_VIEW='dashboard';renderShell();await new Promise(r=>setTimeout(r,100));openOrderDetail('OSV-000001');await new Promise(r=>setTimeout(r,120));const m=document.querySelector('#modal-root .modal'),g=m.querySelector('.detail-grid-v256'),h=m.querySelector('.layout-resize-handle-v256');return {topActions:document.querySelectorAll('.top-actions [data-action]').length,noHorizontalOverflow:document.documentElement.scrollWidth<=document.documentElement.clientWidth,modalFits:m.getBoundingClientRect().right<=innerWidth+1&&m.getBoundingClientRect().left>=-1,detailOneColumn:getComputedStyle(g).gridTemplateColumns.split(' ').length===1,resizeHandleHidden:!h||getComputedStyle(h).display==='none'};})()""",True)
    result['mobile']=mobile
    result['checks'].extend([
      {'name':'Celular mantém três ações no topo','ok':mobile['topActions']==3,'detail':''},
      {'name':'Celular sem estouro horizontal','ok':mobile['noHorizontalOverflow'],'detail':''},
      {'name':'Modal da OSV cabe no celular','ok':mobile['modalFits'],'detail':''},
      {'name':'Detalhes da OSV ficam em uma coluna no celular','ok':mobile['detailOneColumn'],'detail':''},
      {'name':'Alça de redimensionamento fica oculta no celular','ok':mobile['resizeHandleHidden'],'detail':''},
    ])
    result['checks'].append({'name':'Sem erros inesperados de runtime/console','ok':len(result['errors'])==0,'detail':' | '.join(result['errors'])})
    result['total']=len(result['checks']);result['passed']=sum(1 for x in result['checks'] if x['ok']);result['failures']=[x for x in result['checks'] if not x['ok']];result['allPassed']=not result['failures']
    (ROOT/'RESULTADO_AUDITORIA_INDEPENDENTE_V2_5_8.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'allPassed':result['allPassed'],'total':result['total'],'passed':result['passed'],'failures':result['failures'],'errors':result['errors'],'mobile':mobile},ensure_ascii=False,indent=2))
    ws.close()
    sys.exit(0 if result['allPassed'] else 1)
finally:
    proc.terminate()
    try:proc.wait(timeout=5)
    except:proc.kill()
    shutil.rmtree(profile,ignore_errors=True)
