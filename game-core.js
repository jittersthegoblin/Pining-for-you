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

const defaultState = () => ({
  node: 'arrival',
  playerPresentation: null,
  affection: 0,
  trust: 0,
  chemistry: { flirty: 0, sassy: 0, bratty: 0, soft: 0 },
  flags: {},
  achievements: [],
  history: [],
  ended: false,
});

let state = defaultState();

const $ = (id) => document.getElementById(id);
const bg = $('background');
const sprite = $('mortimer');
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

function dominantChemistry() {
  const entries = Object.entries(state.chemistry).sort((a,b) => b[1]-a[1]);
  if (!entries.length) return 'balanced';
  const [top, second] = entries;
  if (top[1] < 3 || top[1] - second[1] <= 1) return 'balanced';
  return top[0];
}

function relationshipInfo() {
  const c = state.chemistry;
  const total = Object.values(c).reduce((a,b)=>a+b,0);
  const route = dominantChemistry();
  if (total < 4) return { name: 'New Neighbors', desc: 'You have only just met the grump next door.' };
  if (route === 'flirty') return { name: 'Dangerously Flirty Neighbors', desc: 'Mortimer complains about your flirting. The color in his ears keeps undermining him.' };
  if (route === 'sassy') return { name: 'Sparring Partners', desc: 'Your favorite shared hobby is arguing. Neither of you seems interested in stopping.' };
  if (route === 'bratty') return { name: 'Menace & Mountain', desc: 'You poke the bear. The bear grumbles, fixes your porch, and keeps coming back.' };
  if (route === 'soft') return { name: 'Quiet Safe Place', desc: 'Around you, Mortimer is learning that silence can feel like company instead of loneliness.' };
  return { name: 'Pining Neighbors', desc: 'Teasing, trust, warmth and stubbornness have tangled together into something neither of you can pretend is casual.' };
}

function routeLine(lines) {
  const route = dominantChemistry();
  return lines[route] || lines.balanced || '';
}

// Future special/end-game CGs can call cgAsset('scene_name') and the game
// will automatically choose the matching Male/Female silhouette folder.
function cgAsset(name) {
  if (!state.playerPresentation) return null;
  return `assets/cg/${state.playerPresentation}/${name}.webp`;
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
  state.affection = clamp(state.affection + (effects.affection || 0));
  state.trust = clamp(state.trust + (effects.trust || 0));
  for (const tone of ['flirty','sassy','bratty','soft']) {
    state.chemistry[tone] += effects[tone] || 0;
  }
  if (effects.flag) state.flags[effects.flag] = true;
  if (effects.flags) Object.assign(state.flags, effects.flags);

  const totalChem = Object.values(state.chemistry).reduce((a,b)=>a+b,0);
  if (totalChem >= 5) addAchievement('chemistry', 'A Pattern Emerges');
  if (state.affection >= 20) addAchievement('warming', 'Defrosting the Lumberjack');
  if (state.trust >= 18) addAchievement('trusted', 'He Told You On Purpose');
}

function choice(text, tone, next, effects={}) {
  return { text, tone, next, effects };
}
