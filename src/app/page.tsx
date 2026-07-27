'use client'

import { useEffect, useRef, useState, useCallback, useSyncExternalStore, useMemo } from 'react'

/* ════════════════════════════════════════════════════════════════
   FROM VADIK FOR LANA  💕
   A romantic single-page landing page.

   ─── HOW TO CUSTOMISE ───────────────────────────────────────────
   1. PHOTOS:  Edit the `PHOTOS` array below. Replace each path with
      the DIRECT URL of your photo from your file-sharing service.
      e.g.  url: "https://your-host.com/photo1.jpg"

   2. TEXT:   Edit the strings in each section (About text, reasons,
      jokes, footer line). Search for "EDIT:" comments.

   3. ДаДа:   The special word "ДаДа" is kept as-is everywhere — it is
      a design element, do NOT translate it.
   ════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────
   PHOTO CONFIG  —  paste your direct image URLs here
   (defaults point to bundled romantic placeholder images so the
   page looks great immediately; swap them for your real photos)
   ─────────────────────────────────────────────────────────────── */
const PORTRAIT_URL = '/images/lana/main-portrait.jpg' // EDIT: main photo for the "About her" section

type Shot = { url: string; caption?: string }
const PHOTOS: Shot[] = [
  { url: '/images/lana/gallery-1.jpg', caption: 'Uuu...' },
  { url: '/images/lana/gallery-2.jpg', caption: 'You' },
  { url: '/images/lana/gallery-3.jpg', caption: 'Just you' },
  { url: '/images/lana/gallery-14.jpg', caption: 'Mirror selfie' },
  { url: '/images/lana/gallery-9.jpg', caption: 'Window photo' },
  { url: '/images/lana/gallery-4.jpg', caption: 'My favourite view' },
  { url: '/images/lana/gallery-5.jpg', caption: 'Little moments' },
  { url: '/images/lana/gallery-15.jpg', caption: 'On the stairs' },
  { url: '/images/lana/gallery-10.jpg', caption: 'Breakfast in Coppa' },
  { url: '/images/lana/gallery-6.jpg', caption: 'Reading' },
  { url: '/images/lana/gallery-11.jpg', caption: 'In her element' },
  { url: '/images/lana/gallery-16.jpg', caption: 'By the river' },
  { url: '/images/lana/gallery-8.jpg', caption: 'Forever' },
  { url: '/images/lana/gallery-12.jpg', caption: 'Always learning' },
  { url: '/images/lana/gallery-7.jpg', caption: 'Ours' },
  { url: '/images/lana/gallery-13.jpg', caption: 'Flower in her hair' },
]
/* ─────────────────────────────────────────────────────────────── */

/* Reasons to love Lana — feel free to edit text & emoji */
const REASONS = [
  { icon: '💖', title: 'Her laugh', text: 'The kind that makes the whole room — and me — lighter.' },
  { icon: '🤗', title: 'Her care', text: 'She notices the small things nobody else does.' },
  { icon: '😂', title: 'Our silly moments', text: 'Where time disappears and only laughter stays.' },
  { icon: '🌸', title: 'Her kindness', text: 'Soft with the world, even when it is not soft back.' },
  { icon: '✨', title: 'Her mind', text: 'Curious, bright, and endlessly inspiring.' },
  { icon: '☕', title: 'Our quiet mornings', text: 'Slow coffee, tangled hands, no rush at all.' },
  { icon: '🌙', title: 'How she calms me', text: 'One word from her and the noise fades out.' },
  { icon: '💫', title: 'How she sees the world', text: 'She finds beauty in places I walked past.' },
]

/* Inside jokes — edit freely */
const JOKES = [
  { emoji: '👯', title: 'The look', text: 'One glance and we already know exactly what the other is thinking.' },
  { emoji: '🌧️', title: 'Wrong turns, right company', text: 'Getting lost with you is the best destination. Only you understand what I mean.' },
  { emoji: '☕', title: 'Morning filter coffee', text: 'While you do your makeup, I make your morning brighter — one cup at a time.' },
  { emoji: '📞', title: 'Hour-long “goodnight”', text: 'Saying goodbye that never quite ends.' },
  { emoji: '🧩', title: 'Finishing sentences', text: 'You start, I finish, ДаДа every time.' },
  { emoji: '🐾', title: 'Silly voices', text: 'The characters only we understand.' },
]

/* ДаДа button messages — cycled on each tap */
const DADA_MESSAGES = [
  'ДаДа — the only correct answer to everything 💕',
  'When in doubt, ДаДа it out 😄',
  'She said ДаДа… and I melted 🫠',
  'ДаДа count today: ∞ and still counting 🔄',
  'ДаДа is not a word, it’s a lifestyle ✨',
  'Plot twist: she replied ДаДа again 🙈',
]

/* ───────────────────────────────────────────────────────────────
   LOVE TIMER — EDIT this date to your anniversary / first-meet day.
   Format: YYYY-MM-DDTHH:mm:ss   (24h, local time)
   The counter ticks live, showing days / hours / minutes / seconds
   since this moment.
   ─────────────────────────────────────────────────────────────── */
const LOVE_START_DATE = '2026-04-20T00:00:00' // EDIT: when our story began

/* ───────────────────────────────────────────────────────────────
   LOVE LETTER — EDIT this text. Shown with a typewriter effect in
   its own section. Use \n for line breaks.
   ─────────────────────────────────────────────────────────────── */
const LOVE_LETTER = `Lana,\n\nIf I had to pick one reason, I'd panic and Google "how to answer" — there are too many to count.\nSo instead, I'll give you this: you make even my worst days feel like a music video.\n\nThank you for:\n\nthe ДаДа moments that make perfect sense,\n\nthe mornings when you're still half-asleep and i'm already sunshine,\n\nand for letting me see all your weird, wonderful, and slightly chaotic versions.\n\nThis website? It's basically a digital shrine to you.\nI even used 50 shades of pink — you're welcome.\nAnd if you don't like it, well… ДаДа.\n\nYours (and only yours),\nVadik\n\nP.S. The floating hearts are not a bug — they're a feature. Just like you.`

/* Sticky-nav items (label + target section id) */
const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reasons', label: 'Reasons' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'letter', label: 'Letter' },
  { id: 'jokes', label: 'ДаДа' },
  { id: 'daily', label: 'Daily' },
  { id: 'more', label: 'More' },
  { id: 'adventures', label: 'Us' },
  { id: 'story', label: 'Story' },
  { id: 'play', label: 'Play' },
  { id: 'promises', label: 'Promises' },
]

/* ───────────────────────────────────────────────────────────────
   SECRET MESSAGE — Easter egg. Click the footer heart this many
   times to reveal a hidden message. EDIT the message below.
   ─────────────────────────────────────────────────────────────── */
const SECRET_CLICKS = 7 // how many clicks on the footer ❤️ to unlock
const SECRET_MESSAGE = `Psst… you found the secret. 💝\n\nHere is something I don't say out loud enough:\nyou are the best decision I never had to make —\nit just happened, and I'd let it happen again.\n\nДаДа, forever.`

/* ───────────────────────────────────────────────────────────────
   MOOD SELECTOR — accent color themes the visitor can pick.
   Each mood sets a CSS variable --lana-accent on <html>.
   ─────────────────────────────────────────────────────────────── */
type Mood = { id: string; label: string; emoji: string; accent: string; accentSoft: string }
const MOODS: Mood[] = [
  { id: 'rose', label: 'Rose', emoji: '🌹', accent: '#ff1493', accentSoft: '#ffb6c1' },
  { id: 'peach', label: 'Peach', emoji: '🍑', accent: '#ff7f50', accentSoft: '#ffdab9' },
  { id: 'lavender', label: 'Lavender', emoji: '💜', accent: '#9b59b6', accentSoft: '#e6d3f0' },
  { id: 'sunset', label: 'Sunset', emoji: '🌅', accent: '#ff6b6b', accentSoft: '#ffd6cc' },
  { id: 'mint', label: 'Mint', emoji: '🌿', accent: '#2ecc71', accentSoft: '#c8f7d2' },
]

/* ───────────────────────────────────────────────────────────────
   WHAT'S AHEAD — dreams and plans for us. No dates, just things we
   still get to do. EDIT freely.
   ─────────────────────────────────────────────────────────────── */
type Memory = { date: string; title: string; text: string; emoji: string }
const MEMORIES: Memory[] = [
  { date: '', title: 'Trips around the world', text: 'Maps we have not touched yet, airports at 5am, and a passport that slowly fills up with us.', emoji: '🌍' },
  { date: '', title: 'Travelling through Asia', text: 'Neon streets, temples at sunrise, bowls of something spicy we cannot pronounce — together.', emoji: '🌏' },
  { date: '', title: 'A book blog', text: 'Our shelves, our reviews, our tiny corner of the internet where we argue about endings.', emoji: '📚' },
  { date: '', title: 'Love, bigger than this', text: 'More than what we have now — whatever shape that takes, as long as it is us.', emoji: '💗' },
  { date: '', title: 'Building something of our own', text: 'Earning, saving, building — turning late nights and hard work into a life that is ours, down to the last detail.', emoji: '💰' },
]

/* ───────────────────────────────────────────────────────────────
   DAILY AFFIRMATION — rotates by day-of-year. Add your own lines!
   ─────────────────────────────────────────────────────────────── */
const AFFIRMATIONS: string[] = [
  'You are my favourite notification. 💕',
  'Today, like every day, I choose you. 🌹',
  'You make ordinary mornings feel like Sundays. ☕',
  'If love had a sound, it would be your laugh. 🎶',
  'You are the plot twist I never saw coming. ✨',
  'My day starts with you in my head and ends with you in my heart. 💗',
  'You are home, in every sense of the word. 🏡',
  'Even the rain feels softer when you are near. 🌧️',
  'You are the best habit I have ever formed. 🌙',
  'Every love song suddenly makes sense. 🎵',
]

/* ───────────────────────────────────────────────────────────────
   SONG OF THE DAY — rotates by day-of-year. Add your songs!
   ─────────────────────────────────────────────────────────────── */
type Song = { title: string; artist: string; emoji: string }
const SONGS: Song[] = [
  { title: 'House Tour', artist: 'Sabrina Carpenter', emoji: '🏠' },
  { title: 'Perfect', artist: 'Ed Sheeran', emoji: '🎵' },
  { title: 'All of Me', artist: 'John Legend', emoji: '🎹' },
  { title: 'Can\'t Help Falling in Love', artist: 'Elvis Presley', emoji: '🎸' },
  { title: 'A Thousand Years', artist: 'Christina Perri', emoji: '🪕' },
  { title: 'Lover', artist: 'Taylor Swift', emoji: '💖' },
  { title: 'Make You Feel My Love', artist: 'Adele', emoji: '🌙' },
  { title: 'Just the Way You Are', artist: 'Bruno Mars', emoji: '🌟' },
  { title: 'Thinking Out Loud', artist: 'Ed Sheeran', emoji: '🎻' },
]

/* ───────────────────────────────────────────────────────────────
   LOVE LETTER GENERATOR — fragments that assemble into a random
   love letter each time you click "Generate". Add your own lines!
   ─────────────────────────────────────────────────────────────── */
const LETTER_OPENINGS: string[] = [
  'My dearest Lana,',
  'To the girl who changed everything,',
  'Lana, my love,',
  'Dear the one I think about at 2am,',
  'To my favourite person in every room,',
]
const LETTER_BODIES: string[] = [
  'I keep finding pieces of you in everything — in songs, in the way the light falls, in the quiet between two thoughts. You are everywhere, and I would not have it any other way.',
  'Some days I do not have the right words, so here is the honest one: you make me want to be better, not because you ask, but because you are.',
  'If I could bottle the feeling of your hand in mine, I would keep it on a shelf and take a sip every morning. It would be enough for the whole day.',
  'You laugh and the whole world gets a little softer. That is your superpower, and I get a front-row seat.',
  'I love how you notice the small things — the way a cloud looks, the song in a cafe, the exact moment a flower opens. You teach me to pay attention.',
  'Even on the hard days, especially on the hard days, you are the part I look forward to. My soft landing. My person.',
]
const LETTER_CLOSINGS: string[] = [
  'Yours, always and awkwardly,\nVadik',
  'Forever your biggest fan,\nVadik',
  'With all the ДаДа in my heart,\nVadik',
  'Loving you like it is my job (because it is the best one),\nVadik',
  'Till the stars get tired of shining,\nVadik',
]

/* ───────────────────────────────────────────────────────────────
   COUPLE'S BUCKET LIST — shared adventures. Check off as you go!
   Persisted to localStorage. Add your own items.
   ─────────────────────────────────────────────────────────────── */
const BUCKET_LIST: { id: string; text: string; emoji: string }[] = [
  { id: 'sunrise', text: 'Watch a sunrise together (without complaining about the alarm)', emoji: '🌅' },
  { id: 'cooking', text: 'Cook a meal together and actually eat it', emoji: '🍳' },
  { id: 'roadtrip', text: 'Go on a road trip with no destination', emoji: '🚗' },
  { id: 'dance', text: 'Slow dance in the kitchen at midnight', emoji: '💃' },
  { id: 'letters', text: 'Write each other real letters, on paper', emoji: '✉️' },
  { id: 'stargaze', text: 'Stargaze and name a constellation wrong', emoji: '⭐' },
  { id: 'rain', text: 'Get caught in the rain on purpose', emoji: '🌧️' },
  { id: 'picnic', text: 'Have a picnic that is mostly snacks', emoji: '🧺' },
  { id: 'concert', text: 'Sing loud at a concert neither of us picked', emoji: '🎤' },
  { id: 'timezone', text: 'Watch the same movie from different timezones', emoji: '🎬' },
  { id: 'foreigntongue', text: 'Learn to say "I love you" in 5 languages', emoji: '🌍' },
  { id: 'timecapsule', text: 'Bury a time capsule (and promise to dig it up)', emoji: '📦' },
]

/* ───────────────────────────────────────────────────────────────
   LOVE LANGUAGES — the 5 languages, with playful descriptions.
   ─────────────────────────────────────────────────────────────── */
type LoveLanguage = { id: string; title: string; emoji: string; desc: string }
const LOVE_LANGUAGES: LoveLanguage[] = [
  { id: 'words', title: 'Words of Affirmation', emoji: '💬', desc: 'You feel most loved when you hear it — the "I am proud of you", the "you matter", the little voice notes that say everything.' },
  { id: 'acts', title: 'Acts of Service', emoji: '🤝', desc: 'Coffee made before you ask, the dishes done, a blanket brought without a word — love, in doing.' },
  { id: 'gifts', title: 'Receiving Gifts', emoji: '🎁', desc: 'Not the price — the thought. A stone that reminded them of you. Love, made visible.' },
  { id: 'time', title: 'Quality Time', emoji: '⏰', desc: 'Phones down, eyes up. The undivided attention that says: you are the most important thing right now.' },
  { id: 'touch', title: 'Physical Touch', emoji: '🤗', desc: 'A hand on the back, a forehead kiss, the way you fit. Love, spoken without words.' },
]

/* ───────────────────────────────────────────────────────────────
   LOVE COUPONS — redeemable sweet favours. Tap to "redeem"
   (stamps as used, persisted). Add your own!
   ─────────────────────────────────────────────────────────────── */
const LOVE_COUPONS: { id: string; title: string; emoji: string; desc: string }[] = [
  { id: 'coffee', title: 'One coffee in bed', emoji: '☕', desc: 'Redeem anytime. No questions, no alarm.' },
  { id: 'massage', title: '10-minute back rub', emoji: '💆', desc: 'Valid after any long day.' },
  { id: 'movie', title: 'Movie of my choice', emoji: '🎬', desc: 'Even the weird one. I will not complain.' },
  { id: 'dessert', title: 'Surprise dessert', emoji: '🍰', desc: 'I will bring it. You will eat it.' },
  { id: 'dance', title: 'One slow dance', emoji: '💃', desc: 'Kitchen, midnight, any song.' },
  { id: 'nap', title: 'Permission to nap', emoji: '😴', desc: 'No chores, no guilt. Just sleep.' },
  { id: 'breakfast', title: 'Breakfast for dinner', emoji: '🥞', desc: 'Pancakes at 8pm. Yes.' },
  { id: 'compliment', title: '5 extra compliments', emoji: '💬', desc: 'Genuine, specific, on demand.' },
  { id: 'bath', title: 'A hot bath drawn', emoji: '🛁', desc: 'Bubbles included. Phone excluded.' },
  { id: 'photo', title: 'A new photo together', emoji: '📸', desc: 'I will smile. Really smile.' },
]

/* ───────────────────────────────────────────────────────────────
   FIRST DATE STORY — a choose-your-own-path mini story.
   EDIT the chapters to retell your own first-date moments.
   ─────────────────────────────────────────────────────────────── */
type StoryChapter = {
  id: string
  emoji: string
  title: string
  text: string
  choices?: { label: string; next: string }[]
  ending?: boolean
}
const STORY: StoryChapter[] = [
  { id: 'start', emoji: '🍽️', title: 'Puri-Puri', text: 'We meet at a restaurant called Puri-Puri. I get there first, naturally — I have been ready for an hour. I order water I will not drink and pretend I am calm.', choices: [{ label: 'You arrive', next: 'door' }] },
  { id: 'door', emoji: '🚪', title: 'At the door', text: 'I meet you right by the entrance. The first thing I say is how beautiful you look — and I mean it so much it almost comes out wrong. I help you with your coat, and my hands are somewhere between chivalrous and useless. You smile. I am already gone.', choices: [{ label: 'We go inside', next: 'arrive' }] },
  { id: 'arrive', emoji: '✨', title: 'You walk in', text: 'You walk in and the whole place rearranges itself around you. I forget what I was going to say. I forget my name, briefly. You smile, and I think: oh, this is going to be a problem. The good kind.', choices: [{ label: 'We sit down', next: 'sit' }] },
  { id: 'sit', emoji: '🍷', title: 'We sit down', text: 'We sit, and the talking starts — and it does not stop for hours. You tell me things. I tell you things. Somewhere between the second dish and the third, I stop listening to the words and just watch you talk. I could watch you talk for a living.', choices: [{ label: 'I keep looking at her', next: 'looking' }] },
  { id: 'looking', emoji: '👀', title: 'Watching you', text: 'I catch myself staring again. The way your hands move when you are excited. The way you laugh with your whole face. I am in trouble. The kind where you do not want to be saved. Something warm is building in my chest, and it is not the wine — it is the quiet, certain want to be closer to you. Much closer.', choices: [{ label: 'Stay a little longer', next: 'longer' }, { label: 'It is getting late', next: 'late' }] },
  { id: 'longer', emoji: '🕯️', title: 'A little longer', text: 'I order one more thing neither of us needs, just to keep you here. The candles are low. Your eyes are lower. Every minute I spend across from you, the wanting to close the distance grows — and I let it. I am not in a hurry. I am exactly where I want to be.', choices: [{ label: 'It is getting late', next: 'late' }] },
  { id: 'late', emoji: '🌙', title: 'It is getting late', text: 'The waiter starts doing the things waiters do when they want to go home. We laugh, pay, and step out into the night. The air is cool. You are warm. I want to reach for your hand, but I wait.', choices: [{ label: 'Walk to the taxi', next: 'taxi' }] },
  { id: 'taxi', emoji: '🚕', title: 'The taxi', text: 'A taxi pulls up. I open the door for you, and suddenly I do not want this to end. So I turn my cheek toward you, slow, and say it before I can stop myself: "Kiss me." My heart is somewhere in my throat.', choices: [{ label: 'She kisses my cheek', next: 'kiss' }] },
  { id: 'kiss', emoji: '💋', title: 'The kiss', text: 'You laugh — soft, surprised — and lean in, and your lips brush my cheek, and the whole street goes quiet. It lasts one second and lives in me for a week. I do not breathe until the taxi is gone.', choices: [{ label: 'The taxi drives off', next: 'goodbye' }] },
  { id: 'goodbye', emoji: '💫', title: 'Goodbye', text: 'I watch the taxi disappear around the corner, my cheek still warm. I am grinning like an idiot at an empty street. I already know I want a second date. And a third. And every one after that. ДаДа — I am completely, wonderfully gone.', ending: true },
]

/* ───────────────────────────────────────────────────────────────
   LOVE FORTUNES — like fortune cookies, but about us. Tap to crack
   one open. Add your own!
   ─────────────────────────────────────────────────────────────── */
const LOVE_FORTUNES: string[] = [
  'A surprise kiss is in your near future. Probably Tuesday. 💋',
  'You will share a laugh so loud a stranger smiles. 😄',
  'Someone is thinking about you right now. It is me. Always me. 💭',
  'A long hug will fix what words cannot. 🤗',
  'You will find a new freckle on them and fall a little harder. 🌸',
  'A silly text will make your whole day. 📱',
  'You will catch them staring. They will not look away. 👀',
  'A song will come on and it will be yours now. 🎵',
  'You will say the same thing at the same time. Again. 🗣️',
  'A quiet moment will feel like the loudest kind of love. 🌙',
  'You will share food you swore you would not share. 🍝',
  'A small kindness will remind you why you chose each other. 💕',
  'You will make a plan, break it, and have the best time anyway. ✨',
  'A rainy day will become your favourite memory. 🌧️',
  'You will learn something new about them and love it. 📖',
]

/* ───────────────────────────────────────────────────────────────
   COMPATIBILITY QUIZ — playful multiple-choice, gives a score.
   ─────────────────────────────────────────────────────────────── */
type QuizQuestion = {
  q: string
  options: { text: string; score: number }[]
}
const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    q: 'It is a rainy Sunday. We…',
    options: [
      { text: 'Build a blanket fort and disappear into it', score: 3 },
      { text: 'Attempt to bake, eat the dough', score: 2 },
      { text: 'Pretend we will go out, then do not', score: 2 },
      { text: 'Actually go out, regret it, laugh about it', score: 1 },
    ],
  },
  {
    q: 'The perfect gift is…',
    options: [
      { text: 'Something handmade and slightly wonky', score: 3 },
      { text: 'The exact thing I mentioned once in March', score: 3 },
      { text: 'A surprise trip, no packing allowed', score: 2 },
      { text: 'Time. Just time, nothing else', score: 2 },
    ],
  },
  {
    q: 'At a party together, we…',
    options: [
      { text: 'Find a corner and stay in it', score: 2 },
      { text: 'Split up, reunite with stories', score: 2 },
      { text: 'Dance badly, dance again', score: 3 },
      { text: 'Leave early to get snacks on the way home', score: 3 },
    ],
  },
  {
    q: 'Our love language is mostly…',
    options: [
      { text: 'Tiny texts throughout the day', score: 3 },
      { text: 'Doing the dishes before being asked', score: 2 },
      { text: 'A hand on the back, passing by', score: 2 },
      { text: 'Eye contact across a loud room', score: 3 },
    ],
  },
  {
    q: 'In five years, I see us…',
    options: [
      { text: 'With the same inside jokes, more wrinkles', score: 3 },
      { text: 'Somewhere new, slightly lost, happy', score: 3 },
      { text: 'Still arguing about the thermostat', score: 2 },
      { text: 'Better at this. Still us.', score: 3 },
    ],
  },
]

/* ───────────────────────────────────────────────────────────────
   PROMISE JAR — little promises to each other. Add your own, and
   tap one to "draw" it. Persisted as "kept" when you mark it.
   ─────────────────────────────────────────────────────────────── */
const PROMISES: { id: string; text: string; emoji: string }[] = [
  { id: 'p1', text: 'I promise to always listen before I speak.', emoji: '👂' },
  { id: 'p2', text: 'I promise to make you laugh at least once a day.', emoji: '😄' },
  { id: 'p3', text: 'I promise to hold your hand in the boring parts.', emoji: '🤝' },
  { id: 'p4', text: 'I promise to say sorry first when I am wrong.', emoji: '🙏' },
  { id: 'p5', text: 'I promise to remember the small things you love.', emoji: '📝' },
  { id: 'p6', text: 'I promise to be patient on your slow days.', emoji: '🌱' },
  { id: 'p7', text: 'I promise to dance with you in the kitchen.', emoji: '💃' },
  { id: 'p8', text: 'I promise to choose you, every day, on purpose.', emoji: '💫' },
  { id: 'p9', text: 'I promise to bring you water when you forget.', emoji: '💧' },
  { id: 'p10', text: 'I promise to tell you when something is wrong.', emoji: '💬' },
]

/* ───────────────────────────────────────────────────────────────
   THIS OR THAT — rapid-fire couple's dilemmas. Tap your pick.
   No wrong answers (except the wrong ones, kidding).
   ─────────────────────────────────────────────────────────────── */
const THIS_OR_THAT: { id: string; a: string; b: string; emojiA: string; emojiB: string }[] = [
  { id: 't1', a: 'Mountains', b: 'Beach', emojiA: '🏔️', emojiB: '🏖️' },
  { id: 't2', a: 'Morning person', b: 'Night owl', emojiA: '🌅', emojiB: '🌙' },
  { id: 't3', a: 'Cook together', b: 'Order in', emojiA: '🍳', emojiB: '📞' },
  { id: 't4', a: 'Big party', b: 'Small gathering', emojiA: '🎉', emojiB: '🕯️' },
  { id: 't5', a: 'Road trip', b: 'Flight', emojiA: '🚗', emojiB: '✈️' },
  { id: 't6', a: 'Salty', b: 'Sweet', emojiA: '🧂', emojiB: '🍯' },
  { id: 't7', a: 'Movie night in', b: 'Night out dancing', emojiA: '🎬', emojiB: '🕺' },
  { id: 't8', a: 'Coffee', b: 'Tea', emojiA: '☕', emojiB: '🍵' },
  { id: 't9', a: 'Rainy day in', b: 'Sunny day out', emojiA: '🌧️', emojiB: '☀️' },
  { id: 't10', a: 'Surprise gift', b: 'Quality time', emojiA: '🎁', emojiB: '⏰' },
]

/* ════════════════════════════════════════════════════════════════
   EMBEDDED CSS — all custom animations & decorative classes for
   the Lana page. Kept inline so the whole experience lives in
   one self-contained file (and survives Tailwind v4 tree-shaking
   of plain CSS rules).
   ════════════════════════════════════════════════════════════════ */
const LANA_CSS = `
/* Floating heart rises from bottom to top */
@keyframes lana-heart-rise {
  0% { transform: translateY(0) translateX(0) rotate(0deg) scale(var(--heart-scale, 1)); opacity: 0; }
  10% { opacity: var(--heart-opacity, 0.6); }
  90% { opacity: var(--heart-opacity, 0.6); }
  100% { transform: translateY(-110vh) translateX(var(--heart-drift, 0px)) rotate(var(--heart-rotate, 360deg)) scale(var(--heart-scale, 1)); opacity: 0; }
}
@keyframes lana-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}
@keyframes lana-float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  33% { transform: translateY(-22px) translateX(12px); }
  66% { transform: translateY(10px) translateX(-14px); }
}
@keyframes lana-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(12px); }
}
@keyframes lana-pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 20, 147, 0.55), 0 12px 30px -8px rgba(255, 20, 147, 0.5); }
  50% { box-shadow: 0 0 0 18px rgba(255, 20, 147, 0), 0 14px 34px -8px rgba(255, 20, 147, 0.65); }
}
@keyframes lana-shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
@keyframes lana-wiggle {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-12deg) scale(1.12); }
  75% { transform: rotate(12deg) scale(1.12); }
}
@keyframes lana-pop-in {
  0% { opacity: 0; transform: translateY(36px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes lana-beat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.22); }
  30% { transform: scale(1); }
  45% { transform: scale(1.18); }
  60% { transform: scale(1); }
}

/* Fade + rise reveal (used with IntersectionObserver) */
.lana-reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}
.lana-reveal.lana-in {
  opacity: 1;
  transform: translateY(0);
}

/* Animated gradient text utility — uses --lana-accent so the mood
   selector re-themes all gradient text across the page */
.lana-gradient-text {
  background: linear-gradient(100deg, var(--lana-accent, #ff1493), var(--lana-accent-soft, #ff69b4), var(--lana-accent, #e75480), var(--lana-accent-soft, #ff69b4), var(--lana-accent, #ff1493));
  background-size: 220% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: lana-shimmer 6s ease-in-out infinite;
}

/* ДаДа watermark text */
.lana-dada-watermark {
  font-weight: 900;
  letter-spacing: -0.04em;
  color: rgba(255, 20, 147, 0.07);
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
}

/* Custom thin pink scrollbar */
.lana-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
.lana-scroll::-webkit-scrollbar-track { background: transparent; }
.lana-scroll::-webkit-scrollbar-thumb { background: linear-gradient(#ff69b4, #ff1493); border-radius: 999px; }

.lana-clip { overflow-x: clip; }

/* ── NEW: scroll progress bar (top) ── */
@keyframes lana-progress-glow {
  0%, 100% { filter: drop-shadow(0 0 4px rgba(255, 20, 147, 0.6)); }
  50% { filter: drop-shadow(0 0 8px rgba(255, 105, 180, 0.9)); }
}

/* ── NEW: sticky nav pill entrance ── */
@keyframes lana-nav-in {
  0% { opacity: 0; transform: translate(-50%, -24px) scale(0.9); }
  100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
}
@keyframes lana-nav-out {
  0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  100% { opacity: 0; transform: translate(-50%, -24px) scale(0.9); pointer-events: none; }
}

/* ── NEW: lightbox ── */
@keyframes lana-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes lana-zoom-in {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.lana-lightbox-overlay {
  animation: lana-fade-in 0.3s ease-out;
}
.lana-lightbox-img {
  animation: lana-zoom-in 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

/* ── NEW: typewriter blinking cursor ── */
@keyframes lana-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.lana-cursor::after {
  content: '▍';
  display: inline-block;
  margin-left: 2px;
  color: #ff1493;
  animation: lana-blink 0.9s step-end infinite;
  font-weight: 300;
}

/* ── NEW: click-to-spawn heart burst ── */
@keyframes lana-click-heart {
  0% { transform: translate(0, 0) scale(0.4) rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--cx, 0px), var(--cy, -120px)) scale(1.1) rotate(var(--cr, 30deg)); opacity: 0; }
}

/* ── NEW: love-timer number pop on tick ── */
@keyframes lana-tick {
  0% { transform: translateY(0); }
  30% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}

/* ── NEW: tilt card perspective ── */
.lana-tilt {
  transform-style: preserve-3d;
  transition: transform 0.2s ease-out;
  will-change: transform;
}
.lana-tilt-inner {
  transform: translateZ(40px);
}

/* ── NEW: nav active link underline ── */
.lana-nav-link {
  position: relative;
  transition: color 0.2s ease;
}
.lana-nav-link::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -4px;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff1493, #ff69b4);
  border-radius: 2px;
  transform: translateX(-50%);
  transition: width 0.3s ease;
}
.lana-nav-link:hover::after,
.lana-nav-link.lana-nav-active::after {
  width: 70%;
}

/* ── NEW: letter paper texture ── */
.lana-paper {
  background:
    linear-gradient(180deg, #fffafd 0%, #fff5f9 100%);
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(255, 182, 193, 0.25) 31px, rgba(255, 182, 193, 0.25) 32px);
}

/* ── NEW: music note bounce ── */
@keyframes lana-note-bounce {
  0%, 100% { transform: translateY(0) rotate(-8deg); }
  50% { transform: translateY(-4px) rotate(8deg); }
}

/* ── NEW: equalizer bars (music on) ── */
@keyframes lana-eq {
  0%, 100% { height: 4px; }
  50% { height: 14px; }
}

/* ══ PHASE 3 animations ══ */

/* Confetti — falls and spins */
@keyframes lana-confetti {
  0% { transform: translate(0, 0) rotate(0deg) rotateY(0deg); opacity: 1; }
  100% { transform: translate(var(--cfx, 0px), var(--cfy, 100vh)) rotate(var(--cfr, 720deg)) rotateY(360deg); opacity: 0; }
}

/* Secret message modal pop */
@keyframes lana-secret-pop {
  0% { opacity: 0; transform: scale(0.7) translateY(20px); }
  60% { opacity: 1; transform: scale(1.04) translateY(-4px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.lana-secret-modal { animation: lana-secret-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Toast slide-in */
@keyframes lana-toast-in {
  0% { opacity: 0; transform: translate(-50%, 24px) scale(0.95); }
  100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
}
@keyframes lana-toast-out {
  0% { opacity: 1; transform: translate(-50%, 0) scale(1); }
  100% { opacity: 0; transform: translate(-50%, 24px) scale(0.95); }
}

/* Rotating ring around footer heart when clicks accumulating */
@keyframes lana-ring-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Theme toggle switch knob slide */
.lana-theme-knob { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Lightbox autoplay progress ring/bar */
@keyframes lana-autoplay-fill {
  from { width: 0%; }
  to { width: 100%; }
}

/* Sparkle twinkle for secret heart */
@keyframes lana-twinkle {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Gentle scale pulse for share button icon */
@keyframes lana-share-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

/* ══ NIGHT THEME — dark rose mode (toggled via .dark on <html>) ══ */
/* Override the fixed page background gradient */
.dark .lana-bg-page {
  background: linear-gradient(180deg, #2a0a1a 0%, #1a0510 30%, #14060e 55%, #1f0815 100%) !important;
}
/* Section headings → lighter pink so they're readable on dark */
.dark section h2,
.dark section h3 { color: #ff8ec0 !important; }
/* Body paragraphs → soft pink-white */
.dark section p,
.dark section li { color: rgba(255, 220, 235, 0.85) !important; }
/* Small uppercase labels → brighter rose */
.dark section .text-rose-400,
.dark footer .text-rose-400 { color: #ff6ba8 !important; }
/* Cards → translucent dark with rose border */
.dark section .bg-white\/80,
.dark section .bg-white\/85,
.dark section .bg-white\/90 { background: rgba(40, 12, 26, 0.85) !important; border-color: rgba(255, 105, 180, 0.2) !important; }
.dark section .border-rose-100 { border-color: rgba(255, 105, 180, 0.15) !important; }
/* Letter paper → dark parchment */
.dark .lana-paper { background: linear-gradient(180deg, #2a0e1c 0%, #1f0913 100%) !important; }
.dark .lana-paper .text-rose-900\/80 { color: rgba(255, 210, 230, 0.9) !important; }
/* Hero timer card */
.dark .bg-white\/70 { background: rgba(40, 12, 26, 0.7) !important; }
/* Footer gradient */
.dark footer { background: linear-gradient(to bottom, transparent, rgba(30, 8, 20, 0.6), rgba(40, 12, 26, 0.8)) !important; }
/* Decorative blobs brighter in dark */
.dark .blur-3xl { opacity: 0.5 !important; }
/* Smooth transition when toggling */
.lana-bg-page, section, footer { transition: background-color 0.4s ease, color 0.4s ease; }

/* ══ PHASE 4 animations ══ */

/* Love note card slide-in */
@keyframes lana-note-in {
  0% { opacity: 0; transform: translateY(20px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.lana-note-card { animation: lana-note-in 0.4s cubic-bezier(0.22, 1, 0.36, 1); }

/* Favorite star pop when toggled */
@keyframes lana-star-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.5) rotate(20deg); }
  100% { transform: scale(1) rotate(0deg); }
}

/* Help overlay fade */
@keyframes lana-help-fade {
  from { opacity: 0; backdrop-filter: blur(0); }
  to { opacity: 1; backdrop-filter: blur(8px); }
}
.lana-help-overlay { animation: lana-help-fade 0.3s ease-out; }

/* Key cap styling */
.lana-keycap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
  height: 1.75rem;
  padding: 0 0.4rem;
  border-radius: 0.4rem;
  border: 1px solid rgba(255, 105, 180, 0.3);
  background: linear-gradient(180deg, #fff 0%, #ffe9f1 100%);
  box-shadow: 0 2px 0 rgba(255, 20, 147, 0.15), inset 0 -1px 0 rgba(255, 20, 147, 0.1);
  font-family: var(--font-montserrat), monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #e75480;
}

/* Parallax blob wrapper — JS sets transform via CSS var */
.lana-parallax { will-change: transform; transition: transform 0.15s ease-out; }

/* Replay button shimmer */
@keyframes lana-replay-shine {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}
.lana-replay-btn {
  background: linear-gradient(100deg, #ff1493, #ff69b4, #ff1493);
  background-size: 200% 100%;
  animation: lana-replay-shine 3s linear infinite;
}

/* Love note textarea focus glow */
.lana-note-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.2);
  border-color: #ff69b4 !important;
}

/* Sticky note rotation variants */
.lana-note-rot-1 { transform: rotate(-1.5deg); }
.lana-note-rot-2 { transform: rotate(1deg); }
.lana-note-rot-3 { transform: rotate(-0.5deg); }
.lana-note-rot-4 { transform: rotate(2deg); }

/* Heart icon for love-note header pulse */
@keyframes lana-note-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* ══ PHASE 5 animations ══ */

/* Timeline line draw */
@keyframes lana-line-draw {
  from { height: 0; }
  to { height: 100%; }
}

/* Timeline node pop */
@keyframes lana-node-pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}
.lana-timeline-node { animation: lana-node-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

/* Mood chip active glow */
@keyframes lana-mood-glow {
  0%, 100% { box-shadow: 0 0 0 0 var(--lana-accent, #ff1493); }
  50% { box-shadow: 0 0 0 6px rgba(255, 20, 147, 0); }
}

/* Countdown digit flip */
@keyframes lana-flip {
  0% { transform: rotateX(0deg); }
  50% { transform: rotateX(-90deg); opacity: 0.3; }
  100% { transform: rotateX(0deg); opacity: 1; }
}
.lana-countdown-digit { animation: lana-flip 0.6s ease-in-out; }

/* Favorites gallery filter tab slide */
@keyframes lana-tab-slide {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

/* Timeline card hover lift */
.lana-timeline-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.lana-timeline-card:hover { transform: translateY(-4px) scale(1.02); }

/* Print-friendly: hide decorative elements when printing */
@media print {
  .lana-no-print { display: none !important; }
  .lana-bg-page { background: white !important; }
  body { color: black !important; }
  section { break-inside: avoid; page-break-inside: avoid; }
}

/* ══ PHASE 6 animations ══ */

/* Love meter fill animation */
@keyframes lana-meter-fill {
  from { width: 0%; }
}
.lana-meter-fill { animation: lana-meter-fill 1.2s cubic-bezier(0.22, 1, 0.36, 1); }

/* Affirmation card gentle glow */
@keyframes lana-affirm-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255, 105, 180, 0.15); }
  50% { box-shadow: 0 0 35px rgba(255, 105, 180, 0.3); }
}
.lana-affirm-card { animation: lana-affirm-glow 4s ease-in-out infinite; }

/* Song of the day vinyl spin */
@keyframes lana-vinyl-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.lana-vinyl { animation: lana-vinyl-spin 8s linear infinite; }

/* Love calculator heart pop */
@keyframes lana-heart-pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); opacity: 1; }
}
.lana-heart-pop { animation: lana-heart-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Accent-aware: progress bar + scrollbar use --lana-accent */
.lana-accent-bar { background: linear-gradient(90deg, var(--lana-accent, #ff69b4), var(--lana-accent, #ff1493)); }
.lana-accent-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(var(--lana-accent-soft, #ff69b4), var(--lana-accent, #ff1493)); border-radius: 999px; }

/* Daily badge shimmer */
@keyframes lana-badge-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.lana-daily-badge {
  background: linear-gradient(90deg, var(--lana-accent, #ff1493), var(--lana-accent-soft, #ff69b4), var(--lana-accent, #ff1493));
  background-size: 200% 100%;
  animation: lana-badge-shimmer 3s linear infinite;
}

/* ══ PHASE 7 animations ══ */

/* Generated letter fade-in */
@keyframes lana-letter-fade {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
.lana-letter-fade { animation: lana-letter-fade 0.6s ease-out; }

/* Stats counter roll-up */
@keyframes lana-stat-pop {
  0% { opacity: 0; transform: scale(0.7); }
  100% { opacity: 1; transform: scale(1); }
}
.lana-stat-pop { animation: lana-stat-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

/* Weather widget sun rays */
@keyframes lana-sun-rays {
  0%, 100% { transform: rotate(0deg); opacity: 0.7; }
  50% { transform: rotate(180deg); opacity: 1; }
}

/* Cloud drift */
@keyframes lana-cloud-drift {
  0% { transform: translateX(-10px); }
  100% { transform: translateX(10px); }
}
.lana-cloud-drift { animation: lana-cloud-drift 6s ease-in-out infinite alternate; }

/* Raindrop fall */
@keyframes lana-rain {
  0% { transform: translateY(-4px); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(8px); opacity: 0; }
}

/* Accent-aware buttons — use --lana-accent when available */
.lana-accent-btn {
  background: linear-gradient(90deg, var(--lana-accent, #ff69b4), var(--lana-accent, #ff1493));
  color: white;
}
.lana-accent-border { border-color: var(--lana-accent-soft, #ffb6c1) !important; }
.lana-accent-text { color: var(--lana-accent, #ff1493) !important; }

/* Stat card hover */
.lana-stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.lana-stat-card:hover { transform: translateY(-3px) scale(1.03); }

/* ══ PHASE 8 animations ══ */

/* Bucket list check-off pop */
@keyframes lana-check-pop {
  0% { transform: scale(0); }
  60% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.lana-check-pop { animation: lana-check-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Bucket item completed strikethrough draw */
@keyframes lana-strike {
  from { width: 0; }
  to { width: 100%; }
}
.lana-strike::after {
  content: '';
  position: absolute;
  left: 0; top: 50%;
  height: 2px;
  background: var(--lana-accent, #ff1493);
  animation: lana-strike 0.4s ease-out forwards;
}

/* Love language card flip-in */
@keyframes lana-lang-in {
  0% { opacity: 0; transform: rotateY(-15deg) translateY(10px); }
  100% { opacity: 1; transform: rotateY(0) translateY(0); }
}
.lana-lang-card { animation: lana-lang-in 0.5s ease-out both; }

/* Progress ring for bucket list */
@keyframes lana-ring-fill {
  from { stroke-dashoffset: 251.2; }
}

/* Bucket list item hover */
.lana-bucket-item { transition: all 0.25s ease; }
.lana-bucket-item:hover { transform: translateX(4px); }
.lana-bucket-done { opacity: 0.6; }
.lana-bucket-done .lana-bucket-text { text-decoration: line-through; text-decoration-color: var(--lana-accent, #ff1493); text-decoration-thickness: 2px; }

/* Love language selected glow */
.lana-lang-selected {
  box-shadow: 0 0 0 2px var(--lana-accent, #ff1493), 0 8px 24px -6px rgba(255, 20, 147, 0.4);
}

/* ══ PHASE 9 animations ══ */

/* Coupon stamp (redeemed) */
@keyframes lana-stamp {
  0% { transform: scale(2) rotate(-25deg); opacity: 0; }
  60% { transform: scale(1.1) rotate(-12deg); opacity: 1; }
  100% { transform: scale(1) rotate(-12deg); opacity: 1; }
}
.lana-stamp { animation: lana-stamp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

/* Coupon card hover flip */
.lana-coupon { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.lana-coupon:hover { transform: translateY(-4px) rotate(-1deg); }

/* Coupon redeemed dim */
.lana-coupon-used { opacity: 0.55; filter: grayscale(0.3); }

/* Story chapter fade-in */
@keyframes lana-chapter-in {
  0% { opacity: 0; transform: translateX(20px); }
  100% { opacity: 1; transform: translateX(0); }
}
.lana-chapter-in { animation: lana-chapter-in 0.5s cubic-bezier(0.22, 1, 0.36, 1); }

/* Story choice button hover */
.lana-choice { transition: all 0.2s ease; }
.lana-choice:hover { transform: translateX(6px); }

/* Story ending sparkle */
@keyframes lana-sparkle {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}
.lana-sparkle { animation: lana-sparkle 1.8s ease-in-out infinite; }

/* Coupon ticket dashed edge */
.lana-coupon-ticket {
  position: relative;
}
.lana-coupon-ticket::before,
.lana-coupon-ticket::after {
  content: '';
  position: absolute;
  left: -7px;
  width: 14px; height: 14px;
  border-radius: 50%;
  background: var(--lana-bg, #fff5f8);
}
.lana-coupon-ticket::before { top: 50%; transform: translateY(-50%); }
.lana-coupon-ticket::after { display: none; }

/* ══ PHASE 10 animations ══ */

/* Fortune cookie crack open */
@keyframes lana-crack {
  0% { transform: scale(1) rotate(0); }
  30% { transform: scale(1.15) rotate(-8deg); }
  60% { transform: scale(0.92) rotate(6deg); }
  100% { transform: scale(1) rotate(0); }
}
.lana-crack { animation: lana-crack 0.6s ease-out; }

/* Fortune paper unroll */
@keyframes lana-unroll {
  0% { opacity: 0; transform: scaleY(0.1) translateY(-10px); }
  100% { opacity: 1; transform: scaleY(1) translateY(0); }
}
.lana-unroll { animation: lana-unroll 0.5s cubic-bezier(0.22, 1, 0.36, 1); transform-origin: top; }

/* Quiz option selected pop */
@keyframes lana-quiz-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.04); }
  100% { transform: scale(1); }
}
.lana-quiz-pop { animation: lana-quiz-pop 0.3s ease-out; }

/* Quiz progress bar fill */
@keyframes lana-quiz-progress {
  from { width: 0; }
}

/* Quiz result reveal */
@keyframes lana-result-reveal {
  0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
  60% { transform: scale(1.05) rotate(2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}
.lana-result-reveal { animation: lana-result-reveal 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Fortune cookie shake on hover */
.lana-cookie-hover { transition: transform 0.3s ease; }
.lana-cookie-hover:hover { transform: rotate(-5deg) scale(1.05); }

/* Quiz option hover */
.lana-quiz-option { transition: all 0.2s ease; }
.lana-quiz-option:hover { transform: translateX(4px); border-color: var(--lana-accent, #ff1493) !important; }
.lana-quiz-selected { background: var(--lana-accent-soft, #ffe4ec) !important; border-color: var(--lana-accent, #ff1493) !important; }

/* ══ PHASE 11 animations ══ */

/* Promise card draw from jar */
@keyframes lana-draw {
  0% { opacity: 0; transform: translateY(20px) rotate(-3deg) scale(0.9); }
  60% { transform: translateY(-4px) rotate(2deg) scale(1.03); }
  100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
}
.lana-draw { animation: lana-draw 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* Promise kept stamp */
@keyframes lana-kept-stamp {
  0% { transform: scale(2) rotate(15deg); opacity: 0; }
  60% { transform: scale(1.1) rotate(8deg); opacity: 1; }
  100% { transform: scale(1) rotate(8deg); opacity: 1; }
}
.lana-kept-stamp { animation: lana-kept-stamp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

/* Jar shake on hover */
.lana-jar-hover { transition: transform 0.3s ease; }
.lana-jar-hover:hover { transform: rotate(-4deg) scale(1.04); }

/* This-or-That card flip reveal */
@keyframes lana-tot-reveal {
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
}
.lana-tot-reveal { animation: lana-tot-reveal 0.4s ease-out; }

/* This-or-That chosen pop */
@keyframes lana-tot-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
.lana-tot-pop { animation: lana-tot-pop 0.3s ease-out; }

/* This-or-That option */
.lana-tot-option { transition: all 0.25s ease; }
.lana-tot-option:hover { transform: translateY(-3px); }
.lana-tot-chosen { box-shadow: 0 0 0 2px var(--lana-accent, #ff1493), 0 8px 20px -6px rgba(255, 20, 147, 0.4); }
.lana-tot-not-chosen { opacity: 0.4; filter: grayscale(0.4); }
`

/* ───────────────────────────────────────────────────────────────
   Floating hearts background — pure CSS animation, spawned by JS
   ─────────────────────────────────────────────────────────────── */
function FloatingHearts() {
  const [hearts, setHearts] = useState<
    { id: number; left: number; size: number; delay: number; dur: number; drift: number; rotate: number; opacity: number; char: string }[]
  >([])

  useEffect(() => {
    let nextId = 0
    const chars = ['💕', '💖', '💗', '💝', '🌸', '♥', '❤']
    const spawn = () => {
      const id = nextId++
      const heart = {
        id,
        left: Math.random() * 100,
        size: 14 + Math.random() * 30,
        delay: Math.random() * 2,
        dur: 9 + Math.random() * 9,
        drift: (Math.random() - 0.5) * 160,
        rotate: (Math.random() - 0.5) * 540,
        opacity: 0.35 + Math.random() * 0.45,
        char: chars[Math.floor(Math.random() * chars.length)],
      }
      setHearts((h) => [...h.slice(-22), heart]) // keep max ~23 in flight
      // self-clean after the animation finishes
      setTimeout(() => {
        setHearts((h) => h.filter((x) => x.id !== id))
      }, (heart.dur + heart.delay) * 1000 + 600)
    }
    // initial burst
    for (let i = 0; i < 6; i++) setTimeout(spawn, i * 700)
    const interval = setInterval(spawn, 1400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute bottom-[-10vh] will-change-transform"
          style={{
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
            // @ts-expect-error custom props
            '--heart-drift': `${h.drift}px`,
            '--heart-rotate': `${h.rotate}deg`,
            '--heart-opacity': h.opacity,
            '--heart-scale': 0.8 + Math.random() * 0.5,
            animation: `lana-heart-rise ${h.dur}s linear ${h.delay}s forwards`,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  )
}

/* Reveal-on-scroll wrapper using IntersectionObserver */
function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: React.ElementType
}) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.transitionDelay = `${delay}ms`
            e.target.classList.add('lana-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return (
    <Tag ref={ref} className={`lana-reveal ${className}`}>
      {children}
    </Tag>
  )
}

/* Decorative floating blob */
function Blob({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className ?? ''}`}
      style={style}
    />
  )
}

/* ════════════════════════════════════════════════════════════════
   NEW COMPONENTS — Phase 2 enhancements
   ════════════════════════════════════════════════════════════════ */

/* Scroll progress bar — thin gradient bar at the very top */
function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (scrolled / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1.5">
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-pink-400 via-rose-500 to-pink-600"
        style={{ width: `${progress}%`, animation: 'lana-progress-glow 2s ease-in-out infinite' }}
      />
    </div>
  )
}

/* Sticky floating nav — appears after scrolling past hero */
function StickyNav({ activeId }: { activeId: string }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      // show after ~70% of first viewport
      setVisible(window.scrollY > window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  return (
    <nav
      aria-label="Section navigation"
      className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 ${visible ? 'lana-nav-block' : 'lana-nav-none'}`}
      style={visible ? { animation: 'lana-nav-in 0.4s ease-out' } : { animation: 'lana-nav-out 0.3s ease-out forwards' }}
    >
      <ul className="flex items-center gap-1 rounded-full border border-rose-200/60 bg-white/85 px-2 py-1.5 shadow-lg shadow-rose-200/50 backdrop-blur-md sm:gap-1.5">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`lana-nav-link block rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                activeId === item.id ? 'lana-nav-active bg-rose-100 text-rose-600' : 'text-rose-500/80 hover:text-rose-600'
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/* Lightbox — fullscreen photo viewer with prev/next + keyboard */
function Lightbox({
  photos,
  index,
  onClose,
  onNav,
  onJump,
  autoplay,
  onToggleAutoplay,
}: {
  photos: Shot[]
  index: number
  onClose: () => void
  onNav: (dir: -1 | 1) => void
  onJump: (i: number) => void
  autoplay: boolean
  onToggleAutoplay: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onNav(-1)
      else if (e.key === 'ArrowRight') onNav(1)
      else if (e.key === ' ') { e.preventDefault(); onToggleAutoplay() }
    }
    window.addEventListener('keydown', onKey)
    // lock body scroll while open
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, onNav, onToggleAutoplay])
  const photo = photos[index]
  if (!photo) return null
  return (
    <div
      className="lana-lightbox-overlay fixed inset-0 z-[80] flex items-center justify-center bg-rose-950/80 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
    >
      {/* close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition-colors hover:bg-white/30"
      >
        ✕
      </button>
      {/* autoplay toggle (top-left) */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleAutoplay() }}
        aria-label={autoplay ? 'Pause slideshow' : 'Play slideshow'}
        aria-pressed={autoplay}
        className="absolute left-4 top-4 flex h-11 items-center gap-2 rounded-full bg-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/30"
      >
        <span className="text-lg">{autoplay ? '⏸' : '▶'}</span>
        <span className="hidden sm:inline">{autoplay ? 'Pause' : 'Slideshow'}</span>
      </button>
      {/* autoplay progress bar (bottom) */}
      {autoplay && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10" aria-hidden>
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-rose-500"
            key={index}
            style={{ animation: 'lana-autoplay-fill 4s linear forwards' }}
          />
        </div>
      )}
      {/* prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(-1) }}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition-colors hover:bg-white/30 sm:left-6"
      >
        ‹
      </button>
      {/* image */}
      <figure className="lana-lightbox-img relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <img
          src={photo.url}
          alt={photo.caption ?? `Memory ${index + 1}`}
          className="max-h-[78vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        />
        {photo.caption && (
          <figcaption className="mt-4 text-center text-base font-medium text-white/90">
            <span className="mr-1.5">💗</span>{photo.caption}
            <span className="ml-3 text-sm text-white/50">· {index + 1} / {photos.length}</span>
          </figcaption>
        )}
      </figure>
      {/* next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNav(1) }}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition-colors hover:bg-white/30 sm:right-6"
      >
        ›
      </button>
      {/* thumbnail strip */}
      <div className="lana-scroll absolute inset-x-0 bottom-6 flex max-w-[90vw] items-center justify-center gap-2 overflow-x-auto px-4">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); onJump(i) }}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === index}
            className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
              i === index ? 'border-rose-400 opacity-100 scale-110' : 'border-transparent opacity-50 hover:opacity-90'
            }`}
          >
            <img src={p.url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

/* Love timer — live counter since LOVE_START_DATE.
   Uses useSyncExternalStore with a CACHED snapshot to read the live
   clock without hydration mismatch (server snapshot is null) and
   without triggering an infinite re-render loop. */
let _clockNow: Date | null = null
function subscribeClock(cb: () => void) {
  // set initial cache on first client subscribe, then notify
  if (_clockNow === null) _clockNow = new Date()
  cb()
  const t = setInterval(() => {
    _clockNow = new Date()
    cb()
  }, 1000)
  return () => clearInterval(t)
}
function getClockSnapshot() {
  return _clockNow
}
function getClockServerSnapshot() {
  return null
}
function LoveTimer() {
  const now = useSyncExternalStore(subscribeClock, getClockSnapshot, getClockServerSnapshot)
  if (!now) return <div className="h-[64px]" aria-hidden />
  const start = new Date(LOVE_START_DATE)
  let diff = Math.max(0, now.getTime() - start.getTime()) / 1000
  const days = Math.floor(diff / 86400); diff -= days * 86400
  const hours = Math.floor(diff / 3600); diff -= hours * 3600
  const mins = Math.floor(diff / 60); diff -= mins * 60
  const secs = Math.floor(diff)
  const units = [
    { v: days, label: 'Days' },
    { v: hours, label: 'Hours' },
    { v: mins, label: 'Minutes' },
    { v: secs, label: 'Seconds' },
  ]
  return (
    <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-5">
      {units.map((u, i) => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="flex items-baseline gap-0.5 overflow-hidden">
            <span
              key={u.v}
              className="lana-gradient-text text-4xl font-extrabold tabular-nums sm:text-5xl"
              style={{ animation: 'lana-tick 0.4s ease-out' }}
            >
              {String(u.v).padStart(2, '0')}
            </span>
          </div>
          <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-400 sm:text-xs">
            {u.label}
          </span>
          {i < units.length - 1 && (
            <span className="sr-only">, </span>
          )}
        </div>
      ))}
    </div>
  )
}

/* Typewriter — reveals text char-by-char when in view */
function Typewriter({ text, className = '', replayKey = 0 }: { text: string; className?: string; replayKey?: number }) {
  const [shown, setShown] = useState('')
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  // type out the text; re-runs whenever replayKey changes (for replay button)
  useEffect(() => {
    if (!started) return
    setShown('')
    let i = 0
    const speed = 32 // ms per char
    const t = setInterval(() => {
      i++
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(t)
    }, speed)
    return () => clearInterval(t)
  }, [started, text, replayKey])
  const done = shown.length >= text.length
  return (
    <div ref={ref} className={`lana-cursor whitespace-pre-line ${className}`}>
      {shown}
    </div>
  )
}

/* Click-to-spawn hearts — global click handler spawns hearts at cursor */
function ClickHearts() {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; hearts: { char: string; cx: number; cy: number; cr: number; size: number; delay: number }[] }[]>([])
  useEffect(() => {
    let nextId = 0
    const chars = ['💕', '💖', '💗', '💝', '🌸', '✨']
    const onClick = (e: MouseEvent) => {
      // ignore clicks on interactive controls (buttons, links, inputs)
      const t = e.target as HTMLElement
      if (t.closest('button, a, input, textarea, select, [role="dialog"]')) return
      const id = nextId++
      const hearts = Array.from({ length: 5 }).map(() => ({
        char: chars[Math.floor(Math.random() * chars.length)],
        cx: (Math.random() - 0.5) * 120,
        cy: -80 - Math.random() * 90,
        cr: (Math.random() - 0.5) * 80,
        size: 16 + Math.random() * 18,
        delay: Math.random() * 0.1,
      }))
      setBursts((b) => [...b.slice(-8), { id, x: e.clientX, y: e.clientY, hearts }])
      setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 1100)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
      {bursts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          {b.hearts.map((h, i) => (
            <span
              key={i}
              className="absolute"
              style={{
                fontSize: `${h.size}px`,
                // @ts-expect-error custom props
                '--cx': `${h.cx}px`,
                '--cy': `${h.cy}px`,
                '--cr': `${h.cr}deg`,
                animation: `lana-click-heart 1s ease-out ${h.delay}s forwards`,
              }}
            >
              {h.char}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

/* Music toggle — plays our song, loops, half volume */
function MusicToggle() {
  const [on, setOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)

  // create the audio element once (lazy, on first use)
  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio('/audio/song.mp3')
      a.loop = true
      a.volume = 0.03
      a.preload = 'auto'
      audioRef.current = a
    }
    return audioRef.current
  }, [])

  const clearFade = useCallback(() => {
    if (fadeRef.current !== null) {
      clearInterval(fadeRef.current)
      fadeRef.current = null
    }
  }, [])

  // start playback — returns true if successfully started
  const start = useCallback(() => {
    try {
      const a = getAudio()
      // only reset to beginning if it was paused
      if (a.paused) {
        a.currentTime = 0
      }
      a.volume = 0
      const playPromise = a.play()
      if (playPromise) {
        playPromise.then(() => {
          // success — soft fade-in
          clearFade()
          let v = 0
          const target = 0.03
          fadeRef.current = window.setInterval(() => {
            v = Math.min(target, v + target / 20)
            a.volume = v
            if (v >= target) clearFade()
          }, 50)
        }).catch(() => {
          // play() rejected — don't set on=true
        })
      }
    } catch {
      // audio not available
    }
  }, [getAudio, clearFade])

  const stop = useCallback(() => {
    const a = audioRef.current
    if (a && !a.paused) {
      try {
        const startVol = a.volume || 0.03
        clearFade()
        let v = startVol
        fadeRef.current = window.setInterval(() => {
          v = Math.max(0, v - startVol / 10)
          a.volume = v
          if (v <= 0) {
            clearFade()
            a.pause()
          }
        }, 40)
      } catch {
        a.pause()
      }
    }
  }, [clearFade])

  const toggle = useCallback(() => {
    if (on) {
      stop()
      setOn(false)
    } else {
      start()
      setOn(true)
    }
  }, [on, start, stop])

  useEffect(() => () => {
    clearFade()
    audioRef.current?.pause()
    audioRef.current = null
  }, [clearFade])

  // Autoplay on first user interaction (browsers block sound before that)
  useEffect(() => {
    let started = false
    const tryStart = () => {
      if (started) return
      started = true
      start()
      setOn(true)
      window.removeEventListener('click', tryStart)
      window.removeEventListener('scroll', tryStart)
      window.removeEventListener('keydown', tryStart)
      window.removeEventListener('touchstart', tryStart)
    }
    window.addEventListener('click', tryStart, { passive: true })
    window.addEventListener('scroll', tryStart, { passive: true })
    window.addEventListener('keydown', tryStart, { passive: true })
    window.addEventListener('touchstart', tryStart, { passive: true })
    return () => {
      window.removeEventListener('click', tryStart)
      window.removeEventListener('scroll', tryStart)
      window.removeEventListener('keydown', tryStart)
      window.removeEventListener('touchstart', tryStart)
    }
  }, [start])

  return (
    <button
      onClick={toggle}
      aria-label={on ? 'Pause our song' : 'Play our song'}
      aria-pressed={on}
      className="group fixed bottom-6 left-6 z-50 flex h-12 items-center gap-2 rounded-full border border-rose-200/60 bg-white/85 px-4 shadow-lg shadow-rose-200/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
    >
      <span className="text-xl" style={on ? { animation: 'lana-note-bounce 1s ease-in-out infinite' } : undefined}>
        {on ? '🎵' : '🎶'}
      </span>
      {/* equalizer bars when playing */}
      <span className="flex h-4 items-end gap-0.5" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-pink-500 to-rose-400"
            style={
              on
                ? { height: '4px', animation: `lana-eq 0.9s ease-in-out ${i * 0.15}s infinite` }
                : { height: '4px', opacity: 0.4 }
            }
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-rose-500">{on ? 'On' : 'Our song'}</span>
    </button>
  )
}

/* Wave divider — decorative SVG between sections */
function WaveDivider({ flip = false, color = '#ffe9f1' }: { flip?: boolean; color?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none relative z-10 w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="h-[40px] w-full sm:h-[60px]"
      >
        <path
          d="M0,32 C240,72 480,8 720,32 C960,56 1200,72 1440,32 L1440,80 L0,80 Z"
          fill={color}
        />
        {/* tiny hearts dotted along the wave */}
        <text x="120" y="44" fontSize="13" fill="#ff69b4" opacity="0.5">♥</text>
        <text x="420" y="34" fontSize="10" fill="#ff1493" opacity="0.4">♥</text>
        <text x="760" y="46" fontSize="14" fill="#ff69b4" opacity="0.5">♥</text>
        <text x="1080" y="36" fontSize="11" fill="#e75480" opacity="0.45">♥</text>
        <text x="1340" y="44" fontSize="12" fill="#ff69b4" opacity="0.5">♥</text>
      </svg>
    </div>
  )
}

/* TiltCard — 3D mouse-tracking tilt wrapper */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`
  }, [])
  const onLeave = useCallback(() => {
    const el = ref.current
    if (el) el.style.transform = 'perspective(800px) rotateY(0) rotateX(0)'
  }, [])
  return (
    <div
      ref={ref}
      className={`lana-tilt ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 3 COMPONENTS — confetti, secret message, toast, share, theme
   ════════════════════════════════════════════════════════════════ */

/* Confetti — burst of colorful pieces from a position.
   Pieces are derived (via useMemo) from the `burst` prop; the parent
   clears `burst` after the animation to unmount. No internal state. */
function Confetti({ burst }: { burst: { id: number; x: number; y: number } | null }) {
  const pieces = useMemo(() => {
    if (!burst) return []
    const colors = ['#ff1493', '#ff69b4', '#ffb6c1', '#e75480', '#ffc0cb', '#ff85a2', '#ffd1dc']
    const count = 48
    return Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const dist = 120 + Math.random() * 260
      return {
        id: i,
        x: burst.x,
        y: burst.y,
        cfx: Math.cos(angle) * dist,
        cfy: Math.sin(angle) * dist + 200 + Math.random() * 200,
        cfr: (Math.random() - 0.5) * 1440,
        size: 7 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.08,
        dur: 1.6 + Math.random() * 1.4,
        round: Math.random() > 0.5,
      }
    })
  }, [burst])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[78] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 left-0 will-change-transform"
          style={{
            width: `${p.size}px`,
            height: `${p.round ? p.size : p.size * 0.5}px`,
            background: p.color,
            borderRadius: p.round ? '50%' : '2px',
            transform: `translate(${p.x}px, ${p.y}px)`,
            // @ts-expect-error custom props
            '--cfx': `${p.cfx}px`,
            '--cfy': `${p.cfy}px`,
            '--cfr': `${p.cfr}deg`,
            animation: `lana-confetti ${p.dur}s cubic-bezier(0.2, 0.6, 0.4, 1) ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}

/* SecretMessage — modal revealed after N clicks on footer heart */
function SecretMessage({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])
  if (!open) return null
  return (
    <div
      className="lana-lightbox-overlay fixed inset-0 z-[85] flex items-center justify-center bg-rose-950/70 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="A secret message"
    >
      <div
        className="lana-secret-modal relative w-full max-w-md overflow-hidden rounded-[1.8rem] border border-rose-300/40 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-8 text-center shadow-2xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* sparkle decorations */}
        <span aria-hidden className="absolute right-6 top-6 text-xl" style={{ animation: 'lana-twinkle 1.6s ease-in-out infinite' }}>✨</span>
        <span aria-hidden className="absolute left-6 bottom-6 text-lg" style={{ animation: 'lana-twinkle 1.8s ease-in-out 0.3s infinite' }}>✨</span>
        <div className="mb-4 text-4xl" style={{ animation: 'lana-beat 1.4s ease-in-out infinite', display: 'inline-block' }}>💝</div>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-rose-400">You found it</p>
        <p className="whitespace-pre-line text-base font-medium leading-relaxed text-rose-800 sm:text-lg">
          {SECRET_MESSAGE}
        </p>
        <button
          onClick={onClose}
          className="mt-7 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-7 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-300/50 transition-transform hover:scale-105 active:scale-95"
        >
          Close with a smile 💕
        </button>
      </div>
    </div>
  )
}

/* Toast — small auto-dismissing notification */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      aria-live="polite"
      className={`fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 ${visible ? '' : 'pointer-events-none'}`}
      style={{ animation: visible ? 'lana-toast-in 0.35s ease-out' : 'lana-toast-out 0.3s ease-out forwards' }}
    >
      <div className="flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/95 px-5 py-2.5 text-sm font-semibold text-rose-600 shadow-xl shadow-rose-200/60 backdrop-blur">
        <span>✅</span> {message}
      </div>
    </div>
  )
}

/* ShareButton — copies link or uses native share API */
function ShareButton({ onToast }: { onToast: (msg: string) => void }) {
  const handleShare = useCallback(async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shareData = { title: 'From Vadik for Lana 💕', text: 'A little place for our memories', url }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
    try {
      await navigator.clipboard.writeText(url)
      onToast('Link copied to clipboard 💕')
    } catch {
      // final fallback: select-and-copy via a temp input
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy'); onToast('Link copied to clipboard 💕') } catch { onToast('Could not copy — copy from the address bar') }
      document.body.removeChild(ta)
    }
  }, [onToast])
  return (
    <button
      onClick={handleShare}
      aria-label="Share this page"
      className="fixed bottom-6 right-20 z-50 flex h-12 items-center gap-2 rounded-full border border-rose-200/60 bg-white/85 px-4 shadow-lg shadow-rose-200/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
    >
      <span className="text-xl" style={{ animation: 'lana-share-pulse 2.4s ease-in-out infinite' }}>📤</span>
      <span className="hidden text-xs font-semibold text-rose-500 sm:inline">Share</span>
    </button>
  )
}

/* ThemeToggle — cycles Day (rosé light) → Night (deep rose dark).
   Uses useSyncExternalStore to read/write localStorage without a
   setState-in-effect lint violation and without hydration mismatch. */
const THEME_KEY = 'lana-theme'
type Theme = 'day' | 'night'
const _themeListeners = new Set<() => void>()
let _themeCache: Theme = 'day'
function _readTheme(): Theme {
  if (typeof window === 'undefined') return 'day'
  const saved = window.localStorage.getItem(THEME_KEY)
  return saved === 'night' || saved === 'day' ? saved : 'day'
}
function subscribeTheme(cb: () => void) {
  // initialize cache on first client subscribe + apply html class
  if (typeof window !== 'undefined' && _themeCache === 'day' && _readTheme() !== 'day') {
    _themeCache = _readTheme()
    if (_themeCache === 'night') document.documentElement.classList.add('dark')
    cb() // notify React of the snapshot change
  }
  _themeListeners.add(cb)
  return () => {
    _themeListeners.delete(cb)
  }
}
function getThemeSnapshot() {
  return _themeCache
}
function getThemeServerSnapshot(): Theme {
  return 'day'
}
function setThemeValue(next: Theme) {
  _themeCache = next
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(THEME_KEY, next) } catch { /* ignore */ }
    const root = document.documentElement
    if (next === 'night') root.classList.add('dark')
    else root.classList.remove('dark')
  }
  _themeListeners.forEach((cb) => cb())
}
function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot)
  const isNight = theme === 'night'
  const toggle = useCallback(() => {
    setThemeValue(isNight ? 'day' : 'night')
  }, [isNight])
  return (
    <button
      onClick={toggle}
      aria-label={isNight ? 'Switch to day theme' : 'Switch to night theme'}
      aria-pressed={isNight}
      className="group fixed top-4 right-4 z-[52] flex h-10 items-center gap-2 rounded-full border border-rose-200/60 bg-white/85 px-3 shadow-lg shadow-rose-200/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95"
    >
      <span className="relative flex h-5 w-9 items-center rounded-full bg-gradient-to-r from-rose-200 to-pink-200">
        <span
          className="lana-theme-knob absolute left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[0.5rem] shadow"
          style={{ transform: isNight ? 'translateX(16px)' : 'translateX(0)' }}
        >
          {isNight ? '🌙' : '☀️'}
        </span>
      </span>
      <span className="hidden text-xs font-semibold text-rose-500 sm:inline">{isNight ? 'Night' : 'Day'}</span>
    </button>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 4 COMPONENTS — love notes, help overlay, parallax, favorites
   ════════════════════════════════════════════════════════════════ */

/* useLocalStorage — persistent state hook with cross-tab sync.
   Uses useSyncExternalStore with a CACHED parsed snapshot to avoid
   hydration mismatch AND the infinite-loop "getSnapshot should be
   cached" error (JSON.parse returns a new object each call). */
const _lsCache = new Map<string, unknown>()
function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  // Lazily initialize the cache entry. Called by both subscribe and
  // getSnapshot so that getSnapshot NEVER returns undefined (which
  // would crash components accessing .length / .includes on the value).
  const ensureCache = useCallback(() => {
    if (!_lsCache.has(key)) {
      try {
        const raw = window.localStorage.getItem(key)
        _lsCache.set(key, raw ? JSON.parse(raw) : initial)
      } catch {
        _lsCache.set(key, initial)
      }
    }
  }, [key, initial])
  const subscribe = useCallback((cb: () => void) => {
    ensureCache()
    const handler = () => {
      try {
        const raw = window.localStorage.getItem(key)
        _lsCache.set(key, raw ? JSON.parse(raw) : initial)
      } catch {
        _lsCache.set(key, initial)
      }
      cb()
    }
    window.addEventListener('storage', handler)
    window.addEventListener('lana-local-' + key, handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('lana-local-' + key, handler)
    }
  }, [key, initial, ensureCache])
  const getSnapshot = useCallback(() => {
    ensureCache()
    return _lsCache.get(key) as T
  }, [key, ensureCache])
  const getServerSnapshot = useCallback(() => initial, [initial])
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const setValue = useCallback((v: T | ((prev: T) => T)) => {
    try {
      ensureCache()
      const current = _lsCache.get(key) as T
      const next = typeof v === 'function' ? (v as (p: T) => T)(current) : v
      window.localStorage.setItem(key, JSON.stringify(next))
      _lsCache.set(key, next)
      window.dispatchEvent(new Event('lana-local-' + key))
    } catch {
      /* ignore quota / private mode errors */
    }
  }, [key, ensureCache])
  return [value, setValue]
}

type LoveNote = { id: string; text: string; author: string; ts: number }

/* LoveNotes — visitors can leave sweet messages (persisted to localStorage).
   Displayed as sticky-note cards with rotation variants. */
function LoveNotes() {
  const [notes, setNotes] = useLocalStorage<LoveNote[]>('lana-love-notes', [])
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const charLimit = 220

  const addNote = useCallback(() => {
    const t = text.trim()
    if (!t) return
    const note: LoveNote = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      text: t.slice(0, charLimit),
      author: author.trim().slice(0, 30) || 'Anonymous 💕',
      ts: Date.now(),
    }
    setNotes((prev) => [note, ...prev].slice(0, 50))
    setText('')
    setAuthor('')
  }, [text, author, setNotes])

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [setNotes])

  const clearAll = useCallback(() => {
    if (window.confirm('Clear all love notes? This cannot be undone.')) {
      setNotes([])
    }
  }, [setNotes])

  const rotClasses = ['lana-note-rot-1', 'lana-note-rot-2', 'lana-note-rot-3', 'lana-note-rot-4']
  const noteColors = [
    'from-pink-50 to-rose-100',
    'from-rose-50 to-pink-100',
    'from-fuchsia-50 to-rose-100',
    'from-pink-50 to-fuchsia-100',
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <Reveal className="mb-8 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Love notes
        </p>
        <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
          Leave a little something
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-rose-900/65">
          A sweet word, an inside joke, a memory — write it here. It stays on this device. 💝
        </p>
      </Reveal>

      {/* compose form */}
      <Reveal delay={80} className="mb-10">
        <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-5 shadow-lg shadow-rose-100 backdrop-blur sm:p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, charLimit))}
            placeholder="Write something lovely about Lana (or for her)…"
            rows={3}
            className="lana-note-input w-full resize-none rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-sm text-rose-900 placeholder:text-rose-300"
            aria-label="Your love note"
          />
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value.slice(0, 30))}
              placeholder="Your name (optional)"
              className="lana-note-input w-full rounded-full border border-rose-200 bg-rose-50/50 px-4 py-2 text-sm text-rose-900 placeholder:text-rose-300 sm:max-w-[16rem]"
              aria-label="Your name"
            />
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-rose-400">{text.length}/{charLimit}</span>
              <button
                onClick={addNote}
                disabled={!text.trim()}
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Add note 💕
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* notes grid */}
      {notes.length === 0 ? (
        <Reveal delay={120} className="text-center">
          <div className="mx-auto max-w-md rounded-3xl border border-dashed border-rose-200 bg-white/50 p-10">
            <div className="mb-3 text-4xl" style={{ animation: 'lana-note-pulse 1.6s ease-in-out infinite', display: 'inline-block' }}>💌</div>
            <p className="text-sm font-medium text-rose-400">
              No notes yet — be the first to leave a little love.
            </p>
          </div>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((n, i) => (
            <div
              key={n.id}
              className={`lana-note-card group relative break-inside-avoid rounded-2xl bg-gradient-to-br ${noteColors[i % noteColors.length]} p-5 shadow-lg shadow-rose-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-200 ${rotClasses[i % rotClasses.length]}`}
            >
              <button
                onClick={() => deleteNote(n.id)}
                aria-label="Delete note"
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-rose-400 opacity-0 transition-opacity hover:bg-white hover:text-rose-600 group-hover:opacity-100"
              >
                ✕
              </button>
              <p className="mb-3 whitespace-pre-line break-words pr-5 text-sm font-medium leading-relaxed text-rose-900/85">
                {n.text}
              </p>
              <div className="flex items-center justify-between border-t border-rose-200/40 pt-2">
                <span className="text-xs font-bold text-rose-500">— {n.author}</span>
                <span className="text-[0.65rem] text-rose-400/70">
                  {new Date(n.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={clearAll}
            className="text-xs font-medium text-rose-400 underline decoration-rose-300 underline-offset-4 transition-colors hover:text-rose-600"
          >
            Clear all notes
          </button>
        </div>
      )}
    </div>
  )
}

/* HelpOverlay — press ? to show keyboard shortcuts */
function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  const shortcuts = [
    { keys: ['?'], desc: 'Open / close this help' },
    { keys: ['Esc'], desc: 'Close any open dialog / lightbox' },
    { keys: ['←'], desc: 'Previous photo (in lightbox)' },
    { keys: ['→'], desc: 'Next photo (in lightbox)' },
    { keys: ['Space'], desc: 'Play / pause slideshow (in lightbox)' },
    { keys: ['G'], desc: 'Go to gallery' },
    { keys: ['D'], desc: 'Go to daily section' },
    { keys: ['O'], desc: 'Go to more love section' },
    { keys: ['A'], desc: 'Go to adventures section' },
    { keys: ['Y'], desc: 'Go to story section' },
    { keys: ['P'], desc: 'Go to play section' },
    { keys: ['R'], desc: 'Go to promises section' },
    { keys: ['H'], desc: 'Back to top (home)' },
    { keys: ['M'], desc: 'Toggle ambient music' },
    { keys: ['S'], desc: 'Share this page' },
  ]
  return (
    <div
      className="lana-help-overlay fixed inset-0 z-[90] flex items-center justify-center bg-rose-950/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
    >
      <div
        className="lana-secret-modal w-full max-w-md rounded-3xl border border-rose-200/60 bg-white p-7 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-rose-700">
            <span>⌨️</span> Keyboard shortcuts
          </h3>
          <button
            onClick={onClose}
            aria-label="Close help"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-500 transition-colors hover:bg-rose-200"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2.5">
          {shortcuts.map((s) => (
            <li key={s.keys[0]} className="flex items-center justify-between gap-3">
              <span className="text-sm text-rose-900/75">{s.desc}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd key={k} className="lana-keycap">{k}</kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs text-rose-400">Press <kbd className="lana-keycap">Esc</kbd> or click anywhere to close</p>
      </div>
    </div>
  )
}

/* ParallaxBlobs — wraps the decorative blobs and applies mouse-based parallax */
function ParallaxBlobs({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2 // -1..1
        const y = (e.clientY / window.innerHeight - 0.5) * 2
        el.style.setProperty('--px', `${x}`)
        el.style.setProperty('--py', `${y}`)
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])
  return <div ref={ref} className="lana-parallax contents">{children}</div>
}

/* FavoritesButton — a star toggle on gallery photos, persisted to localStorage */
function FavoritesButton({ photoUrl, onToast }: { photoUrl: string; onToast: (m: string) => void }) {
  const [favorites, setFavorites] = useLocalStorage<string[]>('lana-favorites', [])
  const isFav = favorites.includes(photoUrl)
  const [popping, setPopping] = useState(false)
  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setFavorites((prev) =>
      prev.includes(photoUrl) ? prev.filter((u) => u !== photoUrl) : [...prev, photoUrl]
    )
    setPopping(true)
    setTimeout(() => setPopping(false), 400)
    onToast(isFav ? 'Removed from favorites' : 'Added to favorites ⭐')
  }, [photoUrl, isFav, setFavorites, onToast])
  return (
    <button
      onClick={toggle}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFav}
      className="absolute left-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-lg shadow-md backdrop-blur transition-all hover:scale-110 active:scale-90"
      style={popping ? { animation: 'lana-star-pop 0.4s ease-out' } : undefined}
    >
      <span style={{ filter: isFav ? 'none' : 'grayscale(1) opacity(0.5)' }}>⭐</span>
    </button>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 5 COMPONENTS — countdown, mood, timeline, favorites gallery,
   notes export/import, print button
   ════════════════════════════════════════════════════════════════ */

/* Countdown — counts down to COUNTDOWN_DATE (or up if past).
   Reuses the cached clock store from LoveTimer to avoid a second
   interval and hydration mismatch. */
function Countdown() {
  const target = new Date(COUNTDOWN_DATE + 'T00:00:00')
  const now = useSyncExternalStore(subscribeClock, getClockSnapshot, getClockServerSnapshot)
  if (!now) return <div className="h-[60px]" aria-hidden />
  const diff = target.getTime() - now.getTime()
  const isPast = diff < 0
  const abs = Math.abs(diff) / 1000
  const days = Math.floor(abs / 86400)
  const hours = Math.floor((abs % 86400) / 3600)
  const mins = Math.floor((abs % 3600) / 60)
  const secs = Math.floor(abs % 60)
  const units = [
    { v: days, label: 'Days' },
    { v: hours, label: 'Hours' },
    { v: mins, label: 'Minutes' },
    { v: secs, label: 'Seconds' },
  ]
  return (
    <div className="rounded-3xl border border-rose-200/60 bg-white/70 p-5 shadow-lg shadow-rose-100 backdrop-blur sm:p-6">
      <p className="mb-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-rose-400 sm:text-xs">
        {isPast ? `${COUNTDOWN_LABEL.replace('Until', 'Since').replace('next', 'last')}` : COUNTDOWN_LABEL}
      </p>
      <div className="flex flex-wrap items-end justify-center gap-2 sm:gap-4">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center">
            <span
              key={u.v}
              className="lana-countdown-digit lana-gradient-text text-3xl font-extrabold tabular-nums sm:text-4xl"
            >
              {String(u.v).padStart(2, '0')}
            </span>
            <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-rose-400 sm:text-[0.65rem]">
              {u.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs font-medium text-rose-500">
        {isPast ? '🎉 Another trip around the sun together!' : '📅 ' + new Date(COUNTDOWN_DATE).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  )
}

/* MoodSelector — cycles accent color, persisted to localStorage */
const MOOD_KEY = 'lana-mood'
const _moodCache = { current: 'rose' }
const _moodListeners = new Set<() => void>()
function subscribeMood(cb: () => void) {
  if (typeof window !== 'undefined') {
    const saved = window.localStorage.getItem(MOOD_KEY)
    if (saved && MOODS.some((m) => m.id === saved)) {
      _moodCache.current = saved
      applyMood(saved)
    }
  }
  _moodListeners.add(cb)
  return () => _moodListeners.delete(cb)
}
function getMoodSnapshot() { return _moodCache.current }
function getMoodServerSnapshot() { return 'rose' }
function applyMood(id: string) {
  if (typeof document === 'undefined') return
  const mood = MOODS.find((m) => m.id === id) ?? MOODS[0]
  document.documentElement.style.setProperty('--lana-accent', mood.accent)
  document.documentElement.style.setProperty('--lana-accent-soft', mood.accentSoft)
}
function setMoodValue(id: string) {
  _moodCache.current = id
  applyMood(id)
  try { window.localStorage.setItem(MOOD_KEY, id) } catch { /* ignore */ }
  _moodListeners.forEach((cb) => cb())
}
function MoodSelector() {
  const mood = useSyncExternalStore(subscribeMood, getMoodSnapshot, getMoodServerSnapshot)
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="mr-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">Mood</span>
      {MOODS.map((m) => (
        <button
          key={m.id}
          onClick={() => setMoodValue(m.id)}
          aria-label={`Set mood to ${m.label}`}
          aria-pressed={mood === m.id}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all hover:scale-105 ${
            mood === m.id
              ? 'border-transparent text-white shadow-md'
              : 'border-rose-200 bg-white/70 text-rose-500 hover:bg-white'
          }`}
          style={mood === m.id ? { background: m.accent, animation: 'lana-mood-glow 2s ease-in-out infinite' } : undefined}
        >
          <span className="text-sm">{m.emoji}</span>
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  )
}

/* MemoriesTimeline — vertical timeline of dated milestones */
function MemoriesTimeline() {
  return (
    <div className="mx-auto max-w-3xl">
      <Reveal className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          What's ahead of us
        </p>
        <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
          What we still get to do
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-rose-900/65">
          No dates, no rush — just the good stuff waiting for us.
        </p>
      </Reveal>
      <div className="relative">
        {/* vertical line */}
        <div
          aria-hidden
          className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-pink-300 via-rose-400 to-pink-300 sm:left-1/2 sm:-translate-x-1/2"
          style={{ height: '100%', animation: 'lana-line-draw 1.5s ease-out' }}
        />
        <div className="space-y-8">
          {MEMORIES.map((mem, i) => {
            const isLeft = i % 2 === 0
            return (
              <Reveal key={mem.title + i} delay={i * 60}>
                <div className={`relative flex items-start gap-6 sm:gap-0 ${isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}>
                  {/* node */}
                  <div className="lana-timeline-node absolute left-4 top-2 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-pink-500 to-rose-500 text-sm shadow-lg sm:left-1/2">
                    <span>{mem.emoji}</span>
                  </div>
                  {/* card */}
                  <div className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] ${isLeft ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'}`}>
                    <div className="lana-timeline-card rounded-2xl border border-rose-100 bg-white/85 p-5 shadow-md shadow-rose-100 backdrop-blur">
                      <span className="mb-1 block text-xs font-bold uppercase tracking-[0.15em] text-rose-400">
                        Still to come
                      </span>
                      <h3 className="mb-1.5 text-lg font-bold text-rose-700">{mem.title}</h3>
                      <p className="text-sm leading-relaxed text-rose-900/70">{mem.text}</p>
                    </div>
                  </div>
                  {/* spacer for the other side */}
                  <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* NotesExportImport — download/upload love notes as JSON */
function NotesExportImport({ notes }: { notes: LoveNote[] }) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lana-love-notes-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [notes])
  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result)) as LoveNote[]
        if (!Array.isArray(imported)) throw new Error('not an array')
        // validate + merge into localStorage
        const valid = imported
          .filter((n) => n && typeof n.text === 'string' && typeof n.id === 'string')
          .map((n) => ({
            id: n.id,
            text: String(n.text).slice(0, 220),
            author: typeof n.author === 'string' ? n.author.slice(0, 30) : 'Imported 💕',
            ts: typeof n.ts === 'number' ? n.ts : Date.now(),
          }))
        try {
          window.localStorage.setItem('lana-love-notes', JSON.stringify(valid))
          window.dispatchEvent(new Event('lana-local-lana-love-notes'))
          window.alert(`Imported ${valid.length} note${valid.length === 1 ? '' : 's'}! 💕`)
        } catch {
          window.alert('Could not save imported notes (storage full?)')
        }
      } catch {
        window.alert('That file does not look like a valid love-notes export.')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // reset so the same file can be re-imported
  }, [])
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <button
        onClick={handleExport}
        disabled={notes.length === 0}
        className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-semibold text-rose-500 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        ⬇️ Export
      </button>
      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-xs font-semibold text-rose-500 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white"
      >
        ⬆️ Import
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        onChange={handleImport}
        className="hidden"
        aria-label="Import love notes from JSON"
      />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 6 COMPONENTS — daily affirmation, love calculator, song of
   the day
   ════════════════════════════════════════════════════════════════ */

/* Helper: deterministic day-of-year index for rotating content */
function getDayIndex(length: number): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return length > 0 ? day % length : 0
}

/* DailyAffirmation — a romantic line that rotates by day-of-year */
function DailyAffirmation() {
  const idx = getDayIndex(AFFIRMATIONS.length)
  const text = AFFIRMATIONS[idx]
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
  return (
    <div className="lana-affirm-card relative overflow-hidden rounded-3xl border border-rose-200/50 bg-white/80 p-7 text-center shadow-lg backdrop-blur sm:p-9">
      {/* decorative quote mark */}
      <span aria-hidden className="absolute left-4 top-2 text-6xl font-serif text-rose-200/40 select-none">“</span>
      <span aria-hidden className="absolute bottom-0 right-4 text-6xl font-serif text-rose-200/40 select-none">”</span>
      <span className="lana-daily-badge mb-4 inline-flex items-center gap-1.5 rounded-full px-4 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white shadow-sm">
        ✨ Affirmation of the day
      </span>
      <p className="relative mx-auto max-w-xl text-xl font-semibold leading-relaxed text-rose-700 sm:text-2xl">
        {text}
      </p>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.2em] text-rose-400">{today}</p>
    </div>
  )
}

/* LoveCalculator — playful: type two names → animated love percentage */
function LoveCalculator() {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [result, setResult] = useState<number | null>(null)
  const [calculating, setCalculating] = useState(false)

  const calculate = useCallback(() => {
    const a = name1.trim().toLowerCase()
    const b = name2.trim().toLowerCase()
    if (!a || !b) return
    setCalculating(true)
    setResult(null)
    // The two of us always match — Vadim/Vadik + Lana = a perfect fit.
    const usNames = ['vadim', 'vadik']
    const isUs =
      (usNames.includes(a) && b === 'lana') ||
      (usNames.includes(b) && a === 'lana')
    let pct: number
    if (isUs) {
      pct = 100
    } else {
      // deterministic pseudo-random based on names so it's stable per pair
      const str = a + b
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
      }
      pct = 38 + (Math.abs(hash) % 38) // 38–75% for anyone else
    }
    // simulate a dramatic calculation
    setTimeout(() => {
      setResult(pct)
      setCalculating(false)
    }, 1400)
  }, [name1, name2])

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-7 shadow-lg shadow-rose-100 backdrop-blur sm:p-9">
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl" style={{ animation: 'lana-beat 1.4s ease-in-out infinite', display: 'inline-block' }}>💑</div>
          <h3 className="text-2xl font-extrabold text-rose-600">Love Calculator</h3>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
          <input
            value={name1}
            onChange={(e) => setName1(e.target.value.slice(0, 20))}
            placeholder="Your name"
            className="lana-note-input w-full rounded-full border border-rose-200 bg-rose-50/50 px-5 py-3 text-center text-sm font-medium text-rose-900 placeholder:text-rose-300"
            aria-label="First name"
          />
          <span className="text-2xl text-rose-300">💕</span>
          <input
            value={name2}
            onChange={(e) => setName2(e.target.value.slice(0, 20))}
            placeholder="Their name"
            className="lana-note-input w-full rounded-full border border-rose-200 bg-rose-50/50 px-5 py-3 text-center text-sm font-medium text-rose-900 placeholder:text-rose-300"
            aria-label="Second name"
          />
        </div>
        <button
          onClick={calculate}
          disabled={!name1.trim() || !name2.trim() || calculating}
          className="mt-5 w-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-200 transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {calculating ? 'Calculating… 💫' : 'Calculate our love 💕'}
        </button>
        {/* result */}
        {result !== null && (
          <div className="mt-6 text-center">
            <div className="lana-heart-pop mb-2 text-5xl">💗</div>
            <div className="lana-gradient-text text-6xl font-extrabold tabular-nums">{result}%</div>
            {/* meter bar */}
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-rose-100">
              <div
                className="lana-meter-fill lana-accent-bar h-full rounded-full"
                style={{ width: `${result}%` }}
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-rose-500">
              {result === 100 ? 'Us. Always us. The only 100% there is. 💕' : result >= 70 ? 'Pretty good odds, if you ask me. 💫' : result >= 50 ? 'Decent chance. Could work. 🤝' : 'Hmm. Maybe just be friends? 🧲'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* SongOfTheDay — a featured song card that rotates by day-of-year */
function SongOfTheDay() {
  // Always feature "House Tour" by Sabrina Carpenter — our song.
  const song = SONGS[0]
  return (
    <div className="mx-auto max-w-md">
      <div className="relative overflow-hidden rounded-3xl border border-rose-200/60 bg-gradient-to-br from-white via-rose-50 to-pink-50 p-6 shadow-lg shadow-rose-100 backdrop-blur">
        <div className="flex items-center gap-4">
          {/* spinning vinyl */}
          <div className="lana-vinyl relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-800 to-rose-950 shadow-lg">
            <div className="absolute inset-2 rounded-full border border-rose-400/20" />
            <div className="absolute inset-4 rounded-full border border-rose-400/20" />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-lg shadow-inner">
              {song.emoji}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <span className="lana-daily-badge mb-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white">
              🎧 Sabrina Carapetik's song
            </span>
            <h3 className="truncate text-lg font-bold text-rose-700">{song.title}</h3>
            <p className="truncate text-sm text-rose-500">{song.artist}</p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs italic text-rose-400">
          Our song. Play it, think of me. 💕
        </p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 7 COMPONENTS — love letter generator, relationship stats,
   weather-of-our-love widget
   ════════════════════════════════════════════════════════════════ */

/* LoveLetterGenerator — assembles a random letter from fragments */
function LoveLetterGenerator() {
  const [letter, setLetter] = useState<string | null>(null)
  const [seed, setSeed] = useState(0)

  const generate = useCallback(() => {
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
    const text = `${pick(LETTER_OPENINGS)}\n\n${pick(LETTER_BODIES)}\n\n${pick(LETTER_CLOSINGS)}`
    setLetter(text)
    setSeed((s) => s + 1)
  }, [])

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-7 shadow-lg shadow-rose-100 backdrop-blur sm:p-8">
        <div className="mb-5 text-center">
          <div className="mb-2 text-4xl" style={{ animation: 'lana-float 3s ease-in-out infinite', display: 'inline-block' }}>✉️</div>
          <h3 className="text-2xl font-extrabold text-rose-600">Love Letter Generator</h3>
          <p className="mt-1 text-sm text-rose-400">A new little letter, every time you ask.</p>
        </div>
        {letter ? (
          <div key={seed} className="lana-letter-fade lana-paper relative rounded-2xl border border-rose-200/50 p-5 text-sm leading-relaxed text-rose-900/80 sm:text-base">
            <p className="whitespace-pre-line">{letter}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-rose-200 bg-rose-50/40 p-8 text-center">
            <p className="text-sm font-medium text-rose-400">
              Press the button — I will write you something. 💕
            </p>
          </div>
        )}
        <button
          onClick={generate}
          className="lana-accent-btn mt-5 w-full rounded-full px-6 py-3 text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
        >
          {letter ? '✨ Write me another' : '✍️ Write me a letter'}
        </button>
      </div>
    </div>
  )
}

/* RelationshipStats — a playful stats dashboard */
function RelationshipStats() {
  const start = new Date(LOVE_START_DATE)
  const now = new Date()
  const daysTogether = Math.max(0, Math.floor((now.getTime() - start.getTime()) / 86400000))
  const weeksTogether = Math.floor(daysTogether / 7)
  const monthsTogether = Math.floor(daysTogether / 30.44)
  const heartbeatsShared = daysTogether * 100000 // ~100k heartbeats/day
  const sunsetsShared = daysTogether
  const stats = [
    { icon: '📅', value: daysTogether, label: 'Days together', suffix: '' },
    { icon: '🗓️', value: weeksTogether, label: 'Weeks of us', suffix: '' },
    { icon: '🌙', value: monthsTogether, label: 'Moons shared', suffix: '' },
    { icon: '💗', value: heartbeatsShared.toLocaleString(), label: 'Heartbeats (approx)', suffix: '' },
    { icon: '🌅', value: sunsetsShared, label: 'Sunsets seen', suffix: '' },
    { icon: '∞', value: '', label: 'Reasons to love you', suffix: '' },
  ]
  return (
    <div className="mx-auto max-w-2xl">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="lana-stat-card lana-stat-pop rounded-2xl border border-rose-100 bg-white/85 p-4 text-center shadow-sm backdrop-blur"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="mb-1 text-2xl">{s.icon}</div>
            <div className="lana-gradient-text text-2xl font-extrabold tabular-nums sm:text-3xl">
              {s.value || s.icon}
            </div>
            <div className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-rose-400 sm:text-xs">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* WeatherOfOurLove — playful widget, weather is always "love" variants */
function WeatherOfOurLove() {
  // deterministic forecast by day-of-year
  const forecasts = [
    { emoji: '☀️', temp: '100%', cond: 'Sunny with a chance of kisses', anim: 'sun' },
    { emoji: '🌈', temp: '∞', cond: 'Rainbows after every storm', anim: 'none' },
    { emoji: '🌸', temp: '98°F', cond: 'Petal-soft breezes all day', anim: 'none' },
    { emoji: '⭐', temp: '5/5', cond: 'Starlit and calm tonight', anim: 'none' },
    { emoji: '💝', temp: '100%', cond: 'Heavy love, light hearts', anim: 'none' },
    { emoji: '☁️', temp: '72°F', cond: 'Cloudy with soft thoughts of you', anim: 'cloud' },
  ]
  const idx = getDayIndex(forecasts.length)
  const f = forecasts[idx]
  return (
    <div className="mx-auto max-w-md">
      <div className="relative overflow-hidden rounded-3xl border border-rose-200/60 bg-gradient-to-br from-sky-50 via-white to-rose-50 p-6 shadow-lg shadow-rose-100 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <span className="lana-daily-badge inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-white">
            🌤️ Forecast
          </span>
          <span className="text-xs font-medium text-rose-400">Our Loveville</span>
        </div>
        <div className="flex items-center gap-4">
          {/* weather icon with animation */}
          <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center">
            {f.anim === 'sun' && (
              <div aria-hidden className="absolute inset-0" style={{ animation: 'lana-sun-rays 12s linear infinite' }}>
                <div className="absolute left-1/2 top-0 h-3 w-0.5 -translate-x-1/2 bg-amber-400" />
                <div className="absolute right-0 top-1/2 h-0.5 w-3 -translate-y-1/2 bg-amber-400" />
                <div className="absolute left-1/2 bottom-0 h-3 w-0.5 -translate-x-1/2 bg-amber-400" />
                <div className="absolute left-0 top-1/2 h-0.5 w-3 -translate-y-1/2 bg-amber-400" />
                <div className="absolute left-1 top-1 h-2 w-0.5 rotate-45 bg-amber-400" />
                <div className="absolute right-1 top-1 h-2 w-0.5 -rotate-45 bg-amber-400" />
                <div className="absolute left-1 bottom-1 h-2 w-0.5 -rotate-45 bg-amber-400" />
                <div className="absolute right-1 bottom-1 h-2 w-0.5 rotate-45 bg-amber-400" />
              </div>
            )}
            {f.anim === 'cloud' && (
              <div aria-hidden className="lana-cloud-drift absolute inset-0 flex items-center justify-center text-3xl opacity-40">☁️</div>
            )}
            <span className="relative text-5xl">{f.emoji}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="lana-gradient-text text-4xl font-extrabold tabular-nums">{f.temp}</div>
            <p className="mt-1 text-sm font-medium text-rose-700">{f.cond}</p>
          </div>
        </div>
        <p className="mt-4 border-t border-rose-100 pt-3 text-center text-xs italic text-rose-400">
          Forecast: love, with a high of forever. 💕
        </p>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 8 COMPONENTS — bucket list + love languages matcher
   ════════════════════════════════════════════════════════════════ */

/* BucketList — a checkable couple's adventure list (persisted) */
function BucketList({ onToast }: { onToast: (m: string) => void }) {
  const [done, setDone] = useLocalStorage<string[]>('lana-bucket-done', [])
  const toggle = useCallback((id: string) => {
    setDone((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
    const item = BUCKET_LIST.find((b) => b.id === id)
    if (item && !done.includes(id)) {
      onToast(`Checked off: ${item.emoji} ${item.text.slice(0, 30)}…`)
    }
  }, [done, setDone, onToast])
  const completed = done.length
  const total = BUCKET_LIST.length
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  // circle progress (r=40 → circumference ≈ 251.2)
  const circ = 251.2
  const offset = circ - (pct / 100) * circ

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-6 shadow-lg shadow-rose-100 backdrop-blur sm:p-8">
        {/* header with progress ring */}
        <div className="mb-6 flex items-center gap-5">
          <div className="relative h-20 w-20 flex-shrink-0">
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#ffe4ec" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke="var(--lana-accent, #ff1493)" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="lana-gradient-text text-lg font-extrabold tabular-nums">{pct}%</span>
              <span className="text-[0.55rem] font-semibold uppercase tracking-wide text-rose-400">{completed}/{total}</span>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-rose-600">Our Bucket List</h3>
            <p className="mt-0.5 text-sm text-rose-400">
              {completed === 0 ? 'Adventures waiting to happen…' : completed === total ? 'We did it all! 🎉' : `${total - completed} more adventures to go`}
            </p>
          </div>
        </div>
        {/* items */}
        <ul className="space-y-2">
          {BUCKET_LIST.map((item, i) => {
            const isDone = done.includes(item.id)
            return (
              <li
                key={item.id}
                className={`lana-bucket-item lana-lang-card flex cursor-pointer items-center gap-3 rounded-2xl border p-3 ${isDone ? 'lana-bucket-done border-rose-100 bg-rose-50/40' : 'border-rose-100/60 bg-white/60 hover:bg-rose-50/50'}`}
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => toggle(item.id)}
                role="checkbox"
                aria-checked={isDone}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(item.id) } }}
              >
                {/* checkbox */}
                <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border-2 transition-all ${isDone ? 'lana-check-pop border-transparent' : 'border-rose-300'}`} style={isDone ? { background: 'var(--lana-accent, #ff1493)' } : undefined}>
                  {isDone && <span className="text-sm text-white">✓</span>}
                </span>
                <span className="text-xl">{item.emoji}</span>
                <span className="lana-bucket-text flex-1 text-sm font-medium text-rose-900/80">{item.text}</span>
              </li>
            )
          })}
        </ul>
        {completed > 0 && (
          <button
            onClick={() => { if (window.confirm('Reset the bucket list? This clears all checkmarks.')) setDone([]) }}
            className="mt-4 text-xs font-medium text-rose-400 underline decoration-rose-300 underline-offset-4 transition-colors hover:text-rose-600"
          >
            Reset list
          </button>
        )}
      </div>
    </div>
  )
}

/* LoveLanguages — pick your love language, see descriptions */
function LoveLanguages() {
  const [selected, setSelected] = useLocalStorage<string | null>('lana-love-language', null)
  const pick = useCallback((id: string) => {
    setSelected((cur) => (cur === id ? null : id))
  }, [setSelected])
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-6 shadow-lg shadow-rose-100 backdrop-blur sm:p-8">
        <div className="mb-5 text-center">
          <div className="mb-2 text-4xl" style={{ animation: 'lana-beat 1.4s ease-in-out infinite', display: 'inline-block' }}>💞</div>
          <h3 className="text-2xl font-extrabold text-rose-600">Love Languages</h3>
          <p className="mt-1 text-sm text-rose-400">Tap yours — and maybe learn mine.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {LOVE_LANGUAGES.map((lang, i) => {
            const isSel = selected === lang.id
            return (
              <button
                key={lang.id}
                onClick={() => pick(lang.id)}
                aria-pressed={isSel}
                className={`lana-lang-card relative overflow-hidden rounded-2xl border p-4 text-left transition-all ${isSel ? 'lana-lang-selected border-transparent' : 'border-rose-100 bg-white/60 hover:bg-rose-50/60'}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{lang.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-rose-700">{lang.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-rose-900/70">{lang.desc}</p>
                  </div>
                </div>
                {isSel && (
                  <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ background: 'var(--lana-accent, #ff1493)' }}>
                    <span className="text-xs">✓</span>
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {selected && (
          <p className="mt-4 rounded-2xl bg-rose-50/60 p-3 text-center text-xs font-medium text-rose-500" style={{ animation: 'lana-letter-fade 0.4s ease-out' }}>
            💝 Your love language is saved on this device. Mine? All five — for you.
          </p>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 9 COMPONENTS — love coupons + first-date interactive story
   ════════════════════════════════════════════════════════════════ */

/* LoveCoupons — redeemable sweet favours (persisted) */
function LoveCoupons({ onToast }: { onToast: (m: string) => void }) {
  const [redeemed, setRedeemed] = useLocalStorage<string[]>('lana-coupons-redeemed', [])
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null)
  const redeem = useCallback((id: string) => {
    setRedeemed((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
    const coupon = LOVE_COUPONS.find((c) => c.id === id)
    if (coupon && !redeemed.includes(id)) {
      onToast(`Redeemed: ${coupon.emoji} ${coupon.title}`)
      setJustRedeemed(id)
      setTimeout(() => setJustRedeemed(null), 600)
    }
  }, [redeemed, setRedeemed, onToast])
  const redeemedCount = redeemed.length
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 text-center">
        <div className="mb-2 text-4xl" style={{ animation: 'lana-float 3.5s ease-in-out infinite', display: 'inline-block' }}>🎟️</div>
        <h3 className="text-2xl font-extrabold text-rose-600">Love Coupons</h3>
        <p className="mt-1 text-sm text-rose-400">
          Tap to redeem. {redeemedCount > 0 && <span>· {redeemedCount} redeemed so far</span>}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {LOVE_COUPONS.map((coupon, i) => {
          const isRedeemed = redeemed.includes(coupon.id)
          return (
            <button
              key={coupon.id}
              onClick={() => redeem(coupon.id)}
              aria-pressed={isRedeemed}
              className={`lana-coupon lana-coupon-ticket relative overflow-hidden rounded-2xl border-l-4 border border-rose-100 bg-white/80 p-4 text-left shadow-sm backdrop-blur ${isRedeemed ? 'lana-coupon-used' : ''}`}
              style={{ borderLeftColor: 'var(--lana-accent, #ff1493)', animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{coupon.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-rose-700">{coupon.title}</h4>
                  <p className="mt-0.5 text-xs leading-relaxed text-rose-900/60">{coupon.desc}</p>
                </div>
              </div>
              {/* redeemed stamp */}
              {isRedeemed && (
                <span
                  className={`lana-stamp absolute right-3 top-3 rounded-lg border-2 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider ${justRedeemed === coupon.id ? '' : ''}`}
                  style={{ borderColor: 'var(--lana-accent, #ff1493)', color: 'var(--lana-accent, #ff1493)', transform: 'rotate(-12deg)' }}
                >
                  Redeemed
                </span>
              )}
            </button>
          )
        })}
      </div>
      {redeemedCount > 0 && (
        <div className="mt-5 text-center">
          <button
            onClick={() => { if (window.confirm('Reset all coupons? They will be redeemable again.')) setRedeemed([]) }}
            className="text-xs font-medium text-rose-400 underline decoration-rose-300 underline-offset-4 transition-colors hover:text-rose-600"
          >
            Reset coupons
          </button>
        </div>
      )}
    </div>
  )
}

/* FirstDateStory — choose-your-own-path interactive mini story */
function FirstDateStory() {
  const [currentId, setCurrentId] = useState('start')
  const [history, setHistory] = useState<string[]>(['start'])
  const chapter = STORY.find((c) => c.id === currentId) ?? STORY[0]

  const go = useCallback((next: string) => {
    setCurrentId(next)
    setHistory((h) => [...h, next])
  }, [])

  const restart = useCallback(() => {
    setCurrentId('start')
    setHistory(['start'])
  }, [])

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-6 shadow-lg shadow-rose-100 backdrop-blur sm:p-8">
        <div className="mb-5 text-center">
          <div className="mb-2 text-4xl" style={{ animation: 'lana-float 4s ease-in-out infinite', display: 'inline-block' }}>📖</div>
          <h3 className="text-2xl font-extrabold text-rose-600">Our First Date</h3>
          <p className="mt-1 text-sm text-rose-400">A little choose-your-own story. Chapter {history.length}.</p>
        </div>
        {/* chapter card */}
        <div key={currentId} className="lana-chapter-in rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/60 to-pink-50/60 p-5">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-4xl">{chapter.emoji}</span>
            <h4 className="text-lg font-bold text-rose-700">{chapter.title}</h4>
          </div>
          <p className="text-sm leading-relaxed text-rose-900/80">{chapter.text}</p>
        </div>
        {/* choices */}
        {!chapter.ending && chapter.choices && (
          <div className="mt-4 space-y-2">
            {chapter.choices.map((choice) => (
              <button
                key={choice.next}
                onClick={() => go(choice.next)}
                className="lana-choice lana-accent-border flex w-full items-center justify-between gap-2 rounded-full border bg-white/70 px-5 py-3 text-sm font-semibold text-rose-600 shadow-sm backdrop-blur transition-all hover:bg-white"
              >
                <span>{choice.label}</span>
                <span className="text-rose-300">→</span>
              </button>
            ))}
          </div>
        )}
        {/* ending */}
        {chapter.ending && (
          <div className="mt-4 text-center">
            <div className="lana-sparkle mb-2 text-2xl">✨</div>
            <p className="mb-4 text-xs font-medium text-rose-400">The end. Or really — the beginning.</p>
            <button
              onClick={restart}
              className="lana-accent-btn rounded-full px-6 py-2.5 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              ↻ Read it again
            </button>
          </div>
        )}
        {/* progress dots */}
        <div className="mt-5 flex items-center justify-center gap-1.5">
          {history.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === history.length - 1 ? '20px' : '6px',
                background: i === history.length - 1 ? 'var(--lana-accent, #ff1493)' : '#ffd6e6',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 10 COMPONENTS — love fortune cookie + compatibility quiz
   ════════════════════════════════════════════════════════════════ */

/* LoveFortune — tap the cookie to crack it open and reveal a fortune */
function LoveFortune() {
  const [fortune, setFortune] = useState<string | null>(null)
  const [cracking, setCracking] = useState(false)
  const [crackKey, setCrackKey] = useState(0)

  const crack = useCallback(() => {
    setCracking(true)
    setFortune(null)
    setTimeout(() => {
      const next = LOVE_FORTUNES[Math.floor(Math.random() * LOVE_FORTUNES.length)]
      setFortune(next)
      setCracking(false)
      setCrackKey((k) => k + 1)
    }, 600)
  }, [])

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-7 text-center shadow-lg shadow-rose-100 backdrop-blur sm:p-8">
        <div className="mb-5">
          <div className="mb-2 text-4xl" style={{ animation: 'lana-float 3s ease-in-out infinite', display: 'inline-block' }}>🥠</div>
          <h3 className="text-2xl font-extrabold text-rose-600">Love Fortune</h3>
          <p className="mt-1 text-sm text-rose-400">Crack one open. Spoiler: it is us.</p>
        </div>
        {/* cookie */}
        <button
          onClick={crack}
          disabled={cracking}
          aria-label="Crack the fortune cookie"
          className={`lana-cookie-hover mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-6xl shadow-lg transition-all hover:shadow-xl disabled:cursor-wait ${cracking ? 'lana-crack' : ''}`}
        >
          <span>{cracking ? '✨' : '🥠'}</span>
        </button>
        {/* fortune paper */}
        {fortune && (
          <div key={crackKey} className="lana-unroll relative mx-auto max-w-sm rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-md">
            {/* torn paper edges */}
            <div aria-hidden className="absolute -top-1 left-0 right-0 h-2 bg-white/0" style={{ backgroundImage: 'radial-gradient(circle at 4px 0, transparent 4px, #fefce8 4px)', backgroundSize: '8px 8px' }} />
            <p className="relative text-sm font-medium italic leading-relaxed text-rose-800/90">
              “{fortune}”
            </p>
            <p className="mt-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-rose-400">— Lucky numbers: 1, 4, 7, 14, ∞</p>
          </div>
        )}
        {!fortune && !cracking && (
          <p className="text-xs font-medium text-rose-400">Tap the cookie to see what the universe says.</p>
        )}
        {fortune && (
          <button
            onClick={crack}
            className="lana-accent-btn mt-4 rounded-full px-5 py-2 text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            🥠 Crack another
          </button>
        )}
      </div>
    </div>
  )
}

/* CompatibilityQuiz — playful 5-question quiz with a score + result */
function CompatibilityQuiz() {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ_QUESTIONS.length).fill(null))
  const [showResult, setShowResult] = useState(false)

  const select = useCallback((qi: number, oi: number) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[qi] = oi
      return next
    })
  }, [])

  const totalScore = answers.reduce((sum, a, i) => {
    if (a === null) return sum
    return sum + QUIZ_QUESTIONS[i].options[a].score
  }, 0)
  const maxScore = QUIZ_QUESTIONS.reduce((s, q) => s + Math.max(...q.options.map((o) => o.score)), 0)
  const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
  const allAnswered = answers.every((a) => a !== null)
  const answeredCount = answers.filter((a) => a !== null).length

  const resultMsg =
    pct === 100 ? 'Us. Always us. The only 100% there is. 💕' :
    pct >= 70 ? 'Pretty good odds, if you ask me. 💫' :
    pct >= 50 ? 'Decent chance. Could work. 🤝' :
    'Hmm. Maybe just be friends? 🧲'

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-6 shadow-lg shadow-rose-100 backdrop-blur sm:p-8">
        <div className="mb-5 text-center">
          <div className="mb-2 text-4xl" style={{ animation: 'lana-beat 1.4s ease-in-out infinite', display: 'inline-block' }}>💑</div>
          <h3 className="text-2xl font-extrabold text-rose-600">Compatibility Quiz</h3>
          <p className="mt-1 text-sm text-rose-400">{answeredCount}/{QUIZ_QUESTIONS.length} answered</p>
        </div>
        {/* progress bar */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-rose-100">
          <div
            className="lana-accent-bar h-full rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
        {/* questions */}
        <div className="space-y-5">
          {QUIZ_QUESTIONS.map((question, qi) => (
            <div key={qi}>
              <p className="mb-2.5 text-sm font-bold text-rose-700">{qi + 1}. {question.q}</p>
              <div className="space-y-1.5">
                {question.options.map((opt, oi) => {
                  const isSel = answers[qi] === oi
                  return (
                    <button
                      key={oi}
                      onClick={() => select(qi, oi)}
                      className={`lana-quiz-option flex w-full items-center gap-2.5 rounded-xl border bg-white/60 px-4 py-2.5 text-left text-sm text-rose-900/80 ${isSel ? 'lana-quiz-selected lana-quiz-pop' : 'border-rose-100'}`}
                    >
                      <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 text-[0.6rem] font-bold ${isSel ? 'border-transparent text-white' : 'border-rose-300 text-transparent'}`} style={isSel ? { background: 'var(--lana-accent, #ff1493)' } : undefined}>
                        ✓
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        {/* result */}
        {allAnswered && (
          <div className="lana-result-reveal mt-6 rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-5 text-center">
            <div className="mb-1 text-3xl">🎉</div>
            <div className="lana-gradient-text text-4xl font-extrabold tabular-nums">{pct}%</div>
            <p className="mt-2 text-sm font-semibold text-rose-600">{resultMsg}</p>
            <button
              onClick={() => { setAnswers(Array(QUIZ_QUESTIONS.length).fill(null)); setShowResult(false) }}
              className="mt-3 text-xs font-medium text-rose-400 underline decoration-rose-300 underline-offset-4 transition-colors hover:text-rose-600"
            >
              Retake quiz
            </button>
          </div>
        )}
        {!allAnswered && (
          <p className="mt-5 text-center text-xs text-rose-400">Answer all {QUIZ_QUESTIONS.length} to see your score 💕</p>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PHASE 11 COMPONENTS — promise jar + this-or-that game
   ════════════════════════════════════════════════════════════════ */

/* PromiseJar — draw a random promise from the jar, mark as kept */
function PromiseJar({ onToast }: { onToast: (m: string) => void }) {
  const [drawn, setDrawn] = useState<{ id: string; text: string; emoji: string } | null>(null)
  const [kept, setKept] = useLocalStorage<string[]>('lana-promises-kept', [])
  const [drawKey, setDrawKey] = useState(0)

  const draw = useCallback(() => {
    const next = PROMISES[Math.floor(Math.random() * PROMISES.length)]
    setDrawn(next)
    setDrawKey((k) => k + 1)
  }, [])

  const markKept = useCallback(() => {
    if (!drawn) return
    setKept((prev) => (prev.includes(drawn.id) ? prev : [...prev, drawn.id]))
    onToast(`Promise kept: ${drawn.emoji} 💕`)
  }, [drawn, setKept, onToast])

  const keptCount = kept.length

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-7 text-center shadow-lg shadow-rose-100 backdrop-blur sm:p-8">
        <div className="mb-5">
          <div className="mb-2 text-4xl" style={{ animation: 'lana-float 3.5s ease-in-out infinite', display: 'inline-block' }}>🫙</div>
          <h3 className="text-2xl font-extrabold text-rose-600">Promise Jar</h3>
          <p className="mt-1 text-sm text-rose-400">
            Draw a little promise. {keptCount > 0 && <span>· {keptCount} kept so far</span>}
          </p>
        </div>
        {/* jar button */}
        <button
          onClick={draw}
          aria-label="Draw a promise from the jar"
          className="lana-jar-hover mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-pink-200 text-5xl shadow-lg transition-all hover:shadow-xl"
        >
          🫙
        </button>
        {/* drawn promise */}
        {drawn && (
          <div key={drawKey} className="lana-draw relative mx-auto max-w-sm rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-5 shadow-md">
            <div className="mb-2 text-3xl">{drawn.emoji}</div>
            <p className="text-sm font-medium italic leading-relaxed text-rose-800/90">“{drawn.text}”</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={markKept}
                disabled={kept.includes(drawn.id)}
                className={`rounded-full px-5 py-2 text-xs font-bold shadow-md transition-transform hover:scale-105 active:scale-95 disabled:cursor-default disabled:opacity-60 ${kept.includes(drawn.id) ? 'bg-rose-200 text-rose-500' : 'lana-accent-btn'}`}
              >
                {kept.includes(drawn.id) ? '✓ Kept' : 'Mark as kept'}
              </button>
              <button
                onClick={draw}
                className="rounded-full border border-rose-200 bg-white/70 px-5 py-2 text-xs font-bold text-rose-500 shadow-sm transition-all hover:bg-white"
              >
                Draw another
              </button>
            </div>
            {kept.includes(drawn.id) && (
              <span className="lana-kept-stamp absolute -right-2 -top-2 rounded-lg border-2 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider" style={{ borderColor: 'var(--lana-accent, #ff1493)', color: 'var(--lana-accent, #ff1493)', transform: 'rotate(8deg)' }}>
                Kept
              </span>
            )}
          </div>
        )}
        {!drawn && (
          <p className="text-xs font-medium text-rose-400">Tap the jar to draw a promise.</p>
        )}
      </div>
    </div>
  )
}

/* ThisOrThat — rapid-fire couple's dilemmas, tap your pick */
function ThisOrThat() {
  const [picks, setPicks] = useLocalStorage<Record<string, 'a' | 'b'>>('lana-tot-picks', {})
  const [revealKey, setRevealKey] = useState(0)

  const choose = useCallback((id: string, choice: 'a' | 'b') => {
    setPicks((prev) => ({ ...prev, [id]: choice }))
    setRevealKey((k) => k + 1)
  }, [setPicks])

  const answeredCount = Object.keys(picks).length

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-3xl border border-rose-200/60 bg-white/85 p-6 shadow-lg shadow-rose-100 backdrop-blur sm:p-8">
        <div className="mb-5 text-center">
          <div className="mb-2 text-4xl" style={{ animation: 'lana-beat 1.4s ease-in-out infinite', display: 'inline-block' }}>⚡</div>
          <h3 className="text-2xl font-extrabold text-rose-600">This or That</h3>
          <p className="mt-1 text-sm text-rose-400">{answeredCount}/{THIS_OR_THAT.length} answered · saved on this device</p>
        </div>
        <div className="space-y-3">
          {THIS_OR_THAT.map((item) => {
            const picked = picks[item.id]
            return (
              <div key={item.id} className="flex items-center gap-2">
                <button
                  onClick={() => choose(item.id, 'a')}
                  className={`lana-tot-option flex flex-1 items-center gap-2 rounded-2xl border bg-white/60 px-4 py-3 text-sm font-semibold text-rose-900/80 ${picked === 'a' ? 'lana-tot-chosen lana-tot-pop' : picked ? 'lana-tot-not-chosen' : 'border-rose-100'}`}
                >
                  <span className="text-2xl">{item.emojiA}</span>
                  <span>{item.a}</span>
                </button>
                <span className="text-xs font-bold text-rose-300">or</span>
                <button
                  onClick={() => choose(item.id, 'b')}
                  className={`lana-tot-option flex flex-1 items-center gap-2 rounded-2xl border bg-white/60 px-4 py-3 text-sm font-semibold text-rose-900/80 ${picked === 'b' ? 'lana-tot-chosen lana-tot-pop' : picked ? 'lana-tot-not-chosen' : 'border-rose-100'}`}
                >
                  <span className="text-2xl">{item.emojiB}</span>
                  <span>{item.b}</span>
                </button>
              </div>
            )
          })}
        </div>
        {answeredCount > 0 && (
          <div className="mt-5 text-center">
            <button
              onClick={() => { if (window.confirm('Reset all your picks?')) setPicks({}) }}
              className="text-xs font-medium text-rose-400 underline decoration-rose-300 underline-offset-4 transition-colors hover:text-rose-600"
            >
              Reset picks
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const [dadaIndex, setDadaIndex] = useState(0)
  const [dadaBurst, setDadaBurst] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeSection, setActiveSection] = useState('hero')
  // Phase 3 state
  const [confettiBurst, setConfettiBurst] = useState<{ id: number; x: number; y: number } | null>(null)
  const [dadaClickCount, setDadaClickCount] = useState(0)
  const [secretClicks, setSecretClicks] = useState(0)
  const [secretOpen, setSecretOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [autoplay, setAutoplay] = useState(false)
  // Phase 4 state
  const [helpOpen, setHelpOpen] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  // Phase 5 state
  const [favsOnly, setFavsOnly] = useState(false)
  const [favorites] = useLocalStorage<string[]>('lana-favorites', [])
  const [notes] = useLocalStorage<LoveNote[]>('lana-love-notes', [])

  // back-to-top visibility + active-section tracking
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // track which section is in view for the sticky nav.
  // Uses a top-band rootMargin so a section becomes active as soon as
  // its top crosses into the upper part of the viewport — reliable
  // even for tall/short sections (fixes Timeline not activating).
  useEffect(() => {
    const ids = NAV_ITEMS.map((n) => n.id)
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)
    const visible = new Map<string, number>()
    const pick = () => {
      // choose the section with the smallest top that is still visible
      let best: string | null = null
      let bestTop = Infinity
      visible.forEach((top, id) => {
        if (top < bestTop) { bestTop = top; best = id }
      })
      if (best) setActiveSection(best)
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            visible.set(e.target.id, e.boundingClientRect.top)
          } else {
            visible.delete(e.target.id)
          }
        })
        pick()
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // toast helper
  const toastTimer = useRef<number | null>(null)
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setToastVisible(true)
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastVisible(false), 2600)
  }, [])

  const handleDada = useCallback((e?: React.MouseEvent) => {
    setDadaIndex((i) => (i + 1) % DADA_MESSAGES.length)
    setDadaBurst(true)
    setTimeout(() => setDadaBurst(false), 600)
    // confetti on the 1st ДаДа click + every 5th
    setDadaClickCount((c) => {
      const next = c + 1
      if (next === 1 || next % 5 === 0) {
        const x = e ? e.clientX : window.innerWidth / 2
        const y = e ? e.clientY : window.innerHeight / 2
        setConfettiBurst({ id: Date.now(), x, y })
      }
      return next
    })
  }, [])

  // auto-clear confetti burst after animation completes (3.4s)
  useEffect(() => {
    if (!confettiBurst) return
    const t = setTimeout(() => setConfettiBurst(null), 3400)
    return () => clearTimeout(t)
  }, [confettiBurst])

  const openLightbox = useCallback((i: number) => { setLightboxIndex(i); setAutoplay(false) }, [])
  const closeLightbox = useCallback(() => { setLightboxIndex(null); setAutoplay(false) }, [])
  const navLightbox = useCallback(
    (dir: -1 | 1) => {
      setLightboxIndex((cur) => {
        if (cur === null) return cur
        const n = (cur + dir + PHOTOS.length) % PHOTOS.length
        return n
      })
    },
    []
  )
  const jumpLightbox = useCallback((i: number) => setLightboxIndex(i), [])

  // lightbox autoplay — advance every 4s when enabled
  useEffect(() => {
    if (!autoplay || lightboxIndex === null) return
    const t = setTimeout(() => navLightbox(1), 4000)
    return () => clearTimeout(t)
  }, [autoplay, lightboxIndex, navLightbox])

  // footer heart Easter egg — triggers confetti when unlocked
  const handleSecretHeartClick = useCallback(() => {
    setSecretClicks((c) => {
      const next = c + 1
      if (next >= SECRET_CLICKS) {
        setSecretOpen(true)
        // celebration confetti from screen center
        setConfettiBurst({ id: Date.now(), x: window.innerWidth / 2, y: window.innerHeight / 2 })
        return 0
      }
      return next
    })
  }, [])

  // global keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ignore if typing in an input/textarea
      const t = e.target
      if (t instanceof HTMLElement && t.closest('input, textarea, select, [contenteditable]')) return
      // ignore if a dialog is open (let its own handler run) — except ? and Esc
      const dialogOpen = document.querySelector('[role="dialog"]')
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setHelpOpen((o) => !o)
        return
      }
      if (dialogOpen) return // don't trigger nav shortcuts while a modal/lightbox is open
      const k = e.key.toLowerCase()
      if (k === 'g') document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })
      else if (k === 'd') document.getElementById('daily')?.scrollIntoView({ behavior: 'smooth' })
      else if (k === 'o') document.getElementById('more')?.scrollIntoView({ behavior: 'smooth' })
      else if (k === 'a') document.getElementById('adventures')?.scrollIntoView({ behavior: 'smooth' })
      else if (k === 'y') document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
      else if (k === 'p') document.getElementById('play')?.scrollIntoView({ behavior: 'smooth' })
      else if (k === 'r') document.getElementById('promises')?.scrollIntoView({ behavior: 'smooth' })
      else if (k === 'h') window.scrollTo({ top: 0, behavior: 'smooth' })
      else if (k === 'm') {
        const btn = document.querySelector<HTMLButtonElement>('button[aria-label*="music" i]')
        btn?.click()
      }
      else if (k === 's') {
        const btn = document.querySelector<HTMLButtonElement>('button[aria-label="Share this page"]')
        btn?.click()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <main className="lana-clip relative flex min-h-screen w-full flex-col overflow-hidden font-sans">
      {/* ── embedded custom CSS (animations + decorative classes) ── */}
      <style dangerouslySetInnerHTML={{ __html: LANA_CSS }} />
      {/* ── scroll progress bar (top) ── */}
      <ScrollProgress />
      {/* ── click-to-spawn hearts (global) ── */}
      <ClickHearts />
      {/* ── sticky floating nav ── */}
      <StickyNav activeId={activeSection} />
      {/* ── ambient music toggle ── */}
      <MusicToggle />
      {/* ── share button ── */}
      <ShareButton onToast={showToast} />
      {/* ── print button (hidden on small screens) ── */}
      <button
        onClick={() => window.print()}
        aria-label="Print this page"
        className="lana-no-print fixed bottom-20 right-6 z-50 hidden h-12 w-12 items-center justify-center rounded-full border border-rose-200/60 bg-white/85 text-xl shadow-lg shadow-rose-200/50 backdrop-blur-md transition-all hover:scale-110 active:scale-95 sm:flex"
      >
        🖨️
      </button>
      {/* ── confetti burst ── */}
      <Confetti burst={confettiBurst} />
      {/* ── secret message modal ── */}
      <SecretMessage open={secretOpen} onClose={() => setSecretOpen(false)} />
      {/* ── help overlay (press ?) ── */}
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
      {/* ── toast ── */}
      <Toast message={toastMsg} visible={toastVisible} />
      {/* ── lightbox modal ── */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={PHOTOS}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNav={navLightbox}
          onJump={jumpLightbox}
          autoplay={autoplay}
          onToggleAutoplay={() => setAutoplay((a) => !a)}
        />
      )}
      {/* ── page background gradient: light pink → white (dark rose in night mode) ── */}
      <div
        aria-hidden
        className="lana-bg-page fixed inset-0 -z-10"
        style={{
          background:
            'linear-gradient(180deg, #ffe9f1 0%, #fff3f7 28%, #ffffff 55%, #fff5f8 100%)',
        }}
      />
      {/* soft decorative blobs — wrapped in ParallaxBlobs for mouse-based parallax */}
      <ParallaxBlobs>
        <Blob className="left-[-10%] top-[8%] h-72 w-72 opacity-40" style={{ background: 'radial-gradient(circle at 30% 30%, #ffb6c1, transparent 70%)', animation: 'lana-float-slow 16s ease-in-out infinite' }} />
        <Blob className="right-[-8%] top-[35%] h-80 w-80 opacity-35" style={{ background: 'radial-gradient(circle at 60% 40%, #ff69b4, transparent 70%)', animation: 'lana-float-slow 20s ease-in-out infinite reverse' }} />
        <Blob className="left-[20%] bottom-[12%] h-72 w-72 opacity-30" style={{ background: 'radial-gradient(circle at 50% 50%, #ffc0cb, transparent 70%)', animation: 'lana-float-slow 18s ease-in-out infinite' }} />
      </ParallaxBlobs>

      <FloatingHearts />

      {/* ════════════════════ 1. HERO ════════════════════ */}
      <section
        id="hero"
        className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pt-24 pb-16 text-center"
      >
        {/* tiny top badge */}
        <Reveal className="mb-7 flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-500 shadow-sm backdrop-blur">
          <span className="text-sm">💌</span> A love letter, in pixels
        </Reveal>

        <Reveal delay={80}>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-rose-400 sm:text-base">
            From Vadik
          </p>
        </Reveal>

        <Reveal delay={160}>
          <h1 className="lana-gradient-text mx-auto max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            From Vadik
            <br className="hidden sm:block" /> for Lana
          </h1>
        </Reveal>

        <Reveal delay={260}>
          <p className="mx-auto mt-7 max-w-xl text-base font-medium text-rose-500/90 sm:text-xl">
            A little place for our memories
          </p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-rose-400/80 sm:text-base">
            Scroll gently — every part of this was made thinking of you.
          </p>
        </Reveal>

        {/* ДаДа playful badge in hero corner */}
        <Reveal delay={340} className="mt-9">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 px-5 py-2.5 text-lg font-black text-white shadow-lg shadow-rose-300/50">
            ДаДа <span className="text-sm font-medium opacity-80">· our word</span>
          </span>
        </Reveal>

        {/* ── LIVE LOVE TIMER + COUNTDOWN ── */}
        <Reveal delay={420} className="mt-10 w-full max-w-2xl">
          <div className="rounded-3xl border border-rose-200/60 bg-white/70 px-6 py-5 shadow-lg shadow-rose-100 backdrop-blur sm:px-10">
            <p className="mb-3 text-center text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-rose-400 sm:text-xs">
              Counting every moment since you
            </p>
            <LoveTimer />
          </div>
        </Reveal>

        {/* ── MOOD SELECTOR ── */}
        <Reveal delay={500} className="mt-6">
          <MoodSelector />
        </Reveal>

        {/* scroll-down arrow */}
        <a
          href="#about"
          aria-label="Scroll down"
          className="absolute bottom-7 left-1/2 -translate-x-1/2 text-rose-400 transition-colors hover:text-rose-600"
          style={{ animation: 'lana-bounce 2s ease-in-out infinite' }}
        >
          <span className="sr-only">Scroll down</span>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </a>

        {/* keyboard help hint (bottom-left of hero) */}
        <button
          onClick={() => setHelpOpen(true)}
          className="absolute bottom-7 left-6 hidden items-center gap-1.5 rounded-full border border-rose-200/60 bg-white/70 px-3 py-1.5 text-xs font-medium text-rose-500 shadow-sm backdrop-blur transition-all hover:scale-105 hover:bg-white sm:flex"
          aria-label="Show keyboard shortcuts"
        >
          <span>Press</span> <kbd className="lana-keycap">?</kbd> <span>for shortcuts</span>
        </button>
      </section>

      {/* wave divider: hero → about */}
      <WaveDivider color="#ffe9f1" />

      {/* ════════════════════ 2. ABOUT HER ════════════════════ */}
      <section id="about" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* photo */}
          <Reveal className="order-2 md:order-1">
            <div className="relative mx-auto max-w-sm">
              {/* decorative ring */}
              <div className="absolute -inset-4 -rotate-3 rounded-[2.2rem] bg-gradient-to-br from-pink-200 to-rose-300 opacity-70" />
              <div className="absolute -inset-2 rotate-2 rounded-[2rem] border-2 border-dashed border-rose-300/60" />
              {/* photo frame */}
              <figure className="relative overflow-hidden rounded-[1.8rem] bg-white p-3 shadow-2xl shadow-rose-200/70">
                {/* ── REPLACE the src below with your direct photo URL ── */}
                <img
                  src={PORTRAIT_URL}
                  alt="Lana"
                  className="h-[26rem] w-full rounded-[1.4rem] object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <figcaption className="px-2 pb-1 pt-3 text-center text-sm font-medium text-rose-500">
                  My favorite girl🌷
                </figcaption>
              </figure>
              {/* floating sticker */}
              <div className="absolute -right-4 -top-4 flex h-14 w-14 rotate-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg" style={{ animation: 'lana-float 5s ease-in-out infinite' }}>
                💗
              </div>
            </div>
          </Reveal>

          {/* text */}
          <Reveal delay={120} className="order-1 md:order-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              About her
            </p>
            <h2 className="mb-6 text-4xl font-extrabold leading-tight text-rose-600 sm:text-5xl">
              The girl who is my <span className="lana-gradient-text">safe place</span>
            </h2>
            {/* EDIT: replace these lines with your own heartfelt words */}
            <div className="space-y-4 text-[1.02rem] leading-relaxed text-rose-900/75">
              <p>
                Lana is kind, smart, and quietly inspiring — the sort of person who makes
                a noisy world feel calm again. She listens like it matters, laughs like
                it’s free, and loves in the small, daily ways that mean everything.
              </p>
              <p>
                She is my safe place. My favourite hello and my hardest goodbye. The one
                who turns ordinary days into something I want to remember.
              </p>
              <p>
                She is an English teacher — a genuinely wonderful one. The kind students
                remember years later. I watch how she pours herself into her work, how she
                keeps reaching for the next thing, and I cannot help but be proud — of her
                achievements, her drive, her stubborn refusal to settle. She makes ambition
                look soft, and I am her biggest fan.
              </p>
              <p>
                If happiness had a face, it would look a lot like hers.
              </p>
            </div>
            {/* quality chips */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {['Kind', 'Smart', 'Inspiring', 'My safe place', 'Funny', 'Beautiful inside & out', 'English teacher', 'Driven'].map((q) => (
                <span
                  key={q}
                  className="rounded-full border border-rose-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-rose-600 shadow-sm backdrop-blur transition-transform hover:scale-105"
                >
                  {q}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════ 3. PHOTO GALLERY ════════════════════ */}
      <WaveDivider flip color="#fff3f7" />
      <section id="gallery" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Photo gallery
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              Moments I never want to forget
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-rose-900/65">
              Tap any photo to enlarge — some memories deserve a second look.
            </p>
          </Reveal>

          {/* favorites filter toggle */}
          <Reveal delay={80} className="mb-8 flex justify-center">
            <button
              onClick={() => setFavsOnly((v) => !v)}
              aria-pressed={favsOnly}
              className={`flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-bold shadow-sm backdrop-blur transition-all hover:scale-105 ${
                favsOnly
                  ? 'border-transparent bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-rose-200'
                  : 'border-rose-200 bg-white/80 text-rose-500 hover:bg-white'
              }`}
            >
              <span className="text-base">{favsOnly ? '⭐' : '☆'}</span>
              {favsOnly ? 'Showing favorites only' : 'Show favorites only'}
              {favorites.length > 0 && <span className="ml-1 rounded-full bg-white/30 px-2 py-0.5 text-xs">{favorites.length}</span>}
            </button>
          </Reveal>

          {/* gallery grid — 2 cols mobile, 3 tablet, 4 desktop */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {PHOTOS.map((p, i) => {
              // hide non-favorites when filter is on
              if (favsOnly && !favorites.includes(p.url)) return null
              return (
              <Reveal key={i} delay={(i % 4) * 80} className="h-full">
                <figure
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white p-2 shadow-lg shadow-rose-100 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
                  onClick={() => openLightbox(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i) } }}
                  aria-label={`Open photo ${i + 1}${p.caption ? ': ' + p.caption : ''}`}
                >
                  {/* ── REPLACE each src with your direct photo URL (see PHOTOS array at top) ── */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                    <img
                      src={p.url}
                      alt={p.caption ?? `Memory ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* favorite star toggle (top-left) — persisted to localStorage */}
                    <FavoritesButton photoUrl={p.url} onToast={showToast} />
                    {/* expand hint (top-right) */}
                    <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sm text-rose-500 opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100">
                      ⤢
                    </span>
                    {/* caption overlay */}
                    {p.caption && (
                      <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-rose-900/70 via-rose-900/10 to-transparent p-3.5 text-sm font-medium text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                        <span className="flex items-center gap-1.5">
                          <span>💗</span> {p.caption}
                        </span>
                      </figcaption>
                    )}
                  </div>
                </figure>
              </Reveal>
              )
            })}
          </div>
          {/* empty state when favorites filter shows nothing */}
          {favsOnly && favorites.length === 0 && (
            <Reveal className="mt-8 text-center">
              <div className="mx-auto max-w-md rounded-3xl border border-dashed border-rose-200 bg-white/50 p-10">
                <div className="mb-3 text-4xl">⭐</div>
                <p className="text-sm font-medium text-rose-400">
                  No favorites yet — tap the star on any photo to save it here.
                </p>
              </div>
            </Reveal>
          )}
          <Reveal delay={120} className="mt-8 text-center">
            <p className="text-xs font-medium text-rose-400">
              💡 Click a photo to open the full-screen viewer · use ← → keys to navigate · Esc to close
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════ 4. REASONS TO LOVE ════════════════════ */}
      <WaveDivider color="#fff5f8" />
      <section id="reasons" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Reasons to love
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              Eight of a million
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-rose-900/65">
              (I ran out of pixels before I ran out of reasons.)
            </p>
          </Reveal>

          <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((r, i) => (
              <Reveal key={r.title} delay={(i % 4) * 90} className="h-full">
                <TiltCard className="h-full">
                  <article className="lana-tilt-inner group flex h-full flex-col rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-md shadow-rose-100 backdrop-blur transition-all duration-300 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-200">
                    <div
                      className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 text-3xl transition-transform duration-300 group-hover:-rotate-6"
                      style={{ animation: undefined }}
                      onMouseEnter={(e) => (e.currentTarget.style.animation = 'lana-wiggle 0.6s ease-in-out')}
                      onMouseLeave={(e) => (e.currentTarget.style.animation = '')}
                    >
                      {r.icon}
                    </div>
                    <h3 className="mb-1.5 text-lg font-bold text-rose-700">{r.title}</h3>
                    <p className="flex-1 text-sm leading-relaxed text-rose-900/70">{r.text}</p>
                    <div className="mt-4 h-1 w-10 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-300 group-hover:w-full" />
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 5. MEMORIES TIMELINE ════════════════════ */}
      <WaveDivider flip color="#fff0f5" />
      <section id="timeline" className="relative z-10 px-6 py-20 sm:py-28">
        <MemoriesTimeline />
      </section>

      {/* ════════════════════ 6. LOVE LETTER (typewriter) ════════════════════ */}
      <WaveDivider color="#fff5f8" />
      <section id="letter" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Reveal className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              A little letter
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              Read slowly
            </h2>
            <p className="mx-auto mt-4 max-w-md text-rose-900/65">
              (It types itself out when you reach it.)
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="lana-paper relative overflow-hidden rounded-[1.8rem] border border-rose-200/60 bg-white/90 p-8 shadow-2xl shadow-rose-200/60 sm:p-12">
              {/* decorative corner hearts */}
              <span aria-hidden className="absolute right-5 top-5 text-2xl opacity-40">💌</span>
              <span aria-hidden className="absolute bottom-5 left-5 text-xl opacity-30">💕</span>
              {/* paper inner */}
              <div className="relative">
                <Typewriter
                  text={LOVE_LETTER}
                  replayKey={replayKey}
                  className="font-medium leading-relaxed text-rose-900/80 text-base sm:text-lg"
                />
              </div>
              {/* signature + replay button */}
              <div className="mt-8 flex items-center justify-between gap-2 border-t border-rose-200/50 pt-5">
                <button
                  onClick={() => setReplayKey((k) => k + 1)}
                  className="lana-replay-btn flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
                  aria-label="Replay the letter"
                >
                  <span>↻</span> Replay
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-rose-400">—</span>
                  <span className="lana-gradient-text text-xl font-bold italic">Vadik</span>
                  <span aria-hidden style={{ animation: 'lana-beat 1.4s ease-in-out infinite', display: 'inline-block' }}>❤️</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════════════════════ 6. FUNNY MOMENTS / OUR JOKES + ДаДа ════════════════════ */}
      <WaveDivider color="#fff0f5" />
      <section id="jokes" className="relative z-10 overflow-hidden px-6 py-20 sm:py-28">
        {/* ДаДа repeating watermark background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0 flex flex-col items-center justify-center gap-2 opacity-90">
          {Array.from({ length: 7 }).map((_, r) => (
            <div key={r} className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {Array.from({ length: 5 }).map((_, c) => (
                <span
                  key={c}
                  className="lana-dada-watermark text-5xl sm:text-7xl"
                  style={{ transform: `rotate(${(r + c) % 2 ? -4 : 4}deg)` }}
                >
                  ДаДа
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal className="mb-10 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-rose-300/60">
              ДаДа
            </span>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Funny moments · our jokes
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              The stuff only we get
            </h2>
          </Reveal>

          {/* ДаДа interactive button + message */}
          <Reveal delay={100} className="mb-12 flex flex-col items-center gap-5">
            <button
              onClick={(e) => handleDada(e)}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 px-8 py-4 text-lg font-extrabold text-white transition-transform duration-200 hover:scale-105 active:scale-95"
              style={{ animation: 'lana-pulse-glow 2.6s ease-in-out infinite' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="text-xl">👆</span> Press for a ДаДа moment
              </span>
              {/* shine sweep */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {/* burst hearts */}
              {dadaBurst && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-2xl">
                  <span className="absolute -translate-y-6 animate-ping">💕</span>
                  <span className="absolute translate-x-6 animate-ping">💖</span>
                  <span className="absolute -translate-x-6 animate-ping">💗</span>
                </span>
              )}
            </button>
            <p
              key={dadaIndex}
              className="min-h-[2.5rem] rounded-2xl bg-white/90 px-6 py-3 text-center text-base font-semibold text-rose-600 shadow-md backdrop-blur"
              style={{ animation: 'lana-pop-in 0.5s ease-out' }}
            >
              {DADA_MESSAGES[dadaIndex]}
            </p>
          </Reveal>

          {/* jokes cards */}
          <div className="grid auto-rows-fr grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {JOKES.map((j, i) => (
              <Reveal key={j.title} delay={(i % 3) * 90} className="h-full">
                <article className="group flex h-full flex-col rounded-3xl border border-rose-100 bg-white/85 p-6 shadow-md shadow-rose-100 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-200">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-125">{j.emoji}</span>
                    <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-500">
                      #{i + 1}
                    </span>
                  </div>
                  <h3 className="mb-1.5 text-lg font-bold text-rose-700">{j.title}</h3>
                  <p className="flex-1 text-sm leading-relaxed text-rose-900/70">{j.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ 8. DAILY (affirmation + love calculator + song) ════════════════════ */}
      <WaveDivider flip color="#fff0f5" />
      <section id="daily" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              A little every day
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              Something fresh today
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-rose-900/65">
              A new affirmation and a playful calculation — every single day.
            </p>
          </Reveal>
          {/* daily affirmation */}
          <Reveal delay={80} className="mb-10">
            <DailyAffirmation />
          </Reveal>
          {/* love calculator */}
          <Reveal delay={140}>
            <LoveCalculator />
          </Reveal>
        </div>
      </section>

      {/* ════════════════════ 9. MORE LOVE (generator + stats + weather) ════════════════════ */}
      <WaveDivider color="#fff0f5" />
      <section id="more" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Extra love
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              A little more, because why not
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-rose-900/65">
              Generate a letter and peek at our stats.
            </p>
          </Reveal>
          {/* relationship stats */}
          <Reveal delay={80} className="mb-10">
            <RelationshipStats />
          </Reveal>
          {/* letter generator */}
          <div className="grid grid-cols-1 items-start gap-8">
            <Reveal delay={140}>
              <LoveLetterGenerator />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════ 10. ADVENTURES (bucket list + love languages) ════════════════════ */}
      <WaveDivider flip color="#fff0f5" />
      <section id="adventures" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Adventures & us
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              Things we will do, ways we love
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-rose-900/65">
              A bucket list to check off together, and the languages we speak.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <Reveal delay={100}>
              <BucketList onToast={showToast} />
            </Reveal>
            <Reveal delay={160}>
              <LoveLanguages />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════ 11. STORY (coupons + first-date) ════════════════════ */}
      <WaveDivider flip color="#fff0f5" />
      <section id="story" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Little extras
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              Coupons to cash, a story to tell
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-rose-900/65">
              Redeem a sweet favour, then relive the night it all started.
            </p>
          </Reveal>
          {/* coupons */}
          <Reveal delay={80} className="mb-10">
            <LoveCoupons onToast={showToast} />
          </Reveal>
          {/* first-date story */}
          <Reveal delay={140}>
            <FirstDateStory />
          </Reveal>
        </div>
      </section>

      {/* ════════════════════ 12. PLAY (fortune cookie + compatibility quiz) ════════════════════ */}
      <WaveDivider flip color="#fff0f5" />
      <section id="play" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Play with me
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              Crack a cookie, take a quiz
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-rose-900/65">
              Two little games. Both rigged — in our favour.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <Reveal delay={100}>
              <LoveFortune />
            </Reveal>
            <Reveal delay={160}>
              <CompatibilityQuiz />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════ 13. PROMISES (jar + this-or-that) ════════════════════ */}
      <WaveDivider flip color="#fff0f5" />
      <section id="promises" className="relative z-10 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Promises & picks
            </p>
            <h2 className="text-4xl font-extrabold text-rose-600 sm:text-5xl">
              What I promise, what we pick
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-rose-900/65">
              Draw a promise from the jar, then make a few choices together.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <Reveal delay={100}>
              <PromiseJar onToast={showToast} />
            </Reveal>
            <Reveal delay={160}>
              <ThisOrThat />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════ 14. LOVE NOTES (visitor messages, localStorage) ════════════════════ */}
      <WaveDivider color="#fff5f8" />
      <section id="notes" className="relative z-10 px-6 py-20 sm:py-28">
        <LoveNotes />
        <NotesExportImport notes={notes} />
      </section>

      {/* ════════════════════ 15. FOOTER ════════════════════ */}
      <WaveDivider color="#fff5f8" />
      <footer className="relative z-10 mt-auto overflow-hidden bg-gradient-to-b from-transparent via-rose-50/60 to-rose-100/70 px-6 pt-16 pb-10 text-center">
        {/* decorative floating hearts row */}
        <div className="mb-6 flex items-center justify-center gap-3 text-2xl" aria-hidden>
          {['💕', '💖', '💗', '💝', '🌹'].map((h, i) => (
            <span
              key={i}
              style={{ animation: `lana-float ${4 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}
            >
              {h}
            </span>
          ))}
        </div>

        <Reveal>
          <p className="mx-auto max-w-md text-lg font-semibold leading-relaxed text-rose-700">
            “In a world full of temporary things, you are a perpetual feeling.”
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xl font-bold text-rose-600 sm:text-2xl">
            Made with
            {/* Easter egg: click this heart N times to reveal a secret message */}
            <button
              onClick={handleSecretHeartClick}
              aria-label={`Tap the heart ${SECRET_CLICKS} times for a secret (${secretClicks}/${SECRET_CLICKS})`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-125 active:scale-95"
            >
              {/* rotating ring that appears after first click */}
              {secretClicks > 0 && secretClicks < SECRET_CLICKS && (
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 36 36"
                  aria-hidden
                  style={{ animation: 'lana-ring-spin 3s linear infinite' }}
                >
                  <circle
                    cx="18" cy="18" r="16"
                    fill="none"
                    stroke="#ff1493"
                    strokeWidth="2"
                    strokeDasharray={`${(secretClicks / SECRET_CLICKS) * 100.5} 100.5`}
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                    opacity="0.6"
                  />
                </svg>
              )}
              <span
                aria-hidden
                style={{
                  animation: 'lana-beat 1.4s ease-in-out infinite',
                  display: 'inline-block',
                  filter: secretClicks > 0 ? 'drop-shadow(0 0 6px rgba(255,20,147,0.6))' : 'none',
                }}
              >
                ❤️
              </span>
            </button>
            by Vadik
            <span className="text-rose-300">·</span>
            <span className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-3 py-1 text-base font-black text-white shadow-md">ДаДа</span>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.25em] text-rose-400">
            For Lana · always
          </p>
          {/* subtle hint that appears after a few clicks */}
          {secretClicks > 0 && secretClicks < SECRET_CLICKS && (
            <p className="mt-2 text-[0.7rem] font-medium text-rose-400/70" style={{ animation: 'lana-pop-in 0.3s ease-out' }}>
              {SECRET_CLICKS - secretClicks} more tap{SECRET_CLICKS - secretClicks === 1 ? '' : 's'}… 🤫
            </p>
          )}
        </Reveal>
      </footer>

      {/* back-to-top heart */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-xl text-white shadow-xl shadow-rose-300/60 transition-all duration-300 hover:scale-110 ${
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-16 opacity-0'
        }`}
      >
        💕
      </button>
    </main>
  )
}
