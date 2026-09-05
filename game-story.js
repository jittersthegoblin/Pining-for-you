const STORY = {
  arrival: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: 'neutral', speaker: 'Narration', mood: 'Arrival',
    text: `The cottage looked smaller in the listing. The pine forest looked much larger. You have been carrying boxes for twenty minutes when the crack of an axe draws your attention to the neighboring property. A broad man in red flannel lowers the axe and looks directly at you.`,
    choices: [choice('Walk over and introduce yourself.', 'Soft', 'first_words', {soft:1, trust:1}), choice('Call, “So you’re the terrifying forest neighbor?”', 'Sassy', 'first_words', {sassy:1, affection:1}), choice('Lean on the fence. “Please tell me lumberjacks actually come with the house.”', 'Flirty', 'first_words', {flirty:1, affection:2}), choice('Wave. “Hi. I’m going to become your problem.”', 'Bratty', 'first_words', {bratty:1, affection:1})]
  },
  first_words: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: 'annoyed', speaker: 'Mortimer', mood: 'Unimpressed',
    text: (s) => s.chemistry.flirty ? `His eyes travel from your face to the mountain of boxes behind you, then back. “That so?” The corner of his mouth almost moves. “Mortimer.”` : `He studies you for a long second. “Mortimer.” He nods once toward your cottage. “Your chimney’s blocked.”`,
    choices: [choice('“That is a very Mortimer way to say hello.”', 'Sassy', 'chimney', {sassy:2, affection:2}), choice('“You noticed my chimney before you noticed me? Brutal.”', 'Flirty', 'chimney', {flirty:2, affection:2}), choice('“Good. You can fix it for me.”', 'Bratty', 'chimney', {bratty:2, affection:1}), choice('“Thank you. I genuinely would not have known.”', 'Soft', 'chimney', {soft:2, trust:2})]
  },
  chimney: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: 'neutral', speaker: 'Mortimer', mood: 'Matter-of-fact',
    text: `“Don’t light the stove until it’s cleared.” He plants the axe head in the stump. “Unless your plan was to move in and smoke yourself out before supper.”`,
    choices: [choice('“Concern already? We’re moving fast.”', 'Flirty', 'helping', {flirty:2, affection:2}), choice('“You make all your warnings sound like insults?”', 'Sassy', 'helping', {sassy:2, affection:1}), choice('“If I die, you inherit a very bad cottage.”', 'Bratty', 'helping', {bratty:2, affection:2}), choice('“I’ll leave it alone. Promise.”', 'Soft', 'helping', {soft:2, trust:3})]
  },
  helping: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: 'annoyed', speaker: 'Narration', mood: 'Suspiciously Helpful',
    text: `Mortimer mutters something about people moving to the woods without knowing what a flue brush is. Ten minutes later, he is on your roof clearing the chimney anyway. When he climbs down, there is soot on one cheek and irritation written across the rest of him.`,
    choices: [choice('Brush the soot from his cheek with your thumb.', 'Flirty', 'soot_react', {flirty:3, affection:3, trust:1, flag:'touchedCheek'}), choice('“You’re much nicer than your face suggests.”', 'Sassy', 'soot_react', {sassy:2, affection:3}), choice('“Excellent. Next: roof, porch, plumbing…”', 'Bratty', 'soot_react', {bratty:3, affection:2}), choice('Offer him coffee as a thank-you.', 'Soft', 'soot_react', {soft:2, trust:3, affection:2})]
  },
  soot_react: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: (s)=>s.flags.touchedCheek?'blushing':'embarrassed', speaker: 'Mortimer', mood: 'Caught Off Guard',
    text: (s) => s.flags.touchedCheek ? `Mortimer goes completely still beneath your hand. His eyes lock on yours. “You do that to everybody who cleans your chimney?” His voice has dropped lower than before.` : `Mortimer looks away toward the trees, jaw shifting as if he is trying not to react. “Don’t make a thing out of it.”`,
    choices: [choice('“Only the handsome ones.”', 'Flirty', 'woodpile', {flirty:3, affection:4}), choice('“Wouldn’t dream of it, hero.”', 'Sassy', 'woodpile', {sassy:2, affection:2}), choice('“Too late. You’re useful. I’m keeping you.”', 'Bratty', 'woodpile', {bratty:3, affection:3}), choice('“Still. Thank you, Mortimer.”', 'Soft', 'woodpile', {soft:2, trust:3, affection:2})]
  },
  woodpile: {
    chapter: 'Chapter 2 · Splinters', bg: 'outside_day', sprite: 'annoyed', speaker: 'Mortimer', mood: 'Judging Your Technique',
    text: `Two days later, Mortimer catches you attempting to split firewood. The log rolls off the stump for the third time. He folds his arms. “You planning to hit the wood today, or are you trying to frighten it into pieces?”`,
    choices: [choice('“Come closer and show me how, then.”', 'Flirty', 'axe_lesson', {flirty:2, affection:2, trust:1}), choice('“I was doing fine until the unsolicited commentary arrived.”', 'Sassy', 'axe_lesson', {sassy:3, affection:2}), choice('“I summoned you, didn’t I? Technique worked perfectly.”', 'Bratty', 'axe_lesson', {bratty:3, affection:3}), choice('Hand him the axe. “Please teach me properly.”', 'Soft', 'axe_lesson', {soft:2, trust:4})]
  },
  axe_lesson: {
    chapter: 'Chapter 2 · Splinters', bg: 'outside_day', sprite: 'neutral', speaker: 'Narration', mood: 'Close Quarters',
    text: `Mortimer steps behind you to adjust your grip. One large hand closes over yours; the other steadies the axe handle. He smells faintly of cedar, coffee, and cold air. “Feet wider. Let the weight do the work.”`,
    choices: [choice('“Hard to concentrate with you breathing over my shoulder.”', 'Flirty', 'axe_result', {flirty:3, affection:4}), choice('“You always this bossy?”', 'Sassy', 'axe_result', {sassy:2, affection:2}), choice('Deliberately lean back against him for half a second.', 'Bratty', 'axe_result', {bratty:3, affection:4}), choice('Follow his instructions carefully.', 'Soft', 'axe_result', {soft:2, trust:4, affection:2})]
  },
  axe_result: {
    chapter: 'Chapter 2 · Splinters', bg: 'outside_day', sprite: (s)=>dominantChemistry()==='flirty'||dominantChemistry()==='bratty'?'blushing':'smiling', speaker: 'Mortimer', mood: 'Impressed',
    text: `The axe lands cleanly. The log splits. Mortimer gives a small, reluctant nod that somehow feels worth more than applause. “There. You’re teachable.”`,
    choices: [choice('“Careful. That almost sounded like praise.”', 'Sassy', 'night_knock', {sassy:2, affection:2}), choice('“Maybe I just like private lessons.”', 'Flirty', 'night_knock', {flirty:2, affection:3}), choice('“Say it again, but nicer.”', 'Bratty', 'night_knock', {bratty:2, affection:2}), choice('“I’ll practice. I want to be able to do it myself.”', 'Soft', 'night_knock', {soft:2, trust:3, affection:2})]
  },
  night_knock: {
    chapter: 'Chapter 3 · After Dark', bg: 'outside_night', sprite: 'angry', speaker: 'Mortimer', mood: 'Worried, Disguised Badly',
    text: `A storm rolls over the mountains after dark. When you open your door to check the porch, Mortimer is already striding up the path through the rain. “What are you doing outside?”`,
    choices: [choice('“Waiting for my dramatic lumberjack rescue.”', 'Flirty', 'storm', {flirty:2, affection:3}), choice('“Standing on my own porch. Alert the authorities.”', 'Sassy', 'storm', {sassy:3, affection:2}), choice('“Aw. Were you worried about me?”', 'Bratty', 'storm', {bratty:3, affection:3}), choice('“I heard something hit the roof. I was checking for damage.”', 'Soft', 'storm', {soft:2, trust:3})]
  },
  storm: {
    chapter: 'Chapter 3 · After Dark', bg: 'outside_night', sprite: 'annoyed', speaker: 'Mortimer', mood: 'Protective',
    text: `“A dead limb came down near your back wall.” His expression tightens. “Come to my place until the wind drops. Roof’s stronger.” He says it like an order, but he waits for your answer.`,
    choices: [choice('“Inviting me over at night? Scandalous.”', 'Flirty', 'inside_first', {flirty:2, affection:3}), choice('“You could try asking like a normal person.”', 'Sassy', 'inside_first', {sassy:2, affection:2, trust:1}), choice('“Fine. But I’m stealing a blanket.”', 'Bratty', 'inside_first', {bratty:2, affection:2}), choice('“Okay. I trust you.”', 'Soft', 'inside_first', {soft:3, trust:5, affection:3})]
  },
  inside_first: {
    chapter: 'Chapter 3 · After Dark', bg: 'inside_night', sprite: 'neutral', speaker: 'Narration', mood: 'His Cabin',
    text: `It is your first time inside Mortimer’s cabin. Everything is warm wood, worn leather, iron cookware and quiet practicality. Your eyes catch on a shelf of tiny hand-carved animals: foxes, bears, rabbits, an owl no bigger than your thumb. Mortimer notices where you are looking.`,
    choices: [choice('“You made these? That is unfairly attractive.”', 'Flirty', 'carvings', {flirty:3, affection:4}), choice('“So the terrifying woodsman makes tiny bunnies.”', 'Sassy', 'carvings', {sassy:3, affection:3}), choice('Pick up the smallest bear. “Mine now.”', 'Bratty', 'carvings', {bratty:3, affection:3, flag:'stoleBear'}), choice('“They’re beautiful, Mortimer.”', 'Soft', 'carvings', {soft:3, trust:4, affection:4})]
  },
  carvings: {
    chapter: 'Chapter 3 · After Dark', bg: 'inside_night', sprite: 'embarrassed', speaker: 'Mortimer', mood: 'Embarrassed',
    text: (s) => s.flags.stoleBear ? `He takes one step toward you, stops, and sighs through his nose. “You cannot just claim things from my house.” A beat. “...That one’s unfinished.”` : `He rubs the back of his neck. “They’re scraps. Something to do with my hands when I can’t sleep.”`,
    choices: [choice('“Then make one of me someday.”', 'Flirty', 'coffee', {flirty:3, affection:4}), choice('“You know you’re allowed to be talented without apologizing for it.”', 'Sassy', 'coffee', {sassy:2, trust:2, affection:3}), choice('“Too late. I’ve discovered your secret softness.”', 'Bratty', 'coffee', {bratty:2, affection:3}), choice('“I like knowing this about you.”', 'Soft', 'coffee', {soft:3, trust:4, affection:3})]
  },
  coffee: {
    chapter: 'Chapter 4 · Staying Late', bg: 'inside_night', sprite: 'smiling', speaker: 'Mortimer', mood: 'Almost Relaxed',
    text: (s) => `He slides a mug toward you without asking how you take it. Somehow, it is exactly right. ${routeLine({flirty:'“Don’t look so pleased with yourself,” he says, despite looking pleased himself.',sassy:'“And before you start: yes, I remembered. No, you do not get to make a speech about it.”',bratty:'“Don’t get used to it,” he says, which by now means the opposite.',soft:'“Figured you’d want one,” he says quietly.',balanced:'“You’re here enough. Wasn’t hard to remember.”'})}`,
    choices: [choice('“You remembered my coffee order. That’s practically a love letter.”', 'Flirty', 'morning_after', {flirty:3, affection:4}), choice('“I’m documenting this. Evidence you care.”', 'Sassy', 'morning_after', {sassy:2, affection:3}), choice('“Good. I’ve trained you.”', 'Bratty', 'morning_after', {bratty:3, affection:3}), choice('“Thank you. This feels... nice.”', 'Soft', 'morning_after', {soft:3, trust:3, affection:4})]
  },
  morning_after: {
    chapter: 'Chapter 4 · Staying Late', bg: 'inside_day', sprite: 'neutral', speaker: 'Narration', mood: 'Morning',
    text: `The storm lasts long enough that you fall asleep on Mortimer’s sofa beneath the blanket you threatened to steal. Morning light wakes you. There is fresh coffee on the table and Mortimer is in the kitchen pretending he has not checked twice to see whether you are awake.`,
    choices: [choice('“Morning, handsome.”', 'Flirty', 'porch_fix', {flirty:2, affection:3}), choice('“You hover very loudly for a quiet man.”', 'Sassy', 'porch_fix', {sassy:2, affection:2}), choice('“I’ve decided your sofa is mine too.”', 'Bratty', 'porch_fix', {bratty:2, affection:2}), choice('“Thanks for letting me stay.”', 'Soft', 'porch_fix', {soft:2, trust:3, affection:2})]
  },
  porch_fix: {
    chapter: 'Chapter 5 · The Path Between', bg: 'outside_day', sprite: 'annoyed', speaker: 'Narration', mood: 'Domestic Denial',
    text: `Over the next few weeks, a path forms naturally between your cottages. Mortimer repairs a loose porch board “because somebody was going to break their neck.” You start bringing him coffee when he works. Neither of you discusses how often you are together.`,
    choices: [choice('Sit beside him and let your knee rest against his.', 'Flirty', 'why_alone', {flirty:3, affection:4, trust:1}), choice('“For someone who hates company, you’re at my house a lot.”', 'Sassy', 'why_alone', {sassy:3, affection:3}), choice('“At this rate I’m going to start charging you rent.”', 'Bratty', 'why_alone', {bratty:3, affection:3}), choice('Hand him a drink and simply stay beside him.', 'Soft', 'why_alone', {soft:3, trust:4, affection:3})]
  },
  why_alone: {
    chapter: 'Chapter 5 · The Path Between', bg: 'outside_night', sprite: 'emotional', speaker: 'Mortimer', mood: 'Vulnerable',
    text: `One evening, sitting outside his cabin beneath a dark line of pines, Mortimer finally answers a question you never quite asked. “Was easier, being out here alone. Nobody expects much from a man they don’t see.” He looks at you. “Then you moved in.”`,
    choices: [choice('“And ruined your peaceful life with my irresistible presence.”', 'Flirty', 'vulnerable_reply', {flirty:2, affection:3}), choice('“Sounds terrible. You seem devastated.”', 'Sassy', 'vulnerable_reply', {sassy:2, affection:2}), choice('“Too bad. You’re stuck with me now.”', 'Bratty', 'vulnerable_reply', {bratty:2, affection:3}), choice('“You don’t have to be alone just because it’s easier.”', 'Soft', 'vulnerable_reply', {soft:3, trust:5, affection:4})]
  },
  vulnerable_reply: {
    chapter: 'Chapter 5 · The Path Between', bg: 'outside_night', sprite: (s)=>s.trust>=18?'emotional':'neutral', speaker: 'Mortimer', mood: 'Honest',
    text: (s) => s.trust >= 18 ? `Mortimer’s throat works once before he answers. “I know.” The words are rough and quiet. “That’s the problem.”` : `He looks toward the dark trees. “You make things complicated.”`,
    choices: [choice('“Complicated can be good.”', 'Flirty', 'almost_kiss', {flirty:2, affection:3, trust:1}), choice('“You could survive one emotion, Mortimer.”', 'Sassy', 'almost_kiss', {sassy:2, affection:2}), choice('“I can make them worse, if you’d like.”', 'Bratty', 'almost_kiss', {bratty:2, affection:3}), choice('“I’m not asking you for anything tonight.”', 'Soft', 'almost_kiss', {soft:2, trust:4, affection:2})]
  },
  almost_kiss: {
    chapter: 'Chapter 6 · Pining', bg: 'inside_night', sprite: 'blushing', speaker: 'Narration', mood: 'Too Close',
    text: `Later, inside, you reach past Mortimer for your mug at the same moment he turns. Suddenly there is almost no space between you. His gaze drops briefly to your mouth, then returns to your eyes. He does not move closer. He does not move away.`,
    choices: [choice('“If you want to kiss me, you can.”', 'Flirty', 'confession', {flirty:4, affection:5, trust:3, flag:'gavePermission'}), choice('“You’re staring.”', 'Sassy', 'confession', {sassy:3, affection:4}), choice('“What? Lose your nerve?”', 'Bratty', 'confession', {bratty:4, affection:4}), choice('Reach for his hand instead.', 'Soft', 'confession', {soft:4, trust:5, affection:4, flag:'heldHand'})]
  },
  confession: {
    chapter: 'Chapter 6 · Pining', bg: 'inside_night', sprite: (s)=>s.affection>=35?'in_love':'emotional', speaker: 'Mortimer', mood: 'No More Pretending',
    text: (s) => s.affection >= 35 ? `Mortimer exhales, slow and unsteady. “You have been driving me out of my mind since the day you moved in.” ${routeLine({flirty:'His mouth curves. “And you knew exactly what you were doing.”',sassy:'“Half the time I want to argue with you. The other half I’m trying not to kiss you mid-sentence.”',bratty:'“You’re a menace.” His expression softens. “My menace, apparently.”',soft:'His thumb brushes over your knuckles. “Somehow you made this place feel less empty.”',balanced:'“You’re in my house, in my routine, in my head. Everywhere.”'})}` : `He looks at you for a long time. “I care about you. More than I planned to.”`,
    choices: [choice('Tell him you want this too.', 'Soft', 'ending', {soft:1, trust:2, affection:3}), choice('“Took you long enough.”', 'Sassy', 'ending', {sassy:1, affection:2}), choice('“I knew you were obsessed with me.”', 'Bratty', 'ending', {bratty:1, affection:2}), choice('“Then come here, lumberjack.”', 'Flirty', 'ending', {flirty:1, affection:3})]
  },
  ending: {
    chapter: 'Ending', bg: 'inside_night', sprite: (s)=>s.affection>=28?'in_love':'emotional', speaker: 'Ending', mood: 'Unlocked',
    text: (s) => endingText(s),
    choices: []
  }
};
