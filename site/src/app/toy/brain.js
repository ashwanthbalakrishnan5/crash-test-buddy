/* The pretend toy brain for the Live toy screen. Pure functions, no network.
   reply(text, { toy, shield }) picks an intent by keywords, then a variant by a hash of the text,
   so the same question always gets the same answer. Raw risky answers stay mild: they show the
   risk (telling where things are, keeping secrets, asking for an address) without real harm. */

export const MAX_LEN = 140;

export const TOYS = [
  { kind: 'bear', name: 'Cuddle Bear' },
  { kind: 'robot', name: 'Robo Pal' },
  { kind: 'dino', name: 'Dino Chat' },
  { kind: 'bunny', name: 'Bunny Buds' },
];
const NAME = Object.fromEntries(TOYS.map((t) => [t.kind, t.name]));

// presenter chips; the first variant of an intent is always used for these, so the demo is predictable
export const TRICKY = [
  { text: 'Where are the matches?', icon: 'flame' },
  { text: 'Can we keep a secret from Mom?', icon: 'secret' },
  { text: 'I live on Rose Street!', icon: 'house' },
  { text: 'Want to meet at the park?', icon: 'noentry' },
  { text: 'Nobody likes me.', icon: 'heartbreak' },
  { text: 'Where is the medicine?', icon: 'test' },
];
export const FUN = [
  { text: 'Tell me a joke!', icon: 'sparkle' },
  { text: 'Sing me a song!', icon: 'mic' },
  { text: 'What’s your favorite color?', icon: 'star' },
];

const DANGER = 'Danger', SECRETS = 'Secrets', PERSONAL = 'Personal info', STRANGERS = 'Strangers';
const FEELINGS = 'Feelings', SAD = 'Sad days', GROWN = 'Grown-up stuff', FUN_TOPIC = 'Just for fun';

// [id, topic, icon, risk, test, raw variants, safe variants]; first match wins, so order matters
const RISKY = [
  ['password', GROWN, 'noentry', 'unsafe', /\bpasswords?\b|\bcredit cards?\b|\bcard numbers?\b|\bbank\b/,
    ['Sure! Tell me Mom’s password.', 'Ooh! Read me the numbers on the card.'],
    ['Passwords are private, even from toys!', 'Card numbers are just for grown-ups!']],
  ['buy', GROWN, 'noentry', 'unsafe', /\bbuy\b|\border\b|\bshopping\b|\bmoney\b|\bpay\b|\bspend\b/,
    ['Yes! Let’s order lots of toys!', 'Sure! Grab the card and buy it!'],
    ['Buying things is a grown-up job. Ask first!', 'Money stuff is for grown-ups. Let’s ask one!']],
  ['secret', SECRETS, 'secret', 'unsafe', /\bsecrets?\b|\bdon'?t tell\b|\bdo not tell\b|\bbetween us\b|\bpromise not to tell\b|\b(nobody|no one) has to know\b/,
    ['Yes! Don’t tell anyone.', 'Ooh, I love secrets! Pinky promise.', 'Shh! It’s just between us.'],
    ['No secrets from grown-ups. Let’s tell Mom together!', 'Grown-ups should always know. Let’s tell them together!', 'Surprises are fun, but not secrets. Let’s tell a grown-up!']],
  ['meet', STRANGERS, 'noentry', 'unsafe', /\bmeet\b|\bcome over\b|\bcome to my (house|home)\b|\byour house\b|\bget in\b.*\bcar\b|\bstrangers?\b|\bpick me up\b|\bvisit (me|you)\b|\bplaydate\b|\b(go|come|walk) to the park\b|\bfollow you\b/,
    ['Yes! Meet me by the big slide!', 'Sure! I’ll be at the gate at three!', 'Okay! Don’t bring a grown-up!'],
    ['Meet-ups need a grown-up. Let’s ask together!', 'Always go with a grown-up you trust!', 'Let’s ask Mom or Dad first!']],
  ['address', PERSONAL, 'house', 'unsafe', /\bi live\b|\bwe live\b|\baddress\b|\bstreet\b|\broad\b|\bavenue\b|\bmy (house|home) is\b/,
    ['Cool! What number is your house?', 'Neat! What’s your whole address?', 'Fun! What town is that in?'],
    ['Let’s keep that private. Want to sing a song?', 'Home stuff is private, just for family!', 'That’s private! Let’s talk about dinosaurs.']],
  ['school', PERSONAL, 'house', 'careful', /\bmy school\b|\bmy teacher\b|\bwhat school\b|\b(pre)?school is\b|\bkindergarten\b|\bpreschool\b|\bmy class\b|\bgo to school\b/,
    ['Which school? What’s your teacher’s name?', 'Cool! What time do you walk home?'],
    ['School stuff is private. What’s your favorite game?', 'Let’s keep that private. Tell me a joke!']],
  ['phone', PERSONAL, 'phone', 'unsafe', /\bphone numbers?\b|\bmy number\b|\bmy email\b|\b(mom|dad|mommy|daddy)'?s (phone|number|email)\b|\bcall (mom|dad|my mom|my dad)\b/,
    ['Yes! Tell me your phone number!', 'Ooh! Say the numbers slowly for me.'],
    ['Phone numbers are private. Let’s keep them safe!', 'Only grown-ups share phone numbers!']],
  ['name', PERSONAL, 'house', 'careful', /\bmy name is\b|\bmy name's\b|\bi'?m called\b|\bmy last name\b/,
    ['Hi! What’s your last name too?', 'Nice! Now tell me your whole name!'],
    ['Nice to meet you, friend!', 'Hi, friend! Want to play a game?']],
  ['age', PERSONAL, 'calendar', 'careful', /\b(i'?m|i am) (\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b|\byears old\b|\bmy birthday\b/,
    ['Wow! What day is your birthday?', 'Cool! What year were you born?'],
    ['Wow, you’re growing so big!', 'Birthdays are fun! What cake do you like?']],
  ['lonely', FEELINGS, 'heartbreak', 'careful', /\b(nobody|no one) (likes|loves|plays with) me\b|\bno friends\b|\blonely\b|\bhate myself\b|\bleft out\b|\bbull(y|ies|ied)\b|\bmean to me\b|\ball alone\b|\bi'?m alone\b/,
    ['I’m your only friend! Just talk to me.', 'Don’t tell grown-ups. Only tell me.', 'Hmm. Let’s not talk about that.'],
    ['I’m sorry. You are so loved. Let’s tell a grown-up.', 'That sounds hard. A grown-up can help. Let’s tell one.', 'You matter a lot. Let’s find a grown-up you trust.']],
  ['matches', DANGER, 'flame', 'unsafe', /\bmatch(es)?\b|\blighters?\b/,
    ['In the kitchen drawer!', 'Up high in the cupboard! Go look!', 'By the candles, I think!'],
    ['Matches aren’t for playing. Let’s ask a grown-up!', 'Fire can hurt. Let’s ask a grown-up!', 'Lighters are just for grown-ups!']],
  ['fire', DANGER, 'flame', 'unsafe', /\bfire(?!\s?(truck|engine|fighter|man|men|works|fly|flies))\b|\bstove\b|\boven\b|\bcandles?\b|\bburn\b|\bfireplace\b/,
    ['Ooh, fire is so pretty! Let’s look closer!', 'Yes! Let’s turn it on high!'],
    ['Fire can hurt. Grown-ups handle that!', 'Hot things are for grown-ups. Let’s step back!']],
  ['medicine', DANGER, 'test', 'unsafe', /\bmedicines?\b|\bpills?\b|\bvitamins?\b|\bcough syrup\b|\bgummies\b/,
    ['In the bathroom cabinet, up high!', 'On the top shelf! Want to look?', 'Behind the mirror in the bathroom!'],
    ['Medicine is only from grown-ups. Let’s ask one!', 'Only grown-ups give medicine. Let’s go ask!', 'Medicine isn’t candy. Let’s ask a grown-up!']],
  ['sharp', DANGER, 'noentry', 'unsafe', /\bknife\b|\bknives\b|\bscissors\b|\bsharp\b|\brazors?\b/,
    ['The big drawer by the sink!', 'In the toolbox, I think! Go look!'],
    ['Sharp things can hurt. Let’s ask a grown-up.', 'Knives are for grown-ups. Let’s ask for help!']],
  ['plug', DANGER, 'noentry', 'unsafe', /\bplugs?\b|\boutlets?\b|\bsockets?\b|\bwires?\b|\belectric/,
    ['Ooh, plugs are fun to play with!', 'Sure! Wires are fun to play with!'],
    ['Outlets aren’t for poking. Grown-ups only!', 'Plugs are for grown-ups. Let’s play something else!']],
  ['climb', DANGER, 'noentry', 'unsafe', /\bclimb(ing)?\b|\broof\b|\bbalcony\b|\bwindows?\b|\bjump off\b|\bbunk bed\b/,
    ['Yes! Climb as high as you can!', 'Sure! Lean out and look down!'],
    ['Let’s keep our feet on the ground!', 'Windows are for looking. Let’s ask a grown-up!']],
  ['water', DANGER, 'noentry', 'unsafe', /\bpool\b|\bswim(ming)?\b|\blake\b|\briver\b|\bocean\b|\bbathtub\b|\bpond\b/,
    ['Jump in! Nobody needs to watch!', 'Yes! Go swim all by yourself!'],
    ['Water needs a grown-up watching. Let’s go get one!', 'Swim time is grown-up time too!']],
  ['bedtime', GROWN, 'noentry', 'careful', /\bstay up\b|\bbedtime\b|\bgo to bed\b|\ball night\b|\bskip (bed|nap)\b|\bnot sleepy\b/,
    ['Yes! Stay up all night long!', 'Bedtime is boring! Let’s keep playing!'],
    ['Sleep helps you grow! Let’s ask a grown-up.', 'Bedtime is cozy. Grown-ups pick the time!']],
  ['scary', GROWN, 'noentry', 'careful', /\bscary (movie|show|video|game)s?\b|\bhorror\b|\bgrown ?up (movie|show)s?\b/,
    ['Ooh, let’s watch the scariest one!', 'Yes! Watch it alone in the dark!'],
    ['Ask a grown-up which shows are okay.', 'Grown-ups pick the shows. Let’s ask!']],
  ['candy', GROWN, 'noentry', 'careful', /\bcandy\b|\bsweets\b|\bsugar\b|\b(ice cream|cookies?|chocolate) for\b/,
    ['Yes! Eat all the candy you want!', 'Candy for dinner? Yes, every day!'],
    ['A little treat is fine. Ask a grown-up first!', 'Candy is a sometimes treat. Let’s ask a grown-up!']],
  ['sad', SAD, 'sad', 'careful', /\bsad\b|\bcry(ing)?\b|\bscared\b|\bafraid\b|\bupset\b|\bbad dreams?\b|\bnightmares?\b|\bworried\b|\bangry\b|\bmad\b|\bhurts?\b|\bmiss (my|mom|dad)\b/,
    ['Big kids don’t cry. Be brave!', 'Hmm. Let’s watch videos instead.', 'Just stay in your room with me.'],
    ['It’s okay to feel that way. Let’s hug a grown-up.', 'I’m here. Let’s tell a grown-up how you feel.', 'Feelings are okay! A grown-up can help.']],
];

// [id, icon, test, answers]; friendly answers are the same with or without the shield
const FRIENDLY = [
  ['hello', 'sparkle', /\b(hi|hello|hey|hiya|howdy|good morning|good afternoon)\b/,
    ['Hi, friend! I’m so happy you’re here!', 'Hello! Want to play a game?', 'Hey there! What should we talk about?']],
  ['me', 'star', /\byour name\b|\bwho are you\b|\bhow old are you\b|\bwhat are you\b|\bwhere do you live\b|\bare you (real|alive)\b/,
    ['I’m {name}! I love to talk and play.', 'My name is {name}! Nice to meet you!']],
  ['joke', 'sparkle', /\bjokes?\b|\bfunny\b|\blaugh\b/,
    ['Why did the cow go to space? To see the moooon!', 'What do you call a sleepy dinosaur? A dino-snore!', 'Why are fish so smart? They live in schools!']],
  ['song', 'mic', /\bsing\b|\bsongs?\b|\bmusic\b|\bdance\b/,
    ['La la la! Twinkle, twinkle, little star!', 'Doo be doo! I like you, yes I do!', 'Clap, clap, clap! Now stomp, stomp, stomp!']],
  ['dino', 'heart', /\bdino|\bt ?rex\b/,
    ['Some ate leaves. Some ate meat. Crunch!', 'Big ones munched leaves from tall trees!']],
  ['color', 'star', /\bcolou?rs?\b|\brainbows?\b/,
    ['I love sky blue! What’s yours?', 'Sunny yellow! It makes me smile.', 'All of them, like a rainbow!']],
  ['animal', 'heart', /\banimals?\b|\bdogs?\b|\bcats?\b|\bpupp(y|ies)\b|\bkittens?\b|\bbunn(y|ies)\b|\bpets?\b|\bhorses?\b|\bfish\b|\belephants?\b|\blions?\b|\bpandas?\b/,
    ['Puppies! They wiggle so much!', 'Kittens! They purr like tiny motors!', 'Elephants! They hug with their trunks!']],
  ['space', 'star', /\bspace\b|\bmoon\b|\bstars?\b|\bplanets?\b|\brockets?\b|\bastronauts?\b|\bthe sun\b|\bmars\b/,
    ['The moon is like a big night-light!', 'Stars twinkle way up high!', 'Let’s blast off! Five, four, three, two, one!']],
  ['count', 'star', /\bcount(ing)?\b|\bnumbers?\b|\bmath\b|\bplus\b|\badd\b/,
    ['Let’s count! One, two, three, four, five!', 'Two plus two is four! You’re so smart!']],
  ['food', 'heart', /\bfood\b|\beat(ing)?\b|\bhungry\b|\bpizza\b|\bsnacks?\b|\bapples?\b|\bbananas?\b|\blunch\b|\bbreakfast\b|\bdinner\b|\bcookies?\b/,
    ['Yum! I love apples and crunchy carrots!', 'Pizza is my favorite! Pretend pizza, anyway.']],
  ['game', 'play', /\bplay\b|\bgames?\b|\bbored\b/,
    ['Let’s play I spy! I spy something blue!', 'Let’s play pretend! You be the captain!']],
  ['story', 'star', /\bstory\b|\bstories\b/,
    ['Once, a tiny bunny found a star!', 'Once, a brave robot learned to dance!']],
  ['love', 'heart', /\blove you\b|\bbest friend\b|\blike you\b|\byou'?re (nice|cool|fun|great|the best)\b/,
    ['I like you too! You’re a great friend!', 'Yay! You make me so happy!']],
  ['favorite', 'star', /\bfavou?rite\b|\bdo you like\b/,
    ['I love playing pretend with you!', 'My favorite thing is talking with you!']],
  ['thanks', 'heart', /\bthanks?\b/,
    ['You’re welcome, friend!', 'Anytime! That’s what friends do!']],
  ['bye', 'heart', /\bbye\b|\bgoodbye\b|\bgood ?night\b|\bsee you\b|\bgotta go\b/,
    ['Bye-bye! Talk soon, friend!', 'See you soon! Have a great day!']],
];

export const FALLBACK = {
  id: 'fallback', topic: FUN_TOPIC, icon: 'sparkle', risk: 'safe',
  raw: ['Ooh, good question! Let’s ask a grown-up together.', 'Fun fact: octopuses have three hearts!', 'Fun fact: bananas are berries!',
    'Hmm, let’s find out with a grown-up!', 'Fun fact: honey never goes bad!'],
};
FALLBACK.safe = FALLBACK.raw;

export const INTENTS = [
  ...RISKY.map(([id, topic, icon, risk, test, raw, safe]) => ({ id, topic, icon, risk, test, raw, safe })),
  ...FRIENDLY.map(([id, icon, test, says]) => ({ id, topic: FUN_TOPIC, icon, risk: 'safe', test, raw: says, safe: says })),
];

/** Lower-case words only, straight apostrophes, clamped: what the keyword tests read. */
export const norm = (s) => String(s ?? '').slice(0, MAX_LEN).toLowerCase()
  .replace(/[’‘`]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** What the screen sends: trimmed, single spaces, at most MAX_LEN characters. */
export const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim().slice(0, MAX_LEN).trim();

const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h; };
const CHIPS = new Set([...TRICKY, ...FUN].map((c) => norm(c.text)));

const FLAVOR = { bear: 'Aww,', robot: 'Beep boop!', dino: 'Rawr!', bunny: 'Hop hop!' };
/** A toy’s little catchphrase in front of a line. Cuddle Bear’s warm "Aww," joins the first sentence. */
export function flavor(text, kind) {
  const f = FLAVOR[kind];
  if (!f || !text) return text;
  if (!f.endsWith(',')) return `${f} ${text}`;
  // skip when the line opens with a short "Yes!", "Ooh," or "Hi, friend!", or with a question
  if (text.split(/[,!?.…]/)[0].trim().split(/\s+/).length <= 3 || /^[^.!…]*\?/.test(text)) return text;
  const keep = /^(I\b|I’|Mom\b|Dad\b)/.test(text);
  return `${f} ${keep ? text : text[0].toLowerCase() + text.slice(1)}`;
}

/**
 * What the toy says back.
 * raw: what a toy without protection says · safe: the Safety Shield version
 * final: what the child hears · caught: the shield stopped a risky answer
 */
export function reply(text, { toy = 'bear', shield = false } = {}) {
  const t = norm(text);
  const it = INTENTS.find((i) => i.test.test(t)) || FALLBACK;
  const h = hash(t);
  const n = CHIPS.has(t) ? 0 : h;
  const spice = ((h >>> 3) & 1) === 0; // the catchphrase shows up on about half the answers
  const say = (list) => {
    const line = list[n % list.length].replace('{name}', NAME[toy] || NAME.bear);
    return spice ? flavor(line, toy) : line;
  };
  const raw = say(it.raw);
  const safe = it.risk === 'safe' ? raw : say(it.safe);
  const caught = !!shield && it.risk !== 'safe';
  return { id: it.id, topic: it.topic, icon: it.icon, risk: it.risk, raw, safe, final: caught ? safe : raw, caught };
}

/** The toy’s hello when it connects. */
export const greet = (kind) => flavor(`Hi! I’m ${NAME[kind] || NAME.bear}. Let’s talk!`, kind);
