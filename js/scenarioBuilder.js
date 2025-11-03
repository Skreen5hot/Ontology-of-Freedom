// Simple scenario builder logic
(function() {
  'use strict';

  var agents = [];
  var artifacts = [];
  var intents = [];
  var actions = [];
  var values = [];
  var evaluations = [];

  function $(id){ return document.getElementById(id); }

  function renderList(id, items, formatter){
    var el = $(id); el.innerHTML = '';
    items.forEach(function(it){
      var div = document.createElement('div');
      div.textContent = formatter ? formatter(it) : JSON.stringify(it);
      el.appendChild(div);
    });
  }

  function updateActionSelect(){
    var sel = $('eval-action-select'); sel.innerHTML = '';
    actions.forEach(function(a){
      var opt = document.createElement('option'); opt.value = a.id; opt.textContent = a.id + ' — ' + (a.label||'');
      sel.appendChild(opt);
    });
  }

  $('add-agent').addEventListener('click', function(){
    var id = $('agent-name').value.trim(); var label = $('agent-label').value.trim();
    if(!id) return alert('Agent ID required');
    agents.push({id: 'ex:'+id, label: label}); renderList('agents-list', agents, function(a){ return a.id + ' — ' + a.label; });
    $('agent-name').value=''; $('agent-label').value='';
  });

  $('add-artifact').addEventListener('click', function(){
    var id = $('artifact-id').value.trim(); var label = $('artifact-label').value.trim(); var owner = $('artifact-owner').value.trim();
    if(!id) return alert('Artifact ID required');
    artifacts.push({id: 'ex:'+id, label: label, ownedBy: owner? 'ex:'+owner : null}); renderList('artifacts-list', artifacts, function(a){ return a.id + ' — ' + a.label + (a.ownedBy? ' (ownedBy '+a.ownedBy+')':''); });
    $('artifact-id').value=''; $('artifact-label').value=''; $('artifact-owner').value='';
  });

  $('add-intent').addEventListener('click', function(){
    var id = $('intent-id').value.trim(); var label = $('intent-label').value.trim();
    if(!id) return alert('Intent ID required');
    intents.push({id: 'ex:'+id, label: label}); renderList('intents-list', intents, function(i){ return i.id + ' — ' + i.label; });
    $('intent-id').value=''; $('intent-label').value='';
  });

  $('add-action').addEventListener('click', function(){
    var id=$('action-id').value.trim(); 
    var label=$('action-label').value.trim(); 
    var pb=$('action-performedBy').value.trim(); 
    var ao=$('action-actsOn').value.trim(); 
    var ri=$('action-realizesIntent').value.trim();
    var hasValue = $('action-hasValue').value.trim();
    var violatesValue = $('action-violatesValue').value.trim();

    if(!id) return alert('Action ID required');

    var hasValueArr = hasValue ? hasValue.split(',').map(function(s){ return 'ex:'+s.trim(); }) : [];
    var violatesValueArr = violatesValue ? violatesValue.split(',').map(function(s){ return 'ex:'+s.trim(); }) : [];

    actions.push({id:'ex:'+id, label:label, performedBy: pb? 'ex:'+pb:null, actsOn: ao? 'ex:'+ao:null, realizesIntent: ri? 'ex:'+ri:null, hasValue: hasValueArr, violatesValue: violatesValueArr});
    renderList('actions-list', actions, function(a){ return a.id + ' — ' + a.label; }); updateActionSelect();
    
    // Clear all action fields
    ['action-id', 'action-label', 'action-performedBy', 'action-actsOn', 'action-realizesIntent', 'action-hasValue', 'action-violatesValue'].forEach(function(fieldId){
      $(fieldId).value = '';
    });
  });

  $('add-value').addEventListener('click', function(){
    var id=$('value-id').value.trim(); var label=$('value-label').value.trim();
    if(!id) return alert('Value ID required');
    values.push({id:'ex:'+id, label:label}); renderList('values-list', values, function(v){ return v.id + ' — ' + v.label; });
    $('value-id').value=''; $('value-label').value='';
  });

  $('add-evaluation').addEventListener('click', function(){
    var actionId = $('eval-action-select').value; var id = $('eval-id').value.trim(); var label=$('eval-label').value.trim(); var assigns = $('eval-assigns').value.trim(); var just = $('eval-justification').value.trim();
    if(!actionId) return alert('Select an action first'); if(!id) return alert('Eval ID required');
    var assignsArr = assigns ? assigns.split(',').map(function(s){ return 'ex:'+s.trim(); }) : [];
    evaluations.push({id:'ex:'+id, label:label, action: actionId, values: assignsArr, justification: just});
    $('eval-id').value=''; $('eval-label').value=''; $('eval-assigns').value=''; $('eval-justification').value='';
    alert('Evaluation attached');
  });

  function generateTTL(){
    var lines = [];
    lines.push('@prefix ex: <http://example.org/moral_sandbox#> .');
    lines.push('@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .');
    lines.push('');
    agents.forEach(function(a){ lines.push(a.id + ' a ex:Agent ;'); lines.push('    rdfs:label "' + (a.label||a.id) + '" .'); lines.push(''); });
    artifacts.forEach(function(a){ lines.push(a.id + ' a ex:Artifact ;'); if(a.ownedBy) lines.push('    ex:ownedBy ' + a.ownedBy + ' ;'); lines.push('    rdfs:label "' + (a.label||a.id) + '" .'); lines.push(''); });
    intents.forEach(function(i){ lines.push(i.id + ' a ex:Intent ;'); lines.push('    rdfs:label "' + (i.label||i.id) + '" .'); lines.push(''); });
    values.forEach(function(v){ lines.push(v.id + ' a ex:Value ;'); lines.push('    rdfs:label "' + (v.label||v.id) + '" .'); lines.push(''); });
    actions.forEach(function(act){ 
      var actLines = [act.id + ' a ex:Action ;'];
      if(act.label) actLines.push('    rdfs:label "' + act.label + '" ;'); 
      if(act.performedBy) actLines.push('    ex:performedBy ' + act.performedBy + ' ;'); 
      if(act.actsOn) actLines.push('    ex:actsOn ' + act.actsOn + ' ;'); 
      if(act.hasValue && act.hasValue.length > 0) actLines.push('    ex:hasMoralValue ' + act.hasValue.join(' , ') + ' ;');
      if(act.violatesValue && act.violatesValue.length > 0) actLines.push('    ex:violatesValue ' + act.violatesValue.join(' , ') + ' ;');
      if(act.realizesIntent) actLines.push('    ex:realizesIntent ' + act.realizesIntent + ' .'); 
      else { actLines[actLines.length-1] = actLines[actLines.length-1].slice(0,-1) + '.'; } // replace last semicolon
      lines.push(actLines.join('\n')); lines.push(''); 
    });
    evaluations.forEach(function(ev){ lines.push(ev.id + ' a ex:MoralEvaluation ;'); if(ev.label) lines.push('    rdfs:label "' + ev.label + '" ;'); if(ev.action) lines.push('    ex:evaluatesAction ' + ev.action + ' ;'); if(ev.values && ev.values.length>0) lines.push('    ex:assignsValue ' + ev.values.join(' , ') + ' ;'); if(ev.justification) lines.push('    ex:justificationText "' + ev.justification + '" .'); else lines.push('    .'); lines.push(''); });

    return lines.join('\n');
  }

  $('generate-ttl').addEventListener('click', function(){ var ttl = generateTTL(); $('ttl-output').value = ttl; });

  $('download-ttl').addEventListener('click', function(){ var ttl = $('ttl-output').value || generateTTL(); var blob = new Blob([ttl], {type: 'text/turtle'}); var url = URL.createObjectURL(blob); var a = document.createElement('a'); a.href = url; a.download = 'scenario.ttl'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); });

  $('clear-all').addEventListener('click', function(){ if(!confirm('Clear all data?')) return; agents=[]; artifacts=[]; intents=[]; actions=[]; values=[]; evaluations=[]; renderList('agents-list',[]); renderList('artifacts-list',[]); renderList('intents-list',[]); renderList('actions-list',[]); renderList('values-list',[]); $('ttl-output').value=''; updateActionSelect(); });

  // initial
  updateActionSelect();

})();
