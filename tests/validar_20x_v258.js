'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const crypto=require('crypto');

const ROOT=path.resolve(__dirname,'..');
const read=rel=>fs.readFileSync(path.join(ROOT,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(ROOT,rel));
const index=read('index.html');
const v258=read('js/v256-final-adjustments.js');
const v255=read('js/v255-marco-review.js');
const pts=read('js/pts-completo.js');
const css=read('css/v256-final-adjustments.css');

function makeContext(){
  const profile={
    settings:{periodFilters:{}},
    clients:[
      {id:'CLI-000002',name:'Bruno',phone:'',city:'Catanduva',createdAt:'2026-07-20',status:'Ativo'},
      {id:'CLI-000001',name:'Ana',phone:'',city:'Ariranha',createdAt:'2026-07-18',status:'Ativo'}
    ],
    serviceOrders:[
      {id:'OSV-000002',clientId:'CLI-000002',clientName:'Bruno',openedAt:'2026-07-20',equipmentType:'Notebook',brandModel:'Dell',status:'Em andamento',registrationStatus:'Ativo',total:800,pdfs:[]},
      {id:'OSV-000001',clientId:'CLI-000001',clientName:'Ana',openedAt:'2026-07-18',equipmentType:'Celular',brandModel:'Samsung',status:'Concluída',registrationStatus:'Ativo',total:500,pdfs:[{id:'PDF-1',fileName:'OSV-000001.pdf',createdAt:'2026-07-18T12:00:00',official:true}]}
    ],
    payments:[
      {id:'REC-000001',code:'REC-000001',orderId:'OSV-000001',type:'Receita',paymentMethod:'Pix',paymentDate:'2026-07-18',value:500,fee:0,status:'Pago'},
      {id:'DES-000001',code:'DES-000001',type:'Despesa',paymentMethod:'Pix',paymentDate:'2026-07-19',value:50,fee:0,status:'Pago',expenseCategory:'Imposto'}
    ],
    services:[{id:'SRV-000001',description:'Formatação',price:150,status:'Ativo'}],
    products:[{id:'PRD-000001',description:'SSD',brand:'Kingston',supplier:'Fornecedor A',cost:200,margin:.5,salePrice:300,minimumStock:1,initialStock:5,status:'Ativo'}],
    supplies:[{id:'INS-000001',description:'Pasta térmica',brand:'Arctic',supplier:'Fornecedor B',cost:30,minimumStock:2,initialStock:10,status:'Ativo'}],
    stockMovements:[{id:'MOV-000001',date:'2026-07-20',productId:'PRD-000001',itemType:'Produto',movementType:'Saída',quantity:1,stockBefore:5,stockAfter:4,orderId:'OSV-000002',notes:'Uso na OSV'}],
    priceHistory:[],orderItems:[
      {id:'ITM-1',orderId:'OSV-000001',type:'Serviço',subtotal:400},
      {id:'ITM-2',orderId:'OSV-000001',type:'Produto',subtotal:100}
    ]
  };
  const textNodes=[];
  const titleNodes=[];
  const moneyInputs=[];
  const document={
    addEventListener(){},
    querySelector(){return null;},
    querySelectorAll(selector){return selector==='[data-action="toggle-privacy"]'?[]:[];},
    getElementById(){return null;},
    createTreeWalker(root){
      const nodes=root?.textNodes||textNodes;let i=-1;
      return {currentNode:null,nextNode(){i++;if(i>=nodes.length)return false;this.currentNode=nodes[i];return true;}};
    }
  };
  const ctx={
    console,WeakMap,Map,Set,Date,Math,Number,String,Array,Object,Promise,Intl,RegExp,JSON,
    window:null,globalThis:null,innerWidth:1440,STATE:{dataByProfile:{main:profile}},LOCKED:true,ICONS:{},
    document,NodeFilter:{SHOW_TEXT:4,FILTER_REJECT:2,FILTER_ACCEPT:1},
    requestAnimationFrame(){},
    data:()=>profile,
    norm:v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(),
    num:v=>Number(v)||0,
    today:()=> '2026-07-23',
    icon:(name)=>`<svg data-icon="${name}"></svg>`,
    attr:v=>String(v??'').replace(/"/g,'&quot;'),
    esc:v=>String(v??'').replace(/</g,'&lt;'),
    currency:v=>`R$ ${Number(v||0).toFixed(2).replace('.',',')}`,
    formatDate:v=>String(v||'').slice(0,10),
    formatDateTime:v=>String(v||''),
    statusBadge:v=>`<span>${v}</span>`,
    matches:()=>true,
    findClient:id=>profile.clients.find(x=>x.id===id),
    findOrder:id=>profile.serviceOrders.find(x=>x.id===id),
    orderPayments:id=>profile.payments.filter(x=>x.orderId===id),
    orderItems:id=>profile.orderItems.filter(x=>x.orderId===id),
    catalogItem:()=>null,
    getViewMode:()=> 'table',
    viewModeSwitcher:()=> '<span>visualização</span>',
    whatsappNumber:()=>false,
    phoneLink:()=> '#',
    stockOf:(type,id)=>{const item=[...profile.products,...profile.supplies].find(x=>x.id===id);return Number(item?.initialStock)||0;},
    itemForMovement:m=>profile.products.find(x=>x.id===m.productId)||profile.supplies.find(x=>x.id===m.supplyId),
    SHOW_ARCHIVED:{orders:false,clients:false,catalog:false},
    ACTIVE_TAB:{catalog:'services'},
    MarcoStockHealth:{getStockHealth:(stock)=>({tone:'ok',label:String(stock)})},
    renderShell(){},renderOrders(){return'';},renderClients(){return'';},renderFinance(){return'';},renderCatalog(){return'';},renderDocuments(){return'';},renderView(){},
    handleAction:async()=>{},openModal(){},openOrderDetail(){},openClientDetail(){},closeModal(){},
    openPaymentForm(){},openServiceForm(){},openProductForm(){},openSupplyForm(){},openStockMovementForm(){},
    openPdfMedia:async()=>{},persist:async()=>{},toast(){},getComputedStyle:()=>({columnGap:'12px'})
  };
  ctx.window=ctx;ctx.globalThis=ctx;
  vm.createContext(ctx);
  new vm.Script(v258,{filename:'v256-final-adjustments.js'}).runInContext(ctx);
  return {ctx,profile,textNodes,titleNodes,moneyInputs};
}

function runChecklist(run){
  const checks=[];
  const ok=(name,condition,detail='')=>checks.push({name,ok:!!condition,detail:condition?'':String(detail||'falhou')});
  const refs=[...index.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m=>m[1].split('?')[0]).filter(x=>x&&!/^https?:|^data:|^mailto:/.test(x));
  ok('Versão do index é 2.5.8',/v=2\.5\.8/.test(index));
  ok('Manifesto existe',exists('manifest.json'));
  ok('Service worker existe',exists('sw.js'));
  ok('Todos os arquivos locais do index existem',refs.every(exists),refs.filter(x=>!exists(x)).join(','));
  ok('Nenhum caminho absoluto foi introduzido',!/(?:src|href)="\/(?!\/)/.test(index));
  ok('Camada final carrega por último',index.lastIndexOf('js/v256-final-adjustments.js')>index.lastIndexOf('js/v255-marco-review.js'));
  ok('Todos os JavaScript compilam',fs.readdirSync(path.join(ROOT,'js'),{recursive:true}).filter(x=>String(x).endsWith('.js')).every(rel=>{try{new vm.Script(read(path.join('js',String(rel))),{filename:String(rel)});return true;}catch{return false;}}));
  ok('Não há ZIP privado dentro do pacote',!fs.readdirSync(ROOT,{recursive:true}).some(x=>/\.(zip|7z|rar)$/i.test(String(x))));
  ok('Não há PDF histórico dentro do pacote',!fs.readdirSync(ROOT,{recursive:true}).some(x=>/\.pdf$/i.test(String(x))));
  ok('Não há planilha histórica dentro do pacote',!fs.readdirSync(ROOT,{recursive:true}).some(x=>/\.(csv|xlsx?|ods)$/i.test(String(x))));

  ok('Privacidade usa olho riscado',v258.includes("ICONS['eye-off']"));
  ok('Privacidade é global por configuração',v258.includes('settings().dashboardPrivacy'));
  ok('Privacidade guarda textos originais',v258.includes('PRIVACY_TEXT_ORIGINALS=new WeakMap'));
  ok('Privacidade guarda tooltips originais',v258.includes('PRIVACY_TITLE_ORIGINALS=new WeakMap'));
  ok('Privacidade restaura texto original',v258.includes('PRIVACY_TEXT_ORIGINALS.get(node)'));
  ok('Privacidade restaura tooltip original',v258.includes('PRIVACY_TITLE_ORIGINALS.get(element)'));
  ok('Privacidade atualiza janela já aberta',v258.includes("maskPrivacy256(document.querySelector('#modal-root .modal'))"));
  ok('Campos monetários são mascarados',v258.includes('data-privacy-masked-v256'));
  ok('Olhos recebem aria-pressed',v258.includes("setAttribute('aria-pressed'"));

  ok('Filtro possui mês/ano',v258.includes('type="month" data-period-month-v256'));
  ok('Filtro possui De',v258.includes('<span>De</span>'));
  ok('Filtro possui Até',v258.includes('<span>Até</span>'));
  ok('Filtro possui vassoura',v258.includes('title="Limpar período"'));
  ok('OSV usa filtro padronizado',v258.includes("periodControls256('orders')"));
  ok('Financeiro usa filtro padronizado',v258.includes("periodControls256('finance')"));
  ok('Documentos usa filtro padronizado',v258.includes("periodControls256('documents')"));
  ok('Status vem depois do período',v258.indexOf("periodControls256('orders')")<v258.indexOf('data-order-status-v256'));
  ok('Arquivadas vem depois do status',v258.indexOf('data-order-status-v256')<v258.indexOf("toggle-archived-orders"));
  ok('Exportar CSV é ícone',v258.includes("iconButton('export-finance','Exportar CSV','download')"));
  ok('Controles têm altura uniforme',css.includes('min-height:40px!important;height:40px!important'));

  ok('Linha de OSV abre visualização',v258.includes('data-row-action="view-order"'));
  ok('Linha de cliente abre visualização',v258.includes('data-row-action="view-client"'));
  ok('Linha financeira abre edição',v258.includes('data-row-action="edit-payment"'));
  ok('Linha de serviço abre edição',v258.includes('data-row-action="edit-service"'));
  ok('Linha de produto abre edição',v258.includes('data-row-action="edit-product"'));
  ok('Linha de insumo abre edição',v258.includes('data-row-action="edit-supply"'));
  ok('Linha de movimentação abre edição',v258.includes('data-row-action="edit-stock-movement"'));
  ok('Linha de documento abre PDF',v258.includes('data-row-action="open-document"'));
  ok('Controles internos bloqueiam clique da linha',v258.includes('interactive&&interactive!==row'));
  ok('Linha acessível continua ativável',v258.includes('interactive!==row'));

  ok('Clientes têm ID',v258.includes('<th>ID</th><th>Cliente</th>'));
  ok('Clientes têm data de cadastro',v258.includes('<th>Data de cadastro</th>'));
  ok('Clientes têm total movimentado',v258.includes('<th>Total movimentado</th>'));
  ok('Ordenação de clientes cobre sete colunas',v255.includes("clients:{labels:['ID','Cliente','Contato','Cidade','Data de cadastro','Ordens','Total movimentado']"));
  ok('Ordenação tem estado neutro',v255.includes("state.direction==='default'"));
  ok('Arquivados é botão compacto',v258.includes("archivedButton('toggle-archived-clients'"));

  ok('Serviços têm ID',v258.includes('catalog-services-v256"><thead><tr><th>ID</th><th>Serviço</th>'));
  ok('Produtos têm ID marca fornecedor',v258.includes('<th>ID</th><th>Produto</th><th>Marca</th><th>Fornecedor</th>'));
  ok('Insumos têm ID marca fornecedor',v258.includes('<th>ID</th><th>Insumo</th><th>Marca</th><th>Fornecedor</th>'));
  ok('Movimentações têm Antes → Depois',v258.includes('<th>Antes → Depois</th>'));
  ok('Movimentações não têm coluna Marca',!/<th>Item<\/th><th>Marca<\/th>/.test(v258));
  ok('Inativos é botão por ícone',v258.includes("'power'"));

  ok('Grade da Visão Geral é densa',css.includes('grid-auto-flow:dense!important'));
  ok('Grade usa 12 passos',css.includes('grid-template-columns:repeat(12'));
  ok('Módulos têm alça de redimensionamento',v258.includes('widget-resize-handle-v256'));
  ok('Redimensionamento ajusta largura',v258.includes("--widget-span-v256"));
  ok('Redimensionamento ajusta altura',v258.includes("--widget-rows-v256"));
  ok('Conteúdo excedente tem scroll interno',css.includes('.dashboard-masonry-v256 .dashboard-widget .widget-scroll{overflow:auto'));
  ok('Faturamento detalha Pix',pts.includes("['Pix',0]"));
  ok('Faturamento detalha Débito',pts.includes("['Débito',0]"));
  ok('Faturamento detalha Dinheiro',pts.includes("['Dinheiro',0]"));
  ok('Faturamento detalha Crédito',pts.includes("['Crédito',0]"));
  ok('Impostos não duplicam em despesas',pts.includes("if(type==='despesa'){if(/imposto|taxa|tribut/.test"));
  ok('Migração amplia Faturamento em perfil antigo',v258.includes('revenueExpandedV257'));

  ok('Cabeçalho de detalhe é mínimo',css.includes('.detail-modal-v256>.modal-header'));
  ok('Título grande do detalhe é ocultado',css.includes('.detail-modal-v256>.modal-header h2'));
  ok('X permanece clicável',css.includes('pointer-events:auto!important'));
  ok('OSV é larga no desktop',css.includes('max-width:1540px!important'));
  ok('OSV fica em uma coluna no celular',css.includes('.detail-grid-v256{grid-template-columns:1fr!important}'));
  ok('Anexos ficam depois de movimentações',v258.includes("/movimenta/i.test(title)?6:/anexos/i.test(title)?7"));
  ok('Botões da OSV são compactos',css.includes('.order-detail-modal-v256 .actions button'));

  ok('Editor visual está na visualização OSV',v258.includes("return 'detail:order'"));
  ok('Editor visual está na visualização cliente',v258.includes("return 'detail:client'"));
  ok('Editor visual está nos formulários',v258.includes("return `form:${form.dataset.form}`"));
  ok('Editor remove controles antigos',v258.includes("toggle-form-layout"));
  ok('Editor reordena por arrastar',v258.includes("document.addEventListener('dragstart'"));
  ok('Editor redimensiona pelo canto',v258.includes('layout-resize-handle-v256'));
  ok('Editor salva por faixa de tela',v258.includes('unifiedLayoutsV256[band]'));
  ok('Editor tem cancelar',v258.includes('cancel-layout-v256'));
  ok('Editor tem restaurar padrão',v258.includes('reset-layout-v256'));
  ok('Restaurar padrão não fecha abruptamente',!v258.match(/reset-layout-v256[\s\S]{0,900}closeModal\(\)/));
  ok('Restaurar padrão remove classe personalizada',v258.includes("classList.remove('has-custom-layout-v256')"));
  ok('Nova janela reinicia sessão do editor',v258.includes('resetModalLayoutSession256'));

  ok('Sidebar é fixa no desktop',css.includes('.sidebar{position:fixed!important'));
  ok('Conteúdo desloca pela largura da sidebar',css.includes('.main{margin-left:var(--sidebar)!important'));
  ok('Sidebar tem três ações compactas',v258.includes('sidebar-quick-actions-v256'));
  ok('Sidebar inclui privacidade',v258.includes('data-action="toggle-privacy"'));
  ok('Sidebar inclui salvar',v258.includes('data-action="manual-save"'));
  ok('Sidebar inclui bloquear',v258.includes('data-action="lock-now"'));
  ok('Botões largos antigos são removidos',v258.includes("sidebarFooter.querySelectorAll('.nav-btn').forEach(button=>button.remove())"));
  ok('Olho do topo é liberado no celular',v258.includes("topPrivacy.classList.remove('desktop-only')"));
  ok('Linhas podem ser abertas por teclado',v258.includes("document.addEventListener('keydown'"));

  const {ctx,profile}=makeContext();
  ok('API v2.5.8 foi carregada',ctx.MarcoV256?.version==='2.5.8');
  ctx.MarcoV256.ensureDefaults();
  ok('Faturamento desktop tem altura mínima 26',profile.settings.dashboardLayouts.desktop.revenue.rows>=26);
  ok('Faturamento desktop tem largura mínima 8',profile.settings.dashboardLayouts.desktop.revenue.span>=8);
  let p=ctx.MarcoV256.periodState('orders');p.month='2026-07';p.fromDay='18';p.toDay='';
  ok('Campo De sozinho seleciona um dia',ctx.MarcoV256.matchesPeriod('2026-07-18','orders')&&!ctx.MarcoV256.matchesPeriod('2026-07-19','orders'));
  p.toDay='20';
  ok('De/Até seleciona intervalo',ctx.MarcoV256.matchesPeriod('2026-07-19','orders')&&!ctx.MarcoV256.matchesPeriod('2026-07-21','orders'));
  p.fromDay='20';p.toDay='18';
  ok('Intervalo invertido é normalizado',ctx.MarcoV256.matchesPeriod('2026-07-19','orders'));
  p.month='2026-06';
  ok('Mês/ano é respeitado',!ctx.MarcoV256.matchesPeriod('2026-07-19','orders'));
  p.month='';p.fromDay='';p.toDay='';
  ok('Filtro vazio permite todos os dias',ctx.MarcoV256.matchesPeriod('2026-07-19','orders'));

  const parent={closest:()=>null};
  const text={nodeValue:'Total R$ 1.234,56 e margem 35,5%',parentElement:parent};
  const title={title:'Receita R$ 1.234,56'};
  const input={type:'text',dataset:{},setAttribute(k,v){this[k]=v;},removeAttribute(k){delete this[k];}};
  const root={textNodes:[text],classList:{toggle(){}},querySelectorAll(sel){if(sel==='input[data-money="true"]')return[input];if(sel==='[title]')return[title];return[];}};
  profile.settings.dashboardPrivacy=true;ctx.MarcoV256.maskPrivacy(root);
  ok('Privacidade mascara texto monetário',text.nodeValue.includes('••••')&&!text.nodeValue.includes('1.234,56'));
  ok('Privacidade mascara percentual',!text.nodeValue.includes('35,5%'));
  ok('Privacidade mascara tooltip',title.title.includes('••••'));
  ok('Privacidade mascara campo monetário',input.type==='password');
  profile.settings.dashboardPrivacy=false;ctx.MarcoV256.maskPrivacy(root);
  ok('Privacidade restaura texto monetário',text.nodeValue.includes('R$ 1.234,56'));
  ok('Privacidade restaura percentual',text.nodeValue.includes('35,5%'));
  ok('Privacidade restaura tooltip',title.title==='Receita R$ 1.234,56');
  ok('Privacidade restaura tipo do campo',input.type==='text');

  const orders=ctx.renderOrders();
  const finance=ctx.renderFinance();
  const clients=ctx.renderClients();
  ctx.ACTIVE_TAB.catalog='movements';const movements=ctx.renderCatalog();
  const documents=ctx.renderDocuments();
  ok('HTML real de OSV mantém ordem Nova→período→status→arquivo',orders.indexOf('new-order')<orders.indexOf('period-filter-v256')&&orders.indexOf('period-filter-v256')<orders.indexOf('data-order-status-v256')&&orders.indexOf('data-order-status-v256')<orders.indexOf('toggle-archived-orders'));
  ok('HTML real de Financeiro mantém exportar por último',finance.indexOf('period-filter-v256')<finance.indexOf('export-finance'));
  ok('HTML real de Clientes contém colunas pedidas',/ID<\/th><th>Cliente<\/th><th>Contato<\/th><th>Cidade<\/th><th>Data de cadastro<\/th><th>Ordens<\/th><th>Total movimentado/.test(clients));
  ok('HTML real de Movimentações contém Antes → Depois',movements.includes('Antes → Depois'));
  ok('HTML real de Documentos possui clique no PDF',documents.includes('data-row-action="open-document"'));

  return {run,passed:checks.filter(x=>x.ok).length,total:checks.length,failures:checks.filter(x=>!x.ok)};
}

const runs=[];
for(let run=1;run<=20;run++)runs.push(runChecklist(run));
const output={
  version:'2.5.8',
  generated_at:new Date().toISOString(),
  full_checklist_runs:runs.length,
  checks_per_run:runs[0]?.total||0,
  total_assertions:runs.reduce((s,r)=>s+r.total,0),
  passed_assertions:runs.reduce((s,r)=>s+r.passed,0),
  all_passed:runs.every(r=>r.passed===r.total),
  runs,
  sha256_test_script:crypto.createHash('sha256').update(fs.readFileSync(__filename)).digest('hex'),
  limitations:[
    'A autenticação e a gravação real na conta Google do Marco exigem homologação conectada.',
    'A validação estrutural 20x é complementada por RESULTADO_NAVEGADOR_20X_V2_5_8.json, gerado em Chromium controlado com dados sintéticos.'
  ]
};
const out=path.join(ROOT,'RESULTADO_VALIDACAO_20X_V2_5_8.json');
fs.writeFileSync(out,JSON.stringify(output,null,2));
console.log(JSON.stringify({all_passed:output.all_passed,runs:output.full_checklist_runs,checks_per_run:output.checks_per_run,total_assertions:output.total_assertions,failures:runs.flatMap(r=>r.failures)},null,2));
process.exit(output.all_passed?0:1);
