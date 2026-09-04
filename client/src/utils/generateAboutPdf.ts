import { jsPDF } from 'jspdf';

export const generateAboutPdf = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 16;

  // Helper for adding new page with header/footer
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 16;
      drawPageDecoration();
    }
  };

  const drawPageDecoration = () => {
    // Header line
    doc.setDrawColor(220, 38, 38); // Crimson red
    doc.setLineWidth(0.6);
    doc.line(margin, 10, pageWidth - margin, 10);

    // Footer
    const pageNum = (doc as any).internal.getCurrentPageInfo().pageNumber;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      'GramaFix Sri Lanka • Official Civic Platform Documentation • Academic Period: August – September 2026',
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  // -------------------------------------------------------------
  // PAGE 1: COVER & EXECUTIVE SUMMARY
  // -------------------------------------------------------------
  drawPageDecoration();

  // Red accent top banner
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('GramaFix Sri Lanka', margin + 6, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    'Community Issue Coordination & Prioritization Platform for Sri Lankan Neighborhoods',
    margin + 6,
    y + 17
  );

  y += 30;

  // Academic Period & Submission Metadata Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('ACADEMIC EVALUATION & TIMELINE DETAILS', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const metaRows = [
    ['Course / Module:', 'SE3090 – Software Engineering Frameworks (Assignment 2 – Mini Hackathon)'],
    ['Academic Period:', 'Semester 1 | Academic Term: August – September 2026 (Year 3)'],
    ['Development Sprint:', 'September 2026 (4-Hour Mini Hackathon Rapid Engineering Sprint)'],
    ['Date of Submission:', '4th September 2026'],
    ['Institution & Faculty:', 'SLIIT Faculty of Computing | BSc (Hons) in Information Technology - SE'],
    ['Live System URL:', 'https://mini-hack-clod.vercel.app/citizen'],
    ['GitHub Repository:', 'https://github.com/Raashidh-Rizvi/MiniHack'],
  ];

  let metaY = y + 12;
  metaRows.forEach(([lbl, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(lbl, margin + 4, metaY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(val, margin + 42, metaY);
    metaY += 4.2;
  });

  y += 48;

  // Development Team Attribution Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(185, 28, 28);
  doc.text('DEVELOPMENT & ENGINEERING TEAM', margin, y);
  y += 5;

  const team = [
    {
      num: 'Member 1',
      name: 'Raashidh M.R',
      id: 'IT24104191',
      role: 'Priority Queue & Feed Discovery',
      branch: 'feature/officer-portal',
      tasks: 'Community Feed discovery, category filtering, keyword search, priority queue display, Community Upvoting engine.',
    },
    {
      num: 'Member 2',
      name: 'Atheek M.F',
      id: 'IT24103933',
      role: 'Department Officer Portal & Reporting Journey',
      branch: 'feature/citizen-intake',
      tasks: 'Officer Dashboard (/officer), reporting journey & intake flow, field investigation notes, status lifecycle progression.',
    },
    {
      num: 'Member 3',
      name: 'Ahamed M.A.W',
      id: 'IT24103352',
      role: 'System Administrator',
      branch: 'IT24103352',
      tasks: 'Admin Dashboard (/admin), global queue moderation, officer assignment, session auth & role guards, audit logs.',
    },
  ];

  team.forEach((member) => {
    checkPageBreak(24);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${member.name} (${member.id})`, margin + 4, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text(`${member.num} • ${member.role}`, margin + 80, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Branch: ${member.branch}`, margin + 4, y + 10);

    doc.setTextColor(51, 65, 85);
    doc.text(`Key Contributions: ${member.tasks}`, margin + 4, y + 15, { maxWidth: contentWidth - 8 });

    y += 24;
  });

  // -------------------------------------------------------------
  // SECTION 1: WHY THIS IS THERE
  // -------------------------------------------------------------
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(185, 28, 28);
  doc.text('1. WHY THIS IS THERE (THE CIVIC CONTEXT)', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const whyText =
    'In Sri Lanka, local governance is distributed across 24 Municipal Councils (MC), 41 Urban Councils (UC), ' +
    '276 Pradeshiya Sabhas (PS), and over 14,000 Grama Niladhari (GN) divisions. Despite this structured framework, ' +
    'everyday community hazard management is severely handicapped by:\n\n' +
    '• Fragmented Channels: Citizens rely on paper letters, verbal requests, and unorganized WhatsApp groups.\n' +
    '• Bureaucratic Black Hole: Without digital tracking, reports vanish without any inspection or paper trail.\n' +
    '• Regional Neglect: Rural and suburban Pradeshiya Sabhas suffer prolonged delays compared to urban centers.\n\n' +
    'GramaFix bridges this divide by delivering a unified, standardized digital coordination platform connecting ' +
    'citizens, Grama Niladhari ward officers, and municipal executives.';

  const splitWhy = doc.splitTextToSize(whyText, contentWidth);
  doc.text(splitWhy, margin, y);
  y += splitWhy.length * 4.2 + 6;

  // -------------------------------------------------------------
  // SECTION 2: WHAT IT FIXES
  // -------------------------------------------------------------
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(185, 28, 28);
  doc.text('2. WHAT IT FIXES (THE 5 SYSTEMIC DILEMMAS SOLVED)', margin, y);
  y += 5;

  const dilemmas = [
    ['Dilemma 1: Lost Complaints', 'Replaces vanishing paper notes with permanent digital records, GPS coordinates, and photo proof.'],
    ['Dilemma 2: Political Favoritism', 'Eliminates subjective bias with a deterministic mathematical scoring formula.'],
    ['Dilemma 3: Duplicate Inundation', 'Community Upvoting allows neighbors to endorse existing issues rather than flooding phone lines.'],
    ['Dilemma 4: Lack of Transparency', 'Public 4-stage lifecycle (REPORTED -> UNDER REVIEW -> IN PROGRESS -> RESOLVED) with notes.'],
    ['Dilemma 5: Field Triage Chaos', 'Equips field officers with an interactive Leaflet OpenStreetMap queue sorted by priority.'],
  ];

  dilemmas.forEach(([title, desc]) => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${title}: `, margin + 2, y);

    const titleWidth = doc.getTextWidth(`• ${title}: `);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(desc, contentWidth - titleWidth - 4);
    doc.text(splitDesc, margin + 2 + titleWidth, y);
    y += Math.max(splitDesc.length * 4.2, 5.5);
  });
  y += 4;

  // -------------------------------------------------------------
  // SECTION 3: THE CORE GOAL & DETERMINISTIC SCORING
  // -------------------------------------------------------------
  checkPageBreak(38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(185, 28, 28);
  doc.text('3. THE CORE GOAL & DETERMINISTIC SCORING ENGINE', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const goalText =
    'The core goal of GramaFix is to establish a transparent, objective, and reproducible community priority queue. ' +
    'Every reported issue is automatically evaluated using our deterministic formula:';
  doc.text(doc.splitTextToSize(goalText, contentWidth), margin, y);
  y += 10;

  // Formula box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(185, 28, 28);
  doc.text(
    'Priority Score = (Severity x 0.40) + (Impact x 0.30) + (Urgency x 0.20) + (Age x 0.10)',
    margin + 4,
    y + 8.5
  );
  y += 18;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(
    '• Severity (40%): Hazard intensity (1–5)  • Impact (30%): Population & Upvotes (1–5)\n' +
      '• Urgency (20%): Time sensitivity (1–5)    • Age (10%): Days elapsed to avoid neglect',
    margin,
    y
  );
  y += 12;

  // -------------------------------------------------------------
  // SECTION 4: STRATEGIC FOCUS & 3-TIER ROLES
  // -------------------------------------------------------------
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(185, 28, 28);
  doc.text('4. STRATEGIC FOCUS (3-TIER CIVIC ROLES & GEOSPATIAL GIS)', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const focusText =
    '1. Citizen / Resident: Effortless mobile reporting with Leaflet GPS pinpointing, photo upload, and community upvoting.\n' +
    '2. Department Officer: Field inspection, investigation notes, photo verification, and status updates.\n' +
    '3. System Administrator: Holistic municipal queue moderation, role assignment, and audit logs.\n' +
    '4. Open-Source Geospatial Focus: Native Leaflet / OpenStreetMap integration without commercial API dependencies.';
  const splitFocus = doc.splitTextToSize(focusText, contentWidth);
  doc.text(splitFocus, margin, y);
  y += splitFocus.length * 4.2 + 6;

  // -------------------------------------------------------------
  // SECTION 5: WHY IT IS IMPORTANT
  // -------------------------------------------------------------
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(185, 28, 28);
  doc.text('5. WHY IT IS IMPORTANT (SOCIETAL & LIFE-SAFETY IMPACT)', margin, y);
  y += 5;

  const importanceText =
    '• Saving Lives: Fast-tracks dangerous submerged storm drains, open manholes, and live wires before tragedy strikes.\n' +
    '• Public Health & Dengue Control: Immediate reporting of stagnant drainage water and uncollected refuse piles.\n' +
    '• Budget Optimization: Directs limited municipal asphalt and heavy machinery to highest-impact community needs.\n' +
    '• Restoring Civic Trust: Transparent issue tracking turns civic cynicism into active community stewardship.';
  const splitImp = doc.splitTextToSize(importanceText, contentWidth);
  doc.text(splitImp, margin, y);
  y += splitImp.length * 4.2 + 8;

  // Sign-off note
  checkPageBreak(15);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(
    'GramaFix Sri Lanka © 2026. Built with civic care for resilient Sri Lankan neighborhoods. Submitted September 4, 2026.',
    margin,
    y
  );

  // Save PDF
  doc.save('GramaFix-Civic-Platform-Documentation-September-2026.pdf');
};
