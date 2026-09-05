function endingText(s) {
  s.ended = true;
  const route = dominantChemistry();
  let title, body, endingNumber;

  if (s.affection < 22 || s.trust < 10) {
    endingNumber = 9;
    title = 'JUST NEIGHBORS';
    body = `It never quite becomes the love story either of you might have imagined. But on a cold evening, Mortimer appears at your door with something hidden in one enormous hand. It is a tiny carved fox, sanded smooth, its ears a little crooked. “For the windowsill,” he mutters. He looks almost embarrassed when you take it. The path between your cottages remains. So does he.`;
  } else if (s.affection < 34) {
    endingNumber = 8;
    title = 'THE LONG WAY AROUND';
    body = `You are halfway down his porch steps when Mortimer reaches after you. His hand closes around yours—not hard, just enough to stop you. For a moment he says nothing. Then his thumb shifts over your knuckles. “Don’t go yet.” It is not a confession. Not quite. But you turn back toward him anyway. Some things are worth taking the long way around.`;
  } else if (route === 'shy') {
    endingNumber = 2;
    title = 'TAKE YOUR TIME';
    body = `Mortimer learns not to crowd the quiet moments. Tonight, he simply comes close in the warm kitchen and offers you a steaming mug with both care and patience. His fingers brush yours around the ceramic. “Made it the way you like it.” His smile is small, private, and entirely for you. There is no demand to say the right thing. You do not need one.`;
  } else if (route === 'anxious') {
    endingNumber = 3;
    title = 'I’VE GOT YOU';
    body = `The worry catches you before the words do. Mortimer notices anyway. Of course he does. He drapes a heavy blanket around your shoulders and pulls it closed with careful hands, his expression turning firm in that way it does when he has decided something matters. “Hey. Look at me.” His voice softens. “You’re safe. I’ve got you.” And for once, you let yourself believe him.`;
  } else if (route === 'flirty') {
    endingNumber = 4;
    title = 'FIRELIGHT';
    body = `Months of shameless flirting finally corner Mortimer into admitting he has been answering it all along. In the warm cabin light, he catches your chin gently between his fingers and tips your face toward his. That rare, knowing little smile appears. “Still got something clever to say?” You barely have time to try before he closes the distance.`;
  } else if (route === 'sassy' || route === 'sarcastic') {
    endingNumber = 6;
    title = 'SAME ARGUMENT TOMORROW';
    body = `You make one last dry remark about how romantic he has become. Mortimer tries to glare. He fails spectacularly. The laugh that escapes him is warm and helpless, and soon his forehead is nearly touching yours while you grin up at him. “You’re impossible,” he says. You remind him that he likes impossible. His smile answers before he does.`;
  } else if (route === 'bratty') {
    endingNumber = 5;
    title = 'KEEP UP, MORTIMER';
    body = `You push exactly one button too many. Mortimer catches your wrists and pins your hands above you against the cabin wall, leaving you plenty of room to pull away. You do not. His mouth curls into the most infuriatingly satisfied smirk you have ever seen. “You done testing me?” he murmurs. Judging by your expression, absolutely not.`;
  } else if (route === 'soft') {
    endingNumber = 1;
    title = 'HOME IS QUIET WITH YOU';
    body = `The fire has burned low by the time the conversation fades into comfortable silence. Mortimer gathers you against him as though it is the most natural thing in the world. One hand settles protectively at the back of your head, and then he bends to press a slow kiss to your forehead. “Stay,” he says quietly. There is no loneliness in the cabin anymore.`;
  } else {
    endingNumber = 7;
    title = 'PUT DOWN ROOTS';
    body = `By autumn, the path between the two cottages is worn bare. One evening you sit together on Mortimer’s porch beneath a sky full of stars, his arm settled around you while warm light spills from the cabin behind you. Neither of you can remember when visiting became staying. There are still two houses in the clearing. Increasingly, there is only one home.`;
  }

  s.endingNumber = endingNumber;
  s.flags.endingTitle = title;

  if (!s.flags.endingAwarded) {
    s.flags.endingAwarded = true;
    addAchievement('ending_' + endingNumber, `Ending: ${title}`);
  }

  return `<div class="ending-card"><h3>${title}</h3><p>${body}</p><p class="ending-caption">Ending ${endingNumber} · ${state.playerPresentation === 'female' ? 'Female' : 'Male'} silhouette CG</p><p><strong>Your relationship:</strong> ${relationshipInfo().name}</p></div>`;
}

function getNode(id) { return STORY[id]; }
function resolve(value) { return typeof value === 'function' ? value(state) : value; }

function renderNode() {
  const node = getNode(state.node);
  if (!node) return;

  const bgKey = resolve(node.bg);
  const spriteKey = resolve(node.sprite);
  const speakerValue = resolve(node.speaker || 'Mortimer');
  const moodValue = resolve(node.mood || spriteKey);
  const chapterValue = resolve(node.chapter || '');
  const text = resolve(node.text || '');

  bg.src = ASSETS.backgrounds[bgKey];
  sprite.classList.add('swap');
  setTimeout(()=>{
    sprite.src = ASSETS.sprites[spriteKey];
    sprite.classList.remove('swap');
  }, 90);

  if (speakerValue === 'Ending' && state.endingNumber) {
    const src = cgAsset(state.endingNumber);
    if (src) {
      endingCg.hidden = false;
      endingCg.src = src;
      endingCg.alt = `${state.flags.endingTitle || 'Ending'} illustration with Mortimer and the player silhouette`;
    }
  } else {
    endingCg.hidden = true;
    endingCg.removeAttribute('src');
  }

  speaker.textContent = speakerValue;
  moodChip.textContent = moodValue;
  chapterLabel.textContent = chapterValue;
  if (speakerValue === 'Ending') dialogue.innerHTML = text;
  else dialogue.textContent = text;

  choicesEl.innerHTML = '';
  const choices = resolve(node.choices || []);
  choices.forEach((c) => {
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
    chemistry:'A Pattern Emerges',
    warming:'Defrosting the Lumberjack',
    trusted:'He Told You On Purpose',
    ending_1:'Ending: HOME IS QUIET WITH YOU',
    ending_2:'Ending: TAKE YOUR TIME',
    ending_3:'Ending: I’VE GOT YOU',
    ending_4:'Ending: FIRELIGHT',
    ending_5:'Ending: KEEP UP, MORTIMER',
    ending_6:'Ending: SAME ARGUMENT TOMORROW',
    ending_7:'Ending: PUT DOWN ROOTS',
    ending_8:'Ending: THE LONG WAY AROUND',
    ending_9:'Ending: JUST NEIGHBORS'
  };
  return map[id] || id.replaceAll('_',' ').toUpperCase();
}

function autoSave() { localStorage.setItem('piningForYouSave', JSON.stringify(state)); }
function manualSave() { autoSave(); showToast('Game saved locally'); }
function hasSave() { return !!localStorage.getItem('piningForYouSave'); }

let playerChoiceMode = 'new';

function showPlayerChoice(mode='new') {
  playerChoiceMode = mode;
  titleScreen.classList.remove('hidden');
  titleButtons.hidden = true;
  playerChoice.hidden = false;
}

function hidePlayerChoice() {
  playerChoice.hidden = true;
  titleButtons.hidden = false;
}

function beginWithPresentation(presentation) {
  if (!['male', 'female'].includes(presentation)) return;
  if (playerChoiceMode === 'new') state = defaultState();
  state.playerPresentation = presentation;
  hidePlayerChoice();
  titleScreen.classList.add('hidden');
  renderNode();
}

function loadGame() {
  const raw = localStorage.getItem('piningForYouSave');
  if (!raw) return newGame();
  try { state = Object.assign(defaultState(), JSON.parse(raw)); } catch { state = defaultState(); }

  if (!state.playerPresentation) {
    showPlayerChoice('continue');
    return;
  }

  hidePlayerChoice();
  titleScreen.classList.add('hidden');
  renderNode();
}

function newGame() {
  endingCg.hidden = true;
  endingCg.removeAttribute('src');
  showPlayerChoice('new');
}

function restart() {
  if (!confirm('Restart the story? Your current local save will be replaced.')) return;
  const presentation = state.playerPresentation;
  state = defaultState();
  state.playerPresentation = presentation;
  endingCg.hidden = true;
  endingCg.removeAttribute('src');
  hidePlayerChoice();
  titleScreen.classList.add('hidden');
  renderNode();
}

function openStats(open=true) {
  $('statsPanel').classList.toggle('open', open);
  $('statsPanel').setAttribute('aria-hidden', open ? 'false':'true');
  updateStats();
}

$('newGameBtn').addEventListener('click', newGame);
$('continueBtn').addEventListener('click', loadGame);
$('continueBtn').disabled = !hasSave();
$('chooseMaleBtn').addEventListener('click', ()=>beginWithPresentation('male'));
$('chooseFemaleBtn').addEventListener('click', ()=>beginWithPresentation('female'));
$('cancelPlayerChoice').addEventListener('click', hidePlayerChoice);
$('statsBtn').addEventListener('click', ()=>openStats(true));
$('closeStats').addEventListener('click', ()=>openStats(false));
$('statsPanel').addEventListener('click', e=>{ if(e.target === $('statsPanel')) openStats(false); });
$('saveBtn').addEventListener('click', manualSave);
$('restartBtn').addEventListener('click', restart);

document.addEventListener('keydown', (e)=>{
  if (!titleScreen.classList.contains('hidden')) return;
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

// Warm up normal scene art. Ending CGs load only when earned so the game does not preload 18 large images.
[...Object.values(ASSETS.backgrounds), ...Object.values(ASSETS.sprites)].forEach(src => { const im = new Image(); im.src = src; });
