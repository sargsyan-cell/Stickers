/**
 * Mini Jigsaw Puzzle - Vanilla JS game
 * Royal Match-inspired UI, level-based puzzles, Card Album Collection.
 */

(function () {
  "use strict";

  const SNAP_THRESHOLD = 35;
  const SAVE_KEY = "puzzleGame_save_v2";
  const STORAGE_KEYS = {
    currentLevel: "puzzle_currentLevel",
    coins: "puzzle_coins",
    musicOn: "puzzle_musicOn",
    sfxOn: "puzzle_sfxOn",
    devCheatsEnabled: "puzzle_devCheatsEnabled",
  };
  const DEFAULT_COINS = 50;
  const DEFAULT_PUZZLE_ENERGY = 20;
  const COINS_TAP_WINDOW_MS = 2000;
  const COINS_TAP_COUNT = 5;
  const LONG_PRESS_MS = 1500;
  const LEVEL_2_INDEX = 1;
  const LEVEL_3_INDEX = 2;
  const LEVEL_4_INDEX = 3;
  const LEVEL_6_INDEX = 5;
  const LEVEL_8_INDEX = 7;
  const RACE_TARGET_POINTS = 50;
  const RACE_BOT_INTERVALS_MS = [12000, 15000, 18000, 22000];
  const RACE_BOT_NAMES = ["Orange Lime", "Orange Lime", "Orange Lime", "Orange Lime"];
  const RACE_EVENT_DURATION_MS = 10 * 24 * 60 * 60 * 1000;
  const RACE_LANE_CAR_SRCS = [
    "https://www.figma.com/api/mcp/asset/c4d902f4-3391-4c00-a764-74855c071d2b",
    "https://www.figma.com/api/mcp/asset/237c68c9-e7c8-4477-b5dc-94f29c1d4f20",
    "https://www.figma.com/api/mcp/asset/936a3a05-8563-4d7a-91e1-d804ea98accd",
    "https://www.figma.com/api/mcp/asset/4f6b9fc2-4de2-4c37-a6a1-c15f054f7cae",
    "https://www.figma.com/api/mcp/asset/412b9eb5-852c-42f8-98b9-ba2f246152f1",
  ];
  const PROFILE_ICON_ADS_SRC = "https://www.figma.com/api/mcp/asset/16a01535-a730-4ad0-9f6b-3e00e77e156a";
  const PROFILE_ICON_GEM_SRC = "https://www.figma.com/api/mcp/asset/56ae3d16-19e0-4617-b81c-8a74914f2997";
  const BP_GEM_ICON_SRC = "https://www.figma.com/api/mcp/asset/a0a4ff75-7918-4c31-aec2-8293de3ed8d4";
  const BP_CHEST_ICON_SRC = "https://www.figma.com/api/mcp/asset/3963bbf8-0846-49af-bbb1-918d04dc750d";
  const LEADERBOARD_BG_SRC = "https://www.figma.com/api/mcp/asset/15be4824-a30a-48f1-a5f5-009d86f4da60";
  const LEADERBOARD_BANNER_SRC = "https://www.figma.com/api/mcp/asset/2e431d04-8cc9-457c-8137-d1faebf495e2";
  const LEADERBOARD_NAV_BACK_SRC = "https://www.figma.com/api/mcp/asset/e4d08226-c9b2-4ee0-bf02-a51bb9b38b78";
  const LEADERBOARD_NAV_INFO_SRC = "https://www.figma.com/api/mcp/asset/27dbf6f8-c200-40e1-85f7-76638f04c380";
  const LEADERBOARD_TOP_WREATH_GOLD_SRC = "https://www.figma.com/api/mcp/asset/7f2a78df-aa97-4f3b-9e60-c69e393cd73d";
  const LEADERBOARD_TOP_WREATH_SILVER_SRC = "https://www.figma.com/api/mcp/asset/04060ce3-b519-4d6a-b550-c716785ef83e";
  const LEADERBOARD_TOP_WREATH_BRONZE_SRC = "https://www.figma.com/api/mcp/asset/75626547-756f-4536-8548-6ef95f15cf65";
  const LEADERBOARD_REWARD_GOLD_SRC = "https://www.figma.com/api/mcp/asset/c125d8e9-2b1f-480c-b73b-7a8f9241806e";
  const LEADERBOARD_REWARD_SILVER_SRC = "https://www.figma.com/api/mcp/asset/247bfb7a-0c6c-49da-a8f9-43514a7f2bb1";
  const LEADERBOARD_REWARD_BRONZE_SRC = "https://www.figma.com/api/mcp/asset/170f228f-d243-428a-adc2-a4c4fa9d765d";
  const LEADERBOARD_BOT_AVATAR_SRC = "https://www.figma.com/api/mcp/asset/19f75488-c193-4a14-9314-0d6729052844";
  const ALBUM_BG_SRC = "https://www.figma.com/api/mcp/asset/84afe2d8-1ff4-477b-9680-739aa648d61c";
  const ALBUM_ICON_CARD_SRC = "https://www.figma.com/api/mcp/asset/7fdb2bba-f0ab-4ec0-aca8-ef019d3ddc22";
  const ALBUM_ICON_CHEST_SRC = "https://www.figma.com/api/mcp/asset/e1f42bd0-a9af-4287-a86a-e80cc38455d6";
  const ALBUM_ICON_INFO_SRC = "https://www.figma.com/api/mcp/asset/c0296964-9880-4e32-98cf-876913353eca";
  const ALBUM_ICON_COIN_SRC = "https://www.figma.com/api/mcp/asset/dc3dcad6-307d-4ce3-be5f-bc6404e1cc9b";
  const ALBUM_ICON_GEM_SRC = "https://www.figma.com/api/mcp/asset/026579c0-3798-4877-8fb2-d9b4300e48f9";
  const ALBUM_ICON_SORT_SRC = "https://www.figma.com/api/mcp/asset/a526d657-e4e8-47de-912e-186906fe4e03";
  const ALBUM_ICON_ARROW_LEFT_SRC = "https://www.figma.com/api/mcp/asset/e4264505-f865-4c9d-a831-3b90b5b637bc";
  const ALBUM_ICON_ARROW_RIGHT_SRC = "https://www.figma.com/api/mcp/asset/7ae51612-ac18-4f8f-9d2c-7470bebc8b0e";
  const ALBUM_CARD_STAR_SRC = "https://www.figma.com/api/mcp/asset/87463e49-ca29-4aaf-9bcf-774e410672d6";
  const ALBUM_QUESTION_TILE_SRC = "https://www.figma.com/api/mcp/asset/92f62589-2b94-483d-9980-f075e362c4b7";
  const ALBUM_BOTTOM_BANNER_SRC = "https://www.figma.com/api/mcp/asset/2e431d04-8cc9-457c-8137-d1faebf495e2";
  const ALBUM_EXCHANGE_CLOSE_SRC = "https://www.figma.com/api/mcp/asset/0cdd32d2-f712-4dfd-8be4-b9660f147249";
  const ALBUM_EXCHANGE_CHEST_WOOD_SRC = "https://www.figma.com/api/mcp/asset/b2e1fde9-830c-45c0-9d3c-9545fe919d23";
  const ALBUM_EXCHANGE_CHEST_SILVER_SRC = "https://www.figma.com/api/mcp/asset/00c500a7-e411-4c32-b0b9-0e859d2d32b0";
  const ALBUM_EXCHANGE_CHEST_GOLD_SRC = "https://www.figma.com/api/mcp/asset/1caf35f4-4818-4a6f-8f91-8bf404e8d89c";
  const ALBUM_EXCHANGE_COIN_SRC = "https://www.figma.com/api/mcp/asset/3ebc2fd3-3079-40e8-9686-99b4964feab2";
  const ALBUM_EXCHANGE_ENERGY_SRC = "https://www.figma.com/api/mcp/asset/cad4e6b3-cac1-41f2-94b9-62e61df32e45";
  const ALBUM_EXCHANGE_GEM_SRC = "https://www.figma.com/api/mcp/asset/66522874-ab1e-4b32-9b41-2f0ae0524afa";
  const ALBUM_EXCHANGE_BP_STAR_SRC = "https://www.figma.com/api/mcp/asset/d40a259d-e54a-488e-8e4e-82ed8fcaf048";
  const ALBUM_FEATURES_INFO_PACK_SRC = "https://www.figma.com/api/mcp/asset/1562f3d9-b0cd-4425-9815-4c1c7f6fbe6c";
  const ALBUM_FEATURES_INFO_STAR_SRC = "https://www.figma.com/api/mcp/asset/44c9eef2-f8b9-4800-b8a9-fde938e376a4";
  const ALBUM_FEATURES_INFO_CHEST_SRC = "https://www.figma.com/api/mcp/asset/70af29b5-fa34-486b-80ea-58f67edb6e4f";
  const ALBUM_FEATURES_INFO_TAP_SRC = "https://www.figma.com/api/mcp/asset/6a0f4487-017d-47c2-a7f0-8b28a0b067b5";
  const BP_STARS_PER_CARD = 10;
  const BP_XP_PER_TIER = 100;
  // Battle Pass rewards — 10 tiers x 2 tracks = 20 slots. ~70% are sticker
  // packs (14/20). Free track = lower/mid grades; Premium = higher grades.
  // Sticker-pack rewards are granted via the shared pending-pack mechanism
  // (addPendingStickerPack), so they open later in the Stickers tab.
  const BP_REWARDS = {
    free: [
      { type: "pack", grade: 1 }, { type: "gems", amount: 50 },  { type: "pack", grade: 1 }, { type: "energy", amount: 20 },
      { type: "pack", grade: 2 }, { type: "hammers", amount: 1 }, { type: "pack", grade: 2 }, { type: "pack", grade: 1 },
      { type: "pack", grade: 2 }, { type: "pack", grade: 3 },
    ],
    premium: [
      { type: "pack", grade: 2 }, { type: "pack", grade: 3 },     { type: "gems", amount: 150 }, { type: "pack", grade: 3 },
      { type: "pack", grade: 4 }, { type: "energy", amount: 30 }, { type: "pack", grade: 3 },    { type: "hammers", amount: 3 },
      { type: "pack", grade: 4 }, { type: "pack", grade: 5 },
    ],
  };
  const BP_ROMAN = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" };
  // Reward icon + label markup for a Battle Pass slot (pack / gems / energy / hammers).
  function bpRewardHTML(rw) {
    if (!rw) return "";
    if (rw.type === "pack") {
      const meta = getStickerPackTier(rw.grade);
      return '<span class="bp-pack-icon sticker-pack-tier--' + rw.grade + '" aria-hidden="true">'
        + '<span class="bp-pack-band"></span><span class="bp-pack-star">' + meta.star + '</span></span>'
        + '<span class="bp-tier-reward-count bp-pack-label">Pack ' + (BP_ROMAN[rw.grade] || rw.grade) + '</span>';
    }
    const emoji = rw.type === "gems" ? "💎" : rw.type === "energy" ? "⚡" : "🔨";
    return '<span class="bp-reward-emoji" aria-hidden="true">' + emoji + '</span>'
      + '<span class="bp-tier-reward-count">x' + (rw.amount || 1) + '</span>';
  }
  const WHEEL_FREE_COOLDOWN_MS = 6 * 60 * 60 * 1000;
  const WHEEL_SEGMENTS = 6;
  const WHEEL_SPIN_DURATION_MS = 3000;
  const ALBUM_FRESH_CARD_COUNT = 8;
  const PIGGY_CAP_DEFAULT = 500;
  const PIGGY_EARN_PER_PIECE = 1;
  const EVENT_DURATION_MS = 10 * 24 * 60 * 60 * 1000;
  const CARD_IMAGE_BASE = "assets/cards/";
  const PACK_REFERENCE_IMAGE = "assets/ui/pack_reference.png";
  const LOST_TEMPLE_STAGES = [
    { id: 1, boardSize: 4, chestGoal: 4, gemGoal: 2, tier: "adventurer", loot: { chest: 4, gem: 2, relic: 2, bonusHammer: 2, coins: 2 } },
    { id: 2, boardSize: 4, chestGoal: 4, gemGoal: 2, tier: "archaeologist", loot: { chest: 4, gem: 2, relic: 3, bonusHammer: 2, coins: 3 } },
    { id: 3, boardSize: 4, chestGoal: 2, gemGoal: 2, tier: "mystery", loot: { chest: 2, gem: 2, relic: 4, bonusHammer: 3, coins: 3 } },
  ];
  // Registry for uploaded HTML playables (Level 1, Level 2, etc.).
  // Add new files to this array to plug additional external levels.
  const EXTERNAL_PLAYABLE_LEVELS = [
    {
      id: "city2_unity_level_1",
      title: "City 2",
      type: "html-playable",
      src: "levels/events/APW_Lvl_4_applovin_Full_1.html",
    },
    {
      id: "city_level_3_unity_level_2",
      title: "City Level 3",
      type: "html-playable",
      src: "levels/PuzzleCity_Level_3_unity_Full.html",
    },
  ];
  const GALLERY_LEVEL_DEFS = [
    { id: "gallery_level_1", label: "Tutorial", featureIcon: "feature-bp", playableLevelIndex: 0 },
    { id: "gallery_level_2", label: "Tutorial", featureIcon: "feature-leaderboard", playableLevelIndex: 1 },
    { id: "gallery_level_3", label: "Tutorial", featureIcon: "feature-wheel" },
    { id: "gallery_level_4", label: "Tutorial", featureIcon: "feature-race" },
    { id: "gallery_level_5", label: "Tutorial", featureIcon: "feature-temple" },
    { id: "gallery_level_6", label: "Tutorial", featureIcon: "feature-piggy" },
    { id: "gallery_level_7", label: "Tutorial", featureIcon: "feature-ads" },
    { id: "gallery_level_8", label: "Tutorial", featureIcon: "feature-cards" },
  ];
  const DAILY_TASK_DEFS = [
    {
      id: "complete_level_1",
      title: "Build a Mall",
      target: 1,
      points: 5,
      progressKey: "level1Complete",
      rewards: [{ type: "coin", amount: 50 }],
      rewardCoins: 50,
    },
    {
      id: "place_100_pieces",
      title: "Upgrade the Mall to Level 2",
      target: 100,
      points: 5,
      progressKey: "piecesPlaced",
      rewards: [{ type: "coin", amount: 50 }],
      rewardCoins: 50,
    },
    {
      id: "spin_wheel_5",
      title: "Build a Ferris Wheel",
      target: 5,
      points: 15,
      progressKey: "wheelSpins",
      rewards: [{ type: "coin", amount: 50 }, { type: "crystal", amount: 50 }],
      rewardCoins: 50,
      rewardGems: 50,
    },
    {
      id: "race_action",
      title: "Collect 500 Coins in the City",
      target: 1,
      points: 5,
      progressKey: "raceActions",
      rewards: [{ type: "energy", amount: 50 }, { type: "boost_a", amount: 5 }, { type: "boost_b", amount: 5 }],
      rewardCoins: 50,
    },
    {
      id: "piggy_claim",
      title: "Upgrade wheel attraction in the City",
      target: 1,
      points: 15,
      progressKey: "piggyClaims",
      rewards: [{ type: "coin", amount: 50 }, { type: "energy", amount: 50 }, { type: "boost_b", amount: 5 }],
      rewardCoins: 50,
      rewardGems: 10,
    },
  ];
  const DAILY_TASK_REWARD_ICON_BY_TYPE = {
    coin: "https://www.figma.com/api/mcp/asset/14a18448-631a-44ee-b4e3-41cd4ac41214",
    crystal: "https://www.figma.com/api/mcp/asset/e890eb9d-35db-439d-aa40-4d32c38149ff",
    energy: "https://www.figma.com/api/mcp/asset/bbb65678-3762-4a72-bcb3-008e6f9476f2",
    boost_a: "https://www.figma.com/api/mcp/asset/68bbb76e-4ad4-482f-9b28-599199cf2475",
    boost_b: "https://www.figma.com/api/mcp/asset/31190ee7-2e49-4575-9e57-6f9bde5aa3a9",
  };

  function ensureEvent(save, key, startNowIfMissing) {
    const ev = save[key];
    if (ev && typeof ev.startAt === "number" && typeof ev.endAt === "number") return ev;
    if (!startNowIfMissing) return null;
    const now = Date.now();
    const event = { startAt: now, endAt: now + EVENT_DURATION_MS };
    save[key] = event;
    return event;
  }

  function isEventActive(save, key) {
    const ev = save[key];
    return !!(ev && typeof ev.endAt === "number" && Date.now() < ev.endAt);
  }

  function getRemainingMs(save, key) {
    const ev = save[key];
    if (!ev || typeof ev.endAt !== "number") return 0;
    return Math.max(0, ev.endAt - Date.now());
  }

  function formatRemaining(ms) {
    if (ms <= 0) return "Event ended";
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return d + "d " + h + "h " + m + "m";
  }

  function randomShuffle(arr) {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  function buildLostTempleStageState(stageIndex) {
    const safeIndex = Math.max(0, Math.min(LOST_TEMPLE_STAGES.length - 1, stageIndex || 0));
    const def = LOST_TEMPLE_STAGES[safeIndex];
    const tileCount = def.boardSize * def.boardSize;
    const lootPool = [];
    Object.keys(def.loot).forEach((k) => {
      const n = Math.max(0, parseInt(def.loot[k], 10) || 0);
      for (let i = 0; i < n; i++) lootPool.push(k);
    });
    while (lootPool.length < tileCount) lootPool.push("none");
    const shuffled = randomShuffle(lootPool).slice(0, tileCount);
    const tiles = shuffled.map((lootType) => ({ broken: false, lootType }));
    return {
      stageIndex: safeIndex,
      boardSize: def.boardSize,
      chestProgress: 0,
      chestGoal: def.chestGoal,
      gemProgress: 0,
      gemGoal: Math.max(1, parseInt(def.gemGoal, 10) || 2),
      chestTier: def.tier,
      chestClaimable: false,
      chestClaimed: false,
      boardCompleted: false,
      tiles,
    };
  }

  function getDefaultSave() {
    return {
      currentLevel: 0,
      coins: DEFAULT_COINS,
      collectionUnlocked: true,
      collectionTutorialCompleted: true,
      lastAnimatedInboxSignature: "",
      albums: {},
      cards: { collected: {}, newInbox: [], duplicates: {} },
      stickerLevel: { placed: {}, unlocked: {}, firstPackOpened: false, pendingPacks: [] },
      albumStars: 0,
      eventHammers: 0,
      rewards: { trophies: 0, unlockedRewards: [], trophiesGoldCup: false },
      allCardsRewardClaimed: false,
      battlePassUnlocked: true,
      bpStarsTotal: 0,
      battlePassPremiumActive: false,
      xpTotal: 0,
      bpClaims: { freeClaimedTiers: [], premiumClaimedTiers: [] },
      bpPremiumPackMeta: {},
      albumEvent: null,
      battlePassEvent: null,
      wheelUnlocked: true,
      wheelNextFreeAt: 0,
      wheelTutorialSeen: true,
      piecesCollectedTotal: 0,
      leaderboardWeekId: null,
      weeklyPiecesCollected: 0,
      bpTutorCompleted: true,
      bpTutorStep: 0,
      leaderboardUnlocked: true,
      leaderboardTutorCompleted: true,
      bonusLevelUnlocked: true,
      bonusLevelCompleted: false,
      bonusLevelTimesPlayed: 0,
      gemsTotal: 0,
      piggyGemsStored: 0,
      piggyCap: PIGGY_CAP_DEFAULT,
      piggyBroken: false,
      piggyEarnPerPiece: PIGGY_EARN_PER_PIECE,
      musicOn: "true",
      sfxOn: "true",
      raceUnlocked: true,
      raceTutorialCompleted: true,
      lostTempleUnlocked: true,
      lostTempleTutorialCompleted: true,
      lostTempleEvent: null,
      lostTempleCurrentStage: 0,
      lostTempleState: null,
      leaderboardHammerRewardWeekId: null,
      raceState: {
        active: false,
        startTime: 0,
        playerPoints: 0,
        botPoints: [0, 0, 0, 0],
        winner: null,
        claimed: false,
      },
      playerProfile: null,
      profileSetupCompleted: true,
      rubyCaveCompleted: 0,
      rubyCaveEnergy: 25,
      rubyCaveEnergyV2: true,
      rubyCaveNextEnergyAt: null,
      rubyCaveEventEnd: null,
      rubyCaveTutorialDone: false,
      rubyCaveRewardClaimed: false,
      rubyCaveStickerPlaced: {},
      puzzleEnergy: DEFAULT_PUZZLE_ENERGY,
      dailyTasksDateKey: "",
      dailyTasksClaims: {},
      dailyTasksProgress: {
        level1Complete: 0,
        piecesPlaced: 0,
        wheelSpins: 0,
        raceActions: 0,
        piggyClaims: 0,
      },
      dailyTasksMainRewardClaimed: false,
      dailyTasksDayIndex: 1,
    };
  }

  function getLeaderboardWeekId() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return d.getFullYear() + "-W" + String(weekNo).padStart(2, "0");
  }

  const RANDOM_PROFILE_NAMES = [
    "Continuum", "NovaPanda", "SunnyRanger", "PixelFox", "CaptainKiwi", "LuckyMantis",
    "StarJumper", "PuzzlePro", "QuickFit", "TrayMaster", "SlotHero", "PieceWizard",
  ];

  function generateRandomName() {
    const idx = Math.floor(Math.random() * RANDOM_PROFILE_NAMES.length);
    return RANDOM_PROFILE_NAMES[idx] || "PuzzleFan";
  }

  function generateDefaultUserName() {
    const n = Math.floor(1000000 + Math.random() * 9000000);
    return "User" + String(n);
  }

  function generatePlayerId() {
    const hex = () => Math.floor(Math.random() * 16).toString(16);
    return "p_" + Date.now().toString(36) + "_" + Array.from({ length: 8 }, hex).join("");
  }

  const PROFILE_ID_KEY = "puzzle_player_id";
  function getStablePlayerId() {
    try {
      let id = localStorage.getItem(PROFILE_ID_KEY);
      if (id && /^p_[a-z0-9_]+$/i.test(id)) return id;
      id = generatePlayerId();
      localStorage.setItem(PROFILE_ID_KEY, id);
      return id;
    } catch (_) {
      return generatePlayerId();
    }
  }

  const AVATAR_COUNT = 12;
  function getAvatarSvg(avatarId) {
    const id = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(avatarId, 10) || 0));
    const svgs = [
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#ffd93d" stroke="#f6b93b" stroke-width="2"/><circle cx="26" cy="26" r="4" fill="#333"/><circle cx="38" cy="26" r="4" fill="#333"/><path d="M22 40 Q32 48 42 40" stroke="#333" stroke-width="2" fill="none"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#a8e6cf" stroke="#7dd3a8" stroke-width="2"/><circle cx="26" cy="28" r="4" fill="#333"/><circle cx="38" cy="28" r="4" fill="#333"/><ellipse cx="32" cy="42" rx="10" ry="6" fill="#333"/><path d="M20 24 L24 20 L28 24" stroke="#333" stroke-width="1.5" fill="none"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#ff9a8b" stroke="#ff7b6b" stroke-width="2"/><circle cx="28" cy="26" r="4" fill="#333"/><circle cx="36" cy="26" r="4" fill="#333"/><path d="M24 40 Q32 46 40 40" stroke="#333" stroke-width="2" fill="none"/><circle cx="32" cy="18" r="6" fill="#333"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#dda0dd" stroke="#ba7eba" stroke-width="2"/><circle cx="26" cy="27" r="4" fill="#333"/><circle cx="38" cy="27" r="4" fill="#333"/><path d="M22 42 Q32 50 42 42" stroke="#333" stroke-width="2" fill="none"/><path d="M32 14 L36 22 L32 20 L28 22 Z" fill="#ffd700"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#87ceeb" stroke="#5eb8e6" stroke-width="2"/><circle cx="27" cy="28" r="4" fill="#333"/><circle cx="37" cy="28" r="4" fill="#333"/><path d="M24 40 Q32 46 40 40" stroke="#333" stroke-width="2" fill="none"/><ellipse cx="32" cy="16" rx="8" ry="5" fill="#333"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#ffcc80" stroke="#ffb74d" stroke-width="2"/><circle cx="26" cy="26" r="4" fill="#333"/><circle cx="38" cy="26" r="4" fill="#333"/><path d="M20 38 Q32 48 44 38" stroke="#333" stroke-width="2" fill="none"/><path d="M32 12 L34 20 L32 18 L30 20 Z" fill="#e65100"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#b5e48c" stroke="#99d98c" stroke-width="2"/><circle cx="26" cy="27" r="4" fill="#333"/><circle cx="38" cy="27" r="4" fill="#333"/><path d="M22 42 Q32 50 42 42" stroke="#333" stroke-width="2" fill="none"/><path d="M28 16 L32 12 L36 16 L32 20 Z" fill="#2d6a4f"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#e9c46a" stroke="#d4a373" stroke-width="2"/><circle cx="27" cy="26" r="4" fill="#333"/><circle cx="37" cy="26" r="4" fill="#333"/><path d="M24 40 Q32 48 40 40" stroke="#333" stroke-width="2" fill="none"/><ellipse cx="32" cy="14" rx="6" ry="4" fill="#333"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#cdb4db" stroke="#9f86c0" stroke-width="2"/><circle cx="26" cy="28" r="4" fill="#333"/><circle cx="38" cy="28" r="4" fill="#333"/><path d="M22 42 Q32 50 42 42" stroke="#333" stroke-width="2" fill="none"/><path d="M20 18 Q32 8 44 18" stroke="#333" stroke-width="2" fill="none"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#ffafcc" stroke="#ff8fab" stroke-width="2"/><circle cx="26" cy="27" r="4" fill="#333"/><circle cx="38" cy="27" r="4" fill="#333"/><path d="M22 40 Q32 48 42 40" stroke="#333" stroke-width="2" fill="none"/><circle cx="32" cy="16" r="5" fill="#333"/><path d="M24 22 Q32 28 40 22" stroke="#333" stroke-width="1.5" fill="none"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#a2d2ff" stroke="#7eb8e6" stroke-width="2"/><circle cx="27" cy="27" r="4" fill="#333"/><circle cx="37" cy="27" r="4" fill="#333"/><path d="M24 42 Q32 50 40 42" stroke="#333" stroke-width="2" fill="none"/><rect x="26" y="12" width="12" height="6" rx="2" fill="#333"/></svg>',
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="30" fill="#d4a373" stroke="#bc6c25" stroke-width="2"/><circle cx="26" cy="27" r="4" fill="#333"/><circle cx="38" cy="27" r="4" fill="#333"/><path d="M22 42 Q32 50 42 42" stroke="#333" stroke-width="2" fill="none"/><path d="M32 10 L36 18 L32 16 L28 18 Z" fill="#606c38"/></svg>',
    ];
    return svgs[id] || svgs[0];
  }

  const ACCESSORY_DEFS = [
    { id: "none", displayName: "None", iconSvg: "", overlaySvg: "" },
    { id: "glasses_round", displayName: "Round Glasses", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="32" rx="10" ry="8" fill="none" stroke="#333" stroke-width="2"/><ellipse cx="40" cy="32" rx="10" ry="8" fill="none" stroke="#333" stroke-width="2"/><path d="M34 30 L30 28" stroke="#333" stroke-width="2"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26" cy="26" rx="10" ry="8" fill="none" stroke="#333" stroke-width="1.8"/><ellipse cx="38" cy="26" rx="10" ry="8" fill="none" stroke="#333" stroke-width="1.8"/><path d="M36 25 L28 25" stroke="#333" stroke-width="1.5"/></svg>' },
    { id: "glasses_sunglasses", displayName: "Sunglasses", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="26" width="14" height="10" rx="2" fill="#1a1a2e"/><rect x="36" y="26" width="14" height="10" rx="2" fill="#1a1a2e"/><path d="M28 28 L36 28" stroke="#16213e" stroke-width="3"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="18" y="22" width="14" height="12" rx="2" fill="#1a1a2e"/><rect x="32" y="22" width="14" height="12" rx="2" fill="#1a1a2e"/><path d="M32 25 L32 25" stroke="#0f0f23" stroke-width="4"/></svg>' },
    { id: "mask_medical", displayName: "Medical Mask", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="16" y="28" width="32" height="18" rx="4" fill="#fff" stroke="#ccc" stroke-width="1"/><path d="M32 28 v18 M20 36 h24" stroke="#e0e0e0" stroke-width="1"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M14 34 Q32 28 50 34 L50 52 Q32 48 14 52 Z" fill="#fff" stroke="#ddd" stroke-width="1"/><path d="M32 34 v18 M18 42 h28" stroke="#e8e8e8" stroke-width="1"/></svg>' },
    { id: "moustache", displayName: "Moustache", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M20 36 Q32 42 44 36" stroke="#333" stroke-width="3" fill="none"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M22 38 Q28 42 32 40 Q36 42 42 38" stroke="#2d2d2d" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>' },
    { id: "hat_cap", displayName: "Cap", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M8 28 L32 8 L56 28 L56 36 L8 36 Z" fill="#1a237e"/><ellipse cx="32" cy="28" rx="24" ry="6" fill="#283593"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M10 24 L32 4 L54 24 L54 30 L10 30 Z" fill="#1a237e"/><ellipse cx="32" cy="24" rx="22" ry="5" fill="#283593"/></svg>' },
    { id: "hat_cowboy", displayName: "Cowboy Hat", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="32" rx="28" ry="4" fill="#5d4037"/><path d="M32 8 Q12 20 16 28 Q20 24 32 22 Q44 24 48 28 Q52 20 32 8 Z" fill="#6d4c41"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="26" rx="26" ry="4" fill="#5d4037"/><path d="M32 2 Q8 18 14 26 Q20 22 32 20 Q44 22 50 26 Q56 18 32 2 Z" fill="#6d4c41"/></svg>' },
    { id: "crown", displayName: "Crown", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M8 40 L16 28 L32 36 L48 28 L56 40 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1"/><circle cx="32" cy="20" r="4" fill="#ffd700"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M12 38 L20 26 L32 32 L44 26 L52 38 Z" fill="#ffd700" stroke="#b8860b" stroke-width="1"/><circle cx="32" cy="22" r="3" fill="#ffd700"/></svg>' },
    { id: "headband", displayName: "Headband", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M8 22 Q32 14 56 22" stroke="#e91e63" stroke-width="5" fill="none" stroke-linecap="round"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M6 18 Q32 10 58 18" stroke="#e91e63" stroke-width="4" fill="none" stroke-linecap="round"/></svg>' },
    { id: "bow", displayName: "Bow", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="28" cy="32" rx="8" ry="6" fill="#e91e63"/><ellipse cx="36" cy="32" rx="8" ry="6" fill="#e91e63"/><circle cx="32" cy="32" r="3" fill="#c2185b"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26" cy="16" rx="10" ry="6" fill="#e91e63"/><ellipse cx="38" cy="16" rx="10" ry="6" fill="#e91e63"/><circle cx="32" cy="16" r="3" fill="#c2185b"/></svg>' },
    { id: "flower", displayName: "Flower", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="8" fill="#ffeb3b"/><circle cx="32" cy="20" r="6" fill="#f44336"/><circle cx="40" cy="28" r="6" fill="#f44336"/><circle cx="40" cy="36" r="6" fill="#f44336"/><circle cx="32" cy="44" r="6" fill="#f44336"/><circle cx="24" cy="36" r="6" fill="#f44336"/><circle cx="24" cy="28" r="6" fill="#f44336"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="14" r="5" fill="#ffeb3b"/><circle cx="32" cy="8" r="4" fill="#f44336"/><circle cx="38" cy="12" r="4" fill="#f44336"/><circle cx="38" cy="18" r="4" fill="#f44336"/><circle cx="32" cy="22" r="4" fill="#f44336"/><circle cx="26" cy="18" r="4" fill="#f44336"/><circle cx="26" cy="12" r="4" fill="#f44336"/></svg>' },
    { id: "star", displayName: "Star", iconSvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4 L36 24 L56 24 L40 36 L44 56 L32 44 L20 56 L24 36 L8 24 L28 24 Z" fill="#ffd700"/></svg>', overlaySvg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 2 L34 18 L50 18 L38 28 L42 44 L32 36 L22 44 L26 28 L14 18 L30 18 Z" fill="#ffd700" stroke="#b8860b" stroke-width="0.5"/></svg>' },
  ];

  function getAccessoryById(id) {
    if (!id || id === "none") return ACCESSORY_DEFS[0];
    const def = ACCESSORY_DEFS.find((a) => a.id === id);
    return def || ACCESSORY_DEFS[0];
  }

  function getAccessoryOverlaySvg(accessoryId) {
    const def = getAccessoryById(accessoryId);
    return def.overlaySvg || "";
  }

  function renderPlayerAvatar(opts) {
    const avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(opts.avatarId, 10) || 0));
    const accessoryId = opts.accessoryId === undefined || opts.accessoryId === null ? "none" : String(opts.accessoryId);
    const size = opts.size || "medium";
    const baseSvg = getAvatarSvg(avatarId);
    const overlaySvg = getAccessoryOverlaySvg(accessoryId);
    const sizeClass = "player-avatar-combo--" + (["small", "medium", "large"].indexOf(size) >= 0 ? size : "medium");
    let html = "<div class=\"player-avatar-combo " + sizeClass + "\">";
    html += "<span class=\"player-avatar-combo__base\">" + baseSvg + "</span>";
    if (overlaySvg) {
      html += "<span class=\"player-avatar-combo__accessory\">" + overlaySvg + "</span>";
    }
    html += "</div>";
    return html;
  }

  const BOT_NAMES = [
    "PuzzleMaster", "JigsawJane", "PieceHunter", "GridWalker", "SlotFiller",
    "TrayTamer", "QuickFit", "CalmPuzzler", "StarCollector", "LevelRush",
    "SmoothPlacer", "NoMistakes", "LuckyDrop", "TrophySeeker", "CupRunner",
    "PaceSetter", "ZenPuzzle", "FlashFit", "BreezeMode", "ChillBuilder",
    "ProPlacer", "AceSolver", "SwiftHand", "CleanSlate", "GoldenPieces",
    "SilverSlots", "BronzeTray", "MysterySolver", "PatternPro", "EdgeFirst",
  ];

  class LeaderboardManager {
    constructor(saveRef, persistFn) {
      this._save = saveRef;
      this._persist = persistFn || (() => {});
    }

    getPlayerScore() {
      return Math.max(0, parseInt(this._save.piecesCollectedTotal, 10) || 0);
    }

    incrementOnPiecePlaced() {
      const prev = this.getPlayerScore();
      this._save.piecesCollectedTotal = prev + 1;
      const weekId = getLeaderboardWeekId();
      if (this._save.leaderboardWeekId !== weekId) {
        this._save.leaderboardWeekId = weekId;
        this._save.weeklyPiecesCollected = 1;
      } else {
        this._save.weeklyPiecesCollected = (this._save.weeklyPiecesCollected || 0) + 1;
      }
      this._persist();
    }

    generateBotLeaderboard(playerScore) {
      const count = 9;
      const minScore = Math.max(0, playerScore - 80);
      const maxScore = Math.max(playerScore + 120, 100);
      const entries = [];
      for (let i = 0; i < count; i++) {
        const baseName = BOT_NAMES[i % BOT_NAMES.length];
        const name = i < BOT_NAMES.length ? baseName : baseName + " " + (Math.floor(i / BOT_NAMES.length) + 1);
        const base = minScore + Math.floor((maxScore - minScore) * (i / (count + 1)));
        const score = Math.max(0, base + Math.floor((Math.random() - 0.5) * 40));
        entries.push({
          id: "bot_" + i,
          name,
          score,
          isPlayer: false,
          initials: baseName.slice(0, 2).toUpperCase(),
        });
      }
      return entries;
    }

    getLeaderboardEntries() {
      const playerScore = this.getPlayerScore();
      const bots = this.generateBotLeaderboard(playerScore);
      const profile = this._save.playerProfile;
      const playerName = (profile && profile.name && String(profile.name).trim()) ? String(profile.name).trim() : "You";
      const avatarId = (profile && typeof profile.avatarId === "number") ? Math.max(0, Math.min(AVATAR_COUNT - 1, profile.avatarId)) : 0;
      const accessoryId = (profile && profile.accessoryId) ? String(profile.accessoryId) : "none";
      const playerEntry = {
        id: "player",
        name: playerName,
        score: playerScore,
        isPlayer: true,
        initials: playerName.slice(0, 2).toUpperCase() || "YO",
        avatarId,
        accessoryId,
      };
      const combined = bots.concat([playerEntry]);
      combined.sort((a, b) => (b.score - a.score));
      let final = combined.slice(0, 10);
      if (final.length === 10 && !final.some((e) => e.isPlayer)) {
        final = final.slice(0, 9).concat([playerEntry]);
        final.sort((a, b) => (b.score - a.score));
      }
      return final.map((e, i) => ({ ...e, rank: i + 1 }));
    }

    grantWeeklyHammerRewardIfEligible(entries) {
      const weekId = getLeaderboardWeekId();
      if (this._save.leaderboardHammerRewardWeekId === weekId) return 0;
      const player = (entries || []).find((e) => e.isPlayer);
      if (!player || player.rank > 3) return 0;
      const amount = player.rank === 1 ? 8 : (player.rank === 2 ? 5 : 3);
      this._save.eventHammers = (this._save.eventHammers || 0) + amount;
      this._save.leaderboardHammerRewardWeekId = weekId;
      this._persist();
      return amount;
    }

    renderChest(type) {
      const labels = { gold: "Gold Chest", silver: "Silver Chest", bronze: "Bronze Chest" };
      const wrap = document.createElement("div");
      wrap.className = "leaderboard-chest-wrap leaderboard-chest-wrap--" + type;
      const chest = document.createElement("div");
      chest.className = "leaderboard-chest leaderboard-chest--" + type;
      chest.setAttribute("aria-hidden", "true");
      const label = document.createElement("span");
      label.className = "leaderboard-chest-label";
      label.textContent = labels[type] || type;
      wrap.appendChild(chest);
      wrap.appendChild(label);
      return wrap;
    }

    getWeeklyRemainingMs() {
      const now = new Date();
      const end = new Date(now);
      const day = end.getDay();
      const daysUntilMonday = day === 0 ? 1 : 8 - day;
      end.setDate(end.getDate() + daysUntilMonday);
      end.setHours(0, 0, 0, 0);
      return Math.max(0, end.getTime() - now.getTime());
    }

    _renderLeaderboardAvatar(entry, size) {
      const wrap = document.createElement("div");
      wrap.className = size === "podium" ? "leaderboard-podium-avatar" : "leaderboard-row-avatar";
      const usePlayerAvatar = entry.isPlayer && (typeof entry.avatarId === "number" || typeof entry.avatarId === "string");
      if (usePlayerAvatar) {
        wrap.classList.add("leaderboard-avatar--svg");
        wrap.innerHTML = renderPlayerAvatar({ avatarId: entry.avatarId, accessoryId: entry.accessoryId || "none", size: "small" });
      } else {
        const img = document.createElement("img");
        img.className = "leaderboard-avatar-img";
        img.src = LEADERBOARD_BOT_AVATAR_SRC;
        img.alt = "";
        wrap.appendChild(img);
      }
      return wrap;
    }

    openLeaderboardModal() {
      const modal = document.getElementById("leaderboard-modal");
      if (!modal) return;
      const entries = this.getLeaderboardEntries();
      const hammersGranted = this.grantWeeklyHammerRewardIfEligible(entries);
      const top3 = [entries[0], entries[1], entries[2]].map((entry) => entry || { rank: 0, name: "—", score: 0, isPlayer: false });
      const rest = entries.slice(3);
      const podiumOrder = [top3[2], top3[0], top3[1]];
      const podiumMeta = [
        { rankClass: "rank-3", wreath: LEADERBOARD_TOP_WREATH_BRONZE_SRC, reward: LEADERBOARD_REWARD_BRONZE_SRC, cardClass: "leaderboard-podium-card--third" },
        { rankClass: "rank-1", wreath: LEADERBOARD_TOP_WREATH_GOLD_SRC, reward: LEADERBOARD_REWARD_GOLD_SRC, cardClass: "leaderboard-podium-card--first" },
        { rankClass: "rank-2", wreath: LEADERBOARD_TOP_WREATH_SILVER_SRC, reward: LEADERBOARD_REWARD_SILVER_SRC, cardClass: "leaderboard-podium-card--second" }
      ];

      const titleEl = document.getElementById("leaderboard-title");
      if (titleEl) titleEl.textContent = "Weekly Leaders";
      const subtitleEl = document.getElementById("leaderboard-subtitle");
      if (subtitleEl) subtitleEl.textContent = hammersGranted > 0 ? ("Puzzle Pieces Collected • +" + hammersGranted + " hammers") : "Puzzle Pieces Collected";
      const timerEl = document.getElementById("leaderboard-timer");
      if (timerEl) {
        const ms = this.getWeeklyRemainingMs();
        timerEl.textContent = "Ends in: " + formatRemaining(ms);
      }

      const bgEl = modal.querySelector(".leaderboard-screen-bg");
      if (bgEl) bgEl.style.backgroundImage = "url('" + LEADERBOARD_BG_SRC + "')";
      const bannerEl = modal.querySelector(".leaderboard-bottom-banner");
      if (bannerEl) bannerEl.style.backgroundImage = "url('" + LEADERBOARD_BANNER_SRC + "')";
      const backBtn = document.getElementById("leaderboard-close");
      if (backBtn) backBtn.style.backgroundImage = "url('" + LEADERBOARD_NAV_BACK_SRC + "')";
      const infoBtnEl = document.getElementById("btn-leaderboard-info");
      if (infoBtnEl) infoBtnEl.style.backgroundImage = "url('" + LEADERBOARD_NAV_INFO_SRC + "')";

      const top3El = document.getElementById("leaderboard-top3");
      if (top3El) {
        top3El.innerHTML = "";
        podiumOrder.forEach((e, i) => {
          const meta = podiumMeta[i];
          const card = document.createElement("div");
          card.className = "leaderboard-podium-card " + meta.cardClass + (e.isPlayer ? " leaderboard-entry--you" : "");

          const topBadge = document.createElement("div");
          topBadge.className = "leaderboard-podium-badge " + meta.rankClass;
          topBadge.style.backgroundImage = "url('" + meta.wreath + "')";
          const avatar = this._renderLeaderboardAvatar(e, "podium");
          topBadge.appendChild(avatar);

          const nameEl = document.createElement("div");
          nameEl.className = "leaderboard-podium-name";
          nameEl.textContent = e.name;

          const scoreEl = document.createElement("div");
          scoreEl.className = "leaderboard-podium-score";
          scoreEl.innerHTML = "<span>Points:</span><span>" + e.score + "</span>";

          const reward = document.createElement("div");
          reward.className = "leaderboard-podium-reward";
          reward.style.backgroundImage = "url('" + meta.reward + "')";

          card.appendChild(topBadge);
          card.appendChild(nameEl);
          card.appendChild(scoreEl);
          card.appendChild(reward);
          top3El.appendChild(card);
        });
      }

      const listEl = document.getElementById("leaderboard-list");
      if (listEl) {
        listEl.innerHTML = "";
        rest.forEach((e) => {
          const row = document.createElement("div");
          row.className = "leaderboard-row" + (e.isPlayer ? " leaderboard-entry--you" : "");

          const rankEl = document.createElement("span");
          rankEl.className = "leaderboard-row-rank";
          rankEl.textContent = String(e.rank);

          const nameEl = document.createElement("span");
          nameEl.className = "leaderboard-row-name";
          nameEl.textContent = e.name;

          const scoreWrap = document.createElement("span");
          scoreWrap.className = "leaderboard-row-score";
          scoreWrap.innerHTML = "<span class=\"leaderboard-row-score-label\">Points:</span> <span>" + e.score + "</span>";

          const avatarEl = this._renderLeaderboardAvatar(e, "row");

          row.appendChild(rankEl);
          row.appendChild(nameEl);
          row.appendChild(scoreWrap);
          row.appendChild(avatarEl);
          listEl.appendChild(row);
        });
      }

      modal.classList.remove("hidden");
      document.documentElement.classList.add("leaderboard-screen-active");
      document.body.classList.add("leaderboard-screen-active");
      const close = () => this.closeLeaderboardModal();
      document.getElementById("leaderboard-close").onclick = close;
      const infoOverlay = document.getElementById("leaderboard-info-overlay");
      const btnLeaderboardInfo = document.getElementById("btn-leaderboard-info");
      const closeInfo = () => {
        if (infoOverlay) infoOverlay.classList.add("hidden");
      };
      if (btnLeaderboardInfo) {
        btnLeaderboardInfo.onclick = () => {
          if (infoOverlay) infoOverlay.classList.remove("hidden");
        };
      }
      if (infoOverlay) {
        infoOverlay.onclick = (e) => { if (e.target === infoOverlay) closeInfo(); };
        const infoContinue = document.getElementById("leaderboard-info-continue");
        if (infoContinue) infoContinue.onclick = closeInfo;
      }
      if (this._leaderboardEscapeHandler) {
        window.removeEventListener("keydown", this._leaderboardEscapeHandler);
      }
      this._leaderboardEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const info = document.getElementById("leaderboard-info-overlay");
        if (info && !info.classList.contains("hidden")) {
          closeInfo();
          e.preventDefault();
          return;
        }
        e.preventDefault();
        close();
      };
      window.addEventListener("keydown", this._leaderboardEscapeHandler);
    }

    closeLeaderboardModal() {
      const modal = document.getElementById("leaderboard-modal");
      if (modal) modal.classList.add("hidden");
      document.documentElement.classList.remove("leaderboard-screen-active");
      document.body.classList.remove("leaderboard-screen-active");
      document.getElementById("leaderboard-close").onclick = null;
      const infoOverlay = document.getElementById("leaderboard-info-overlay");
      if (infoOverlay) {
        infoOverlay.classList.add("hidden");
        infoOverlay.onclick = null;
      }
      const infoContinue = document.getElementById("leaderboard-info-continue");
      if (infoContinue) infoContinue.onclick = null;
      const btnLeaderboardInfo = document.getElementById("btn-leaderboard-info");
      if (btnLeaderboardInfo) btnLeaderboardInfo.onclick = null;
      if (this._leaderboardEscapeHandler) {
        window.removeEventListener("keydown", this._leaderboardEscapeHandler);
        this._leaderboardEscapeHandler = null;
      }
    }
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        const merged = { ...getDefaultSave(), ...data };
        if (merged.rewards && typeof merged.rewards.trophiesGoldCup === "undefined") {
          merged.rewards.trophiesGoldCup = false;
        }
        if (typeof merged.allCardsRewardClaimed === "undefined") {
          merged.allCardsRewardClaimed = false;
        }
        if (typeof merged.bpStarsTotal !== "number") {
          merged.bpStarsTotal = typeof merged.starTokens === "number" ? merged.starTokens : 0;
        }
        if (typeof merged.wheelNextFreeAt !== "number") merged.wheelNextFreeAt = 0;
        if (typeof merged.battlePassPremiumActive !== "boolean") merged.battlePassPremiumActive = false;
        if (typeof merged.xpTotal !== "number") merged.xpTotal = 0;
        if (!merged.bpClaims || !Array.isArray(merged.bpClaims.freeClaimedTiers)) {
          merged.bpClaims = { freeClaimedTiers: [], premiumClaimedTiers: [] };
        }
        if (!Array.isArray(merged.bpClaims.premiumClaimedTiers)) merged.bpClaims.premiumClaimedTiers = [];
        if (typeof merged.piecesCollectedTotal !== "number") merged.piecesCollectedTotal = 0;
        if (merged.leaderboardWeekId === undefined) merged.leaderboardWeekId = null;
        if (typeof merged.weeklyPiecesCollected !== "number") merged.weeklyPiecesCollected = 0;
        if (typeof merged.bpTutorStep !== "number") merged.bpTutorStep = 0;
        if (typeof merged.bonusLevelCompleted !== "boolean") merged.bonusLevelCompleted = false;
        if (typeof merged.bonusLevelTimesPlayed !== "number") merged.bonusLevelTimesPlayed = 0;
        if (typeof merged.gemsTotal !== "number") merged.gemsTotal = 0;
        if (typeof merged.albumStars !== "number") merged.albumStars = 0;
        if (typeof merged.eventHammers !== "number") merged.eventHammers = 0;
        if (typeof merged.piggyGemsStored !== "number") merged.piggyGemsStored = 0;
        if (typeof merged.piggyCap !== "number") merged.piggyCap = PIGGY_CAP_DEFAULT;
        if (typeof merged.piggyBroken !== "boolean") merged.piggyBroken = false;
        if (typeof merged.piggyEarnPerPiece !== "number") merged.piggyEarnPerPiece = PIGGY_EARN_PER_PIECE;
        if (typeof migrateLegacyCardIdsInSave === "function") migrateLegacyCardIdsInSave(merged);
        if (!merged.stickerLevel || typeof merged.stickerLevel !== "object") {
          merged.stickerLevel = { placed: {}, unlocked: {}, firstPackOpened: false };
        }
        // Migrate the previous free-placement array-of-{id,x,y} into a simple
        // id->true map. Position is no longer stored — slots are fixed.
        if (Array.isArray(merged.stickerLevel.placed)) {
          const map = {};
          merged.stickerLevel.placed.forEach((p) => {
            if (p && typeof p === "object" && p.id) map[p.id] = true;
          });
          merged.stickerLevel.placed = map;
        }
        if (!merged.stickerLevel.placed || typeof merged.stickerLevel.placed !== "object") {
          merged.stickerLevel.placed = {};
        }
        if (!merged.stickerLevel.unlocked || typeof merged.stickerLevel.unlocked !== "object") {
          merged.stickerLevel.unlocked = {};
        }
        // Any sticker already placed must also count as unlocked so old saves
        // don't end up with placed-but-not-unlocked entries.
        Object.keys(merged.stickerLevel.placed).forEach((id) => {
          if (merged.stickerLevel.placed[id]) merged.stickerLevel.unlocked[id] = true;
        });
        if (typeof merged.stickerLevel.firstPackOpened !== "boolean") {
          const hasActivity = Object.keys(merged.stickerLevel.placed).length > 0
            || Object.keys(merged.stickerLevel.unlocked).length > 0;
          merged.stickerLevel.firstPackOpened = hasActivity;
        }
        // Pending sticker packs awarded by other features (e.g. Wheel of
        // Fortune) that the player hasn't opened yet — a list of tier numbers.
        if (!Array.isArray(merged.stickerLevel.pendingPacks)) {
          merged.stickerLevel.pendingPacks = [];
        }
        // The previous multi-room sticker-album state is no longer used.
        if (merged.stickerRooms) delete merged.stickerRooms;
        if (!merged.bpPremiumPackMeta || typeof merged.bpPremiumPackMeta !== "object") merged.bpPremiumPackMeta = {};
        if (typeof merged.lostTempleCurrentStage !== "number") merged.lostTempleCurrentStage = 0;
        if (!merged.lostTempleState || typeof merged.lostTempleState !== "object") merged.lostTempleState = null;
        if (typeof merged.leaderboardHammerRewardWeekId === "undefined") merged.leaderboardHammerRewardWeekId = null;
        if (!merged.raceState || typeof merged.raceState !== "object") {
          merged.raceState = { active: false, startTime: 0, playerPoints: 0, botPoints: [0, 0, 0, 0], winner: null, claimed: false };
        }
        if (typeof merged.puzzleEnergy !== "number") merged.puzzleEnergy = DEFAULT_PUZZLE_ENERGY;
        if (typeof merged.rubyCaveTutorialDone !== "boolean") merged.rubyCaveTutorialDone = false;
        if (typeof merged.rubyCaveRewardClaimed !== "boolean") merged.rubyCaveRewardClaimed = false;
        // Event energy was raised from 5 to 25 — one-time top-up for old saves.
        if (!merged.rubyCaveEnergyV2) {
          merged.rubyCaveEnergy = 25;
          merged.rubyCaveNextEnergyAt = null;
          merged.rubyCaveEnergyV2 = true;
        }
        if (!merged.rubyCaveStickerPlaced || typeof merged.rubyCaveStickerPlaced !== "object") merged.rubyCaveStickerPlaced = {};
        if (typeof merged.dailyTasksDateKey !== "string") merged.dailyTasksDateKey = "";
        if (!merged.dailyTasksClaims || typeof merged.dailyTasksClaims !== "object") merged.dailyTasksClaims = {};
        if (!merged.dailyTasksProgress || typeof merged.dailyTasksProgress !== "object") {
          merged.dailyTasksProgress = { level1Complete: 0, piecesPlaced: 0, wheelSpins: 0, raceActions: 0, piggyClaims: 0 };
        }
        if (typeof merged.dailyTasksProgress.level1Complete !== "number") merged.dailyTasksProgress.level1Complete = 0;
        if (typeof merged.dailyTasksProgress.piecesPlaced !== "number") merged.dailyTasksProgress.piecesPlaced = 0;
        if (typeof merged.dailyTasksProgress.wheelSpins !== "number") merged.dailyTasksProgress.wheelSpins = 0;
        if (typeof merged.dailyTasksProgress.raceActions !== "number") merged.dailyTasksProgress.raceActions = 0;
        if (typeof merged.dailyTasksProgress.piggyClaims !== "number") merged.dailyTasksProgress.piggyClaims = 0;
        if (typeof merged.dailyTasksMainRewardClaimed !== "boolean") merged.dailyTasksMainRewardClaimed = false;
        if (typeof merged.dailyTasksDayIndex !== "number") merged.dailyTasksDayIndex = 1;
        merged.collectionUnlocked = true;
        merged.collectionTutorialCompleted = true;
        merged.battlePassUnlocked = true;
        merged.bpTutorCompleted = true;
        merged.wheelUnlocked = true;
        merged.wheelTutorialSeen = true;
        merged.leaderboardUnlocked = true;
        merged.leaderboardTutorCompleted = true;
        merged.bonusLevelUnlocked = true;
        merged.raceUnlocked = true;
        merged.raceTutorialCompleted = true;
        merged.lostTempleUnlocked = true;
        merged.lostTempleTutorialCompleted = true;
        merged.profileSetupCompleted = true;
        if (!merged.albumEvent) {
          merged.albumEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
        }
        if (!merged.battlePassEvent) {
          merged.battlePassEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
        }
        if (!merged.lostTempleEvent) {
          merged.lostTempleEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
        }
        if (!merged.playerProfile || typeof merged.playerProfile !== "object") {
          const stableId = getStablePlayerId();
          merged.playerProfile = {
            id: stableId,
            name: generateDefaultUserName(),
            avatarId: 0,
            createdAt: Date.now(),
          };
        }
        if (!merged.playerProfile.id) merged.playerProfile.id = getStablePlayerId();
        if (typeof merged.playerProfile.avatarId !== "number") merged.playerProfile.avatarId = 0;
        merged.playerProfile.avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, merged.playerProfile.avatarId));
        if (merged.playerProfile.accessoryId === undefined || merged.playerProfile.accessoryId === null) merged.playerProfile.accessoryId = "none";
        if (typeof merged.playerProfile.accessoryId !== "string") merged.playerProfile.accessoryId = "none";
        if (!merged.playerProfile.createdAt) merged.playerProfile.createdAt = Date.now();
        return merged;
      }
      const legacy = getDefaultSave();
      const level = localStorage.getItem(STORAGE_KEYS.currentLevel);
      if (level !== null) legacy.currentLevel = Math.max(0, parseInt(level, 10));
      const coins = localStorage.getItem(STORAGE_KEYS.coins);
      if (coins !== null) legacy.coins = parseInt(coins, 10);
      const music = localStorage.getItem(STORAGE_KEYS.musicOn);
      if (music !== null) legacy.musicOn = music;
      const sfx = localStorage.getItem(STORAGE_KEYS.sfxOn);
      if (sfx !== null) legacy.sfxOn = sfx;
      return legacy;
    } catch (_) {
      return getDefaultSave();
    }
  }

  function saveSave(data) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  function getRaceState(save) {
    const rs = save.raceState || {};
    return {
      active: !!rs.active,
      startTime: typeof rs.startTime === "number" ? rs.startTime : 0,
      playerPoints: Math.min(RACE_TARGET_POINTS, Math.max(0, parseInt(rs.playerPoints, 10) || 0)),
      botPoints: Array.isArray(rs.botPoints) ? rs.botPoints.slice(0, 4).map((n) => Math.min(RACE_TARGET_POINTS, Math.max(0, parseInt(n, 10) || 0))) : [0, 0, 0, 0],
      winner: rs.winner || null,
      claimed: !!rs.claimed,
    };
  }

  function getRaceBotPointsAtTime(save, now) {
    const rs = getRaceState(save);
    if (!rs.active || rs.winner) return rs.botPoints.slice();
    const start = rs.startTime;
    if (!start) return [0, 0, 0, 0];
    const elapsed = Math.max(0, (now - start) / 1000);
    return RACE_BOT_INTERVALS_MS.map((intervalMs, i) => {
      const intervalSec = intervalMs / 1000;
      return Math.min(RACE_TARGET_POINTS, Math.floor(elapsed / intervalSec));
    });
  }

  function syncRaceBotPoints(save) {
    const rs = save.raceState || {};
    if (!rs.active || rs.winner) return;
    const now = Date.now();
    const botPoints = getRaceBotPointsAtTime(save, now);
    if (!save.raceState.botPoints) save.raceState.botPoints = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) save.raceState.botPoints[i] = botPoints[i];
  }

  function raceOnPuzzleCompleted(save) {
    const rs = getRaceState(save);
    if (!rs.active || rs.winner) return false;
    if (!save.raceState) save.raceState = { active: true, startTime: rs.startTime, playerPoints: 0, botPoints: [0, 0, 0, 0], winner: null, claimed: false };
    save.raceState.playerPoints = Math.min(RACE_TARGET_POINTS, (save.raceState.playerPoints || 0) + 1);
    if (save.raceState.playerPoints >= RACE_TARGET_POINTS) {
      save.raceState.winner = "player";
      return true;
    }
    syncRaceBotPoints(save);
    for (let i = 0; i < 4; i++) {
      if (save.raceState.botPoints[i] >= RACE_TARGET_POINTS) {
        save.raceState.winner = "bot" + (i + 1);
        return true;
      }
    }
    return false;
  }

  function startRace(save) {
    if (!save.raceState) save.raceState = { active: false, startTime: 0, playerPoints: 0, botPoints: [0, 0, 0, 0], winner: null, claimed: false };
    save.raceState.active = true;
    save.raceState.startTime = Date.now();
    save.raceState.playerPoints = 0;
    save.raceState.botPoints = [0, 0, 0, 0];
    save.raceState.winner = null;
    save.raceState.claimed = false;
  }

  function isRaceActive(save) {
    const rs = getRaceState(save);
    return rs.active && !rs.winner;
  }

  function isRaceFinished(save) {
    return !!(save.raceState && save.raceState.winner);
  }

  function getRaceWinner(save) {
    return (save.raceState && save.raceState.winner) || null;
  }

  function isRaceClaimable(save) {
    return getRaceWinner(save) === "player" && !(save.raceState && save.raceState.claimed);
  }

  function formatRaceRemaining(ms) {
    const remaining = Math.max(0, Math.floor(ms / 1000));
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor((remaining % 86400) / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    return days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
  }

  const SHAPE_TYPES = ["triangle", "square", "pentagon", "hexagon", "star", "circle", "heart"];
  const PIECE_SIZE = 80;

  class ShapeRenderer {
    static drawShapePath(ctx, shapeType, rotationDeg = 0) {
      const cx = 0.5;
      const cy = 0.5;
      const r = 0.45;
      const rot = (rotationDeg * Math.PI) / 180;
      const cos = Math.cos;
      const sin = Math.sin;
      const at = (i, n, radius) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2 + rot;
        return { x: cx + cos(a) * radius, y: cy + sin(a) * radius };
      };
      ctx.beginPath();
      switch (shapeType) {
        case "triangle": {
          for (let i = 0; i < 3; i++) {
            const p = at(i, 3, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "square": {
          for (let i = 0; i < 4; i++) {
            const p = at(i, 4, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "pentagon": {
          for (let i = 0; i < 5; i++) {
            const p = at(i, 5, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "hexagon": {
          for (let i = 0; i < 6; i++) {
            const p = at(i, 6, r);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "star": {
          const n = 5;
          for (let i = 0; i < n * 2; i++) {
            const p = at(i, n * 2, i % 2 === 0 ? r : r * 0.4);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.closePath();
          break;
        }
        case "circle":
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          break;
        case "heart": {
          const t = 0.5;
          const w = 0.45;
          ctx.moveTo(t, cy - r * 0.3);
          ctx.bezierCurveTo(t + w * 0.5, cy - r * 0.9, t + w, cy - r * 0.2, t + w * 0.5, cy + r * 0.2);
          ctx.bezierCurveTo(t, cy + r * 0.5, t, cy + r * 0.9, t, cy + r * 0.9);
          ctx.bezierCurveTo(t, cy + r * 0.9, t - w * 0.5, cy + r * 0.2, t - w * 0.5, cy + r * 0.2);
          ctx.bezierCurveTo(t - w, cy - r * 0.2, t - w * 0.5, cy - r * 0.9, t, cy - r * 0.3);
          ctx.closePath();
          break;
        }
        default:
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
      }
    }

    static render(width, height, shapeType, seed, rotationDeg = 0) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, width, height);

      const hue = (seed * 137) % 360;
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, `hsl(${hue}, 75%, 72%)`);
      grad.addColorStop(0.5, `hsl(${(hue + 35) % 360}, 80%, 78%)`);
      grad.addColorStop(1, `hsl(${(hue + 70) % 360}, 75%, 68%)`);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(Math.min(width, height) * 0.9, Math.min(width, height) * 0.9);
      ctx.translate(-0.5, -0.5);
      this.drawShapePath(ctx, shapeType, rotationDeg);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.45)";
      ctx.lineWidth = 0.08;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      if (seed % 3 === 1) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.translate(width / 2, height / 2);
        ctx.scale(Math.min(width, height) * 0.7, Math.min(width, height) * 0.7);
        ctx.translate(-0.5, -0.5);
        this.drawShapePath(ctx, shapeType, rotationDeg);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.restore();
      }
      return canvas;
    }
  }

  const shapePiecesCache = {};

  function generateShapePieces(level) {
    const key = level.id != null ? "l" + level.id : level.shapeType + "-" + level.shapeSeed + "-" + level.cols + "x" + level.rows;
    if (shapePiecesCache[key]) return shapePiecesCache[key];

    const { cols, rows, shapeType, shapeSeed, rotation = 0 } = level;
    const fullWidth = cols * PIECE_SIZE;
    const fullHeight = rows * PIECE_SIZE;
    const canvas = ShapeRenderer.render(fullWidth, fullHeight, shapeType, shapeSeed, rotation);

    const urls = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const sliceCanvas = document.createElement("canvas");
        sliceCanvas.width = PIECE_SIZE;
        sliceCanvas.height = PIECE_SIZE;
        const sctx = sliceCanvas.getContext("2d");
        sctx.drawImage(
          canvas,
          col * PIECE_SIZE,
          row * PIECE_SIZE,
          PIECE_SIZE,
          PIECE_SIZE,
          0,
          0,
          PIECE_SIZE,
          PIECE_SIZE
        );
        urls.push(sliceCanvas.toDataURL("image/png"));
      }
    }
    const result = urls;
    shapePiecesCache[key] = result;
    return result;
  }

  const shapeGhostCache = {};
  function getShapeGhostDataUrl(level) {
    const key = level.id != null ? "g" + level.id : level.shapeType + "-" + level.shapeSeed + "-" + level.cols + "x" + level.rows;
    if (shapeGhostCache[key]) return shapeGhostCache[key];
    const { cols, rows, shapeType, shapeSeed, rotation = 0 } = level;
    const fullWidth = cols * PIECE_SIZE;
    const fullHeight = rows * PIECE_SIZE;
    const canvas = ShapeRenderer.render(fullWidth, fullHeight, shapeType, shapeSeed, rotation);
    const url = canvas.toDataURL("image/png");
    shapeGhostCache[key] = url;
    return url;
  }

  function generateCardArt(artSeed, size) {
    size = size || 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const hue = (artSeed * 67) % 360;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, `hsl(${hue}, 75%, 85%)`);
    grad.addColorStop(1, `hsl(${hue}, 70%, 55%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = `hsl(${(hue + 80) % 360}, 60%, 40%)`;
    ctx.beginPath();
    const cx = size / 2;
    const cy = size / 2;
    const r = size * 0.32 * (0.8 + (artSeed % 3) * 0.1);
    for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = cx + Math.cos(a) * r;
        const y = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2;
    ctx.stroke();
    return canvas.toDataURL("image/png");
  }

  function generateRewardCharacterArt(artSeed, size) {
    size = size || 200;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const cx = size / 2;
    const cy = size / 2;
    const hue = (artSeed * 67) % 360;
    for (let i = 8; i >= 0; i--) {
      const r = 60 + i * 8;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r + 20);
      g.addColorStop(0, `hsla(${hue}, 70%, 75%, ${0.15 - i * 0.012})`);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 20, 0, Math.PI * 2);
      ctx.fill();
    }
    const bodyGrad = ctx.createRadialGradient(cx, cy - 10, 0, cx, cy, 55);
    bodyGrad.addColorStop(0, `hsl(${hue}, 75%, 78%)`);
    bodyGrad.addColorStop(1, `hsl(${hue}, 70%, 50%)`);
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 42, 48, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#2d3436";
    ctx.beginPath();
    ctx.ellipse(cx - 12, cy - 8, 6, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 12, cy - 8, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    return canvas.toDataURL("image/png");
  }

  const CARDS_PER_ALBUM = 9;
  const ALBUM_DEFS = [
    { id: "africa", name: "Africa", cardIds: ["africa_0", "africa_1", "africa_2", "africa_3", "africa_4", "africa_5", "africa_6", "africa_7", "africa_8"] },
    { id: "fantasy", name: "Fantasy", cardIds: ["fantasy_0", "fantasy_1", "fantasy_2", "fantasy_3", "fantasy_4", "fantasy_5", "fantasy_6", "fantasy_7", "fantasy_8"] },
    { id: "pixar", name: "Pixar-like Cartoon", cardIds: ["pixar_0", "pixar_1", "pixar_2", "pixar_3", "pixar_4", "pixar_5", "pixar_6", "pixar_7", "pixar_8"] },
    { id: "holiday", name: "Holiday & New Year", cardIds: ["holiday_0", "holiday_1", "holiday_2", "holiday_3", "holiday_4", "holiday_5", "holiday_6", "holiday_7", "holiday_8"] },
    { id: "space", name: "Space Opera", cardIds: ["space_0", "space_1", "space_2", "space_3", "space_4", "space_5", "space_6", "space_7", "space_8"] },
    { id: "postapoc", name: "Post-Apocalypse", cardIds: ["postapoc_0", "postapoc_1", "postapoc_2", "postapoc_3", "postapoc_4", "postapoc_5", "postapoc_6", "postapoc_7", "postapoc_8"] },
    { id: "paris", name: "Paris", cardIds: ["paris_0", "paris_1", "paris_2", "paris_3", "paris_4", "paris_5", "paris_6", "paris_7", "paris_8"] },
    { id: "victorian", name: "Victorian Era", cardIds: ["victorian_0", "victorian_1", "victorian_2", "victorian_3", "victorian_4", "victorian_5", "victorian_6", "victorian_7", "victorian_8"] },
  ];

  const LEGACY_CARD_ID_MAP = {};
  for (let i = 0; i < CARDS_PER_ALBUM; i++) {
    LEGACY_CARD_ID_MAP["fresh_" + i] = "africa_" + i;
    LEGACY_CARD_ID_MAP["safari_" + i] = "fantasy_" + i;
  }

  function migrateLegacyCardIdsInSave(save) {
    const cards = save && save.cards;
    if (!cards) return;
    for (const [legacyId, newId] of Object.entries(LEGACY_CARD_ID_MAP)) {
      if (cards.collected && cards.collected[legacyId]) {
        cards.collected[newId] = true;
        delete cards.collected[legacyId];
      }
      if (cards.duplicates && cards.duplicates[legacyId]) {
        cards.duplicates[newId] = (cards.duplicates[newId] || 0) + (cards.duplicates[legacyId] || 0);
        delete cards.duplicates[legacyId];
      }
    }
    if (cards.newInbox && cards.newInbox.length) {
      cards.newInbox = cards.newInbox.map((id) => LEGACY_CARD_ID_MAP[id] || id);
    }
    save.albums = save.albums || {};
    ALBUM_DEFS.forEach((def) => {
      if (!save.albums[def.id]) save.albums[def.id] = { collectedCount: 0 };
      const count = (def.cardIds || []).filter((id) => cards.collected && cards.collected[id]).length;
      save.albums[def.id].collectedCount = count;
    });
  }

  const CARD_NAMES_BY_ALBUM = {
    africa: ["Elephant", "Giraffes", "Lion", "Zebra", "Waterfall", "Savanna Sunset", "Acacia Tree", "Oasis", "Village Drums"],
    fantasy: ["Dragon", "Castle", "Enchanted Forest", "Magic Staff", "Unicorn", "Wizard Hat", "Treasure Chest", "Fairy", "Knight Shield"],
    pixar: ["Robot Helper", "Kid with Backpack", "Raccoon with Cookie", "Toy Airplane", "Family Dinner", "Submarine in Bathtub", "Magical Library", "Treehouse at Sunset", "Monster in Pajamas"],
    holiday: ["Snowy Cabin", "Christmas Tree", "Gingerbread House", "Santa Silhouette", "Fireworks", "Hot Cocoa", "Reindeer with Scarf", "Snowman", "Gift Boxes"],
    space: ["Hero at Ringed Planet", "Starship in Nebula", "Alien Marketplace", "Energy Blade", "Space Station", "Droid Companion", "Desert Outpost", "Galactic Hologram", "Space Battle"],
    postapoc: ["Robot Watering Plants", "Overgrown Street", "Solar Camper", "Drone with Seeds", "Welcome Sign", "Rooftop Garden", "Robot Dog", "Subway Mushrooms", "Sunrise Valley"],
    paris: ["Eiffel Tower", "Paris Café", "Seine Boat", "Accordion Player", "Arc de Triomphe", "Montmartre Stairs", "Croissant & Coffee", "Metro Entrance", "Rainy Umbrellas"],
    victorian: ["Steam Carriage", "Parlor Chandelier", "Pocket Watch", "Feathered Hat", "Gas Lamp Library", "Train Station", "Tea Set", "Street Lanterns", "Ornate Key"],
  };
  const CARD_DEFS = {};
  ALBUM_DEFS.forEach((album, aIdx) => {
    const names = CARD_NAMES_BY_ALBUM[album.id] || [];
    for (let i = 0; i < CARDS_PER_ALBUM; i++) {
      const id = album.cardIds[i];
      const num = String(i + 1).padStart(2, "0");
      const rarity = i < 6 ? 1 : i < 8 ? 2 : 3;
      CARD_DEFS[id] = {
        id,
        name: names[i] || album.name + " " + (i + 1),
        rarity,
        rarityStars: rarity,
        albumId: album.id,
        artSeed: aIdx * 20 + i,
        imageSrc: CARD_IMAGE_BASE + album.id + "/card_" + num + ".png",
      };
    }
  });

  const PACK_RARITY_WEIGHTS = {
    1: [85, 13, 2],
    2: [65, 28, 7],
    3: [45, 40, 15],
  };
  const PACK_MIN_CARDS = 2;
  const PACK_MAX_CARDS = 5;
  const COINS_PER_DUPLICATE = { 1: 50, 2: 150, 3: 500 };
  const STAR_CHEST_COSTS = { wood: 100, silver: 250, gold: 500 };
  const CARDS_BY_RARITY = { 1: [], 2: [], 3: [] };
  Object.keys(CARD_DEFS).forEach((id) => {
    const r = CARD_DEFS[id].rarity;
    if (CARDS_BY_RARITY[r]) CARDS_BY_RARITY[r].push(id);
  });

  // ---------------------------------------------------------------------------
  // Sticker Level
  // Tapping "Stickers" opens a single playable cozy isometric room. Twenty
  // decor stickers live in a bottom tray; the player drags them into the room.
  // No collection album, no themed sub-rooms — this is a flat, direct level.
  // ---------------------------------------------------------------------------
  const STICKER_LEVEL_TOTAL = 20;
  // Each entry carries its own placement slot: a fixed normalized (x, y)
  // position inside the isometric room and the surface the sticker "belongs"
  // to (used for visual hints + future expansion). The 20 entries below are
  // the complete fixed solution for the puzzle — no free placement.
  // ===== Standalone Sticker Room: interior-object stickers =====
  // Each sticker is a small isometric SVG that matches the apartment art so
  // placing them organically furnishes the (otherwise empty) room. The art
  // lives in STICKER_ART keyed by id; `emoji` is only a last-resort fallback.
  const STICKER_ART = {
    sofa: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="80,57.1 50,70 50,54 80,41.1" fill="#cf8ca6" /><polygon points="20,57.1 50,70 50,54 20,41.1" fill="#d998b0" /><polygon points="50,28.3 80,41.1 50,54 20,41.1" fill="#e3a0ba" /><polygon points="80,73.1 50,86 50,75 80,62.1" fill="#d98fab" /><polygon points="20,73.1 50,86 50,75 20,62.1" fill="#e3a0ba" /><polygon points="50,49.3 80,62.1 50,75 20,62.1" fill="#efb3c8" /><polygon points="38,81.0 31,84 31,69 38,66.0" fill="#d590ac" /><polygon points="24,81.0 31,84 31,69 24,66.0" fill="#df9eb6" /><polygon points="31,63.0 38,66.0 31,69 24,66.0" fill="#e9a8c0" /><polygon points="76,81.0 69,84 69,69 76,66.0" fill="#d590ac" /><polygon points="62,81.0 69,84 69,69 62,66.0" fill="#df9eb6" /><polygon points="69,63.0 76,66.0 69,69 62,66.0" fill="#e9a8c0" /></svg>`,
    armchair: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="65,67.6 50,74 50,59 65,52.6" fill="#cf8ca6" /><polygon points="35,67.6 50,74 50,59 35,52.6" fill="#d998b0" /><polygon points="50,46.1 65,52.6 50,59 35,52.6" fill="#e3a0ba" /><polygon points="66,79.1 50,86 50,75 66,68.1" fill="#d98fab" /><polygon points="34,79.1 50,86 50,75 34,68.1" fill="#e3a0ba" /><polygon points="50,61.3 66,68.1 50,75 34,68.1" fill="#efb3c8" /></svg>`,
    coffeetable: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="76,74.9 50,86 50,79 76,67.9" fill="#c694a8" /><polygon points="24,74.9 50,86 50,79 24,67.9" fill="#d6a6b9" /><polygon points="50,56.7 76,67.9 50,79 24,67.9" fill="#e2b2c2" /></svg>`,
    table: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="74,71.7 50,82 50,77 74,66.7" fill="#caa0b2" /><polygon points="26,71.7 50,82 50,77 26,66.7" fill="#d8aabc" /><polygon points="50,56.4 74,66.7 50,77 26,66.7" fill="#e6b6c6" /><polygon points="30,82 34,84 34,93 30,91" fill="#c293a6" /><polygon points="70,82 66,84 66,93 70,91" fill="#b88598" /></svg>`,
    bed: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="82,76.3 50,90 50,79 82,65.3" fill="#9f6f86" /><polygon points="18,76.3 50,90 50,79 18,65.3" fill="#b67e96" /><polygon points="50,51.6 82,65.3 50,79 18,65.3" fill="#c88fa6" /><polygon points="50,52.1 79,64.6 50,77 21,64.6" fill="#fdfdfd" /><polygon points="79,64.6 50,77 21,64.6" fill="#ef9fb8" /><polygon points="50,68.4 60,72.7 50,77 40,72.7" fill="#ffffff" stroke="#ecdce4" stroke-width="1"/></svg>`,
    nightstand: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="62,80.9 50,86 50,71 62,65.9" fill="#a87a90" /><polygon points="38,80.9 50,86 50,71 38,65.9" fill="#bf8ca2" /><polygon points="50,60.7 62,65.9 50,71 38,65.9" fill="#cf9fb4" /></svg>`,
    wardrobe: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="66,83.1 50,90 50,50 66,43.1" fill="#a87a90" /><polygon points="34,83.1 50,90 50,50 34,43.1" fill="#bf8ca2" /><polygon points="50,36.3 66,43.1 50,50 34,43.1" fill="#cf9fb4" /><line x1="50" y1="52" x2="50" y2="86" stroke="#9c7186" stroke-width="1.2"/></svg>`,
    bookshelf: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="65,83.6 50,90 50,52 65,45.6" fill="#a87a90" /><polygon points="35,83.6 50,90 50,52 35,45.6" fill="#bf8ca2" /><polygon points="50,39.1 65,45.6 50,52 35,45.6" fill="#cf9fb4" /><line x1="36" y1="60" x2="64" y2="60" stroke="#a87a90" stroke-width="1"/><line x1="36" y1="70" x2="64" y2="70" stroke="#a87a90" stroke-width="1"/><line x1="36" y1="80" x2="64" y2="80" stroke="#a87a90" stroke-width="1"/><polygon points="46,61.7 51,63.9 46,66 41,63.9" fill="#f0a6c8" /><polygon points="54,62.6 58,64.3 54,66 50,64.3" fill="#ffd1e6" /><polygon points="48,71.7 53,73.9 48,76 43,73.9" fill="#f6a6cd" /></svg>`,
    fridge: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="63,84.4 50,90 50,52 63,46.4" fill="#d3bdc9" /><polygon points="37,84.4 50,90 50,52 37,46.4" fill="#e2cdd8" /><polygon points="50,40.9 63,46.4 50,52 37,46.4" fill="#f4e3ec" /><line x1="50" y1="62" x2="62" y2="68" stroke="#cdb3c0" stroke-width="1.4"/></svg>`,
    cabinet: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="68,80.3 50,88 50,66 68,58.3" fill="#b888a0" /><polygon points="32,80.3 50,88 50,66 32,58.3" fill="#c897ac" /><polygon points="50,50.6 68,58.3 50,66 32,58.3" fill="#d7a3b8" /><line x1="50" y1="66" x2="50" y2="84" stroke="#a87a90" stroke-width="1.2"/></svg>`,
    counter: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="74,75.7 50,86 50,73 74,62.7" fill="#c493a6" /><polygon points="26,75.7 50,86 50,73 26,62.7" fill="#d6a6b9" /><polygon points="50,52.4 74,62.7 50,73 26,62.7" fill="#e3b6c6" /><polygon points="56,61.0 63,64.0 56,67 49,64.0" fill="#f0dde7" stroke="#c9a9ba" stroke-width="1"/></svg>`,
    stove: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="66,79.1 50,86 50,72 66,65.1" fill="#a98fa0" /><polygon points="34,79.1 50,86 50,72 34,65.1" fill="#bda3b0" /><polygon points="50,58.3 66,65.1 50,72 34,65.1" fill="#cdb6c0" /><ellipse cx="44.0" cy="61.1424" rx="3" ry="1.4" fill="#5a4450"/><ellipse cx="56.0" cy="61.1424" rx="3" ry="1.4" fill="#5a4450"/><ellipse cx="44.0" cy="66.14240000000001" rx="3" ry="1.4" fill="#5a4450"/><ellipse cx="56.0" cy="66.14240000000001" rx="3" ry="1.4" fill="#5a4450"/></svg>`,
    lamp: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><rect x="48.5" y="50" width="3" height="36" fill="#b88aaa"/><polygon points="40,50 60,50 56,36 44,36" fill="#f6cfe0" stroke="#e7b6cf" stroke-width="1"/><polygon points="50,82.3 59,86.1 50,90 41,86.1" fill="#cf9fb4" /></svg>`,
    plant: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="58,84.6 50,88 50,78 58,74.6" fill="#a87a90" /><polygon points="42,84.6 50,88 50,78 42,74.6" fill="#bf8ca2" /><polygon points="50,71.1 58,74.6 50,78 42,74.6" fill="#c98fa6" /><ellipse cx="50" cy="68" rx="13" ry="9" fill="#f0a6c8"/><ellipse cx="50" cy="62" rx="9" ry="6" fill="#ffc0dd"/></svg>`,
    rug: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="50,60.6 82,74.3 50,88 18,74.3" fill="#e7a9c2" /><polygon points="50,68.9 70,77.4 50,86 30,77.4" fill="#f3cfe0" opacity="0.9"/></svg>`,
    tree: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><rect x="47" y="60" width="6" height="28" fill="#b58f7a"/><ellipse cx="50" cy="54" rx="20" ry="14" fill="#f6a6cd"/><ellipse cx="50" cy="46" rx="14" ry="10" fill="#ffb3d1" opacity="0.9"/></svg>`,
    bench: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="68,68.3 50,76 50,71 68,63.3" fill="#cf8ca6" /><polygon points="32,68.3 50,76 50,71 32,63.3" fill="#d998b0" /><polygon points="50,55.6 68,63.3 50,71 32,63.3" fill="#e3a0ba" /><polygon points="68,78.3 50,86 50,79 68,71.3" fill="#b9879a" /><polygon points="32,78.3 50,86 50,79 32,71.3" fill="#c896a8" /><polygon points="50,63.6 68,71.3 50,79 32,71.3" fill="#d8a7b5" /></svg>`,
    picture: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="36,38 64,38 64,74 36,74" fill="#cf9fb4" /><polygon points="40,42 60,42 60,70 40,70" fill="#f6dcef" /><polygon points="43,58 50,48 57,58" fill="#f0a6c8" /></svg>`,
    clock: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><circle cx="50" cy="52" r="16" fill="#ffffff" stroke="#cf9fb4" stroke-width="4"/><line x1="50" y1="52" x2="50" y2="42" stroke="#9c7186" stroke-width="2"/><line x1="50" y1="52" x2="58" y2="56" stroke="#9c7186" stroke-width="2"/></svg>`,
    flowers: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="sticker-art"><polygon points="50,69.1 72,78.6 50,88 28,78.6" fill="#ead0da" /><circle cx="42" cy="77" r="3.2" fill="#ff9ec4"/><circle cx="50" cy="74" r="3.2" fill="#ffd1e6"/><circle cx="58" cy="77" r="3.2" fill="#ff9ec4"/><circle cx="47" cy="80" r="3.2" fill="#ffc0dd"/><circle cx="55" cy="81" r="3.2" fill="#ff9ec4"/></svg>`,
  };

  const STICKER_LEVEL_DECOR = [
    { id: "sofa", name: "Sofa", emoji: "🛋️", x: 0.5, y: 0.7, surface: "floor" },
    { id: "armchair", name: "Armchair", emoji: "🪑", x: 0.7, y: 0.74, surface: "floor" },
    { id: "coffeetable", name: "Coffee Table", emoji: "🪑", x: 0.5, y: 0.78, surface: "floor" },
    { id: "table", name: "Dining Table", emoji: "🍽️", x: 0.4, y: 0.66, surface: "floor" },
    { id: "bed", name: "Bed", emoji: "🛏️", x: 0.3, y: 0.66, surface: "floor" },
    { id: "nightstand", name: "Nightstand", emoji: "🗄️", x: 0.2, y: 0.62, surface: "floor" },
    { id: "wardrobe", name: "Wardrobe", emoji: "🗄️", x: 0.22, y: 0.58, surface: "floor" },
    { id: "bookshelf", name: "Bookshelf", emoji: "📚", x: 0.78, y: 0.58, surface: "floor" },
    { id: "fridge", name: "Fridge", emoji: "🧊", x: 0.82, y: 0.6, surface: "floor" },
    { id: "cabinet", name: "Cabinet", emoji: "🗄️", x: 0.78, y: 0.64, surface: "floor" },
    { id: "counter", name: "Kitchen Counter", emoji: "🍳", x: 0.66, y: 0.66, surface: "floor" },
    { id: "stove", name: "Stove", emoji: "🔥", x: 0.58, y: 0.62, surface: "floor" },
    { id: "lamp", name: "Floor Lamp", emoji: "💡", x: 0.86, y: 0.66, surface: "floor" },
    { id: "plant", name: "Plant", emoji: "🪴", x: 0.3, y: 0.8, surface: "floor" },
    { id: "rug", name: "Rug", emoji: "🟪", x: 0.5, y: 0.86, surface: "floor" },
    { id: "tree", name: "Blossom Tree", emoji: "🌸", x: 0.66, y: 0.84, surface: "decor" },
    { id: "bench", name: "Bench", emoji: "🪑", x: 0.16, y: 0.72, surface: "floor" },
    { id: "picture", name: "Wall Art", emoji: "🖼️", x: 0.38, y: 0.44, surface: "wall" },
    { id: "clock", name: "Wall Clock", emoji: "🕰️", x: 0.62, y: 0.44, surface: "wall" },
    { id: "flowers", name: "Flower Bed", emoji: "🌷", x: 0.56, y: 0.82, surface: "floor" },
    // Character + room-part + decor stickers (sold in the Shop; emoji art).
    { id: "cat", name: "Cat", emoji: "🐱", x: 0.50, y: 0.74, surface: "floor" },
    { id: "dog", name: "Dog", emoji: "🐶", x: 0.44, y: 0.76, surface: "floor" },
    { id: "rabbit", name: "Rabbit", emoji: "🐰", x: 0.60, y: 0.76, surface: "floor" },
    { id: "bear", name: "Bear", emoji: "🐻", x: 0.36, y: 0.78, surface: "floor" },
    { id: "door", name: "Door", emoji: "🚪", x: 0.30, y: 0.40, surface: "wall" },
    { id: "window", name: "Window", emoji: "🪟", x: 0.70, y: 0.38, surface: "wall" },
    { id: "mirror", name: "Mirror", emoji: "🪞", x: 0.22, y: 0.48, surface: "wall" },
    { id: "garland", name: "Garland", emoji: "🎐", x: 0.50, y: 0.34, surface: "wall" },
    { id: "speaker", name: "Speaker", emoji: "🔊", x: 0.80, y: 0.70, surface: "floor" },
  ];

  // ===== Sticker Shop catalog =====================================
  // Categories of buyable stickers (referencing STICKER_LEVEL_DECOR ids). Each
  // category has its own gem price. Icons are the category tab glyphs.
  const SHOP_CATALOG = [
    { key: "cats", label: "Cats", icon: "🐱", price: 20, items: ["cat", "dog", "rabbit", "bear"] },
    { key: "furniture", label: "Furniture", icon: "🛋️", price: 15, items: ["sofa", "armchair", "coffeetable", "table", "bed", "nightstand", "wardrobe", "bookshelf", "cabinet", "bench", "fridge", "counter", "stove"] },
    { key: "doors", label: "Doors", icon: "🚪", price: 20, items: ["door", "window", "mirror"] },
    { key: "plants", label: "Plants", icon: "🪴", price: 10, items: ["plant", "tree", "flowers", "rug", "lamp"] },
    { key: "wallart", label: "Wall Art", icon: "🖼️", price: 10, items: ["picture", "clock", "garland", "speaker"] },
  ];

  // Inject a sticker's iso-art SVG into an element (fallback to emoji glyph).
  function setStickerArt(el, def) {
    if (!el) return;
    const art = def && STICKER_ART[def.id];
    if (art) { el.innerHTML = art; el.classList.add("has-sticker-art"); }
    else { el.textContent = (def && def.emoji) || "\u2728"; }
  }

  // The five selectable sticker packs, ordered weakest → most premium. Each
  // grants a random count within [min, max] (inclusive). All free for now —
  // no price/currency/ad. Visual tier styling lives in styles.css
  // (.sticker-pack-tier--1 … --5). `star` is the glyph shown on the pack art.
  const STICKER_PACK_TIERS = [
    { tier: 1, label: "Basic",     min: 1, max: 1, star: "·",  price: "$1", gem: 10 },
    { tier: 2, label: "Common",    min: 2, max: 3, star: "✦",  price: "$3", gem: 25 },
    { tier: 3, label: "Rare",      min: 4, max: 5, star: "✧",  price: "$5", gem: 50 },
    { tier: 4, label: "Epic",      min: 6, max: 7, star: "★",  price: "$7", gem: 90 },
    { tier: 5, label: "Legendary", min: 9, max: 9, star: "✨", price: "$9", gem: 150 },
  ];
  const SHOP_PACK_ROMAN = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" };
  // Shop tabs now sell PACKS (not individual stickers).
  const SHOP_PACK_TABS = [
    { key: "packs", label: "Packs", icon: "🎁", tiers: [1, 2, 3, 4, 5] },
    { key: "premium", label: "Premium", icon: "👑", tiers: [3, 4, 5] },
  ];

  function getStickerPackTier(tier) {
    return STICKER_PACK_TIERS.find((t) => t.tier === tier) || STICKER_PACK_TIERS[0];
  }

  // Display label for a sticker-pack reward, e.g. "Sticker Pack I",
  // "Sticker Pack III", "Rare Sticker Pack IV". Grade 4+ reads as "Rare".
  function stickerPackRewardLabel(tier) {
    const roman = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" }[tier] || String(tier);
    return (tier >= 4 ? "Rare " : "") + "Sticker Pack " + roman;
  }

  // Pack-opening reveal (Battle Pass / Wheel / Star Chest) still uses the
  // legacy card data internally; this helper supplies an emoji thumbnail so the
  // reveal looks like a sticker even though hi-res card art is unavailable.
  const STICKER_EMOJI_BY_ALBUM = {
    africa: ["🐘", "🦒", "🦁", "🦓", "🌊", "🌅", "🌳", "🏝️", "🥁"],
    fantasy: ["🐉", "🏰", "🌲", "🪄", "🦄", "🎩", "💰", "🧚", "🛡️"],
    pixar: ["🤖", "🎒", "🦝", "✈️", "🍽️", "🛁", "📚", "🌳", "👹"],
    holiday: ["🏠", "🎄", "🍪", "🎅", "🎆", "☕", "🦌", "⛄", "🎁"],
    space: ["🪐", "🚀", "👽", "🗡️", "🛰️", "🤖", "🏜️", "💫", "✨"],
    postapoc: ["🌱", "🌿", "🚐", "🐦", "🪧", "🌻", "🐕", "🍄", "🌄"],
    paris: ["🗼", "☕", "⛵", "🎹", "🏛️", "🪜", "🥐", "🚇", "☔"],
    victorian: ["🚂", "💡", "⏱️", "🎩", "📖", "🚉", "🫖", "🕯️", "🗝️"],
  };

  function getStickerEmoji(stickerId) {
    const def = CARD_DEFS[stickerId];
    if (!def) return "🎴";
    const list = STICKER_EMOJI_BY_ALBUM[def.albumId] || [];
    const idx = (def.albumId && def.albumId.length)
      ? parseInt(stickerId.slice(def.albumId.length + 1), 10) || 0
      : 0;
    return list[idx] || "🎴";
  }

  function getStickerLevelDef(stickerId) {
    return STICKER_LEVEL_DECOR.find((d) => d.id === stickerId) || null;
  }

  function getDuplicateStarRewardByCard(cardId, fallbackRarity) {
    const def = CARD_DEFS[cardId] || null;
    const stars = def && typeof def.rarityStars === "number" ? def.rarityStars : (typeof fallbackRarity === "number" ? fallbackRarity : 1);
    return Math.max(1, Math.min(5, stars));
  }

  function getPackStarsForTier(tier) {
    if (tier <= 3) return 1;
    if (tier <= 7) return 2;
    return 3;
  }

  function ensurePackMeta(save, tier) {
    save.bpPremiumPackMeta = save.bpPremiumPackMeta || {};
    if (!save.bpPremiumPackMeta[tier]) {
      save.bpPremiumPackMeta[tier] = {
        cardCount: PACK_MIN_CARDS + Math.floor(Math.random() * (PACK_MAX_CARDS - PACK_MIN_CARDS + 1)),
        packStars: getPackStarsForTier(tier),
      };
    }
    return save.bpPremiumPackMeta[tier];
  }

  function renderPackIcon(opts) {
    const { cardCount = 2, locked = false, dimmed = false, size = "small", claimable = false } = opts || {};
    const wrap = document.createElement("div");
    wrap.className = "bp-pack-icon bp-pack-icon--" + size + (locked ? " bp-pack-icon--locked" : "") + (dimmed ? " bp-pack-icon--dim" : "") + (claimable ? " bp-pack-icon--claimable" : "");
    wrap.setAttribute("aria-hidden", "true");
    const img = document.createElement("img");
    img.className = "bp-pack-icon__img";
    img.src = PACK_REFERENCE_IMAGE;
    img.alt = "";
    wrap.appendChild(img);
    const countWrap = document.createElement("div");
    countWrap.className = "bp-pack-icon__count";
    countWrap.innerHTML = "<span class=\"bp-pack-icon__count-cards\"><span class=\"bp-pack-icon__count-card bp-pack-icon__count-card--back\"></span><span class=\"bp-pack-icon__count-card bp-pack-icon__count-card--front\"><span class=\"bp-pack-icon__count-num\">" + cardCount + "</span></span></span>";
    wrap.appendChild(countWrap);
    if (locked) {
      const lock = document.createElement("div");
      lock.className = "bp-pack-icon__lock";
      lock.innerHTML = "<svg viewBox=\"0 0 24 24\" class=\"bp-pack-icon__lock-svg\"><path fill=\"currentColor\" d=\"M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z\"/></svg>";
      wrap.appendChild(lock);
    }
    return wrap;
  }

  function rollRarity(packStars) {
    const weights = PACK_RARITY_WEIGHTS[packStars] || PACK_RARITY_WEIGHTS[1];
    const roll = Math.random() * 100;
    if (roll < weights[0]) return 1;
    if (roll < weights[0] + weights[1]) return 2;
    return 3;
  }

  function rollPack(packStars, saveRef, fixedCount) {
    const cards = saveRef.cards || {};
    const collected = cards.collected || {};
    const inbox = cards.newInbox || [];
    const owned = (id) => !!collected[id] || inbox.indexOf(id) >= 0;
    const count = typeof fixedCount === "number" && fixedCount >= PACK_MIN_CARDS && fixedCount <= PACK_MAX_CARDS ? fixedCount : PACK_MIN_CARDS + Math.floor(Math.random() * (PACK_MAX_CARDS - PACK_MIN_CARDS + 1));
    const results = [];
    const pickedInPack = [];
    for (let i = 0; i < count; i++) {
      const rarity = rollRarity(packStars);
      const pool = CARDS_BY_RARITY[rarity] && CARDS_BY_RARITY[rarity].length ? CARDS_BY_RARITY[rarity] : Object.keys(CARD_DEFS);
      let cardId;
      let attempts = 0;
      do {
        cardId = pool[Math.floor(Math.random() * pool.length)];
        attempts++;
        if (attempts > 50) break;
      } while (pickedInPack.indexOf(cardId) >= 0);
      pickedInPack.push(cardId);
      const isDuplicate = owned(cardId);
      const coinsAwarded = isDuplicate ? (COINS_PER_DUPLICATE[rarity] || 50) : 0;
      const starsAwarded = isDuplicate ? getDuplicateStarRewardByCard(cardId, rarity) : 0;
      results.push({ cardId, rarity, isDuplicate, coinsAwarded, starsAwarded });
    }
    const totalCoins = results.reduce((s, r) => s + r.coinsAwarded, 0);
    const totalStars = results.reduce((s, r) => s + (r.starsAwarded || 0), 0);
    return { results, totalCoins, totalStars };
  }

  function applyPackResults(save, packResult) {
    const cards = save.cards || {};
    if (!cards.newInbox) cards.newInbox = [];
    if (!cards.collected) cards.collected = {};
    let totalCoins = 0;
    packResult.results.forEach((r) => {
      if (r.isDuplicate && r.coinsAwarded) {
        save.coins = (save.coins || 0) + r.coinsAwarded;
        totalCoins += r.coinsAwarded;
        save.albumStars = (save.albumStars || 0) + (r.starsAwarded || 0);
      } else if (!r.isDuplicate) {
        cards.newInbox.push(r.cardId);
      }
    });
    return totalCoins;
  }

  const REWARD_DEFS = {};
  ALBUM_DEFS.forEach((a) => {
    REWARD_DEFS[a.id] = { name: a.name, rarity: "Common", artSeed: 10 };
  });

  function getTotalCardsAvailable() {
    return ALBUM_DEFS.reduce((sum, a) => sum + (a.cardIds ? a.cardIds.length : 0), 0);
  }

  class CollectionManager {
    constructor(saveRef, persistFn) {
      this._save = saveRef;
      this._persist = persistFn || (() => saveSave(this._save));
    }

    getState() {
      return this._save;
    }

    _persist() {
      saveSave(this._save);
    }

    isUnlockTriggered() {
      return this._save.collectionUnlocked === true;
    }

    isAvailable() {
      return this._save.collectionTutorialCompleted === true;
    }

    getLastAnimatedInboxSignature() {
      return this._save.lastAnimatedInboxSignature || "";
    }

    setLastAnimatedInboxSignature(sig) {
      this._save.lastAnimatedInboxSignature = sig;
      this._persist();
    }

    hasUncollectedNew() {
      return (this._save.cards.newInbox || []).length > 0;
    }

    getAlbumStars() {
      return Math.max(0, this._save.albumStars || 0);
    }

    addAlbumStars(amount) {
      const add = Math.max(0, Math.floor(amount || 0));
      if (!add) return this.getAlbumStars();
      this._save.albumStars = this.getAlbumStars() + add;
      this._persist();
      return this.getAlbumStars();
    }

    canAffordStarChest(cost) {
      return this.getAlbumStars() >= Math.max(0, Math.floor(cost || 0));
    }

    spendAlbumStars(amount) {
      const spend = Math.max(0, Math.floor(amount || 0));
      if (!this.canAffordStarChest(spend)) return false;
      this._save.albumStars = this.getAlbumStars() - spend;
      this._persist();
      return true;
    }

    openStarChest(type) {
      const key = type === "gold" ? "gold" : (type === "silver" ? "silver" : "wood");
      const cost = STAR_CHEST_COSTS[key];
      if (!this.spendAlbumStars(cost)) return null;
      const rewardsByType = {
        wood: { coins: 150, packStars: 1, cardCount: 2, label: "Wooden Chest" },
        silver: { coins: 450, packStars: 2, cardCount: 3, label: "Silver Chest" },
        gold: { coins: 1100, packStars: 3, cardCount: 5, label: "Premium Gold Chest" },
      };
      const reward = rewardsByType[key];
      this._save.coins = (this._save.coins || 0) + reward.coins;
      this._persist();
      return {
        type: key,
        cost,
        label: reward.label,
        coins: reward.coins,
        packStars: reward.packStars,
        cardCount: reward.cardCount,
      };
    }

    _ensureCardsStructure() {
      const cards = this._save.cards;
      if (!cards.collected) cards.collected = {};
      if (!cards.newInbox) cards.newInbox = [];
      if (!cards.duplicates) cards.duplicates = {};
      this._save.albums = this._save.albums || {};
      ALBUM_DEFS.forEach((def) => {
        if (!this._save.albums[def.id]) this._save.albums[def.id] = { collectedCount: 0 };
      });
      this._migrateLegacyCardIds();
    }

    _migrateLegacyCardIds() {
      const cards = this._save.cards;
      let changed = false;
      for (const [legacyId, newId] of Object.entries(LEGACY_CARD_ID_MAP)) {
        if (cards.collected[legacyId]) {
          cards.collected[newId] = true;
          delete cards.collected[legacyId];
          changed = true;
        }
        if (cards.duplicates[legacyId]) {
          cards.duplicates[newId] = (cards.duplicates[newId] || 0) + (cards.duplicates[legacyId] || 0);
          delete cards.duplicates[legacyId];
          changed = true;
        }
      }
      if (cards.newInbox && cards.newInbox.length) {
        const migrated = cards.newInbox.map((id) => LEGACY_CARD_ID_MAP[id] || id);
        if (migrated.some((id, i) => id !== cards.newInbox[i])) {
          cards.newInbox = migrated;
          changed = true;
        }
      }
      if (changed) this._persist();
    }

    grantGiftCards() {
      this._ensureCardsStructure();
      const firstAlbum = ALBUM_DEFS[0];
      const giftIds = firstAlbum && firstAlbum.cardIds ? firstAlbum.cardIds.slice(0, 2) : [];
      const cards = this._save.cards;
      const added = [];
      for (const cardId of giftIds) {
        if (cards.collected[cardId]) continue;
        if ((cards.newInbox || []).indexOf(cardId) >= 0) continue;
        cards.newInbox.push(cardId);
        added.push(cardId);
      }
      this._persist();
      return added;
    }

    grantLevelDrop(levelIndex) {
      if (!this.isAvailable()) return null;
      this._ensureCardsStructure();
      const allCardIds = ALBUM_DEFS.reduce((acc, a) => acc.concat(a.cardIds || []), []);
      const cards = this._save.cards;
      const inbox = cards.newInbox || [];
      const uncollected = allCardIds.filter((id) => !cards.collected[id] && inbox.indexOf(id) < 0);
      let cardId;
      if (uncollected.length > 0) {
        cardId = uncollected[0];
        cards.newInbox.push(cardId);
      } else {
        cardId = allCardIds[levelIndex % allCardIds.length];
        cards.duplicates[cardId] = (cards.duplicates[cardId] || 0) + 1;
        this._save.albumStars = (this._save.albumStars || 0) + getDuplicateStarRewardByCard(cardId, (CARD_DEFS[cardId] && CARD_DEFS[cardId].rarity) || 1);
      }
      this._persist();
      return cardId;
    }

    onLevelCompleted(levelIndex, opts) {
      opts = opts || {};
      this._persist();
      return { unlockedNow: false, droppedCardIds: [] };
    }

    awardCardFromBattlePass() {
      this._ensureCardsStructure();
      const allCardIds = ALBUM_DEFS.reduce((acc, a) => acc.concat(a.cardIds || []), []);
      const cards = this._save.cards;
      const inbox = cards.newInbox || [];
      const uncollected = allCardIds.filter((id) => !cards.collected[id] && inbox.indexOf(id) < 0);
      if (uncollected.length > 0) {
        const cardId = uncollected[0];
        cards.newInbox.push(cardId);
        this._persist();
        return { cardId };
      }
      const coinReward = 10;
      this._save.coins = (this._save.coins || 0) + coinReward;
      this._persist();
      return { cardId: null, coins: coinReward };
    }

    getWheelSegmentPool() {
      this._ensureCardsStructure();
      const allCardIds = ALBUM_DEFS.reduce((acc, a) => acc.concat(a.cardIds || []), []);
      const cards = this._save.cards;
      const inbox = cards.newInbox || [];
      const uncollected = allCardIds.filter((id) => !cards.collected[id] && inbox.indexOf(id) < 0);
      const collected = allCardIds.filter((id) => cards.collected[id]);
      const cardPool = [];
      const cardSegmentCount = 4;
      for (let i = 0; i < cardSegmentCount; i++) {
        if (i < uncollected.length) {
          cardPool.push(uncollected[i]);
        } else if (collected.length > 0) {
          cardPool.push(collected[(i - uncollected.length) % collected.length]);
        } else {
          cardPool.push(allCardIds[i % allCardIds.length]);
        }
      }
      // Six wheel segments. Sticker packs (Grade 1 / 3 / rare Grade 4) are
      // awarded to the Stickers feature as pending packs; gems and boosters
      // (hammers) stay; one card keeps the collection relevant. Order is
      // interleaved so adjacent segments look distinct on the wheel.
      return [
        { type: "stickerpack", tier: 1 },
        { type: "gems", amount: 100 },
        { type: "stickerpack", tier: 3 },
        { type: "hammers", amount: 3 },
        { type: "stickerpack", tier: 4 },
        { type: "card", cardId: cardPool[0] },
      ];
    }

    awardCardFromWheel(cardId) {
      this._ensureCardsStructure();
      const cards = this._save.cards;
      const alreadyCollected = !!cards.collected[cardId];
      cards.newInbox.push(cardId);
      if (alreadyCollected) {
        cards.duplicates[cardId] = (cards.duplicates[cardId] || 0) + 1;
        this._save.albumStars = (this._save.albumStars || 0) + getDuplicateStarRewardByCard(cardId, (CARD_DEFS[cardId] && CARD_DEFS[cardId].rarity) || 1);
      }
      this._persist();
      return { cardId };
    }

    markTutorialCompleted() {
      this._save.collectionTutorialCompleted = true;
      this._persist();
    }

    resetCollectionState() {
      this._ensureCardsStructure();
      this._save.cards.collected = {};
      this._save.cards.newInbox = [];
      this._save.cards.duplicates = {};
      ALBUM_DEFS.forEach((def) => {
        const album = this._save.albums[def.id];
        if (album) album.collectedCount = 0;
      });
      this._save.stickerRooms = {};
      this._persist();
    }

    collectCard(cardId) {
      this._ensureCardsStructure();
      const cards = this._save.cards;
      const idx = (cards.newInbox || []).indexOf(cardId);
      if (idx < 0) return null;
      cards.newInbox.splice(idx, 1);
      cards.collected[cardId] = true;
      const albumId = CARD_DEFS[cardId] && CARD_DEFS[cardId].albumId;
      if (albumId) {
        const album = this._save.albums[albumId];
        if (album) album.collectedCount = (album.collectedCount || 0) + 1;
      }
      this._persist();
      let result = null;
      const albumId2 = CARD_DEFS[cardId] && CARD_DEFS[cardId].albumId;
      if (albumId2) {
        const albumDef = ALBUM_DEFS.find((a) => a.id === albumId2);
        const total = albumDef ? albumDef.cardIds.length : CARDS_PER_ALBUM;
        const collected = (this._save.albums[albumId2] && this._save.albums[albumId2].collectedCount) || 0;
        if (collected >= total) {
          this._save.rewards = this._save.rewards || { trophies: 0, unlockedRewards: [], trophiesGoldCup: false };
          this._save.rewards.trophies = (this._save.rewards.trophies || 0) + 1;
          this._save.rewards.unlockedRewards = this._save.rewards.unlockedRewards || [];
          if (this._save.rewards.unlockedRewards.indexOf(albumId2) < 0) {
            this._save.rewards.unlockedRewards.push(albumId2);
          }
          this._save.coins = (this._save.coins || 0) + 20;
          this._persist();
          const reward = REWARD_DEFS[albumId2] || { name: "Truffle", rarity: "Common", artSeed: 10 };
          result = { albumComplete: true, reward };
        }
      }
      const collectedTotal = this.getCollectedTotal();
      const totalAvailable = getTotalCardsAvailable();
      if (collectedTotal === totalAvailable && totalAvailable > 0 && !this._save.allCardsRewardClaimed) {
        this._save.allCardsRewardClaimed = true;
        this._save.rewards = this._save.rewards || { trophies: 0, unlockedRewards: [], trophiesGoldCup: false };
        this._save.rewards.trophiesGoldCup = true;
        this._save.rewards.unlockedRewards = this._save.rewards.unlockedRewards || [];
        if (this._save.rewards.unlockedRewards.indexOf("goldCup") < 0) {
          this._save.rewards.unlockedRewards.push("goldCup");
        }
        this._save.coins = (this._save.coins || 0) + 50;
        this._persist();
        if (!result) result = {};
        result.allCardsComplete = true;
      }
      return result;
    }

    getCollectedTotal(includeInbox) {
      const cards = this._save.cards;
      const c = cards && cards.collected ? cards.collected : {};
      let n = Object.keys(c).filter((id) => c[id]).length;
      if (includeInbox && cards && cards.newInbox && cards.newInbox.length) {
        const inInbox = cards.newInbox.filter((id) => !c[id]);
        n += inInbox.length;
      }
      return n;
    }

    getAlbumProgress(albumId, includeInbox) {
      const def = ALBUM_DEFS.find((a) => a.id === albumId);
      const total = def ? def.cardIds.length : CARDS_PER_ALBUM;
      let collected = (this._save.albums[albumId] && this._save.albums[albumId].collectedCount) || 0;
      if (includeInbox && def && this._save.cards && this._save.cards.newInbox) {
        const coll = this._save.cards.collected || {};
        const inInbox = this._save.cards.newInbox.filter((id) => def.cardIds.indexOf(id) >= 0 && !coll[id]);
        collected += inInbox.length;
      }
      return { collected, total };
    }

    getCardsForAlbum(albumId) {
      const def = ALBUM_DEFS.find((a) => a.id === albumId);
      if (!def) return [];
      return def.cardIds.map((id) => {
        const c = CARD_DEFS[id];
        const collected = this._save.cards.collected[id];
        const inNew = (this._save.cards.newInbox || []).indexOf(id) >= 0;
        const dup = (this._save.cards.duplicates[id] || 0);
        return {
          id,
          name: c ? c.name : "?",
          rarityStars: c ? c.rarityStars : 1,
          artSeed: c ? c.artSeed : 0,
          imageSrc: c ? c.imageSrc : "",
          collected,
          isNew: inNew,
          duplicates: dup,
        };
      });
    }

    // ---- Sticker Level (single playable room, slot-based, pack-gated) ----
    _ensureStickerLevel() {
      if (!this._save.stickerLevel || typeof this._save.stickerLevel !== "object") {
        this._save.stickerLevel = { placed: {}, unlocked: {}, firstPackOpened: false };
      }
      const sl = this._save.stickerLevel;
      if (!sl.placed || typeof sl.placed !== "object" || Array.isArray(sl.placed)) sl.placed = {};
      if (!sl.unlocked || typeof sl.unlocked !== "object" || Array.isArray(sl.unlocked)) sl.unlocked = {};
      if (typeof sl.firstPackOpened !== "boolean") sl.firstPackOpened = false;
      if (!Array.isArray(sl.pendingPacks)) sl.pendingPacks = [];
      return sl;
    }

    // Pending sticker packs (tier numbers) awarded elsewhere and not yet opened.
    getPendingStickerPacks() {
      return this._ensureStickerLevel().pendingPacks.slice();
    }

    addPendingStickerPack(tier) {
      const t = Math.max(1, Math.min(5, parseInt(tier, 10) || 1));
      const sl = this._ensureStickerLevel();
      sl.pendingPacks.push(t);
      this._persist();
      return t;
    }

    // Remove the first pending pack of the given tier (identical tiers are
    // interchangeable). Returns true if one was removed.
    consumePendingStickerPack(tier) {
      const sl = this._ensureStickerLevel();
      const idx = sl.pendingPacks.indexOf(Math.max(1, Math.min(5, parseInt(tier, 10) || 1)));
      if (idx < 0) return false;
      sl.pendingPacks.splice(idx, 1);
      this._persist();
      return true;
    }

    getStickerLevelState() {
      const sl = this._ensureStickerLevel();
      const placedMap = sl.placed;
      const unlockedMap = sl.unlocked;
      // tray = unlocked AND not placed
      const tray = STICKER_LEVEL_DECOR.filter((d) => unlockedMap[d.id] && !placedMap[d.id]);
      // pool from which packs draw = neither unlocked nor placed
      const lockedPool = STICKER_LEVEL_DECOR.filter((d) => !unlockedMap[d.id] && !placedMap[d.id]);
      const placedCount = STICKER_LEVEL_DECOR.reduce((n, d) => n + (placedMap[d.id] ? 1 : 0), 0);
      return {
        unlockedMap,
        placedMap,
        tray,
        lockedPool,
        slots: STICKER_LEVEL_DECOR,
        placedCount,
        total: STICKER_LEVEL_DECOR.length,
        firstPackOpened: sl.firstPackOpened,
        canOpenPack: lockedPool.length > 0,
        pendingPacks: sl.pendingPacks.slice(),
      };
    }

    hasOpenedFirstPack() {
      return !!this._ensureStickerLevel().firstPackOpened;
    }

    markFirstPackOpened() {
      this._ensureStickerLevel().firstPackOpened = true;
      this._persist();
    }

    // Picks `count` random unique stickers from the still-locked pool (the pool
    // is already duplicate-free). Returns fewer than requested if the pool is
    // nearly empty. Defaults to 1 when no count is given.
    rollStickerPack(count) {
      const pool = this.getStickerLevelState().lockedPool;
      if (pool.length === 0) return [];
      const desired = Math.min(pool.length, Math.max(1, Math.floor(count) || 1));
      // Fisher-Yates shuffle
      const arr = pool.slice();
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr.slice(0, desired);
    }

    unlockStickers(stickerIds) {
      const sl = this._ensureStickerLevel();
      (stickerIds || []).forEach((id) => {
        if (getStickerLevelDef(id)) sl.unlocked[id] = true;
      });
      this._persist();
    }

    // Free placement. The player drops a sticker anywhere inside the room and
    // we persist its normalized {x, y} position. Requires the sticker to be
    // unlocked. `pos` defaults to the sticker's catalog position when omitted.
    placeStickerInLevel(stickerId, pos) {
      const def = getStickerLevelDef(stickerId);
      if (!def) return null;
      const sl = this._ensureStickerLevel();
      if (!sl.unlocked[stickerId]) return null;
      const x = pos && typeof pos.x === "number" ? pos.x : def.x;
      const y = pos && typeof pos.y === "number" ? pos.y : def.y;
      sl.placed[stickerId] = { x, y };
      this._persist();
      const placedCount = STICKER_LEVEL_DECOR.reduce((n, d) => n + (sl.placed[d.id] ? 1 : 0), 0);
      return {
        placed: true,
        placedCount,
        total: STICKER_LEVEL_DECOR.length,
        justCompleted: placedCount === STICKER_LEVEL_DECOR.length,
      };
    }

    // Normalized {x, y} for a placed sticker. Falls back to the catalog
    // position for legacy saves that stored `true` instead of a position.
    getStickerPlacement(stickerId) {
      const sl = this._ensureStickerLevel();
      const p = sl.placed[stickerId];
      const def = getStickerLevelDef(stickerId);
      if (!def) return null;
      if (p && typeof p === "object" && typeof p.x === "number" && typeof p.y === "number") {
        return { x: p.x, y: p.y };
      }
      return { x: def.x, y: def.y };
    }

    resetStickerLevel() {
      this._save.stickerLevel = { placed: {}, unlocked: {}, firstPackOpened: false };
      this._persist();
    }

    // Cheat: unlock and place every sticker at its catalog position.
    autoFillStickerLevel() {
      const placed = {}, unlocked = {};
      STICKER_LEVEL_DECOR.forEach((d) => { placed[d.id] = { x: d.x, y: d.y }; unlocked[d.id] = true; });
      this._save.stickerLevel = { placed, unlocked, firstPackOpened: true };
      this._persist();
    }
  }

  class CollectionUI {
    constructor(collectionManager, gameApp) {
      this.cm = collectionManager;
      this.app = gameApp;
      this.packAnimator = new CollectionPackAnimator();
      this.unlockModal = document.getElementById("collection-unlock-modal");
      this.tutorialOverlay = document.getElementById("collection-tutorial-overlay");
      this.albumScreen = document.getElementById("album-screen");
      this.rewardModal = document.getElementById("reward-modal");
      this.toast = document.getElementById("toast-card-found");
      this._selectedAlbumId = ALBUM_DEFS[0] ? ALBUM_DEFS[0].id : "pixar";
      this._collectionView = "hub";
      this._albumDetailPage = 1;
      this._albumDetailPageSize = 6;
      this._albumEscapeHandler = null;
    }

    getAlbumProgress(albumId) {
      return this.cm.getAlbumProgress(albumId, true);
    }

    albumHasNewCards(albumId) {
      const inbox = (this.cm.getState().cards && this.cm.getState().cards.newInbox) || [];
      return inbox.some((cardId) => CARD_DEFS[cardId] && CARD_DEFS[cardId].albumId === albumId);
    }

    _shouldAnimateNewPack() {
      if (!this.cm.isAvailable()) return false;
      const inbox = (this.cm.getState().cards.newInbox || []).slice();
      if (inbox.length === 0) return false;
      const sig = inbox.sort().join(",");
      return sig !== this.cm.getLastAnimatedInboxSignature();
    }

    _getInboxSignature() {
      const inbox = (this.cm.getState().cards.newInbox || []).slice();
      return inbox.sort().join(",");
    }

    showUnlockFlow(onDone) {
      this.cm.grantGiftCards();
      this._onUnlockDone = onDone;
      this.unlockModal.classList.remove("hidden");
      const preview = document.getElementById("collection-unlock-preview");
      preview.innerHTML = "";
      const firstAlbum = ALBUM_DEFS[0];
      const previewCardIds = firstAlbum && firstAlbum.cardIds ? firstAlbum.cardIds.slice(0, 2) : [];
      for (let i = 0; i < 2; i++) {
        const cardId = previewCardIds[i] || ("pixar_" + i);
        const def = CARD_DEFS[cardId];
        const div = document.createElement("div");
        div.className = "card-preview-mini";
        if (def && def.imageSrc) {
          const img = document.createElement("img");
          img.src = def.imageSrc;
          img.alt = "";
          img.loading = "eager";
          img.className = "card-preview-mini-img";
          img.onerror = () => { div.classList.add("card-preview-placeholder"); };
          div.appendChild(img);
        } else {
          div.classList.add("card-preview-placeholder");
        }
        preview.appendChild(div);
      }
      const placeholders = document.getElementById("collection-unlock-placeholders");
      placeholders.innerHTML = "";
      for (let i = 0; i < 2; i++) {
        const d = document.createElement("div");
        d.className = "placeholder-dot";
        d.textContent = "?";
        placeholders.appendChild(d);
      }
      const skip = () => {
        this.unlockModal.classList.add("hidden");
        this._runTutorialThenAlbum(() => {
          if (onDone) onDone();
        });
      };
      document.getElementById("btn-collection-lets-go").onclick = skip;
      document.getElementById("collection-unlock-skip").onclick = skip;
      this.unlockModal.onclick = (e) => { if (e.target === this.unlockModal) skip(); };
    }

    _runTutorialThenAlbum(onDone) {
      const steps = [
        "These are your stickers! Complete levels to find new ones.",
        "Drag stickers from the tray into their glowing spots in the room.",
      ];
      let stepIndex = 0;
      const bubble = document.getElementById("collection-tutorial-text");
      const overlay = this.tutorialOverlay;
      const advance = () => {
        stepIndex++;
        if (stepIndex >= steps.length) {
          overlay.classList.add("hidden");
          this.cm.markTutorialCompleted();
          this.app.collectionUI.updateCollectionButtons();
          this.showAlbum(onDone);
        } else {
          bubble.textContent = steps[stepIndex];
        }
      };
      bubble.textContent = steps[0];
      overlay.classList.remove("hidden");
      document.getElementById("collection-tutorial-skip").onclick = advance;
      overlay.onclick = (e) => { if (e.target === overlay) advance(); };
    }

    // TEMPORARY TESTING CHEAT — top up gems for sticker-buy testing.
    // Ensures the player has at least STICKER_GEM_CHEAT gems on entering the
    // Stickers screen so the "+" individual-sticker window can be exercised.
    // Never reduces a higher existing balance; safe to call repeatedly.
    // TODO(remove): delete this method and its call in showAlbum() when the
    // Stickers feature no longer needs free test currency.
    _applyStickerGemCheat() {
      const STICKER_GEM_CHEAT = 50000;
      const gems = Math.max(0, parseInt(this.app._save.gemsTotal, 10) || 0);
      if (gems < STICKER_GEM_CHEAT) {
        this.app._save.gemsTotal = STICKER_GEM_CHEAT;
        saveSave(this.app._save);
      }
    }

    showAlbum(onBackCallback) {
      this._applyStickerGemCheat();
      this._onAlbumBackCallback = onBackCallback;
      this.app.ui.showScreen("album-screen");
      document.documentElement.classList.add("album-screen-active");
      document.body.classList.add("album-screen-active");
      if (this._albumEscapeHandler) window.removeEventListener("keydown", this._albumEscapeHandler);
      this._albumEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const overlay = document.getElementById("sticker-pack-overlay");
        if (overlay && !overlay.classList.contains("hidden")) return; // pack overlay handles its own close
        e.preventDefault();
        this._onAlbumClose();
      };
      window.addEventListener("keydown", this._albumEscapeHandler);
      this._renderStickerLevel();
      this._bindStickerLevelHeader();
      // No auto-opened pack on first entry: the empty tray shows the "+" tile,
      // which the player taps to open the 5-pack selection and seed the room.
    }

    _bindStickerLevelHeader() {
      const homeBtn = document.getElementById("btn-sticker-level-home");
      if (homeBtn) homeBtn.onclick = () => this._onAlbumClose();
      const settingsBtn = document.getElementById("btn-sticker-level-settings");
      if (settingsBtn) settingsBtn.onclick = () => {
        if (this.app && typeof this.app.openSettings === "function") this.app.openSettings();
      };
    }

    _renderStickerLevel() {
      const tray = document.getElementById("sticker-level-tray");
      const slotsHost = document.getElementById("sticker-level-placed");
      const counter = document.getElementById("sticker-level-counter");
      const pillLabel = document.getElementById("sticker-level-pill-label");
      const pillFill = document.getElementById("sticker-level-pill-fill");
      const pillPercent = document.getElementById("sticker-level-pill-percent");
      if (!tray || !slotsHost) return;

      const state = this.cm.getStickerLevelState();
      const pct = state.total > 0 ? Math.round((state.placedCount / state.total) * 100) : 0;

      // Bottom tray: only the unlocked-and-unplaced stickers, in catalog order.
      // When the tray is empty AND the room isn't complete, append a "+" tile
      // that opens another sticker pack.
      tray.innerHTML = "";
      // Pending packs (awarded by the Wheel of Fortune, etc.) appear first as
      // tappable reward tiles that open with the pack-opening animation.
      (state.pendingPacks || []).forEach((tier) => {
        const meta = getStickerPackTier(tier);
        const amount = meta.min === meta.max ? String(meta.min) : (meta.min + "–" + meta.max);
        const packTile = document.createElement("button");
        packTile.type = "button";
        packTile.className = "sticker-level-tray-item sticker-level-tray-item--pack sticker-level-tray-item--pack-tier-" + tier;
        packTile.setAttribute("aria-label", stickerPackRewardLabel(tier) + ", " + amount + " stickers");
        packTile.title = stickerPackRewardLabel(tier);
        packTile.style.touchAction = "manipulation";
        packTile.innerHTML =
          '<span class="sticker-level-pack-art" aria-hidden="true">' +
            '<span class="sticker-level-pack-band"></span>' +
            '<span class="sticker-level-pack-star">' + meta.star + '</span>' +
          '</span>' +
          '<span class="sticker-level-pack-badge">' + amount + '</span>';
        const self = this;
        let firing = false;
        const fire = (e) => {
          if (firing) return;
          firing = true;
          if (e && typeof e.stopPropagation === "function") e.stopPropagation();
          if (e && typeof e.preventDefault === "function") e.preventDefault();
          setTimeout(() => { firing = false; }, 250);
          self._openPendingStickerPack(tier);
        };
        packTile.addEventListener("click", fire);
        packTile.addEventListener("pointerup", (e) => { if (e.button && e.button !== 0) return; fire(e); });
        tray.appendChild(packTile);
      });
      state.tray.forEach((s) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "sticker-level-tray-item";
        item.dataset.stickerId = s.id;
        item.setAttribute("aria-label", s.name);
        item.title = s.name;
        const glyph = document.createElement("span");
        glyph.className = "sticker-level-tray-glyph";
        setStickerArt(glyph, s);
        item.appendChild(glyph);
        this._bindStickerLevelDrag(item, s);
        tray.appendChild(item);
      });
      const roomComplete = state.placedCount >= state.total;
      if (!roomComplete && state.tray.length === 0 && state.canOpenPack) {
        const plus = document.createElement("button");
        plus.type = "button";
        plus.className = "sticker-level-tray-item sticker-level-tray-item--plus";
        plus.setAttribute("aria-label", "Open another sticker pack");
        plus.title = "Open another sticker pack";
        // touch-action: manipulation tells the browser to skip the legacy
        // 300ms tap-delay and double-tap zoom, so the tap converts straight
        // to a click on touch devices inside the horizontally scrollable tray.
        plus.style.touchAction = "manipulation";
        plus.style.cursor = "pointer";
        const glyph = document.createElement("span");
        glyph.className = "sticker-level-tray-glyph sticker-level-tray-glyph--plus";
        glyph.textContent = "+";
        plus.appendChild(glyph);
        const self = this;
        let firing = false;
        const fire = (e) => {
          // Guard against double-fire from click + pointerup on the same tap.
          if (firing) return;
          firing = true;
          if (e && typeof e.stopPropagation === "function") e.stopPropagation();
          if (e && typeof e.preventDefault === "function") e.preventDefault();
          // Reset the guard on the next tick so a fresh tap still works after
          // the overlay is closed.
          setTimeout(() => { firing = false; }, 250);
          // The "+" opens the INDIVIDUAL-sticker buy modal (separate from the
          // Shop tab, which sells packs).
          self._openStickerBuy();
        };
        plus.addEventListener("click", fire);
        // Pointerup as a belt-and-braces fallback for touch environments where
        // synthesized clicks fail (e.g., when the tray was just scrolled).
        plus.addEventListener("pointerup", (e) => {
          if (e.button && e.button !== 0) return;
          fire(e);
        });
        tray.appendChild(plus);
      }

      // Free-placement room: render ONLY the stickers the player has already
      // dropped, each at its persisted position. No silhouettes / ghost
      // placeholders — the room is a free decorating canvas. Items are sorted
      // back-to-front (by y) so closer stickers overlap farther ones.
      slotsHost.innerHTML = "";
      const placedDefs = state.slots
        .filter((d) => state.placedMap[d.id])
        .map((d) => {
          const pos = this.cm.getStickerPlacement(d.id) || { x: d.x, y: d.y };
          return { def: d, x: pos.x, y: pos.y };
        })
        .sort((a, b) => a.y - b.y);
      placedDefs.forEach(({ def, x, y }) => {
        const cell = document.createElement("span");
        cell.className = "sticker-slot sticker-slot--filled sticker-slot--surface-" + def.surface;
        cell.dataset.stickerId = def.id;
        cell.dataset.surface = def.surface;
        cell.style.left = (x * 100) + "%";
        cell.style.top = (y * 100) + "%";
        const depth = Math.max(0, Math.min(1, y));
        const scale = 0.78 + depth * 0.42;
        cell.style.setProperty("--iso-scale", scale.toFixed(3));
        cell.style.zIndex = String(100 + Math.floor(depth * 900));
        cell.title = def.name;
        setStickerArt(cell, def);
        slotsHost.appendChild(cell);
      });

      if (counter) counter.textContent = state.placedCount + "/" + state.total;
      if (pillLabel) pillLabel.textContent = "LVL 1";
      if (pillFill) pillFill.style.width = pct + "%";
      if (pillPercent) pillPercent.textContent = pct + "%";
    }

    // Free placement: drag a sticker out of the tray and drop it anywhere
    // inside the room. The drop point (clamped to sensible room bounds) becomes
    // the sticker's persisted position. A drop outside the room bounces the
    // tray tile back. There are no silhouettes and no "correct" target.
    _bindStickerLevelDrag(itemEl, sticker) {
      const self = this;
      itemEl.style.touchAction = "none";
      itemEl.onpointerdown = (e) => {
        e.preventDefault();
        if (itemEl.dataset.dragging === "1") return;
        const room = document.getElementById("sticker-level-placed");
        if (!room) return;
        itemEl.dataset.dragging = "1";
        itemEl.classList.add("sticker-level-tray-item--dragging");

        const ghost = document.createElement("div");
        ghost.className = "sticker-level-drag-ghost";
        setStickerArt(ghost, sticker);
        document.body.appendChild(ghost);
        const place = (x, y) => { ghost.style.left = x + "px"; ghost.style.top = y + "px"; };
        place(e.clientX, e.clientY);

        try { itemEl.setPointerCapture(e.pointerId); } catch (_) {}

        // Convert a screen point to a normalized {x, y} inside the room, or null
        // when the point is outside the room rectangle.
        const toRoomPos = (cx, cy) => {
          const r = room.getBoundingClientRect();
          if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
          const nx = (cx - r.left) / r.width;
          const ny = (cy - r.top) / r.height;
          // Clamp to the apartment footprint (walls + all five zones: living,
          // kitchen, bedroom, hallway and the front garden). The SVG apartment
          // occupies roughly x 0.05..0.95, y 0.30..0.82 of the room box, so
          // stickers drop across every zone (and the back walls) but not into
          // the empty margins.
          return {
            x: Math.max(0.05, Math.min(0.95, nx)),
            y: Math.max(0.30, Math.min(0.82, ny)),
          };
        };

        const onMove = (mv) => { place(mv.clientX, mv.clientY); };
        const cleanup = () => {
          itemEl.onpointermove = null;
          itemEl.onpointerup = null;
          itemEl.onpointercancel = null;
          itemEl.classList.remove("sticker-level-tray-item--dragging");
          delete itemEl.dataset.dragging;
          if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
          try { itemEl.releasePointerCapture(e.pointerId); } catch (_) {}
        };
        const bounce = () => {
          itemEl.classList.add("sticker-level-tray-item--bounce");
          setTimeout(() => itemEl.classList.remove("sticker-level-tray-item--bounce"), 320);
        };
        const onUp = (up) => {
          const pos = toRoomPos(up.clientX, up.clientY);
          cleanup();
          if (pos) self._onStickerLevelPlace(sticker.id, pos);
          else bounce();
        };
        itemEl.onpointermove = onMove;
        itemEl.onpointerup = onUp;
        itemEl.onpointercancel = () => { cleanup(); bounce(); };
      };
    }

    _onStickerLevelPlace(stickerId, pos) {
      const result = this.cm.placeStickerInLevel(stickerId, pos);
      if (!result) return;
      this._renderStickerLevel();
      const placed = document.querySelector('#sticker-level-placed .sticker-slot[data-sticker-id="' + stickerId + '"]');
      if (placed) {
        placed.classList.add("sticker-slot--just-placed");
        setTimeout(() => placed.classList.remove("sticker-slot--just-placed"), 700);
      }
      if (result.justCompleted) {
        this._showStickerLevelComplete();
      }
    }

    // ---- Sticker pack selection ------------------------------------------
    // Tapping the "+" tile (or first-entry) shows five free, visually-tiered
    // packs. The player picks one; its tier decides how many stickers roll.
    _openStickerPackSelect(opts) {
      opts = opts || {};
      const overlay = document.getElementById("sticker-pack-select-overlay");
      const list = document.getElementById("sticker-pack-select-list");
      const closeBtn = document.getElementById("btn-sticker-pack-select-close");
      const backdrop = overlay && overlay.querySelector(".sticker-pack-select-backdrop");
      if (!overlay || !list) return;
      // Nothing left to draw — don't surface an empty selection.
      if (!this.cm.getStickerLevelState().canOpenPack) {
        this._renderStickerLevel();
        return;
      }
      list.innerHTML = "";
      STICKER_PACK_TIERS.forEach((t) => {
        const amount = t.min === t.max ? String(t.min) : (t.min + "–" + t.max);
        const noun = (t.max === 1) ? " Sticker" : " Stickers";
        const card = document.createElement("button");
        card.type = "button";
        card.className = "sticker-pack-tier sticker-pack-tier--" + t.tier;
        card.setAttribute("aria-label", t.label + " pack, " + amount + noun + ", " + t.price);
        card.innerHTML =
          '<span class="sticker-pack-tier-glow" aria-hidden="true"></span>' +
          '<span class="sticker-pack-tier-art" aria-hidden="true">' +
            '<span class="sticker-pack-tier-band"></span>' +
            '<span class="sticker-pack-tier-star">' + t.star + '</span>' +
          '</span>' +
          '<span class="sticker-pack-tier-label">' + t.label + '</span>' +
          '<span class="sticker-pack-tier-count">' + amount + noun + '</span>' +
          '<span class="sticker-pack-price">' + t.price + '</span>';
        // Fake shop purchase: tapping a pack "buys" it for free internally and
        // goes straight into the pack-opening reveal (no payment / balance check).
        card.onclick = (e) => { if (e) e.stopPropagation(); this._choosePack(t, opts); };
        list.appendChild(card);
      });
      if (closeBtn) closeBtn.onclick = () => this._closeStickerPackSelect();
      if (backdrop) backdrop.onclick = () => this._closeStickerPackSelect();
      overlay.classList.remove("hidden");
    }

    _closeStickerPackSelect() {
      const overlay = document.getElementById("sticker-pack-select-overlay");
      if (overlay) overlay.classList.add("hidden");
    }

    // ===== Individual-sticker buy modal (opened by the "+" tile) ===========
    // Separate from the Shop tab (which sells packs): here the player buys
    // individual stickers by category with gems, or grabs a free random one.
    _openStickerBuy() {
      const ov = document.getElementById("sticker-buy-overlay");
      if (!ov) return;
      if (!this._buyCategory || !SHOP_CATALOG.some((c) => c.key === this._buyCategory)) {
        this._buyCategory = SHOP_CATALOG[0].key;
      }
      this._renderStickerBuy();
      ov.classList.remove("hidden");
      const closeBtn = document.getElementById("btn-sticker-buy-close");
      if (closeBtn) closeBtn.onclick = () => this._closeStickerBuy();
      const backdrop = ov.querySelector(".sticker-buy-backdrop");
      if (backdrop) backdrop.onclick = () => this._closeStickerBuy();
    }

    _closeStickerBuy() {
      const ov = document.getElementById("sticker-buy-overlay");
      if (ov) ov.classList.add("hidden");
    }

    _renderStickerBuy() {
      // Currency pills.
      const curHost = document.getElementById("sticker-buy-currencies");
      if (curHost) {
        const gems = Math.max(0, parseInt(this.app._save.gemsTotal, 10) || 0);
        const coins = Math.max(0, parseInt(this.app._save.coins, 10) || 0);
        const pill = (icon, val) => '<div class="shop-cur-pill"><span class="shop-cur-icon">' + icon
          + '</span><span class="shop-cur-val">' + val + '</span><span class="shop-cur-plus">+</span></div>';
        curHost.innerHTML = pill("💎", gems) + pill("🐾", coins);
      }
      // Category tabs.
      const tabHost = document.getElementById("sticker-buy-tabs");
      if (tabHost) {
        tabHost.innerHTML = "";
        SHOP_CATALOG.forEach((cat) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "shop-tab" + (cat.key === this._buyCategory ? " shop-tab--active" : "");
          b.innerHTML = '<span class="shop-tab-icon">' + cat.icon + "</span>";
          b.setAttribute("aria-label", cat.label);
          b.onclick = () => { this._buyCategory = cat.key; this._renderStickerBuy(); };
          tabHost.appendChild(b);
        });
      }
      // Item grid.
      const grid = document.getElementById("sticker-buy-grid");
      if (!grid) return;
      grid.innerHTML = "";
      const cat = SHOP_CATALOG.find((c) => c.key === this._buyCategory) || SHOP_CATALOG[0];
      const unlocked = (this.cm.getStickerLevelState().unlockedMap) || {};

      // FREE / ad card (grants a random sticker).
      const free = document.createElement("div");
      free.className = "shop-card shop-card--special shop-card--free";
      const fArt = document.createElement("div");
      fArt.className = "shop-card-art";
      setStickerArt(fArt, getStickerLevelDef(cat.items[Math.floor(Math.random() * cat.items.length)]));
      free.innerHTML = '<div class="shop-card-head">FREE</div>';
      free.appendChild(fArt);
      const fBtn = document.createElement("button");
      fBtn.type = "button";
      fBtn.className = "shop-card-btn shop-card-btn--free";
      fBtn.innerHTML = "FREE ▶";
      fBtn.onclick = () => this._stickerBuyFree();
      free.appendChild(fBtn);
      grid.appendChild(free);

      // Individual sticker cards.
      cat.items.forEach((id) => {
        const def = getStickerLevelDef(id);
        if (!def) return;
        const owned = !!unlocked[id];
        const card = document.createElement("div");
        card.className = "shop-card" + (owned ? " shop-card--owned" : "");
        const art = document.createElement("div");
        art.className = "shop-card-art";
        setStickerArt(art, def);
        card.appendChild(art);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "shop-card-btn shop-card-btn--buy" + (owned ? " shop-card-btn--owned" : "");
        btn.innerHTML = owned ? "Owned ✓" : '<span class="shop-gem">💎</span> ' + cat.price;
        if (!owned) btn.onclick = () => this._stickerBuyItem(id, cat.price);
        card.appendChild(btn);
        grid.appendChild(card);
      });
    }

    _stickerBuyItem(id, price) {
      const gems = Math.max(0, parseInt(this.app._save.gemsTotal, 10) || 0);
      if (this.cm.getStickerLevelState().unlockedMap[id]) return;
      if (gems < price) { this._stickerBuyToast("Not enough gems"); return; }
      this.app._save.gemsTotal = gems - price;
      saveSave(this.app._save);
      this.cm.unlockStickers([id]);
      this._renderStickerLevel();
      const def = getStickerLevelDef(id);
      this._stickerBuyToast("Got " + (def ? def.name : "sticker") + "!");
      this._renderStickerBuy();
    }

    _stickerBuyFree() {
      const pool = this.cm.getStickerLevelState().lockedPool || [];
      if (!pool.length) { this._stickerBuyToast("All stickers collected!"); return; }
      const pick = pool[Math.floor(Math.random() * pool.length)];
      this.cm.unlockStickers([pick.id]);
      this._renderStickerLevel();
      this._stickerBuyToast("Got " + pick.name + "!");
      this._renderStickerBuy();
    }

    _stickerBuyToast(msg) {
      let t = document.getElementById("sticker-buy-toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "sticker-buy-toast";
        t.className = "shop-toast";
        const shell = document.querySelector("#sticker-buy-overlay .sticker-buy-shell");
        if (shell) shell.appendChild(t);
      }
      t.textContent = msg;
      t.classList.add("shop-toast--show");
      clearTimeout(this._stickerBuyToastTimer);
      this._stickerBuyToastTimer = setTimeout(() => t.classList.remove("shop-toast--show"), 1400);
    }

    _choosePack(tier, opts) {
      this._closeStickerPackSelect();
      const span = Math.max(0, tier.max - tier.min);
      const count = tier.min + Math.floor(Math.random() * (span + 1));
      this._openStickerPack(Object.assign({}, opts || {}, { count, tier: tier.tier }));
    }

    // Opens a pending (awarded) pack of the given tier. The grade decides the
    // sticker count; collecting consumes the pending pack from the queue.
    _openPendingStickerPack(tier) {
      const meta = getStickerPackTier(tier);
      const span = Math.max(0, meta.max - meta.min);
      const count = meta.min + Math.floor(Math.random() * (span + 1));
      this._openStickerPack({ count, tier, pendingTier: tier });
    }

    // Re-render the sticker tray only when its screen is actually on-screen.
    refreshStickerLevelIfOpen() {
      if (document.body.classList.contains("album-screen-active")) this._renderStickerLevel();
    }

    // ---- Sticker pack opening --------------------------------------------
    // Roll the chosen pack's stickers from the locked pool, show the tier-themed
    // closed-pack art, wait for a tap to play the burst, render the reveal
    // cards, then add the stickers to the tray when Collect is pressed.
    _openStickerPack(opts) {
      opts = opts || {};
      const els = this._getStickerPackEls();
      if (!els) return;
      const stickers = this.cm.rollStickerPack(opts.count || 1);
      if (stickers.length === 0) {
        // Defensive: if the locked pool drained between the click and now,
        // make sure no stale overlay is left visible and re-render the tray.
        // A pending (awarded) pack is still consumed so its dead tile clears.
        if (opts.pendingTier != null) this.cm.consumePendingStickerPack(opts.pendingTier);
        this._closeStickerPack();
        this._renderStickerLevel();
        return;
      }
      // Drop any prior handlers / state from a previous open.
      this._clearStickerPackHandlers(els);
      this._stickerPackCtx = { stickers, opts, opened: false };
      this._resetStickerPackOverlay(els);
      // Tier-theme the closed-pack art so the opening matches the chosen pack.
      for (let t = 1; t <= 5; t++) els.art.classList.remove("sticker-pack-art--tier-" + t);
      if (opts.tier) els.art.classList.add("sticker-pack-art--tier-" + opts.tier);
      this._bindStickerPackHandlers(els);
    }

    _getStickerPackEls() {
      const overlay = document.getElementById("sticker-pack-overlay");
      const art = document.getElementById("sticker-pack-art");
      const reveal = document.getElementById("sticker-pack-reveal");
      const list = document.getElementById("sticker-pack-reveal-list");
      const collectBtn = document.getElementById("btn-sticker-pack-collect");
      const backdrop = overlay && overlay.querySelector(".sticker-pack-backdrop");
      if (!overlay || !art || !reveal || !list || !collectBtn) return null;
      return { overlay, art, reveal, list, collectBtn, backdrop };
    }

    _resetStickerPackOverlay(els) {
      els.overlay.classList.remove("hidden");
      els.art.classList.remove("hidden");
      els.art.classList.remove("sticker-pack-art--bursting");
      els.reveal.classList.add("hidden");
      els.list.innerHTML = "";
    }

    _clearStickerPackHandlers(els) {
      els.art.onclick = null;
      els.art.onkeydown = null;
      els.collectBtn.onclick = null;
      if (els.backdrop) els.backdrop.onclick = null;
    }

    _bindStickerPackHandlers(els) {
      const self = this;
      const renderReveal = () => {
        const ctx = self._stickerPackCtx;
        if (!ctx) return;
        els.art.classList.add("hidden");
        els.reveal.classList.remove("hidden");
        els.list.innerHTML = "";
        ctx.stickers.forEach((s, i) => {
          const item = document.createElement("div");
          item.className = "sticker-pack-reveal-item";
          item.style.animationDelay = (i * 90) + "ms";
          item.setAttribute("role", "listitem");
          const glyph = document.createElement("span");
          glyph.className = "sticker-pack-reveal-glyph";
          setStickerArt(glyph, s);
          const name = document.createElement("span");
          name.className = "sticker-pack-reveal-name";
          name.textContent = s.name;
          item.appendChild(glyph);
          item.appendChild(name);
          els.list.appendChild(item);
        });
      };
      const openPack = (e) => {
        if (e && typeof e.stopPropagation === "function") e.stopPropagation();
        const ctx = self._stickerPackCtx;
        if (!ctx || ctx.opened) return;
        ctx.opened = true;
        els.art.classList.add("sticker-pack-art--bursting");
        setTimeout(renderReveal, 460);
      };
      const collectPack = (e) => {
        if (e && typeof e.stopPropagation === "function") e.stopPropagation();
        const ctx = self._stickerPackCtx;
        if (!ctx) return;
        if (!ctx.opened) {
          // Collect tapped before the pack was opened — open then collect.
          openPack();
          setTimeout(() => self._collectStickerPack(), 480);
          return;
        }
        self._collectStickerPack();
      };
      els.art.onclick = openPack;
      els.art.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPack(e); } };
      els.collectBtn.onclick = collectPack;
      if (els.backdrop) {
        els.backdrop.onclick = (e) => {
          const ctx = self._stickerPackCtx;
          if (ctx && ctx.opened) collectPack(e);
        };
      }
    }

    // Finalize the pack: persist the unlocked stickers, mark the intro pack as
    // done (always — any successful collect satisfies the gate), close the
    // overlay, and re-render the tray so the new stickers + plus tile reflect.
    _collectStickerPack() {
      const ctx = this._stickerPackCtx;
      if (!ctx) return;
      this.cm.unlockStickers(ctx.stickers.map((s) => s.id));
      this.cm.markFirstPackOpened();
      // If this was a pending (awarded) pack, remove it from the queue now that
      // it's been opened and collected.
      if (ctx.opts && ctx.opts.pendingTier != null) {
        this.cm.consumePendingStickerPack(ctx.opts.pendingTier);
      }
      this._stickerPackCtx = null;
      this._closeStickerPack();
      this._renderStickerLevel();
    }

    _closeStickerPack() {
      const els = this._getStickerPackEls();
      if (!els) return;
      els.overlay.classList.add("hidden");
      this._clearStickerPackHandlers(els);
      this._stickerPackCtx = null;
    }

    _showStickerLevelComplete() {
      const stage = document.querySelector(".sticker-level-stage");
      if (!stage) return;
      let toast = stage.querySelector(".sticker-level-complete-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "sticker-level-complete-toast";
        toast.innerHTML = '<span class="sticker-level-complete-icon">🎉</span><span>Apartment decorated!</span>';
        stage.appendChild(toast);
      }
      toast.classList.remove("hidden");
      clearTimeout(this._levelCompleteTimer);
      this._levelCompleteTimer = setTimeout(() => toast.classList.add("hidden"), 2400);
    }

    openAlbumInfoOverlay() {
      this.openAlbumFeaturesInfoOverlay();
    }

    openAlbumExchangeOverlay() {
      const overlay = document.getElementById("albumInfoOverlay");
      if (!overlay) return;
      this._applyAlbumExchangeAssets();
      this.updateAlbumStarsUI();
      overlay.classList.remove("hidden");
      const self = this;
      overlay.onclick = (e) => {
        if (e.target === overlay) self.closeAlbumInfoOverlay();
      };
      const closeBtn = document.getElementById("btn-album-info-close");
      if (closeBtn) closeBtn.onclick = () => self.closeAlbumInfoOverlay();
      const woodBtn = document.getElementById("btn-album-info-open-wood");
      const silverBtn = document.getElementById("btn-album-info-open-silver");
      const goldBtn = document.getElementById("btn-album-info-open-gold");
      if (woodBtn) woodBtn.onclick = () => self._openStarChest("wood");
      if (silverBtn) silverBtn.onclick = () => self._openStarChest("silver");
      if (goldBtn) goldBtn.onclick = () => self._openStarChest("gold");
    }

    openAlbumFeaturesInfoOverlay() {
      const overlay = document.getElementById("albumFeaturesInfoOverlay");
      if (!overlay) return;
      this._applyAlbumFeaturesInfoAssets();
      overlay.classList.remove("hidden");
      const self = this;
      const close = () => self.closeAlbumFeaturesInfoOverlay();
      overlay.onclick = (e) => {
        if (e.target === overlay) close();
      };
      const closeBtn = document.getElementById("btn-album-features-info-close");
      if (closeBtn) closeBtn.onclick = close;
    }

    closeAlbumInfoOverlay() {
      const overlay = document.getElementById("albumInfoOverlay");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.onclick = null;
      }
      const closeBtn = document.getElementById("btn-album-info-close");
      if (closeBtn) closeBtn.onclick = null;
      const woodBtn = document.getElementById("btn-album-info-open-wood");
      const silverBtn = document.getElementById("btn-album-info-open-silver");
      const goldBtn = document.getElementById("btn-album-info-open-gold");
      if (woodBtn) woodBtn.onclick = null;
      if (silverBtn) silverBtn.onclick = null;
      if (goldBtn) goldBtn.onclick = null;
    }

    closeAlbumFeaturesInfoOverlay() {
      const overlay = document.getElementById("albumFeaturesInfoOverlay");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.onclick = null;
      }
      const closeBtn = document.getElementById("btn-album-features-info-close");
      if (closeBtn) closeBtn.onclick = null;
    }

    _bindAlbumInfoButton() {
      const btn = document.getElementById("btn-album-info");
      if (btn) btn.onclick = () => this.openAlbumInfoOverlay();
    }

    _bindAlbumStarButton() {
      const btn = document.getElementById("btn-album-stars");
      if (btn) btn.onclick = () => this.openAlbumExchangeOverlay();
      this.updateAlbumStarsUI();
    }

    updateAlbumStarsUI() {
      const stars = this.cm.getAlbumStars();
      const compact = stars > 9999 ? "9999+" : String(stars);
      const albumCountEl = document.getElementById("album-stars-count");
      if (albumCountEl) albumCountEl.textContent = compact;
      const exchangeCountEl = document.getElementById("album-exchange-stars-count");
      if (exchangeCountEl) exchangeCountEl.textContent = compact;
      const modalCountEl = document.getElementById("star-chests-balance-count");
      if (modalCountEl) modalCountEl.textContent = compact;

      const woodBtn = document.getElementById("btn-star-chest-wood");
      const silverBtn = document.getElementById("btn-star-chest-silver");
      const goldBtn = document.getElementById("btn-star-chest-gold");
      const infoWoodBtn = document.getElementById("btn-album-info-open-wood");
      const infoSilverBtn = document.getElementById("btn-album-info-open-silver");
      const infoGoldBtn = document.getElementById("btn-album-info-open-gold");
      if (woodBtn) woodBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.wood);
      if (silverBtn) silverBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.silver);
      if (goldBtn) goldBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.gold);
      if (infoWoodBtn) infoWoodBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.wood);
      if (infoSilverBtn) infoSilverBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.silver);
      if (infoGoldBtn) infoGoldBtn.disabled = !this.cm.canAffordStarChest(STAR_CHEST_COSTS.gold);
    }

    openStarChestsModal() {
      const overlay = document.getElementById("star-chests-modal");
      if (!overlay) return;
      this.updateAlbumStarsUI();
      overlay.classList.remove("hidden");
      const self = this;
      const close = () => self.closeStarChestsModal();
      const closeBtn = document.getElementById("star-chests-close");
      if (closeBtn) closeBtn.onclick = close;
      overlay.onclick = (e) => { if (e.target === overlay) close(); };
      const woodBtn = document.getElementById("btn-star-chest-wood");
      const silverBtn = document.getElementById("btn-star-chest-silver");
      const goldBtn = document.getElementById("btn-star-chest-gold");
      if (woodBtn) woodBtn.onclick = () => self._openStarChest("wood");
      if (silverBtn) silverBtn.onclick = () => self._openStarChest("silver");
      if (goldBtn) goldBtn.onclick = () => self._openStarChest("gold");
    }

    closeStarChestsModal() {
      const overlay = document.getElementById("star-chests-modal");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.onclick = null;
      }
      const closeBtn = document.getElementById("star-chests-close");
      if (closeBtn) closeBtn.onclick = null;
      const woodBtn = document.getElementById("btn-star-chest-wood");
      const silverBtn = document.getElementById("btn-star-chest-silver");
      const goldBtn = document.getElementById("btn-star-chest-gold");
      if (woodBtn) woodBtn.onclick = null;
      if (silverBtn) silverBtn.onclick = null;
      if (goldBtn) goldBtn.onclick = null;
    }

    _openStarChest(type) {
      const reward = this.cm.openStarChest(type);
      if (!reward) {
        this.updateAlbumStarsUI();
        return;
      }
      this.app.ui.setCoins(this.cm.getState().coins);
      this.updateAlbumStarsUI();

      const afterPack = () => {
        this.updateAlbumStarsUI();
        this.updateGlobalCardsProgress();
        this.updateCollectionButtons();
      };
      const afterPopup = () => {
        this.app._openPackOpeningFlowGeneric(reward.packStars, reward.cardCount, afterPack);
      };
      const text = reward.label + "\n+" + reward.coins + " coins\n+" + reward.cardCount + " sticker pack";
      this._showStarChestReward(text, afterPopup);
    }

    _showStarChestReward(text, onClose) {
      const overlay = document.getElementById("star-chest-reward-overlay");
      const textEl = document.getElementById("star-chest-reward-text");
      const okBtn = document.getElementById("btn-star-chest-reward-ok");
      if (!overlay || !textEl || !okBtn) {
        if (onClose) onClose();
        return;
      }
      textEl.textContent = text;
      overlay.classList.remove("hidden");
      const close = () => {
        overlay.classList.add("hidden");
        overlay.onclick = null;
        okBtn.onclick = null;
        if (onClose) onClose();
      };
      okBtn.onclick = close;
      overlay.onclick = (e) => { if (e.target === overlay) close(); };
    }

    _showHubView() {
      this._collectionView = "hub";
      this.closeAlbumFeaturesInfoOverlay();
      const hub = document.getElementById("album-overview-hub");
      const detail = document.getElementById("album-detail-view");
      const screen = document.getElementById("album-screen");
      const backBtn = document.getElementById("btn-album-back");
      if (hub) hub.classList.remove("hidden");
      if (detail) detail.classList.add("hidden");
      if (screen) screen.classList.remove("album-screen--detail");
      const titleEl = document.getElementById("album-screen-title");
      if (titleEl) titleEl.textContent = "Sticker Rooms";
      const progressWrap = document.getElementById("album-header-progress");
      if (progressWrap) progressWrap.classList.add("hidden");
      if (backBtn) {
        backBtn.classList.add("hidden");
        backBtn.onclick = null;
      }
      this.renderAlbumsOverview();
    }

    _showDetailView() {
      this._collectionView = "albumDetail";
      this.closeAlbumFeaturesInfoOverlay();
      const hub = document.getElementById("album-overview-hub");
      const detail = document.getElementById("album-detail-view");
      const screen = document.getElementById("album-screen");
      if (hub) hub.classList.add("hidden");
      if (detail) detail.classList.remove("hidden");
      if (screen) screen.classList.add("album-screen--detail");
      const def = ALBUM_DEFS.find((a) => a.id === this._selectedAlbumId);
      const titleEl = document.getElementById("album-screen-title");
      if (titleEl) titleEl.textContent = def ? def.name : "Sticker Room";
      const progressWrap = document.getElementById("album-header-progress");
      if (progressWrap) progressWrap.classList.add("hidden");
      const backBtn = document.getElementById("btn-album-back");
      if (backBtn) {
        backBtn.classList.remove("hidden");
        backBtn.onclick = () => this._onAlbumBackToHub();
      }
      this._renderStickerRoom(this._selectedAlbumId);
    }

    _onAlbumClose() {
      if (this._albumEventTimerId) {
        clearInterval(this._albumEventTimerId);
        this._albumEventTimerId = null;
      }
      if (typeof this._closeStickerPack === "function") this._closeStickerPack();
      if (typeof this.closeStarChestsModal === "function") this.closeStarChestsModal();
      if (typeof this.closeAlbumFeaturesInfoOverlay === "function") this.closeAlbumFeaturesInfoOverlay();
      if (this._albumEscapeHandler) {
        window.removeEventListener("keydown", this._albumEscapeHandler);
        this._albumEscapeHandler = null;
      }
      document.documentElement.classList.remove("album-screen-active");
      document.body.classList.remove("album-screen-active");
      const cb = this._onAlbumBackCallback;
      this._onAlbumBackCallback = null;
      if (cb) cb();
      else this.app.ui.showScreen("start-screen");
    }

    _onAlbumBackToHub() {
      this._showHubView();
    }

    _startAlbumEventTimer() {
      const albumTimerEl = document.getElementById("album-event-timer");
      if (!albumTimerEl) return;
      const tick = () => {
        const ms = getRemainingMs(this.cm.getState(), "albumEvent");
        albumTimerEl.textContent = ms > 0 ? "Ends in: " + formatRemaining(ms) : "Ended";
        if (ms <= 0 && this._albumEventTimerId) {
          clearInterval(this._albumEventTimerId);
          this._albumEventTimerId = null;
        }
      };
      tick();
      if (this._albumEventTimerId) clearInterval(this._albumEventTimerId);
      this._albumEventTimerId = setInterval(tick, 1000);
    }

    renderAlbumsOverview() {
      const grid = document.getElementById("album-tiles-grid");
      if (!grid) return;
      grid.innerHTML = "";
      ALBUM_DEFS.forEach((def) => {
        const roomProgress = this.cm.getRoomProgress(def.id);
        const hasNew = this.albumHasNewCards(def.id);
        const theme = getStickerRoomTheme(def.id);
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "album-cover-tile sticker-room-tile"
          + (hasNew ? " album-cover-tile--new" : "")
          + (roomProgress.placed >= roomProgress.total ? " album-cover-tile--complete" : "");
        tile.dataset.albumId = def.id;
        const cover = document.createElement("div");
        cover.className = "album-cover-tile-art sticker-room-tile-art";
        cover.style.background = theme.bg;
        const firstStickerId = (def.cardIds && def.cardIds[0]) || null;
        const emojiPreview = document.createElement("span");
        emojiPreview.className = "sticker-room-tile-emoji";
        emojiPreview.textContent = firstStickerId ? getStickerEmoji(firstStickerId) : "✨";
        cover.appendChild(emojiPreview);
        tile.appendChild(cover);
        if (hasNew) {
          const ribbon = document.createElement("span");
          ribbon.className = "album-tile-ribbon-new";
          ribbon.textContent = "NEW!";
          tile.appendChild(ribbon);
        }
        const nameSpan = document.createElement("span");
        nameSpan.className = "album-cover-tile-name";
        nameSpan.textContent = def.name || def.id;
        tile.appendChild(nameSpan);
        const pill = document.createElement("span");
        pill.className = "album-cover-tile-progress";
        pill.textContent = roomProgress.placed + "/" + roomProgress.total;
        tile.appendChild(pill);
        tile.onclick = () => this.openAlbum(def.id);
        grid.appendChild(tile);
      });
    }

    openAlbum(albumId) {
      this._selectedAlbumId = albumId;
      this._albumDetailPage = 1;
      this._showDetailView();
      if (this._shouldAnimateNewPack()) {
        this.cm.setLastAnimatedInboxSignature(this._getInboxSignature());
      }
    }

    // ---- Sticker Room scene -----------------------------------------------
    _renderStickerRoom(albumId) {
      const id = albumId || this._selectedAlbumId;
      const def = ALBUM_DEFS.find((a) => a.id === id);
      if (!def) return;
      const scene = document.getElementById("sticker-room-scene");
      const slotsHost = document.getElementById("sticker-room-slots");
      const placedHost = document.getElementById("sticker-room-placed");
      const tray = document.getElementById("sticker-tray");
      const emptyHint = document.getElementById("sticker-room-empty-hint");
      const trayHint = document.getElementById("sticker-tray-hint");
      const progressText = document.getElementById("sticker-room-progress-text");
      const nameEl = document.getElementById("album-name");
      if (!scene || !slotsHost || !placedHost || !tray) return;

      const theme = getStickerRoomTheme(id);
      scene.dataset.roomId = id;
      scene.style.setProperty("--room-bg", theme.bg);
      scene.style.setProperty("--room-floor", theme.floor);
      scene.style.setProperty("--room-wall", theme.wall);
      scene.style.setProperty("--room-accent", theme.accent);

      if (nameEl) nameEl.textContent = def.name || "";

      const stickers = this.cm.getStickersForRoom(id);
      const progress = this.cm.getRoomProgress(id);
      if (progressText) progressText.textContent = progress.placed + "/" + progress.total + " placed";

      // Slot silhouettes (always 9, even for not-yet-owned stickers).
      slotsHost.innerHTML = "";
      placedHost.innerHTML = "";
      stickers.forEach((s) => {
        const slot = document.createElement("div");
        slot.className = "sticker-slot" + (s.placed ? " sticker-slot--filled" : "");
        if (s.owned && !s.placed) slot.classList.add("sticker-slot--target");
        slot.dataset.stickerId = s.id;
        slot.style.left = (s.slot.x * 100) + "%";
        slot.style.top = (s.slot.y * 100) + "%";
        slot.style.setProperty("--slot-scale", String(s.slot.scale));
        const shadow = document.createElement("span");
        shadow.className = "sticker-slot-shadow";
        slot.appendChild(shadow);
        if (s.placed) {
          const placed = document.createElement("span");
          placed.className = "sticker-placed-glyph";
          placed.textContent = s.emoji;
          placed.title = s.name;
          slot.appendChild(placed);
        } else {
          const silhouette = document.createElement("span");
          silhouette.className = "sticker-slot-silhouette";
          silhouette.textContent = s.emoji;
          silhouette.setAttribute("aria-hidden", "true");
          slot.appendChild(silhouette);
          if (s.owned) {
            const sparkle = document.createElement("span");
            sparkle.className = "sticker-slot-sparkle";
            sparkle.textContent = "✨";
            sparkle.setAttribute("aria-hidden", "true");
            slot.appendChild(sparkle);
          }
        }
        slotsHost.appendChild(slot);
      });

      // Tray — show every owned-but-unplaced sticker.
      tray.innerHTML = "";
      const ownedUnplaced = stickers.filter((s) => s.owned && !s.placed);
      ownedUnplaced.forEach((s) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "sticker-tray-item" + (s.isNew ? " sticker-tray-item--new" : "");
        item.dataset.stickerId = s.id;
        item.setAttribute("aria-label", s.name);
        item.title = s.name;
        const glyph = document.createElement("span");
        glyph.className = "sticker-tray-glyph";
        glyph.textContent = s.emoji;
        item.appendChild(glyph);
        const label = document.createElement("span");
        label.className = "sticker-tray-name";
        label.textContent = s.name;
        item.appendChild(label);
        if (s.isNew) {
          const badge = document.createElement("span");
          badge.className = "sticker-tray-new-badge";
          badge.textContent = "NEW";
          item.appendChild(badge);
        }
        if (s.duplicates > 0) {
          const dup = document.createElement("span");
          dup.className = "sticker-tray-dup";
          dup.textContent = "x" + (s.duplicates + 1);
          item.appendChild(dup);
        }
        this._bindStickerDrag(item, s, scene);
        tray.appendChild(item);
      });

      const hasOwned = ownedUnplaced.length > 0;
      const allPlaced = progress.placed >= progress.total;
      if (emptyHint) emptyHint.classList.toggle("hidden", hasOwned || allPlaced);
      if (trayHint) {
        if (allPlaced) {
          trayHint.textContent = "Room complete!";
          trayHint.classList.add("sticker-tray-hint--complete");
        } else if (hasOwned) {
          trayHint.textContent = "Drag a sticker to its glowing spot";
          trayHint.classList.remove("sticker-tray-hint--complete");
        } else {
          trayHint.textContent = "Open packs to unlock more stickers";
          trayHint.classList.remove("sticker-tray-hint--complete");
        }
      }
      scene.classList.toggle("sticker-room-scene--complete", allPlaced);
    }

    _bindStickerDrag(itemEl, sticker, sceneEl) {
      const self = this;
      itemEl.style.touchAction = "none";
      itemEl.onpointerdown = (e) => {
        e.preventDefault();
        if (itemEl.dataset.dragging === "1") return;
        const startX = e.clientX;
        const startY = e.clientY;
        const glyph = itemEl.querySelector(".sticker-tray-glyph");
        const ghost = document.createElement("div");
        ghost.className = "sticker-drag-ghost";
        ghost.textContent = (glyph && glyph.textContent) || sticker.emoji || "✨";
        document.body.appendChild(ghost);
        const place = (x, y) => {
          ghost.style.left = x + "px";
          ghost.style.top = y + "px";
        };
        place(startX, startY);
        itemEl.dataset.dragging = "1";
        itemEl.classList.add("sticker-tray-item--dragging");

        try { itemEl.setPointerCapture(e.pointerId); } catch (_) {}

        const targetSlot = document.querySelector('#sticker-room-slots .sticker-slot[data-sticker-id="' + sticker.id + '"]');
        if (targetSlot) targetSlot.classList.add("sticker-slot--hot");

        const onMove = (mv) => {
          place(mv.clientX, mv.clientY);
          const hovered = document.elementFromPoint(mv.clientX, mv.clientY);
          const slotHover = hovered && hovered.closest && hovered.closest(".sticker-slot");
          document.querySelectorAll(".sticker-slot--hover").forEach((el) => el.classList.remove("sticker-slot--hover"));
          if (slotHover) slotHover.classList.add("sticker-slot--hover");
        };
        const cleanup = () => {
          itemEl.onpointermove = null;
          itemEl.onpointerup = null;
          itemEl.onpointercancel = null;
          itemEl.classList.remove("sticker-tray-item--dragging");
          delete itemEl.dataset.dragging;
          if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost);
          document.querySelectorAll(".sticker-slot--hover").forEach((el) => el.classList.remove("sticker-slot--hover"));
          document.querySelectorAll(".sticker-slot--hot").forEach((el) => el.classList.remove("sticker-slot--hot"));
          try { itemEl.releasePointerCapture(e.pointerId); } catch (_) {}
        };
        const onUp = (up) => {
          const hovered = document.elementFromPoint(up.clientX, up.clientY);
          const slotHit = hovered && hovered.closest && hovered.closest(".sticker-slot");
          const matched = slotHit && slotHit.dataset.stickerId === sticker.id && !slotHit.classList.contains("sticker-slot--filled");
          cleanup();
          if (matched) {
            self._onStickerPlaced(sticker.id);
          } else {
            // bounce back
            itemEl.classList.add("sticker-tray-item--bounce");
            setTimeout(() => itemEl.classList.remove("sticker-tray-item--bounce"), 320);
          }
        };
        itemEl.onpointermove = onMove;
        itemEl.onpointerup = onUp;
        itemEl.onpointercancel = (cv) => {
          cleanup();
          // treat cancel like an incorrect drop
          itemEl.classList.add("sticker-tray-item--bounce");
          setTimeout(() => itemEl.classList.remove("sticker-tray-item--bounce"), 320);
        };
      };
    }

    _onStickerPlaced(stickerId) {
      const result = this.cm.placeSticker(stickerId);
      if (!result) return;
      const def = CARD_DEFS[stickerId];
      const albumId = def && def.albumId;
      this._renderStickerRoom(albumId);
      this.updateGlobalCardsProgress();
      this.updateAlbumStarsUI();
      // Flash placement effect on the matching slot.
      const slot = document.querySelector('#sticker-room-slots .sticker-slot[data-sticker-id="' + stickerId + '"]');
      if (slot) {
        slot.classList.add("sticker-slot--just-placed");
        setTimeout(() => slot.classList.remove("sticker-slot--just-placed"), 700);
      }
      if (this.app && this.app.ui) this.app.ui.setCoins(this.cm.getState().coins);
      if (result.justCompletedRoom && result.reward) {
        const after = () => {
          this.updateCollectionButtons();
          if (result.allCardsComplete) this.showFinalRewardModal(() => this.updateCollectionButtons());
        };
        this.showReward(result.reward, result.albumId, after);
      } else if (result.allCardsComplete) {
        this.showFinalRewardModal(() => this.updateCollectionButtons());
      }
      this.updateCollectionButtons();
    }

    _updateAlbumProgress(albumId) {
      const id = albumId || this._selectedAlbumId;
      const p = this.cm.getAlbumProgress(id, true);
      const def = ALBUM_DEFS.find((a) => a.id === id);
      const el = document.getElementById("album-progress-text");
      if (el) el.textContent = p.collected + "/" + p.total;
      const nameEl = document.getElementById("album-name");
      if (nameEl) nameEl.textContent = def ? def.name : "";
    }

    _getAlbumPageCount(albumId) {
      const cards = this.cm.getCardsForAlbum(albumId || this._selectedAlbumId);
      const perPage = Math.max(1, this._albumDetailPageSize || 6);
      return Math.max(1, Math.ceil(cards.length / perPage));
    }

    _updateDetailPagerUI() {
      const pageCount = this._getAlbumPageCount(this._selectedAlbumId);
      this._albumDetailPage = Math.max(1, Math.min(pageCount, this._albumDetailPage || 1));
      const pageText = document.getElementById("album-detail-page-text");
      if (pageText) pageText.textContent = this._albumDetailPage + "/" + pageCount;
      const prevBtn = document.getElementById("btn-album-detail-prev");
      const nextBtn = document.getElementById("btn-album-detail-next");
      if (prevBtn) prevBtn.disabled = this._albumDetailPage <= 1;
      if (nextBtn) nextBtn.disabled = this._albumDetailPage >= pageCount;
    }

    _changeAlbumPage(delta) {
      const pageCount = this._getAlbumPageCount(this._selectedAlbumId);
      const next = Math.max(1, Math.min(pageCount, this._albumDetailPage + delta));
      if (next === this._albumDetailPage) return;
      this._albumDetailPage = next;
      this._renderAlbumGrid(this._selectedAlbumId);
      this._updateDetailPagerUI();
      this._updateTapCollectHint();
    }

    updateGlobalCardsProgress() {
      // The new "Stickers" feature is a direct playable level rather than a
      // multi-album collection, so the legacy home progress widget is hidden.
      // The underlying card data still drives pack openings via Battle Pass,
      // Wheel, and Star Chests, but its progress is no longer surfaced here.
      const homeWidget = document.getElementById("cards-progress-widget-home");
      if (homeWidget) homeWidget.classList.add("hidden");
    }

    showFinalRewardModal(onClose) {
      const modal = document.getElementById("final-reward-modal");
      if (!modal) return;
      if (typeof AudioPlayer !== "undefined" && AudioPlayer.win) AudioPlayer.win();
      modal.classList.remove("hidden");
      const close = () => {
        modal.classList.add("hidden");
        modal.onclick = null;
        const btn = document.getElementById("btn-final-reward-close");
        if (btn) btn.onclick = null;
        this.updateGlobalCardsProgress();
        if (onClose) onClose();
      };
      modal.onclick = (e) => { if (e.target === modal) close(); };
      const btn = document.getElementById("btn-final-reward-close");
      if (btn) btn.onclick = close;
    }

    _updateTapCollectHint() {
      const cards = this.cm.getCardsForAlbum(this._selectedAlbumId) || [];
      const hasNew = cards.some((c) => c.isNew);
      const el = document.getElementById("album-tap-collect-hint");
      if (hasNew) el.classList.remove("hidden");
      else el.classList.add("hidden");
    }

    _renderAlbumGrid(albumId) {
      const grid = document.getElementById("album-grid");
      if (!grid) return;
      grid.innerHTML = "";
      const id = albumId || this._selectedAlbumId;
      const cards = this.cm.getCardsForAlbum(id);
      const perPage = Math.max(1, this._albumDetailPageSize || 6);
      const pageCount = Math.max(1, Math.ceil(cards.length / perPage));
      this._albumDetailPage = Math.max(1, Math.min(pageCount, this._albumDetailPage || 1));
      const start = (this._albumDetailPage - 1) * perPage;
      const pageCards = cards.slice(start, start + perPage);
      pageCards.forEach((card) => {
        const tile = document.createElement("div");
        const cardState = card.isNew ? "new" : (card.collected ? "collected" : "locked");
        tile.className = "album-card-tile album-card-tile--" + cardState + (cardState === "locked" ? " locked" : "");
        tile.dataset.cardId = card.id;
        tile.innerHTML = '<span class="card-stars"></span>';
        const starsEl = tile.querySelector(".card-stars");
        if (starsEl) {
          starsEl.innerHTML = "";
          for (let i = 0; i < card.rarityStars; i++) {
            const s = document.createElement("img");
            s.src = ALBUM_CARD_STAR_SRC;
            s.alt = "";
            s.className = "card-star-icon";
            starsEl.appendChild(s);
          }
        }
        if (card.isNew) {
          const tag = document.createElement("span");
          tag.className = "card-new-tag";
          tag.textContent = "NEW";
          tile.appendChild(tag);
        }
        if (card.collected || card.isNew) {
          const art = document.createElement("div");
          art.className = "card-art";
          if (card.imageSrc) {
            const img = document.createElement("img");
            img.src = card.imageSrc;
            img.alt = card.name;
            img.loading = "lazy";
            img.className = "card-art-img";
            img.onerror = function () {
              art.classList.add("card-art-placeholder");
              this.style.display = "none";
            };
            art.appendChild(img);
          } else {
            art.classList.add("card-art-placeholder");
          }
          tile.appendChild(art);
          const nameSpan = document.createElement("span");
          nameSpan.className = "card-name";
          nameSpan.textContent = card.name;
          tile.appendChild(nameSpan);
          if (card.collected && card.duplicates > 0) {
            const dup = document.createElement("span");
            dup.className = "card-duplicate-count";
            dup.textContent = "x" + (card.duplicates + 1);
            tile.appendChild(dup);
          }
        } else {
          const sil = document.createElement("div");
          sil.className = "card-silhouette";
          sil.style.backgroundImage = "url('" + ALBUM_QUESTION_TILE_SRC + "')";
          tile.appendChild(sil);
        }
        tile.onclick = () => this._onCardTap(tile, card);
        grid.appendChild(tile);
      });
      this._updateDetailPagerUI();
    }

    _applyAlbumFigmaAssets() {
      const bg = document.querySelector("#album-screen .album-screen-bg");
      if (bg) bg.style.backgroundImage = "url('" + ALBUM_BG_SRC + "')";
      const cardIcon = document.querySelector("#album-screen .album-resource-icon--cards");
      if (cardIcon) cardIcon.style.backgroundImage = "url('" + ALBUM_ICON_CARD_SRC + "')";
      const chestBtn = document.getElementById("btn-album-stars");
      if (chestBtn) chestBtn.style.backgroundImage = "url('" + ALBUM_ICON_CHEST_SRC + "')";
      const infoBtn = document.getElementById("btn-album-info");
      if (infoBtn) infoBtn.style.backgroundImage = "url('" + ALBUM_ICON_INFO_SRC + "')";
      const coinIcon = document.querySelector("#album-screen .album-prize-icon--coin");
      if (coinIcon) coinIcon.style.backgroundImage = "url('" + ALBUM_ICON_COIN_SRC + "')";
      const gemIcon = document.querySelector("#album-screen .album-prize-icon--gem");
      if (gemIcon) gemIcon.style.backgroundImage = "url('" + ALBUM_ICON_GEM_SRC + "')";
      const sortIcon = document.querySelector("#album-screen .album-prize-icon--sort");
      if (sortIcon) sortIcon.style.backgroundImage = "url('" + ALBUM_ICON_SORT_SRC + "')";
      const prev = document.getElementById("btn-album-detail-prev");
      const next = document.getElementById("btn-album-detail-next");
      if (prev) prev.style.backgroundImage = "url('" + ALBUM_ICON_ARROW_LEFT_SRC + "')";
      if (next) next.style.backgroundImage = "url('" + ALBUM_ICON_ARROW_RIGHT_SRC + "')";
      const bottomBanner = document.querySelector("#album-screen .album-bottom-banner");
      if (bottomBanner) bottomBanner.style.backgroundImage = "url('" + ALBUM_BOTTOM_BANNER_SRC + "')";
    }

    _applyAlbumExchangeAssets() {
      const closeIcon = document.querySelector("#albumInfoOverlay .album-exchange-close");
      if (closeIcon) closeIcon.style.backgroundImage = "url('" + ALBUM_EXCHANGE_CLOSE_SRC + "')";
      const woodChest = document.querySelector("#albumInfoOverlay .album-exchange-chest--wood");
      if (woodChest) woodChest.style.backgroundImage = "url('" + ALBUM_EXCHANGE_CHEST_WOOD_SRC + "')";
      const silverChest = document.querySelector("#albumInfoOverlay .album-exchange-chest--silver");
      if (silverChest) silverChest.style.backgroundImage = "url('" + ALBUM_EXCHANGE_CHEST_SILVER_SRC + "')";
      const goldChest = document.querySelector("#albumInfoOverlay .album-exchange-chest--gold");
      if (goldChest) goldChest.style.backgroundImage = "url('" + ALBUM_EXCHANGE_CHEST_GOLD_SRC + "')";
      document.querySelectorAll("#albumInfoOverlay .album-exchange-pill-icon--coin").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_EXCHANGE_COIN_SRC + "')";
      });
      document.querySelectorAll("#albumInfoOverlay .album-exchange-pill-icon--energy").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_EXCHANGE_ENERGY_SRC + "')";
      });
      document.querySelectorAll("#albumInfoOverlay .album-exchange-pill-icon--gem").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_EXCHANGE_GEM_SRC + "')";
      });
      document.querySelectorAll("#albumInfoOverlay .album-exchange-pill-icon--bp").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_EXCHANGE_BP_STAR_SRC + "')";
      });
      document.querySelectorAll("#albumInfoOverlay .album-exchange-requirement-icon, #albumInfoOverlay .album-exchange-stars-icon").forEach((el) => {
        el.style.backgroundImage = "url('" + ALBUM_CARD_STAR_SRC + "')";
      });
    }

    _isFeaturesAlbum(albumId) {
      if (!albumId) return this._collectionView === "albumDetail";
      const def = ALBUM_DEFS.find((a) => a.id === albumId);
      const name = def && def.name ? String(def.name) : "";
      const explicitMatch = albumId === "features" || /features?/i.test(name);
      const hasExplicitFeaturesAlbum = ALBUM_DEFS.some((a) => a.id === "features" || /features?/i.test(String(a.name || "")));
      if (hasExplicitFeaturesAlbum) return explicitMatch;
      return this._collectionView === "albumDetail";
    }

    _applyAlbumFeaturesInfoAssets() {
      const pack = document.querySelector("#albumFeaturesInfoOverlay .album-features-tutorial-icon--pack");
      const star = document.querySelector("#albumFeaturesInfoOverlay .album-features-tutorial-icon--star");
      const chest = document.querySelector("#albumFeaturesInfoOverlay .album-features-tutorial-icon--chest");
      const tap = document.querySelector("#albumFeaturesInfoOverlay .album-features-info-close-icon");
      if (pack) pack.style.backgroundImage = "url('" + ALBUM_FEATURES_INFO_PACK_SRC + "')";
      if (star) star.style.backgroundImage = "url('" + ALBUM_FEATURES_INFO_STAR_SRC + "')";
      if (chest) chest.style.backgroundImage = "url('" + ALBUM_FEATURES_INFO_CHEST_SRC + "')";
      if (tap) tap.style.backgroundImage = "url('" + ALBUM_FEATURES_INFO_TAP_SRC + "')";
    }

    _onCardTap(tile, card) {
      if (!card.isNew) return;
      tile.classList.add("collecting");
      const result = this.cm.collectCard(card.id);
      setTimeout(() => {
        tile.classList.remove("collecting");
        this._renderAlbumGrid(this._selectedAlbumId);
        this._updateAlbumProgress(this._selectedAlbumId);
        this._updateTapCollectHint();
        this.updateGlobalCardsProgress();
        this.app.ui.setCoins(this.cm.getState().coins);
        const albumIdForReward = CARD_DEFS[card.id] ? CARD_DEFS[card.id].albumId : (ALBUM_DEFS[0] && ALBUM_DEFS[0].id);
        if (result && result.albumComplete) {
          this.showReward(result.reward, albumIdForReward, () => {
            this._updateCollectionButtons();
            if (result.allCardsComplete) this.showFinalRewardModal(() => this._updateCollectionButtons());
          });
        } else if (result && result.allCardsComplete) {
          this.showFinalRewardModal(() => this._updateCollectionButtons());
        }
        this._updateCollectionButtons();
      }, 400);
    }

    showReward(reward, albumId, onContinue) {
      if (typeof albumId === "function") {
        onContinue = albumId;
        albumId = ALBUM_DEFS[0] ? ALBUM_DEFS[0].id : "pixar";
      }
      document.getElementById("reward-name").textContent = reward.name;
      document.getElementById("reward-rarity").textContent = reward.rarity || "Common";
      const wrap = document.getElementById("reward-character-wrap");
      wrap.innerHTML = "";
      const img = new Image();
      img.src = generateRewardCharacterArt(reward.artSeed || 10, 140);
      wrap.appendChild(img);
      const p = this.cm.getAlbumProgress(albumId || (ALBUM_DEFS[0] && ALBUM_DEFS[0].id));
      document.getElementById("reward-progress-text").textContent = p.collected + "/" + p.total;
      this.rewardModal.classList.remove("hidden");
      const skip = () => {
        this.rewardModal.classList.add("hidden");
        if (onContinue) onContinue();
      };
      document.getElementById("reward-modal-skip").onclick = skip;
      this.rewardModal.onclick = (e) => { if (e.target === this.rewardModal) skip(); };
    }

    showToastCardFound() {
      this.toast.classList.remove("hidden");
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => this.toast.classList.add("hidden"), 2000);
    }

    showToastCardEarned() {
      const el = document.getElementById("toast-card-earned");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastCardEarnedTimer);
      this._toastCardEarnedTimer = setTimeout(() => el.classList.add("hidden"), 2000);
    }

    showToastUnlocksAfterLevel5() {
      const el = document.getElementById("toast-collection-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastLockedTimer);
      this._toastLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    updateCollectionButtons() {
      const save = this.cm.getState();
      const unlocked = this.cm.isAvailable();
      const albumActive = isEventActive(save, "albumEvent");
      const available = unlocked && albumActive;
      const hasNew = (save.cards.newInbox || []).length > 0;
      const btn = document.getElementById("nav-collection");
      if (btn) {
        btn.classList.toggle("locked", !available);
        btn.classList.toggle("event-ended", unlocked && !albumActive);
        btn.setAttribute("aria-disabled", available ? "false" : "true");
        btn.title = available ? "Sticker Rooms" : (unlocked && !albumActive ? "Event ended" : "Unlocks after Level 2");
        btn.setAttribute("aria-label", available ? "Sticker Rooms" : (unlocked && !albumActive ? "Event ended" : "Unlocks after Level 2"));
        const badge = btn.querySelector(".nav-badge") || btn.querySelector(".collection-badge");
        if (badge) {
          if (available && hasNew) badge.classList.remove("hidden");
          else badge.classList.add("hidden");
        }
      }
      this.updateAlbumStarsUI();
    }
  }

  class LostTempleManager {
    constructor(saveRef, persistFn, appRef) {
      this._save = saveRef;
      this._persist = persistFn || (() => saveSave(this._save));
      this.app = appRef;
      this._timerId = null;
      this._tutorialActive = false;
      this._breakAnimActive = false;
      this._escapeHandler = null;
    }

    _ensureEventAndStage() {
      if (!this._save.lostTempleEvent) {
        this._save.lostTempleEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
      }
      const maxStage = LOST_TEMPLE_STAGES.length - 1;
      const stageIndex = Math.max(0, Math.min(maxStage, this._save.lostTempleCurrentStage || 0));
      this._save.lostTempleCurrentStage = stageIndex;
      if (!this._save.lostTempleState
        || this._save.lostTempleState.stageIndex !== stageIndex
        || this._save.lostTempleState.boardSize !== LOST_TEMPLE_STAGES[stageIndex].boardSize
        || typeof this._save.lostTempleState.gemGoal !== "number") {
        this._save.lostTempleState = buildLostTempleStageState(stageIndex);
      }
    }

    updateWidget() {
      const widget = document.getElementById("lost-temple-widget");
      if (widget) widget.classList.remove("hidden");
      const countEl = document.getElementById("lost-temple-widget-hammers");
      if (countEl) countEl.textContent = String(Math.max(0, this._save.eventHammers || 0));
      const timerEl = document.getElementById("lost-temple-widget-timer");
      if (timerEl) {
        const remain = getRemainingMs(this._save, "lostTempleEvent");
        const d = Math.max(0, Math.ceil(remain / 86400000));
        timerEl.textContent = remain > 0 ? (d + "d") : "end";
      }
      const badge = document.getElementById("lost-temple-badge");
      const st = this._save.lostTempleState;
      const claimable = !!(st && st.chestClaimable && !st.chestClaimed);
      const showBadge = (this._save.eventHammers || 0) > 0 || claimable;
      if (badge) badge.classList.toggle("hidden", !showBadge);
    }

    openScreen() {
      this._ensureEventAndStage();
      const screen = document.getElementById("lostTempleScreen");
      if (!screen) return;
      this._bindButtons();
      document.documentElement.classList.add("lost-temple-screen-active");
      document.body.classList.add("lost-temple-screen-active");
      this._escapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const infoOverlay = document.getElementById("lostTempleInfoOverlay");
        if (infoOverlay && !infoOverlay.classList.contains("hidden")) {
          this.closeInfoOverlay();
          e.preventDefault();
          return;
        }
        e.preventDefault();
        this.closeScreen();
      };
      window.addEventListener("keydown", this._escapeHandler);
      this._render();
      screen.classList.remove("hidden");
      this._startTimer();
      if (!this._save.lostTempleTutorialCompleted) {
        this.startTutorial();
      }
    }

    closeScreen() {
      const screen = document.getElementById("lostTempleScreen");
      if (screen) screen.classList.add("hidden");
      this._stopTimer();
      this._unbindButtons();
      this.closeInfoOverlay();
      if (this._escapeHandler) {
        window.removeEventListener("keydown", this._escapeHandler);
        this._escapeHandler = null;
      }
      document.documentElement.classList.remove("lost-temple-screen-active");
      document.body.classList.remove("lost-temple-screen-active");
    }

    _bindButtons() {
      const closeBtn = document.getElementById("btn-lost-temple-close");
      const infoBtn = document.getElementById("btn-lost-temple-info");
      const claimBtn = document.getElementById("btn-lost-temple-claim");
      const nextBtn = document.getElementById("btn-lost-temple-next-stage");
      if (closeBtn) closeBtn.onclick = () => this.closeScreen();
      if (infoBtn) infoBtn.onclick = () => this.openInfoOverlay();
      if (claimBtn) claimBtn.onclick = () => this.claimChest();
      if (nextBtn) nextBtn.onclick = () => this.nextStage();
      const infoOverlay = document.getElementById("lostTempleInfoOverlay");
      if (infoOverlay) infoOverlay.onclick = (e) => { if (e.target === infoOverlay) this.closeInfoOverlay(); };
      const infoContinue = document.getElementById("btn-lost-temple-info-continue");
      if (infoContinue) infoContinue.onclick = () => this.closeInfoOverlay();
    }

    _unbindButtons() {
      const ids = [
        "btn-lost-temple-close",
        "btn-lost-temple-info",
        "btn-lost-temple-claim",
        "btn-lost-temple-next-stage",
        "btn-lost-temple-info-continue",
      ];
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.onclick = null;
      });
      const infoOverlay = document.getElementById("lostTempleInfoOverlay");
      if (infoOverlay) infoOverlay.onclick = null;
    }

    _startTimer() {
      const tick = () => {
        const timerEl = document.getElementById("lost-temple-timer");
        if (timerEl) timerEl.textContent = "Ends in: " + formatRemaining(getRemainingMs(this._save, "lostTempleEvent"));
      };
      tick();
      this._stopTimer();
      this._timerId = setInterval(tick, 1000);
    }

    _stopTimer() {
      if (this._timerId) clearInterval(this._timerId);
      this._timerId = null;
    }

    _render() {
      this._ensureEventAndStage();
      const st = this._save.lostTempleState;
      const board = document.getElementById("lost-temple-board");
      if (!board || !st) return;
      board.innerHTML = "";
      board.style.gridTemplateColumns = "repeat(" + st.boardSize + ", 1fr)";
      st.tiles.forEach((tile, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        const patternClass = " lost-temple-tile--pattern-" + (idx % 4);
        btn.className = "lost-temple-tile" + patternClass + (tile.broken ? " lost-temple-tile--broken" : "") + ((this._save.eventHammers || 0) <= 0 ? " lost-temple-tile--nohammer" : "");
        btn.setAttribute("role", "gridcell");
        if (tile.broken) {
          const icon = this._lootIcon(tile.lootType);
          btn.textContent = icon;
          const label = document.createElement("span");
          label.className = "lost-temple-loot-label";
          label.textContent = this._lootLabel(tile.lootType);
          btn.appendChild(label);
        }
        btn.onclick = () => this.onTileTap(idx);
        board.appendChild(btn);
      });
      const stageLabel = document.getElementById("lost-temple-stage-label");
      if (stageLabel) stageLabel.textContent = "Stage " + (st.stageIndex + 1) + "/" + LOST_TEMPLE_STAGES.length;
      const obj = document.getElementById("lost-temple-objective");
      if (obj) obj.textContent = st.chestClaimable ? "Chest is ready! Claim your reward." : "Find chest tokens to fill progress.";
      const ch = document.getElementById("lost-temple-chest-progress");
      if (ch) ch.textContent = st.chestProgress + "/" + st.chestGoal;
      const gem = document.getElementById("lost-temple-gem-progress");
      if (gem) gem.textContent = st.gemProgress + "/" + st.gemGoal;
      const hm = document.getElementById("lost-temple-hammers-count");
      if (hm) hm.textContent = String(Math.max(0, this._save.eventHammers || 0));
      const claimBtn = document.getElementById("btn-lost-temple-claim");
      const nextBtn = document.getElementById("btn-lost-temple-next-stage");
      if (claimBtn) claimBtn.classList.toggle("hidden", !(st.chestClaimable && !st.chestClaimed));
      if (nextBtn) nextBtn.classList.toggle("hidden", !(st.boardCompleted && st.chestClaimed));
      this.updateWidget();
    }

    _lootIcon(type) {
      if (type === "chest") return "🧩";
      if (type === "gem") return "💎";
      if (type === "relic") return "🗿";
      if (type === "bonusHammer") return "🔨";
      if (type === "coins") return "🪙";
      return "·";
    }

    _lootLabel(type) {
      if (type === "chest") return "Chest";
      if (type === "gem") return "Gem";
      if (type === "relic") return "Relic";
      if (type === "bonusHammer") return "Hammer";
      if (type === "coins") return "Coins";
      return "";
    }

    onTileTap(idx) {
      const st = this._save.lostTempleState;
      if (!st || !st.tiles[idx]) return;
      if (this._breakAnimActive) return;
      const tile = st.tiles[idx];
      if (tile.broken) return;
      if (!this.app.canUseHammer()) return;
      this.app.spendHammer();
      const board = document.getElementById("lost-temple-board");
      const tileEl = board && board.children ? board.children[idx] : null;
      const finishBreak = () => {
        tile.broken = true;
        this._applyLoot(tile.lootType);
        st.boardCompleted = st.tiles.every((t) => t.broken);
        this._persist();
        this._breakAnimActive = false;
        this._render();
        if (this._tutorialActive) {
          this.finishTutorial();
        }
      };
      this._breakAnimActive = true;
      this._playHammerHitAnimation(tileEl, tile.lootType, finishBreak);
    }

    _playHammerHitAnimation(tileEl, lootType, onDone) {
      if (!tileEl) {
        if (onDone) onDone();
        return;
      }
      tileEl.classList.add("lost-temple-tile--impact");
      const hammer = document.createElement("span");
      hammer.className = "lost-temple-hit-hammer";
      hammer.textContent = "🔨";
      tileEl.appendChild(hammer);

      const crack = document.createElement("span");
      crack.className = "lost-temple-hit-crack";
      crack.textContent = "✶";
      tileEl.appendChild(crack);

      const spark = document.createElement("span");
      spark.className = "lost-temple-hit-spark";
      spark.textContent = this._lootIcon(lootType);
      tileEl.appendChild(spark);

      setTimeout(() => {
        tileEl.classList.remove("lost-temple-tile--impact");
        if (hammer.parentNode) hammer.parentNode.removeChild(hammer);
        if (crack.parentNode) crack.parentNode.removeChild(crack);
      }, 340);

      setTimeout(() => {
        if (spark.parentNode) spark.parentNode.removeChild(spark);
        if (onDone) onDone();
      }, 430);
    }

    _applyLoot(type) {
      const st = this._save.lostTempleState;
      if (!st) return;
      if (type === "chest") {
        st.chestProgress = Math.min(st.chestGoal, st.chestProgress + 1);
        if (st.chestProgress >= st.chestGoal) st.chestClaimable = true;
        return;
      }
      if (type === "gem") {
        st.gemProgress = Math.min(st.gemGoal, (st.gemProgress || 0) + 1);
        this._save.gemsTotal = (this._save.gemsTotal || 0) + 1;
        return;
      }
      if (type === "relic") {
        this.app.collectionManager.addAlbumStars(2);
        this.app.collectionUI.updateAlbumStarsUI();
        return;
      }
      if (type === "bonusHammer") {
        this.app.addHammers(1);
        return;
      }
      if (type === "coins") {
        this.app.addCoins(15);
      }
    }

    claimChest() {
      const st = this._save.lostTempleState;
      if (!st || !st.chestClaimable || st.chestClaimed) return;
      st.chestClaimed = true;
      const reward = this._rollChestReward(st.chestTier);
      this.app.addCoins(reward.coins);
      this.app.collectionManager.addAlbumStars(reward.albumStars);
      this.app.addHammers(reward.hammers);
      this._persist();
      this.app.collectionUI.updateAlbumStarsUI();
      this._showChestPopup(reward);
      this._render();
    }

    _rollChestReward(tier) {
      if (tier === "mystery") {
        return { name: "Mystery Chest", coins: 500, albumStars: 20, hammers: 4, packStars: 3, cardCount: 4 };
      }
      if (tier === "archaeologist") {
        return { name: "Archaeologist's Chest", coins: 260, albumStars: 10, hammers: 2, packStars: 2, cardCount: 3 };
      }
      return { name: "Adventurer's Chest", coins: 120, albumStars: 4, hammers: 1, packStars: 1, cardCount: 2 };
    }

    _showChestPopup(reward) {
      const popup = document.getElementById("lostTempleChestPopup");
      const title = document.getElementById("lost-temple-chest-title");
      const text = document.getElementById("lost-temple-chest-reward-text");
      const ok = document.getElementById("btn-lost-temple-chest-ok");
      if (!popup || !title || !text || !ok) return;
      title.textContent = reward.name;
      text.textContent = "+" + reward.coins + " coins\n+" + reward.albumStars + " album stars\n+" + reward.hammers + " hammers";
      popup.classList.remove("hidden");
      const close = () => {
        popup.classList.add("hidden");
        popup.onclick = null;
        ok.onclick = null;
        this.app._openPackOpeningFlowGeneric(reward.packStars, reward.cardCount, () => {
          this.app.collectionUI.updateCollectionButtons();
          this.app.collectionUI.updateGlobalCardsProgress();
        });
      };
      ok.onclick = close;
      popup.onclick = (e) => { if (e.target === popup) close(); };
    }

    nextStage() {
      const nextIndex = Math.min(LOST_TEMPLE_STAGES.length - 1, (this._save.lostTempleCurrentStage || 0) + 1);
      this._save.lostTempleCurrentStage = nextIndex;
      this._save.lostTempleState = buildLostTempleStageState(nextIndex);
      this._persist();
      this._render();
    }

    openInfoOverlay() {
      const overlay = document.getElementById("lostTempleInfoOverlay");
      if (!overlay) return;
      overlay.classList.remove("hidden");
      const infoContinue = document.getElementById("btn-lost-temple-info-continue");
      if (infoContinue) infoContinue.onclick = () => this.closeInfoOverlay();
    }

    closeInfoOverlay() {
      const overlay = document.getElementById("lostTempleInfoOverlay");
      if (overlay) overlay.classList.add("hidden");
    }

    startTutorial() {
      const overlay = document.getElementById("lostTempleTutorialOverlay");
      const btn = document.getElementById("btn-lost-temple-tutorial-ok");
      if (!overlay || !btn) return;
      this._tutorialActive = true;
      overlay.classList.remove("hidden");
      btn.onclick = () => {
        overlay.classList.add("hidden");
        btn.onclick = null;
      };
    }

    finishTutorial() {
      const overlay = document.getElementById("lostTempleTutorialOverlay");
      if (overlay) overlay.classList.add("hidden");
      this._tutorialActive = false;
      this._save.lostTempleTutorialCompleted = true;
      this._persist();
    }
  }

  class CollectionPackAnimator {
    constructor() {
      this._overlay = null;
      this._onComplete = null;
      this._timeouts = [];
      this._playing = false;
    }

    _clearTimeouts() {
      this._timeouts.forEach((t) => clearTimeout(t));
      this._timeouts = [];
    }

    _removeAllFlyingCards() {
      document.querySelectorAll(".flying-card").forEach((el) => el.remove());
    }

    _skip() {
      if (!this._playing) return;
      this._playing = false;
      this._clearTimeouts();
      this._removeAllFlyingCards();
      if (this._overlay && this._overlay.parentNode) this._overlay.parentNode.removeChild(this._overlay);
      this._overlay = null;
      if (this._onComplete) {
        const fn = this._onComplete;
        this._onComplete = null;
        fn();
      }
    }

    play(cardIds, getTileByCardId, getCardImageSrc, onComplete) {
      if (this._playing) return;
      this._playing = true;
      this._onComplete = onComplete;
      const ids = cardIds.slice(0, 3);
      const overlay = document.createElement("div");
      overlay.className = "pack-overlay";
      overlay.setAttribute("aria-hidden", "false");

      const skipBar = document.createElement("div");
      skipBar.className = "pack-overlay-skip tap-to-skip-bar";
      skipBar.innerHTML = '<span class="tap-to-skip-text">Tap to skip</span>';
      skipBar.onclick = () => this._skip();
      overlay.onclick = (e) => { if (e.target === overlay) this._skip(); };

      const packEl = document.createElement("div");
      packEl.className = "card-pack";
      packEl.innerHTML = '<div class="card-pack-inner"><div class="card-pack-flap"></div><div class="card-pack-shine"></div></div>';

      const sparkleContainer = document.createElement("div");
      sparkleContainer.className = "pack-sparkles";

      overlay.appendChild(packEl);
      overlay.appendChild(sparkleContainer);
      overlay.appendChild(skipBar);
      document.body.appendChild(overlay);
      this._overlay = overlay;

      const packRect = () => packEl.getBoundingClientRect();
      const packCenter = () => {
        const r = packRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      };

      this._timeouts.push(setTimeout(() => {
        packEl.classList.add("pack-opening");
        for (let i = 0; i < 8; i++) {
          const sp = document.createElement("div");
          sp.className = "pack-sparkle";
          sp.style.left = (50 + (Math.random() - 0.5) * 40) + "%";
          sp.style.top = (50 + (Math.random() - 0.5) * 40) + "%";
          sp.style.animationDelay = (i * 0.05) + "s";
          sparkleContainer.appendChild(sp);
        }
      }, 800));

      const self = this;
      const finish = () => {
        if (!self._playing) return;
        self._timeouts.push(setTimeout(() => {
          self._playing = false;
          self._clearTimeouts();
          self._removeAllFlyingCards();
          if (self._overlay && self._overlay.parentNode) self._overlay.parentNode.removeChild(self._overlay);
          self._overlay = null;
          if (self._onComplete) {
            const fn = self._onComplete;
            self._onComplete = null;
            fn();
          }
        }, 400));
      };

      const flyCards = () => {
        const center = packCenter();
        let landed = 0;
        ids.forEach((cardId, i) => {
          const tile = getTileByCardId(cardId);
          if (!tile) {
            landed++;
            if (landed === ids.length) finish();
            return;
          }
          const fly = document.createElement("div");
          fly.className = "flying-card";
          const img = document.createElement("img");
          img.src = getCardImageSrc(cardId) || "";
          img.alt = "";
          img.onerror = () => fly.classList.add("flying-card-placeholder");
          fly.appendChild(img);
          fly.style.left = center.x + "px";
          fly.style.top = center.y + "px";
          document.body.appendChild(fly);
          const flyRect = fly.getBoundingClientRect();
          const targetRect = tile.getBoundingClientRect();
          const startX = center.x - flyRect.width / 2;
          const startY = center.y - flyRect.height / 2;
          const endX = targetRect.left + (targetRect.width - flyRect.width) / 2;
          const endY = targetRect.top + (targetRect.height - flyRect.height) / 2;
          fly.style.left = startX + "px";
          fly.style.top = startY + "px";
          fly.style.transform = "scale(0.5)";
          requestAnimationFrame(() => {
            fly.classList.add("flying-card-fly");
            fly.style.setProperty("--fly-end-x", (endX - startX) + "px");
            fly.style.setProperty("--fly-end-y", (endY - startY) + "px");
          });
          const t = 600 + i * 120;
          self._timeouts.push(setTimeout(() => {
            fly.remove();
            tile.classList.add("pack-land-pulse");
            const glow = document.createElement("div");
            glow.className = "pack-land-glow";
            tile.appendChild(glow);
            setTimeout(() => glow.remove(), 600);
            setTimeout(() => tile.classList.remove("pack-land-pulse"), 400);
            landed++;
            if (landed === ids.length) finish();
          }, t));
        });
        if (ids.length === 0) finish();
      };

      this._timeouts.push(setTimeout(() => flyCards(), 1400));
    }
  }

  function buildShapeLevels() {
    const schedule = [
      "triangle", "square", "pentagon", "hexagon", "star", "circle", "heart",
      "triangle", "square", "pentagon", "hexagon", "star", "circle", "heart",
      "triangle", "square", "pentagon", "hexagon", "star", "circle", "heart",
      "triangle", "square", "pentagon", "hexagon", "star", "circle", "heart",
      "triangle", "square",
    ];
    const levels = [];
    for (let i = 0; i < 30; i++) {
      const pieceCount = i % 2 === 0 ? 10 : 12;
      const cols = pieceCount === 10 ? 2 : 3;
      const rows = pieceCount === 10 ? 5 : 4;
      const shapeType = schedule[i];
      const shapeSeed = i + 1;
      const rotation = (i % 7 >= 4) ? 90 : 0;
      levels.push({
        id: i,
        pieceCount,
        cols,
        rows,
        shapeType,
        shapeSeed,
        rotation,
      });
    }
    return levels;
  }

  const BONUS_LEVEL_DEF = {
    id: "bonus_album_complete",
    pieceCount: 12,
    cols: 3,
    rows: 4,
    shapeType: "star",
    shapeSeed: 99,
    rotation: 0,
  };

  class LevelManager {
    constructor() {
      this.levelEntries = [];
      EXTERNAL_PLAYABLE_LEVELS.forEach((entry) => {
        this.levelEntries.push({
          id: entry.id,
          title: entry.title || entry.id,
          type: "html-playable",
          src: entry.src,
        });
      });
      buildShapeLevels().forEach((level, idx) => {
        this.levelEntries.push({
          id: "native_level_" + (idx + 1),
          title: "Native Level " + (idx + 1),
          type: "native-shape",
          level,
        });
      });
    }

    getLevelEntry(index) {
      return this.levelEntries[index] || null;
    }

    getLevel(index) {
      const entry = this.getLevelEntry(index);
      return entry && entry.type === "native-shape" ? entry.level : null;
    }

    getBonusLevel() {
      return BONUS_LEVEL_DEF;
    }

    getTotalLevels() {
      return this.levelEntries.length;
    }
  }

  class PuzzleBoard {
    constructor(containerEl, onComplete) {
      this.container = containerEl;
      this.onComplete = onComplete;
      this.slots = [];
      this.placedCount = 0;
      this.totalPieces = 0;
      this.gridEl = null;
    }

    build(level) {
      this.container.innerHTML = "";
      this.placedCount = 0;
      this.totalPieces = level.pieceCount;
      const { cols, rows } = level;
      const pieceUrls = generateShapePieces(level);

      const slotSize = Math.min(90, Math.floor(280 / Math.max(cols, rows)));
      const ghostUrl = getShapeGhostDataUrl(level);
      const ghostEl = document.createElement("div");
      ghostEl.className = "board-shape-ghost";
      ghostEl.setAttribute("aria-hidden", "true");
      ghostEl.style.backgroundImage = "url(" + ghostUrl + ")";
      ghostEl.style.width = cols * slotSize + "px";
      ghostEl.style.height = rows * slotSize + "px";
      this.container.appendChild(ghostEl);

      this.gridEl = document.createElement("div");
      this.gridEl.className = "board-grid";
      this.gridEl.style.display = "grid";
      this.gridEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      this.gridEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
      this.gridEl.style.width = cols * slotSize + "px";
      this.gridEl.style.height = rows * slotSize + "px";

      this.slots = [];
      for (let i = 0; i < level.pieceCount; i++) {
        const slot = document.createElement("div");
        slot.className = "slot";
        slot.dataset.pieceId = String(i);
        slot.dataset.slotIndex = String(i);
        this.slots.push({
          el: slot,
          pieceId: i,
          filled: false,
          pieceUrl: pieceUrls[i],
        });
        this.gridEl.appendChild(slot);
      }
      this.container.appendChild(this.gridEl);
      return pieceUrls;
    }

    getSlotAtPoint(clientX, clientY) {
      for (const s of this.slots) {
        if (s.filled) continue;
        const rect = s.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(clientX - cx, clientY - cy);
        if (dist <= SNAP_THRESHOLD) return s;
      }
      return null;
    }

    getSlotByPieceId(pieceId) {
      return this.slots.find((s) => s.pieceId === Number(pieceId));
    }

    placePiece(pieceId, pieceUrl, isCorrectSlot) {
      const slot = this.getSlotByPieceId(pieceId);
      if (!slot || slot.filled) return false;
      if (!isCorrectSlot) return false;

      slot.filled = true;
      const div = document.createElement("div");
      div.className = "piece-in-slot just-placed";
      div.style.backgroundImage = `url(${pieceUrl})`;
      div.dataset.pieceId = String(pieceId);
      slot.el.classList.add("filled");
      slot.el.appendChild(div);

      slot.el.style.position = "relative";
      for (let i = 0; i < 6; i++) {
        const sp = document.createElement("div");
        sp.className = "sparkle";
        const w = slot.el.offsetWidth || 60;
        const h = slot.el.offsetHeight || 60;
        sp.style.left = w / 2 + (Math.random() - 0.5) * w * 0.8 + "px";
        sp.style.top = h / 2 + (Math.random() - 0.5) * h * 0.8 + "px";
        slot.el.appendChild(sp);
        setTimeout(() => sp.remove(), 600);
      }

      setTimeout(() => div.classList.remove("just-placed"), 500);
      this.placedCount++;
      if (this.placedCount === this.totalPieces) this.onComplete();
      return true;
    }

    getPlacedCount() {
      return this.placedCount;
    }

    getTotalPieces() {
      return this.totalPieces;
    }
  }

  class PieceTray {
    constructor(containerEl, board, opts = {}) {
      this.container = containerEl;
      this.board = board;
      this.onPlace = opts.onPlace || (() => {});
      this.onWrongDrop = opts.onWrongDrop || (() => {});
      this.beforePlace = opts.beforePlace || null;
      this.pieces = [];
      this.dragging = null;
      this.pointerId = null;
      this.offsetX = 0;
      this.offsetY = 0;
    }

    build(pieceUrls, pieceSize = 64) {
      this.container.innerHTML = "";
      this.pieces = pieceUrls.map((url, i) => {
        const el = document.createElement("div");
        el.className = "tray-piece";
        el.dataset.pieceId = String(i);
        el.style.width = pieceSize + "px";
        el.style.height = pieceSize + "px";
        el.style.backgroundImage = `url(${url})`;
        el.style.backgroundSize = "cover";
        el.style.backgroundPosition = "center";
        this.container.appendChild(el);
        return { el, pieceId: i, url, placed: false };
      });
      this._bindPointerEvents();
    }

    _bindPointerEvents() {
      this.container.addEventListener("pointerdown", (e) => {
        const pieceEl = e.target.closest(".tray-piece");
        if (!pieceEl || e.button !== 0) return;
        const piece = this.pieces[Number(pieceEl.dataset.pieceId)];
        if (!piece || piece.placed) return;
        e.preventDefault();
        this._startDrag(piece, e);
      });

      document.addEventListener("pointermove", (e) => {
        if (this.dragging && e.pointerId === this.pointerId) this._moveDrag(e);
      });

      document.addEventListener("pointerup", (e) => {
        if (this.dragging && e.pointerId === this.pointerId) this._endDrag(e);
      });
      document.addEventListener("pointercancel", (e) => {
        if (this.dragging && e.pointerId === this.pointerId) this._cancelDrag();
      });
    }

    _startDrag(piece, e) {
      this.dragging = piece;
      this.pointerId = e.pointerId;
      const rect = piece.el.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;
      piece.el.classList.add("dragging");
      piece.el.setPointerCapture?.(e.pointerId);
    }

    _moveDrag(e) {
      if (!this.dragging) return;
      const el = this.dragging.el;
      el.style.position = "fixed";
      el.style.left = e.clientX - this.offsetX + "px";
      el.style.top = e.clientY - this.offsetY + "px";
      el.style.zIndex = "1000";
    }

    _endDrag(e) {
      if (!this.dragging) return;
      const piece = this.dragging;
      const slot = this.board.getSlotAtPoint(e.clientX, e.clientY);

      piece.el.classList.remove("dragging");
      piece.el.style.position = "";
      piece.el.style.left = "";
      piece.el.style.top = "";
      piece.el.style.zIndex = "";
      piece.el.releasePointerCapture?.(e.pointerId);

      if (slot && slot.pieceId === piece.pieceId) {
        if (this.beforePlace && !this.beforePlace()) {
          this.dragging = null;
          this.pointerId = null;
          return;
        }
        const placed = this.board.placePiece(piece.pieceId, piece.url, true);
        if (placed) {
          piece.placed = true;
          piece.el.style.visibility = "hidden";
          piece.el.style.pointerEvents = "none";
          this.onPlace(piece.pieceId);
        }
      } else {
        this.onWrongDrop(piece.pieceId);
        piece.el.classList.add("wrong-drop");
        setTimeout(() => piece.el.classList.remove("wrong-drop"), 500);
      }
      this.dragging = null;
      this.pointerId = null;
    }

    _cancelDrag() {
      if (this.dragging) {
        this.dragging.el.classList.remove("dragging");
        this.dragging.el.style.position = "";
        this.dragging.el.style.left = "";
        this.dragging.el.style.top = "";
        this.dragging.el.style.zIndex = "";
        this.dragging = null;
        this.pointerId = null;
      }
    }

    cancelDrag() {
      this._cancelDrag();
    }
  }

  class UI {
    constructor() {
      this.levelNumberEl = document.getElementById("level-number");
      this.coinsCountEl = document.getElementById("coins-count");
      this.progressTextEl = document.getElementById("progress-text");
      this.winModal = document.getElementById("win-modal");
      this.winStars = document.getElementById("win-stars");
      this.winStats = document.getElementById("win-stats");
      this.settingsModal = document.getElementById("settings-modal");
    }

    showScreen(id) {
      document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
      const el = document.getElementById(id);
      if (el) el.classList.add("active");
      document.body.classList.toggle("cards-screen-clean", id === "album-screen");
      document.body.classList.toggle("daily-tasks-clean", id === "daily-tasks-screen");
      const externalLevelActive = !!(window.gameApp && window.gameApp._externalLevelActive);
      const galleryActive = id === "gallery-screen";
      document.body.classList.toggle("home-layout-active", id === "start-screen" || galleryActive || (id === "game-screen" && externalLevelActive));
      if (id === "start-screen") {
        document.body.classList.remove("daily-tasks-clean");
        document.body.classList.remove("cards-screen-clean");
      }
      document.body.classList.toggle("level-active", id === "game-screen");
      document.body.classList.toggle("gallery-screen-active", galleryActive);
      document.body.classList.toggle("shop-screen-active", id === "shop-screen");
      const stripStart = document.getElementById("status-strip-start");
      const stripGame = document.getElementById("status-strip-game");
      if (stripStart) stripStart.classList.add("hidden");
      if (stripGame) stripGame.classList.add("hidden");
      if ((id === "start-screen" || id === "gallery-screen") && stripStart) stripStart.classList.remove("hidden");
      if (id === "game-screen" && externalLevelActive && stripStart) stripStart.classList.remove("hidden");
      if (id === "game-screen" && !externalLevelActive && stripGame) stripGame.classList.remove("hidden");
      document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
      const navMap = { "start-screen": "nav-home", "gallery-screen": "nav-game", "album-screen": "nav-collection", "shop-screen": "nav-shop" };
      const navId = navMap[id];
      if (navId) {
        const navEl = document.getElementById(navId);
        if (navEl) navEl.classList.add("active");
      }
      if (window.gameApp && typeof window.gameApp._updateCheatAutoButton === "function") {
        window.gameApp._updateCheatAutoButton();
      }
      if (id !== "game-screen" && window.gameApp && typeof window.gameApp._clearBattlePassTutorial === "function") {
        window.gameApp._clearBattlePassTutorial();
      }
      if (id !== "daily-tasks-screen" && window.gameApp && typeof window.gameApp.closeDailyTasksScreen === "function") {
        window.gameApp.closeDailyTasksScreen();
      }
      if (window.gameApp && typeof window.gameApp.updateBattlePassWidget === "function") {
        window.gameApp.updateBattlePassWidget();
      }
      if (id === "start-screen" && window.gameApp && window.gameApp.collectionUI && typeof window.gameApp.collectionUI.updateGlobalCardsProgress === "function") {
        window.gameApp.collectionUI.updateGlobalCardsProgress();
      }
    }

    setLevelNumber(n) {
      if (this.levelNumberEl) this.levelNumberEl.textContent = n + 1;
      const homeLevel = document.getElementById("level-number-home");
      if (homeLevel) homeLevel.textContent = n + 1;
    }

    setLevelLabel(text) {
      if (this.levelNumberEl) this.levelNumberEl.textContent = text;
      const homeLevel = document.getElementById("level-number-home");
      if (homeLevel) homeLevel.textContent = text;
    }

    setCoins(n) {
      const v = String(n == null ? 0 : n);
      if (this.coinsCountEl) this.coinsCountEl.textContent = v;
      const startEl = document.getElementById("coins-count-start");
      if (startEl) startEl.textContent = v;
    }

    setProgress(placed, total) {
      if (this.progressTextEl) this.progressTextEl.textContent = `Pieces placed ${placed} / ${total}`;
    }

    showWinModal(stars, timeSec, mistakes, onNext, onReplay, packTier) {
      this.winModal.classList.remove("hidden");
      this.winStars.querySelectorAll(".star").forEach((s, i) => {
        s.classList.toggle("earned", i < stars);
      });
      this.winStats.textContent = `Time: ${timeSec}s • Mistakes: ${mistakes}`;
      // Sticker-pack reward (Grade 2 or 3) earned for completing the level.
      const rewardEl = document.getElementById("win-pack-reward");
      if (rewardEl) {
        if (packTier) {
          const meta = getStickerPackTier(packTier);
          const amount = meta.min === meta.max ? String(meta.min) : (meta.min + "–" + meta.max);
          rewardEl.className = "win-pack-reward sticker-pack-tier--" + packTier;
          rewardEl.innerHTML =
            '<span class="win-pack-reward-head">🎁 You earned a reward!</span>' +
            '<span class="win-pack-art" aria-hidden="true">' +
              '<span class="win-pack-band"></span>' +
              '<span class="win-pack-star">' + meta.star + '</span>' +
            '</span>' +
            '<span class="win-pack-name">' + stickerPackRewardLabel(packTier) + '</span>' +
            '<span class="win-pack-amount">' + amount + ' stickers · open it in the Stickers tab</span>';
        } else {
          rewardEl.className = "win-pack-reward hidden";
          rewardEl.innerHTML = "";
        }
      }
      document.getElementById("btn-next-level").onclick = onNext;
      document.getElementById("btn-replay").onclick = onReplay;
    }

    hideWinModal() {
      this.winModal.classList.add("hidden");
    }

    showSettingsModal() {
      this.settingsModal.classList.remove("hidden");
    }

    hideSettingsModal() {
      this.settingsModal.classList.add("hidden");
    }
  }

  const AudioPlayer = {
    ctx: null,
    init() {
      if (this.ctx) return;
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    },
    beep(freq, duration, type) {
      if (!this.ctx) this.init();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.frequency.value = freq;
      osc.type = type || "sine";
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + duration);
    },
    place() {
      this.beep(523, 0.1, "sine");
      setTimeout(() => this.beep(659, 0.1, "sine"), 80);
    },
    wrong() {
      this.beep(200, 0.15, "sawtooth");
      setTimeout(() => this.beep(180, 0.15, "sawtooth"), 100);
    },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => this.beep(f, 0.12, "sine"), i * 80);
      });
    },
  };

  /* ===================================================================
     Moon Observatory Event Manager
     =================================================================== */
  // Themed isometric room shells for the Moon Observatory Event — one per
  // level so every level looks like a different room. Empty shells (walls +
  // floor + theme accents only); the themed stickers are placed by the player
  // into HIDDEN targets (no silhouettes drawn).
  const RC_ROOM_SHELLS = {
    observatory: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#1a1440"/><polygon points="160,190 290,245 290,159 160,104" fill="#332a63" /><polygon points="160,190 30,245 30,159 160,104" fill="#2b2356" /><circle cx="199.0" cy="154.9" r="1.6" fill="#ffffff" opacity="0.8"/><circle cx="121.0" cy="154.9" r="1.4" fill="#ffffff" opacity="0.7"/><circle cx="238.0" cy="188.6" r="1.6" fill="#ffffff" opacity="0.8"/><circle cx="82.0" cy="188.6" r="1.4" fill="#ffffff" opacity="0.7"/><circle cx="218.5" cy="150.25" r="1.6" fill="#ffffff" opacity="0.8"/><circle cx="101.5" cy="150.25" r="1.4" fill="#ffffff" opacity="0.7"/><circle cx="251.0" cy="172.6" r="1.6" fill="#ffffff" opacity="0.8"/><circle cx="69.0" cy="172.6" r="1.4" fill="#ffffff" opacity="0.7"/><circle cx="192.5" cy="169.35" r="1.6" fill="#ffffff" opacity="0.8"/><circle cx="127.5" cy="169.35" r="1.4" fill="#ffffff" opacity="0.7"/><circle cx="231.5" cy="166.93" r="13" fill="#cdbcf0" /><polygon points="160,104 290,159 290,154 160,99" fill="#8a6bff" /><polygon points="160,104 30,159 30,154 160,99" fill="#8a6bff" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#352b66" /><line x1="192.5" y1="203.75" x2="62.5" y2="258.75" stroke="#6a55b0" stroke-width="1" stroke-opacity="0.4"/><line x1="127.5" y1="203.75" x2="257.5" y2="258.75" stroke="#6a55b0" stroke-width="1" stroke-opacity="0.4"/><line x1="225.0" y1="217.5" x2="95.0" y2="272.5" stroke="#6a55b0" stroke-width="1" stroke-opacity="0.4"/><line x1="95.0" y1="217.5" x2="225.0" y2="272.5" stroke="#6a55b0" stroke-width="1" stroke-opacity="0.4"/><line x1="257.5" y1="231.25" x2="127.5" y2="286.25" stroke="#6a55b0" stroke-width="1" stroke-opacity="0.4"/><line x1="62.5" y1="231.25" x2="192.5" y2="286.25" stroke="#6a55b0" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#8a6bff" stroke-width="1" stroke-opacity="0.35"/></svg>`,
    cafe: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#f7efdf"/><polygon points="160,190 290,245 290,159 160,104" fill="#f4e6c8" /><polygon points="160,190 30,245 30,159 160,104" fill="#efdcb8" /><polygon points="199.0,167.8 240.6,157.01999999999998 240.6,179.01999999999998 199.0,189.8" fill="#bfe3f2" stroke="#fff" stroke-width="2"/><polygon points="160,104 290,159 290,154 160,99" fill="#d99a5c" /><polygon points="160,104 30,159 30,154 160,99" fill="#d99a5c" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#f0c98f" /><line x1="186.0" y1="201.0" x2="56.0" y2="256.0" stroke="#dca868" stroke-width="1" stroke-opacity="0.4"/><line x1="212.0" y1="212.0" x2="82.0" y2="267.0" stroke="#dca868" stroke-width="1" stroke-opacity="0.4"/><line x1="238.0" y1="223.0" x2="108.0" y2="278.0" stroke="#dca868" stroke-width="1" stroke-opacity="0.4"/><line x1="264.0" y1="234.0" x2="134.0" y2="289.0" stroke="#dca868" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#d99a5c" stroke-width="1" stroke-opacity="0.35"/></svg>`,
    hotel: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#f2ece0"/><polygon points="160,190 290,245 290,159 160,104" fill="#e3d2bb" /><polygon points="160,190 30,245 30,159 160,104" fill="#d9c7b0" /><line x1="186.0" y1="201.0" x2="186.0" y2="132.2" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.5"/><line x1="134.0" y1="201.0" x2="134.0" y2="132.2" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.5"/><line x1="212.0" y1="212.0" x2="212.0" y2="143.2" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.5"/><line x1="108.0" y1="212.0" x2="108.0" y2="143.2" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.5"/><line x1="238.0" y1="223.0" x2="238.0" y2="154.2" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.5"/><line x1="82.0" y1="223.0" x2="82.0" y2="154.2" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.5"/><line x1="264.0" y1="234.0" x2="264.0" y2="165.2" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.5"/><line x1="56.0" y1="234.0" x2="56.0" y2="165.2" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.5"/><ellipse cx="160" cy="120" rx="10" ry="5" fill="#ffe9a8" opacity="0.8"/><polygon points="160,104 290,159 290,154 160,99" fill="#c8a24a" /><polygon points="160,104 30,159 30,154 160,99" fill="#c8a24a" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#cdbcd6" /><line x1="203.33333333333331" y1="208.33333333333334" x2="73.33333333333331" y2="263.33333333333337" stroke="#b59fc0" stroke-width="1" stroke-opacity="0.4"/><line x1="116.66666666666667" y1="208.33333333333334" x2="246.66666666666669" y2="263.3333333333333" stroke="#b59fc0" stroke-width="1" stroke-opacity="0.4"/><line x1="246.66666666666666" y1="226.66666666666666" x2="116.66666666666666" y2="281.66666666666663" stroke="#b59fc0" stroke-width="1" stroke-opacity="0.4"/><line x1="73.33333333333334" y1="226.66666666666666" x2="203.33333333333334" y2="281.6666666666667" stroke="#b59fc0" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#c8a24a" stroke-width="1" stroke-opacity="0.35"/></svg>`,
    garage: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#e8eaed"/><polygon points="160,190 290,245 290,159 160,104" fill="#c2c7cd" /><polygon points="160,190 30,245 30,159 160,104" fill="#b3b8be" /><line x1="181.66666666666666" y1="199.16666666666666" x2="181.66666666666666" y2="126.06666666666666" stroke="#8b9097" stroke-width="2" stroke-opacity="0.6"/><line x1="203.33333333333331" y1="208.33333333333334" x2="203.33333333333331" y2="135.23333333333335" stroke="#8b9097" stroke-width="2" stroke-opacity="0.6"/><line x1="225.0" y1="217.5" x2="225.0" y2="144.4" stroke="#8b9097" stroke-width="2" stroke-opacity="0.6"/><line x1="246.66666666666666" y1="226.66666666666666" x2="246.66666666666666" y2="153.56666666666666" stroke="#8b9097" stroke-width="2" stroke-opacity="0.6"/><line x1="268.33333333333337" y1="235.83333333333334" x2="268.33333333333337" y2="162.73333333333335" stroke="#8b9097" stroke-width="2" stroke-opacity="0.6"/><circle cx="127.5" cy="182.25" r="1.4" fill="#7d828c"/><circle cx="127.5" cy="160.75" r="1.4" fill="#7d828c"/><circle cx="127.5" cy="139.25" r="1.4" fill="#7d828c"/><circle cx="95.0" cy="196.0" r="1.4" fill="#7d828c"/><circle cx="95.0" cy="174.5" r="1.4" fill="#7d828c"/><circle cx="95.0" cy="153.0" r="1.4" fill="#7d828c"/><circle cx="62.5" cy="209.75" r="1.4" fill="#7d828c"/><circle cx="62.5" cy="188.25" r="1.4" fill="#7d828c"/><circle cx="62.5" cy="166.75" r="1.4" fill="#7d828c"/><polygon points="160,104 290,159 290,154 160,99" fill="#e0533f" /><polygon points="160,104 30,159 30,154 160,99" fill="#e0533f" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#cbced3" /><line x1="192.5" y1="203.75" x2="62.5" y2="258.75" stroke="#a7abb2" stroke-width="1" stroke-opacity="0.4"/><line x1="127.5" y1="203.75" x2="257.5" y2="258.75" stroke="#a7abb2" stroke-width="1" stroke-opacity="0.4"/><line x1="225.0" y1="217.5" x2="95.0" y2="272.5" stroke="#a7abb2" stroke-width="1" stroke-opacity="0.4"/><line x1="95.0" y1="217.5" x2="225.0" y2="272.5" stroke="#a7abb2" stroke-width="1" stroke-opacity="0.4"/><line x1="257.5" y1="231.25" x2="127.5" y2="286.25" stroke="#a7abb2" stroke-width="1" stroke-opacity="0.4"/><line x1="62.5" y1="231.25" x2="192.5" y2="286.25" stroke="#a7abb2" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#e0533f" stroke-width="1" stroke-opacity="0.35"/></svg>`,
    library: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#efe2cf"/><polygon points="160,190 290,245 290,159 160,104" fill="#c79a66" /><polygon points="160,190 30,245 30,159 160,104" fill="#b88a5a" /><line x1="144.4" y1="175.1" x2="49.5" y2="215.25" stroke="#7a5230" stroke-width="1.5" stroke-opacity="1"/><polygon points="139.2,175.58 145.2,177.98000000000002 145.2,166.58 139.2,164.58" fill="#c97a6a" /><polygon points="124.9,181.63 130.9,184.03 130.9,172.63 124.9,170.63" fill="#7a9ec9" /><polygon points="110.6,187.68 116.6,190.08 116.6,178.68 110.6,176.68" fill="#caa86a" /><polygon points="96.30000000000001,193.73 102.30000000000001,196.13 102.30000000000001,184.73 96.30000000000001,182.73" fill="#7ac98f" /><polygon points="82.0,199.78 88.0,202.18 88.0,190.78 82.0,188.78" fill="#b07ac9" /><polygon points="67.69999999999999,205.83 73.69999999999999,208.23000000000002 73.69999999999999,196.83 67.69999999999999,194.83" fill="#c97a6a" /><line x1="144.4" y1="156.18" x2="49.5" y2="196.33" stroke="#7a5230" stroke-width="1.5" stroke-opacity="1"/><polygon points="139.2,156.66000000000003 145.2,159.06000000000003 145.2,147.66000000000003 139.2,145.66000000000003" fill="#c97a6a" /><polygon points="124.9,162.70999999999998 130.9,165.10999999999999 130.9,153.70999999999998 124.9,151.70999999999998" fill="#7a9ec9" /><polygon points="110.6,168.76 116.6,171.16 116.6,159.76 110.6,157.76" fill="#caa86a" /><polygon points="96.30000000000001,174.81 102.30000000000001,177.21 102.30000000000001,165.81 96.30000000000001,163.81" fill="#7ac98f" /><polygon points="82.0,180.86 88.0,183.26000000000002 88.0,171.86 82.0,169.86" fill="#b07ac9" /><polygon points="67.69999999999999,186.91000000000003 73.69999999999999,189.31000000000003 73.69999999999999,177.91000000000003 67.69999999999999,175.91000000000003" fill="#c97a6a" /><line x1="144.4" y1="137.26" x2="49.5" y2="177.41" stroke="#7a5230" stroke-width="1.5" stroke-opacity="1"/><polygon points="139.2,137.74 145.2,140.14000000000001 145.2,128.74 139.2,126.74000000000001" fill="#c97a6a" /><polygon points="124.9,143.79 130.9,146.19 130.9,134.79 124.9,132.79" fill="#7a9ec9" /><polygon points="110.6,149.84 116.6,152.24 116.6,140.84 110.6,138.84" fill="#caa86a" /><polygon points="96.30000000000001,155.89 102.30000000000001,158.29 102.30000000000001,146.89 96.30000000000001,144.89" fill="#7ac98f" /><polygon points="82.0,161.94 88.0,164.34 88.0,152.94 82.0,150.94" fill="#b07ac9" /><polygon points="67.69999999999999,167.99 73.69999999999999,170.39000000000001 73.69999999999999,158.99 67.69999999999999,156.99" fill="#c97a6a" /><polygon points="160,104 290,159 290,154 160,99" fill="#8a5a2a" /><polygon points="160,104 30,159 30,154 160,99" fill="#8a5a2a" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#caa06a" /><line x1="186.0" y1="201.0" x2="56.0" y2="256.0" stroke="#a87f4e" stroke-width="1" stroke-opacity="0.4"/><line x1="212.0" y1="212.0" x2="82.0" y2="267.0" stroke="#a87f4e" stroke-width="1" stroke-opacity="0.4"/><line x1="238.0" y1="223.0" x2="108.0" y2="278.0" stroke="#a87f4e" stroke-width="1" stroke-opacity="0.4"/><line x1="264.0" y1="234.0" x2="134.0" y2="289.0" stroke="#a87f4e" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#8a5a2a" stroke-width="1" stroke-opacity="0.35"/></svg>`,
    greenhouse: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#e6f2ec"/><polygon points="160,190 290,245 290,159 160,104" fill="#d9ece5" /><polygon points="160,190 30,245 30,159 160,104" fill="#cfe6df" /><line x1="186.0" y1="201.0" x2="186.0" y2="127.9" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="134.0" y1="201.0" x2="134.0" y2="127.9" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="212.0" y1="212.0" x2="212.0" y2="138.9" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="108.0" y1="212.0" x2="108.0" y2="138.9" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="238.0" y1="223.0" x2="238.0" y2="149.9" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="82.0" y1="223.0" x2="82.0" y2="149.9" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="264.0" y1="234.0" x2="264.0" y2="160.9" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="56.0" y1="234.0" x2="56.0" y2="160.9" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="160" y1="155.6" x2="290" y2="210.6" stroke="#ffffff" stroke-width="1" stroke-opacity="0.4"/><line x1="160" y1="155.6" x2="30" y2="210.6" stroke="#ffffff" stroke-width="1" stroke-opacity="0.4"/><line x1="160" y1="129.8" x2="290" y2="184.8" stroke="#ffffff" stroke-width="1" stroke-opacity="0.4"/><line x1="160" y1="129.8" x2="30" y2="184.8" stroke="#ffffff" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,104 290,159 290,154 160,99" fill="#6fae54" /><polygon points="160,104 30,159 30,154 160,99" fill="#6fae54" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#c2d3a8" /><line x1="192.5" y1="203.75" x2="62.5" y2="258.75" stroke="#a8bf8a" stroke-width="1" stroke-opacity="0.4"/><line x1="127.5" y1="203.75" x2="257.5" y2="258.75" stroke="#a8bf8a" stroke-width="1" stroke-opacity="0.4"/><line x1="225.0" y1="217.5" x2="95.0" y2="272.5" stroke="#a8bf8a" stroke-width="1" stroke-opacity="0.4"/><line x1="95.0" y1="217.5" x2="225.0" y2="272.5" stroke="#a8bf8a" stroke-width="1" stroke-opacity="0.4"/><line x1="257.5" y1="231.25" x2="127.5" y2="286.25" stroke="#a8bf8a" stroke-width="1" stroke-opacity="0.4"/><line x1="62.5" y1="231.25" x2="192.5" y2="286.25" stroke="#a8bf8a" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#6fae54" stroke-width="1" stroke-opacity="0.35"/></svg>`,
    kitchen: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#fbeef4"/><polygon points="160,190 290,245 290,159 160,104" fill="#f8ecf2" /><polygon points="160,190 30,245 30,159 160,104" fill="#f4e0ea" /><rect x="157.0" y="183.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="157.0" y="161.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="157.0" y="140.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="157.0" y="118.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="183.0" y="194.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="183.0" y="172.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="183.0" y="151.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="183.0" y="129.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="209.0" y="205.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="209.0" y="183.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="209.0" y="162.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="209.0" y="140.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="235.0" y="216.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="235.0" y="194.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="235.0" y="173.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="235.0" y="151.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="261.0" y="227.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="261.0" y="205.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="261.0" y="184.0" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><rect x="261.0" y="162.5" width="7" height="8" fill="none" stroke="#e3c0cf" stroke-width="0.8"/><polygon points="160,104 290,159 290,154 160,99" fill="#e3a0ba" /><polygon points="160,104 30,159 30,154 160,99" fill="#e3a0ba" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#f3d7e1" /><polygon points="160.0,190.0 192.5,203.75 160.0,217.5 127.5,203.75" fill="#e1bfd0" opacity="0.5"/><polygon points="95.0,217.5 127.5,231.25 95.0,245.0 62.5,231.25" fill="#e1bfd0" opacity="0.5"/><polygon points="160.0,217.5 192.5,231.25 160.0,245.0 127.5,231.25" fill="#e1bfd0" opacity="0.5"/><polygon points="95.0,245.0 127.5,258.75 95.0,272.5 62.5,258.75" fill="#e1bfd0" opacity="0.5"/><polygon points="225.0,217.5 257.5,231.25 225.0,245.0 192.5,231.25" fill="#e1bfd0" opacity="0.5"/><polygon points="160.0,245.0 192.5,258.75 160.0,272.5 127.5,258.75" fill="#e1bfd0" opacity="0.5"/><polygon points="225.0,245.0 257.5,258.75 225.0,272.5 192.5,258.75" fill="#e1bfd0" opacity="0.5"/><polygon points="160.0,272.5 192.5,286.25 160.0,300.0 127.5,286.25" fill="#e1bfd0" opacity="0.5"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#e3a0ba" stroke-width="1" stroke-opacity="0.35"/></svg>`,
    artstudio: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#fdf4e8"/><polygon points="160,190 290,245 290,159 160,104" fill="#fdf2e6" /><polygon points="160,190 30,245 30,159 160,104" fill="#f7ead8" /><ellipse cx="199.0" cy="154.9" rx="6" ry="4" fill="#ff7aa0" opacity="0.7"/><ellipse cx="121.0" cy="154.9" rx="5" ry="3.5" fill="#ffd16b" opacity="0.7"/><ellipse cx="238.0" cy="184.3" rx="6" ry="4" fill="#7ac9e0" opacity="0.7"/><ellipse cx="82.0" cy="184.3" rx="5" ry="3.5" fill="#8fd17a" opacity="0.7"/><ellipse cx="218.5" cy="150.25" rx="6" ry="4" fill="#ffd16b" opacity="0.7"/><ellipse cx="101.5" cy="150.25" rx="5" ry="3.5" fill="#b07ae0" opacity="0.7"/><ellipse cx="251.0" cy="176.9" rx="6" ry="4" fill="#8fd17a" opacity="0.7"/><ellipse cx="69.0" cy="176.9" rx="5" ry="3.5" fill="#ff7aa0" opacity="0.7"/><ellipse cx="192.5" cy="165.05" rx="6" ry="4" fill="#b07ae0" opacity="0.7"/><ellipse cx="127.5" cy="165.05" rx="5" ry="3.5" fill="#7ac9e0" opacity="0.7"/><polygon points="160,104 290,159 290,154 160,99" fill="#ff7aa0" /><polygon points="160,104 30,159 30,154 160,99" fill="#ff7aa0" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#efe7d0" /><line x1="186.0" y1="201.0" x2="56.0" y2="256.0" stroke="#dcc9aa" stroke-width="1" stroke-opacity="0.4"/><line x1="212.0" y1="212.0" x2="82.0" y2="267.0" stroke="#dcc9aa" stroke-width="1" stroke-opacity="0.4"/><line x1="238.0" y1="223.0" x2="108.0" y2="278.0" stroke="#dcc9aa" stroke-width="1" stroke-opacity="0.4"/><line x1="264.0" y1="234.0" x2="134.0" y2="289.0" stroke="#dcc9aa" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#ff7aa0" stroke-width="1" stroke-opacity="0.35"/></svg>`,
    rooftop: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#161033"/><polygon points="160,190 290,245 160,300 30,245" fill="#3a3056" /><line x1="186.0" y1="201.0" x2="56.0" y2="256.0" stroke="#2c2348" stroke-width="1" stroke-opacity="0.4"/><line x1="212.0" y1="212.0" x2="82.0" y2="267.0" stroke="#2c2348" stroke-width="1" stroke-opacity="0.4"/><line x1="238.0" y1="223.0" x2="108.0" y2="278.0" stroke="#2c2348" stroke-width="1" stroke-opacity="0.4"/><line x1="264.0" y1="234.0" x2="134.0" y2="289.0" stroke="#2c2348" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#6a5e8a" stroke-width="1" stroke-opacity="0.35"/><line x1="160.0" y1="190.0" x2="160.0" y2="164.0" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="160.0" y1="190.0" x2="160.0" y2="164.0" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="181.66666666666666" y1="199.16666666666666" x2="181.66666666666666" y2="173.16666666666666" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="138.33333333333334" y1="199.16666666666666" x2="138.33333333333334" y2="173.16666666666666" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="203.33333333333331" y1="208.33333333333334" x2="203.33333333333331" y2="182.33333333333334" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="116.66666666666667" y1="208.33333333333334" x2="116.66666666666667" y2="182.33333333333334" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="225.0" y1="217.5" x2="225.0" y2="191.5" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="95.0" y1="217.5" x2="95.0" y2="191.5" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="246.66666666666666" y1="226.66666666666666" x2="246.66666666666666" y2="200.66666666666666" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="73.33333333333334" y1="226.66666666666666" x2="73.33333333333334" y2="200.66666666666666" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="268.33333333333337" y1="235.83333333333334" x2="268.33333333333337" y2="209.83333333333334" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="51.66666666666666" y1="235.83333333333334" x2="51.66666666666666" y2="209.83333333333334" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="290.0" y1="245.0" x2="290.0" y2="219.0" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="30.0" y1="245.0" x2="30.0" y2="219.0" stroke="#5a4e7a" stroke-width="2" stroke-opacity="0.9"/><line x1="160" y1="164" x2="290" y2="219" stroke="#6a5e8a" stroke-width="2" stroke-opacity="0.9"/><line x1="160" y1="164" x2="30" y2="219" stroke="#6a5e8a" stroke-width="2" stroke-opacity="0.9"/><circle cx="70" cy="60" r="1.6" fill="#fff" opacity="0.8"/><circle cx="120" cy="40" r="1.6" fill="#fff" opacity="0.8"/><circle cx="200" cy="55" r="1.6" fill="#fff" opacity="0.8"/><circle cx="250" cy="80" r="1.6" fill="#fff" opacity="0.8"/><circle cx="160" cy="30" r="1.6" fill="#fff" opacity="0.8"/><circle cx="100" cy="90" r="1.6" fill="#fff" opacity="0.8"/><circle cx="230" cy="45" r="1.6" fill="#fff" opacity="0.8"/><circle cx="240" cy="60" r="14" fill="#e9e0ff" opacity="0.9"/></svg>`,
    tech: `<svg class="rc-shell-svg" viewBox="0 0 320 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect x="0" y="0" width="320" height="360" fill="#0c1326"/><polygon points="160,190 290,245 290,159 160,104" fill="#2a3450" /><polygon points="160,190 30,245 30,159 160,104" fill="#222b40" /><line x1="166.5" y1="166.95" x2="283.5" y2="216.45" stroke="#00d4ff" stroke-width="1.5" stroke-opacity="0.7"/><line x1="153.5" y1="166.95" x2="36.5" y2="216.45" stroke="#00d4ff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="166.5" y1="149.75" x2="283.5" y2="199.25" stroke="#00d4ff" stroke-width="1.5" stroke-opacity="0.7"/><line x1="153.5" y1="149.75" x2="36.5" y2="199.25" stroke="#00d4ff" stroke-width="1.5" stroke-opacity="0.5"/><line x1="166.5" y1="132.55" x2="283.5" y2="182.05" stroke="#00d4ff" stroke-width="1.5" stroke-opacity="0.7"/><line x1="153.5" y1="132.55" x2="36.5" y2="182.05" stroke="#00d4ff" stroke-width="1.5" stroke-opacity="0.5"/><polygon points="192.5,177.95 257.5,162.45 257.5,180.45 192.5,195.95" fill="#0a3a5c" stroke="#00d4ff" stroke-width="1.5"/><polygon points="160,104 290,159 290,154 160,99" fill="#00d4ff" /><polygon points="160,104 30,159 30,154 160,99" fill="#00d4ff" /><line x1="160" y1="104" x2="160" y2="190" stroke="#0000001a" stroke-width="1.5" stroke-opacity="1"/><polygon points="160,190 290,245 160,300 30,245" fill="#1b2438" /><line x1="186.0" y1="201.0" x2="56.0" y2="256.0" stroke="#1e6a8c" stroke-width="1" stroke-opacity="0.4"/><line x1="134.0" y1="201.0" x2="264.0" y2="256.0" stroke="#1e6a8c" stroke-width="1" stroke-opacity="0.4"/><line x1="212.0" y1="212.0" x2="82.0" y2="267.0" stroke="#1e6a8c" stroke-width="1" stroke-opacity="0.4"/><line x1="108.0" y1="212.0" x2="238.0" y2="267.0" stroke="#1e6a8c" stroke-width="1" stroke-opacity="0.4"/><line x1="238.0" y1="223.0" x2="108.0" y2="278.0" stroke="#1e6a8c" stroke-width="1" stroke-opacity="0.4"/><line x1="82.0" y1="223.0" x2="212.0" y2="278.0" stroke="#1e6a8c" stroke-width="1" stroke-opacity="0.4"/><line x1="264.0" y1="234.0" x2="134.0" y2="289.0" stroke="#1e6a8c" stroke-width="1" stroke-opacity="0.4"/><line x1="56.0" y1="234.0" x2="186.0" y2="289.0" stroke="#1e6a8c" stroke-width="1" stroke-opacity="0.4"/><polygon points="160,190 290,245 160,300 30,245" fill="none" stroke="#00d4ff" stroke-width="1" stroke-opacity="0.35"/></svg>`,
  };

  class RubyCaveManager {
    static EVENT_TOTAL_LEVELS = 10;
    // Each Moon Observatory event level is an isometric sticker room. The player
    // drags observatory-themed stickers from the bottom tray to their correct
    // HIDDEN target position in the room (no silhouette is drawn). x/y are
    // normalized 0..1 inside the room (x = left→right, y = back/top→front/bottom);
    // surface is purely cosmetic (floor | leftWall | rightWall | decor). Sticker
    // ids are unique per level and link a tray tile to its one hidden target.
    static STICKER_LEVELS = [
      { theme: "Dark Observatory", room: "observatory", stickers: [
        { id: "telescope", name: "Telescope", emoji: "🔭", x: 0.5, y: 0.7, surface: "floor" },
        { id: "moon", name: "Moon", emoji: "🌙", x: 0.5, y: 0.3, surface: "decor" },
        { id: "crystal", name: "Crystal", emoji: "🔮", x: 0.3, y: 0.74, surface: "floor" },
        { id: "candle", name: "Candle", emoji: "🕯️", x: 0.7, y: 0.72, surface: "floor" },
      ]},
      { theme: "Cozy Cafe", room: "cafe", stickers: [
        { id: "coffee", name: "Coffee Machine", emoji: "☕", x: 0.46, y: 0.7, surface: "floor" },
        { id: "cake", name: "Cake", emoji: "🍰", x: 0.64, y: 0.72, surface: "floor" },
        { id: "chair", name: "Chair", emoji: "🪑", x: 0.28, y: 0.74, surface: "floor" },
        { id: "teapot", name: "Teapot", emoji: "🫖", x: 0.52, y: 0.8, surface: "floor" },
      ]},
      { theme: "Hotel Lobby", room: "hotel", stickers: [
        { id: "sofa", name: "Sofa", emoji: "🛋️", x: 0.5, y: 0.7, surface: "floor" },
        { id: "plant", name: "Plant", emoji: "🪴", x: 0.24, y: 0.72, surface: "floor" },
        { id: "bell", name: "Bell", emoji: "🛎️", x: 0.66, y: 0.66, surface: "floor" },
        { id: "clock", name: "Clock", emoji: "🕰️", x: 0.62, y: 0.4, surface: "rightWall" },
        { id: "luggage", name: "Luggage", emoji: "🧳", x: 0.38, y: 0.8, surface: "floor" },
      ]},
      { theme: "Garage Workshop", room: "garage", stickers: [
        { id: "toolbox", name: "Toolbox", emoji: "🧰", x: 0.5, y: 0.72, surface: "floor" },
        { id: "tire", name: "Tire", emoji: "🛞", x: 0.26, y: 0.74, surface: "floor" },
        { id: "wrench", name: "Wrench", emoji: "🔧", x: 0.68, y: 0.66, surface: "floor" },
        { id: "bike", name: "Bike", emoji: "🚲", x: 0.5, y: 0.82, surface: "floor" },
        { id: "barrel", name: "Barrel", emoji: "🛢️", x: 0.78, y: 0.7, surface: "floor" },
      ]},
      { theme: "Library Study", room: "library", stickers: [
        { id: "books", name: "Books", emoji: "📚", x: 0.3, y: 0.68, surface: "floor" },
        { id: "armchair", name: "Armchair", emoji: "🛋️", x: 0.62, y: 0.72, surface: "floor" },
        { id: "lamp", name: "Lamp", emoji: "💡", x: 0.8, y: 0.66, surface: "floor" },
        { id: "desk", name: "Desk Chair", emoji: "🪑", x: 0.46, y: 0.8, surface: "floor" },
        { id: "candle", name: "Candle", emoji: "🕯️", x: 0.66, y: 0.62, surface: "floor" },
        { id: "scroll", name: "Scroll", emoji: "📜", x: 0.22, y: 0.62, surface: "floor" },
      ]},
      { theme: "Greenhouse", room: "greenhouse", stickers: [
        { id: "plant", name: "Potted Plant", emoji: "🪴", x: 0.3, y: 0.7, surface: "floor" },
        { id: "flower", name: "Flowers", emoji: "🌻", x: 0.66, y: 0.72, surface: "floor" },
        { id: "bucket", name: "Watering Can", emoji: "🪣", x: 0.5, y: 0.8, surface: "floor" },
        { id: "herbs", name: "Herbs", emoji: "🌿", x: 0.22, y: 0.74, surface: "floor" },
        { id: "seedling", name: "Seedling", emoji: "🌱", x: 0.74, y: 0.66, surface: "floor" },
        { id: "vase", name: "Vase", emoji: "🏺", x: 0.5, y: 0.64, surface: "floor" },
      ]},
      { theme: "Kitchen Bakery", room: "kitchen", stickers: [
        { id: "pan", name: "Stove Pan", emoji: "🍳", x: 0.46, y: 0.7, surface: "floor" },
        { id: "bread", name: "Bread", emoji: "🥖", x: 0.64, y: 0.72, surface: "floor" },
        { id: "cake", name: "Cake", emoji: "🍰", x: 0.28, y: 0.74, surface: "floor" },
        { id: "teapot", name: "Teapot", emoji: "🫖", x: 0.76, y: 0.66, surface: "floor" },
        { id: "pie", name: "Pie", emoji: "🥧", x: 0.52, y: 0.82, surface: "floor" },
        { id: "cupcake", name: "Cupcake", emoji: "🧁", x: 0.4, y: 0.62, surface: "floor" },
      ]},
      { theme: "Art Studio", room: "artstudio", stickers: [
        { id: "palette", name: "Palette", emoji: "🎨", x: 0.46, y: 0.7, surface: "floor" },
        { id: "canvas", name: "Canvas", emoji: "🖼️", x: 0.3, y: 0.64, surface: "floor" },
        { id: "brush", name: "Brush", emoji: "🖌️", x: 0.66, y: 0.74, surface: "floor" },
        { id: "stool", name: "Stool", emoji: "🪑", x: 0.58, y: 0.8, surface: "floor" },
        { id: "vase", name: "Vase", emoji: "🏺", x: 0.8, y: 0.66, surface: "floor" },
        { id: "pencil", name: "Pencil", emoji: "✏️", x: 0.22, y: 0.72, surface: "floor" },
        { id: "bucket", name: "Paint", emoji: "🪣", x: 0.5, y: 0.6, surface: "floor" },
      ]},
      { theme: "Rooftop Terrace", room: "rooftop", stickers: [
        { id: "telescope", name: "Telescope", emoji: "🔭", x: 0.52, y: 0.68, surface: "floor" },
        { id: "lantern", name: "Lantern", emoji: "🪔", x: 0.3, y: 0.72, surface: "floor" },
        { id: "cushion", name: "Cushion", emoji: "🛋️", x: 0.64, y: 0.74, surface: "floor" },
        { id: "plant", name: "Plant", emoji: "🪴", x: 0.22, y: 0.74, surface: "floor" },
        { id: "rug", name: "Moon Rug", emoji: "🟪", x: 0.5, y: 0.82, surface: "floor" },
        { id: "star", name: "Star", emoji: "⭐", x: 0.74, y: 0.66, surface: "floor" },
        { id: "candle", name: "Candle", emoji: "🕯️", x: 0.42, y: 0.62, surface: "floor" },
      ]},
      { theme: "Tech Penthouse", room: "tech", stickers: [
        { id: "sofa", name: "Sofa", emoji: "🛋️", x: 0.5, y: 0.7, surface: "floor" },
        { id: "screen", name: "Screen", emoji: "🖥️", x: 0.3, y: 0.64, surface: "floor" },
        { id: "robot", name: "Robot", emoji: "🤖", x: 0.7, y: 0.72, surface: "floor" },
        { id: "light", name: "Light", emoji: "💡", x: 0.82, y: 0.62, surface: "floor" },
        { id: "chair", name: "Chair", emoji: "🪑", x: 0.4, y: 0.78, surface: "floor" },
        { id: "plant", name: "Plant", emoji: "🪴", x: 0.22, y: 0.72, surface: "floor" },
        { id: "panel", name: "Panel", emoji: "🔆", x: 0.6, y: 0.6, surface: "floor" },
        { id: "orb", name: "Orb", emoji: "🔮", x: 0.52, y: 0.84, surface: "floor" },
      ]},
    ];
    static ENERGY_MAX = 25;
    static REGEN_MS = 5 * 60 * 1000;

    constructor(save, saveFn) {
      this._save = save;
      this._saveFn = saveFn;
      this._screen = document.getElementById("rubyCaveScreen");

      if (!save.rubyCaveEventEnd) {
        save.rubyCaveEventEnd = Date.now() + 2 * 24 * 60 * 60 * 1000;
        saveFn();
      }

      this.completed = save.rubyCaveCompleted || 0;
      this.energy = typeof save.rubyCaveEnergy === "number" ? save.rubyCaveEnergy : RubyCaveManager.ENERGY_MAX;
      this.nextEnergyAt = save.rubyCaveNextEnergyAt || null;
      this.eventEnd = save.rubyCaveEventEnd;
      this.currentLevel = 0;
      this.placedCount = 0;
      this.targetCount = 0;
      this._activeStickerLevel = 0;
      this._toastTimer = null;

      this._cacheEls();
      this._bindEvents();
      this._startTimers();
      this.completed = Math.min(this.completed, this._eventLevelCount());
    }

    _cacheEls() {
      const q = (id) => document.getElementById(id);
      this.el = {
        hub: q("rc-hub"),
        game: q("rc-game"),
        enterBtn: q("rc-enterBtn"),
        backBtn: q("rc-backBtn"),
        closeBtn: q("rc-closeBtn"),
        nextLevelBtn: q("rc-nextLevelBtn"),
        refillGemsBtn: q("rc-refill-gems"),
        refillAdBtn: q("rc-refill-ad"),
        refillCloseBtn: q("rc-energy-close"),
        done: q("rc-done"),
        energyModal: q("rc-energyModal"),
        toast: q("rc-toast"),
        hubTimer: q("rc-hubTimer"),
        hubBalanceMid: q("rc-hub-balance-mid"),
        gameTimer: q("rc-gameTimer"),
        gameBalanceTime: q("rc-game-balance-time"),
        gameTitleMain: q("rc-game-title-main"),
        hubEnergy: q("rc-hubEnergy"),
        gameEnergy: q("rc-gameEnergy"),
        hubRegen: q("rc-hubRegen"),
        gameRegen: q("rc-gameRegen"),
        hubProgress: q("rc-hubProgress"),
        hubSum: q("rc-hubSum"),
        gameInfo: q("rc-gameInfo"),
        nodes: q("rc-nodes"),
        scene: q("rc-scene"),
        room: q("rc-room"),
        roomShell: q("rc-room-shell"),
        roomPlaced: q("rc-room-placed"),
        tray: q("rc-tray"),
        doneTitle: q("rc-done-title"),
        donePreview: q("rc-done-preview"),
        externalHost: q("rc-external-host"),
        externalFrame: q("rc-external-frame"),
        grandReward: q("rc-grand-reward"),
        grandClaim: q("rc-grand-claim"),
        grandClose: q("rc-grand-close"),
        grandInfo: q("rc-grand-info"),
        hubClaim: q("rc-hub-claim"),
        featureInfoOverlay: q("rc-feature-info-overlay"),
        featureInfoContinue: q("rc-feature-info-continue"),
      };
    }

    _bindEvents() {
      this.el.enterBtn.addEventListener("click", (e) => this._handleEnterLevel(e));
      this.el.enterBtn.addEventListener("pointerup", (e) => this._handleEnterLevel(e));
      this.el.backBtn.addEventListener("click", () => this._showView("hub"));
      this.el.closeBtn.addEventListener("click", () => this.close());
      this.el.nextLevelBtn.addEventListener("click", (e) => this._handleNextLevel(e));
      this.el.nextLevelBtn.addEventListener("pointerup", (e) => this._handleNextLevel(e));
      if (this.el.refillGemsBtn) this.el.refillGemsBtn.addEventListener("click", () => this._onEnergyRefillWithGems());
      if (this.el.refillAdBtn) this.el.refillAdBtn.addEventListener("click", () => this._onEnergyRefillWithAd());
      if (this.el.refillCloseBtn) this.el.refillCloseBtn.addEventListener("click", () => this._closeEnergyRefillModal());
      this.el.grandClaim.addEventListener("click", () => this._claimGrandReward());
      if (this.el.grandClose) this.el.grandClose.addEventListener("click", () => {
        this.el.grandReward.classList.remove("rc-visible");
        this._showView("hub");
      });
      if (this.el.grandInfo) this.el.grandInfo.addEventListener("click", () => this._openFeatureInfo());
      if (this.el.hubClaim) {
        this.el.hubClaim.addEventListener("click", () => this._onHubClaim());
      }

      // Sticker drag is bound per tray tile in _buildLevel (see _bindStickerDrag).

      const infoBtn = document.getElementById("rc-infoBtn");
      const gameInfoBtn = document.getElementById("rc-gameInfoBtn");
      if (infoBtn && this.el.featureInfoOverlay) {
        infoBtn.addEventListener("click", () => this._openFeatureInfo());
        if (gameInfoBtn) gameInfoBtn.addEventListener("click", () => this._openFeatureInfo());
        if (this.el.featureInfoContinue) this.el.featureInfoContinue.addEventListener("click", () => this._closeFeatureInfo());
        this.el.featureInfoOverlay.addEventListener("click", (e) => {
          if (e.target === this.el.featureInfoOverlay) this._closeFeatureInfo();
        });
      }
    }

    _startTimers() {
      this._timerInterval = setInterval(() => this._updateTimerUI(), 1000);
      this._regenInterval = setInterval(() => this._regenTick(), 1000);
    }

    _persist() {
      this._save.rubyCaveCompleted = this.completed;
      this._save.rubyCaveEnergy = this.energy;
      this._save.rubyCaveNextEnergyAt = this.nextEnergyAt;
      this._save.rubyCaveEventEnd = this.eventEnd;
      this._saveFn();
    }

    _showToast(msg) {
      this.el.toast.textContent = msg;
      this.el.toast.classList.add("rc-show");
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => this.el.toast.classList.remove("rc-show"), 850);
    }

    _eventLevelCount() {
      return RubyCaveManager.STICKER_LEVELS.length;
    }

    _stickerLevelDef(index) {
      const defs = RubyCaveManager.STICKER_LEVELS;
      if (!defs.length) return null;
      const safeIndex = Math.max(0, Math.min(index, defs.length - 1));
      return defs[safeIndex];
    }

    // Per-level placement persistence: { [levelNumber]: { [stickerId]: true } }.
    _placedMapForLevel(levelIndex) {
      const all = this._save.rubyCaveStickerPlaced || (this._save.rubyCaveStickerPlaced = {});
      const key = String(levelIndex);
      if (!all[key] || typeof all[key] !== "object") all[key] = {};
      return all[key];
    }

    _showView(name) {
      this.el.hub.classList.add("rc-view--hidden");
      this.el.game.classList.add("rc-view--hidden");
      if (name === "hub") {
        this._stopExternalEventLevel();
        this.el.hub.classList.remove("rc-view--hidden");
        this._updateHubProgress();
      } else {
        this._closeFeatureInfo();
        this.el.game.classList.remove("rc-view--hidden");
      }
      this._updateEnergyUI();
      this._updateTimerUI();
    }

    _openFeatureInfo() {
      if (!this.el.featureInfoOverlay) return;
      this.el.featureInfoOverlay.classList.remove("rc-info-panel--hidden");
    }

    _closeFeatureInfo() {
      if (!this.el.featureInfoOverlay) return;
      this.el.featureInfoOverlay.classList.add("rc-info-panel--hidden");
    }

    _timerText() {
      const s = Math.max(0, Math.floor((this.eventEnd - Date.now()) / 1000));
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const ss = s % 60;
      return `${d}d ${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
    }

    _updateTimerUI() {
      const t = this._timerText();
      const compact = this._timerTextCompact();
      if (this.el.hubTimer) this.el.hubTimer.textContent = `Ends In: ${compact}`;
      if (this.el.gameTimer) this.el.gameTimer.textContent = `Ends In: ${compact}`;
    }

    _timerTextCompact() {
      const s = Math.max(0, Math.floor((this.eventEnd - Date.now()) / 1000));
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
    }

    _updateEnergyUI() {
      const val = `${this.energy}/${RubyCaveManager.ENERGY_MAX}`;
      this.el.hubEnergy.textContent = val;
      this.el.gameEnergy.textContent = val;
      let txt = "• Full";
      let shortTxt = "Full";
      if (this.energy < RubyCaveManager.ENERGY_MAX) {
        if (!this.nextEnergyAt) this.nextEnergyAt = Date.now() + RubyCaveManager.REGEN_MS;
        const left = Math.max(0, Math.ceil((this.nextEnergyAt - Date.now()) / 1000));
        const m = Math.floor(left / 60), s = left % 60;
        txt = `• ${m}:${String(s).padStart(2,"0")}`;
        shortTxt = `${m}:${String(s).padStart(2,"0")}`;
      }
      this.el.hubRegen.textContent = txt;
      this.el.gameRegen.textContent = txt;
      if (this.el.hubBalanceMid) this.el.hubBalanceMid.textContent = shortTxt;
      // The in-game HUD shows the live Event energy count (e.g. "24/25") next to
      // the blue lightning bolt, rather than the regen timer.
      if (this.el.gameBalanceTime) this.el.gameBalanceTime.textContent = val;
    }

    _regenTick() {
      if (this.energy >= RubyCaveManager.ENERGY_MAX) { this.nextEnergyAt = null; this._updateEnergyUI(); return; }
      if (!this.nextEnergyAt) this.nextEnergyAt = Date.now() + RubyCaveManager.REGEN_MS;
      while (this.energy < RubyCaveManager.ENERGY_MAX && this.nextEnergyAt && Date.now() >= this.nextEnergyAt) {
        this.energy += 1;
        this.nextEnergyAt = this.energy < RubyCaveManager.ENERGY_MAX ? this.nextEnergyAt + RubyCaveManager.REGEN_MS : null;
      }
      this._persist();
      this._updateEnergyUI();
    }

    _updateHubProgress() {
      const total = this._eventLevelCount();
      const current = Math.min(this.completed + 1, total);
      const remain = Math.max(0, total - this.completed);
      this.el.hubProgress.textContent = `Completed ${this.completed} • Current ${current} • Remaining ${remain}`;
      if (this.completed >= total) {
        this.el.hubSum.textContent = "All levels completed!";
        this.el.enterBtn.textContent = this._save.rubyCaveRewardClaimed ? "Completed" : "View Reward";
        this.el.enterBtn.disabled = !!this._save.rubyCaveRewardClaimed;
      } else {
        this.el.hubSum.textContent = `Level ${current} is ready`;
        this.el.enterBtn.textContent = "PLAY";
        this.el.enterBtn.disabled = false;
      }
      if (this.el.hubClaim) {
        const canClaim = this.completed >= total && !this._save.rubyCaveRewardClaimed;
        this.el.hubClaim.disabled = !canClaim;
        this.el.hubClaim.textContent = this._save.rubyCaveRewardClaimed ? "Claimed" : "Claim";
      }
      this._drawNodes();
    }

    _drawNodes() {
      this.el.nodes.innerHTML = "";
      const total = Math.max(1, this._eventLevelCount());
      const stageCount = 5;
      const progressed = Math.max(0, Math.min(stageCount, Math.floor((this.completed / total) * stageCount)));
      for (let i = 0; i < stageCount; i++) {
        const item = document.createElement("div");
        item.className = "rc-stage-item";
        const n = document.createElement("div");
        n.className = "rc-node";
        if (this.completed >= total || i < progressed) n.classList.add("rc-done");
        else if (i === progressed) n.classList.add("rc-cur");
        else n.classList.add("rc-lock");
        n.textContent = String(i + 1);
        item.appendChild(n);
        if (i < stageCount - 1) {
          const link = document.createElement("div");
          link.className = "rc-stage-link";
          if (this.completed >= total || i < progressed) link.classList.add("rc-stage-link--done");
          item.appendChild(link);
        }
        this.el.nodes.appendChild(item);
      }
    }

    // Build an isometric sticker room for level `idx` (0-based). Each sticker's
    // target slot is rendered into #rc-room-placed as an INVISIBLE hitbox (the
    // empty slot is not drawn — hidden-target puzzle), and the draggable tray
    // tiles for every still-unplaced sticker go into #rc-tray. Already-placed
    // stickers (from save) render as filled (visible) at their slot.
    _buildLevel(idx) {
      this._stopExternalEventLevel();
      const lvl = this._stickerLevelDef(idx);
      this._activeStickerLevel = idx;
      if (!lvl) return;
      const placedMap = this._placedMapForLevel(idx);
      this.placedCount = 0;
      this.targetCount = lvl.stickers.length;
      // Swap in this level's themed room shell so every level looks different.
      if (this.el.roomShell) {
        this.el.roomShell.innerHTML = RC_ROOM_SHELLS[lvl.room] || RC_ROOM_SHELLS.observatory || "";
      }
      if (this.el.roomPlaced) this.el.roomPlaced.innerHTML = "";
      if (this.el.tray) this.el.tray.innerHTML = "";

      // Target slots: render back-to-front (smaller y first) so closer items
      // overlap farther ones correctly. Empty slots are invisible hitboxes; the
      // emoji is kept ready so it reveals instantly when filled. Only filled
      // slots expose a name/tooltip (so the hidden answer never leaks).
      const ordered = lvl.stickers.slice().sort((a, b) => a.y - b.y);
      ordered.forEach((s) => {
        const filled = !!placedMap[s.id];
        if (filled) this.placedCount += 1;
        const slot = document.createElement("span");
        slot.className = "rc-room-slot rc-room-slot--surface-" + s.surface
          + (filled ? " rc-room-slot--filled" : " rc-room-slot--empty");
        slot.dataset.stickerId = s.id;
        slot.style.left = (s.x * 100) + "%";
        slot.style.top = (s.y * 100) + "%";
        const depth = Math.max(0, Math.min(1, s.y));
        const scale = 0.78 + depth * 0.42;
        slot.style.setProperty("--iso-scale", scale.toFixed(3));
        slot.style.zIndex = String(100 + Math.floor(depth * 900));
        if (filled) slot.title = s.name;
        slot.textContent = s.emoji;
        if (this.el.roomPlaced) this.el.roomPlaced.appendChild(slot);
      });

      // Tray tiles for unplaced stickers, in catalog order.
      lvl.stickers.forEach((s) => {
        if (placedMap[s.id]) return;
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "rc-sticker-tile";
        tile.dataset.stickerId = s.id;
        tile.setAttribute("aria-label", s.name);
        tile.title = s.name;
        const glyph = document.createElement("span");
        glyph.className = "rc-sticker-glyph";
        glyph.textContent = s.emoji;
        tile.appendChild(glyph);
        this._bindStickerDrag(tile, s);
        if (this.el.tray) this.el.tray.appendChild(tile);
      });

      this._updateGameProgress();
    }

    _updateGameProgress() {
      if (this.el.gameInfo) {
        this.el.gameInfo.textContent = `Stickers ${this.placedCount || 0}/${this.targetCount || 0}`;
      }
    }

    // External-level plumbing is retired for the sticker-room flow; kept as a
    // safe no-op so the (still-present, hidden) iframe host never shows.
    _stopExternalEventLevel() {
      if (this.el.game) this.el.game.classList.remove("rc-game--external");
      if (this.el.externalHost) this.el.externalHost.classList.add("rc-external-host--hidden");
    }

    // Drag a tray sticker to its single hidden target position. No hint/highlight
    // is shown while dragging and no silhouette marks the spot — the player must
    // guess from the room context. A correct drop (within the target's hitbox)
    // snaps in and costs 1 Event energy; a wrong drop bounces back with no energy
    // spent and no progress.
    _bindStickerDrag(tile, sticker) {
      const self = this;
      const ACCEPT_PX = 60;
      tile.style.touchAction = "none";
      tile.onpointerdown = (e) => {
        e.preventDefault();
        if (tile.dataset.dragging === "1") return;
        if (self.el.done.classList.contains("rc-visible")) return;
        if (self.el.energyModal.classList.contains("rc-visible")) return;
        if (self.el.grandReward.classList.contains("rc-visible")) return;
        if (self.energy <= 0) {
          self._openEnergyRefillModal();
          self._showToast("Not enough energy");
          return;
        }
        const targetSlot = self.el.roomPlaced
          ? self.el.roomPlaced.querySelector('.rc-room-slot[data-sticker-id="' + sticker.id + '"]')
          : null;
        if (!targetSlot) return;

        tile.dataset.dragging = "1";
        tile.classList.add("rc-sticker-tile--dragging");

        const ghost = document.createElement("div");
        ghost.className = "rc-sticker-ghost";
        ghost.textContent = sticker.emoji;
        document.body.appendChild(ghost);
        const place = (x, y) => { ghost.style.left = x + "px"; ghost.style.top = y + "px"; };
        place(e.clientX, e.clientY);
        try { tile.setPointerCapture(e.pointerId); } catch (_) {}

        const distToTarget = (cx, cy) => {
          const r = targetSlot.getBoundingClientRect();
          const tx = r.left + r.width / 2, ty = r.top + r.height / 2;
          return Math.hypot(cx - tx, cy - ty);
        };
        const cleanup = () => {
          tile.onpointermove = null;
          tile.onpointerup = null;
          tile.onpointercancel = null;
          tile.classList.remove("rc-sticker-tile--dragging");
          delete tile.dataset.dragging;
          if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
          try { tile.releasePointerCapture(e.pointerId); } catch (_) {}
        };
        const bounce = () => {
          tile.classList.add("rc-sticker-tile--bounce");
          setTimeout(() => tile.classList.remove("rc-sticker-tile--bounce"), 340);
        };
        tile.onpointermove = (mv) => place(mv.clientX, mv.clientY);
        tile.onpointerup = (up) => {
          const accept = distToTarget(up.clientX, up.clientY) <= ACCEPT_PX;
          cleanup();
          if (!accept) { bounce(); return; }
          if (self.energy < 1) {
            bounce();
            self._openEnergyRefillModal();
            self._showToast("Not enough energy");
            return;
          }
          self._placeSticker(sticker, tile, targetSlot);
        };
        tile.onpointercancel = () => { cleanup(); bounce(); };
      };
    }

    _placeSticker(sticker, tile, slot) {
      // Correct placement consumes 1 Event energy.
      this.energy -= 1;
      if (this.energy < RubyCaveManager.ENERGY_MAX && !this.nextEnergyAt) {
        this.nextEnergyAt = Date.now() + RubyCaveManager.REGEN_MS;
      }
      const placedMap = this._placedMapForLevel(this._activeStickerLevel);
      placedMap[sticker.id] = true;
      this.placedCount += 1;
      this._persist();
      this._updateEnergyUI();

      slot.classList.remove("rc-room-slot--empty");
      slot.classList.add("rc-room-slot--filled", "rc-room-slot--just-placed");
      slot.title = sticker.name;
      setTimeout(() => slot.classList.remove("rc-room-slot--just-placed"), 700);
      if (tile.parentNode) tile.parentNode.removeChild(tile);
      this._updateGameProgress();

      if (this.placedCount >= this.targetCount) {
        this._onStickerLevelComplete();
      }
    }

    _onStickerLevelComplete() {
      this.completed = Math.max(this.completed, this.currentLevel + 1);
      this._persist();
      const isFinal = this.completed >= this._eventLevelCount() && !this._save.rubyCaveRewardClaimed;
      setTimeout(() => {
        if (isFinal) this._showGrandReward();
        else this._showLevelComplete();
      }, 520);
    }

    _showLevelComplete() {
      if (this.el.doneTitle) this.el.doneTitle.textContent = "LEVEL COMPLETED";
      this._renderRoomPreview();
      this.el.done.classList.add("rc-visible");
    }

    // Clone the just-finished (fully decorated) room into the completion modal
    // as a small static preview.
    _renderRoomPreview() {
      if (!this.el.donePreview || !this.el.room) return;
      this.el.donePreview.innerHTML = "";
      const clone = this.el.room.cloneNode(true);
      clone.removeAttribute("id");
      clone.classList.add("rc-room--preview");
      clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      this.el.donePreview.appendChild(clone);
    }

    _handleEnterLevel(evt) {
      if (evt) { evt.preventDefault(); evt.stopPropagation(); }
      this.el.done.classList.remove("rc-visible");
      this._closeEnergyRefillModal();
      if (this.energy < 1) {
        this._openEnergyRefillModal();
        this._showToast("Not enough energy");
        return;
      }
      const totalLevels = this._eventLevelCount();
      if (this.completed >= totalLevels) {
        if (!this._save.rubyCaveRewardClaimed) this._showGrandReward();
        else this._showToast("All event levels completed");
        return;
      }
      const nextIdx = Math.min(Math.max(0, this.completed), totalLevels - 1);
      this.currentLevel = nextIdx;
      if (this.el.gameTitleMain) this.el.gameTitleMain.textContent = `Level ${nextIdx + 1}`;
      this._buildLevel(nextIdx);
      this._showView("game");
    }

    _handleNextLevel(evt) {
      if (evt) { evt.preventDefault(); evt.stopPropagation(); }
      this.completed = Math.max(this.completed, this.currentLevel + 1);
      this._persist();
      this.el.done.classList.remove("rc-visible");
      this._stopExternalEventLevel();
      const total = this._eventLevelCount();
      if (this.completed >= total && !this._save.rubyCaveRewardClaimed) {
        this._showGrandReward();
        return;
      }
      // Continue straight into the next level when one remains and there is
      // energy to play it; otherwise fall back to the hub (where the refill
      // prompt lives).
      if (this.completed < total && this.energy >= 1) {
        this._handleEnterLevel(null);
        return;
      }
      this._showView("hub");
    }

    _showGrandReward() {
      const total = this._eventLevelCount();
      const levelsEl = document.getElementById("rc-complete-levels");
      const timerEl = document.getElementById("rc-complete-timer");
      if (levelsEl) levelsEl.textContent = `${Math.min(this.completed, total)}/${total}`;
      if (timerEl) timerEl.textContent = this._timerTextCompact();
      this.el.done.classList.remove("rc-visible");
      this.el.grandReward.classList.add("rc-visible");
    }

    _openEnergyRefillModal() {
      if (!this.el.energyModal) return;
      this.el.energyModal.classList.add("rc-visible");
    }

    _closeEnergyRefillModal() {
      if (!this.el.energyModal) return;
      this.el.energyModal.classList.remove("rc-visible");
    }

    _applyEnergyRefill() {
      this.energy = RubyCaveManager.ENERGY_MAX;
      this.nextEnergyAt = null;
      this._persist();
      this._updateEnergyUI();
      this._closeEnergyRefillModal();
    }

    _onEnergyRefillWithGems() {
      // Placeholder: spend gems if the player happens to have them, but never
      // block — tapping always refills Event energy to full (25).
      const cost = 1000;
      const gems = Math.max(0, parseInt(this._save.gemsTotal, 10) || 0);
      if (gems >= cost) this._save.gemsTotal = gems - cost;
      this._applyEnergyRefill();
    }

    _onEnergyRefillWithAd() {
      // Prototype behavior: treat ad flow as instant successful refill.
      this._applyEnergyRefill();
    }

    _onHubClaim() {
      const total = this._eventLevelCount();
      if (this.completed < total) {
        this._showToast("Finish all levels first");
        return;
      }
      if (this._save.rubyCaveRewardClaimed) {
        this._showToast("Reward already claimed");
        return;
      }
      this._showGrandReward();
    }

    _claimGrandReward() {
      this._save.rubyCaveRewardClaimed = true;
      this._persist();
      this.el.grandReward.classList.remove("rc-visible");
      this._showView("hub");
    }

    open() {
      this._screen.classList.remove("hidden");
      this._closeFeatureInfo();
      this._showView("hub");
      if (this.completed >= this._eventLevelCount() && !this._save.rubyCaveRewardClaimed) {
        this._showGrandReward();
      }
      if (!this._save.rubyCaveTutorialDone) {
        this._tutorStep = 0;
        setTimeout(() => this._runTutorialStep(), 350);
      }
    }

    close() {
      this._endTutorial();
      this._closeFeatureInfo();
      this.el.done.classList.remove("rc-visible");
      this._closeEnergyRefillModal();
      this.el.grandReward.classList.remove("rc-visible");
      this._stopExternalEventLevel();
      this._screen.classList.add("hidden");
    }

    /* ---------- Tutorial ---------- */
    _tutorEls() {
      if (this._tutorElsCached) return this._tutorElsCached;
      this._tutorElsCached = {
        overlay: document.getElementById("rc-tutorial-overlay"),
        highlight: document.getElementById("rc-tutor-highlight"),
        bubble: document.getElementById("rc-tutor-bubble"),
        text: document.getElementById("rc-tutor-text"),
        finger: document.getElementById("rc-tutor-finger"),
      };
      return this._tutorElsCached;
    }

    _runTutorialStep() {
      const t = this._tutorEls();
      if (!t.overlay) return;
      t.overlay.classList.remove("rc-tutor-hidden");

      const steps = [
        () => this._tutorStepTimer(),
        () => this._tutorStepPlay(),
        () => this._tutorStepPuzzle(),
        () => this._tutorStepEnergy(),
      ];
      if (this._tutorStep >= steps.length) {
        this._endTutorial();
        return;
      }
      steps[this._tutorStep]();
    }

    _positionTutor(targetEl, bubbleText, bubbleBelow) {
      const t = this._tutorEls();
      const inner = this._screen.querySelector(".rc-inner");
      if (!targetEl || !inner) return;
      const ir = inner.getBoundingClientRect();
      const r = targetEl.getBoundingClientRect();
      const pad = 6;
      const hl = t.highlight;
      hl.style.left = (r.left - ir.left - pad) + "px";
      hl.style.top = (r.top - ir.top - pad) + "px";
      hl.style.width = (r.width + pad * 2) + "px";
      hl.style.height = (r.height + pad * 2) + "px";
      hl.style.borderRadius = getComputedStyle(targetEl).borderRadius || "12px";

      t.text.textContent = bubbleText;
      const bub = t.bubble;
      bub.style.left = "50%";
      bub.style.transform = "translateX(-50%)";
      if (bubbleBelow) {
        bub.style.top = (r.bottom - ir.top + 18) + "px";
        bub.style.bottom = "";
      } else {
        bub.style.top = "";
        bub.style.bottom = (ir.bottom - r.top + 18) + "px";
      }

      const finger = t.finger;
      finger.classList.remove("rc-tutor-finger--drag");
      finger.style.left = (r.left - ir.left + r.width / 2 - 14) + "px";
      finger.style.top = (r.bottom - ir.top + 2) + "px";
    }

    _tutorStepTimer() {
      const target = this.el.hubTimer;
      this._positionTutor(target, "This is a limited-time event! Complete it before the timer runs out.", true);
      this._tutorTapHandler = () => {
        this._tutorStep = 1;
        this._runTutorialStep();
      };
      this._tutorEls().overlay.addEventListener("click", this._tutorTapHandler, { once: true });
    }

    _tutorStepPlay() {
      const target = this.el.enterBtn;
      this._positionTutor(target, "Tap Play to enter the observatory and start decorating with stickers!", false);
      const t = this._tutorEls();
      t.finger.style.top = (target.getBoundingClientRect().top - this._screen.querySelector(".rc-inner").getBoundingClientRect().top - 32) + "px";

      this._tutorTapHandler = () => {
        t.overlay.classList.add("rc-tutor-hidden");
        this._tutorStep = 2;
        this._handleEnterLevel(null);
        setTimeout(() => this._runTutorialStep(), 500);
      };
      t.overlay.addEventListener("click", this._tutorTapHandler, { once: true });
    }

    _tutorStepPuzzle() {
      const t = this._tutorEls();
      t.overlay.classList.remove("rc-tutor-hidden");
      const inner = this._screen.querySelector(".rc-inner");
      if (!inner) return;
      const ir = inner.getBoundingClientRect();

      const firstPiece = this.el.tray.querySelector(".rc-sticker-tile");
      const roomEl = this.el.room || this.el.scene;
      if (!firstPiece || !roomEl) { this._tutorStep = 3; this._runTutorialStep(); return; }

      const pr = firstPiece.getBoundingClientRect();
      const rr = roomEl.getBoundingClientRect();
      const trayR = this.el.tray.getBoundingClientRect();
      const pad = 8;

      // Highlight only the TRAY — never the hidden target position.
      const hl = t.highlight;
      hl.style.left = (trayR.left - ir.left - pad) + "px";
      hl.style.top = (trayR.top - ir.top - pad) + "px";
      hl.style.width = (trayR.width + pad * 2) + "px";
      hl.style.height = (trayR.height + pad * 2) + "px";
      hl.style.borderRadius = "18px";

      t.text.textContent = "Drag stickers from the tray into the room and figure out where each one belongs. A correct drop snaps into place — a wrong drop returns to the tray.";
      const bub = t.bubble;
      bub.style.left = "50%";
      bub.style.transform = "translateX(-50%)";
      bub.style.top = "";
      bub.style.bottom = (ir.height - (trayR.top - ir.top) + 14) + "px";

      // The finger demonstrates the gesture: drag from the first tray sticker up
      // into the room centre — NOT toward any specific (invisible) target.
      const finger = t.finger;
      finger.classList.add("rc-tutor-finger--drag");
      const dx = (rr.left + rr.width / 2) - (pr.left + pr.width / 2);
      const dy = (rr.top + rr.height * 0.55) - (pr.bottom);
      finger.style.setProperty("--drag-dx", dx + "px");
      finger.style.setProperty("--drag-dy", dy + "px");
      finger.style.left = (pr.left - ir.left + pr.width / 2 - 14) + "px";
      finger.style.top = (pr.bottom - ir.top) + "px";

      this._tutorTapHandler = () => {
        finger.classList.remove("rc-tutor-finger--drag");
        this._tutorStep = 3;
        this._runTutorialStep();
      };
      t.overlay.addEventListener("click", this._tutorTapHandler, { once: true });
    }

    _tutorStepEnergy() {
      const target = this.el.gameEnergy?.closest(".rc-energy-pill") || this.el.gameEnergy;
      if (!target) { this._endTutorial(); return; }
      this._positionTutor(target, "This event has its own energy. Each sticker placed costs 1 energy — separate from the main game!", true);
      this._tutorTapHandler = () => {
        this._endTutorial();
      };
      this._tutorEls().overlay.addEventListener("click", this._tutorTapHandler, { once: true });
    }

    _endTutorial() {
      const t = this._tutorEls();
      if (t.overlay) t.overlay.classList.add("rc-tutor-hidden");
      if (this._tutorTapHandler) {
        t.overlay.removeEventListener("click", this._tutorTapHandler);
        this._tutorTapHandler = null;
      }
      if (!this._save.rubyCaveTutorialDone) {
        this._save.rubyCaveTutorialDone = true;
        this._saveFn();
      }
    }

    resetFromSave() {
      if (!this._save.rubyCaveEventEnd) {
        this._save.rubyCaveEventEnd = Date.now() + 2 * 24 * 60 * 60 * 1000;
        this._saveFn();
      }
      this.completed = this._save.rubyCaveCompleted || 0;
      this.energy = typeof this._save.rubyCaveEnergy === "number" ? this._save.rubyCaveEnergy : RubyCaveManager.ENERGY_MAX;
      this.nextEnergyAt = this._save.rubyCaveNextEnergyAt || null;
      this.eventEnd = this._save.rubyCaveEventEnd;
      this.currentLevel = 0;
      this.placedCount = 0;
      this.targetCount = 0;
      this._activeStickerLevel = 0;
      this._stopExternalEventLevel();
    }
  }

  class GameApp {
    constructor() {
      window.gameApp = this;
      this._save = loadSave();
      this.levelManager = new LevelManager();
      this.collectionManager = new CollectionManager(this._save, () => saveSave(this._save));
      this.leaderboardManager = new LeaderboardManager(this._save, () => saveSave(this._save));
      this.lostTempleManager = new LostTempleManager(this._save, () => saveSave(this._save), this);
      this.rubyCaveManager = new RubyCaveManager(this._save, () => saveSave(this._save));
      this._migrateCollectionState();
      this.ui = new UI();
      this.board = new PuzzleBoard(
        document.getElementById("puzzle-board"),
        () => this.handlePuzzleComplete()
      );
      this.pieceTray = new PieceTray(
        document.getElementById("piece-tray"),
        this.board,
        {
          onPlace: (pieceId) => this.onPiecePlaced(pieceId),
          onWrongDrop: () => this.onWrongDrop(),
          beforePlace: () => this._trySpendPuzzleEnergy(),
        }
      );
      this.collectionUI = new CollectionUI(this.collectionManager, this);
      this.currentLevelIndex = this._save.currentLevel;
      this.startTime = 0;
      this.mistakes = 0;
      this._cheatPlaceAnimating = false;
      this._pendingBattlePassUnlockAfterWin = false;
      this._pendingWheelUnlockAfterWin = false;
      this._pendingLeaderboardUnlockAfterWin = false;
      this._pendingLostTempleUnlockAfterWin = false;
      this._bpTutorDragAnimationId = null;
      this._playingBonusLevel = false;
      this._dailyTasksResetTimerId = null;
      this._dailyTasksEscapeHandler = null;
      this._externalLevelActive = false;
      this._externalLevelFrameBound = false;
      this._externalLevelLoadedIndex = -1;
      this._externalLevelLoadedSrc = "";
      this.externalLevelHostEl = document.getElementById("external-level-host");
      this.externalLevelFrameEl = document.getElementById("external-level-frame");
      this._applySaveToUI();
      this._bindGlobalButtons();
      this._bindExternalLevelHost();
      this.collectionUI.updateCollectionButtons();
      this.lostTempleManager.updateWidget();
      this.ui.showScreen("start-screen");
    }

    _migrateCollectionState() {
      this._save.collectionUnlocked = true;
      this._save.collectionTutorialCompleted = true;
      if (!this._save.albumEvent) {
        this._save.albumEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
      }
      if (!this._save.battlePassEvent) {
        this._save.battlePassEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
      }
      if (!this._save.lostTempleEvent) {
        this._save.lostTempleEvent = { startAt: Date.now(), endAt: Date.now() + EVENT_DURATION_MS };
      }
      saveSave(this._save);
    }

    addCoins(amount) {
      this._save.coins = (this._save.coins || 0) + (amount || 0);
      saveSave(this._save);
      this.ui.setCoins(this._save.coins);
    }

    addHammers(amount) {
      const add = Math.max(0, parseInt(amount, 10) || 0);
      if (!add) return;
      this._save.eventHammers = (this._save.eventHammers || 0) + add;
      saveSave(this._save);
      this.lostTempleManager.updateWidget();
      const screen = document.getElementById("lostTempleScreen");
      if (screen && !screen.classList.contains("hidden")) this.lostTempleManager._render();
    }

    canUseHammer() {
      return (this._save.eventHammers || 0) > 0;
    }

    spendHammer() {
      if (!this.canUseHammer()) return false;
      this._save.eventHammers = Math.max(0, (this._save.eventHammers || 0) - 1);
      saveSave(this._save);
      this.lostTempleManager.updateWidget();
      return true;
    }

    _applySaveToUI() {
      this._syncDailyTasksData();
      this.ui.setLevelNumber(this.currentLevelIndex);
      this.ui.setCoins(this._save.coins);
      this._updatePuzzleEnergyUI();
      const music = this._save.musicOn !== "false";
      const sfx = this._save.sfxOn !== "false";
      document.getElementById("toggle-music").setAttribute("aria-checked", music);
      document.getElementById("toggle-sfx").setAttribute("aria-checked", sfx);
      const trophies = (this._save.rewards && this._save.rewards.trophies) || 0;
      const trophiesEl = document.getElementById("settings-trophies-count");
      if (trophiesEl) trophiesEl.textContent = trophies;
      const navTrophies = document.getElementById("nav-trophies-count");
      if (navTrophies) navTrophies.textContent = this.leaderboardManager ? this.leaderboardManager.getPlayerScore() : (this._save.piecesCollectedTotal || 0);
      const goldCupRow = document.getElementById("settings-gold-cup-row");
      if (goldCupRow) goldCupRow.classList.toggle("hidden", !(this._save.rewards && this._save.rewards.trophiesGoldCup));
      if (window.gameApp && window.gameApp.collectionUI && typeof window.gameApp.collectionUI.updateGlobalCardsProgress === "function") {
        window.gameApp.collectionUI.updateGlobalCardsProgress();
      }
      if (window.gameApp && typeof window.gameApp.updateLeaderboardWidget === "function") {
        window.gameApp.updateLeaderboardWidget();
      }
      if (window.gameApp && typeof window.gameApp.updatePiggyWidget === "function") {
        window.gameApp.updatePiggyWidget();
      }
      const debugPanel = document.getElementById("debug-cheat-panel");
      if (debugPanel) debugPanel.classList.remove("hidden");
      const autoBtn = document.getElementById("btn-cheat-auto");
      if (autoBtn) autoBtn.classList.remove("hidden");
      if (window.gameApp && typeof window.gameApp._updateCheatAutoButton === "function") {
        window.gameApp._updateCheatAutoButton();
      }
      this.updateWheelWidget();
      if (window.gameApp && typeof window.gameApp.updateBattlePassWidget === "function") {
        window.gameApp.updateBattlePassWidget();
      }
      if (window.gameApp && typeof window.gameApp.updateRaceEventWidget === "function") {
        window.gameApp.updateRaceEventWidget();
      }
      if (window.gameApp && window.gameApp.lostTempleManager && typeof window.gameApp.lostTempleManager.updateWidget === "function") {
        window.gameApp.lostTempleManager.updateWidget();
      }
      if (window.gameApp && typeof window.gameApp.updateProfileWidget === "function") {
        window.gameApp.updateProfileWidget();
      }
      this._renderDailyTasksScreen();
    }

    _todayKey() {
      const d = new Date();
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }

    _syncDailyTasksData() {
      const today = this._todayKey();
      if (this._save.dailyTasksDateKey !== today) {
        const prevDay = Math.max(1, parseInt(this._save.dailyTasksDayIndex, 10) || 1);
        this._save.dailyTasksDateKey = today;
        this._save.dailyTasksClaims = {};
        this._save.dailyTasksMainRewardClaimed = false;
        this._save.dailyTasksDayIndex = ((prevDay % 7) + 1);
        this._save.dailyTasksProgress = { level1Complete: 0, piecesPlaced: 0, wheelSpins: 0, raceActions: 0, piggyClaims: 0 };
        saveSave(this._save);
      }
      if (!this._save.dailyTasksProgress || typeof this._save.dailyTasksProgress !== "object") {
        this._save.dailyTasksProgress = { level1Complete: 0, piecesPlaced: 0, wheelSpins: 0, raceActions: 0, piggyClaims: 0 };
      }
      if (!this._save.dailyTasksClaims || typeof this._save.dailyTasksClaims !== "object") {
        this._save.dailyTasksClaims = {};
      }
      if (typeof this._save.dailyTasksMainRewardClaimed !== "boolean") this._save.dailyTasksMainRewardClaimed = false;
      if (typeof this._save.dailyTasksDayIndex !== "number") this._save.dailyTasksDayIndex = 1;
      const progress = this._save.dailyTasksProgress;
      progress.level1Complete = Math.max(0, parseInt(progress.level1Complete, 10) || 0);
      progress.piecesPlaced = Math.max(0, parseInt(progress.piecesPlaced, 10) || 0);
      progress.wheelSpins = Math.max(0, parseInt(progress.wheelSpins, 10) || 0);
      progress.raceActions = Math.max(0, parseInt(progress.raceActions, 10) || 0);
      progress.piggyClaims = Math.max(0, parseInt(progress.piggyClaims, 10) || 0);
    }

    _secondsUntilDailyReset() {
      const now = new Date();
      const reset = new Date(now);
      reset.setHours(24, 0, 0, 0);
      return Math.max(0, Math.floor((reset.getTime() - now.getTime()) / 1000));
    }

    _dailyTaskModels() {
      this._syncDailyTasksData();
      const progress = this._save.dailyTasksProgress || {};
      const claims = this._save.dailyTasksClaims || {};
      return DAILY_TASK_DEFS.map((def) => {
        const current = Math.max(0, parseInt(progress[def.progressKey], 10) || 0);
        const target = Math.max(1, parseInt(def.target, 10) || 1);
        const done = current >= target;
        const claimed = !!claims[def.id];
        const state = claimed ? "claimed" : (done ? "completed" : (current > 0 ? "in_progress" : "not_started"));
        return { ...def, current, target, done, claimed, state };
      });
    }

    _dailyMainPoints(models) {
      const tasks = models || this._dailyTaskModels();
      return tasks.reduce((sum, t) => sum + (t.done ? (t.points || 0) : 0), 0);
    }

    _dailyMainTarget(models) {
      const tasks = models || this._dailyTaskModels();
      return Math.max(1, tasks.reduce((sum, t) => sum + Math.max(0, parseInt(t.points, 10) || 0), 0));
    }

    _renderDailyTasksScreen() {
      const listEl = document.getElementById("daily-tasks-list");
      if (!listEl) return;
      const tasks = this._dailyTaskModels();
      const dayEl = document.getElementById("daily-tasks-day");
      if (dayEl) {
        const dayIdx = Math.max(1, Math.min(7, parseInt(this._save.dailyTasksDayIndex, 10) || 1));
        dayEl.textContent = "Day " + String(dayIdx) + "/7";
      }
      const mainTarget = this._dailyMainTarget(tasks);
      const mainCurrent = Math.min(mainTarget, this._dailyMainPoints(tasks));
      const mainFill = document.getElementById("daily-tasks-main-fill");
      if (mainFill) mainFill.style.width = Math.round((mainCurrent / mainTarget) * 100) + "%";
      const mainCurrentEl = document.getElementById("daily-tasks-main-current");
      if (mainCurrentEl) mainCurrentEl.textContent = String(mainCurrent);
      const mainTargetEl = document.getElementById("daily-tasks-main-target");
      if (mainTargetEl) mainTargetEl.textContent = String(mainTarget);
      const mainPackEl = document.querySelector(".daily-tasks-main-pack");
      if (mainPackEl) {
        const canClaimMain = mainCurrent >= mainTarget && !this._save.dailyTasksMainRewardClaimed;
        mainPackEl.classList.toggle("is-claimable", canClaimMain);
        mainPackEl.classList.toggle("is-claimed", !!this._save.dailyTasksMainRewardClaimed);
        mainPackEl.setAttribute("title", this._save.dailyTasksMainRewardClaimed ? "Main reward claimed" : (canClaimMain ? "Claim main reward" : "Complete more quests"));
      }
      listEl.innerHTML = "";
      const visibleTasks = tasks.filter((task) => !task.claimed);
      visibleTasks.forEach((task) => {
        const progressCurrent = Math.min(task.current, task.target);
        const pct = Math.max(0, Math.min(100, Math.round((progressCurrent / task.target) * 100)));
        const rewards = Array.isArray(task.rewards) ? task.rewards : [];
        const rewardHtml = rewards.map((reward) => {
          const icon = DAILY_TASK_REWARD_ICON_BY_TYPE[reward.type] || DAILY_TASK_REWARD_ICON_BY_TYPE.coin;
          return `<span class="daily-task-reward-chip"><img src="${icon}" alt="" aria-hidden="true" /><span>${reward.amount}</span></span>`;
        }).join("");
        const cheatDisabled = task.done || task.claimed;
        const item = document.createElement("article");
        item.className = "daily-task-item state-" + task.state;
        item.innerHTML =
          `<div class="daily-task-grid">` +
            `<div class="daily-task-center">` +
              `<div class="daily-task-head">` +
                `<h3 class="daily-task-title">${task.title}</h3>` +
                `<p class="daily-task-progress">${progressCurrent}/${task.target}</p>` +
              `</div>` +
              `<div class="daily-task-points">+${task.points} points</div>` +
              `<div class="daily-task-bar"><div class="daily-task-bar-fill" style="width:${pct}%"></div></div>` +
              `<div class="daily-task-reward-row">${rewardHtml}</div>` +
            `</div>` +
          `</div>` +
          `${task.done ? `<div class="daily-task-claim-row"><button type="button" class="daily-task-claim-btn" data-task-id="${task.id}" ${task.claimed ? "disabled" : ""}>${task.claimed ? "Claimed" : "Claim"}</button></div>` : ""}` +
          `<div class="daily-task-bottom">` +
            `<button type="button" class="daily-task-cheat" data-task-cheat-id="${task.id}" ${cheatDisabled ? "disabled" : ""}>Cheat</button>` +
          `</div>`;
        listEl.appendChild(item);
      });
      if (!visibleTasks.length) {
        const empty = document.createElement("article");
        empty.className = "daily-task-item state-claimed";
        empty.innerHTML = `<div class="daily-task-center"><h3 class="daily-task-title">All daily quests claimed</h3></div>`;
        listEl.appendChild(empty);
      }
      const resetEl = document.getElementById("daily-tasks-refresh-timer");
      if (resetEl) {
        const sec = this._secondsUntilDailyReset();
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        resetEl.textContent = `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
      }
    }

    _claimDailyTask(taskId) {
      const task = DAILY_TASK_DEFS.find((t) => t.id === taskId);
      if (!task) return;
      const model = this._dailyTaskModels().find((t) => t.id === taskId);
      if (!model || !model.done || model.claimed) return;
      this._save.dailyTasksClaims[taskId] = true;
      if (task.rewardCoins) this._save.coins = (this._save.coins || 0) + task.rewardCoins;
      if (task.rewardGems) this._save.gemsTotal = (this._save.gemsTotal || 0) + task.rewardGems;
      saveSave(this._save);
      this.ui.setCoins(this._save.coins);
      this._renderDailyTasksScreen();
    }

    _cheatCompleteDailyTask(taskId) {
      const task = DAILY_TASK_DEFS.find((t) => t.id === taskId);
      if (!task) return;
      this._syncDailyTasksData();
      if (!this._save.dailyTasksProgress || typeof this._save.dailyTasksProgress !== "object") return;
      this._save.dailyTasksProgress[task.progressKey] = Math.max(task.target || 1, parseInt(this._save.dailyTasksProgress[task.progressKey], 10) || 0);
      saveSave(this._save);
      this._renderDailyTasksScreen();
    }

    _claimDailyMainReward() {
      this._syncDailyTasksData();
      const mainTarget = this._dailyMainTarget();
      if (this._save.dailyTasksMainRewardClaimed) return;
      if (this._dailyMainPoints() < mainTarget) return;
      this._save.dailyTasksMainRewardClaimed = true;
      this._save.coins = (this._save.coins || 0) + 120;
      this._save.albumStars = (this._save.albumStars || 0) + 10;
      saveSave(this._save);
      this.ui.setCoins(this._save.coins);
      this.collectionUI.updateCollectionButtons();
      this._renderDailyTasksScreen();
    }

    _openDailyTasksInfoOverlay() {
      const overlay = document.getElementById("daily-tasks-info-overlay");
      if (!overlay) return;
      overlay.classList.remove("hidden");
      const close = () => this._closeDailyTasksInfoOverlay();
      overlay.onclick = (e) => { if (e.target === overlay) close(); };
      const cont = document.getElementById("daily-tasks-info-continue");
      if (cont) cont.onclick = close;
    }

    _closeDailyTasksInfoOverlay() {
      const overlay = document.getElementById("daily-tasks-info-overlay");
      if (!overlay) return;
      overlay.classList.add("hidden");
      overlay.onclick = null;
      const cont = document.getElementById("daily-tasks-info-continue");
      if (cont) cont.onclick = null;
    }

    openDailyTasksScreen() {
      const screen = document.getElementById("daily-tasks-screen");
      if (!screen) return;
      this.ui.showScreen("daily-tasks-screen");
      const listEl = document.getElementById("daily-tasks-list");
      if (listEl) {
        listEl.onclick = (e) => {
          const cheatBtn = e.target.closest(".daily-task-cheat");
          if (cheatBtn) {
            const cheatTaskId = cheatBtn.getAttribute("data-task-cheat-id");
            if (cheatTaskId) this._cheatCompleteDailyTask(cheatTaskId);
            return;
          }
          const btn = e.target.closest(".daily-task-claim-btn");
          if (!btn) return;
          const taskId = btn.getAttribute("data-task-id");
          if (taskId) this._claimDailyTask(taskId);
        };
      }
      const closeBtn = document.getElementById("btn-daily-tasks-close");
      if (closeBtn) closeBtn.onclick = () => this.ui.showScreen("start-screen");
      const mainPackEl = document.querySelector(".daily-tasks-main-pack");
      if (mainPackEl) {
        mainPackEl.onclick = () => this._claimDailyMainReward();
      }
      this._renderDailyTasksScreen();
      if (this._dailyTasksResetTimerId) clearInterval(this._dailyTasksResetTimerId);
      this._dailyTasksResetTimerId = setInterval(() => this._renderDailyTasksScreen(), 1000);
      if (this._dailyTasksEscapeHandler) window.removeEventListener("keydown", this._dailyTasksEscapeHandler);
      this._dailyTasksEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const overlay = document.getElementById("daily-tasks-info-overlay");
        if (overlay && !overlay.classList.contains("hidden")) {
          e.preventDefault();
          this._closeDailyTasksInfoOverlay();
          return;
        }
        e.preventDefault();
        this.ui.showScreen("start-screen");
      };
      window.addEventListener("keydown", this._dailyTasksEscapeHandler);
    }

    closeDailyTasksScreen() {
      this._closeDailyTasksInfoOverlay();
      const listEl = document.getElementById("daily-tasks-list");
      if (listEl) listEl.onclick = null;
      const closeBtn = document.getElementById("btn-daily-tasks-close");
      if (closeBtn) closeBtn.onclick = null;
      const mainPackEl = document.querySelector(".daily-tasks-main-pack");
      if (mainPackEl) {
        mainPackEl.onclick = null;
      }
      if (this._dailyTasksResetTimerId) {
        clearInterval(this._dailyTasksResetTimerId);
        this._dailyTasksResetTimerId = null;
      }
      if (this._dailyTasksEscapeHandler) {
        window.removeEventListener("keydown", this._dailyTasksEscapeHandler);
        this._dailyTasksEscapeHandler = null;
      }
    }

    _saveState() {
      this._save.currentLevel = this.currentLevelIndex;
      this._save.coins = this.getCoins();
      this._save.musicOn = document.getElementById("toggle-music").getAttribute("aria-checked");
      this._save.sfxOn = document.getElementById("toggle-sfx").getAttribute("aria-checked");
      if (this._save.rewards) {
        const trophiesEl = document.getElementById("settings-trophies-count");
        if (trophiesEl) this._save.rewards.trophies = parseInt(trophiesEl.textContent, 10) || 0;
      }
      saveSave(this._save);
    }

    getCoins() {
      const el = document.getElementById("coins-count");
      return el ? parseInt(el.textContent, 10) || 0 : DEFAULT_COINS;
    }

    _updateCheatAutoButton() {
      const btn = document.getElementById("btn-cheat-auto");
      if (!btn || btn.classList.contains("hidden")) return;
      const gameActive = document.getElementById("game-screen").classList.contains("active");
      const winOpen = !document.getElementById("win-modal").classList.contains("hidden");
      const disabled = !gameActive || winOpen;
      btn.disabled = disabled;
      btn.classList.toggle("cheat-auto-disabled", disabled);
    }

    _bindExternalLevelHost() {
      const backBtn = document.getElementById("btn-external-level-back");
      if (backBtn) {
        backBtn.onclick = () => {
          if (this._externalLevelActive) this._stopExternalPlayableLevel();
          this.ui.showScreen("start-screen");
        };
      }
      const skipBtn = document.getElementById("btn-external-level-skip");
      if (skipBtn) skipBtn.onclick = () => this._skipCurrentLevel();
      if (this.externalLevelFrameEl && !this._externalLevelFrameBound) {
        this._externalLevelFrameBound = true;
        this.externalLevelFrameEl.addEventListener("load", () => {
          if (!this._externalLevelActive) return;
          // Best effort bridge: if same-origin/same-file context allows it,
          // connect the uploaded level callbacks to our flow.
          try {
            const frameWin = this.externalLevelFrameEl.contentWindow;
            if (frameWin) {
              frameWin.gameEnd = () => this._onExternalPlayableCompleted();
              // Spend 1 main energy for each newly placed piece in embedded levels.
              const doc = frameWin.document;
              const layer = doc ? doc.getElementById("pieceLayer") : null;
              if (layer) {
                if (this._externalPieceObserver) {
                  this._externalPieceObserver.disconnect();
                  this._externalPieceObserver = null;
                }
                this._externalSeenPieceIds = new Set();
                layer.querySelectorAll(".piece[data-i]").forEach((el) => {
                  const id = String(el.dataset.i || "");
                  if (id) this._externalSeenPieceIds.add(id);
                });
                this._externalPieceObserver = new MutationObserver((mutations) => {
                  mutations.forEach((m) => {
                    m.addedNodes.forEach((node) => {
                      if (!(node instanceof frameWin.Element)) return;
                      if (!node.classList.contains("piece")) return;
                      const pieceId = String(node.getAttribute("data-i") || "");
                      if (!pieceId || this._externalSeenPieceIds.has(pieceId)) return;
                      this._externalSeenPieceIds.add(pieceId);
                      this._onExternalPiecePlaced(pieceId);
                    });
                  });
                });
                this._externalPieceObserver.observe(layer, { childList: true });
              }
              // Disable outbound store action and hide download CTAs from embedded level.
              frameWin.openStore = () => {};
              if (doc && doc.head) {
                const style = doc.createElement("style");
                const hideHints = this.currentLevelIndex > 0;
                style.textContent =
                  "#dl,#winDl,.downloadBtn,#winBtns{display:none !important;}" +
                  (hideHints
                    ? "#hintOverlay,#hintHand,#scrollHintOverlay,#scrollHintHand{display:none !important;opacity:0 !important;pointer-events:none !important;}"
                    : "");
                doc.head.appendChild(style);
              }
              if (this.currentLevelIndex > 0) {
                try {
                  const doc = frameWin.document;
                  const hintOverlay = doc ? doc.getElementById("hintOverlay") : null;
                  if (hintOverlay) hintOverlay.dataset.hand1Ready = "0";
                  const scrollHintOverlay = doc ? doc.getElementById("scrollHintOverlay") : null;
                  if (scrollHintOverlay) scrollHintOverlay.dataset.hand2Ready = "0";
                  frameWin.runBoosterTutorial = () => {};
                } catch (_) {
                  // Keep best-effort only.
                }
              }
            }
          } catch (_) {
            // Cross-origin restrictions are expected in some runtimes.
          }
        });
      }
    }

    _toggleGameplayHostUI(useExternalHost) {
      const progressBar = document.querySelector("#game-screen .progress-bar");
      const gameArea = document.querySelector("#game-screen .game-area");
      const debugPanel = document.getElementById("debug-cheat-panel");
      if (this.externalLevelHostEl) this.externalLevelHostEl.classList.toggle("hidden", !useExternalHost);
      if (progressBar) progressBar.classList.toggle("hidden", useExternalHost);
      if (gameArea) gameArea.classList.toggle("hidden", useExternalHost);
      if (debugPanel) debugPanel.classList.toggle("hidden", useExternalHost);
    }

    _startExternalPlayableLevel(entry, levelIndex) {
      if (!entry || !entry.src || !this.externalLevelFrameEl) {
        this.loadLevel(levelIndex);
        return;
      }
      this._externalLevelActive = true;
      this.currentLevelIndex = Math.max(0, levelIndex);
      this.ui.setLevelNumber(this.currentLevelIndex);
      this._saveState();
      this.ui.showScreen("game-screen");
      this._toggleGameplayHostUI(true);
      const currentSrc = String(this.externalLevelFrameEl.src || "");
      const canReuseExistingState =
        this._externalLevelLoadedIndex === levelIndex &&
        currentSrc &&
        currentSrc !== "about:blank" &&
        currentSrc.indexOf(entry.src) >= 0;
      if (!canReuseExistingState) {
        this.externalLevelFrameEl.src = entry.src;
        this._externalLevelLoadedIndex = levelIndex;
        this._externalLevelLoadedSrc = entry.src;
      }
    }

    _stopExternalPlayableLevel() {
      this._externalLevelActive = false;
      // Keep iframe state in memory so returning with Play resumes same progress.
      this._toggleGameplayHostUI(false);
    }

    _onExternalPlayableCompleted() {
      const next = this.currentLevelIndex + 1;
      this._stopExternalPlayableLevel();
      this.currentLevelIndex = Math.min(next, this.levelManager.getTotalLevels() - 1);
      this._saveState();
      this.ui.showScreen("start-screen");
      this._renderGalleryScreen();
    }

    _skipCurrentLevel() {
      const next = this.currentLevelIndex + 1;
      if (next >= this.levelManager.getTotalLevels()) {
        this.ui.showScreen("start-screen");
        return;
      }
      if (this._externalLevelActive) this._stopExternalPlayableLevel();
      this._launchLevelByIndex(next);
    }

    _resolveGalleryLevels() {
      const currentProgress = Math.max(0, parseInt(this._save.currentLevel, 10) || 0);
      return GALLERY_LEVEL_DEFS.map((def, index) => {
        let state = "locked";
        if (typeof def.playableLevelIndex === "number") {
          if (currentProgress > def.playableLevelIndex) state = "completed";
          else if (currentProgress === def.playableLevelIndex) state = "unlocked";
          else state = "locked";
        }
        return {
          id: def.id,
          label: "Level " + String(index + 1),
          featureIcon: def.featureIcon,
          state,
          playableLevelIndex: def.playableLevelIndex,
        };
      });
    }

    _renderGalleryScreen() {
      const grid = document.getElementById("gallery-grid");
      if (!grid) return;
      const levels = this._resolveGalleryLevels();
      grid.innerHTML = "";
      levels.forEach((entry) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "gallery-level-card state-" + entry.state;
        card.setAttribute("role", "listitem");
        card.setAttribute("aria-disabled", entry.state === "locked" ? "true" : "false");

        const bg = document.createElement("span");
        bg.className = "gallery-level-bg";
        bg.setAttribute("aria-hidden", "true");
        card.appendChild(bg);

        const overlay = document.createElement("span");
        overlay.className = "gallery-level-overlay";
        overlay.setAttribute("aria-hidden", "true");
        card.appendChild(overlay);

        const featureIcon = document.createElement("span");
        featureIcon.className = "gallery-level-feature-icon " + entry.featureIcon;
        featureIcon.setAttribute("aria-hidden", "true");
        card.appendChild(featureIcon);

        const badge = document.createElement("span");
        badge.className = "gallery-level-state-badge";
        if (entry.state === "unlocked") badge.textContent = "50%";
        badge.setAttribute("aria-hidden", "true");
        card.appendChild(badge);

        const title = document.createElement("span");
        title.className = "gallery-level-title";
        title.textContent = entry.label;
        card.appendChild(title);

        if (entry.state !== "locked" && typeof entry.playableLevelIndex === "number") {
          card.onclick = () => this._launchLevelByIndex(entry.playableLevelIndex);
        } else {
          card.onclick = null;
        }
        grid.appendChild(card);
      });
    }

    openGalleryScreen() {
      if (this._externalLevelActive) this._stopExternalPlayableLevel();
      this._renderGalleryScreen();
      this.ui.showScreen("gallery-screen");
    }

    _launchLevelByIndex(index) {
      const safeIndex = Math.max(0, Math.min(index, this.levelManager.getTotalLevels() - 1));
      this.currentLevelIndex = safeIndex;
      this.ui.setLevelNumber(this.currentLevelIndex);
      const entry = this.levelManager.getLevelEntry(this.currentLevelIndex);
      if (entry && entry.type === "html-playable") {
        this._startExternalPlayableLevel(entry, this.currentLevelIndex);
        return;
      }
      this.ui.showScreen("game-screen");
      this._toggleGameplayHostUI(false);
      this.loadLevel(this.currentLevelIndex);
    }

    cheatPlaceOnePiece() {
      const gameScreen = document.getElementById("game-screen");
      const winModal = document.getElementById("win-modal");
      if (!gameScreen || !gameScreen.classList.contains("active")) return;
      if (!winModal || !winModal.classList.contains("hidden")) return;
      if (this._cheatPlaceAnimating) return;
      if (!this._trySpendPuzzleEnergy()) return;
      this.pieceTray.cancelDrag();
      const piece = this.pieceTray.pieces.find((p) => !p.placed);
      if (!piece) return;
      const slot = this.board.getSlotByPieceId(piece.pieceId);
      if (!slot || slot.filled) return;

      this._cheatPlaceAnimating = true;
      const doPlace = () => {
        this._cheatPlaceAnimating = false;
        const placed = this.board.placePiece(piece.pieceId, piece.url, true);
        if (!placed) return;
        piece.placed = true;
        piece.el.style.visibility = "hidden";
        piece.el.style.pointerEvents = "none";
        this.onPiecePlaced(piece.pieceId);
      };

      const trayRect = piece.el.getBoundingClientRect();
      const slotRect = slot.el.getBoundingClientRect();
      const w = trayRect.width;
      const h = trayRect.height;
      const endX = slotRect.left + (slotRect.width - w) / 2;
      const endY = slotRect.top + (slotRect.height - h) / 2;

      const clone = document.createElement("div");
      clone.className = "cheat-fly-piece";
      clone.style.width = w + "px";
      clone.style.height = h + "px";
      clone.style.left = trayRect.left + "px";
      clone.style.top = trayRect.top + "px";
      clone.style.backgroundImage = "url(" + piece.url + ")";
      document.body.appendChild(clone);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          clone.style.left = endX + "px";
          clone.style.top = endY + "px";
        });
      });
      clone.addEventListener("transitionend", () => {
        clone.remove();
        doPlace();
      }, { once: true });
      setTimeout(() => {
        if (clone.parentNode) {
          clone.remove();
          doPlace();
        }
      }, 400);
    }

    startGame() {
      const savedLevel = Math.max(0, parseInt(this._save.currentLevel, 10) || 0);
      this._launchLevelByIndex(savedLevel);
    }

    loadLevel(index) {
      const level = this.levelManager.getLevel(index);
      if (!level) return;
      this._stopExternalPlayableLevel();
      this.currentLevelIndex = index;
      this.startTime = Date.now();
      this.mistakes = 0;
      this._saveState();

      this._clearBattlePassTutorial();

      const pieceUrls = this.board.build(level);
      this.pieceTray.build(pieceUrls, 64);

      this.ui.setLevelNumber(index);
      this.ui.setProgress(0, level.pieceCount);
      this.ui.setCoins(this.getCoins());
      this.collectionUI.updateCollectionButtons();

      if (this._save.battlePassUnlocked) {
        this._startBattlePassTutorialIfNeeded();
      }
    }

    loadBonusLevel() {
      const level = this.levelManager.getBonusLevel();
      if (!level) return;
      this._playingBonusLevel = true;
      this.startTime = Date.now();
      this.mistakes = 0;

      this._clearBattlePassTutorial();

      const gameArea = document.querySelector(".game-area");
      if (gameArea) gameArea.classList.add("game-area--bonus");

      const pieceUrls = this.board.build(level);
      this.pieceTray.build(pieceUrls, 64);

      this.ui.setLevelLabel("Bonus Level");
      this.ui.setProgress(0, level.pieceCount);
      this.ui.setCoins(this.getCoins());
      this.collectionUI.updateCollectionButtons();
    }

    replayBonusLevel() {
      this.ui.hideWinModal();
      this._updateCheatAutoButton();
      this.loadBonusLevel();
    }

    onPiecePlaced(pieceId) {
      this._awardMetaProgressOnPiecePlaced(pieceId);
      if (this._save.bpTutorStep === 1) {
        this._save.bpTutorStep = 2;
        saveSave(this._save);
        this._bpTutorHideHand();
        if (this._bpTutorDragAnimationId) {
          cancelAnimationFrame(this._bpTutorDragAnimationId);
          this._bpTutorDragAnimationId = null;
        }
        this._bpTutorShowHandAtElement(this._getBPWidgetElement(), "Tap Battle Pass to see rewards!");
      }
      this.ui.setProgress(this.board.getPlacedCount(), this.board.getTotalPieces());
      if (document.getElementById("toggle-sfx").getAttribute("aria-checked") === "true") {
        AudioPlayer.place();
      }
    }

    _awardMetaProgressOnPiecePlaced(pieceId) {
      const piecePoints = 1;
      let saveDirty = false;
      if (this._save.leaderboardUnlocked) {
        this.leaderboardManager.incrementOnPiecePlaced();
      }
      if (this._save.battlePassUnlocked && isEventActive(this._save, "battlePassEvent")) {
        this._save.bpStarsTotal = (this._save.bpStarsTotal || 0) + piecePoints;
        saveDirty = true;
      }
      if (!this._save.piggyBroken && this._save.piggyGemsStored < this._save.piggyCap) {
        this._save.piggyGemsStored = Math.min(this._save.piggyCap, (this._save.piggyGemsStored || 0) + piecePoints);
        saveDirty = true;
      }
      if (this._save.raceUnlocked && isRaceActive(this._save)) {
        raceOnPuzzleCompleted(this._save);
        saveDirty = true;
      }
      this._syncDailyTasksData();
      this._save.dailyTasksProgress.piecesPlaced = (this._save.dailyTasksProgress.piecesPlaced || 0) + piecePoints;
      saveDirty = true;
      if (saveDirty) saveSave(this._save);
      const navPieces = document.getElementById("nav-trophies-count");
      if (navPieces) navPieces.textContent = this.leaderboardManager.getPlayerScore();
      this.updateBattlePassWidget();
      this.updatePiggyWidget();
      this.updateRaceEventWidget();
      this._renderDailyTasksScreen();
      const raceScreen = document.getElementById("raceEventScreen");
      if (raceScreen && !raceScreen.classList.contains("hidden")) {
        this._renderRaceTrack();
      }
    }

    _onExternalPiecePlaced(pieceId) {
      this._awardMetaProgressOnPiecePlaced(pieceId);
      this._trySpendPuzzleEnergy();
    }

    onWrongDrop() {
      this.mistakes++;
      if (document.getElementById("toggle-sfx").getAttribute("aria-checked") === "true") {
        AudioPlayer.wrong();
      }
    }

    _trySpendPuzzleEnergy() {
      if ((this._save.puzzleEnergy || 0) >= 1) {
        this._save.puzzleEnergy = Math.max(0, this._save.puzzleEnergy - 1);
        saveSave(this._save);
        this._updatePuzzleEnergyUI();
        return true;
      }
      this._showEnergyRefillPopup();
      return false;
    }

    _addPuzzleEnergy(amount) {
      this._save.puzzleEnergy = (this._save.puzzleEnergy || 0) + amount;
      saveSave(this._save);
      this._updatePuzzleEnergyUI();
    }

    // Grant a Battle Pass reward by type. Sticker packs go to the pending-pack
    // queue (opened later in the Stickers tab); gems/energy/hammers add directly.
    _grantBpReward(rw) {
      if (!rw) return;
      if (rw.type === "pack") {
        this.collectionManager.addPendingStickerPack(rw.grade);
        if (this.collectionUI && typeof this.collectionUI.refreshStickerLevelIfOpen === "function") {
          this.collectionUI.refreshStickerLevelIfOpen();
        }
      } else if (rw.type === "gems") {
        this._save.gemsTotal = (this._save.gemsTotal || 0) + (rw.amount || 0);
        saveSave(this._save);
      } else if (rw.type === "energy") {
        this._addPuzzleEnergy(rw.amount || 0);
      } else if (rw.type === "hammers") {
        this.addHammers(rw.amount || 0);
      }
    }

    // ===== Sticker Shop ====================================================
    openShopScreen(returnTo) {
      const active = document.querySelector(".screen.active");
      let prev = returnTo || (active ? active.id : "start-screen");
      if (prev === "shop-screen") prev = "album-screen";
      this._shopPrevScreen = prev;
      if (!this._shopCategory || !SHOP_PACK_TABS.some((t) => t.key === this._shopCategory)) {
        this._shopCategory = SHOP_PACK_TABS[0].key;
      }
      this.ui.showScreen("shop-screen");
      this._renderShop();
      const closeBtn = document.getElementById("btn-shop-close");
      if (closeBtn) closeBtn.onclick = () => this.closeShopScreen();
    }

    closeShopScreen() {
      const back = this._shopPrevScreen || "start-screen";
      if (back === "album-screen" && this.collectionUI && typeof this.collectionUI.showAlbum === "function") {
        this.collectionUI.showAlbum();
      } else {
        this.ui.showScreen(back);
      }
    }

    _renderShop() {
      this._renderShopCurrencies();
      this._renderShopTabs();
      this._renderShopGrid();
    }

    _renderShopCurrencies() {
      const host = document.getElementById("shop-currencies");
      if (!host) return;
      const gems = Math.max(0, parseInt(this._save.gemsTotal, 10) || 0);
      const coins = Math.max(0, parseInt(this._save.coins, 10) || 0);
      const tickets = Math.max(0, parseInt(this._save.shopTickets, 10) || 0);
      const pill = (cls, icon, val) =>
        '<div class="shop-cur-pill shop-cur-pill--' + cls + '"><span class="shop-cur-icon">' + icon
        + '</span><span class="shop-cur-val">' + val + '</span><span class="shop-cur-plus">+</span></div>';
      host.innerHTML = pill("gem", "💎", gems) + pill("paw", "🐾", coins) + pill("ticket", "🎟️", tickets);
    }

    _renderShopTabs() {
      const host = document.getElementById("shop-tabs");
      if (!host) return;
      host.innerHTML = "";
      SHOP_PACK_TABS.forEach((tab) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "shop-tab" + (tab.key === this._shopCategory ? " shop-tab--active" : "");
        btn.innerHTML = '<span class="shop-tab-icon">' + tab.icon + "</span>";
        btn.setAttribute("aria-label", tab.label);
        btn.onclick = () => { this._shopCategory = tab.key; this._renderShop(); };
        host.appendChild(btn);
      });
    }

    // The Shop sells sticker PACKS (grade I–V), not individual stickers. Tapping
    // a pack opens the existing pack-opening animation in the Stickers room and
    // grants the stickers into the tray.
    _renderShopGrid() {
      const host = document.getElementById("shop-grid");
      if (!host) return;
      host.innerHTML = "";
      const tab = SHOP_PACK_TABS.find((t) => t.key === this._shopCategory) || SHOP_PACK_TABS[0];

      // UPDATE card (placeholder refresh).
      const upd = document.createElement("div");
      upd.className = "shop-card shop-card--special shop-card--update";
      upd.innerHTML = '<div class="shop-card-head">UPDATE</div>'
        + '<div class="shop-card-timer">🕐 23h 58m</div>'
        + '<button type="button" class="shop-card-btn shop-card-btn--now">NOW ▶</button>';
      upd.querySelector(".shop-card-btn").onclick = () => this._shopUpdate();
      host.appendChild(upd);

      // FREE card — opens a free Pack I.
      const free = document.createElement("div");
      free.className = "shop-card shop-card--special shop-card--free";
      const fMeta = getStickerPackTier(1);
      free.innerHTML = '<div class="shop-card-head">FREE</div>'
        + '<div class="shop-pack-art shop-pack-icon sticker-pack-tier--1"><span class="bp-pack-band"></span><span class="bp-pack-star">' + fMeta.star + '</span></div>'
        + '<button type="button" class="shop-card-btn shop-card-btn--free">FREE ▶</button>';
      free.querySelector(".shop-card-btn").onclick = () => this._shopBuyPack(1, 0);
      host.appendChild(free);

      // Pack cards (one per tier in this tab).
      tab.tiers.forEach((tierNum) => {
        const meta = getStickerPackTier(tierNum);
        const amount = meta.min === meta.max ? String(meta.min) : (meta.min + "–" + meta.max);
        const roman = SHOP_PACK_ROMAN[tierNum] || tierNum;
        const price = meta.gem;
        const card = document.createElement("div");
        card.className = "shop-card shop-pack-card";
        card.innerHTML =
          '<div class="shop-pack-name">Pack ' + roman + '</div>'
          + '<div class="shop-pack-art shop-pack-icon sticker-pack-tier--' + tierNum + '"><span class="bp-pack-band"></span><span class="bp-pack-star">' + meta.star + '</span></div>'
          + '<div class="shop-pack-amount">' + amount + ' stickers</div>'
          + '<button type="button" class="shop-card-btn shop-card-btn--buy"><span class="shop-gem">💎</span> ' + price + '</button>';
        card.querySelector(".shop-card-btn").onclick = () => this._shopBuyPack(tierNum, price);
        host.appendChild(card);
      });
    }

    // Buy + open a sticker pack of the given tier. Deducts gems (if affordable),
    // switches to the Stickers room and plays the existing pack-opening animation;
    // collected stickers land in the tray.
    _shopBuyPack(tier, price) {
      const gems = Math.max(0, parseInt(this._save.gemsTotal, 10) || 0);
      if (price > 0 && gems < price) { this._shopToast("Not enough gems"); return; }
      if (price > 0) {
        this._save.gemsTotal = gems - price;
        saveSave(this._save);
      }
      const meta = getStickerPackTier(tier);
      if (this.collectionUI && typeof this.collectionUI.showAlbum === "function") {
        this.collectionUI.showAlbum();
        setTimeout(() => {
          if (typeof this.collectionUI._choosePack === "function") {
            this.collectionUI._choosePack(meta, {});
          }
        }, 70);
      }
    }

    _shopUpdate() {
      this._renderShopGrid();
      this._shopToast("Shop refreshed!");
    }

    _shopToast(msg) {
      let t = document.getElementById("shop-toast");
      if (!t) {
        t = document.createElement("div");
        t.id = "shop-toast";
        t.className = "shop-toast";
        const inner = document.querySelector("#shop-screen .shop-inner") || document.getElementById("shop-screen");
        if (inner) inner.appendChild(t);
      }
      t.textContent = msg;
      t.classList.add("shop-toast--show");
      clearTimeout(this._shopToastTimer);
      this._shopToastTimer = setTimeout(() => t.classList.remove("shop-toast--show"), 1400);
    }

    _updatePuzzleEnergyUI() {
      const val = this._save.puzzleEnergy || 0;
      const elGame = document.getElementById("energy-count-game");
      if (elGame) elGame.textContent = val;
      const elStart = document.getElementById("energy-count-start");
      if (elStart) elStart.textContent = val;
    }

    _showEnergyRefillPopup() {
      const modal = document.getElementById("energy-refill-modal");
      if (modal) modal.classList.remove("hidden");
    }

    _hideEnergyRefillPopup() {
      const modal = document.getElementById("energy-refill-modal");
      if (modal) modal.classList.add("hidden");
    }

    _refillEnergy() {
      this._addPuzzleEnergy(20);
      this._hideEnergyRefillPopup();
    }

    completeLevel(opts) {
      opts = opts || {};
      const winModal = document.getElementById("win-modal");
      if (!winModal.classList.contains("hidden")) return;
      this.pieceTray.cancelDrag();
      const cheated = opts.cheated === true;
      const timeSec = cheated ? 0 : Math.round((Date.now() - this.startTime) / 1000);
      const mistakes = cheated ? 0 : this.mistakes;

      if (this._playingBonusLevel) {
        this._playingBonusLevel = false;
        const gameArea = document.querySelector(".game-area");
        if (gameArea) gameArea.classList.remove("game-area--bonus");
        const bonusLevel = this.levelManager.getBonusLevel();
        const total = bonusLevel ? bonusLevel.pieceCount : 12;
        const stars = cheated ? 3 : (timeSec <= total * 5 && mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
        this._save.bonusLevelCompleted = true;
        this._save.bonusLevelTimesPlayed = (this._save.bonusLevelTimesPlayed || 0) + 1;
        this._save.coins = (this._save.coins || 0) + 100;
        if (!this._save.rewards) this._save.rewards = { trophies: 0, unlockedRewards: [], trophiesGoldCup: false };
        this._save.rewards.trophiesGoldCup = true;
        if (this._save.rewards.unlockedRewards.indexOf("goldCup") < 0) {
          this._save.rewards.unlockedRewards = this._save.rewards.unlockedRewards || [];
          this._save.rewards.unlockedRewards.push("goldCup");
        }
        saveSave(this._save);
        this.ui.setLevelNumber(this.currentLevelIndex);
        if (document.getElementById("toggle-sfx").getAttribute("aria-checked") === "true") {
          AudioPlayer.win();
        }
        this.ui.showWinModal(
          stars,
          timeSec,
          mistakes,
          () => {
            this.ui.hideWinModal();
            this.ui.showScreen("start-screen");
            this._showToastBonusCompleted();
            this.collectionUI.updateGlobalCardsProgress();
          },
          () => this.replayBonusLevel()
        );
        this._updateCheatAutoButton();
        return;
      }

      const stars = cheated ? 3 : this._computeStars(timeSec, this.mistakes);
      if (!cheated && this.currentLevelIndex === 0) {
        this._syncDailyTasksData();
        this._save.dailyTasksProgress.level1Complete = 1;
      }

      this.collectionManager.onLevelCompleted(this.currentLevelIndex, { cheated });
      this.addHammers(1);
      // Reward: 1 sticker pack per core-level completion — randomly Grade 2 or
      // Grade 3 (50/50). Added as a pending pack (same mechanism as the Wheel of
      // Fortune), so it persists and opens later in the Stickers tab. This
      // matches the existing per-completion reward policy (hammers above).
      const packTier = Math.random() < 0.5 ? 2 : 3;
      this.collectionManager.addPendingStickerPack(packTier);
      if (this.collectionUI && typeof this.collectionUI.refreshStickerLevelIfOpen === "function") {
        this.collectionUI.refreshStickerLevelIfOpen();
      }
      this.collectionUI.updateCollectionButtons();

      if (document.getElementById("toggle-sfx").getAttribute("aria-checked") === "true") {
        AudioPlayer.win();
      }
      this.ui.showWinModal(
        stars,
        timeSec,
        mistakes,
        () => this._onNextLevelClick(),
        () => this.replayLevel(),
        packTier
      );
      this._updateCheatAutoButton();
    }

    _onNextLevelClick() {
      this.nextLevel();
    }

    handlePuzzleComplete() {
      this.completeLevel({ cheated: false });
    }

    skipLevelCheat() {
      const gameScreen = document.getElementById("game-screen");
      const winModal = document.getElementById("win-modal");
      const settingsModal = document.getElementById("settings-modal");
      const activeTag = document.activeElement ? document.activeElement.tagName : "";
      if (!gameScreen.classList.contains("active")) return;
      if (!winModal.classList.contains("hidden")) return;
      if (!settingsModal.classList.contains("hidden")) return;
      if (["INPUT", "TEXTAREA", "SELECT"].indexOf(activeTag) >= 0) return;
      this.pieceTray.cancelDrag();
      this.completeLevel({ cheated: true });
    }

    _computeStars(timeSec, mistakes) {
      const level = this.levelManager.getLevel(this.currentLevelIndex);
      const total = level ? level.pieceCount : 10;
      const fastTime = timeSec <= total * 5;
      const okTime = timeSec <= total * 10;
      const fewMistakes = mistakes <= 2;
      const noMistakes = mistakes === 0;
      if (noMistakes && fastTime) return 3;
      if (fewMistakes && (fastTime || okTime)) return 2;
      return 1;
    }

    nextLevel() {
      this.ui.hideWinModal();
      this._updateCheatAutoButton();
      const next = this.currentLevelIndex + 1;
      if (next >= this.levelManager.getTotalLevels()) {
        this.currentLevelIndex = 0;
        this.loadLevel(0);
      } else {
        this.currentLevelIndex = next;
        this.loadLevel(next);
      }
    }

    replayLevel() {
      this.ui.hideWinModal();
      this._updateCheatAutoButton();
      this.loadLevel(this.currentLevelIndex);
    }

    _bindGlobalButtons() {
      document.getElementById("btn-play").onclick = () => this.startGame();
      document.getElementById("btn-back").onclick = () => {
        if (this._playingBonusLevel) {
          this._playingBonusLevel = false;
          const gameArea = document.querySelector(".game-area");
          if (gameArea) gameArea.classList.remove("game-area--bonus");
          this.ui.setLevelNumber(this.currentLevelIndex);
        }
        if (this._externalLevelActive) this._stopExternalPlayableLevel();
        this.ui.showScreen("start-screen");
      };
      document.getElementById("btn-close-settings").onclick = () => {
        this.ui.hideSettingsModal();
        this._saveState();
      };
      const btnEditProfile = document.getElementById("btn-edit-profile");
      if (btnEditProfile) btnEditProfile.onclick = () => { this.ui.hideSettingsModal(); this.openProfileModal(true); };
      document.getElementById("toggle-music").onclick = () => this._toggle("toggle-music");
      document.getElementById("toggle-sfx").onclick = () => this._toggle("toggle-sfx");
      document.getElementById("btn-reset-progress").onclick = () => this.resetProgress();
      document.getElementById("btn-cheat-open-all-albums").onclick = () => this.cheatOpenAllAlbums();
      document.getElementById("btn-cheat-add-album-stars").onclick = () => this.cheatAddAlbumStars();
      document.getElementById("btn-cheat-add-hammers").onclick = () => this.cheatAddEventHammers();

      const navHome = document.getElementById("nav-home");
      if (navHome) {
        navHome.onclick = () => {
          if (this._externalLevelActive) this._stopExternalPlayableLevel();
          this.ui.showScreen("start-screen");
        };
      }
      const navGame = document.getElementById("nav-game");
      if (navGame) navGame.onclick = () => this.openGalleryScreen();
      const navSettings = document.getElementById("nav-settings");
      if (navSettings) {
        navSettings.onclick = () => {
          if (this._externalLevelActive) this._stopExternalPlayableLevel();
          this.rubyCaveManager.open();
        };
      }
      const navDailyTasks = document.getElementById("nav-daily-tasks");
      if (navDailyTasks) navDailyTasks.onclick = () => this.openDailyTasksScreen();
      const homeDailyTasks = document.getElementById("btn-home-daily-tasks");
      if (homeDailyTasks) {
        const openDailyFromHome = (e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          this.openDailyTasksScreen();
          return false;
        };
        homeDailyTasks.onclick = openDailyFromHome;
        homeDailyTasks.onpointerup = openDailyFromHome;
        homeDailyTasks.ontouchend = openDailyFromHome;
      }
      if (!this._homeDailyTasksCaptureBound) {
        this._homeDailyTasksCaptureBound = true;
        document.addEventListener("click", (e) => {
          const btn = e.target && e.target.closest ? e.target.closest("#btn-home-daily-tasks") : null;
          if (!btn) return;
          e.preventDefault();
          e.stopPropagation();
          this.openDailyTasksScreen();
        }, true);
      }
      const homeEventBtn = document.getElementById("btn-home-event");
      if (homeEventBtn) homeEventBtn.onclick = () => this.rubyCaveManager.open();
      const btnHomeSettings = document.getElementById("btn-home-settings");
      if (btnHomeSettings) btnHomeSettings.onclick = () => this.openSettings();
      const leaderboardBtn = document.getElementById("curs_add_leaderboard_from_trophy_button");
      if (leaderboardBtn) leaderboardBtn.onclick = () => this.onLeaderboardTrophyClick();
      const openCollection = () => {
        if (this._externalLevelActive) this._stopExternalPlayableLevel();
        this.collectionUI.showAlbum();
      };
      const navCollection = document.getElementById("nav-collection");
      if (navCollection) navCollection.onclick = openCollection;
      const navShop = document.getElementById("nav-shop");
      if (navShop) navShop.onclick = () => this.openShopScreen();

      const openBattlePass = () => {
        this.openBattlePassScreen();
      };
      const navBattlePass = document.getElementById("nav-battle-pass");
      if (navBattlePass) navBattlePass.onclick = openBattlePass;
      const bpWidget = document.getElementById("btn-battle-pass-widget");
      if (bpWidget) bpWidget.onclick = openBattlePass;
      const bpWidgetGame = document.getElementById("btn-battle-pass-widget-game");
      if (bpWidgetGame) bpWidgetGame.onclick = openBattlePass;

      const openWheel = () => {
        this.openWheelScreen();
      };
      const btnWheel = document.getElementById("btn-wheel-widget");
      if (btnWheel) btnWheel.onclick = openWheel;

      const openRaceEvent = () => {
        this.openRaceEventScreen();
      };
      const btnRaceWidget = document.getElementById("btn-race-event-widget");
      if (btnRaceWidget) btnRaceWidget.onclick = openRaceEvent;
      const openLostTemple = () => this.onLostTempleClick();
      const btnLostTempleWidget = document.getElementById("btn-lost-temple-widget");
      if (btnLostTempleWidget) btnLostTempleWidget.onclick = openLostTemple;

      const navRubyCave = document.getElementById("nav-ruby-cave");
      if (navRubyCave) navRubyCave.onclick = () => this.rubyCaveManager.open();

      const giftBtn = document.getElementById("cards-progress-gift");
      if (giftBtn) giftBtn.onclick = (e) => { e.preventDefault(); this.onGiftClicked(); };

      const btnProfileStart = document.getElementById("btn-profile-widget-start");
      if (btnProfileStart) btnProfileStart.onclick = () => this.openProfileModal(true);
      const piggyWidgetStart = document.getElementById("piggy-widget-start");
      if (piggyWidgetStart) piggyWidgetStart.onclick = () => { if (!this._save.piggyBroken) this.openPiggyModal(); };

      const btnProfileGame = document.getElementById("btn-profile-widget-game");
      if (btnProfileGame) btnProfileGame.onclick = () => this.openProfileModal(true);
      const piggyWidget = document.getElementById("piggy-widget");
      if (piggyWidget) piggyWidget.onclick = () => { if (!this._save.piggyBroken) this.openPiggyModal(); };
      const piggyModalClose = document.getElementById("piggy-modal-close");
      if (piggyModalClose) piggyModalClose.onclick = () => this.closePiggyModal();
      const piggyPurchase = document.getElementById("piggy-btn-purchase");
      if (piggyPurchase) piggyPurchase.onclick = () => { if (this._save.piggyGemsStored >= (this._save.piggyCap || PIGGY_CAP_DEFAULT)) this._breakPiggyBank(); };
      const piggyLater = document.getElementById("piggy-btn-later");
      if (piggyLater) piggyLater.onclick = () => this.closePiggyModal();

      const btnBonusPlay = document.getElementById("btn-bonus-level-play");
      if (btnBonusPlay) btnBonusPlay.onclick = () => this._onBonusLevelPlayClick();
      const btnBonusClose = document.getElementById("btn-bonus-level-close");
      if (btnBonusClose) btnBonusClose.onclick = () => this.closeBonusLevelModal();
      const bonusModal = document.getElementById("bonus-level-modal");
      if (bonusModal) bonusModal.onclick = (e) => { if (e.target === bonusModal) this.closeBonusLevelModal(); };

      const autoBtn = document.getElementById("btn-cheat-auto");
      if (autoBtn) autoBtn.onclick = () => this.cheatPlaceOnePiece();

      document.addEventListener("keydown", (e) => {
        if (e.key !== "N" || !e.shiftKey) return;
        const gameScreen = document.getElementById("game-screen");
        const winModal = document.getElementById("win-modal");
        const activeTag = document.activeElement ? document.activeElement.tagName : "";
        if (!gameScreen.classList.contains("active")) return;
        if (!winModal.classList.contains("hidden")) return;
        if (["INPUT", "TEXTAREA", "SELECT"].indexOf(activeTag) >= 0) return;
        e.preventDefault();
        this.skipLevelCheat();
      });

      document.getElementById("coins-display").addEventListener("pointerdown", () => {});

      const skipBtn = document.getElementById("btn-skip-level");
      let longPressTimer = null;
      let longPressHandled = false;
      skipBtn.addEventListener("pointerdown", (e) => {
        longPressHandled = false;
        longPressTimer = setTimeout(() => {
          longPressHandled = true;
          const autoBtn = document.getElementById("btn-cheat-auto");
          if (autoBtn) autoBtn.classList.remove("hidden");
        }, LONG_PRESS_MS);
      });
      skipBtn.addEventListener("pointerup", () => {
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = null;
        if (!longPressHandled) this.skipLevelCheat();
      });
      skipBtn.addEventListener("pointercancel", () => {
        if (longPressTimer) clearTimeout(longPressTimer);
        longPressTimer = null;
      });
      skipBtn.addEventListener("click", (e) => e.preventDefault());

      // TODO: Replace with real ad SDK callback when ads are integrated
      const btnRefillAd = document.getElementById("btn-energy-refill-ad");
      if (btnRefillAd) btnRefillAd.onclick = () => this._refillEnergy();

      // TODO: Replace with real gem-spending logic when purchase flow is ready
      const btnRefillGems = document.getElementById("btn-energy-refill-gems");
      if (btnRefillGems) btnRefillGems.onclick = () => this._refillEnergy();

      const btnRefillClose = document.getElementById("btn-energy-refill-close");
      if (btnRefillClose) btnRefillClose.onclick = () => this._hideEnergyRefillPopup();

      const refillModal = document.getElementById("energy-refill-modal");
      if (refillModal) refillModal.onclick = (e) => { if (e.target === refillModal) this._hideEnergyRefillPopup(); };
    }

    _toggle(id) {
      const btn = document.getElementById(id);
      const current = btn.getAttribute("aria-checked") === "true";
      btn.setAttribute("aria-checked", !current);
      this._saveState();
    }

    openSettings() {
      this.ui.showSettingsModal();
      const trophies = (this.collectionManager.getState().rewards && this.collectionManager.getState().rewards.trophies) || 0;
      const el = document.getElementById("settings-trophies-count");
      if (el) el.textContent = trophies;
    }

    updateBattlePassWidget() {
      const bpStarsTotal = Math.max(0, parseInt(this._save.bpStarsTotal, 10) || 0);
      const towardNext = bpStarsTotal % BP_STARS_PER_CARD;
      const progressText = towardNext + "/" + BP_STARS_PER_CARD;
      const fillPct = (towardNext / BP_STARS_PER_CARD) * 100;
      const widgetHome = document.getElementById("battle-pass-widget");
      const widgetGame = document.getElementById("battle-pass-widget-game");
      if (widgetHome) widgetHome.classList.remove("hidden");
      const countHome = document.getElementById("battle-pass-widget-count");
      if (countHome) countHome.textContent = progressText;
      const fillHome = document.getElementById("battle-pass-widget-fill");
      if (fillHome) fillHome.style.width = fillPct + "%";
      const progressHome = widgetHome ? widgetHome.querySelector(".battle-pass-widget-progress") : null;
      if (progressHome) progressHome.setAttribute("aria-valuenow", towardNext);
      if (widgetGame) widgetGame.classList.remove("hidden");
      const countGame = document.getElementById("battle-pass-widget-count-game");
      if (countGame) countGame.textContent = progressText;
      const fillGame = document.getElementById("battle-pass-widget-fill-game");
      if (fillGame) fillGame.style.width = fillPct + "%";
      const progressGame = widgetGame ? widgetGame.querySelector(".battle-pass-widget-progress") : null;
      if (progressGame) progressGame.setAttribute("aria-valuenow", towardNext);
      const navCount = document.getElementById("nav-battle-pass-count");
      if (navCount) navCount.textContent = progressText;
    }

    _showBattlePassUnlockPopup(onAfter) {
      const modal = document.getElementById("battle-pass-unlock-modal");
      if (!modal) {
        if (onAfter) onAfter();
        return;
      }
      modal.classList.remove("hidden");
      const go = () => {
        modal.classList.add("hidden");
        document.getElementById("btn-battle-pass-lets-go").onclick = null;
        modal.onclick = null;
        this.updateBattlePassWidget();
        if (!this._save.bpTutorCompleted) {
          this._save.bpTutorStep = 1;
          saveSave(this._save);
          if (onAfter) onAfter();
        } else {
          this.openBattlePassScreen();
          if (onAfter) onAfter();
        }
      };
      document.getElementById("btn-battle-pass-lets-go").onclick = go;
      modal.onclick = (e) => { if (e.target === modal) go(); };
    }

    _showRaceTutorialAndStart(onAfter) {
      const overlay = document.getElementById("raceEventTutorialOverlay");
      if (!overlay) {
        startRace(this._save);
        saveSave(this._save);
        this.updateRaceEventWidget();
        if (onAfter) onAfter();
        return;
      }
      overlay.classList.remove("hidden");
      const dismiss = () => {
        overlay.classList.add("hidden");
        this._save.raceTutorialCompleted = true;
        startRace(this._save);
        saveSave(this._save);
        this.updateRaceEventWidget();
        document.getElementById("btn-race-tutorial-ok").onclick = null;
        overlay.onclick = null;
        if (onAfter) onAfter();
      };
      document.getElementById("btn-race-tutorial-ok").onclick = dismiss;
      overlay.onclick = (e) => { if (e.target === overlay) dismiss(); };
    }

    _openPackOpeningFlow(tier, packStars, onComplete) {
      this.collectionManager._ensureCardsStructure();
      const modal = document.getElementById("pack-opening-modal");
      const packView = document.getElementById("pack-pack-view");
      const revealView = document.getElementById("pack-reveal-view");
      const packIcon = document.getElementById("pack-pack-icon");
      const revealList = document.getElementById("pack-reveal-list");
      const doneBtn = document.getElementById("pack-done-btn");
      if (!modal || !packView || !revealView || !packIcon || !revealList || !doneBtn) return;
      ensurePackMeta(this._save, tier);
      const meta = this._save.bpPremiumPackMeta[tier];
      const cardCount = meta && typeof meta.cardCount === "number" ? meta.cardCount : 2;
      packIcon.innerHTML = "";
      packIcon.className = "pack-pack-icon";
      const packIconEl = renderPackIcon({ cardCount, locked: false, dimmed: false, size: "large", claimable: true });
      packIcon.appendChild(packIconEl);
      packView.classList.remove("hidden");
      revealView.classList.add("hidden");
      revealList.innerHTML = "";
      modal.classList.remove("hidden");

      const self = this;
      const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";

      function onPackTap() {
        packView.onclick = null;
        packView.classList.add("pack-pack-view--bounce");
        const runOpen = () => {
          packView.classList.remove("pack-pack-view--bounce");
          const packResult = rollPack(packStars, self._save, cardCount);
        applyPackResults(self._save, packResult);
        if (!self._save.bpClaims.premiumClaimedTiers) self._save.bpClaims.premiumClaimedTiers = [];
        if (self._save.bpClaims.premiumClaimedTiers.indexOf(tier) < 0) self._save.bpClaims.premiumClaimedTiers.push(tier);
        saveSave(self._save);

        packResult.results.forEach((r) => {
          const item = document.createElement("div");
          item.className = "pack-reveal-item pack-reveal-item--r" + r.rarity;
          if (r.isDuplicate && (r.coinsAwarded || r.starsAwarded)) {
            const coinPart = r.coinsAwarded ? ("+<span class=\"pack-reveal-coins-num\">" + r.coinsAwarded + "</span> coins") : "";
            const starPart = r.starsAwarded ? (" +" + r.starsAwarded + " stars") : "";
            item.innerHTML = "<span class=\"pack-reveal-coins\">" + coinPart + starPart + "</span>";
          } else {
            const def = CARD_DEFS[r.cardId];
            const name = def ? def.name : "Sticker";
            const thumb = document.createElement("span");
            thumb.className = "pack-reveal-thumb pack-reveal-thumb--emoji";
            thumb.textContent = getStickerEmoji(r.cardId);
            thumb.setAttribute("aria-hidden", "true");
            item.appendChild(thumb);
            const label = document.createElement("span");
            label.className = "pack-reveal-name";
            label.textContent = name;
            item.appendChild(label);
          }
          revealList.appendChild(item);
        });

        packView.classList.add("hidden");
        revealView.classList.remove("hidden");
        self.ui.setCoins(self._save.coins);
        if (self.collectionUI && typeof self.collectionUI.updateAlbumStarsUI === "function") self.collectionUI.updateAlbumStarsUI();
        };
        setTimeout(runOpen, 280);
      }

      packView.onclick = onPackTap;

      function closeModal() {
        modal.classList.add("hidden");
        self.ui.setCoins(self._save.coins);
        doneBtn.onclick = null;
        if (onComplete) onComplete();
      }

      doneBtn.onclick = () => closeModal();
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          modal.onclick = null;
          doneBtn.onclick = null;
        }
      };
    }

    _openGrandPrizePackFlow(onComplete) {
      this.collectionManager._ensureCardsStructure();
      const modal = document.getElementById("pack-opening-modal");
      const packView = document.getElementById("pack-pack-view");
      const revealView = document.getElementById("pack-reveal-view");
      const packIcon = document.getElementById("pack-pack-icon");
      const revealList = document.getElementById("pack-reveal-list");
      const doneBtn = document.getElementById("pack-done-btn");
      if (!modal || !packView || !revealView || !packIcon || !revealList || !doneBtn) return;
      const cardCount = 5;
      const packStars = 3;
      packIcon.innerHTML = "";
      packIcon.className = "pack-pack-icon";
      const packIconEl = renderPackIcon({ cardCount, locked: false, dimmed: false, size: "large", claimable: true });
      packIcon.appendChild(packIconEl);
      packView.classList.remove("hidden");
      revealView.classList.add("hidden");
      revealList.innerHTML = "";
      modal.classList.remove("hidden");

      const self = this;
      const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";

      function onPackTap() {
        packView.onclick = null;
        packView.classList.add("pack-pack-view--bounce");
        const runOpen = () => {
          packView.classList.remove("pack-pack-view--bounce");
          const packResult = rollPack(packStars, self._save, cardCount);
          applyPackResults(self._save, packResult);
          if (!self._save.raceState) self._save.raceState = {};
          self._save.raceState.claimed = true;
          self._syncDailyTasksData();
          self._save.dailyTasksProgress.raceActions = Math.max(1, self._save.dailyTasksProgress.raceActions || 0);
          self.addHammers(5);
          saveSave(self._save);
          self._renderDailyTasksScreen();

          packResult.results.forEach((r) => {
            const item = document.createElement("div");
            item.className = "pack-reveal-item pack-reveal-item--r" + r.rarity;
            if (r.isDuplicate && (r.coinsAwarded || r.starsAwarded)) {
              const coinPart = r.coinsAwarded ? ("+<span class=\"pack-reveal-coins-num\">" + r.coinsAwarded + "</span> coins") : "";
              const starPart = r.starsAwarded ? (" +" + r.starsAwarded + " stars") : "";
              item.innerHTML = "<span class=\"pack-reveal-coins\">" + coinPart + starPart + "</span>";
            } else {
              const def = CARD_DEFS[r.cardId];
              const name = def ? def.name : "Sticker";
              const thumb = document.createElement("span");
              thumb.className = "pack-reveal-thumb pack-reveal-thumb--emoji";
              thumb.textContent = getStickerEmoji(r.cardId);
              thumb.setAttribute("aria-hidden", "true");
              item.appendChild(thumb);
              const label = document.createElement("span");
              label.className = "pack-reveal-name";
              label.textContent = name;
              item.appendChild(label);
            }
            revealList.appendChild(item);
          });

          packView.classList.add("hidden");
          revealView.classList.remove("hidden");
          self.ui.setCoins(self._save.coins);
          if (self.collectionUI && typeof self.collectionUI.updateAlbumStarsUI === "function") self.collectionUI.updateAlbumStarsUI();
        };
        setTimeout(runOpen, 280);
      }

      packView.onclick = onPackTap;

      function closeModal() {
        modal.classList.add("hidden");
        self.ui.setCoins(self._save.coins);
        doneBtn.onclick = null;
        self.updateRaceEventWidget();
        if (onComplete) onComplete();
      }

      doneBtn.onclick = () => closeModal();
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          modal.onclick = null;
          doneBtn.onclick = null;
          self.updateRaceEventWidget();
        }
      };
    }

    _openPackOpeningFlowGeneric(packStars, cardCount, onComplete) {
      this.collectionManager._ensureCardsStructure();
      const modal = document.getElementById("pack-opening-modal");
      const packView = document.getElementById("pack-pack-view");
      const revealView = document.getElementById("pack-reveal-view");
      const packIcon = document.getElementById("pack-pack-icon");
      const revealList = document.getElementById("pack-reveal-list");
      const doneBtn = document.getElementById("pack-done-btn");
      if (!modal || !packView || !revealView || !packIcon || !revealList || !doneBtn) return;
      packIcon.innerHTML = "";
      packIcon.className = "pack-pack-icon";
      const packIconEl = renderPackIcon({ cardCount, locked: false, dimmed: false, size: "large", claimable: true });
      packIcon.appendChild(packIconEl);
      packView.classList.remove("hidden");
      revealView.classList.add("hidden");
      revealList.innerHTML = "";
      modal.classList.remove("hidden");

      const self = this;
      const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";

      function onPackTap() {
        packView.onclick = null;
        packView.classList.add("pack-pack-view--bounce");
        const runOpen = () => {
          packView.classList.remove("pack-pack-view--bounce");
          const packResult = rollPack(packStars, self._save, cardCount);
          applyPackResults(self._save, packResult);
          saveSave(self._save);

          packResult.results.forEach((r) => {
            const item = document.createElement("div");
            item.className = "pack-reveal-item pack-reveal-item--r" + r.rarity;
            if (r.isDuplicate && (r.coinsAwarded || r.starsAwarded)) {
              const coinPart = r.coinsAwarded ? ("+<span class=\"pack-reveal-coins-num\">" + r.coinsAwarded + "</span> coins") : "";
              const starPart = r.starsAwarded ? (" +" + r.starsAwarded + " stars") : "";
              item.innerHTML = "<span class=\"pack-reveal-coins\">" + coinPart + starPart + "</span>";
            } else {
              const def = CARD_DEFS[r.cardId];
              const name = def ? def.name : "Sticker";
              const thumb = document.createElement("span");
              thumb.className = "pack-reveal-thumb pack-reveal-thumb--emoji";
              thumb.textContent = getStickerEmoji(r.cardId);
              thumb.setAttribute("aria-hidden", "true");
              item.appendChild(thumb);
              const label = document.createElement("span");
              label.className = "pack-reveal-name";
              label.textContent = name;
              item.appendChild(label);
            }
            revealList.appendChild(item);
          });

          packView.classList.add("hidden");
          revealView.classList.remove("hidden");
          self.ui.setCoins(self._save.coins);
          if (self.collectionUI && typeof self.collectionUI.updateAlbumStarsUI === "function") self.collectionUI.updateAlbumStarsUI();
        };
        setTimeout(runOpen, 280);
      }

      packView.onclick = onPackTap;

      function closeModal() {
        modal.classList.add("hidden");
        self.ui.setCoins(self._save.coins);
        doneBtn.onclick = null;
        if (onComplete) onComplete();
      }

      doneBtn.onclick = () => closeModal();
      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
          modal.onclick = null;
          doneBtn.onclick = null;
          if (onComplete) onComplete();
        }
      };
    }

    openBattlePassScreen() {
      if (this._save.bpTutorStep === 2) {
        this._save.bpTutorCompleted = true;
        this._save.bpTutorStep = 0;
        saveSave(this._save);
        this._clearBattlePassTutorial();
      }
      const screen = document.getElementById("battlePassScreen");
      if (!screen) return;
      const bpStarsTotal = Math.max(0, parseInt(this._save.bpStarsTotal, 10) || 0);
      const towardNext = bpStarsTotal % BP_STARS_PER_CARD;
      const currentTier = Math.floor(bpStarsTotal / BP_STARS_PER_CARD) + 1;
      const countEl = document.getElementById("battle-pass-modal-count");
      if (countEl) countEl.textContent = bpStarsTotal;
      const towardEl = document.getElementById("battle-pass-modal-toward");
      if (towardEl) towardEl.textContent = String(currentTier);
      const fillEl = document.getElementById("battle-pass-modal-fill");
      if (fillEl) fillEl.style.width = (towardNext / BP_STARS_PER_CARD) * 100 + "%";
      const listEl = document.getElementById("battle-pass-reward-list");
      const activateBtn = document.getElementById("btn-battle-pass-activate");
      const activatePriceEl = document.getElementById("bp-activate-price");
      const premiumActive = this._save.battlePassPremiumActive === true;
      const bpClaims = this._save.bpClaims || { freeClaimedTiers: [], premiumClaimedTiers: [] };
      const freeClaimed = bpClaims.freeClaimedTiers || [];
      const premiumClaimed = bpClaims.premiumClaimedTiers || [];

      if (activateBtn) {
        activateBtn.disabled = premiumActive;
        activateBtn.textContent = premiumActive ? "Activated" : "Activate";
        activateBtn.onclick = premiumActive ? null : () => {
          this._save.battlePassPremiumActive = true;
          saveSave(this._save);
          activateBtn.disabled = true;
          activateBtn.textContent = "Activated";
          if (activatePriceEl) activatePriceEl.textContent = "Owned";
          renderList();
        };
      }

      const self = this;
      function renderList() {
        if (!listEl) return;
        const stars = Math.max(0, parseInt(self._save.bpStarsTotal, 10) || 0);
        const claims = self._save.bpClaims || { freeClaimedTiers: [], premiumClaimedTiers: [] };
        const fClaimed = claims.freeClaimedTiers || [];
        const pClaimed = claims.premiumClaimedTiers || [];
        const premiumOn = self._save.battlePassPremiumActive === true;
        const tiersCount = 10;
        const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";
        const allCardIds = ALBUM_DEFS.reduce((acc, a) => acc.concat(a.cardIds || []), []);
        const cards = self._save.cards || {};
        const inbox = cards.newInbox || [];
        const uncollected = allCardIds.filter((id) => !cards.collected[id] && inbox.indexOf(id) < 0);
        const premiumAwardedCount = pClaimed.length;

        for (let ti = 1; ti <= tiersCount; ti++) ensurePackMeta(self._save, ti);
        saveSave(self._save);

        listEl.innerHTML = "";
        const rowsContainer = document.createElement("div");
        rowsContainer.className = "bp-track-list";

        for (let t = 1; t <= tiersCount; t++) {
          const requiredStars = t * BP_STARS_PER_CARD;
          const tierUnlocked = stars >= requiredStars;
          const freeClaimedT = fClaimed.indexOf(t) >= 0;
          const premiumClaimedT = pClaimed.indexOf(t) >= 0;
          const isCurrent = t === (Math.floor(stars / BP_STARS_PER_CARD) + 1);
          const premiumLocked = !premiumOn || !tierUnlocked;
          const premiumClaimable = premiumOn && tierUnlocked && !premiumClaimedT;
          const freeClaimable = tierUnlocked && !freeClaimedT;

          const row = document.createElement("div");
          row.className = "bp-tier-row" + (isCurrent ? " bp-tier-row--current" : "");

          const freeCard = document.createElement("div");
          freeCard.className = "bp-tier-card bp-tier-card--free"
            + (!tierUnlocked ? " bp-tier-card--locked" : "")
            + (freeClaimedT ? " bp-tier-card--claimed" : "")
            + (freeClaimable ? " bp-tier-card--claimable" : "");
          const freeRw = BP_REWARDS.free[t - 1];
          const freeReward = document.createElement("div");
          freeReward.className = "bp-tier-reward";
          freeReward.innerHTML = bpRewardHTML(freeRw);
          freeCard.appendChild(freeReward);

          if (freeClaimable) {
            const claimBtn = document.createElement("button");
            claimBtn.type = "button";
            claimBtn.className = "bp-claim-btn";
            claimBtn.textContent = "Claim";
            claimBtn.onclick = (e) => {
              e.stopPropagation();
              if (!freeClaimable) return;
              self._save.xpTotal = (self._save.xpTotal || 0) + BP_XP_PER_TIER;
              if (!self._save.bpClaims.freeClaimedTiers) self._save.bpClaims.freeClaimedTiers = [];
              if (self._save.bpClaims.freeClaimedTiers.indexOf(t) < 0) self._save.bpClaims.freeClaimedTiers.push(t);
              self._grantBpReward(freeRw);
              saveSave(self._save);
              self.collectionUI.updateCollectionButtons();
              renderList();
            };
            freeCard.appendChild(claimBtn);
          }

          if (freeClaimedT || (!tierUnlocked && !freeClaimable)) {
            const block = document.createElement("div");
            block.className = "bp-tier-block";
            block.textContent = freeClaimedT ? "✓" : "";
            freeCard.appendChild(block);
          }

          row.appendChild(freeCard);

          const center = document.createElement("div");
          center.className = "bp-tier-center";
          const point = document.createElement("div");
          point.className = "bp-tier-point" + (tierUnlocked ? " bp-tier-point--unlocked" : "") + (isCurrent ? " bp-tier-point--current" : "");
          point.textContent = String(t);
          center.appendChild(point);
          row.appendChild(center);

          const premiumCard = document.createElement("div");
          premiumCard.className = "bp-tier-card bp-tier-card--premium"
            + (premiumLocked ? " bp-tier-card--locked" : "")
            + (premiumClaimedT ? " bp-tier-card--claimed" : "")
            + (premiumClaimable ? " bp-tier-card--claimable" : "");
          const premiumRw = BP_REWARDS.premium[t - 1];
          const premiumReward = document.createElement("div");
          premiumReward.className = "bp-tier-reward";
          premiumReward.innerHTML = bpRewardHTML(premiumRw);
          premiumCard.appendChild(premiumReward);

          if (premiumClaimable) {
            const claimBtn = document.createElement("button");
            claimBtn.type = "button";
            claimBtn.className = "bp-claim-btn";
            claimBtn.textContent = "Claim";
            claimBtn.onclick = (e) => {
              e.stopPropagation();
              if (!premiumClaimable) return;
              if (!self._save.bpClaims.premiumClaimedTiers) self._save.bpClaims.premiumClaimedTiers = [];
              if (self._save.bpClaims.premiumClaimedTiers.indexOf(t) < 0) self._save.bpClaims.premiumClaimedTiers.push(t);
              self._grantBpReward(premiumRw);
              saveSave(self._save);
              self.collectionUI.updateCollectionButtons();
              self.collectionUI.updateGlobalCardsProgress();
              renderList();
            };
            premiumCard.appendChild(claimBtn);
          }

          if (premiumClaimedT || premiumLocked) {
            const block = document.createElement("div");
            block.className = "bp-tier-block";
            block.textContent = premiumClaimedT ? "✓" : "🔒";
            premiumCard.appendChild(block);
          }

          row.appendChild(premiumCard);

          rowsContainer.appendChild(row);
        }
        listEl.appendChild(rowsContainer);
      }
      renderList();
      const bpTimerEl = document.getElementById("battle-pass-event-timer");
      if (bpTimerEl) {
        const tick = () => {
          const ms = getRemainingMs(this._save, "battlePassEvent");
          bpTimerEl.textContent = ms > 0 ? "Ends in: " + formatRemaining(ms) : "Ended";
        };
        tick();
        if (this._bpEventTimerId) clearInterval(this._bpEventTimerId);
        this._bpEventTimerId = setInterval(tick, 1000);
      }
      screen.classList.remove("hidden");
      document.documentElement.classList.add("bp-screen-active");
      document.body.classList.add("bp-screen-active");
      const infoOverlay = document.getElementById("battlePassInfoOverlay");
      const closeInfo = () => {
        if (infoOverlay) infoOverlay.classList.add("hidden");
        if (infoOverlay) infoOverlay.onclick = null;
        const continueBtn = document.getElementById("btn-bp-info-continue");
        if (continueBtn) continueBtn.onclick = null;
      };
      const close = () => {
        screen.classList.add("hidden");
        closeInfo();
        if (this._bpEventTimerId) {
          clearInterval(this._bpEventTimerId);
          this._bpEventTimerId = null;
        }
        if (this._bpEscapeHandler) {
          window.removeEventListener("keydown", this._bpEscapeHandler);
          this._bpEscapeHandler = null;
        }
        document.documentElement.classList.remove("bp-screen-active");
        document.body.classList.remove("bp-screen-active");
        document.getElementById("btn-battle-pass-close").onclick = null;
        document.getElementById("btn-battle-pass-info").onclick = null;
      };
      if (this._bpEscapeHandler) {
        window.removeEventListener("keydown", this._bpEscapeHandler);
      }
      this._bpEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const info = document.getElementById("battlePassInfoOverlay");
        if (info && !info.classList.contains("hidden")) {
          closeInfo();
          e.preventDefault();
          return;
        }
        e.preventDefault();
        close();
      };
      window.addEventListener("keydown", this._bpEscapeHandler);
      document.getElementById("btn-battle-pass-close").onclick = close;
      const infoBtn = document.getElementById("btn-battle-pass-info");
      if (infoBtn) {
        infoBtn.onclick = () => {
          if (infoOverlay) {
            infoOverlay.classList.remove("hidden");
            infoOverlay.onclick = (e) => { if (e.target === infoOverlay) closeInfo(); };
            const continueBtn = document.getElementById("btn-bp-info-continue");
            if (continueBtn) continueBtn.onclick = closeInfo;
          }
        };
      }
    }

    updateWheelWidget() {
      const now = Date.now();
      const nextFree = Math.max(0, parseInt(this._save.wheelNextFreeAt, 10) || 0);
      const freeAvailable = now >= nextFree;
      const widget = document.getElementById("wheel-widget");
      if (widget) widget.classList.remove("hidden");
      const badge = document.getElementById("wheel-badge");
      if (badge) badge.classList.toggle("hidden", !freeAvailable);
    }

    updateRaceEventWidget() {
      const active = isRaceActive(this._save);
      const claimable = isRaceClaimable(this._save);
      const showBadge = active || claimable;
      const widget = document.getElementById("race-event-widget");
      if (widget) widget.classList.remove("hidden");
      const badge = document.getElementById("race-event-badge");
      if (badge) badge.classList.toggle("hidden", !showBadge);
    }

    _renderRaceTrack() {
      syncRaceBotPoints(this._save);
      const rs = getRaceState(this._save);
      const playerPoints = rs.playerPoints;
      const botPoints = rs.botPoints.slice();
      const lanesEl = document.getElementById("race-track-lanes");
      if (!lanesEl) return;
      const lanes = lanesEl.querySelectorAll(".race-lane");
      for (let i = 0; i < lanes.length; i++) lanes[i].innerHTML = "";
      const order = [0, 1, "player", 3, 4];
      const pointsFor = (idx) => {
        if (idx === "player") return playerPoints;
        return botPoints[idx] || 0;
      };
      for (let i = 0; i < order.length; i++) {
        const lane = lanes[i];
        if (!lane) continue;
        const key = order[i];
        const points = pointsFor(key);
        const lanePct = Math.min(100, (points / RACE_TARGET_POINTS) * 100);
        const pct = 4 + (lanePct * 0.88);
        const racer = document.createElement("div");
        racer.className = "race-racer " + (key === "player" ? "race-racer--player" : "race-racer--bot");
        racer.style.bottom = pct + "%";
        const kartImg = document.createElement("img");
        kartImg.className = "race-racer-kart";
        kartImg.src = RACE_LANE_CAR_SRCS[i] || RACE_LANE_CAR_SRCS[2];
        kartImg.alt = "";
        kartImg.setAttribute("aria-hidden", "true");
        const bubble = document.createElement("span");
        bubble.className = "race-racer-points";
        bubble.textContent = points;
        racer.appendChild(bubble);
        racer.appendChild(kartImg);
        lane.appendChild(racer);
      }
      const pointPills = document.querySelectorAll("#raceEventScreen .race-point-pill");
      for (let i = 0; i < pointPills.length; i++) {
        const key = order[i];
        pointPills[i].textContent = String(pointsFor(key));
      }
      const yourPointsEl = document.getElementById("race-your-points-num");
      if (yourPointsEl) yourPointsEl.textContent = playerPoints;
    }

    openRaceEventScreen() {
      const screen = document.getElementById("raceEventScreen");
      if (!screen) return;
      const htmlEl = document.documentElement;
      const bodyEl = document.body;
      const rs = getRaceState(this._save);
      if (this._save.raceUnlocked && !rs.active && !rs.winner) {
        startRace(this._save);
        saveSave(this._save);
        this.updateRaceEventWidget();
      }
      const currentState = getRaceState(this._save);
      const raceStateLabel = !this._save.raceUnlocked
        ? "locked"
        : currentState.winner
          ? (currentState.winner === "player" && !currentState.claimed ? "reward" : "completed")
          : (currentState.active ? "active" : "idle");
      screen.dataset.raceState = raceStateLabel;
      this._renderRaceTrack();
      const profile = this._save.playerProfile;
      const playerName = (profile && profile.name && String(profile.name).trim()) ? String(profile.name).trim() : "You";
      const playerAvatarId = (profile && typeof profile.avatarId === "number") ? Math.max(0, Math.min(AVATAR_COUNT - 1, profile.avatarId)) : 0;
      const playerAccessoryId = (profile && profile.accessoryId) ? String(profile.accessoryId) : "none";
      const playerPanel = screen.querySelector(".race-racer-panel--player");
      if (playerPanel) {
        const nameEl = playerPanel.querySelector(".race-racer-name");
        if (nameEl) nameEl.textContent = playerName;
        const imgEl = playerPanel.querySelector(".race-racer-avatar-img");
        const svgEl = playerPanel.querySelector(".race-racer-avatar-svg");
        const avatarHtml = renderPlayerAvatar({ avatarId: playerAvatarId, accessoryId: playerAccessoryId, size: "medium" });
        if (svgEl) {
          svgEl.innerHTML = avatarHtml;
        } else if (imgEl) {
          const wrap = document.createElement("div");
          wrap.className = "race-racer-avatar-svg";
          wrap.innerHTML = avatarHtml;
          imgEl.parentNode.replaceChild(wrap, imgEl);
        }
      }
      const opponentNames = Array.isArray(this._save.raceBotNames) && this._save.raceBotNames.length >= 4
        ? this._save.raceBotNames
        : RACE_BOT_NAMES;
      const opponentNameIds = [
        "race-racer-name-0",
        "race-racer-name-1",
        "race-racer-name-3",
        "race-racer-name-4",
      ];
      for (let i = 0; i < opponentNameIds.length; i++) {
        const nameEl = document.getElementById(opponentNameIds[i]);
        if (!nameEl) continue;
        const botName = String(opponentNames[i] || RACE_BOT_NAMES[i] || "Rival").trim();
        nameEl.textContent = botName || "Rival";
      }
      const rewardState = this._save.raceRewards || {};
      const rewardCoinsEl = document.getElementById("race-reward-coins");
      const rewardGemsEl = document.getElementById("race-reward-gems");
      const rewardBoostEl = document.getElementById("race-reward-boost");
      if (rewardCoinsEl) rewardCoinsEl.textContent = String(Math.max(0, parseInt(rewardState.coins, 10) || 300));
      if (rewardGemsEl) rewardGemsEl.textContent = String(Math.max(0, parseInt(rewardState.gems, 10) || 150));
      if (rewardBoostEl) rewardBoostEl.textContent = String(Math.max(0, parseInt(rewardState.boost, 10) || 10));
      const winner = getRaceWinner(this._save);
      const timerEl = document.getElementById("race-event-timer");
      const updateTimer = () => {
        const state = getRaceState(this._save);
        if (state.winner) {
          if (timerEl) timerEl.textContent = "Finished";
          return;
        }
        if (!state.startTime) {
          if (timerEl) timerEl.textContent = formatRaceRemaining(RACE_EVENT_DURATION_MS);
          return;
        }
        const remaining = (state.startTime + RACE_EVENT_DURATION_MS) - Date.now();
        if (timerEl) timerEl.textContent = remaining <= 0 ? "Ended" : formatRaceRemaining(remaining);
      };
      const self = this;
      const close = () => {
        screen.classList.add("hidden");
        if (self._raceEventRefreshId) { clearInterval(self._raceEventRefreshId); self._raceEventRefreshId = null; }
        if (self._raceEventEscapeHandler) {
          window.removeEventListener("keydown", self._raceEventEscapeHandler);
          self._raceEventEscapeHandler = null;
        }
        htmlEl.classList.remove("race-screen-active");
        bodyEl.classList.remove("race-screen-active");
        document.getElementById("btn-race-event-close").onclick = null;
        document.getElementById("btn-race-continue").onclick = null;
        document.getElementById("btn-race-event-info").onclick = null;
        const infoOverlay = document.getElementById("raceEventInfoOverlay");
        if (infoOverlay) {
          infoOverlay.classList.add("hidden");
          infoOverlay.onclick = null;
        }
        const infoContinue = document.getElementById("btn-race-info-continue");
        if (infoContinue) infoContinue.onclick = null;
        const rp = document.getElementById("raceResultPopup");
        if (rp) rp.classList.add("hidden");
        delete screen.dataset.raceState;
      };
      document.getElementById("btn-race-event-close").onclick = close;
      document.getElementById("btn-race-continue").onclick = close;
      const infoBtn = document.getElementById("btn-race-event-info");
      if (infoBtn) {
        infoBtn.onclick = () => {
          const infoOverlay = document.getElementById("raceEventInfoOverlay");
          if (infoOverlay) {
            const closeInfo = () => infoOverlay.classList.add("hidden");
            infoOverlay.classList.remove("hidden");
            infoOverlay.onclick = (e) => { if (e.target === infoOverlay) closeInfo(); };
            const infoContinue = document.getElementById("btn-race-info-continue");
            if (infoContinue) infoContinue.onclick = closeInfo;
          }
        };
      }
      this._raceEventEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        const infoOverlay = document.getElementById("raceEventInfoOverlay");
        if (infoOverlay && !infoOverlay.classList.contains("hidden")) {
          infoOverlay.classList.add("hidden");
          e.preventDefault();
          return;
        }
        const rp = document.getElementById("raceResultPopup");
        if (rp && !rp.classList.contains("hidden")) {
          rp.classList.add("hidden");
          e.preventDefault();
          close();
          return;
        }
        e.preventDefault();
        close();
      };
      window.addEventListener("keydown", this._raceEventEscapeHandler);
      screen.classList.remove("hidden");
      htmlEl.classList.add("race-screen-active");
      bodyEl.classList.add("race-screen-active");
      const resultPopup = document.getElementById("raceResultPopup");
      const resultTitle = document.getElementById("race-result-title");
      const resultMessage = document.getElementById("race-result-message");
      const btnClaim = document.getElementById("btn-race-claim-prize");
      const btnResultClose = document.getElementById("btn-race-result-close");
      if (winner && resultPopup) {
        resultPopup.classList.remove("hidden");
        if (winner === "player") {
          if (resultTitle) resultTitle.textContent = "You Won!";
          const claimed = !!(this._save.raceState && this._save.raceState.claimed);
          if (resultMessage) resultMessage.textContent = claimed ? "You already claimed your prize!" : "Claim your Grand Prize";
          if (btnClaim) {
            if (claimed) btnClaim.classList.add("hidden");
            else {
              btnClaim.classList.remove("hidden");
              btnClaim.onclick = () => {
                resultPopup.classList.add("hidden");
                btnClaim.onclick = null;
                this._openGrandPrizePackFlow(() => close());
              };
            }
          }
        } else {
          if (resultTitle) resultTitle.textContent = "You Lost";
          if (resultMessage) resultMessage.textContent = "Better luck next time!";
          if (btnClaim) btnClaim.classList.add("hidden");
        }
        if (btnResultClose) btnResultClose.onclick = () => { resultPopup.classList.add("hidden"); close(); };
      }
      const refreshTrack = () => {
        this._renderRaceTrack();
        updateTimer();
      };
      if (this._raceEventRefreshId) clearInterval(this._raceEventRefreshId);
      this._raceEventRefreshId = setInterval(refreshTrack, 1000);
      updateTimer();
    }

    _showWheelUnlockTutorial(onAfter) {
      const overlay = document.getElementById("wheel-tutorial-overlay");
      if (!overlay) {
        if (onAfter) onAfter();
        return;
      }
      this._save.wheelTutorialSeen = true;
      saveSave(this._save);
      this.updateWheelWidget();
      overlay.classList.remove("hidden");
      const dismiss = () => {
        overlay.classList.add("hidden");
        document.getElementById("btn-wheel-tutorial-ok").onclick = null;
        overlay.onclick = null;
        this.openWheelScreen();
        if (onAfter) onAfter();
      };
      document.getElementById("btn-wheel-tutorial-ok").onclick = dismiss;
      overlay.onclick = (e) => { if (e.target === overlay) dismiss(); };
    }

    _showLeaderboardUnlockTutorial(onAfter) {
      const overlay = document.getElementById("leaderboard-tutorial-overlay");
      if (!overlay) {
        if (onAfter) onAfter();
        return;
      }
      this._leaderboardTutorCallback = onAfter;
      this._leaderboardTutorOverlayVisible = true;
      this.updateLeaderboardWidget();
      document.body.classList.add("leaderboard-tutor-active");
      overlay.classList.remove("hidden");
      const btnGotIt = document.getElementById("btn-leaderboard-tutorial-got-it");
      const dismiss = () => this._finishLeaderboardTutorial();
      if (btnGotIt) btnGotIt.onclick = dismiss;
      overlay.onclick = (e) => { if (e.target === overlay) dismiss(); };
    }

    _finishLeaderboardTutorial() {
      const overlay = document.getElementById("leaderboard-tutorial-overlay");
      if (overlay) overlay.classList.add("hidden");
      document.body.classList.remove("leaderboard-tutor-active");
      this._leaderboardTutorOverlayVisible = false;
      this._save.leaderboardTutorCompleted = true;
      saveSave(this._save);
      const btnGotIt = document.getElementById("btn-leaderboard-tutorial-got-it");
      if (btnGotIt) btnGotIt.onclick = null;
      const cb = this._leaderboardTutorCallback;
      this._leaderboardTutorCallback = null;
      if (cb) cb();
    }

    updateLeaderboardWidget() {
      const trophyBtn = document.getElementById("curs_add_leaderboard_from_trophy_button");
      if (trophyBtn) {
        trophyBtn.setAttribute("aria-label", "Leaderboard");
      }
    }

    updatePiggyWidget() {
      const piggyModal = document.getElementById("piggy-bank-modal");
      if (piggyModal && !piggyModal.classList.contains("hidden") && typeof PiggyBankScreen !== "undefined") {
        PiggyBankScreen.syncFromSave(this);
      }
      const widget = document.getElementById("piggy-widget");
      if (!widget) return;
      if (this._save.piggyBroken) {
        widget.classList.add("hidden");
        return;
      }
      widget.classList.remove("hidden");
      const stored = Math.min(this._save.piggyCap, this._save.piggyGemsStored || 0);
      const cap = this._save.piggyCap || PIGGY_CAP_DEFAULT;
      const isFull = stored >= cap;
      const countEl = document.getElementById("piggy-widget-count");
      if (countEl) countEl.textContent = stored + "/" + cap;
      const badgeEl = document.getElementById("piggy-full-badge");
      if (badgeEl) {
        badgeEl.classList.toggle("hidden", !isFull);
      }
      widget.classList.toggle("piggy-widget--full", isFull);
      const widgetStart = document.getElementById("piggy-widget-start");
      if (widgetStart) {
        if (this._save.piggyBroken) widgetStart.classList.add("hidden");
        else widgetStart.classList.remove("hidden");
        const countStart = document.getElementById("piggy-widget-count-start");
        if (countStart) countStart.textContent = stored + "/" + cap;
        const badgeStart = document.getElementById("piggy-full-badge-start");
        if (badgeStart) badgeStart.classList.toggle("hidden", !isFull);
        widgetStart.classList.toggle("piggy-widget--full", isFull);
      }
    }

    updateProfileWidget() {
      this._ensurePlayerProfile();
      const profile = this._save.playerProfile;
      const avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(profile.avatarId, 10) || 0));
      const accessoryId = (profile.accessoryId != null && profile.accessoryId !== "") ? String(profile.accessoryId) : "none";
      const html = renderPlayerAvatar({ avatarId, accessoryId, size: "small" });
      const elGame = document.getElementById("profile-widget-avatar-game");
      const elStart = document.getElementById("profile-widget-avatar-start");
      if (elGame) elGame.innerHTML = html;
      if (elStart) elStart.innerHTML = html;
    }

    openPiggyModal() {
      if (typeof PiggyBankScreen !== "undefined" && PiggyBankScreen.open) {
        PiggyBankScreen.open(this);
        return;
      }
      if (this._save.piggyBroken) return;
      const modal = document.getElementById("piggy-bank-modal");
      if (!modal) return;
      modal.classList.remove("hidden");
    }

    closePiggyModal() {
      if (typeof PiggyBankScreen !== "undefined" && PiggyBankScreen.close) {
        PiggyBankScreen.close();
        return;
      }
      const modal = document.getElementById("piggy-bank-modal");
      if (modal) modal.classList.add("hidden");
    }

    _breakPiggyBank() {
      if (this._save.piggyBroken) return;
      const amount = this._save.piggyGemsStored || 0;
      this._save.gemsTotal = (this._save.gemsTotal || 0) + amount;
      this._save.piggyGemsStored = 0;
      this._save.piggyBroken = true;
      this._syncDailyTasksData();
      this._save.dailyTasksProgress.piggyClaims = Math.max(1, this._save.dailyTasksProgress.piggyClaims || 0);
      saveSave(this._save);
      this._renderDailyTasksScreen();
      this.closePiggyModal();
      this.updatePiggyWidget();
      const popup = document.getElementById("piggy-reward-popup");
      const amountEl = document.getElementById("piggy-reward-amount");
      if (amountEl) amountEl.textContent = "+" + amount + " gems";
      if (popup) {
        popup.classList.remove("hidden");
        const closePopup = () => {
          popup.classList.add("hidden");
          document.getElementById("piggy-reward-close").onclick = null;
          popup.onclick = null;
        };
        document.getElementById("piggy-reward-close").onclick = closePopup;
        popup.onclick = (e) => { if (e.target === popup) closePopup(); };
      }
    }

    openWheelScreen() {
      const modal = document.getElementById("wheel-modal");
      if (!modal) return;
      modal.setAttribute("data-wheel-state", "loading");
      document.documentElement.classList.add("wheel-screen-active");
      document.body.classList.add("wheel-screen-active");
      const now = Date.now();
      const nextFree = Math.max(0, parseInt(this._save.wheelNextFreeAt, 10) || 0);
      const freeAvailable = now >= nextFree;
      const pool = this.collectionManager.getWheelSegmentPool();
      const rotatable = document.getElementById("wheel-rotatable");
      const segmentsEl = document.getElementById("wheel-segments");
      const stateFromCooldown = () => {
        const n = Math.max(0, parseInt(this._save.wheelNextFreeAt, 10) || 0);
        return Date.now() >= n ? "ready" : "disabled";
      };
      const setWheelState = (state) => modal.setAttribute("data-wheel-state", state);
      if (segmentsEl && pool.length === WHEEL_SEGMENTS) {
        segmentsEl.innerHTML = "";
        const segmentAngle = 360 / WHEEL_SEGMENTS;
        const mysteryCardSrc = CARD_IMAGE_BASE + "card_01.png";
        for (let i = 0; i < WHEEL_SEGMENTS; i++) {
          const item = pool[i];
          const seg = document.createElement("div");
          seg.className = "wheel-segment";
          seg.style.transform = "rotate(" + (i * segmentAngle) + "deg)";
          const inner = document.createElement("div");
          inner.className = "wheel-segment-inner";
          if (item.type === "stickerpack") {
            const packEl = document.createElement("div");
            packEl.className = "wheel-segment-stickerpack wheel-segment-stickerpack--tier-" + item.tier;
            packEl.innerHTML =
              '<span class="wheel-stickerpack-band"></span>' +
              '<span class="wheel-stickerpack-star">' + getStickerPackTier(item.tier).star + '</span>';
            packEl.title = stickerPackRewardLabel(item.tier);
            inner.appendChild(packEl);
          } else if (item.type === "gems") {
            const g = document.createElement("div");
            g.className = "wheel-segment-gems";
            g.textContent = "💎";
            g.title = item.amount + " Gems";
            inner.appendChild(g);
          } else if (item.type === "pack") {
            const packEl = renderPackIcon({ cardCount: item.cardCount, locked: false, dimmed: false, size: "small", claimable: false });
            packEl.classList.add("wheel-segment-pack");
            inner.appendChild(packEl);
          } else if (item.type === "hammers") {
            const h = document.createElement("div");
            h.className = "wheel-segment-hammers";
            h.textContent = "🔨+" + item.amount;
            inner.appendChild(h);
          } else {
            const cardId = item.cardId;
            const def = cardId && CARD_DEFS[cardId];
            const thumb = document.createElement("span");
            thumb.className = "wheel-segment-card-thumb wheel-segment-card-thumb--emoji";
            thumb.textContent = cardId ? getStickerEmoji(cardId) : "🎴";
            thumb.title = (def && def.name) || "Sticker";
            inner.appendChild(thumb);
          }
          const mul = document.createElement("div");
          mul.className = "wheel-segment-multiplier";
          if (item.type === "stickerpack") {
            mul.textContent = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V" }[item.tier] || String(item.tier);
          }
          else if (item.type === "gems") mul.textContent = "x" + (item.amount || 1);
          else if (item.type === "pack") mul.textContent = "x" + (item.cardCount || 1);
          else if (item.type === "hammers") mul.textContent = "x" + (item.amount || 1);
          else mul.textContent = "x1";
          inner.appendChild(mul);
          seg.appendChild(inner);
          segmentsEl.appendChild(seg);
        }
      }
      if (rotatable) rotatable.style.transition = "none";
      if (rotatable) rotatable.style.transform = "rotate(0deg)";
      const spinBtn = document.getElementById("btn-wheel-spin");
      const timerEl = document.getElementById("wheel-timer");
      const timerValue = document.getElementById("wheel-timer-value");
      const subtitleEl = document.getElementById("wheel-subtitle");
      if (freeAvailable) {
        if (spinBtn) {
          spinBtn.textContent = "Free Spin";
          spinBtn.disabled = false;
          spinBtn.classList.remove("hidden");
        }
        if (subtitleEl) subtitleEl.textContent = "Spin for free!";
        if (timerEl) timerEl.classList.add("hidden");
        setWheelState("ready");
      } else {
        if (spinBtn) {
          spinBtn.disabled = true;
          spinBtn.textContent = "SPIN";
        }
        if (subtitleEl) subtitleEl.textContent = "Come back for your next free spin.";
        if (timerEl) timerEl.classList.remove("hidden");
        setWheelState("disabled");
        const updateTimer = () => {
          const remain = Math.max(0, nextFree - Date.now());
          if (remain <= 0) {
            if (timerValue) timerValue.textContent = "00:00:00";
            spinBtn.disabled = false;
            spinBtn.textContent = "Free Spin";
            timerEl.classList.add("hidden");
            if (subtitleEl) subtitleEl.textContent = "Spin for free!";
            setWheelState("ready");
            if (this._wheelTimerId) clearInterval(this._wheelTimerId);
            this._wheelTimerId = null;
            return;
          }
          const h = Math.floor(remain / 3600000);
          const m = Math.floor((remain % 3600000) / 60000);
          const s = Math.floor((remain % 60000) / 1000);
          if (timerValue) timerValue.textContent = String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
        };
        updateTimer();
        if (this._wheelTimerId) clearInterval(this._wheelTimerId);
        this._wheelTimerId = setInterval(updateTimer, 1000);
      }
      const spinCheatBtn = document.getElementById("btn-wheel-spin-cheat");
      const doSpin = (useCooldown) => {
        setWheelState("spinning");
        if (subtitleEl) subtitleEl.textContent = "Spinning...";
        if (spinBtn) spinBtn.disabled = true;
        if (spinCheatBtn) spinCheatBtn.disabled = true;
        if (spinBtn) spinBtn.onclick = null;
        if (spinCheatBtn) spinCheatBtn.onclick = null;
        const wonIndex = Math.floor(Math.random() * WHEEL_SEGMENTS);
        const wonItem = pool[wonIndex];
        const segmentAngle = 360 / WHEEL_SEGMENTS;
        const fullTurns = 360 * 4;
        const finalDeg = fullTurns - wonIndex * segmentAngle;
        if (rotatable) {
          rotatable.style.transition = "transform " + (WHEEL_SPIN_DURATION_MS / 1000) + "s cubic-bezier(0.2, 0.8, 0.2, 1)";
          rotatable.style.transform = "rotate(" + finalDeg + "deg)";
        }
        setTimeout(() => {
          const pointerEl = document.querySelector(".wheel-pointer");
          if (pointerEl) {
            pointerEl.classList.add("wheel-pointer-glow");
            setTimeout(() => pointerEl.classList.remove("wheel-pointer-glow"), 600);
          }
          this._syncDailyTasksData();
          this._save.dailyTasksProgress.wheelSpins = (this._save.dailyTasksProgress.wheelSpins || 0) + 1;
          if (useCooldown) {
            this._save.wheelNextFreeAt = Date.now() + WHEEL_FREE_COOLDOWN_MS;
          }
          saveSave(this._save);
          this.updateWheelWidget();
          this._renderDailyTasksScreen();
          close();
          setWheelState("result");
          if (wonItem.type === "pack") {
            this._openPackOpeningFlowGeneric(wonItem.packStars, wonItem.cardCount, () => {
              this.collectionUI.updateCollectionButtons();
              this.collectionUI.updateGlobalCardsProgress();
              setWheelState(stateFromCooldown());
            });
            return;
          }
          if (wonItem.type === "stickerpack") {
            // Award the pack to the Stickers feature as a pending (unopened)
            // pack so it persists and can be opened there later — works even
            // though we're on the wheel/home screen right now.
            this.collectionManager.addPendingStickerPack(wonItem.tier);
            saveSave(this._save);
            if (this.collectionUI && typeof this.collectionUI.refreshStickerLevelIfOpen === "function") {
              this.collectionUI.refreshStickerLevelIfOpen();
            }
            const tierMeta = getStickerPackTier(wonItem.tier);
            const label = stickerPackRewardLabel(wonItem.tier);
            const rewardModal = document.getElementById("wheel-reward-modal");
            const rewardTitle = document.querySelector(".wheel-reward-title");
            const cardBack = document.getElementById("wheel-reward-card-back");
            if (rewardTitle) rewardTitle.textContent = "You won a " + label + "!";
            if (cardBack) {
              cardBack.innerHTML = '<div class="wheel-stickerpack-reward wheel-segment-stickerpack--tier-'
                + wonItem.tier + '"><span class="wheel-stickerpack-band"></span><span class="wheel-stickerpack-star">'
                + tierMeta.star + '</span></div>';
            }
            if (rewardModal) rewardModal.classList.remove("hidden");
            const onAwesome = () => {
              if (rewardModal) rewardModal.classList.add("hidden");
              document.getElementById("btn-wheel-reward-ok").onclick = null;
              rewardModal.onclick = null;
              setWheelState(stateFromCooldown());
            };
            document.getElementById("btn-wheel-reward-ok").onclick = onAwesome;
            rewardModal.onclick = (e) => { if (e.target === rewardModal) onAwesome(); };
            return;
          }
          if (wonItem.type === "gems") {
            this._save.gemsTotal = (this._save.gemsTotal || 0) + (wonItem.amount || 0);
            saveSave(this._save);
            const rewardModal = document.getElementById("wheel-reward-modal");
            const rewardTitle = document.querySelector(".wheel-reward-title");
            const cardBack = document.getElementById("wheel-reward-card-back");
            if (rewardTitle) rewardTitle.textContent = "You won +" + (wonItem.amount || 0) + " gems!";
            if (cardBack) cardBack.innerHTML = "<div class=\"wheel-gems-reward\">💎</div>";
            if (rewardModal) rewardModal.classList.remove("hidden");
            const onAwesome = () => {
              if (rewardModal) rewardModal.classList.add("hidden");
              document.getElementById("btn-wheel-reward-ok").onclick = null;
              rewardModal.onclick = null;
              setWheelState(stateFromCooldown());
            };
            document.getElementById("btn-wheel-reward-ok").onclick = onAwesome;
            rewardModal.onclick = (e) => { if (e.target === rewardModal) onAwesome(); };
            return;
          }
          if (wonItem.type === "hammers") {
            this.addHammers(wonItem.amount || 1);
            const rewardModal = document.getElementById("wheel-reward-modal");
            const rewardTitle = document.querySelector(".wheel-reward-title");
            const cardBack = document.getElementById("wheel-reward-card-back");
            if (rewardTitle) rewardTitle.textContent = "You won +" + (wonItem.amount || 1) + " hammers!";
            if (cardBack) {
              cardBack.innerHTML = "<div class=\"wheel-hammer-reward\">🔨</div>";
            }
            if (rewardModal) rewardModal.classList.remove("hidden");
            const onAwesome = () => {
              if (rewardModal) rewardModal.classList.add("hidden");
              document.getElementById("btn-wheel-reward-ok").onclick = null;
              rewardModal.onclick = null;
              setWheelState(stateFromCooldown());
            };
            document.getElementById("btn-wheel-reward-ok").onclick = onAwesome;
            rewardModal.onclick = (e) => { if (e.target === rewardModal) onAwesome(); };
            return;
          }
          const cardId = wonItem.cardId;
          this.collectionManager.awardCardFromWheel(cardId);
          saveSave(this._save);
          this.collectionUI.updateCollectionButtons();
          this.collectionUI.updateGlobalCardsProgress();
          const rewardModal = document.getElementById("wheel-reward-modal");
          const cardBack = document.getElementById("wheel-reward-card-back");
          const rewardTitle = document.querySelector(".wheel-reward-title");
          if (cardBack) {
            cardBack.innerHTML = "";
            const def = cardId && CARD_DEFS[cardId];
            const wonGlyph = document.createElement("span");
            wonGlyph.className = "wheel-reward-card-img wheel-reward-card-img--emoji";
            wonGlyph.textContent = cardId ? getStickerEmoji(cardId) : "✨";
            wonGlyph.setAttribute("aria-hidden", "true");
            wonGlyph.title = (def && def.name) || "Sticker";
            cardBack.appendChild(wonGlyph);
          }
          if (rewardTitle && cardId && CARD_DEFS[cardId] && CARD_DEFS[cardId].name) {
            rewardTitle.textContent = "You won " + CARD_DEFS[cardId].name + "!";
          } else if (rewardTitle) {
            rewardTitle.textContent = "You won a Sticker!";
          }
          if (rewardModal) rewardModal.classList.remove("hidden");
          const onAwesome = () => {
            if (rewardModal) rewardModal.classList.add("hidden");
            document.getElementById("btn-wheel-reward-ok").onclick = null;
            rewardModal.onclick = null;
            setWheelState(stateFromCooldown());
          };
          document.getElementById("btn-wheel-reward-ok").onclick = onAwesome;
          rewardModal.onclick = (e) => { if (e.target === rewardModal) onAwesome(); };
        }, WHEEL_SPIN_DURATION_MS + 200);
      };

      let keyHandler = null;
      const close = () => {
        modal.classList.add("hidden");
        modal.removeAttribute("data-wheel-state");
        document.documentElement.classList.remove("wheel-screen-active");
        document.body.classList.remove("wheel-screen-active");
        if (this._wheelTimerId) clearInterval(this._wheelTimerId);
        this._wheelTimerId = null;
        document.getElementById("btn-wheel-close").onclick = null;
        if (spinBtn) spinBtn.onclick = null;
        if (spinCheatBtn) spinCheatBtn.onclick = null;
        if (keyHandler) {
          document.removeEventListener("keydown", keyHandler);
          keyHandler = null;
        }
      };
      document.getElementById("btn-wheel-close").onclick = close;
      keyHandler = (e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        close();
      };
      document.addEventListener("keydown", keyHandler);

      modal.classList.remove("hidden");

      if (spinBtn && freeAvailable) {
        spinBtn.onclick = () => doSpin(true);
      }
      if (spinCheatBtn) {
        spinCheatBtn.onclick = () => doSpin(false);
      }
    }

    _showToastBattlePassLocked() {
      const el = document.getElementById("toast-battle-pass-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastBattlePassLockedTimer);
      this._toastBattlePassLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastEventEnded() {
      const el = document.getElementById("toast-event-ended");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastEventEndedTimer);
      this._toastEventEndedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastLeaderboardLocked() {
      const el = document.getElementById("toast-leaderboard-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastLeaderboardLockedTimer);
      this._toastLeaderboardLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastBonusLevelLocked() {
      const el = document.getElementById("toast-bonus-level-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastBonusLevelLockedTimer);
      this._toastBonusLevelLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastBonusCompleted() {
      const el = document.getElementById("toast-bonus-completed");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastBonusCompletedTimer);
      this._toastBonusCompletedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastRaceLocked() {
      const el = document.getElementById("toast-race-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastRaceLockedTimer);
      this._toastRaceLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    _showToastLostTempleLocked() {
      const el = document.getElementById("toast-lost-temple-locked");
      if (!el) return;
      el.classList.remove("hidden");
      clearTimeout(this._toastLostTempleLockedTimer);
      this._toastLostTempleLockedTimer = setTimeout(() => el.classList.add("hidden"), 2500);
    }

    onLostTempleClick() {
      this.lostTempleManager.openScreen();
    }

    onLeaderboardTrophyClick() {
      this.leaderboardManager.openLeaderboardModal();
    }

    _ensurePlayerProfile() {
      if (!this._save.playerProfile || typeof this._save.playerProfile !== "object") {
        this._save.playerProfile = {
          id: getStablePlayerId(),
          name: generateDefaultUserName(),
          avatarId: 0,
          accessoryId: "none",
          createdAt: Date.now(),
        };
      }
      if (!this._save.playerProfile.id) this._save.playerProfile.id = getStablePlayerId();
      if (!this._save.playerProfile.name || !String(this._save.playerProfile.name).trim()) {
        this._save.playerProfile.name = generateDefaultUserName();
      }
      this._save.playerProfile.avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(this._save.playerProfile.avatarId, 10) || 0));
      if (this._save.playerProfile.accessoryId === undefined || this._save.playerProfile.accessoryId === null) {
        this._save.playerProfile.accessoryId = "none";
      }
    }

    _validateProfileName(raw) {
      const s = String(raw || "").trim().replace(/\s+/g, " ");
      if (s.length === 0) return null;
      const allowed = /^[a-zA-Z0-9 _]+$/;
      if (!allowed.test(s)) return null;
      if (s.length < 3 || s.length > 16) return null;
      return s;
    }

    showProfileSetupIfNeeded() {
      if (this._save.profileSetupCompleted) return;
      this._ensurePlayerProfile();
      saveSave(this._save);
      this.openProfileModal(false);
    }

    _saveProfileFromModal(pillEl, inputEl) {
      const raw = inputEl && inputEl.value !== undefined ? String(inputEl.value).trim() : (pillEl ? pillEl.textContent : "").trim();
      const validated = this._validateProfileName(raw);
      const profile = this._save.playerProfile;
      const fallback = (profile.name && String(profile.name).trim()) ? String(profile.name).trim() : generateDefaultUserName();
      const name = validated !== null ? validated : fallback;
      this._save.playerProfile.name = name;
      this._save.playerProfile.avatarId = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(this._save.playerProfile.avatarId, 10) || 0));
      saveSave(this._save);
      if (pillEl) pillEl.textContent = name;
      this.updateProfileWidget();
    }

    _updateProfileModalPreview(previewEl, avatarId, accessoryId) {
      if (!previewEl) return;
      const aid = Math.max(0, Math.min(AVATAR_COUNT - 1, parseInt(avatarId, 10) || 0));
      const accId = (accessoryId != null && accessoryId !== "") ? String(accessoryId) : "none";
      previewEl.innerHTML = renderPlayerAvatar({ avatarId: aid, accessoryId: accId, size: "large" });
    }

    openProfileModal(isEdit) {
      this._ensurePlayerProfile();
      const modal = document.getElementById("profile-modal");
      if (!modal) return;
      const profile = this._save.playerProfile;
      const pillEl = document.getElementById("profile-username-pill");
      const inputEl = document.getElementById("profile-username-input");
      const previewEl = document.getElementById("profile-preview");
      const skinsPanel = document.getElementById("profile-skins-panel");
      const accessoriesPanel = document.getElementById("profile-accessories-panel");
      const tabAccessories = document.getElementById("profile-tab-accessories");
      const tabSkins = document.getElementById("profile-tab-skins");
      const skinsGrid = document.getElementById("profile-skins-grid");
      const displayName = (profile.name && String(profile.name).trim()) ? String(profile.name).trim() : generateDefaultUserName();
      if (pillEl) {
        pillEl.textContent = displayName;
        pillEl.classList.remove("hidden");
      }
      if (inputEl) {
        inputEl.value = displayName;
        inputEl.setAttribute("maxlength", "16");
        inputEl.classList.add("hidden");
      }
      this._updateProfileModalPreview(previewEl, profile.avatarId, profile.accessoryId);
      const currentAccessoryId = (profile.accessoryId != null && profile.accessoryId !== "") ? String(profile.accessoryId) : "none";
      const profileSkinCatalog = [
        { avatarId: 0, state: "used", label: "Used", selectable: true },
        { avatarId: 1, state: "available", label: "Available", selectable: true },
        { avatarId: 2, state: "available", label: "Available", selectable: true },
        { avatarId: 3, state: "locked-ads", label: "0/10", icon: PROFILE_ICON_ADS_SRC, selectable: false },
        { avatarId: 4, state: "locked-gems", label: "5", icon: PROFILE_ICON_GEM_SRC, selectable: false },
        { avatarId: 5, state: "locked-gems", label: "10", icon: PROFILE_ICON_GEM_SRC, selectable: false },
      ];
      const renderSkins = () => {
        if (!skinsGrid) return;
        skinsGrid.innerHTML = "";
        profileSkinCatalog.forEach((item) => {
          const isSelected = item.avatarId === profile.avatarId;
          const card = document.createElement("div");
          card.className = "profile-item-card" + (item.selectable ? "" : " profile-item-card--locked");
          const button = document.createElement("button");
          button.type = "button";
          button.className = "profile-item-button";
          if (!item.selectable) {
            button.setAttribute("aria-disabled", "true");
          }
          const thumb = document.createElement("div");
          thumb.className = "profile-item-thumb" + (isSelected ? " profile-item-thumb--selected" : "");
          thumb.innerHTML = getAvatarSvg(item.avatarId);
          const pill = document.createElement("div");
          const toneClass = item.state === "used" ? " profile-item-pill--used" : (item.state === "available" ? " profile-item-pill--available" : "");
          pill.className = "profile-item-pill" + toneClass;
          if (item.icon) {
            const icon = document.createElement("img");
            icon.className = "profile-item-price-icon";
            icon.src = item.icon;
            icon.alt = "";
            icon.setAttribute("aria-hidden", "true");
            pill.appendChild(icon);
          }
          const txt = document.createElement("span");
          txt.textContent = item.label;
          pill.appendChild(txt);
          button.appendChild(thumb);
          button.appendChild(pill);
          button.onclick = () => {
            if (!item.selectable) return;
            this._save.playerProfile.avatarId = item.avatarId;
            saveSave(this._save);
            this._updateProfileModalPreview(previewEl, item.avatarId, profile.accessoryId);
            renderSkins();
            this.updateProfileWidget();
          };
          card.appendChild(button);
          skinsGrid.appendChild(card);
        });
      };
      const switchToSkins = () => {
        if (tabSkins) { tabSkins.classList.add("profile-tab--active"); tabSkins.classList.remove("profile-tab--inactive"); }
        if (tabAccessories) { tabAccessories.classList.remove("profile-tab--active"); tabAccessories.classList.add("profile-tab--inactive"); }
        if (skinsPanel) skinsPanel.classList.remove("hidden");
        if (accessoriesPanel) accessoriesPanel.classList.add("hidden");
      };
      const switchToAccessories = () => {
        if (tabAccessories) { tabAccessories.classList.add("profile-tab--active"); tabAccessories.classList.remove("profile-tab--inactive"); }
        if (tabSkins) { tabSkins.classList.remove("profile-tab--active"); tabSkins.classList.add("profile-tab--inactive"); }
        if (accessoriesPanel) accessoriesPanel.classList.remove("hidden");
        if (skinsPanel) skinsPanel.classList.add("hidden");
      };
      if (tabSkins) tabSkins.onclick = switchToSkins;
      if (tabAccessories) tabAccessories.onclick = switchToAccessories;
      const accessoriesGrid = document.getElementById("profile-accessories-grid");
      if (accessoriesGrid) {
        accessoriesGrid.innerHTML = "";
        ACCESSORY_DEFS.forEach((def) => {
          const tile = document.createElement("div");
          tile.className = "profile-item-card";
          tile.setAttribute("role", "listitem");
          const button = document.createElement("button");
          button.type = "button";
          button.className = "profile-item-button";
          const thumb = document.createElement("div");
          thumb.className = "profile-item-thumb" + (def.id === currentAccessoryId ? " profile-item-thumb--selected" : "");
          if (def.id === "none") {
            thumb.innerHTML = "<span class=\"profile-username-pill\" style=\"font-size:0.9rem;padding:0;line-height:1;\">None</span>";
          } else if (def.iconSvg) {
            thumb.innerHTML = def.iconSvg;
          } else {
            thumb.innerHTML = "<span class=\"profile-username-pill\" style=\"font-size:0.75rem;padding:0;line-height:1.1;\">" + (def.displayName || def.id) + "</span>";
          }
          const pill = document.createElement("div");
          pill.className = "profile-item-pill" + (def.id === currentAccessoryId ? " profile-item-pill--used" : " profile-item-pill--available");
          const txt = document.createElement("span");
          txt.textContent = def.id === currentAccessoryId ? "Used" : "Available";
          pill.appendChild(txt);
          button.appendChild(thumb);
          button.appendChild(pill);
          tile.appendChild(button);
          if (def.id === "none") {
            tile.setAttribute("data-accessory-id", "none");
          }
          button.onclick = () => {
            this._save.playerProfile.accessoryId = def.id;
            saveSave(this._save);
            profile.accessoryId = def.id;
            this._updateProfileModalPreview(previewEl, profile.avatarId, def.id);
            accessoriesGrid.querySelectorAll(".profile-item-thumb").forEach((t) => t.classList.remove("profile-item-thumb--selected"));
            accessoriesGrid.querySelectorAll(".profile-item-pill").forEach((t) => {
              t.classList.remove("profile-item-pill--used");
              t.classList.add("profile-item-pill--available");
              const s = t.querySelector("span");
              if (s) s.textContent = "Available";
            });
            thumb.classList.add("profile-item-thumb--selected");
            pill.classList.remove("profile-item-pill--available");
            pill.classList.add("profile-item-pill--used");
            txt.textContent = "Used";
            this.updateProfileWidget();
          };
          accessoriesGrid.appendChild(tile);
        });
      }
      renderSkins();
      const commitName = () => {
        if (inputEl && !inputEl.classList.contains("hidden")) {
          this._saveProfileFromModal(pillEl, inputEl);
          inputEl.classList.add("hidden");
          if (pillEl) pillEl.classList.remove("hidden");
        }
      };
      if (pillEl) {
        pillEl.onclick = () => {
          if (inputEl) {
            inputEl.value = pillEl.textContent;
            pillEl.classList.add("hidden");
            inputEl.classList.remove("hidden");
            inputEl.focus();
          }
        };
      }
      if (inputEl) {
        inputEl.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commitName();
          }
        };
        inputEl.onblur = () => commitName();
      }
      const close = () => {
        commitName();
        modal.classList.add("hidden");
        if (!isEdit) this._save.profileSetupCompleted = true;
        saveSave(this._save);
        if (this._profileModalEscapeHandler) {
          window.removeEventListener("keydown", this._profileModalEscapeHandler);
          this._profileModalEscapeHandler = null;
        }
        if (pillEl) pillEl.onclick = null;
        if (inputEl) {
          inputEl.onkeydown = null;
          inputEl.onblur = null;
        }
        if (tabSkins) tabSkins.onclick = null;
        if (tabAccessories) tabAccessories.onclick = null;
        if (accessoriesGrid) {
          accessoriesGrid.querySelectorAll(".profile-item-button").forEach((t) => { t.onclick = null; });
          accessoriesGrid.innerHTML = "";
        }
        if (skinsGrid) {
          skinsGrid.querySelectorAll(".profile-item-button").forEach((t) => { t.onclick = null; });
          skinsGrid.innerHTML = "";
        }
        modal.onclick = null;
        const closeBtn = document.getElementById("profile-modal-close");
        if (closeBtn) closeBtn.onclick = null;
        this.updateProfileWidget();
      };
      modal.onclick = (e) => { if (e.target === modal) close(); };
      this._profileModalEscapeHandler = (e) => {
        if (e.key !== "Escape") return;
        e.preventDefault();
        close();
      };
      window.addEventListener("keydown", this._profileModalEscapeHandler);
      const closeBtn = document.getElementById("profile-modal-close");
      if (closeBtn) closeBtn.onclick = () => close();
      modal.classList.remove("hidden");
    }

    onGiftClicked() {
      this.openBonusLevelModal();
    }

    openBonusLevelModal() {
      const modal = document.getElementById("bonus-level-modal");
      if (!modal) return;
      const completedHint = document.getElementById("bonus-level-modal-completed-hint");
      if (completedHint) {
        completedHint.classList.toggle("hidden", !this._save.bonusLevelCompleted);
      }
      modal.classList.remove("hidden");
    }

    closeBonusLevelModal() {
      const modal = document.getElementById("bonus-level-modal");
      if (modal) modal.classList.add("hidden");
    }

    _onBonusLevelPlayClick() {
      this.closeBonusLevelModal();
      this.ui.showScreen("game-screen");
      this.loadBonusLevel();
    }

    _clearBattlePassTutorial() {
      if (this._bpTutorDragAnimationId) {
        cancelAnimationFrame(this._bpTutorDragAnimationId);
        this._bpTutorDragAnimationId = null;
      }
      this._bpTutorHideHand();
      if (this._bpTutorResizeHandler) {
        window.removeEventListener("resize", this._bpTutorResizeHandler);
        this._bpTutorResizeHandler = null;
      }
    }

    _bpTutorHideHand() {
      const overlay = document.getElementById("bp-tutor-overlay");
      if (overlay) {
        overlay.classList.add("hidden");
        overlay.classList.remove("bp-tutor-overlay--dim");
      }
    }

    _bpTutorShowHandAtElement(targetEl, tooltipText) {
      const overlay = document.getElementById("bp-tutor-overlay");
      const handWrap = overlay ? overlay.querySelector(".bp-tutor-hand-wrap") : null;
      const tooltipEl = document.getElementById("bp-tutor-tooltip");
      if (!overlay || !handWrap) return;
      overlay.classList.remove("hidden");
      overlay.classList.add("bp-tutor-overlay--dim");
      handWrap.classList.remove("bp-tutor-hand-wrap--dragging");
      const updatePos = () => {
        if (!targetEl || !targetEl.getBoundingClientRect) return;
        const rect = targetEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        handWrap.style.left = cx + "px";
        handWrap.style.top = (cy - 10) + "px";
        if (tooltipEl) {
          tooltipEl.style.left = cx + "px";
          tooltipEl.style.top = (cy + 44) + "px";
          tooltipEl.style.transform = "translateX(-50%)";
          tooltipEl.textContent = tooltipText || "";
          tooltipEl.style.display = tooltipText ? "block" : "none";
        }
      };
      updatePos();
      this._bpTutorResizeHandler = updatePos;
      window.removeEventListener("resize", this._bpTutorResizeHandler);
      window.addEventListener("resize", this._bpTutorResizeHandler);
    }

    _bpTutorShowHandDragAnimation(pieceEl, slotEl, tooltipText) {
      const overlay = document.getElementById("bp-tutor-overlay");
      const handWrap = overlay ? overlay.querySelector(".bp-tutor-hand-wrap") : null;
      const tooltipEl = document.getElementById("bp-tutor-tooltip");
      if (!overlay || !handWrap) return;
      overlay.classList.remove("hidden");
      overlay.classList.add("bp-tutor-overlay--dim");
      handWrap.classList.add("bp-tutor-hand-wrap--dragging");
      if (tooltipEl) {
        tooltipEl.textContent = tooltipText || "";
        tooltipEl.style.display = tooltipText ? "block" : "none";
      }
      const self = this;
      const DURATION_MS = 2000;
      const startTime = Date.now();
      function tick() {
        if (self._save.bpTutorStep !== 1) return;
        const pieceRect = pieceEl.getBoundingClientRect();
        const slotRect = slotEl.getBoundingClientRect();
        const fromX = pieceRect.left + pieceRect.width / 2;
        const fromY = pieceRect.top + pieceRect.height / 2 - 10;
        const toX = slotRect.left + slotRect.width / 2;
        const toY = slotRect.top + slotRect.height / 2 - 10;
        const elapsed = (Date.now() - startTime) % (DURATION_MS + 400);
        let t = elapsed < DURATION_MS ? elapsed / DURATION_MS : 1;
        if (elapsed >= DURATION_MS) t = 1;
        const ease = t < 1 ? t * t * (3 - 2 * t) : 1;
        const x = fromX + (toX - fromX) * ease;
        const y = fromY + (toY - fromY) * ease;
        handWrap.style.left = x + "px";
        handWrap.style.top = y + "px";
        if (tooltipEl) {
          tooltipEl.style.left = x + "px";
          tooltipEl.style.top = (y + 44) + "px";
          tooltipEl.style.transform = "translateX(-50%)";
        }
        self._bpTutorDragAnimationId = requestAnimationFrame(tick);
      }
      tick();
    }

    _startBattlePassTutorialIfNeeded() {
      if (!this._save.battlePassUnlocked) return;
      if (!isEventActive(this._save, "battlePassEvent")) return;
      if (this._save.bpTutorCompleted) return;

      if (this._save.bpTutorStep === 0) {
        this._save.bpTutorStep = 1;
        saveSave(this._save);
      }

      if (this._save.bpTutorStep === 2) {
        this._bpTutorShowHandAtElement(this._getBPWidgetElement(), "Tap Battle Pass to see rewards!");
        return;
      }

      if (this._save.bpTutorStep === 1) {
        const piece = this.pieceTray.pieces.find((p) => !p.placed);
        const slot = piece && this.board.getSlotByPieceId(piece.pieceId);
        if (piece && piece.el && slot && slot.el) {
          this._bpTutorShowHandDragAnimation(piece.el, slot.el, "Place puzzle pieces to earn Battle Pass points!");
        } else {
          this._bpTutorShowHandAtElement(this.pieceTray.container, "Place puzzle pieces to earn Battle Pass points!");
        }
      }
    }

    _getBPWidgetElement() {
      const gameScreen = document.getElementById("game-screen");
      if (gameScreen && gameScreen.classList.contains("active")) {
        const el = document.getElementById("btn-battle-pass-widget-game");
        if (el) return el;
      }
      return document.getElementById("btn-battle-pass-widget") || document.getElementById("btn-battle-pass-widget-game");
    }

    resetProgress() {
      try {
        this._clearBattlePassTutorial();
        const music = this._save.musicOn;
        const sfx = this._save.sfxOn;
        Object.assign(this._save, getDefaultSave());
        this._save.musicOn = music;
        this._save.sfxOn = sfx;
        const now = Date.now();
        if (!this._save.albumEvent) this._save.albumEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
        if (!this._save.battlePassEvent) this._save.battlePassEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
        if (!this._save.lostTempleEvent) this._save.lostTempleEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
        this.currentLevelIndex = 0;
        saveSave(this._save);
        this._applySaveToUI();
        this.updateWheelWidget();
        this.updateRaceEventWidget();
        this.lostTempleManager.updateWidget();
        this.rubyCaveManager.resetFromSave();
        this.collectionUI.updateCollectionButtons();
        this.ui.hideSettingsModal();
        this.ui.showScreen("start-screen");
      } catch (_) {}
    }

    cheatOpenAllAlbums() {
      const now = Date.now();
      this._save.collectionUnlocked = true;
      this._save.collectionTutorialCompleted = true;
      this._save.albumEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
      this._save.battlePassUnlocked = true;
      this._save.battlePassEvent = { startAt: now, endAt: now + EVENT_DURATION_MS };
      this._save.leaderboardUnlocked = true;
      this._save.leaderboardTutorCompleted = true;
      this.collectionManager._ensureCardsStructure();
      this.collectionManager.autoFillStickerLevel();
      saveSave(this._save);
      this._applySaveToUI();
      this.updateBattlePassWidget();
      this.updateLeaderboardWidget();
      this.collectionUI.updateCollectionButtons();
      this.collectionUI.updateGlobalCardsProgress();
      this.ui.hideSettingsModal();
      this.collectionUI.showAlbum();
    }

    cheatAddAlbumStars() {
      this.collectionManager.addAlbumStars(10000);
      this.collectionUI.updateAlbumStarsUI();
      this._saveState();
    }

    cheatAddEventHammers() {
      this.addHammers(10000);
      this._saveState();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.gameApp = new GameApp();
  });
})();
