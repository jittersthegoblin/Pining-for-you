const STORY = {
  arrival: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: 'neutral', speaker: 'Narration', mood: 'Arrival',
    text: `The cottage looked smaller in the listing. The pine forest looked much larger. You have been carrying boxes for twenty minutes when the crack of an axe draws your attention to the neighboring property. A broad man in red flannel lowers the axe and looks directly at you.`,
    choices: [
      choice('Walk over and introduce yourself.', 'Soft', 'first_words', {soft:1, trust:1}),
      choice('Call, “Should I be worried about the axe, or is that just the neighborhood welcome?”', 'Sarcastic', 'first_words', {sarcastic:1, affection:1}),
      choice('Lean on the fence. “Please tell me lumberjacks actually come with the house.”', 'Flirty', 'first_words', {flirty:1, affection:2}),
      choice('Wave. “Hi. I’m going to become your problem.”', 'Bratty', 'first_words', {bratty:1, affection:1}),
      choice('Give him a small wave, suddenly unsure whether walking over would be too forward.', 'Shy', 'first_words', {shy:2, trust:1}),
      choice('“Hi—sorry. I’m not on your property, am I? I’m still figuring out where everything starts and ends.”', 'Anxious', 'first_words', {anxious:2, trust:1})
    ]
  },

  first_words: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: (s)=>dominantChemistry()==='anxious'?'neutral':'annoyed', speaker: 'Mortimer', mood: (s)=>dominantChemistry()==='anxious'?'Less Intimidating Than He Looks':'Unimpressed',
    text: (s) => {
      const route = dominantChemistry();
      if (route === 'anxious') return `His expression eases by a fraction. “You’re fine. Property line’s past the cedar.” He sets the axe down rather than leaving it in his hand. “Mortimer.” Then he nods toward your cottage. “Your chimney’s blocked.”`;
      if (route === 'shy') return `He studies your hesitant wave, then walks a little closer—only close enough that neither of you has to shout. “Mortimer.” His voice is rough, but not unfriendly. He nods toward your cottage. “Your chimney’s blocked.”`;
      if (route === 'flirty') return `His eyes travel from your face to the mountain of boxes behind you, then back. “That so?” The corner of his mouth almost moves. “Mortimer.” Then he nods toward your cottage. “Your chimney’s blocked.”`;
      return `He studies you for a long second. “Mortimer.” He nods once toward your cottage. “Your chimney’s blocked.”`;
    },
    choices: [
      choice('“Thank you. I genuinely would not have known.”', 'Soft', 'chimney', {soft:2, trust:2}),
      choice('“That is a very Mortimer way to say hello.”', 'Sarcastic', 'chimney', {sarcastic:2, affection:2}),
      choice('“You noticed my chimney before you noticed me? Brutal.”', 'Flirty', 'chimney', {flirty:2, affection:2}),
      choice('“Good. You can fix it for me.”', 'Bratty', 'chimney', {bratty:2, affection:1}),
      choice('“Oh. Um. Thanks for telling me.” Try not to look as flustered as you feel.', 'Shy', 'chimney', {shy:2, trust:2, affection:1}),
      choice('“Blocked as in inconvenient, or blocked as in my house could catch fire?”', 'Anxious', 'chimney', {anxious:2, trust:2})
    ]
  },

  chimney: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: 'neutral', speaker: 'Mortimer', mood: (s)=>dominantChemistry()==='anxious'?'Reassuring, Somehow':'Matter-of-fact',
    text: (s) => dominantChemistry()==='anxious'
      ? `“Not if you leave the stove alone.” His answer comes immediately, steady and practical. “Don’t light it until it’s cleared. You’re not in danger standing here.” Then, because apparently reassurance has a limit, he adds, “Would be a stupid way to spend your first night.”`
      : `“Don’t light the stove until it’s cleared.” He plants the axe head in the stump. “Unless your plan was to move in and smoke yourself out before supper.”`,
    choices: [
      choice('“I’ll leave it alone. Promise.”', 'Soft', 'helping', {soft:2, trust:3}),
      choice('“Do all your safety instructions come with insults free of charge?”', 'Sarcastic', 'helping', {sarcastic:2, affection:2}),
      choice('“Concern already? We’re moving fast.”', 'Flirty', 'helping', {flirty:2, affection:2}),
      choice('“If I die, you inherit a very bad cottage.”', 'Bratty', 'helping', {bratty:2, affection:2}),
      choice('“Right. No fire. I can manage that.” You tuck your hands into your sleeves.', 'Shy', 'helping', {shy:2, trust:2}),
      choice('“Okay. No stove. Is there anything else in the house I should absolutely not touch?”', 'Anxious', 'helping', {anxious:3, trust:3})
    ]
  },

  helping: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: 'annoyed', speaker: 'Narration', mood: 'Suspiciously Helpful',
    text: (s) => `Mortimer mutters something about people moving to the woods without knowing what a flue brush is. Ten minutes later, he is on your roof clearing the chimney anyway. ${dominantChemistry()==='anxious' ? 'Before climbing up, he tells you exactly what he is checking and makes you promise not to stand under the ladder.' : ''} When he climbs down, there is soot on one cheek and irritation written across the rest of him.`,
    choices: [
      choice('Offer him coffee as a thank-you.', 'Soft', 'soot_react', {soft:2, trust:3, affection:2}),
      choice('“You’re much nicer than your face suggests.”', 'Sarcastic', 'soot_react', {sarcastic:2, affection:3}),
      choice('Brush the soot from his cheek with your thumb.', 'Flirty', 'soot_react', {flirty:3, affection:3, trust:1, flag:'touchedCheek'}),
      choice('“Excellent. Next: roof, porch, plumbing…”', 'Bratty', 'soot_react', {bratty:3, affection:2}),
      choice('Point vaguely at your own cheek. “You’ve got… um. Soot. There.”', 'Shy', 'soot_react', {shy:3, affection:2, flag:'shySoot'}),
      choice('“Are you sure the chimney is actually safe now?”', 'Anxious', 'soot_react', {anxious:3, trust:3, flag:'checkedChimney'})
    ]
  },

  soot_react: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: (s)=>s.flags.touchedCheek?'blushing':s.flags.shySoot?'smiling':'embarrassed', speaker: 'Mortimer', mood: 'Caught Off Guard',
    text: (s) => {
      if (s.flags.touchedCheek) return `Mortimer goes completely still beneath your hand. His eyes lock on yours. “You do that to everybody who cleans your chimney?” His voice has dropped lower than before.`;
      if (s.flags.shySoot) return `Mortimer watches you struggle to indicate the spot for a second before the corner of his mouth twitches. He wipes the soot away himself. “There?” When you nod, he gives you the smallest, gentlest smile. “Could’ve just said so.”`;
      if (s.flags.checkedChimney) return `Whatever embarrassed reply he had prepared disappears. “Yeah.” He glances back at the roof, then at you. “Flue’s clear. Draft’s good. You can use it tonight.” His tone turns firmer. “If it smokes at all, put it out and come get me. Don’t sit there worrying about it.”`;
      return `Mortimer looks away toward the trees, jaw shifting as if he is trying not to react. “Don’t make a thing out of it.”`;
    },
    choices: [
      choice('“Still. Thank you, Mortimer.”', 'Soft', 'first_goodbye', {soft:2, trust:3, affection:2}),
      choice('“Wouldn’t dream of it, hero.”', 'Sarcastic', 'first_goodbye', {sarcastic:2, affection:2}),
      choice('“Only the handsome ones.”', 'Flirty', 'first_goodbye', {flirty:3, affection:4}),
      choice('“Too late. You’re useful. I’m keeping you.”', 'Bratty', 'first_goodbye', {bratty:3, affection:3}),
      choice('Look away with a helpless little smile. “I really do appreciate it.”', 'Shy', 'first_goodbye', {shy:3, trust:3, affection:3}),
      choice('“I’ll come get you if anything seems wrong. I promise I won’t try to fix it myself.”', 'Anxious', 'first_goodbye', {anxious:2, trust:4, affection:1})
    ]
  },

  first_goodbye: {
    chapter: 'Chapter 1 · New Neighbor', bg: 'outside_day', sprite: (s)=>['shy','anxious','soft'].includes(dominantChemistry())?'smiling':'neutral', speaker: 'Mortimer', mood: 'Until Next Time',
    text: (s) => `Mortimer hooks his gloves into his belt and glances once more at your chimney. ${routeLine({flirty:'“Try not to invent another emergency just to get me over here.” His eyes linger on you. “At least wait until tomorrow.”',sarcastic:'“You’ve got a working chimney now. Try not to critique the craftsmanship until I’m out of earshot.”',bratty:'“And no, I’m not fixing the whole house today.” He points at you. “Don’t get ideas.”',soft:'“Get settled.” His voice softens. “If you need something you can’t handle alone, I’m next door.”',shy:'“Get settled.” He pauses, as if choosing the words carefully. “You don’t have to come up with a reason if you need to knock.”',anxious:'“Stove’s safe. Roof’s fine. You’re fine.” He gives you a look that says he knows exactly why he is listing them. “If something worries you, come ask.”',balanced:'“Get settled. I’m next door if the house decides to fight back.”'})} Then he starts across the grass toward his own cabin, leaving you with a working stove and the strange realization that your grumpy new neighbor has already helped you twice.`,
    choices: [choice('Finish unpacking and let the first day settle around you.', 'Continue', 'woodpile')]
  },

  woodpile: {
    chapter: 'Chapter 2 · Splinters', bg: 'outside_day', sprite: 'annoyed', speaker: 'Mortimer', mood: 'Judging Your Technique',
    text: `Two days later, with the first boxes finally unpacked, you decide that owning a wood stove probably requires knowing how to split wood. The log rolls off the stump for the third time. From behind you comes a familiar voice. “You planning to hit the wood today, or are you trying to frighten it into pieces?”`,
    choices: [
      choice('Hand him the axe. “Please teach me properly.”', 'Soft', 'axe_lesson', {soft:2, trust:4}),
      choice('“I was doing fine until the unsolicited commentary arrived.”', 'Sarcastic', 'axe_lesson', {sarcastic:3, affection:2}),
      choice('“Come closer and show me how, then.”', 'Flirty', 'axe_lesson', {flirty:2, affection:2, trust:1}),
      choice('“I summoned you, didn’t I? Technique worked perfectly.”', 'Bratty', 'axe_lesson', {bratty:3, affection:3}),
      choice('Hold the axe out to him. “Could you maybe demonstrate first?”', 'Shy', 'axe_lesson', {shy:3, trust:3}),
      choice('“I keep thinking I’m going to swing wrong and put the axe through my foot.”', 'Anxious', 'axe_lesson', {anxious:3, trust:3})
    ]
  },

  axe_lesson: {
    chapter: 'Chapter 2 · Splinters', bg: 'outside_day', sprite: (s)=>dominantChemistry()==='anxious'?'neutral':'smiling', speaker: 'Narration', mood: 'Lesson',
    text: (s) => {
      const route = dominantChemistry();
      if (route === 'shy') return `Mortimer takes the axe and demonstrates once without making a production of it. Only after you nod does he step nearer. “Want me to fix your grip?” When you agree, his hands settle carefully over yours. “Tell me if I’m crowding you.”`;
      if (route === 'anxious') return `Mortimer immediately takes the axe from you and plants it safely in the stump. “You’re not going to put it through your foot.” He shows you the stance, where everyone should stand, and where the blade will travel before he gives it back. “We go slow. I’m right here.”`;
      return `Mortimer steps behind you to adjust your grip. One large hand closes over yours; the other steadies the axe handle. He smells faintly of cedar, coffee, and cold air. “Feet wider. Let the weight do the work.”`;
    },
    choices: [
      choice('Follow his instructions carefully.', 'Soft', 'axe_result', {soft:2, trust:4, affection:2}),
      choice('“You always this bossy, or am I getting premium service?”', 'Sarcastic', 'axe_result', {sarcastic:2, affection:2}),
      choice('“Hard to concentrate with you breathing over my shoulder.”', 'Flirty', 'axe_result', {flirty:3, affection:4}),
      choice('Deliberately lean back against him for half a second.', 'Bratty', 'axe_result', {bratty:3, affection:4}),
      choice('Try very hard to focus on the axe instead of how close he is.', 'Shy', 'axe_result', {shy:3, trust:3, affection:3}),
      choice('“Tell me before I swing if I’m doing anything unsafe.”', 'Anxious', 'axe_result', {anxious:3, trust:4, affection:2})
    ]
  },

  axe_result: {
    chapter: 'Chapter 2 · Splinters', bg: 'outside_day', sprite: (s)=>['flirty','bratty'].includes(dominantChemistry())?'blushing':'smiling', speaker: 'Mortimer', mood: 'Impressed',
    text: (s) => `The axe lands cleanly. The log splits. Mortimer gives a small, reluctant nod that somehow feels worth more than applause. “There. You’re teachable.” ${routeLine({shy:'When you glance at him, pleased despite yourself, his expression softens. “Knew you could do it.”',anxious:'Before you can second-guess the swing, he adds, “That was safe. That was good. Remember that one.”',balanced:''})}`,
    choices: [
      choice('“I’ll practice. I want to be able to do it myself.”', 'Soft', 'axe_goodbye', {soft:2, trust:3, affection:2}),
      choice('“Careful. That almost sounded like praise.”', 'Sarcastic', 'axe_goodbye', {sarcastic:2, affection:2}),
      choice('“Maybe I just like private lessons.”', 'Flirty', 'axe_goodbye', {flirty:2, affection:3}),
      choice('“Say it again, but nicer.”', 'Bratty', 'axe_goodbye', {bratty:2, affection:2}),
      choice('Duck your head, smiling. “Thanks for being patient with me.”', 'Shy', 'axe_goodbye', {shy:3, trust:3, affection:3}),
      choice('“Okay. I think I can do that again without panicking.”', 'Anxious', 'axe_goodbye', {anxious:3, trust:4, affection:2})
    ]
  },

  axe_goodbye: {
    chapter: 'Chapter 2 · Splinters', bg: 'outside_day', sprite: 'neutral', speaker: 'Mortimer', mood: 'A Proper Goodbye',
    text: (s) => `Mortimer stays long enough to watch you split two more pieces on your own. Then he gathers the scattered logs into a neater pile with irritating ease. “That’s enough for today.” ${routeLine({flirty:'His eyes flick toward you. “You can request another private lesson without nearly maiming a log first.”',sarcastic:'“And now I can go home knowing the local timber has survived your reign of terror.”',bratty:'“Don’t look at me like that. I’m not doing the rest for you.”',soft:'“You did good.” He says it plainly this time, without hiding the praise inside an insult.',shy:'He hands the gloves back to you instead of tossing them. “You did good. Don’t make me say it twice.”',anxious:'He waits until the axe is safely put away before he leaves. “Dry ground, daylight, no rushing. You know what you’re doing now.”',balanced:'“Practice when the ground’s dry. Not after dark.”'})} He heads back toward his cabin while you stack your newly split wood, feeling absurdly accomplished.`,
    choices: [choice('Carry the wood inside and call it a successful day.', 'Continue', 'night_knock')]
  },

  night_knock: {
    chapter: 'Chapter 3 · After Dark', bg: 'outside_night', sprite: 'angry', speaker: 'Mortimer', mood: 'Worried, Disguised Badly',
    text: `Several evenings later, a storm rolls over the mountains hard enough to shake the windows. When something cracks outside, you open your door to check the porch—and Mortimer is already striding up the path through the rain. “What are you doing outside?”`,
    choices: [
      choice('“I heard something hit the roof. I was checking for damage.”', 'Soft', 'storm', {soft:2, trust:3}),
      choice('“Standing on my own porch. Alert the authorities.”', 'Sarcastic', 'storm', {sarcastic:3, affection:2}),
      choice('“Waiting for my dramatic lumberjack rescue.”', 'Flirty', 'storm', {flirty:2, affection:3}),
      choice('“Aw. Were you worried about me?”', 'Bratty', 'storm', {bratty:3, affection:3}),
      choice('“I didn’t know if I should come get you.”', 'Shy', 'storm', {shy:3, trust:3, affection:2}),
      choice('“Something hit the house and I can’t tell if the roof is okay.”', 'Anxious', 'storm', {anxious:4, trust:3, flag:'stormWorry'})
    ]
  },

  storm: {
    chapter: 'Chapter 3 · After Dark', bg: 'outside_night', sprite: (s)=>dominantChemistry()==='anxious'?'emotional':'annoyed', speaker: 'Mortimer', mood: 'Protective',
    text: (s) => {
      if (dominantChemistry()==='anxious' || s.flags.stormWorry) return `Mortimer’s irritation vanishes the second he hears the worry in your voice. “Roof’s still there.” He points toward the back wall. “Dead limb came down beside it, not through it. I checked before I came around.” He steps closer, rain running from his hair. “Come to my place until the wind drops. You don’t need to sit in here listening for every noise.”`;
      return `“A dead limb came down near your back wall.” His expression tightens. “Come to my place until the wind drops. Roof’s stronger.” He says it like an order, but he waits for your answer.`;
    },
    choices: [
      choice('“Okay. I trust you.”', 'Soft', 'inside_first', {soft:3, trust:5, affection:3}),
      choice('“You could try asking like a normal person.”', 'Sarcastic', 'inside_first', {sarcastic:2, affection:2, trust:1}),
      choice('“Inviting me over at night? Scandalous.”', 'Flirty', 'inside_first', {flirty:2, affection:3}),
      choice('“Fine. But I’m stealing a blanket.”', 'Bratty', 'inside_first', {bratty:2, affection:2}),
      choice('“If you’re sure I’m not imposing…”', 'Shy', 'inside_first', {shy:3, trust:4, affection:2}),
      choice('Nod quickly. “Yes. Please. I really don’t want to be alone over here right now.”', 'Anxious', 'inside_first', {anxious:4, trust:5, affection:3})
    ]
  },

  inside_first: {
    chapter: 'Chapter 3 · After Dark', bg: 'inside_night', sprite: (s)=>dominantChemistry()==='anxious'?'smiling':'neutral', speaker: 'Narration', mood: 'His Cabin',
    text: (s) => `It is your first time inside Mortimer’s cabin. Everything is warm wood, worn leather, iron cookware and quiet practicality. ${dominantChemistry()==='anxious' ? 'He takes your wet coat, puts you near the stove, and tells you which noises are the wind and which are the old chimney settling before you can ask.' : ''} Your eyes catch on a shelf of tiny hand-carved animals: foxes, bears, rabbits, an owl no bigger than your thumb. Mortimer notices where you are looking.`,
    choices: [
      choice('“They’re beautiful, Mortimer.”', 'Soft', 'carvings', {soft:3, trust:4, affection:4}),
      choice('“So the terrifying woodsman makes tiny bunnies.”', 'Sarcastic', 'carvings', {sarcastic:3, affection:3}),
      choice('“You made these? That is unfairly attractive.”', 'Flirty', 'carvings', {flirty:3, affection:4}),
      choice('Pick up the smallest bear. “Mine now.”', 'Bratty', 'carvings', {bratty:3, affection:3, flag:'stoleBear'}),
      choice('Pick up the little owl carefully. “You’re really good at this.”', 'Shy', 'carvings', {shy:3, trust:4, affection:3}),
      choice('“You make these when you can’t sleep?” The thought makes him feel unexpectedly human.', 'Anxious', 'carvings', {anxious:2, trust:4, affection:3})
    ]
  },

  carvings: {
    chapter: 'Chapter 3 · After Dark', bg: 'inside_night', sprite: 'embarrassed', speaker: 'Mortimer', mood: 'Embarrassed',
    text: (s) => s.flags.stoleBear
      ? `He takes one step toward you, stops, and sighs through his nose. “You cannot just claim things from my house.” A beat. “...That one’s unfinished.”`
      : `He rubs the back of his neck. “They’re scraps. Something to do with my hands when I can’t sleep.”`,
    choices: [
      choice('“I like knowing this about you.”', 'Soft', 'coffee', {soft:3, trust:4, affection:3}),
      choice('“You know you’re allowed to be talented without filing an apology first.”', 'Sarcastic', 'coffee', {sarcastic:2, trust:2, affection:3}),
      choice('“Then make one of me someday.”', 'Flirty', 'coffee', {flirty:3, affection:4}),
      choice('“Too late. I’ve discovered your secret softness.”', 'Bratty', 'coffee', {bratty:2, affection:3}),
      choice('Set the carving back gently. “I’m glad you showed me. Even accidentally.”', 'Shy', 'coffee', {shy:3, trust:4, affection:3}),
      choice('“Does carving help when your head won’t switch off?”', 'Anxious', 'coffee', {anxious:3, trust:4, affection:2})
    ]
  },

  coffee: {
    chapter: 'Chapter 3 · After Dark', bg: 'inside_night', sprite: 'smiling', speaker: 'Mortimer', mood: 'Almost Relaxed',
    text: (s) => {
      const route = dominantChemistry();
      if (route === 'shy') return `Mortimer disappears into the kitchen and returns with tea instead of coffee, setting the steaming mug into your hands rather than making you reach for it. “Figured this was better this late.” His fingers stay around the mug for one quiet second after yours close around it. “Careful. Hot.”`;
      if (route === 'anxious') return `Mortimer brings you a warm mug and sits close enough to be there without boxing you in. “Wind’s already easing.” He nods toward the window. “Your roof’s fine. I’ll check it properly in daylight.” Only then does he add, “Drink.”`;
      return `He slides a mug toward you without asking how you take it. Somehow, it is exactly right. ${routeLine({flirty:'“Don’t look so pleased with yourself,” he says, despite looking pleased himself.',sarcastic:'“And before you start: yes, I remembered. No, you do not get to make a speech about it.”',bratty:'“Don’t get used to it,” he says, which by now means the opposite.',soft:'“Figured you’d want one,” he says quietly.',balanced:'“You’re here enough. Wasn’t hard to remember.”'})}`;
    },
    choices: [
      choice('“Thank you. This feels... nice.”', 'Soft', 'storm_settles', {soft:3, trust:3, affection:4}),
      choice('“I’m documenting this. Evidence you care.”', 'Sarcastic', 'storm_settles', {sarcastic:2, affection:3}),
      choice('“You remembered my order. That’s practically a love letter.”', 'Flirty', 'storm_settles', {flirty:3, affection:4}),
      choice('“Good. I’ve trained you.”', 'Bratty', 'storm_settles', {bratty:3, affection:3}),
      choice('Wrap both hands around the mug. “You remembered.”', 'Shy', 'storm_settles', {shy:4, trust:3, affection:4}),
      choice('“You’ll tell me if you think I actually need to worry about the house, right?”', 'Anxious', 'storm_settles', {anxious:4, trust:5, affection:3})
    ]
  },

  storm_settles: {
    chapter: 'Chapter 3 · After Dark', bg: 'inside_night', sprite: 'neutral', speaker: 'Narration', mood: 'Staying',
    text: (s) => `The conversation thins into the comfortable sound of rain against the windows. By the time the worst of the wind has passed, the clock is much later than you realized. You glance toward the door. Mortimer follows your gaze. ${routeLine({anxious:'“No.” His answer is immediate. “You are not walking back through mud and falling branches because you feel guilty about using my sofa.”',shy:'“You can stay.” He says it before you have to ask. “Sofa’s yours. I’ll give you space.”',soft:'“Stay here tonight. Safer than crossing back in the dark.”',flirty:'“If you’re trying to come up with an excuse to stay, you can stop.” His mouth twitches. “Storm already gave you one.”',sarcastic:'“Before you make some heroic argument about the twenty-yard journey home: no.”',bratty:'“Blanket’s on the sofa. And yes, I heard you threaten to steal it earlier.”',balanced:'“Sofa’s yours. Go home in the morning.”'})} He brings you a blanket, turns down the lamps, and somehow makes staying feel like the obvious thing rather than an imposition.`,
    choices: [choice('Settle onto the sofa while the cabin grows quiet around you.', 'Continue', 'morning_after')]
  },

  morning_after: {
    chapter: 'Chapter 4 · Staying Late', bg: 'inside_day', sprite: 'neutral', speaker: 'Narration', mood: 'Morning',
    text: `Morning light wakes you beneath Mortimer’s blanket. There is fresh coffee—or tea, in your case if he has already learned better—on the table. Mortimer is in the kitchen pretending he has not checked twice to see whether you are awake.`,
    choices: [
      choice('“Thanks for letting me stay.”', 'Soft', 'morning_goodbye', {soft:2, trust:3, affection:2}),
      choice('“You hover very loudly for a quiet man.”', 'Sarcastic', 'morning_goodbye', {sarcastic:2, affection:2}),
      choice('“Morning, handsome.”', 'Flirty', 'morning_goodbye', {flirty:2, affection:3}),
      choice('“I’ve decided your sofa is mine too.”', 'Bratty', 'morning_goodbye', {bratty:2, affection:2}),
      choice('Sit up, hair probably a disaster. “Morning.” Then immediately hide behind the mug.', 'Shy', 'morning_goodbye', {shy:3, affection:3, trust:2}),
      choice('“Did you check my cottage already?”', 'Anxious', 'morning_goodbye', {anxious:3, trust:3})
    ]
  },

  morning_goodbye: {
    chapter: 'Chapter 4 · Staying Late', bg: 'outside_day', sprite: 'smiling', speaker: 'Mortimer', mood: 'See You Soon',
    text: (s) => `Mortimer walks you as far as his porch even though your cottage is plainly visible from it. The storm has left branches scattered across the clearing, but both roofs are intact. ${routeLine({anxious:'“I checked yours at sunrise.” He points toward the roof. “No damage. I’ll clear the limb after breakfast.”',shy:'He hesitates before you step away. “You can come over without a storm next time.” Then his ears go faintly red.',soft:'“I’ll clear that limb later.” He looks at you. “You don’t have to help.”',flirty:'“Try not to miss me too much in the twelve seconds it takes to walk home.”',sarcastic:'“There. Survived a whole night in my cabin. Tragic.”',bratty:'“And the blanket stays here.” His eyes narrow. “I counted them.”',balanced:'“I’ll look at your roof again after breakfast.”'})} For the first time, neither of you says goodbye like you expect much time to pass before the next hello.`,
    choices: [choice('Cross the clearing back to your cottage.', 'Continue', 'porch_fix')]
  },

  porch_fix: {
    chapter: 'Chapter 5 · The Path Between', bg: 'outside_day', sprite: 'annoyed', speaker: 'Narration', mood: 'Domestic Denial',
    text: `The days turn into weeks more naturally than you expect. A path forms between the cottages. Mortimer repairs a loose porch board “because somebody was going to break their neck.” You start bringing him drinks when he works. Sometimes you eat together. Sometimes neither of you talks much at all. Neither of you discusses how often you are together.`,
    choices: [
      choice('Hand him a drink and simply stay beside him.', 'Soft', 'why_alone', {soft:3, trust:4, affection:3}),
      choice('“For someone who hates company, you’re at my house an awful lot.”', 'Sarcastic', 'why_alone', {sarcastic:3, affection:3}),
      choice('Sit beside him and let your knee rest against his.', 'Flirty', 'why_alone', {flirty:3, affection:4, trust:1}),
      choice('“At this rate I’m going to start charging you rent.”', 'Bratty', 'why_alone', {bratty:3, affection:3}),
      choice('Sit close enough that your shoulders almost touch, but let him close the last inch.', 'Shy', 'why_alone', {shy:4, trust:4, affection:3}),
      choice('“You don’t mind that I come over this often, do you?”', 'Anxious', 'why_alone', {anxious:4, trust:4, affection:2})
    ]
  },

  why_alone: {
    chapter: 'Chapter 5 · The Path Between', bg: 'outside_night', sprite: 'emotional', speaker: 'Mortimer', mood: 'Vulnerable',
    text: (s) => `One evening, sitting outside his cabin beneath a dark line of pines, Mortimer finally answers a question you never quite asked. “Was easier, being out here alone. Nobody expects much from a man they don’t see.” He looks at you. “Then you moved in.” ${dominantChemistry()==='anxious' ? 'When your expression shifts, he adds immediately, “That wasn’t a complaint.”' : ''}`,
    choices: [
      choice('“You don’t have to be alone just because it’s easier.”', 'Soft', 'vulnerable_reply', {soft:3, trust:5, affection:4}),
      choice('“Sounds terrible. You seem devastated.”', 'Sarcastic', 'vulnerable_reply', {sarcastic:2, affection:2}),
      choice('“And ruined your peaceful life with my irresistible presence.”', 'Flirty', 'vulnerable_reply', {flirty:2, affection:3}),
      choice('“Too bad. You’re stuck with me now.”', 'Bratty', 'vulnerable_reply', {bratty:2, affection:3}),
      choice('Look down at your hands. “I’m glad I did.”', 'Shy', 'vulnerable_reply', {shy:4, trust:5, affection:4}),
      choice('“You do want me here, though… right?”', 'Anxious', 'vulnerable_reply', {anxious:4, trust:4, affection:3})
    ]
  },

  vulnerable_reply: {
    chapter: 'Chapter 5 · The Path Between', bg: 'outside_night', sprite: 'emotional', speaker: 'Mortimer', mood: 'Honest',
    text: (s) => {
      const route = dominantChemistry();
      if (route === 'shy') return `Mortimer looks at your lowered gaze for a long moment. Then his hand settles on the porch between you, palm up—not touching, just offered. “Me too.” He waits until you choose to place your hand in his.`;
      if (route === 'anxious') return `Mortimer turns fully toward you. “Yes.” There is no hesitation in it. “I want you here. I want you knocking on my door. I want to know when something’s wrong.” His expression softens. “You don’t have to keep checking whether you’re too much.”`;
      if (s.trust >= 18) return `Mortimer’s throat works once before he answers. “I know.” The words are rough and quiet. “That’s the problem.”`;
      return `He looks toward the dark trees. “You make things complicated.”`;
    },
    choices: [
      choice('“I’m not asking you for anything tonight.”', 'Soft', 'porch_close', {soft:2, trust:4, affection:2}),
      choice('“You could survive one emotion, Mortimer.”', 'Sarcastic', 'porch_close', {sarcastic:2, affection:2}),
      choice('“Complicated can be good.”', 'Flirty', 'porch_close', {flirty:2, affection:3, trust:1}),
      choice('“I can make it worse, if you’d like.”', 'Bratty', 'porch_close', {bratty:2, affection:3}),
      choice('Let your fingers curl carefully around his. “We can go slow.”', 'Shy', 'porch_close', {shy:4, trust:5, affection:3, flag:'heldHand'}),
      choice('Take a steadying breath. “Okay. I’m trying to believe you the first time you say it.”', 'Anxious', 'porch_close', {anxious:4, trust:5, affection:3})
    ]
  },

  porch_close: {
    chapter: 'Chapter 5 · The Path Between', bg: 'outside_night', sprite: (s)=>['shy','anxious','soft'].includes(dominantChemistry())?'smiling':'neutral', speaker: 'Narration', mood: 'Not Quite Goodbye',
    text: (s) => `The cold eventually wins. Mortimer stands and opens the cabin door, spilling warm light across the porch. He does not end the conversation by disappearing into the house. Instead he looks back at you. ${routeLine({shy:'“Come in if you want. No pressure.” He leaves the door open and waits.',anxious:'“Come inside. Warm up before you walk back.” Then, softer, “You’re okay.”',soft:'“Another cup?” It sounds less like an offer of coffee and more like an offer to stay.',flirty:'“You coming in, or are you planning to keep looking at me like that from the porch?”',sarcastic:'“I have coffee inside. Unfortunately, you know where I keep it now.”',bratty:'“Inside, menace.” He holds the door wider. “Before you freeze just to prove a point.”',balanced:'“Come on. It’s cold.”'})} You follow him inside instead of going home.`,
    choices: [choice('Step into the warm cabin with him.', 'Continue', 'almost_kiss')]
  },

  almost_kiss: {
    chapter: 'Chapter 6 · Pining', bg: 'inside_night', sprite: 'blushing', speaker: 'Narration', mood: 'Too Close',
    text: (s) => `Later, you reach past Mortimer for your mug at the same moment he turns. Suddenly there is almost no space between you. His gaze drops briefly to your mouth, then returns to your eyes. ${dominantChemistry()==='shy' ? 'He notices you go still and immediately gives you room rather than assuming.' : dominantChemistry()==='anxious' ? 'His hand pauses halfway toward you. “Okay?” he asks quietly, waiting for the answer.' : 'He does not move closer. He does not move away.'}`,
    choices: [
      choice('Reach for his hand instead.', 'Soft', 'confession', {soft:4, trust:5, affection:4, flag:'heldHand'}),
      choice('“You’re staring.”', 'Sarcastic', 'confession', {sarcastic:3, affection:4}),
      choice('“If you want to kiss me, you can.”', 'Flirty', 'confession', {flirty:4, affection:5, trust:3, flag:'gavePermission'}),
      choice('“What? Lose your nerve?”', 'Bratty', 'confession', {bratty:4, affection:4}),
      choice('Your face heats. “I… wouldn’t mind if you stayed close.”', 'Shy', 'confession', {shy:5, trust:5, affection:5, flag:'shyPermission'}),
      choice('“I want this. I’m just nervous.”', 'Anxious', 'confession', {anxious:5, trust:6, affection:4, flag:'anxiousPermission'})
    ]
  },

  confession: {
    chapter: 'Chapter 6 · Pining', bg: 'inside_night', sprite: (s)=>s.affection>=35?'in_love':'emotional', speaker: 'Mortimer', mood: 'No More Pretending',
    text: (s) => {
      if (dominantChemistry()==='shy') return `Mortimer’s expression goes impossibly gentle. He does not close the last bit of distance for you. “We can take as long as you need.” His thumb brushes once over your knuckles. “Doesn’t change the part where I’m in love with you.”`;
      if (dominantChemistry()==='anxious') return `Mortimer’s hand settles around yours, warm and steady. “Nervous is fine.” He waits until you meet his eyes. “You never have to be fearless with me.” A breath. “I love you. That part’s not going anywhere.”`;
      if (s.affection >= 35) return `Mortimer exhales, slow and unsteady. “You have been driving me out of my mind since the day you moved in.” ${routeLine({flirty:'His mouth curves. “And you knew exactly what you were doing.”',sarcastic:'“Half the time I want to argue with you. The other half I’m trying not to kiss you mid-sentence.”',bratty:'“You’re a menace.” His expression softens. “My menace, apparently.”',soft:'His thumb brushes over your knuckles. “Somehow you made this place feel less empty.”',balanced:'“You’re in my house, in my routine, in my head. Everywhere.”'})}`;
      return `He looks at you for a long time. “I care about you. More than I planned to.”`;
    },
    choices: [
      choice('Tell him you want this too.', 'Soft', 'ending', {soft:1, trust:2, affection:3}),
      choice('“Took you long enough.”', 'Sarcastic', 'ending', {sarcastic:1, affection:2}),
      choice('“Then come here, lumberjack.”', 'Flirty', 'ending', {flirty:1, affection:3}),
      choice('“I knew you were obsessed with me.”', 'Bratty', 'ending', {bratty:1, affection:2}),
      choice('Squeeze his hand. “I love you too. Just… be patient with me?”', 'Shy', 'ending', {shy:2, trust:3, affection:3}),
      choice('“I love you too. And I’m probably going to need you to remind me sometimes that you mean it.”', 'Anxious', 'ending', {anxious:2, trust:4, affection:3})
    ]
  },

  ending: {
    chapter: 'Ending', bg: 'inside_night', sprite: (s)=>s.affection>=28?'in_love':'emotional', speaker: 'Ending', mood: 'Unlocked',
    text: (s) => endingText(s),
    choices: []
  }
};
