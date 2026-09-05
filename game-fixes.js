// Compatibility layer for route endings + persistent ending collection.
// Loaded after game-runtime.js so it can refine the route system without
// changing the story text itself.

const PERSONALITY_POINT_VERSION = 1;

function emptyPersonalityPoints() {
  return Object.fromEntries(CHEMISTRY_KEYS.map(key => [key, 0]));
}

function normalizePersonalityTone(tone) {
  const value = String(tone || '').trim().toLowerCase();
  if (value === 'sassy') return 'sarcastic';
  return CHEMISTRY_KEYS.includes(value) ? value : null;
}

function pointsFromHistory(history = []) {
  const points = emptyPersonalityPoints();
  for (const entry of Array.isArray(history) ? history : []) {
    const key = normalizePersonalityTone(entry && entry.tone);
    if (key) points[key] += 1;
  }
  return points;
}

function ensurePersonalityPoints(forceHistoryRebuild = false) {
  const hasCurrentPoints = state.personalityPointVersion === PERSONALITY_POINT_VERSION
    && state.personalityPoints
    && CHEMISTRY_KEYS.every(key => Number.isFinite(Number(state.personalityPoints[key])));

  if (forceHistoryRebuild || !hasCurrentPoints) {
    state.personalityPoints = pointsFromHistory(state.history);
    state.personalityPointVersion = PERSONALITY_POINT_VERSION;
  }

  // Keep the legacy chemistry object mirrored to the new one-point totals so
  // any older story helper that looks at state.chemistry still sees the same
  // route the ending system sees.
  state.chemistry = { ...emptyPersonalityPoints(), ...state.personalityPoints };
  return state.personalityPoints;
}

// When loading an old save, discard the old weighted chemistry totals and
// rebuild the route tally from the actual replies the player chose.
const legacyNormalizeState = normalizeState;
normalizeState = function(saved = {}) {
  const merged = legacyNormalizeState(saved);
  const points = pointsFromHistory(merged.history);
  merged.personalityPoints = points;
  merged.personalityPointVersion = PERSONALITY_POINT_VERSION;
  merged.chemistry = { ...points };
  return merged;
};

// Route reactions during the story now use the same exact point tally as the
// ending. One chosen personality reply = one point. A tie reads as balanced.
dominantChemistry = function() {
  const points = ensurePersonalityPoints();
  const scores = CHEMISTRY_KEYS
    .map(key => ({ key, points: Number(points[key] || 0) }))
    .sort((a, b) => b.points - a.points);

  if (!scores.length || scores[0].points <= 0) return 'balanced';
  if (scores[1] && scores[0].points === scores[1].points) return 'balanced';
  return scores[0].key;
};

// The story still contains affection/trust values for reactions, but its old
// weighted personality values are intentionally ignored here.
applyEffects = function(effects = {}) {
  state.affection = clamp(state.affection + (effects.affection || 0));
  state.trust = clamp(state.trust + (effects.trust || 0));

  if (effects.flag) state.flags[effects.flag] = true;
  if (effects.flags) Object.assign(state.flags, effects.flags);

  const points = ensurePersonalityPoints();
  const totalPoints = CHEMISTRY_KEYS.reduce((sum, key) => sum + Number(points[key] || 0), 0);
  if (totalPoints >= 5) addAchievement('chemistry', 'A Pattern Emerges');
  if (state.affection >= 20) addAchievement('warming', 'Defrosting the Lumberjack');
  if (state.trust >= 18) addAchievement('trusted', 'He Told You On Purpose');
};

// This is the only place personality points are awarded.
selectChoice = function(c) {
  const tone = normalizePersonalityTone(c.tone);
  state.history.push({ node: state.node, choice: c.text, tone: c.tone });

  const points = ensurePersonalityPoints();
  if (tone) points[tone] += 1;
  state.personalityPoints = points;
  state.personalityPointVersion = PERSONALITY_POINT_VERSION;
  state.chemistry = { ...points };

  applyEffects(c.effects);
  state.node = c.next;
  renderNode();
};

unlockEnding = function(endingNumber) {
  const n = Number(endingNumber);
  if (!Number.isInteger(n) || n < 1 || n > 9) return;

  const collection = readEndingCollection();
  const unlocked = new Set(collection.unlocked || []);
  unlocked.add(n);
  collection.unlocked = [...unlocked].sort((a, b) => a - b);
  if (state.playerPresentation) collection.lastPresentation = state.playerPresentation;
  saveEndingCollection(collection);
};

function personalityStanding() {
  const points = ensurePersonalityPoints();
  const scores = CHEMISTRY_KEYS
    .map(key => ({ key, points: Number(points[key] || 0) }))
    .sort((a, b) => b.points - a.points);

  const topScore = scores.length ? scores[0].points : 0;
  const leaders = scores.filter(item => item.points === topScore && topScore > 0);
  return { scores, topScore, leaders };
}

endingText = function(s) {
  s.ended = true;
  const standing = personalityStanding();
  const route = standing.leaders.length === 1 ? standing.leaders[0].key : 'balanced';
  let title, body, endingNumber;

  if (route === 'soft') {
    endingNumber = 1;
    title = 'HOME IS QUIET WITH YOU';
    body = `The fire has burned low by the time the conversation fades into comfortable silence. Mortimer gathers you against him as though it is the most natural thing in the world. One hand settles protectively at the back of your head, and then he bends to press a slow kiss to your forehead. “Stay,” he says quietly. There is no loneliness in the cabin anymore.`;
  } else if (route === 'shy') {
    endingNumber = 2;
    title = 'TAKE YOUR TIME';
    body = `Mortimer learns that tenderness does not have to arrive all at once. In the warm kitchen, he brings you tea exactly the way you like it and places the mug carefully into your hands. His fingers brush yours around the ceramic, but he does not turn the moment into a test you have to pass. “Careful. Hot,” he murmurs, smiling that small private smile he seems to save for you. With Mortimer, going slowly never feels like being left behind.`;
  } else if (route === 'anxious') {
    endingNumber = 3;
    title = 'I’VE GOT YOU';
    body = `The worry catches you before the words do. Mortimer notices anyway. Of course he does. He drapes a heavy blanket around your shoulders and pulls it closed with careful hands, grounding you in warmth and the solid certainty of his presence. “Hey. Look at me.” His voice softens. “You’re safe. I’ve got you.” He does not promise that nothing frightening will ever happen. He promises you will not have to face it alone.`;
  } else if (route === 'flirty') {
    endingNumber = 4;
    title = 'FIRELIGHT';
    body = `Months of shameless flirting finally corner Mortimer into admitting he has been answering it all along. In the warm cabin light, he catches your chin gently between his fingers and tips your face toward his. That rare, knowing little smile appears. “Still got something clever to say?” You barely have time to try before he closes the distance.`;
  } else if (route === 'bratty') {
    endingNumber = 5;
    title = 'KEEP UP, MORTIMER';
    body = `You push exactly one button too many. Mortimer catches your wrists and pins your hands above you against the cabin wall, leaving you plenty of room to pull away. You do not. His mouth curls into the most infuriatingly satisfied smirk you have ever seen. “You done testing me?” he murmurs. Judging by your expression, absolutely not.`;
  } else if (route === 'sarcastic') {
    endingNumber = 6;
    title = 'SAME ARGUMENT TOMORROW';
    body = `You make one last dry remark about how romantic he has become. Mortimer tries to glare. He fails spectacularly. The laugh that escapes him is warm and helpless, and soon his forehead is nearly touching yours while you grin up at him. “You’re impossible,” he says. You remind him that he likes impossible. His smile answers before he does.`;
  } else if (standing.leaders.length === 2) {
    endingNumber = 7;
    title = 'PUT DOWN ROOTS';
    body = `There was never only one version of the two of you. Sometimes you teased him, sometimes you softened, sometimes you needed reassurance and sometimes you were the one giving it. By autumn, the path between the cottages is worn bare. One evening you sit together on Mortimer’s porch beneath a sky full of stars, his arm around you while warm light spills from the cabin behind you. Neither of you can remember when visiting became staying.`;
  } else if (standing.leaders.length >= 3 && standing.leaders.length < CHEMISTRY_KEYS.length) {
    endingNumber = 8;
    title = 'THE LONG WAY AROUND';
    body = `You never fit neatly into one rhythm together. Every time Mortimer thinks he has you figured out, you surprise him again. You are halfway down his porch steps when he reaches after you and catches your hand. His thumb shifts over your knuckles. “Don’t go yet.” The two of you may take the scenic route to everything important, but neither of you is walking it alone anymore.`;
  } else {
    endingNumber = 9;
    title = 'JUST NEIGHBORS';
    body = `Maybe neither of you ever quite chooses one clear direction. Still, on a cold evening, Mortimer appears at your door with something hidden in one enormous hand: a tiny carved fox, sanded smooth, its ears a little crooked. “For the windowsill,” he mutters. Whatever the two of you are, the path between your cottages remains. So does he.`;
  }

  s.endingNumber = endingNumber;
  s.flags.endingTitle = title;
  unlockEnding(endingNumber);

  if (!s.flags.endingAwarded) {
    s.flags.endingAwarded = true;
    addAchievement('ending_' + endingNumber, `Ending: ${title}`);
  }

  return `<div class="ending-card"><h3>${title}</h3><p>${body}</p><p class="ending-caption">Ending ${endingNumber}</p><p><strong>Your relationship:</strong> ${relationshipInfo().name}</p></div>`;
};
