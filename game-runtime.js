function endingText(s) {
  s.ended = true;
  const route = dominantChemistry();
  let title, body;
  if (s.affection < 22 || s.trust < 10) {
    title = 'JUST NEIGHBORS';
    body = 'The path between your cottages remains, but the words neither of you says become part of the forest silence. Mortimer is still there whenever you need him. Maybe one day, one of you will be braver.';
  } else if (s.affection < 34) {
    title = 'THE LONG WAY AROUND';
    body = 'Nothing changes all at once. Mortimer still grumbles. You still show up. The first kiss comes weeks later, almost by accident, and the relationship grows the same way the path between your homes did: one small step at a time.';
  } else if (route === 'flirty') {
    title = 'FIRELIGHT';
    body = 'Mortimer finally closes the distance. For a man who spent weeks pretending not to notice your flirting, he kisses you with startling certainty. Later, he claims you started this. You remind him he cleaned your chimney on day one.';
  } else if (route === 'sassy') {
    title = 'SAME ARGUMENT TOMORROW';
    body = 'Your confession somehow turns into an argument about who fell first. It ends with Mortimer laughing against your forehead. You never stop bickering. You also never again doubt that every sharp little exchange is held inside something fiercely affectionate.';
  } else if (route === 'bratty') {
    title = 'KEEP UP, MORTIMER';
    body = 'You grin. He tells you not to look so pleased with yourself. You do anyway. A week later there is a carved bear on your windowsill and a spare key to his cabin beneath it. Mortimer insists this does not mean you won. It absolutely means you won.';
  } else if (route === 'soft') {
    title = 'HOME IS QUIET WITH YOU';
    body = 'Mortimer takes your hand and holds it like something precious. Nothing dramatic follows—just coffee, warm lamplight, and the relief of no longer pretending. The forest is still quiet. It simply does not feel lonely anymore.';
  } else {
    title = 'PUT DOWN ROOTS';
    body = 'You built this slowly: teasing, trust, stubbornness, warmth. Months later, nobody can remember when the path between the two cottages became so worn. There are two homes in the clearing, but increasingly only one life between them.';
  }
  if (!s.flags.endingAwarded) {
    s.flags.endingAwarded = true;
    addAchievement('ending_' + route, `Ending: ${title}`);
  }
  return `<div class="ending-card"><h3>${title}</h3><p>${body}</p><p><strong>Your relationship:</strong> ${relationshipInfo().name}</p></div>`;
}

function getNode(id) { return STORY[id]; }
function resolve(value) { return typeof value === 'function' ? value(state) : value; }

function renderNode() {
  const node = getNode(state.node);
  if (!node) return;
  const bgKey = resolve(node.bg);
  const spriteKey = resolve(node.sprite);
  bg.src = ASSETS.backgrounds[bgKey];
  sprite.classList.add('swap');
  setTimeout(()=>{
    sprite.src = ASSETS.sprites[spriteKey];
    sprite.classList.remove('swap');
  }, 90);

  speaker.textContent = resolve(node.speaker || 'Mortimer');
  moodChip.textContent = resolve(node.mood || spriteKey);
  chapterLabel.textContent = resolve(node.chapter || '');
  const text = resolve(node.text || '');
  if (node.speaker === 'Ending') dialogue.innerHTML = text;
  else dialogue.textContent = text;

  choicesEl.innerHTML = '';
  const choices = resolve(node.choices || []);
  choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.innerHTML = `<span class="tone-tag">${c.tone}</span>${c.text}`;
    btn.addEventListener('click', () => selectChoice(c));
    choicesEl.appendChild(btn);
  });

  if (!choices.length && state.ended) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.style.paddingLeft = '14px';
    btn.innerHTML = '<span class="tone-tag" style="display:none"></span>Play again from the beginning';
    btn.addEventListener('click', newGame);
    choicesEl.appendChild(btn);
  }
  updateStats();
  autoSave();
}

function selectChoice(c) {
  state.history.push({ node: state.node, choice: c.text, tone: c.tone });
  applyEffects(c.effects);
  state.node = c.next;
  renderNode();
}

function updateStats() {
  const info = relationshipInfo();
  $('relationshipName').textContent = info.name;
  $('relationshipDesc').textContent = info.desc;
  $('affectionValue').textContent = state.affection;
  $('trustValue').textContent = state.trust;
  $('affectionBar').style.width = state.affection + '%';
  $('trustBar').style.width = state.trust + '%';
  for (const tone of ['flirty','sassy','bratty','soft']) $(''+tone+'Value').textContent = state.chemistry[tone];
  const area = $('achievementArea');
  if (!state.achievements.length) area.innerHTML = '<div class="achievement"><span class="badge">○</span><span>No achievements yet.</span></div>';
  else area.innerHTML = state.achievements.map(id => `<div class="achievement"><span class="badge">✦</span><span>${achievementName(id)}</span></div>`).join('');
}

function achievementName(id) {
  const map = {
    chemistry:'A Pattern Emerges', warming:'Defrosting the Lumberjack', trusted:'He Told You On Purpose',
    ending_flirty:'Ending: FIRELIGHT', ending_sassy:'Ending: SAME ARGUMENT TOMORROW', ending_bratty:'Ending: KEEP UP, MORTIMER', ending_soft:'Ending: HOME IS QUIET WITH YOU', ending_balanced:'Ending: PUT DOWN ROOTS'
  };
  return map[id] || id.replaceAll('_',' ').toUpperCase();
}

function autoSave() { localStorage.setItem('piningForYouSave', JSON.stringify(state)); }
function manualSave() { autoSave(); showToast('Game saved locally'); }
function hasSave() { return !!localStorage.getItem('piningForYouSave'); }
function loadGame() {
  const raw = localStorage.getItem('piningForYouSave');
  if (!raw) return newGame();
  try { state = Object.assign(defaultState(), JSON.parse(raw)); } catch { state = defaultState(); }
  titleScreen.classList.add('hidden');
  renderNode();
}
function newGame() {
  state = defaultState();
  titleScreen.classList.add('hidden');
  renderNode();
}
function restart() {
  if (confirm('Restart the story? Your current local save will be replaced.')) newGame();
}

function openStats(open=true) {
  $('statsPanel').classList.toggle('open', open);
  $('statsPanel').setAttribute('aria-hidden', open ? 'false':'true');
  updateStats();
}

$('newGameBtn').addEventListener('click', newGame);
$('continueBtn').addEventListener('click', loadGame);
$('continueBtn').disabled = !hasSave();
$('statsBtn').addEventListener('click', ()=>openStats(true));
$('closeStats').addEventListener('click', ()=>openStats(false));
$('statsPanel').addEventListener('click', e=>{ if(e.target === $('statsPanel')) openStats(false); });
$('saveBtn').addEventListener('click', manualSave);
$('restartBtn').addEventListener('click', restart);

document.addEventListener('keydown', (e)=>{
  if ($('statsPanel').classList.contains('open')) {
    if (e.key === 'Escape') openStats(false);
    return;
  }
  const n = Number(e.key);
  if (n >= 1 && n <= 4) {
    const buttons = [...choicesEl.querySelectorAll('.choice-btn')];
    if (buttons[n-1]) buttons[n-1].click();
  }
});

// Warm up the four backdrops and all sprites to keep scene swaps smooth.
[...Object.values(ASSETS.backgrounds), ...Object.values(ASSETS.sprites)].forEach(src => { const im = new Image(); im.src = src; });
