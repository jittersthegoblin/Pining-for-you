// Small compatibility layer for route endings + persistent ending collection.
// Loaded after game-runtime.js so it can safely refine behavior without rewriting the story.

unlockEnding = function(endingNumber) {
  const n = Number(endingNumber);
  if (!Number.isInteger(n) || n < 1 || n > 9) return;

  const collection = readEndingCollection();
  const unlocked = new Set(collection.unlocked || []);
  unlocked.add(n);
  collection.unlocked = [...unlocked].sort((a, b) => a - b);
  if (state.playerPresentation) collection.lastPresentation = state.playerPresentation;

  // Directly persist the union. A later playthrough can add to this list,
  // but can never replace endings that were already earned.
  saveEndingCollection(collection);
};

endingText = function(s) {
  s.ended = true;
  const route = dominantChemistry();
  let title, body, endingNumber;

  // Generic endings are now based on how far the romance developed overall.
  // Trust still shapes Mortimer's responses throughout the story, but it no
  // longer blocks naturally lower-trust chemistry routes such as Flirty,
  // Sarcastic, or Bratty from reaching their intended endings.
  if (s.affection < 18) {
    endingNumber = 9;
    title = 'JUST NEIGHBORS';
    body = `It never quite becomes the love story either of you might have imagined. But on a cold evening, Mortimer appears at your door with something hidden in one enormous hand. It is a tiny carved fox, sanded smooth, its ears a little crooked. “For the windowsill,” he mutters. He looks almost embarrassed when you take it. The path between your cottages remains. So does he.`;
  } else if (s.affection < 30) {
    endingNumber = 8;
    title = 'THE LONG WAY AROUND';
    body = `You are halfway down his porch steps when Mortimer reaches after you. His hand closes around yours—not hard, just enough to stop you. For a moment he says nothing. Then his thumb shifts over your knuckles. “Don’t go yet.” It is not a confession. Not quite. But you turn back toward him anyway. Some things are worth taking the long way around.`;
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
  } else if (route === 'sarcastic') {
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

  // Record this ending immediately and permanently before anything else.
  unlockEnding(endingNumber);

  if (!s.flags.endingAwarded) {
    s.flags.endingAwarded = true;
    addAchievement('ending_' + endingNumber, `Ending: ${title}`);
  }

  return `<div class="ending-card"><h3>${title}</h3><p>${body}</p><p class="ending-caption">Ending ${endingNumber}</p><p><strong>Your relationship:</strong> ${relationshipInfo().name}</p></div>`;
};
