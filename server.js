import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import multer from "multer";
import path from "path";
import bcrypt from "bcrypt"; // for password hashing
import dotenv from "dotenv";
import * as XLSX from "xlsx";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Configure multer (uploads stored in /uploads)
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
});

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://*.netlify.app',
    'https://netlify.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // serve uploaded files

// Default locations and riddles (answers are the spot names)
const DEFAULT_SPOTS = [
  { name: "LIBRARY", code: "QR-LIB", isFinal: false, riddles: [
    "Stories and knowledge in rows all around. Seek me where silence is golden and wise, Your treasure awaits where the wisdom lies",
    "I hold worlds inside me, yet I am not alive. Silent I stand, though voices inside thrive. You'll find me in rows ,where wisdom is stored —Take me home, but return me ,or be ignored"
  ]},
  { name: "VISWESWARAYA HALL", code: "QR-VISH", isFinal: false, riddles: [
    "People treble before me and also they bass. They assemble to listen",
    "Where voices echo and curtains rise, Talent performs before your eyes."
  ]},
  { name: "LIFT - ASET", code: "QR-LIFT", isFinal: false, riddles: [
    "No legs, yet I carry climbers; no wings, yet I cross the air between floors. My stomach closes doors and swallows corridors whole.",
    "I am a boxed room that borrows height; ropes pulse, numbers whisper—press my face to change the sky."
  ]},
  { name: "BUS PARKING AREA", code: "QR-BUS", isFinal: false, riddles: [
    "I have many seats but never recline, I follow a route, right on time. I stop and go, both day and night, And people hop in for a quick ride",
    "I am a metal caterpillar, transforming students into scholars. rumble and groan, a familiar sound, taking students safe and sound"
  ]},
  { name: "RECEPTION - ASET", code: "QR-RECP", isFinal: false, riddles: [
    "I’m the place that greets you first, For questions, news, or even thirst. A desk, a smile, a friendly tone",
    "First place you see when you walk in the door, Answers and welcomes — it's hard to ignore."
  ]},
  { name: "STATIONARY STORE - ASET", code: "QR-STAT", isFinal: false, riddles: [
    "I sell no food, but I feed your need, For paper and ink, I’m the place indeed",
    "I don’t cook or serve a plate, But I help you duplicate. Pens and papers, tools to score"
  ]},
  { name: "OUTSIDE CSE LAB", code: "QR-CSEL", isFinal: false, riddles: [
    "I run your world, both day and night, Programs on me take flight",
    "I scroll on a screen, or click away, I help you find things every day"
  ]},
  { name: "COLLEGE NAME BOARD - OUTSIDE ASET", code: "QR-NAME", isFinal: false, riddles: [
    "I stand with pride at the very front, Telling all who pass my boldest stunt.",
    "I don’t speak, yet I proclaim, Where you’ve arrived, by name and fame"
  ]},
  { name: "PHARMACY ENTRANCE", code: "QR-PHAR-ENT", isFinal: false, riddles: [
    "I’m not a hospital, yet I heal, With books and labs, my knowledge is real.",
    "Where potions are studied but magic is none, Doctors of medicine here are begun."
  ]},
  { name: "WATER DISPENSER - ASET", code: "QR-WATR", isFinal: false, riddles: [
    "I quench your thirst, help plants grow tall, I flow in rivers big and small",
    "I chill your drink with a frosty grip, melting away with every sip"
  ]},
  { name: "PHARMACY CANTEEN", code: "QR-PHAR-CAN", isFinal: false, riddles: [
    "No pills, no meals — just sips and bites, Find the spot of tea-time delights",
    "Close to CSE, I wait in my place, With a hint of medicine in the space. When your belly cries after a boring class, I’m the savior you’ll find as you pass!"
  ]},
  { name: "COFFEE DAY CAFE", code: "QR-COFF", isFinal: false, riddles: [
    "Hot cups under open sky — I’m the stall you find just outside, where students stop by.",
    "I brew under sunlight, not the hall’s bright way — follow the aroma; I’m just outside the building."
  ]},
  { name: "NOTICE BOARD- ASET", code: "QR-NOTC", isFinal: false, riddles: [
    "I wear pins like jewelry and hold paper like clothes — I never get dressed",
    "I’m full of news but never speak; friends and strangers come to peek"
  ]},
  { name: "STAIRCASE -ASET", code: "QR-STAR", isFinal: false, riddles: [
    "I have many steps and often a landing; I help you rise but never tire",
    "I connect floors and hide a fall — skip one of me and you might trip."
  ]},
  { name: "OUTSIDE PRINCIPAL ROOM - ASET", code: "QR-PRIN", isFinal: false, riddles: [
    "I call meetings, sign forms, and keep the rule; staff and students say I’m nobody’s fool.",
    "Where rules reside and decisions are made. Seek the mind behind the grade"
  ]},
  { name: "STAFF ROOM - ASET", code: "QR-STAF", isFinal: false, riddles: [
    "It isn’t a classroom, yet lessons are planned, A space for ideas, coffee in hand",
    "To find your spot, don’t look too far, Seek the place where the teachers are"
  ]},
  { name: "BRIDGE", code: "QR-BRDG", isFinal: false, riddles: [
    "I connect hearts and lands alike, without a single step.",
    "I’m white as a fairy, with no wings in sight, I carry all loads with all of my might. By day I’m plain, but at night I glow, And under my feet, the waters flow"
  ]},
  { name: "IEDC ROOM - ASET", code: "QR-IEDC", isFinal: false, riddles: [
    "Ideas are born where minds unite, Dreams of startups take their flight.",
    "Where innovation takes its first breath. Look around, don’t miss what’s left"
  ]},
  { name: "CAR PARKING - ASET", code: "QR-CARP", isFinal: false, riddles: [
    "Cars to the left, circuits to the right  - The wall between hides your next sight!",
    "Between wheels and wires, take a glance — A wall nearby may hold your chance."
  ]},
  { name: "NODAL OFFICER ( IEDC ASET )", code: "QR-NODL", isFinal: true, riddles: [
    "I lead the IEDC team with care, Got an idea? I'm always there. To end your hunt, come find me.  The nodal face of creativity!"
  ]},
];

//---------------------------------------
// Register a new team (with password hashing)
app.post("/register", async (req, res) => {
  const { teamName, password, members } = req.body;
  try {
    // Check if teamName already exists
    const existing = await prisma.team.findUnique({ where: { teamName } });
    if (existing) {
      return res.status(409).json({ error: "Team name already exists!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const team = await prisma.team.create({
      data: {
        teamName,
        password: hashedPassword,
        members: members && Array.isArray(members) && members.length
          ? { create: members.map(name => ({ name })) }
          : undefined,
      },
      include: { members: true }
    });

    // Prepare Excel for just-registered team (and optionally all teams)
    const rows = [
      { TeamID: team.id, TeamName: team.teamName, CreatedAt: team.createdAt }
    ];
    (team.members || []).forEach(m => {
      rows.push({ TeamID: team.id, TeamName: team.teamName, MemberName: m.name, CreatedAt: team.createdAt });
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Registration");
    const xlsBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Send email if SMTP is configured
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM } = process.env;
    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && MAIL_TO) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });
      await transporter.sendMail({
        from: MAIL_FROM || SMTP_USER,
        to: MAIL_TO,
        subject: `New Team Registered: ${team.teamName}`,
        text: `Team ${team.teamName} just registered with ${team.members?.length || 0} members.`,
        attachments: [{ filename: `registration-${team.teamName}.xlsx`, content: xlsBuffer }]
      });
    }

    res.json(team);
  } catch (error) {
    res.status(400).json({ error: "Registration failed!" });
  }
});

// Login (check hashed password)
app.post("/login", async (req, res) => {
  const { teamName, password } = req.body;

  const team = await prisma.team.findUnique({ where: { teamName } });
  if (team && (await bcrypt.compare(password, team.password))) {
    res.json({ message: "Login successful", teamId: team.id });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});


//---------------------------------------
// ADD TEAM MEMBER
//---------------------------------------
app.post("/api/teams/:teamId/members", async (req, res) => {
  const { name } = req.body;
  const { teamId } = req.params;

  try {
    const member = await prisma.member.create({
      data: { name, teamId: parseInt(teamId) },
    });
    res.json({ message: "Member added!", member });
  } catch (error) {
    res.status(500).json({ error: "Failed to add member." });
  }
});

//---------------------------------------
// UPLOAD SELFIE
//---------------------------------------
app.post("/api/teams/:teamId/selfie", upload.single("selfie"), async (req, res) => {
  const { teamId } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  try {
    const selfie = await prisma.selfie.create({
      data: { teamId: parseInt(teamId), imageUrl: `/uploads/${req.file.filename}` },
    });

    res.json({ message: "Selfie uploaded successfully!", selfie });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload selfie." });
  }
});

//---------------------------------------
// ADMIN: EXPORT REGISTRATIONS TO EXCEL
//---------------------------------------
app.get("/admin/export", async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: { members: true, selfies: { include: { location: true } } }
    });

    const rows = teams.flatMap(team => {
      const base = {
        TeamID: team.id,
        TeamName: team.teamName,
        CreatedAt: team.createdAt,
      };
      const memberRows = team.members.length ? team.members.map(m => ({...base, MemberName: m.name})) : [{...base, MemberName: ""}];
      const selfieRows = team.selfies.map(s => ({...base, SelfieURL: s.imageUrl, SelfieAt: s.createdAt, Location: s.location?.name || ""}));
      const merged = [];
      const maxLen = Math.max(memberRows.length, selfieRows.length, 1);
      for (let i = 0; i < maxLen; i++) {
        merged.push({
          ...base,
          MemberName: memberRows[i]?.MemberName || "",
          SelfieURL: selfieRows[i]?.SelfieURL || "",
          SelfieAt: selfieRows[i]?.SelfieAt || "",
          Location: selfieRows[i]?.Location || "",
        });
      }
      return merged;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=registrations.xlsx");
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to export Excel" });
  }
});

//---------------------------------------
// ADMIN: SET RIDDLES FOR A LOCATION
//---------------------------------------
app.post("/admin/location/:locationId/riddles", async (req, res) => {
  const locationId = Number(req.params.locationId);
  const { riddles } = req.body; // array of strings
  if (!Array.isArray(riddles) || riddles.length === 0) return res.status(400).json({ error: "Riddles array required" });
  try {
    await prisma.riddle.deleteMany({ where: { locationId } });
    await prisma.riddle.createMany({ data: riddles.map(text => ({ text, locationId })) });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to set riddles" });
  }
});

//---------------------------------------
// ADMIN: LIST LOCATIONS (ids, names, codes)
//---------------------------------------
app.get("/admin/locations", async (req, res) => {
  try {
    const items = await prisma.location.findMany({ select: { id: true, name: true, code: true, isFinal: true } });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to list locations" });
  }
});

//---------------------------------------
// ADMIN: GET LOCATION BY NAME
//---------------------------------------
app.get("/admin/location/by-name", async (req, res) => {
  try {
    const name = String(req.query.name || "").trim();
    if (!name) return res.status(400).json({ error: "name required" });
    const loc = await prisma.location.findUnique({ where: { name } });
    if (!loc) return res.status(404).json({ error: "Not found" });
    res.json(loc);
  } catch (e) {
    res.status(500).json({ error: "Failed to get location" });
  }
});

//---------------------------------------
// ADMIN: BULK UPSERT LOCATIONS WITH RIDDLES
//---------------------------------------
// Body: [{ name, code, isFinal, riddles: [text, ...] }, ...]
app.post("/admin/riddles/bulk", async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Expected an array of locations with riddles" });
  }
  try {
    const results = [];
    for (const item of items) {
      const name = String(item.name || "").trim();
      if (!name) continue;
      const code = String(item.code || "").trim() || undefined;
      const isFinal = Boolean(item.isFinal);
      const riddles = Array.isArray(item.riddles) ? item.riddles.filter(Boolean).map(String) : [];
      let location = await prisma.location.findUnique({ where: { name } });
      if (!location) {
        location = await prisma.location.create({ data: { name, code: code || `QR-${name.replace(/\s+/g,'-').toUpperCase()}`, order: 999, isFinal } });
      } else if (item.code || item.isFinal !== undefined) {
        location = await prisma.location.update({ where: { id: location.id }, data: { code: code ?? location.code, isFinal } });
      }
      if (riddles.length) {
        await prisma.riddle.deleteMany({ where: { locationId: location.id } });
        await prisma.riddle.createMany({ data: riddles.map(text => ({ text, locationId: location.id })) });
      }
      results.push({ name: location.name, riddles: riddles.length });
    }
    res.json({ updated: results.length, details: results });
  } catch (e) {
    res.status(500).json({ error: "Bulk upsert failed" });
  }
});

//---------------------------------------
// ADMIN: CLEANUP MULTIPLE FINAL LOCATIONS
//---------------------------------------
app.post("/admin/cleanup-finals", async (req, res) => {
  try {
    await cleanupMultipleFinals();
    const finalLocations = await prisma.location.findMany({ 
      where: { isFinal: true },
      select: { id: true, name: true, code: true }
    });
    res.json({ 
      message: "Cleanup completed", 
      finalLocations: finalLocations,
      count: finalLocations.length 
    });
  } catch (e) {
    res.status(500).json({ error: "Cleanup failed" });
  }
});

//---------------------------------------
// GAME: SEED DEFAULT LOCATIONS (idempotent)
//---------------------------------------
async function seedLocationsIfEmpty() {
  const count = await prisma.location.count();
  if (count > 0) return;
  
  // Check for existing final locations before seeding
  const existingFinals = await prisma.location.findMany({ where: { isFinal: true } });
  if (existingFinals.length > 0) {
    console.warn(`Found ${existingFinals.length} existing final locations before seeding`);
  }
  
  for (let i = 0; i < DEFAULT_SPOTS.length; i++) {
    const s = DEFAULT_SPOTS[i];
    const existing = await prisma.location.findUnique({ where: { name: s.name } });
    let loc;
    if (existing) {
      loc = await prisma.location.update({ where: { id: existing.id }, data: { code: s.code, order: i + 1, isFinal: s.isFinal } });
      await prisma.riddle.deleteMany({ where: { locationId: loc.id } });
    } else {
      loc = await prisma.location.create({ data: { name: s.name, code: s.code, order: i + 1, isFinal: s.isFinal } });
    }
    if (s.riddles && s.riddles.length) {
      await prisma.riddle.createMany({ data: s.riddles.map(text => ({ text, locationId: loc.id })) });
    }
  }
  
  // Verify seeding results
  const finalLocations = await prisma.location.findMany({ where: { isFinal: true } });
  console.log(`Seeding complete. Final locations: ${finalLocations.map(f => f.name).join(', ')}`);
}

//---------------------------------------
// GAME: CLEANUP MULTIPLE FINAL LOCATIONS
//---------------------------------------
async function cleanupMultipleFinals() {
  try {
    const finalLocations = await prisma.location.findMany({ 
      where: { isFinal: true },
      orderBy: { id: "asc" }
    });
    
    if (finalLocations.length > 1) {
      console.log(`Found ${finalLocations.length} final locations. Cleaning up...`);
      
      // Keep only the first final location, set others to false
      const toUpdate = finalLocations.slice(1);
      for (const loc of toUpdate) {
        await prisma.location.update({
          where: { id: loc.id },
          data: { isFinal: false }
        });
        console.log(`Set ${loc.name} isFinal to false`);
      }
      
      console.log(`Cleanup complete. Only ${finalLocations[0].name} remains as final location.`);
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

//---------------------------------------
// GAME: SPIN → GENERATE UNIQUE PATH
//---------------------------------------
app.post("/game/:teamId/spin", async (req, res) => {
  const teamId = Number(req.params.teamId);
  try {
    // If steps already exist, do NOT reset the path. Return existing path to preserve progress.
    const existingSteps = await prisma.teamLocationStep.findMany({
      where: { teamId },
      orderBy: { position: "asc" },
      include: { location: true },
    });
    if (existingSteps.length > 0) {
      // Ensure a progress row exists
      await prisma.teamProgress.upsert({
        where: { teamId },
        create: { teamId, currentIndex: 0 },
        update: { lastUpdatedAt: new Date() }
      });
      return res.json({ message: "Already started", steps: existingSteps });
    }

    const locations = await prisma.location.findMany({ orderBy: { order: "asc" } });
    if (!locations.length) return res.status(400).json({ error: "No locations configured" });

    // Keep the final location last; shuffle the rest
    const finals = locations.filter(l => l.isFinal);
    const nonFinals = locations.filter(l => !l.isFinal);
    
    // Validation: Ensure we have exactly one final location
    if (finals.length === 0) {
      return res.status(500).json({ error: "No final location configured in database" });
    }
    if (finals.length > 1) {
      console.warn(`Warning: Multiple final locations found: ${finals.map(f => f.name).join(', ')}. Using only the first one.`);
    }
    
    // pick 5 unique non-final nodes
    const shuffledNonFinals = [...nonFinals].sort(() => Math.random() - 0.5).slice(0, 5);
    // Fix: Only take the first final location to prevent multiple finals
    const finalLocation = [finals[0]]; // Always use the first final location
    const path = shuffledNonFinals.concat(finalLocation);
    
    // Debug logging
    console.log(`Team ${teamId} path generation:`, {
      totalLocations: locations.length,
      finalLocationsFound: finals.length,
      finalLocationNames: finals.map(f => f.name),
      nonFinalLocations: nonFinals.length,
      selectedNonFinals: shuffledNonFinals.map(l => l.name),
      finalLocationSelected: finalLocation.map(l => l.name),
      totalPathLength: path.length
    });

    // Preselect a stable riddle for each step and store it
    const stepsData = [];
    for (let idx = 0; idx < path.length; idx++) {
      const loc = path[idx];
      const riddles = await prisma.riddle.findMany({ where: { locationId: loc.id }, orderBy: { id: "asc" } });
      let chosenRiddleId = null;
      if (riddles.length) {
        if (loc.isFinal) {
          chosenRiddleId = riddles[0].id;
        } else {
          const pick = Math.abs((teamId || 0) + idx) % riddles.length;
          chosenRiddleId = riddles[pick].id;
        }
      }
      stepsData.push({ teamId, locationId: loc.id, position: idx, riddleId: chosenRiddleId });
    }
    const created = await prisma.$transaction(
      stepsData.map(d => prisma.teamLocationStep.create({ data: d }))
    );
    await prisma.teamProgress.upsert({
      where: { teamId },
      create: { teamId, currentIndex: 0 },
      update: { currentIndex: 0, lastUpdatedAt: new Date() }
    });
    res.json({ steps: created });
  } catch (e) {
    res.status(500).json({ error: "Failed to spin" });
  }
});

//---------------------------------------
// GAME: CURRENT CLUE & NEXT CLUE
//---------------------------------------
app.get("/game/:teamId/clue", async (req, res) => {
  const teamId = Number(req.params.teamId);
  try {
    const progress = await prisma.teamProgress.findUnique({ where: { teamId } });
    if (!progress) return res.status(404).json({ error: "No progress. Spin first." });
    const step = await prisma.teamLocationStep.findFirst({
      where: { teamId, position: progress.currentIndex },
      include: { location: { include: { riddles: true } }, riddle: true }
    });
    if (!step) return res.status(404).json({ error: "No step found" });
    // Use stored riddle if present; otherwise select deterministically and persist it
    let riddleText = step.riddle?.text || null;
    if (!riddleText && step.location.riddles && step.location.riddles.length) {
      let chosen = null;
      if (step.location.isFinal) {
        chosen = step.location.riddles[0];
      } else {
        const list = step.location.riddles;
        const base = (teamId || 0) + (progress.currentIndex || 0);
        const idx = Math.abs(base) % list.length;
        chosen = list[idx];
      }
      if (chosen) {
        riddleText = chosen.text;
        await prisma.teamLocationStep.update({ where: { id: step.id }, data: { riddleId: chosen.id } });
      }
    }
    // Do not reveal location name in the clue to avoid giving away the answer
    res.json({ current: { isFinal: step.location.isFinal }, riddle: riddleText });
  } catch (e) {
    res.status(500).json({ error: "Failed to load clue" });
  }
});

//---------------------------------------
// GAME: VERIFY QR ONLY (no selfie yet)
//---------------------------------------
app.post("/game/:teamId/verify-qr", async (req, res) => {
  const teamId = Number(req.params.teamId);
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "QR code required" });
  try {
    const progress = await prisma.teamProgress.findUnique({ where: { teamId } });
    if (!progress) return res.status(404).json({ error: "No progress. Spin first." });
    const step = await prisma.teamLocationStep.findFirst({
      where: { teamId, position: progress.currentIndex },
      include: { location: true }
    });
    if (!step) return res.status(404).json({ error: "No step found" });
    if (step.location.code !== code) return res.status(400).json({ error: "Invalid QR code for this step" });
    return res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to verify QR" });
  }
});

//---------------------------------------
// GAME: VERIFY QR AND UPLOAD SELFIE (gates next clue)
//---------------------------------------
app.post("/game/:teamId/verify-selfie", upload.single("selfie"), async (req, res) => {
  const teamId = Number(req.params.teamId);
  const { code } = req.body; // QR content
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  try {
    const progress = await prisma.teamProgress.findUnique({ where: { teamId } });
    if (!progress) return res.status(404).json({ error: "No progress. Spin first." });
    const step = await prisma.teamLocationStep.findFirst({
      where: { teamId, position: progress.currentIndex },
      include: { location: true }
    });
    if (!step) return res.status(404).json({ error: "No step found" });
    if (step.location.code !== code) return res.status(400).json({ error: "Invalid QR code for this step" });

    // Save selfie with location
    await prisma.selfie.create({
      data: { teamId, imageUrl: `/uploads/${req.file.filename}`, locationId: step.locationId }
    });

    // Advance progress
    const totalSteps = await prisma.teamLocationStep.count({ where: { teamId } });
    const nextIndex = progress.currentIndex + 1;
    const completed = nextIndex >= totalSteps;
    await prisma.teamProgress.update({
      where: { teamId },
      data: { currentIndex: nextIndex, lastUpdatedAt: new Date() }
    });

    let nextLocation = null;
    if (!completed) {
      const nextStep = await prisma.teamLocationStep.findFirst({
        where: { teamId, position: nextIndex },
        include: { location: true }
      });
      nextLocation = nextStep?.location || null;
    }

    res.json({ message: completed ? "Finished!" : "Step completed", next: nextLocation, completed });
  } catch (e) {
    res.status(500).json({ error: "Failed to verify selfie" });
  }
});
//---------------------------------------
// HEALTH + SERVER START
//---------------------------------------
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = Number(process.env.PORT || 5000);

// Seed/Upsert default locations/riddles on startup (idempotent)
(async () => {
  try {
    if (typeof upsertDefaultSpots === "function") {
      await upsertDefaultSpots();
    } else {
      await seedLocationsIfEmpty();
    }
    // Clean up any multiple final locations
    await cleanupMultipleFinals();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", err?.message || err);
  }
})();

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

//---------------------------------------
// SCHEDULED: HOURLY FULL EXPORT EMAIL
//---------------------------------------
async function sendFullExportEmail() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_TO, MAIL_FROM } = process.env;
  if (!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && MAIL_TO)) {
    return; // SMTP not configured
  }
  try {
    const teams = await prisma.team.findMany({ include: { members: true, selfies: true } });
    const rows = teams.flatMap(team => {
      const base = { TeamID: team.id, TeamName: team.teamName, CreatedAt: team.createdAt };
      const memberRows = team.members.length ? team.members.map(m => ({ ...base, MemberName: m.name })) : [{ ...base, MemberName: "" }];
      const selfieRows = team.selfies.map(s => ({ ...base, SelfieURL: s.imageUrl, SelfieAt: s.createdAt }));
      const merged = [];
      const maxLen = Math.max(memberRows.length, selfieRows.length, 1);
      for (let i = 0; i < maxLen; i++) {
        merged.push({
          ...base,
          MemberName: memberRows[i]?.MemberName || "",
          SelfieURL: selfieRows[i]?.SelfieURL || "",
          SelfieAt: selfieRows[i]?.SelfieAt || "",
        });
      }
      return merged;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    const xlsBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: MAIL_FROM || SMTP_USER,
      to: MAIL_TO,
      subject: `Treasure Hunt Registrations Export`,
      text: `Attached is the latest full registrations export.`,
      attachments: [{ filename: `registrations.xlsx`, content: xlsBuffer }],
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to send full export email:", err?.message || err);
  }
}

const intervalMinutes = Number(process.env.EXPORT_INTERVAL_MINUTES || 60);
if (!Number.isNaN(intervalMinutes) && intervalMinutes > 0) {
  setInterval(sendFullExportEmail, intervalMinutes * 60 * 1000);
}
