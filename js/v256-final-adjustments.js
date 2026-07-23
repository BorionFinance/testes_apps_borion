'use strict';

/* Marco Iris Tecnologia v2.5.8 — ajustes finais solicitados após a migração.
 * Esta camada é carregada por último para preservar a base histórica e substituir
 * somente apresentação, filtros, cliques e personalização visual.
 */
(() => {
  const VERSION='2.5.8';
  const ORDER_STATUSES=['Orçamento','Em andamento','Aguardando peça','Concluída','Cancelada'];
  const INTERACTIVE_SELECTOR='button,a,input,select,textarea,label,summary,details,[role="button"],[contenteditable="true"]';
  const ENTITY_EDIT_ACTION={service:'edit-service',product:'edit-product',supply:'edit-supply',movement:'edit-stock-movement'};
  const MODAL_LAYOUT={editing:false,key:'',snapshot:null,drag:null};
  const PRIVACY_TEXT_ORIGINALS=new WeakMap();
  const PRIVACY_TITLE_ORIGINALS=new WeakMap();
  let RESIZE_SESSION=null;

  if(typeof ICONS!=='undefined'&&!ICONS['eye-off'])ICONS['eye-off']='<path d="M3 3l18 18"/><path d="M10.6 10.7a2 2 0 0 0 2.7 2.7"/><path d="M9.9 4.3A10.7 10.7 0 0 1 12 4c6 0 10 8 10 8a18.2 18.2 0 0 1-2.1 3.1"/><path d="M6.6 6.6C3.8 8.5 2 12 2 12s4 8 10 8a9.7 9.7 0 0 0 4.1-.9"/>';
  if(typeof ICONS!=='undefined'&&!ICONS.archive)ICONS.archive='<path d="M4 4h16v4H4z"/><path d="M6 8v12h12V8"/><path d="M10 12h4"/>';
  if(typeof ICONS!=='undefined'&&!ICONS.power)ICONS.power='<path d="M12 2v10"/><path d="M6.3 5.7a8 8 0 1 0 11.4 0"/>';

  const settings=()=>{const d=data();d.settings=d.settings||{};return d.settings;};
  const screenBand256=()=>window.innerWidth<=720?'mobile':window.innerWidth<=1100?'tablet':'desktop';
  const parseSequence=value=>Number(String(value||'').match(/(\d+)(?!.*\d)/)?.[1]||0);
  const isCancelledPayment=p=>norm(p?.status).includes('cancel')||!!p?.cancelledAt||p?.active===false;
  const isPaidPayment=p=>!isCancelledPayment(p)&&!!p?.paymentDate;
  const orderNotArchived=o=>o?.registrationStatus!=='Inativo';
  const orderNotCancelled=o=>!norm(o?.status).includes('cancel');
  const currentOrderStatus=()=>settings().orderStatusFilterV256||'Todos';

  function orderFinance256(order){
    if(!order||!orderNotCancelled(order))return {status:'Cancelado',paid:0,balance:0,overdue:false,dueDate:''};
    const receipts=orderPayments(order.id).filter(p=>norm(p.type)==='receita'&&!isCancelledPayment(p));
    const paid=receipts.filter(isPaidPayment).reduce((sum,p)=>sum+num(p.value),0);
    const unpaid=receipts.filter(p=>!isPaidPayment(p));
    const dueDate=unpaid.map(p=>p.dueDate).filter(Boolean).sort()[0]||'';
    const overdue=unpaid.some(p=>p.dueDate&&String(p.dueDate).slice(0,10)<today());
    const balance=Math.max(0,num(order.total)-paid);
    const status=balance<=.005&&num(order.total)>0?'Pago':paid>0?'Parcial':overdue?'Vencido':'Em aberto';
    return {status,paid,balance,overdue,dueDate};
  }

  function periodState256(section){
    const s=settings();s.periodFilters=s.periodFilters||{};
    const state=s.periodFilters[section]||(s.periodFilters[section]={month:'',fromDay:'',toDay:''});
    if(state.days&&!state.fromDay){
      const match=String(state.days).match(/^(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?$/);
      if(match){state.fromDay=match[1];state.toDay=match[2]||'';}
      delete state.days;
    }
    state.month=String(state.month||'');state.fromDay=String(state.fromDay||'');state.toDay=String(state.toDay||'');
    return state;
  }
  function clampDay(value){const parsed=Number(value);return Number.isFinite(parsed)&&parsed>0?Math.max(1,Math.min(31,Math.trunc(parsed))):0;}
  function matchesPeriod256(value,section){
    const state=periodState256(section),date=String(value||'').slice(0,10);
    if(state.month&&date.slice(0,7)!==state.month)return false;
    const from=clampDay(state.fromDay),to=clampDay(state.toDay),day=clampDay(date.slice(8,10));
    if(!from&&!to)return true;
    if(from&&!to)return day===from;
    if(!from&&to)return day===to;
    return day>=Math.min(from,to)&&day<=Math.max(from,to);
  }
  function periodControls256(section){
    const state=periodState256(section);
    return `<div class="period-filter-v256" data-period-section="${attr(section)}"><input class="filter-control period-month-v256" type="month" data-period-month-v256="${attr(section)}" value="${attr(state.month)}" aria-label="Selecionar mês e ano"><label class="period-day-v256"><span>De</span><input class="filter-control" type="number" min="1" max="31" inputmode="numeric" data-period-from-v256="${attr(section)}" value="${attr(state.fromDay)}" placeholder="Dia" aria-label="Dia inicial"></label><label class="period-day-v256"><span>Até</span><input class="filter-control" type="number" min="1" max="31" inputmode="numeric" data-period-to-v256="${attr(section)}" value="${attr(state.toDay)}" placeholder="Dia" aria-label="Dia final"></label><button type="button" class="icon-btn control-square-v256" data-action="clear-period-v256" data-section="${attr(section)}" title="Limpar período" aria-label="Limpar período">🧹</button></div>`;
  }
  function iconButton(action,title,iconName,extra=''){
    return `<button type="button" class="icon-btn control-square-v256" data-action="${attr(action)}" title="${attr(title)}" aria-label="${attr(title)}" ${extra}>${icon(iconName)}</button>`;
  }
  function archivedButton(action,title,count,showArchived){
    const visibleTitle=showArchived?'Ver ativos':`${title}${Number.isFinite(count)?` (${count})`:''}`;
    return iconButton(action,visibleTitle,showArchived?'check':'archive',`data-count="${attr(count)}"`);
  }
  function quickOrderActions256(order){
    return `<details class="quick-actions"><summary aria-label="Ações rápidas">${icon('menu',18)}</summary><div class="quick-actions-menu"><button data-action="new-payment" data-order="${attr(order.id)}">${icon('finance',16)} Adicionar pagamento</button><button data-action="generate-pdf-background" data-id="${attr(order.id)}">${icon('pdf',16)} Gerar PDF</button><button data-action="view-current-pdf" data-id="${attr(order.id)}">${icon('eye',16)} Visualizar PDF</button><button data-action="share-order" data-id="${attr(order.id)}">${icon('phone',16)} Enviar PDF</button><button data-action="view-client" data-id="${attr(order.clientId)}">${icon('clients',16)} Abrir cliente</button><button data-action="edit-order" data-id="${attr(order.id)}">${icon('edit',16)} Editar OSV</button></div></details>`;
  }

  function ensureDefaults256(){
    if(typeof STATE==='undefined'||!STATE?.dataByProfile)return;
    const s=settings();s.migrations=s.migrations||{};s.dashboardLayouts=s.dashboardLayouts||{};
    if(!s.migrations.revenueExpandedV257){
      for(const band of ['desktop','tablet','mobile']){
        const store=s.dashboardLayouts[band]||(s.dashboardLayouts[band]={}),existing=store.revenue||{},hadSaved=!!store.revenue;
        const oldSpan=Number(existing.span),oldRows=Number(existing.rows),oldOrder=Number(existing.order);
        store.revenue={...existing,span:Math.max(hadSaved&&band==='desktop'?8:12,Number.isFinite(oldSpan)?oldSpan:0),rows:Math.max(26,Number.isFinite(oldRows)?oldRows:0),order:Number.isFinite(oldOrder)?oldOrder:3};
      }
      s.migrations.revenueExpandedV257={version:VERSION,appliedAt:new Date().toISOString()};
    }
    if(!s.migrations.finalAdjustmentsV256)s.migrations.finalAdjustmentsV256={version:VERSION,appliedAt:new Date().toISOString()};
    if(!s.migrations.recheckV257)s.migrations.recheckV257={version:VERSION,appliedAt:new Date().toISOString()};
  }

  const renderShellBase256=renderShell;
  renderShell=function(entry=''){
    ensureDefaults256();
    renderShellBase256(entry);
    const sidebarFooter=document.querySelector('.sidebar-footer');
    if(sidebarFooter){
      sidebarFooter.querySelectorAll('.nav-btn').forEach(button=>button.remove());
      if(!sidebarFooter.querySelector('.sidebar-quick-actions-v256'))sidebarFooter.insertAdjacentHTML('beforeend',`<div class="sidebar-quick-actions-v256"><button class="icon-btn" title="Ocultar ou mostrar valores" aria-label="Ocultar ou mostrar valores" data-action="toggle-privacy">${icon(settings().dashboardPrivacy?'eye-off':'eye')}</button><button class="icon-btn" title="Salvar no Google Drive" aria-label="Salvar no Google Drive" data-action="manual-save">${icon('save')}</button><button class="icon-btn lock-sidebar-btn" title="Bloquear tela" aria-label="Bloquear tela" data-action="lock-now">${icon('lock')}</button></div>`);
    }
    const topPrivacy=document.querySelector('.top-actions [data-action="toggle-privacy"]');
    if(topPrivacy)topPrivacy.classList.remove('desktop-only');
    updatePrivacyButtons256();
  };

  renderOrders=function(){
    const mode=getViewMode('orders'),all=[...data().serviceOrders].filter(o=>matches(o.id,o.clientName,findClient(o.clientId)?.name,o.equipmentType,o.brandModel,o.status,o.reportedIssue));
    const rows=all.filter(o=>(SHOW_ARCHIVED.orders?o.registrationStatus==='Inativo':o.registrationStatus!=='Inativo')&&matchesPeriod256(o.openedAt||o.createdAt,'orders')).sort((a,b)=>String(b.openedAt||'').localeCompare(String(a.openedAt||'')));
    const status=currentOrderStatus(),filtered=status==='Todos'?rows:rows.filter(o=>norm(o.status)===norm(status)),archived=all.filter(o=>o.registrationStatus==='Inativo').length;
    return `<div class="toolbar unified-toolbar-v256 orders-toolbar"><div class="toolbar-left"><button class="btn primary control-main-v256" data-action="new-order">${icon('plus')} Nova OSV</button>${periodControls256('orders')}<select class="filter-control control-status-v256" data-order-status-v256 aria-label="Filtrar por status"><option>Todos</option>${ORDER_STATUSES.map(value=>`<option ${value===status?'selected':''}>${esc(value)}</option>`).join('')}</select>${archivedButton('toggle-archived-orders','Arquivadas',archived,SHOW_ARCHIVED.orders)}</div><div class="toolbar-right">${viewModeSwitcher('orders',mode)}<span class="badge blue">${filtered.length} OSVs</span></div></div><section class="card view-mode-content mode-${mode}" data-view-content="orders"><div class="table-wrap"><table class="table osv-table"><thead><tr><th>OSV</th><th>Abertura</th><th>Cliente</th><th>Equipamento</th><th>Financeiro</th><th>Status</th><th class="text-right">Valor</th><th>Ações</th></tr></thead><tbody>${filtered.map(order=>{const f=orderFinance256(order);return `<tr class="clickable-row-v256" data-row-action="view-order" data-id="${attr(order.id)}"><td><strong>${esc(order.id)}</strong>${order.registrationStatus==='Inativo'?'<small class="muted">Arquivada</small>':''}</td><td>${formatDate(order.openedAt)}</td><td><button class="text-link" data-action="view-client" data-id="${attr(order.clientId)}">${esc(order.clientName||findClient(order.clientId)?.name||'—')}</button></td><td><strong>${esc(order.equipmentType||'—')}</strong><small class="muted">${esc(order.brandModel||'')}</small></td><td>${statusBadge(f.status==='Parcial'&&f.overdue?'Parcial - vencido':f.status)}<small class="muted">${f.balance>0?currency(f.balance)+' pendente':''}</small></td><td><div class="inline-status-shell" data-status-tone="${attr(norm(order.status))}"><select class="inline-status" data-quick-order-status="${attr(order.id)}" aria-label="Status operacional da OSV ${attr(order.id)}">${ORDER_STATUSES.map(value=>`<option value="${attr(value)}" ${value===order.status?'selected':''}>${esc(value)}</option>`).join('')}</select><span class="inline-status-chevron" aria-hidden="true">${icon('arrow',14)}</span><span class="inline-status-saving" aria-hidden="true"></span></div></td><td class="text-right"><strong>${currency(order.total)}</strong></td><td>${quickOrderActions256(order)}</td></tr>`;}).join('')||'<tr><td colspan="8"><div class="empty">Nenhuma OSV encontrada.</div></td></tr>'}</tbody></table></div></section>`;
  };

  renderClients=function(){
    const mode=getViewMode('clients'),all=[...data().clients].filter(c=>matches(c.id,c.name,c.document,c.phone,c.city,c.address,c.notes));
    const clients=all.filter(c=>SHOW_ARCHIVED.clients?c.status==='Inativo':c.status!=='Inativo').sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'pt-BR')),archived=all.filter(c=>c.status==='Inativo').length;
    return `<div class="toolbar unified-toolbar-v256"><div class="toolbar-left"><button class="btn primary control-main-v256" data-action="new-client">${icon('plus')} Novo cliente</button>${archivedButton('toggle-archived-clients','Clientes arquivados',archived,SHOW_ARCHIVED.clients)}</div><div class="toolbar-right">${viewModeSwitcher('clients',mode)}<span class="badge blue">${clients.length} clientes</span></div></div><section class="card view-mode-content mode-${mode}" data-view-content="clients"><div class="table-wrap"><table class="table clients-table-v256"><thead><tr><th>ID</th><th>Cliente</th><th>Contato</th><th>Cidade</th><th>Data de cadastro</th><th>Ordens</th><th>Total movimentado</th><th>Ações</th></tr></thead><tbody>${clients.map(client=>{const orders=data().serviceOrders.filter(order=>order.clientId===client.id&&order.registrationStatus!=='Inativo'),total=orders.reduce((sum,order)=>sum+num(order.total),0);return `<tr class="clickable-row-v256" data-row-action="view-client" data-id="${attr(client.id)}"><td><strong>${esc(client.id)}</strong></td><td><strong>${esc(client.name)}</strong>${client.document?`<small class="muted">${esc(client.document)}</small>`:''}${client.status==='Inativo'?'<small class="muted">Arquivado</small>':''}</td><td>${whatsappNumber(client.phoneNormalized||client.phone)?`<a href="${phoneLink(client.phoneNormalized||client.phone)}" target="_blank">${esc(client.phone)}</a>`:'—'}</td><td>${esc(client.city||'—')}</td><td>${formatDate(client.createdAt)}</td><td>${orders.length}</td><td><strong>${currency(total)}</strong></td><td><div class="actions"><button title="Editar" data-action="edit-client" data-id="${attr(client.id)}">${icon('edit')}</button><button title="${client.status==='Inativo'?'Restaurar':'Arquivar'}" data-action="toggle-client-status" data-id="${attr(client.id)}">${icon(client.status==='Inativo'?'check':'folder')}</button><button title="Excluir definitivamente" data-action="delete-client" data-id="${attr(client.id)}">${icon('trash')}</button></div></td></tr>`;}).join('')||'<tr><td colspan="8"><div class="empty">Nenhum cliente encontrado.</div></td></tr>'}</tbody></table></div></section>`;
  };

  function financeIndicators256(){
    const paid=(data().payments||[]).filter(p=>isPaidPayment(p)),activeOrders=(data().serviceOrders||[]).filter(orderNotCancelled);
    let service=0,product=0,expenses=0,taxes=0;
    for(const p of paid){
      const value=num(p.value);if(norm(p.type)==='despesa'){if(/imposto|taxa|tribut/.test(norm(`${p.category||''} ${p.expenseCategory||''} ${p.notes||''}`)))taxes+=value;else expenses+=value;continue;}
      const order=findOrder(p.orderId),items=order?orderItems(order.id):[],serviceBase=items.filter(i=>norm(i.type)==='servico').reduce((s,i)=>s+num(i.subtotal),0),productBase=items.filter(i=>norm(i.type)==='produto').reduce((s,i)=>s+num(i.subtotal),0),base=serviceBase+productBase;
      if(base>0){service+=value*(serviceBase/base);product+=value*(productBase/base);}else service+=value;
      taxes+=num(p.fee);
    }
    const total=service+product,receivable=activeOrders.reduce((sum,o)=>sum+orderFinance256(o).balance,0);
    return {service,product,total,expenses,taxes,balance:total-expenses-taxes,receivable};
  }
  renderFinance=function(){
    const mode=getViewMode('finance'),list=[...data().payments].filter(p=>matches(p.id,p.code,p.type,p.paymentMethod,p.status,p.notes,p.orderId,findOrder(p.orderId)?.clientName)).filter(p=>matchesPeriod256(p.paymentDate||p.dueDate||p.createdAt,'finance')).sort((a,b)=>String(b.paymentDate||b.dueDate||b.createdAt||'').localeCompare(String(a.paymentDate||a.dueDate||a.createdAt||''))),k=financeIndicators256();
    const effective=p=>isCancelledPayment(p)?'Cancelado':p.paymentDate?'Pago':p.dueDate&&String(p.dueDate).slice(0,10)<today()?'Vencido':num(p.value)>0?'Em aberto':'Em aberto';
    return `<div class="grid kpis mit-finance-kpis"><div class="card kpi"><div class="kpi-icon green">${icon('finance')}</div><div><small>Receita de Serviços</small><strong>${currency(k.service)}</strong></div></div><div class="card kpi"><div class="kpi-icon blue">${icon('stock')}</div><div><small>Receita de Produtos</small><strong>${currency(k.product)}</strong></div></div><div class="card kpi"><div class="kpi-icon green">${icon('finance')}</div><div><small>Receita Total</small><strong>${currency(k.total)}</strong></div></div><div class="card kpi"><div class="kpi-icon red">${icon('finance')}</div><div><small>Despesas</small><strong>${currency(k.expenses)}</strong></div></div><div class="card kpi"><div class="kpi-icon orange">${icon('documents')}</div><div><small>Impostos</small><strong>${currency(k.taxes)}</strong></div></div><div class="card kpi"><div class="kpi-icon blue">${icon('finance')}</div><div><small>Saldo</small><strong>${currency(k.balance)}</strong></div></div><div class="card kpi"><div class="kpi-icon orange">${icon('agenda')}</div><div><small>Valores a Receber</small><strong>${currency(k.receivable)}</strong></div></div></div><div class="toolbar unified-toolbar-v256"><div class="toolbar-left"><button class="btn primary control-main-v256" data-action="new-payment">${icon('plus')} Novo lançamento</button>${periodControls256('finance')}${iconButton('export-finance','Exportar CSV','download')}</div><div class="toolbar-right">${viewModeSwitcher('finance',mode)}<span class="badge blue">${list.length} lançamentos</span></div></div><section class="card view-mode-content mode-${mode}" data-view-content="finance"><div class="table-wrap"><table class="table finance-table-v256"><thead><tr><th>Data</th><th>ID</th><th>Tipo</th><th>Cliente / OSV</th><th>Forma</th><th>Status</th><th>Taxa</th><th class="text-right">Valor líquido</th><th>Ações</th></tr></thead><tbody>${list.map(payment=>{const order=findOrder(payment.orderId),status=effective(payment);return `<tr class="clickable-row-v256" data-row-action="edit-payment" data-id="${attr(payment.id)}"><td>${formatDate(payment.paymentDate||payment.dueDate)}</td><td><strong>${esc(payment.code||payment.id)}</strong></td><td>${statusBadge(payment.type)}</td><td>${order?`<button class="text-link" data-action="view-client" data-id="${attr(order.clientId)}">${esc(order.clientName||'Cliente')}</button><button class="code-link" data-action="view-order" data-id="${attr(order.id)}">${esc(order.id)}</button>`:esc(payment.notes||'Sem OSV vinculada')}</td><td>${esc(payment.paymentMethod||'—')}</td><td>${statusBadge(status)}</td><td>${currency(payment.fee)}</td><td class="text-right"><strong class="${norm(payment.type)==='despesa'?'danger-text':'success-text'}">${norm(payment.type)==='despesa'?'- ':''}${currency(payment.value)}</strong></td><td><div class="actions"><button title="Editar lançamento" data-action="edit-payment" data-id="${attr(payment.id)}">${icon('edit')}</button><button title="Cancelar mantendo histórico" data-action="cancel-payment" data-id="${attr(payment.id)}">${icon('warning')}</button><button title="Excluir definitivamente" data-action="delete-payment" data-id="${attr(payment.id)}">${icon('trash')}</button></div></td></tr>`;}).join('')||'<tr><td colspan="9"><div class="empty">Nenhum lançamento encontrado.</div></td></tr>'}</tbody></table></div></section>`;
  };

  function catalogCount(kind,id){return (data().priceHistory||[]).filter(row=>norm(row.type)===norm(kind)&&String(row.catalogId||row.itemId||row.serviceId||row.productId||row.supplyId)===String(id)).length;}
  function healthBadge256(type,item){const stock=stockOf(type,item.id),health=window.MarcoStockHealth?.getStockHealth?.(stock,item.minimumStock)||{tone:'ok',label:String(stock)};return {stock,html:`<span class="stock-health-badge ${attr(health.tone)}">${esc(health.label)}</span><small class="muted">${stock}</small>`};}
  function renderCatalogTable256(tab){
    const mode=getViewMode('catalog');
    if(tab==='services'){
      const list=data().services.filter(item=>(SHOW_ARCHIVED.catalog?item.status==='Inativo':item.status!=='Inativo')&&matches(item.id,item.description,item.price)).sort((a,b)=>String(a.description||'').localeCompare(String(b.description||''),'pt-BR'));
      return `<section class="card view-mode-content mode-${mode}"><div class="table-wrap"><table class="table catalog-services-v256"><thead><tr><th>ID</th><th>Serviço</th><th>Preço padrão</th><th>Execuções</th><th>Status</th><th>Ações</th></tr></thead><tbody>${list.map(item=>`<tr class="clickable-row-v256" data-row-action="edit-service" data-id="${attr(item.id)}"><td><strong>${esc(item.id)}</strong></td><td><strong>${esc(item.description)}</strong></td><td>${currency(item.price)}</td><td>${catalogCount('Serviço',item.id)}</td><td>${statusBadge(item.status)}</td><td><div class="actions"><button title="Editar serviço" data-action="edit-service" data-id="${attr(item.id)}">${icon('edit')}</button><button title="${item.status==='Inativo'?'Restaurar':'Arquivar'} serviço" data-action="toggle-catalog-status" data-kind="service" data-id="${attr(item.id)}">${icon(item.status==='Inativo'?'check':'folder')}</button></div></td></tr>`).join('')||'<tr><td colspan="6"><div class="empty">Nenhum serviço cadastrado.</div></td></tr>'}</tbody></table></div></section>`;
    }
    if(tab==='products'){
      const list=data().products.filter(item=>(SHOW_ARCHIVED.catalog?item.status==='Inativo':item.status!=='Inativo')&&matches(item.id,item.description,item.brand,item.supplier)).sort((a,b)=>String(a.description||'').localeCompare(String(b.description||''),'pt-BR'));
      return `<section class="card view-mode-content mode-${mode}"><div class="table-wrap"><table class="table catalog-products-v256"><thead><tr><th>ID</th><th>Produto</th><th>Marca</th><th>Fornecedor</th><th>Custo</th><th>Margem</th><th>Venda</th><th>Estoque</th><th>Mínimo</th><th>Ações</th></tr></thead><tbody>${list.map(item=>{const stock=healthBadge256('Produto',item);return `<tr class="clickable-row-v256" data-row-action="edit-product" data-id="${attr(item.id)}"><td><strong>${esc(item.id)}</strong></td><td><strong>${esc(item.description)}</strong></td><td>${esc(item.brand||'—')}</td><td>${esc(item.supplier||'—')}</td><td>${currency(item.cost)}</td><td>${(num(item.margin)*100).toFixed(1).replace('.',',')}%</td><td>${currency(item.salePrice)}</td><td>${stock.html}</td><td>${item.minimumStock===''||item.minimumStock==null?'—':num(item.minimumStock)}</td><td><div class="actions"><button title="Atualizar custo" data-action="update-cost" data-kind="product" data-id="${attr(item.id)}">${icon('finance')}</button><button title="Editar produto" data-action="edit-product" data-id="${attr(item.id)}">${icon('edit')}</button><button title="${item.status==='Inativo'?'Restaurar':'Arquivar'} produto" data-action="toggle-catalog-status" data-kind="product" data-id="${attr(item.id)}">${icon(item.status==='Inativo'?'check':'folder')}</button></div></td></tr>`;}).join('')||'<tr><td colspan="10"><div class="empty">Nenhum produto cadastrado.</div></td></tr>'}</tbody></table></div></section>`;
    }
    if(tab==='supplies'){
      const list=data().supplies.filter(item=>(SHOW_ARCHIVED.catalog?item.status==='Inativo':item.status!=='Inativo')&&matches(item.id,item.description,item.brand,item.supplier)).sort((a,b)=>String(a.description||'').localeCompare(String(b.description||''),'pt-BR'));
      return `<section class="card view-mode-content mode-${mode}"><div class="table-wrap"><table class="table catalog-supplies-v256"><thead><tr><th>ID</th><th>Insumo</th><th>Marca</th><th>Fornecedor</th><th>Custo</th><th>Estoque</th><th>Mínimo</th><th>Ações</th></tr></thead><tbody>${list.map(item=>{const stock=healthBadge256('Insumo',item);return `<tr class="clickable-row-v256" data-row-action="edit-supply" data-id="${attr(item.id)}"><td><strong>${esc(item.id)}</strong></td><td><strong>${esc(item.description)}</strong></td><td>${esc(item.brand||'—')}</td><td>${esc(item.supplier||'—')}</td><td>${currency(item.cost)}</td><td>${stock.html}</td><td>${item.minimumStock===''||item.minimumStock==null?'—':num(item.minimumStock)}</td><td><div class="actions"><button title="Atualizar custo" data-action="update-cost" data-kind="supply" data-id="${attr(item.id)}">${icon('finance')}</button><button title="Editar insumo" data-action="edit-supply" data-id="${attr(item.id)}">${icon('edit')}</button><button title="${item.status==='Inativo'?'Restaurar':'Arquivar'} insumo" data-action="toggle-catalog-status" data-kind="supply" data-id="${attr(item.id)}">${icon(item.status==='Inativo'?'check':'folder')}</button></div></td></tr>`;}).join('')||'<tr><td colspan="8"><div class="empty">Nenhum insumo cadastrado.</div></td></tr>'}</tbody></table></div></section>`;
    }
    const list=[...data().stockMovements].filter(m=>matches(m.id,m.date,m.movementType,m.orderId,m.notes,itemForMovement(m)?.description)).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||parseSequence(b.id)-parseSequence(a.id));
    return `<section class="card view-mode-content mode-${mode}"><div class="table-wrap"><table class="table catalog-movements-v256"><thead><tr><th>ID</th><th>Data</th><th>Item</th><th>Tipo</th><th>Quantidade</th><th>Antes → Depois</th><th>OSV</th><th>Observação</th><th>Ações</th></tr></thead><tbody>${list.map(movement=>{const item=itemForMovement(movement);return `<tr class="clickable-row-v256" data-row-action="edit-stock-movement" data-id="${attr(movement.id)}"><td><strong>${esc(movement.id)}</strong></td><td>${formatDate(movement.date)}</td><td><strong>${esc(item?.description||'Item não encontrado')}</strong><small class="muted">${esc(movement.itemType||'')}</small></td><td>${statusBadge(movement.movementType)}</td><td>${num(movement.quantity)}</td><td><strong>${num(movement.stockBefore)} → ${num(movement.stockAfter)}</strong></td><td>${movement.orderId?`<button class="code-link" data-action="view-order" data-id="${attr(movement.orderId)}">${esc(movement.orderId)}</button>`:'—'}</td><td>${esc(movement.notes||'—')}</td><td><div class="actions"><button title="Editar movimentação" data-action="edit-stock-movement" data-id="${attr(movement.id)}">${icon('edit')}</button><button title="Excluir movimentação" data-action="delete-stock-movement" data-id="${attr(movement.id)}">${icon('trash')}</button></div></td></tr>`;}).join('')||'<tr><td colspan="9"><div class="empty">Nenhuma movimentação encontrada.</div></td></tr>'}</tbody></table></div></section>`;
  }
  renderCatalog=function(){
    const tab=ACTIVE_TAB.catalog||'services',mode=getViewMode('catalog'),archived=[...data().products,...data().services,...data().supplies].filter(item=>item.status==='Inativo').length;
    return `<div class="toolbar unified-toolbar-v256 catalog-toolbar-v256"><div class="toolbar-left"><div class="tabs"><button class="${tab==='services'?'active':''}" data-action="catalog-tab" data-tab="services">Serviços</button><button class="${tab==='products'?'active':''}" data-action="catalog-tab" data-tab="products">Produtos</button><button class="${tab==='supplies'?'active':''}" data-action="catalog-tab" data-tab="supplies">Insumos</button><button class="${tab==='movements'?'active':''}" data-action="catalog-tab" data-tab="movements">Movimentações</button></div>${iconButton('toggle-archived-catalog',SHOW_ARCHIVED.catalog?'Ver ativos':`Inativos (${archived})`,SHOW_ARCHIVED.catalog?'check':'power')}</div><div class="toolbar-right">${viewModeSwitcher('catalog',mode)}${tab==='movements'?`<button class="btn primary control-main-v256" data-action="new-stock-movement">${icon('plus')} Movimentar estoque</button>`:`<button class="btn primary control-main-v256" data-action="new-catalog-item">${icon('plus')} Novo cadastro</button>`}</div></div>${renderCatalogTable256(tab)}`;
  };

  renderDocuments=function(){
    const mode=getViewMode('documents'),official=data().serviceOrders.flatMap(order=>{const pdfs=(order.pdfs||[]).slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||''))),latest=pdfs.find(file=>file.official!==false)||pdfs[0];return latest?[{...latest,order}]:[];}).filter(row=>matches(row.fileName,row.order.id,row.order.clientName)).filter(row=>matchesPeriod256(row.createdAt,'documents'));
    return `<div class="toolbar unified-toolbar-v256 documents-toolbar-v256"><div class="toolbar-left"><h2>PDFs das OSVs</h2>${periodControls256('documents')}</div><div class="toolbar-right">${viewModeSwitcher('documents',mode)}<span class="badge blue">${official.length} PDFs oficiais</span></div></div><section class="card view-mode-content mode-${mode}"><div class="table-wrap"><table class="table documents-table-v256"><thead><tr><th>OSV</th><th>Cliente</th><th>Data/hora</th><th>Arquivo</th><th>Ações</th></tr></thead><tbody>${official.map(row=>`<tr class="clickable-row-v256" data-row-action="open-document" data-order="${attr(row.order.id)}" data-media="${attr(row.id)}"><td><button class="code-link" data-action="view-order" data-id="${attr(row.order.id)}">${esc(row.order.id)}</button></td><td><button class="text-link" data-action="view-client" data-id="${attr(row.order.clientId)}">${esc(row.order.clientName||'Cliente')}</button></td><td>${formatDateTime(row.createdAt)}</td><td><strong>${esc(row.fileName||'Documento.pdf')}</strong></td><td><div class="actions"><button title="Abrir PDF" data-action="open-order-file" data-order="${attr(row.order.id)}" data-media="${attr(row.id)}">${icon('eye')}</button><button title="Enviar ao cliente" data-action="share-order" data-id="${attr(row.order.id)}">${icon('phone')}</button><button title="Abrir cliente" data-action="view-client" data-id="${attr(row.order.clientId)}">${icon('clients')}</button><button title="Abrir OSV" data-action="view-order" data-id="${attr(row.order.id)}">${icon('orders')}</button></div></td></tr>`).join('')||'<tr><td colspan="5"><div class="empty">Nenhum PDF oficial gerado.</div></td></tr>'}</tbody></table></div></section>`;
  };

  function updatePrivacyButtons256(){
    const hidden=!!settings().dashboardPrivacy;
    document.querySelectorAll('[data-action="toggle-privacy"]').forEach(button=>{button.innerHTML=icon(hidden?'eye-off':'eye');button.title=hidden?'Mostrar valores':'Ocultar valores';button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',String(hidden));});
  }
  function maskPrivacy256(root=document){
    const hidden=!!settings().dashboardPrivacy;updatePrivacyButtons256();if(!root)return;
    root.classList?.toggle('privacy-values-hidden-v256',hidden);
    root.querySelectorAll?.('input[data-money="true"]').forEach(input=>{
      if(hidden){
        if(!input.dataset.privacyOriginalTypeV256)input.dataset.privacyOriginalTypeV256=input.type||'text';
        if(['text','search','tel','url'].includes(input.type))input.type='password';
        input.setAttribute('data-privacy-masked-v256','true');
      }else{
        if(input.dataset.privacyOriginalTypeV256)input.type=input.dataset.privacyOriginalTypeV256;
        delete input.dataset.privacyOriginalTypeV256;input.removeAttribute('data-privacy-masked-v256');
      }
    });
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){const parent=node.parentElement;if(!parent||parent.closest('script,style,textarea,input,select,option'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}}),nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes){
      if(hidden){
        const current=String(node.nodeValue||'');
        if(/R\$\s*-?[\d.]+,\d{2}|\b\d{1,3}(?:[.,]\d+)?%/.test(current)){
          PRIVACY_TEXT_ORIGINALS.set(node,current);
          node.nodeValue=current.replace(/R\$\s*-?[\d.]+,\d{2}/g,'••••').replace(/\b\d{1,3}(?:[.,]\d+)?%/g,'••••');
        }
      }else if(PRIVACY_TEXT_ORIGINALS.has(node)){
        node.nodeValue=PRIVACY_TEXT_ORIGINALS.get(node);PRIVACY_TEXT_ORIGINALS.delete(node);
      }
    }
    root.querySelectorAll?.('[title]').forEach(element=>{
      if(hidden){
        const current=String(element.title||'');
        if(/R\$\s*-?[\d.]+,\d{2}/.test(current)){
          PRIVACY_TITLE_ORIGINALS.set(element,current);element.title=current.replace(/R\$\s*-?[\d.]+,\d{2}/g,'••••');
        }
      }else if(PRIVACY_TITLE_ORIGINALS.has(element)){
        element.title=PRIVACY_TITLE_ORIGINALS.get(element);PRIVACY_TITLE_ORIGINALS.delete(element);
      }
    });
  }

  function dashboardLayoutStore256(){
    const s=settings(),band=screenBand256();s.dashboardLayouts=s.dashboardLayouts||{};s.dashboardLayouts[band]=s.dashboardLayouts[band]||{};return s.dashboardLayouts[band];
  }
  function decorateDashboard256(){
    ensureDefaults256();
    const grid=document.querySelector('.dashboard-widget-grid');if(!grid)return;
    const store=dashboardLayoutStore256();grid.classList.add('dashboard-masonry-v256');
    const hint=document.querySelector('.dashboard-toolbar-v255 .muted');
    if(hint)hint.textContent='Arraste os módulos e use o canto inferior direito para redimensionar.';
    [...grid.querySelectorAll('.dashboard-widget')].forEach((widget,index)=>{
      const id=widget.dataset.widgetId,saved=store[id]||{},computedSpan=Number(saved.span)||Number(String(widget.style.getPropertyValue('--widget-span')).trim())||(id==='revenue'?12:6);
      const defaultRows=id==='revenue'?26:14,rows=Number(saved.rows)||Math.max(8,Math.round(parseFloat(saved.height)||0)/22)||defaultRows;
      widget.style.setProperty('--widget-span-v256',Math.max(3,Math.min(12,computedSpan)));
      widget.style.setProperty('--widget-rows-v256',Math.max(8,Math.min(60,Math.round(rows))));
      widget.style.setProperty('--widget-order-v256',Number.isFinite(saved.order)?saved.order:index);
      if(grid.classList.contains('layout-editing')){
        widget.querySelector('.widget-edit-controls')?.remove();
        if(!widget.querySelector('.widget-resize-handle-v256'))widget.insertAdjacentHTML('beforeend','<button type="button" class="widget-resize-handle-v256" title="Arraste para redimensionar" aria-label="Arraste para redimensionar"></button>');
      }else widget.querySelector('.widget-resize-handle-v256')?.remove();
    });
  }

  function modalLayoutKey256(modal){
    const form=modal?.querySelector('form[data-form]');if(form)return `form:${form.dataset.form}`;
    const titles=[...modal?.querySelectorAll('.detail-hero h2,.modal-body h2')||[]].map(x=>x.textContent.trim()).join(' ');
    if(/OSV-|ordem de serviço/i.test(titles))return 'detail:order';
    if(modal?.querySelector('[data-client-price-history],.definition-list'))return 'detail:client';
    return '';
  }
  function layoutStore256(key){
    const s=settings(),band=screenBand256();s.unifiedLayoutsV256=s.unifiedLayoutsV256||{};s.unifiedLayoutsV256[band]=s.unifiedLayoutsV256[band]||{};s.unifiedLayoutsV256[band][key]=s.unifiedLayoutsV256[band][key]||{};return s.unifiedLayoutsV256[band][key];
  }
  function itemId256(item,index){return item.dataset.layoutItemV256||item.querySelector('[name]')?.name||item.querySelector('h3')?.textContent.trim()||`item-${index}`;}
  function prepareDetailGrid256(modal,key){
    const body=modal.querySelector('.modal-body');if(!body)return [];
    if(key==='detail:order'){
      modal.classList.add('order-detail-modal-v256','detail-modal-v256');
      const legacy=body.querySelector('.detail-grid');if(legacy&&!body.querySelector('.detail-grid-v256')){
        const sections=[...legacy.querySelectorAll(':scope > div > section')];
        const orderRank=title=>/equipamento/i.test(title)?1:/itens/i.test(title)?2:/fotos/i.test(title)?3:/financeiro/i.test(title)?4:/pdf/i.test(title)?5:/movimenta/i.test(title)?6:/anexos/i.test(title)?7:99;
        sections.sort((a,b)=>orderRank(a.querySelector('h3')?.textContent||'')-orderRank(b.querySelector('h3')?.textContent||''));
        const grid=document.createElement('div');grid.className='detail-grid-v256';legacy.replaceWith(grid);sections.forEach(section=>grid.appendChild(section));
      }
    }else if(key==='detail:client'){
      modal.classList.add('client-detail-modal-v256','detail-modal-v256');
      const grid=[...body.querySelectorAll('.grid.two')].find(candidate=>candidate.querySelector(':scope > section.card'));if(grid)grid.classList.add('detail-grid-v256');
    }
    return [...body.querySelectorAll('.detail-grid-v256')];
  }
  function prepareModalItems256(modal,key){
    const store=layoutStore256(key),grids=[];
    const form=modal.querySelector('form[data-form]');
    if(form){
      form.dataset.layoutKeyV256=key;
      [...form.querySelectorAll('.form-grid')].forEach((grid,index)=>{grid.dataset.layoutGridV256=`grid-${index}`;grids.push(grid);});
    }else prepareDetailGrid256(modal,key).forEach((grid,index)=>{grid.dataset.layoutGridV256=`detail-${index}`;grids.push(grid);});
    grids.forEach(grid=>{
      const gridKey=grid.dataset.layoutGridV256,gridStore=store[gridKey]||{},items=[...grid.children].filter(item=>item.matches('.field,.check-field,section.card'));
      grid.classList.add('layout-grid-v256');
      items.forEach((item,index)=>{
        const id=itemId256(item,index),saved=gridStore[id];item.dataset.layoutItemV256=id;
        if(saved){item.classList.add('has-custom-layout-v256');item.style.setProperty('--layout-span-v256',saved.span);item.style.setProperty('--layout-rows-v256',saved.rows);item.style.order=saved.order;}
        else{
          item.classList.remove('has-custom-layout-v256');
          const fallbackSpan=screenBand256()==='mobile'?12:item.classList.contains('full')||grid.classList.contains('one-column')?12:grid.classList.contains('three')?4:key==='detail:order'&&/^(Equipamento|Itens|Fotos)/i.test(item.querySelector('h3')?.textContent||'')?7:key==='detail:order'?5:6;
          item.style.setProperty('--layout-span-v256',fallbackSpan);item.style.setProperty('--layout-rows-v256','auto');item.style.order=index;
        }
      });
    });
    return grids;
  }
  function captureModalLayout256(modal,key){
    const result={};prepareModalItems256(modal,key).forEach(grid=>{result[grid.dataset.layoutGridV256]={};[...grid.children].filter(item=>item.dataset.layoutItemV256).forEach((item,index)=>{result[grid.dataset.layoutGridV256][item.dataset.layoutItemV256]={order:index,span:Number(item.style.getPropertyValue('--layout-span-v256'))||12,rows:item.style.getPropertyValue('--layout-rows-v256')||'auto'};});});return result;
  }
  function applyModalLayout256(modal){
    const key=modalLayoutKey256(modal);if(!key)return;
    modal.dataset.layoutKeyV256=key;prepareModalItems256(modal,key);
    const header=modal.querySelector('.modal-header');if(!header)return;
    header.querySelectorAll('[data-action="toggle-form-layout"],[data-action="open-osv-layout-editor"]').forEach(button=>button.remove());
    if(!header.querySelector('[data-action="toggle-layout-v256"]'))header.querySelector('h2')?.insertAdjacentHTML('afterend',`<button type="button" class="btn ghost compact modal-layout-button-v256" data-action="toggle-layout-v256">${icon('edit',16)} Editar layout</button>`);
  }
  function setModalEditing256(editing){
    const modal=document.querySelector('#modal-root .modal'),key=modal?.dataset.layoutKeyV256||modalLayoutKey256(modal);if(!modal||!key)return;
    MODAL_LAYOUT.editing=editing;MODAL_LAYOUT.key=key;modal.classList.toggle('layout-editing-v256',editing);
    const button=modal.querySelector('[data-action="toggle-layout-v256"]');if(button)button.innerHTML=editing?`${icon('save',16)} Salvar layout`:`${icon('edit',16)} Editar layout`;
    modal.querySelector('.layout-toolbar-v256')?.remove();
    if(editing){
      if(!MODAL_LAYOUT.snapshot)MODAL_LAYOUT.snapshot=captureModalLayout256(modal,key);
      button?.insertAdjacentHTML('afterend','<div class="layout-toolbar-v256"><button type="button" class="btn secondary compact" data-action="cancel-layout-v256">Cancelar</button><button type="button" class="btn ghost compact" data-action="reset-layout-v256">Restaurar padrão</button><small>Arraste os blocos e use o canto para redimensionar.</small></div>');
      modal.querySelectorAll('[data-layout-item-v256]').forEach(item=>{item.draggable=true;if(!item.querySelector(':scope > .layout-resize-handle-v256'))item.insertAdjacentHTML('beforeend','<button type="button" class="layout-resize-handle-v256" title="Arraste para redimensionar" aria-label="Arraste para redimensionar"></button>');});
    }else modal.querySelectorAll('[data-layout-item-v256]').forEach(item=>{item.draggable=false;item.querySelector(':scope > .layout-resize-handle-v256')?.remove();});
  }
  async function saveModalLayout256(){
    const modal=document.querySelector('#modal-root .modal'),key=MODAL_LAYOUT.key||modal?.dataset.layoutKeyV256;if(!modal||!key)return;
    const target=layoutStore256(key),captured=captureModalLayout256(modal,key);Object.keys(target).forEach(k=>delete target[k]);Object.assign(target,captured);MODAL_LAYOUT.snapshot=null;setModalEditing256(false);
    try{await persist('Layout visual atualizado',`${key} · ${screenBand256()}`,{media:false});}catch(error){console.warn('[V256_LAYOUT_SAVE]',error);toast('Layout aplicado nesta sessão; o Drive confirmará quando estiver disponível.','warn');}
  }
  function restoreSnapshot256(snapshot){
    const modal=document.querySelector('#modal-root .modal');if(!modal||!snapshot)return;
    modal.querySelectorAll('[data-layout-grid-v256]').forEach(grid=>{const saved=snapshot[grid.dataset.layoutGridV256]||{},map=new Map([...grid.children].filter(item=>item.dataset.layoutItemV256).map(item=>[item.dataset.layoutItemV256,item]));Object.entries(saved).sort((a,b)=>a[1].order-b[1].order).forEach(([id,layout])=>{const item=map.get(id);if(!item)return;grid.appendChild(item);item.style.setProperty('--layout-span-v256',layout.span);item.style.setProperty('--layout-rows-v256',layout.rows);item.style.order=layout.order;item.classList.toggle('has-custom-layout-v256',layout.rows!=='auto');});});
  }
  function decorateModal256(){
    const modal=document.querySelector('#modal-root .modal');if(!modal)return;applyModalLayout256(modal);maskPrivacy256(modal);
    if(modal.dataset.layoutKeyV256==='detail:order'){
      modal.querySelectorAll('.actions button,.list-row>.icon-btn').forEach(button=>button.classList.add('detail-action-v256'));
      const close=modal.querySelector('.modal-close');if(close)close.title='Fechar';
    }
  }

  function resetModalLayoutSession256(){MODAL_LAYOUT.editing=false;MODAL_LAYOUT.snapshot=null;MODAL_LAYOUT.key='';}
  const openModalBase256=openModal;
  openModal=function(...args){
    resetModalLayoutSession256();
    const result=openModalBase256.apply(this,args);
    // Decora imediatamente para evitar a primeira abertura sem classe/botão de layout.
    decorateModal256();
    requestAnimationFrame(decorateModal256);
    return result;
  };
  const openOrderDetailBase256=openOrderDetail;
  openOrderDetail=function(...args){
    const result=openOrderDetailBase256.apply(this,args);
    decorateModal256();
    requestAnimationFrame(decorateModal256);
    return result;
  };
  const openClientDetailBase256=openClientDetail;
  openClientDetail=function(...args){
    const result=openClientDetailBase256.apply(this,args);
    decorateModal256();
    requestAnimationFrame(decorateModal256);
    return result;
  };

  function decorateView256(){
    decorateDashboard256();
    document.querySelectorAll('[data-row-action]').forEach(row=>{
      if(!row.hasAttribute('tabindex'))row.tabIndex=0;
      if(!row.hasAttribute('role'))row.setAttribute('role','button');
    });
    maskPrivacy256(document.getElementById('root'));
  }
  const renderViewBase256=renderView;
  renderView=function(...args){const result=renderViewBase256.apply(this,args);requestAnimationFrame(decorateView256);return result;};

  const handleActionBase256=handleAction;
  handleAction=async function(button,...rest){
    const action=button?.dataset?.action||'';
    if(action==='toggle-privacy'){const result=await handleActionBase256.call(this,button,...rest);requestAnimationFrame(()=>{maskPrivacy256(document.getElementById('root'));maskPrivacy256(document.querySelector('#modal-root .modal'));});return result;}
    if(action==='clear-period-v256'){const state=periodState256(button.dataset.section);state.month='';state.fromDay='';state.toDay='';renderView();return;}
    if(action==='toggle-layout-v256'){if(MODAL_LAYOUT.editing)await saveModalLayout256();else{MODAL_LAYOUT.snapshot=captureModalLayout256(document.querySelector('#modal-root .modal'),document.querySelector('#modal-root .modal')?.dataset.layoutKeyV256);setModalEditing256(true);}return;}
    if(action==='cancel-layout-v256'){restoreSnapshot256(MODAL_LAYOUT.snapshot);MODAL_LAYOUT.snapshot=null;setModalEditing256(false);return;}
    if(action==='reset-layout-v256'){const modal=document.querySelector('#modal-root .modal'),key=modal?.dataset.layoutKeyV256;if(!modal||!key)return;const store=layoutStore256(key);Object.keys(store).forEach(k=>delete store[k]);modal.querySelectorAll('[data-layout-item-v256]').forEach((item,index)=>{item.classList.remove('has-custom-layout-v256');item.style.removeProperty('--layout-span-v256');item.style.removeProperty('--layout-rows-v256');item.style.order=index;});prepareModalItems256(modal,key);MODAL_LAYOUT.snapshot=captureModalLayout256(modal,key);setModalEditing256(false);try{await persist('Layout visual restaurado',`${key} · ${screenBand256()}`,{media:false});}catch(error){console.warn('[V256_LAYOUT_RESET]',error);toast('Layout restaurado nesta sessão; o Drive confirmará quando estiver disponível.','warn');return;}toast('Layout restaurado ao padrão.');return;}
    return handleActionBase256.call(this,button,...rest);
  };

  document.addEventListener('change',event=>{
    const target=event.target;
    if(target.matches('[data-period-month-v256]')){periodState256(target.dataset.periodMonthV256).month=target.value;renderView();return;}
    if(target.matches('[data-period-from-v256]')){periodState256(target.dataset.periodFromV256).fromDay=String(clampDay(target.value)||'');renderView();return;}
    if(target.matches('[data-period-to-v256]')){periodState256(target.dataset.periodToV256).toDay=String(clampDay(target.value)||'');renderView();return;}
    if(target.matches('[data-order-status-v256]')){settings().orderStatusFilterV256=target.value;renderView();return;}
  },true);

  function activateRow256(row){
    if(!row)return;
    const action=row.dataset.rowAction,id=row.dataset.id;
    if(action==='view-order')openOrderDetail(id);
    else if(action==='view-client')openClientDetail(id);
    else if(action==='edit-payment')openPaymentForm(id);
    else if(action==='edit-service')openServiceForm(id);
    else if(action==='edit-product')openProductForm(id);
    else if(action==='edit-supply')openSupplyForm(id);
    else if(action==='edit-stock-movement')openStockMovementForm(id);
    else if(action==='open-document')openPdfMedia(row.dataset.order,row.dataset.media).catch(error=>toast(error.message,'error'));
  }
  document.addEventListener('click',event=>{
    const row=event.target.closest?.('[data-row-action]'),interactive=event.target.closest?.(INTERACTIVE_SELECTOR);if(!row||(interactive&&interactive!==row))return;
    event.preventDefault();activateRow256(row);
  },true);
  document.addEventListener('keydown',event=>{
    if(!['Enter',' '].includes(event.key))return;
    const row=event.target.closest?.('[data-row-action]'),interactive=event.target.closest?.(INTERACTIVE_SELECTOR);if(!row||(interactive&&interactive!==row))return;
    event.preventDefault();activateRow256(row);
  },true);

  function beginResize256(event,item,grid,kind){
    event.preventDefault();event.stopPropagation();const rect=item.getBoundingClientRect(),gridRect=grid.getBoundingClientRect(),columns=screenBand256()==='mobile'?1:12,gap=parseFloat(getComputedStyle(grid).columnGap)||12,cell=(gridRect.width-gap*(columns-1))/columns,rowUnit=22;
    RESIZE_SESSION={pointerId:event.pointerId,item,grid,kind,startX:event.clientX,startY:event.clientY,startWidth:rect.width,startHeight:rect.height,cell,gap,columns,rowUnit};
    item.classList.add('is-resizing-v256');event.currentTarget.setPointerCapture?.(event.pointerId);
  }
  function moveResize256(event){
    const session=RESIZE_SESSION;if(!session||session.pointerId!==event.pointerId)return;const width=Math.max(session.cell,session.startWidth+(event.clientX-session.startX)),height=Math.max(session.rowUnit*4,session.startHeight+(event.clientY-session.startY));
    if(session.kind==='dashboard'){const span=session.columns===1?12:Math.max(3,Math.min(12,Math.round((width+session.gap)/(session.cell+session.gap))));session.item.style.setProperty('--widget-span-v256',span);session.item.style.setProperty('--widget-rows-v256',Math.max(8,Math.min(60,Math.round(height/session.rowUnit))));}
    else{const span=session.columns===1?12:Math.max(2,Math.min(12,Math.round((width+session.gap)/(session.cell+session.gap))));session.item.style.setProperty('--layout-span-v256',span);session.item.style.setProperty('--layout-rows-v256',Math.max(4,Math.min(50,Math.round(height/session.rowUnit))));session.item.classList.add('has-custom-layout-v256');}
  }
  async function endResize256(event){
    const session=RESIZE_SESSION;if(!session||session.pointerId!==event.pointerId)return;session.item.classList.remove('is-resizing-v256');RESIZE_SESSION=null;
    if(session.kind==='dashboard'){
      const store=dashboardLayoutStore256(),id=session.item.dataset.widgetId,existing=store[id]||{};store[id]={...existing,span:Number(session.item.style.getPropertyValue('--widget-span-v256'))||6,rows:Number(session.item.style.getPropertyValue('--widget-rows-v256'))||14,order:Number(session.item.style.getPropertyValue('--widget-order-v256'))||0};
    }
  }
  document.addEventListener('pointerdown',event=>{
    const dashboardHandle=event.target.closest('.widget-resize-handle-v256');if(dashboardHandle){const item=dashboardHandle.closest('.dashboard-widget'),grid=item?.closest('.dashboard-widget-grid');if(item&&grid)beginResize256(event,item,grid,'dashboard');return;}
    const modalHandle=event.target.closest('.layout-resize-handle-v256');if(modalHandle){const item=modalHandle.closest('[data-layout-item-v256]'),grid=item?.closest('[data-layout-grid-v256]');if(item&&grid)beginResize256(event,item,grid,'modal');}
  },true);
  document.addEventListener('pointermove',moveResize256,true);
  document.addEventListener('pointerup',endResize256,true);
  document.addEventListener('pointercancel',endResize256,true);

  document.addEventListener('dragstart',event=>{
    if(!MODAL_LAYOUT.editing)return;const item=event.target.closest('[data-layout-item-v256]');if(!item)return;MODAL_LAYOUT.drag=item;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',item.dataset.layoutItemV256||'layout-item');
  },true);
  document.addEventListener('dragover',event=>{if(MODAL_LAYOUT.drag&&event.target.closest('[data-layout-item-v256]'))event.preventDefault();},true);
  document.addEventListener('drop',event=>{const target=event.target.closest('[data-layout-item-v256]'),source=MODAL_LAYOUT.drag;if(!source||!target||source===target||source.parentElement!==target.parentElement)return;event.preventDefault();const rect=target.getBoundingClientRect(),after=event.clientY>rect.top+rect.height/2;target.parentElement.insertBefore(source,after?target.nextSibling:target);[...target.parentElement.children].forEach((item,index)=>item.style.order=index);MODAL_LAYOUT.drag=null;},true);
  document.addEventListener('dragend',()=>{MODAL_LAYOUT.drag=null;},true);

  window.MarcoV256={version:VERSION,periodState:periodState256,matchesPeriod:matchesPeriod256,maskPrivacy:maskPrivacy256,ensureDefaults:ensureDefaults256,decorateView:decorateView256,decorateModal:decorateModal256,captureModalLayout:captureModalLayout256};
  requestAnimationFrame(()=>{if(!LOCKED){renderShell();decorateView256();}});
})();
