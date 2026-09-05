const ASSETS = {
  backgrounds: {
    outside_day: 'assets/backgrounds/outside_day.webp',
    outside_night: 'assets/backgrounds/outside_night.webp',
    inside_day: 'assets/backgrounds/inside_day.webp',
    inside_night: 'assets/backgrounds/inside_night.webp',
  },
  sprites: {
    neutral: 'assets/sprites/mortimer_neutral.webp',
    annoyed: 'assets/sprites/mortimer_annoyed.webp',
    angry: 'assets/sprites/mortimer_angry.webp',
    blushing: 'assets/sprites/mortimer_blushing.webp',
    embarrassed: 'assets/sprites/mortimer_embarrassed.webp',
    emotional: 'assets/sprites/mortimer_emotional.webp',
    smiling: 'assets/sprites/mortimer_smiling.webp',
    in_love: 'assets/sprites/mortimer_in_love.webp',
  }
};

const CHEMISTRY_KEYS = ['flirty', 'sarcastic', 'bratty', 'soft', 'shy', 'anxious'];

const defaultState = () => ({
  node: 'arrival',
  playerPresentation: null,
  affection: 0,
  trust: 0,
  chemistry: { flirty: 0, sarcastic: 0, bratty: 0, soft: 0, shy: 0, anxious: 0 },
  flags: {},
  achievements: [],
  history: [],
  ended: false,
  endingNumber: null,
});

let state = defaultState();

const $ = (id) => document.getElementById(id);
const bg = $('background');
const sprite = $('mortimer');
const endingCg = $('endingCg');
const endingCgStage = $('endingCgStage');
const dialogue = $('dialogue');
const speaker = $('speaker');
const moodChip = $('moodChip');
const choicesEl = $('choices');
const chapterLabel = $('chapterLabel');
const toast = $('toast');
const titleScreen = $('titleScreen');
const titleButtons = $('titleButtons');
const playerChoice = $('playerChoice');

function clamp(n, min=0, max=100){ return Math.max(min, Math.min(max, n)); }

function toneKey(tone) {
  const key = String(tone || '').trim().toLowerCase();
  if (key === 'sassy') return 'sarcastic';
  return CHEMISTRY_KEYS.includes(key) ? key : null;
}

function chemistryFromHistory(history=[]) {
  const points = { flirty: 0, sarcastic: 0, bratty: 0, soft: 0, shy: 0, anxious: 0 };
  for (const entry of history) {
    const key = toneKey(entry && entry.tone);
    if (key) points[key] += 1;
  }
  return points;
}

function normalizeState(saved={}) {
  const fresh = defaultState();
  const merged = Object.assign(fresh, saved || {});
  merged.flags = { ...(saved.flags || {}) };
  merged.achievements = Array.isArray(saved.achievements) ? saved.achievements : [];
  merged.history = Array.isArray(saved.history) ? saved.history : [];

  // New scoring model: every personality reply is exactly one hidden point.
  // Existing saves are rebuilt from their actual reply history so the old
  // weighted values (for example Shy +4 vs Flirty +2) cannot skew routes.
  if (merged.history.length) {
    merged.chemistry = chemistryFromHistory(merged.history);
  } else {
    const oldChem = (saved && saved.chemistry) || {};
    merged.chemistry = { ...fresh.chemistry };
    for (const key of CHEMISTRY_KEYS) {
      if (Number(oldChem[key] || 0) > 0) merged.chemistry[key] = 1;
    }
    if (Number(oldChem.sassy || 0) > 0) merged.chemistry.sarcastic = Math.max(1, merged.chemistry.sarcastic);
  }
  return merged;
}

function dominantChemistry() {
  const entries = CHEMISTRY_KEYS
    .map(key => [key, state.chemistry[key] || 0])
    .sort((a,b) => b[1]-a[1]);
  if (!entries.length || entries[0][1] <= 0) return 'balanced';
  const [top, second] = entries;
  // Only an exact tie for first place becomes Balanced. A one-point lead wins.
  if (second && top[1] === second[1]) return 'balanced';
  return top[0];
}

function relationshipInfo() {
  const total = CHEMISTRY_KEYS.reduce((sum, key) => sum + (state.chemistry[key] || 0), 0);
  const route = dominantChemistry();
  if (total < 4) return { name: 'New Neighbors', desc: 'You have only just met the grump next door.' };
  if (route === 'flirty') return { name: 'Dangerously Flirty Neighbors', desc: 'Mortimer pretends your flirting is a nuisance. His face keeps betraying him.' };
  if (route === 'sarcastic') return { name: 'Dry Wit, Warm Hands', desc: 'You trade deadpan remarks like a shared language. Somehow, he is smiling more often.' };
  if (route === 'bratty') return { name: 'Menace & Mountain', desc: 'You poke the bear. The bear grumbles, fixes your porch, and keeps coming back.' };
  if (route === 'soft') return { name: 'Quiet Safe Place', desc: 'Around you, Mortimer is learning that silence can feel like company instead of loneliness.' };
  if (route === 'shy') return { name: 'Gentle Ground', desc: 'Mortimer has learned to slow down around you, giving every tender moment room to breathe.' };
  if (route === 'anxious') return { name: 'Watchful Comfort', desc: 'He notices the worry before you name it and has quietly become very good at helping you feel safe.' };
  return { name: 'Pining Neighbors', desc: 'Teasing, trust, warmth and stubbornness have tangled together into something neither of you can pretend is casual.' };
}

function routeLine(lines) {
  const route = dominantChemistry();
  return lines[route] || lines.balanced || '';
}

function cgAsset(endingNumber) {
  if (!state.playerPresentation || !endingNumber) return null;
  return `assets/ending_${endingNumber}_${state.playerPresentation}.png`;
}

function addAchievement(id, name) {
  if (state.achievements.includes(id)) return;
  state.achievements.push(id);
  showToast(`Achievement: ${name}`);
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=>toast.classList.remove('show'), 2200);
}

function applyEffects(effects={}) {
  // Affection and trust are still used for dialogue flavour/progression, but
  // they no longer determine which personality ending wins.
  state.affection = clamp(state.affection + (effects.affection || 0));
  state.trust = clamp(state.trust + (effects.trust || 0));

  // Crucially, the numeric values written in the story no longer act as route
  // weights. Any reply tagged with a personality gives exactly ONE point.
  for (const tone of CHEMISTRY_KEYS) {
    if (Number(effects[tone] || 0) > 0) state.chemistry[tone] += 1;
  }
  if (Number(effects.sassy || 0) > 0) state.chemistry.sarcastic += 1;

  if (effects.flag) state.flags[effects.flag] = true;
  if (effects.flags) Object.assign(state.flags, effects.flags);

  const totalChem = CHEMISTRY_KEYS.reduce((sum, key) => sum + (state.chemistry[key] || 0), 0);
  if (totalChem >= 5) addAchievement('chemistry', 'A Pattern Emerges');
  if (state.affection >= 20) addAchievement('warming', 'Defrosting the Lumberjack');
  if (state.trust >= 18) addAchievement('trusted', 'He Told You On Purpose');
}

function choice(text, tone, next, effects={}) {
  return { text, tone, next, effects };
}
