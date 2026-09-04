# GramaFix 🇱🇰 — 2-Minute Video Recording Master Script

> **Assignment**: SE3090 Software Engineering Frameworks — Mini Hackathon  
> **Video Limit**: Strictly $\le$ 2 Minutes (Target: **1 Minute 55 Seconds / 115 Seconds**)  
> **Format**: Live Screen Recording with Voiceover  
> **Resolution**: 1080p Full Screen (1920x1080)

---

## 🎬 Pre-Recording Setup (Do this before pressing Record)

1. **Browser**: Open Google Chrome (or Edge).
2. **Clear clutter**: Hide the bookmarks bar (`Ctrl + Shift + B`) and close unrelated tabs.
3. **Open 5 Tabs in this exact order**:
   - **Tab 1**: `http://localhost:5173/` (or your deployed URL) — **Landing Page** (Scrolled to top)
   - **Tab 2**: `http://localhost:5173/report` — **Report Form**
   - **Tab 3**: `http://localhost:5173/issues` — **Community Feed**
   - **Tab 4**: `http://localhost:5173/officer` — **Officer Portal**
   - **Tab 5**: Live Deployed link (e.g. `https://gramafix.vercel.app`) in a **Chrome Incognito Window**
4. **DevTools Ready**: On Tab 3, press `F12` and toggle the device toolbar (`Ctrl + Shift + M`), set to **iPhone 14 / Mobile View**, but keep it docked or ready to toggle quickly.
5. **Mic Check**: Test your microphone to ensure your voice is clear and loud.

---

# ⏱️ The 115-Second Click-by-Click Video Script

---

### SCENE 1: Introduction & Sri Lankan Problem Statement
* **Duration**: 0:00 – 0:25 (25 Seconds)
* **Active Tab**: **Tab 1 (Landing Page)**

#### 🖱️ On-Screen Actions:
1. **[0:00 – 0:10]**: Cursor hovers briefly over the header title **"GramaFix"** and the badge **"Civic Intelligence Platform"**. Keep the page at the very top.
2. **[0:10 – 0:25]**: Smoothly scroll down to the red/dark bordered card titled **"Why Sri Lankan Communities Face Critical Repair Delays"**. Point your mouse at the 3 problem cards: *Monsoon Floods*, *Paper Petitions*, and *Subjective Triage*.

#### 🗣️ Spoken Voiceover (Read smoothly and clearly):
> *"Ayubowan and good day. We are Team [Your Group ID], presenting **GramaFix**—a community issue coordination and deterministic prioritization platform built for Sri Lanka.  
> Across our country's 14,000 Grama Niladhari divisions, neighborhood hazards like monsoon-blocked drains, damaged culverts, and water leaks take months to fix. Citizens rely on slow paper petitions that get lost, while local authorities lack transparent data to prioritize urgent repairs.  
> GramaFix solves this by replacing manual chaos with real-time reporting and an automated Community Priority Score."*

---

### SCENE 2: The Interactive Calculator & Solution Logic
* **Duration**: 0:25 – 0:40 (15 Seconds)
* **Active Tab**: **Tab 1 (Landing Page)**

#### 🖱️ On-Screen Actions:
1. **[0:25 – 0:32]**: Scroll back up to the Hero mockup on the right side.
2. **[0:32 – 0:37]**: In the **"Live Impact Simulation"** box, click the **"C" (Critical)** severity button, then drag the **"Affected Population"** slider from `120` to `350`.
3. **[0:37 – 0:40]**: Notice how the Score badge dynamically changes to **CRITICAL (90+ pts)**. Click the red button **"Report an Issue"** (or switch to Tab 2).

#### 🗣️ Spoken Voiceover:
> *"Our platform runs on a transparent mathematical scoring engine. By weighting severity at 40%, population impact at 30%, urgency at 20%, and age at 10%, every neighborhood issue receives an objective ranking score from 0 to 100."*

---

### SCENE 3: Citizen Intake & Input Validation (Requirements 4 & 5)
* **Duration**: 0:40 – 1:05 (25 Seconds)
* **Active Tab**: **Tab 2 (`/report` - Report Issue Page)**

#### 🖱️ On-Screen Actions:
1. **[0:40 – 0:46]**: **DO NOT type anything yet.** Scroll straight down to the bottom and click **"Submit Community Report"**.
   - *Result*: Show the red inline error messages popping up: *"Title is required"*, *"Please describe the community problem"*, *"Please specify location"*. (This proves Requirement 5).
2. **[0:46 – 0:58]**: Quickly fill in the sample data:
   - Click category chip: **"Drainage & Flooding"**
   - In Title, paste/type: `Blocked Canal Overflow near Matale Market`
   - In Description, paste/type: `Heavy monsoon rain has clogged the main culvert, causing dirty water to spill across school pedestrian paths.`
   - In Location, paste/type: `Trincomalee Street, Matale`
   - Click Severity: **"High"**
   - Drag Population slider to: **160 people**
   - Point cursor to the top right preview widget showing the estimated score: **78 / 100 (HIGH)**.
3. **[0:58 – 1:05]**: Click **"Submit Community Report"**.
   - *Result*: Green confirmation screen appears: **"Report Successfully Dispatched — Issue Registered"**.

#### 🗣️ Spoken Voiceover:
> *"Let's demonstrate citizen intake. If a resident submits incomplete details, our form triggers friendly inline validation errors.  
> When reporting a blocked monsoon canal in Matale affecting 160 residents with High severity, our algorithm immediately computes a priority score of 78 points. Upon submission, it is instantly dispatched into the live municipal queue."*

---

### SCENE 4: Community Feed, Search, Filter & Upvoting (Requirement 6)
* **Duration**: 1:05 – 1:25 (20 Seconds)
* **Active Tab**: **Tab 3 (`/issues` - Community Issues Feed)**

#### 🖱️ On-Screen Actions:
1. **[1:05 – 1:12]**: Click into the Search box and type: `Matale`.
   - *Result*: The list instantly filters to show Matale issues.
2. **[1:12 – 1:16]**: Click the **"Drainage & Flooding"** category pill at the top. Clear the search box.
   - *Result*: Feed updates live showing drainage issues and their priority scores.
3. **[1:16 – 1:25]**: On the top issue card, click the **"Support / Upvote"** thumbs-up button.
   - *Result*: Notice the support counter increments (e.g. from `18` to `19`), rallying community weight without creating duplicate tickets.

#### 🗣️ Spoken Voiceover:
> *"On the Community Feed, citizens can search keywords, filter across civic sectors like Drainage and Roads, and sort by urgency.  
> Rather than submitting duplicate complaints, neighbors can simply click 'Support' to add community weight to existing hazards."*

---

### SCENE 5: Mobile Responsiveness Showcase (Requirement 7)
* **Duration**: 1:25 – 1:35 (10 Seconds)
* **Active Tab**: **Tab 3 (`/issues`)**

#### 🖱️ On-Screen Actions:
1. **[1:25 – 1:30]**: Press `F12` (or click inspect) to reveal the **Mobile Device View** (iPhone 14 / 390px).
2. **[1:30 – 1:35]**: Scroll down to show that cards stack responsively, and highlight the **Bottom Navigation Bar** with icons (Home, Issues, Report, Profile).

#### 🗣️ Spoken Voiceover:
> *"GramaFix is completely responsive. On mobile screens, it adapts with a native-style bottom navigation bar, making it accessible for any citizen on any smartphone."*

---

### SCENE 6: Officer Triage & Status Lifecycle (Requirement 6 & 10)
* **Duration**: 1:35 – 1:47 (12 Seconds)
* **Active Tab**: **Tab 4 (`/officer` - Officer Management Portal)**

#### 🖱️ On-Screen Actions:
1. **[1:35 – 1:40]**: Point cursor to the ranked table showing Priority Scores and SLA badges.
2. **[1:40 – 1:47]**: Find the Matale issue. Click the **Status dropdown**, and change it from **"REPORTED"** to **"IN_PROGRESS"** (or **"RESOLVED"**). The badge changes color immediately.

#### 🗣️ Spoken Voiceover:
> *"In the Municipal Officer Portal, issues are automatically ordered by the deterministic priority score. Officers can review community evidence, assign crews, and advance the lifecycle from Reported to In Progress and Resolved."*

---

### SCENE 7: Live Cloud Deployment & Conclusion
* **Duration**: 1:47 – 1:55 (8 Seconds)
* **Active Tab**: **Tab 5 (Incognito Window showing live URL)**

#### 🖱️ On-Screen Actions:
1. **[1:47 – 1:52]**: Switch to the Chrome Incognito window. Highlight the address bar showing `https://gramafix.vercel.app` (or your live link).
2. **[1:52 – 1:55]**: Briefly scroll down the live landing page and end on the footer.

#### 🗣️ Spoken Voiceover:
> *"GramaFix is fully deployed and accessible on the public web via Vercel. Thank you for watching!"*

---

## 📊 Summary of Rubric Marks Proven in this Script

| Rubric Criteria | Marks | Exact Scene Where Proven |
| :--- | :---: | :--- |
| **Relevance of Sri Lankan Problem** | 10 | **Scene 1**: Direct explanation of 14,000 GN divisions, monsoon drains, paper petitions. |
| **Practicality & Creativity** | 15 | **Scene 2 & 4**: Deterministic mathematical formula and duplicate-preventing citizen upvotes. |
| **Minimum Functional Requirements** | 20 | **Scenes 1-6**: All 10 requirements demonstrated live on screen. |
| **Quality & Usability** | 15 | **Scene 3**: Inline validation error handling; rich dark/light UI design. |
| **Effective Tech & AI Use** | 10 | **Scenes 2 & 4**: Real-time scoring, React 18, Vite, Tailwind CSS, and REST API. |
| **Git & Documentation** | 10 | Covered in team GitHub repo & README. |
| **Successful Deployment** | 10 | **Scene 7**: Verified live in an Incognito browser window with zero localhost reliance. |
| **Quality of 2-Minute Demonstration** | 5 | **Total Duration: 115 Seconds** (Strictly within 120s limit, clear structure, no dead air). |
| **Contribution from all members** | 5 | Member voiceovers divided across the 7 scenes. |
| **TOTAL** | **100 / 100** | |

---

## 🎙️ Member Speaking Assignments (For 3 or 4 Members)

- **Member 1**: Scene 1 (Problem & Overview) & Scene 2 (Calculator) — `0:00 – 0:40`
- **Member 2**: Scene 3 (Citizen Intake & Validation) — `0:40 – 1:05`
- **Member 3**: Scene 4 (Feed & Upvoting) & Scene 5 (Mobile View) — `1:05 – 1:35`
- **Member 4 (or Member 3)**: Scene 6 (Officer Triage) & Scene 7 (Deployment & Closing) — `1:35 – 1:55`

---

## 💡 Quick Tips for the Best Grade
1. **Rehearse once with a stopwatch**: Make sure you hit between **1m 45s** and **1m 58s**.
2. **Do not type slowly during the video**: Have the sample text (`Blocked Canal Overflow near Matale Market`) copied on your clipboard (`Ctrl + V`) so typing takes only 2 seconds.
3. **Upload link check**: Upload to OneDrive or YouTube as **Unlisted**. Open the link in an incognito tab to ensure anyone can open it without logging into your personal Microsoft/Google account!
