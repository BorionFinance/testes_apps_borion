(async()=>{
  const checks=[];
  const ok=(name,condition,detail='')=>checks.push({name,ok:!!condition,detail:detail||''});
  const wait=(ms=35)=>new Promise(resolve=>setTimeout(resolve,ms));
  const close=()=>{document.querySelector('#modal-root').replaceChildren();document.body.classList.remove('modal-open','modal-field-active','keyboard-open');};
  const render=async view=>{CURRENT_VIEW=view;renderView();await wait();};
  const actionSeq=root=>[...root.querySelectorAll('[data-action]')].map(el=>el.dataset.action);
  const h=el=>Math.round(el?.getBoundingClientRect?.().height||0);
  const top=el=>Math.round(el?.getBoundingClientRect?.().top||0);
  const text=el=>String(el?.innerText||el?.textContent||'').replace(/\s+/g,' ').trim();
  const headerText=el=>text(el).replace(/[⇅↑↓]/g,'').replace(/\s+/g,' ').trim();
  const dispatchClick=async el=>{el?.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));await wait();};

  await render('dashboard');
  const sidebar=document.querySelector('.sidebar');
  const sidebarFooter=document.querySelector('.sidebar-footer');
  const saveStatus=document.querySelector('#save-status');
  const sidebarActions=document.querySelector('.sidebar-quick-actions-v256');
  const topActions=document.querySelector('.top-actions');
  ok('Sidebar permanece fixa durante rolagem',getComputedStyle(sidebar).position==='fixed');
  ok('Status de sincronização permanece acima das ações',!!saveStatus&&!!sidebarActions&&Boolean(saveStatus.compareDocumentPosition(sidebarActions)&Node.DOCUMENT_POSITION_FOLLOWING));
  ok('Ações topo e lateral são exatamente olho/salvar/bloquear',JSON.stringify(actionSeq(topActions))===JSON.stringify(['toggle-privacy','manual-save','lock-now'])&&JSON.stringify(actionSeq(sidebarActions))===JSON.stringify(['toggle-privacy','manual-save','lock-now']));

  await render('orders');
  const ordersToolbar=document.querySelector('.orders-toolbar .toolbar-left');
  const newOrder=ordersToolbar?.querySelector('[data-action="new-order"]');
  const period=ordersToolbar?.querySelector('.period-filter-v256');
  const status=ordersToolbar?.querySelector('[data-order-status-v256]');
  const archive=ordersToolbar?.querySelector('[data-action="toggle-archived-orders"]');
  ok('Ordem exata dos controles de OSV',!!newOrder&&!!period&&!!status&&!!archive&&newOrder.compareDocumentPosition(period)&Node.DOCUMENT_POSITION_FOLLOWING&&period.compareDocumentPosition(status)&Node.DOCUMENT_POSITION_FOLLOWING&&status.compareDocumentPosition(archive)&Node.DOCUMENT_POSITION_FOLLOWING);
  const heights=[h(newOrder),h(period?.querySelector('input[type="month"]')),h(status),h(archive)].filter(Boolean);
  ok('Controles da OSV têm altura padronizada',heights.length===4&&Math.max(...heights)-Math.min(...heights)<=1,heights.join(','));
  ok('Arquivadas é somente ícone com tooltip',!text(archive)&&/arquiv/i.test(archive?.title||''));
  data().settings.dashboardPrivacy=true;MarcoV256.maskPrivacy(document.getElementById('root'));
  ok('Privacidade cobre a tabela de OSV',!text(document.querySelector('#view-root')).includes('350,00'));
  data().settings.dashboardPrivacy=false;MarcoV256.maskPrivacy(document.getElementById('root'));
  const orderRow=document.querySelector('[data-row-action="view-order"]');
  orderRow?.focus();orderRow?.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await wait();
  ok('OSV abre por teclado na visualização',!!document.querySelector('.order-detail-modal-v256'));
  close();await render('orders');
  const internalClient=document.querySelector('[data-row-action="view-order"] [data-action="view-client"]');
  await dispatchClick(internalClient);
  ok('Controle interno cliente não dispara visualização da OSV',!!document.querySelector('.client-detail-modal-v256')&&!document.querySelector('.order-detail-modal-v256'));
  close();

  await render('clients');
  const clientHeaders=[...document.querySelectorAll('thead th')].map(el=>text(el).replace(/[⇅↑↓]/g,'').trim());
  ok('Cabeçalhos de clientes completos',JSON.stringify(clientHeaders.slice(0,7))===JSON.stringify(['ID','Cliente','Contato','Cidade','Data de cadastro','Ordens','Total movimentado']));
  const archivedClients=document.querySelector('[data-action="toggle-archived-clients"]');
  ok('Clientes arquivados é somente ícone com tooltip',!text(archivedClients)&&/arquiv/i.test(archivedClients?.title||''));
  data().settings.dashboardPrivacy=true;MarcoV256.maskPrivacy(document.getElementById('root'));
  ok('Privacidade cobre total movimentado de clientes',!text(document.querySelector('#view-root')).includes('350,00'));
  data().settings.dashboardPrivacy=false;MarcoV256.maskPrivacy(document.getElementById('root'));

  await render('finance');
  const financeToolbar=document.querySelector('.unified-toolbar-v256 .toolbar-left');
  const financeChildren=[...financeToolbar.children];
  const financeNew=financeToolbar.querySelector('[data-action="new-payment"]');
  const financePeriod=financeToolbar.querySelector('.period-filter-v256');
  const exportButton=financeToolbar.querySelector('[data-action="export-finance"]');
  ok('Financeiro mantém Novo, período e exportação no fim',financeChildren[0]===financeNew&&financeChildren[1]===financePeriod&&financeChildren.at(-1)===exportButton);
  ok('Exportar CSV é somente ícone',!text(exportButton)&&/exportar csv/i.test(exportButton?.title||''));
  data().settings.dashboardPrivacy=true;MarcoV256.maskPrivacy(document.getElementById('root'));
  ok('Privacidade cobre Financeiro',!text(document.querySelector('#view-root')).includes('350,00')&&!text(document.querySelector('#view-root')).includes('40,00'));
  data().settings.dashboardPrivacy=false;MarcoV256.maskPrivacy(document.getElementById('root'));

  await render('documents');
  ok('Documentos tem mês, De, Até e limpar',!!document.querySelector('[data-period-month-v256="documents"]')&&!!document.querySelector('[data-period-from-v256="documents"]')&&!!document.querySelector('[data-period-to-v256="documents"]')&&!!document.querySelector('[data-action="clear-period-v256"][data-section="documents"]'));
  const docState=MarcoV256.periodState('documents');docState.month='2026-07';docState.fromDay='20';docState.toDay='23';renderView();await wait();
  await dispatchClick(document.querySelector('[data-action="clear-period-v256"][data-section="documents"]'));
  ok('Vassoura limpa todo o período',!docState.month&&!docState.fromDay&&!docState.toDay);

  await render('catalog');
  ACTIVE_TAB.catalog='services';renderView();await wait();
  ok('Serviços possui coluna ID',headerText(document.querySelector('thead th'))==='ID');
  const inactive=document.querySelector('[data-action="toggle-archived-catalog"]');
  const firstTab=document.querySelector('.catalog-toolbar-v256 .tabs button');
  ok('Inativos é ícone compacto e alinhado',!text(inactive)&&Math.abs(h(inactive)-h(firstTab))<=1&&Math.abs(top(inactive)-top(firstTab))<=1,`${h(inactive)}x${top(inactive)} / ${h(firstTab)}x${top(firstTab)}`);
  ACTIVE_TAB.catalog='products';renderView();await wait();
  let headers=[...document.querySelectorAll('thead th')].map(headerText);
  ok('Produtos: ID, Produto, Marca, Fornecedor',JSON.stringify(headers.slice(0,4))===JSON.stringify(['ID','Produto','Marca','Fornecedor']));
  data().settings.dashboardPrivacy=true;MarcoV256.maskPrivacy(document.getElementById('root'));
  ok('Privacidade cobre custos e preços do catálogo',!text(document.querySelector('#view-root')).includes('100,00')&&!text(document.querySelector('#view-root')).includes('200,00'));
  data().settings.dashboardPrivacy=false;MarcoV256.maskPrivacy(document.getElementById('root'));
  ACTIVE_TAB.catalog='supplies';renderView();await wait();headers=[...document.querySelectorAll('thead th')].map(headerText);
  ok('Insumos: ID, Insumo, Marca, Fornecedor',JSON.stringify(headers.slice(0,4))===JSON.stringify(['ID','Insumo','Marca','Fornecedor']));
  ACTIVE_TAB.catalog='movements';renderView();await wait();headers=[...document.querySelectorAll('thead th')].map(headerText);
  ok('Movimentações sem Marca/Fornecedor e com Antes → Depois',headers.includes('Antes → Depois')&&!headers.includes('Marca')&&!headers.includes('Fornecedor'));

  openOrderDetail('OSV-000001');await wait();
  const orderModal=document.querySelector('.order-detail-modal-v256');
  const modalHeader=orderModal?.querySelector(':scope > .modal-header');
  const closeButton=modalHeader?.querySelector('.modal-close');
  ok('Visualização OSV é larga no desktop',orderModal?.getBoundingClientRect().width>=1200,String(orderModal?.getBoundingClientRect().width||0));
  ok('Cabeçalho redundante da OSV foi removido visualmente',getComputedStyle(modalHeader?.querySelector('h2')).display==='none'&&h(modalHeader)<=36);
  ok('X permanece visível e clicável',!!closeButton&&getComputedStyle(closeButton).display!=='none'&&getComputedStyle(closeButton).pointerEvents!=='none');
  const detailHeadings=[...orderModal.querySelectorAll('h3')].map(text);
  ok('Anexos técnicos ficam depois de movimentações',detailHeadings.indexOf('Anexos técnicos')>detailHeadings.findIndex(value=>/Movimenta/.test(value)));
  const compactActions=[...orderModal.querySelectorAll('.actions button,.detail-action-v256')].filter(el=>h(el)>0);
  ok('Ações da OSV seguem 34x34',compactActions.length>0&&compactActions.every(el=>Math.abs(el.getBoundingClientRect().width-34)<=1&&Math.abs(el.getBoundingClientRect().height-34)<=1));
  ok('Visualização da OSV possui Editar layout',!!orderModal.querySelector('[data-action="toggle-layout-v256"]'));
  data().settings.dashboardPrivacy=true;MarcoV256.maskPrivacy(orderModal);
  ok('Privacidade cobre a visualização da OSV',!text(orderModal).includes('350,00'));
  data().settings.dashboardPrivacy=false;MarcoV256.maskPrivacy(orderModal);
  close();

  openClientDetail('CLI-000001');await wait();
  const clientModal=document.querySelector('.client-detail-modal-v256');
  ok('Visualização cliente sem cabeçalho vazio',!!clientModal&&getComputedStyle(clientModal.querySelector(':scope > .modal-header h2')).display==='none'&&h(clientModal.querySelector(':scope > .modal-header'))<=36);
  ok('Visualização cliente possui Editar layout',!!clientModal?.querySelector('[data-action="toggle-layout-v256"]'));
  close();

  const formCases=[
    ['Editar cliente abre',()=>openClientForm('CLI-000001'),'form[data-form="client"]','Editar cliente possui Editar layout'],
    ['Editar OSV abre',()=>openOrderForm('OSV-000001'),'form[data-form="order"]','Editar OSV possui Editar layout'],
    ['Editar lançamento abre',()=>openPaymentForm('REC-000001'),'form[data-form="payment"]','Editar lançamento possui Editar layout'],
    ['Editar serviço abre',()=>openServiceForm('SRV-000001'),'form[data-form="service"]','Editar serviço possui Editar layout'],
    ['Editar produto abre',()=>openProductForm('PRD-000001'),'form[data-form="product"]','Editar produto possui Editar layout'],
    ['Editar insumo abre',()=>openSupplyForm('INS-000001'),'form[data-form="supply"]','Editar insumo possui Editar layout'],
    ['Editar movimentação abre',()=>openStockMovementForm('MOV-000001'),'form[data-form="stock-movement"]','Editar movimentação possui Editar layout']
  ];
  for(const [openName,openFn,selector,layoutName] of formCases){
    openFn();await wait();
    const form=document.querySelector(selector),modal=document.querySelector('#modal-root .modal');
    ok(openName,!!form);
    ok(layoutName,!!modal?.querySelector('[data-action="toggle-layout-v256"]'));
    close();
  }

  openClientForm('CLI-000001');await wait();
  let modal=document.querySelector('#modal-root .modal'),firstItem=modal?.querySelector('[data-layout-item-v256]');
  const before={order:firstItem?.style.order||'',span:firstItem?.style.getPropertyValue('--layout-span-v256')||'',rows:firstItem?.style.getPropertyValue('--layout-rows-v256')||'',custom:firstItem?.classList.contains('has-custom-layout-v256')};
  ok('Layout atual não é alterado antes de editar',!!firstItem&&!before.custom&&before.rows==='auto');
  const layoutButton=modal?.querySelector('[data-action="toggle-layout-v256"]');await dispatchClick(layoutButton);
  firstItem=modal?.querySelector('[data-layout-item-v256]');
  const handle=firstItem?.querySelector('.layout-resize-handle-v256');
  const beforeSpan=firstItem?.style.getPropertyValue('--layout-span-v256'),beforeRows=firstItem?.style.getPropertyValue('--layout-rows-v256');
  if(handle&&firstItem){
    const rect=firstItem.getBoundingClientRect();
    handle.dispatchEvent(new PointerEvent('pointerdown',{pointerId:77,clientX:rect.right-4,clientY:rect.bottom-4,bubbles:true,cancelable:true}));
    document.dispatchEvent(new PointerEvent('pointermove',{pointerId:77,clientX:rect.right+180,clientY:rect.bottom+120,bubbles:true,cancelable:true}));
    document.dispatchEvent(new PointerEvent('pointerup',{pointerId:77,clientX:rect.right+180,clientY:rect.bottom+120,bubbles:true,cancelable:true}));
    await wait();
  }
  const afterSpan=firstItem?.style.getPropertyValue('--layout-span-v256'),afterRows=firstItem?.style.getPropertyValue('--layout-rows-v256');
  ok('Redimensionamento real altera largura/altura do bloco',!!handle&&(afterSpan!==beforeSpan||afterRows!==beforeRows),`${beforeSpan}/${beforeRows} -> ${afterSpan}/${afterRows}`);
  await dispatchClick(modal?.querySelector('[data-action="toggle-layout-v256"]'));
  const savedLayout=data().settings.unifiedLayoutsV256?.desktop?.['form:client'];
  ok('Layout redimensionado é salvo por perfil/tela',!!savedLayout&&Object.keys(savedLayout).length>0);
  close();

  await render('dashboard');
  await dispatchClick(document.querySelector('[data-action="toggle-dashboard-layout"]'));
  const revenue=document.querySelector('[data-widget-id="revenue"]'),revenueHandle=revenue?.querySelector('.widget-resize-handle-v256');
  const revenueBefore=Number(data().settings.dashboardLayouts?.desktop?.revenue?.rows||0);
  if(revenue&&revenueHandle){
    const rect=revenue.getBoundingClientRect();
    revenueHandle.dispatchEvent(new PointerEvent('pointerdown',{pointerId:88,clientX:rect.right-4,clientY:rect.bottom-4,bubbles:true,cancelable:true}));
    document.dispatchEvent(new PointerEvent('pointermove',{pointerId:88,clientX:rect.right-100,clientY:rect.bottom+110,bubbles:true,cancelable:true}));
    document.dispatchEvent(new PointerEvent('pointerup',{pointerId:88,clientX:rect.right-100,clientY:rect.bottom+110,bubbles:true,cancelable:true}));
    await wait();
  }
  const revenueAfter=Number(data().settings.dashboardLayouts?.desktop?.revenue?.rows||0);
  ok('Redimensionamento real do Faturamento atualiza configuração',!!revenueHandle&&revenueAfter!==revenueBefore,`${revenueBefore} -> ${revenueAfter}`);
  revenue?.style.setProperty('--widget-rows-v256',8);await wait();
  const revenueScroll=revenue?.querySelector('.widget-scroll');
  ok('Módulo pequeno gera rolagem interna',!!revenueScroll&&getComputedStyle(revenueScroll).overflowY==='auto'&&revenueScroll.scrollHeight>=revenueScroll.clientHeight);

  return {checks,errors:[...(window.__auditErrors||[])]};
})()
