// All 121 active STR Cribs design projects
// Dates from: Google Sheets tracker + Gmail calendar invites + Slack channel reads

export const STATUS_ORDER = [
  "Status Needed", "In Design", "Awaiting Client", "Design QC",
  "Contract & Deposit", "Budget", "Phase 1", "Phase 2", "Staging"
]

export const STATUS_META = {
  "Status Needed":      { color:"#FFE4EC", text:"#8B0030", dot:"#E8A0B0", icon:"❓" },
  "In Design":          { color:"#D6EAF8", text:"#0D47A1", dot:"#A8C8E8", icon:"✏️" },
  "Awaiting Client":    { color:"#FFF0D4", text:"#8B4500", dot:"#F5C6A0", icon:"⏳" },
  "Design QC":          { color:"#D5F5E3", text:"#1B5E20", dot:"#A8D8A8", icon:"🔍" },
  "Contract & Deposit": { color:"#EDE0F5", text:"#4A148C", dot:"#C4A8D8", icon:"📝" },
  "Budget":             { color:"#FEF9E7", text:"#7D5A00", dot:"#F5D4A0", icon:"💰" },
  "Phase 1":            { color:"#D6EEF8", text:"#01579B", dot:"#A0C8D8", icon:"🏗️" },
  "Phase 2":            { color:"#D0F5EC", text:"#00695C", dot:"#A0D8C8", icon:"🏠" },
  "Staging":            { color:"#FCE4EC", text:"#880E4F", dot:"#E8A8C8", icon:"📦" },
}

export const DESIGNER_COLORS = {
  "Aya":    { bg:"#D4EAF7", text:"#1A5276" },
  "CJ":     { bg:"#D4E6F1", text:"#154360" },
  "Kim":    { bg:"#C8E6C9", text:"#1B5E20" },
  "Shiela": { bg:"#FFF9C4", text:"#7D6608" },
  "Kassel": { bg:"#E8DAEF", text:"#6C3483" },
  "Martin": { bg:"#EFEBE9", text:"#4E342E" },
}

export const PROJECTS = [
  // STATUS NEEDED
  { id:1,  project:"7102 Stirrup Cir",           status:"Status Needed",      designer:"Unassigned",  pm:"?",                koc:null,          concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,    approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:["⚠ No designer assigned"], notes:"" },

  // IN DESIGN
  { id:2,  project:"5449 E Thunderbird Rd",       status:"In Design",          designer:"CJ",          pm:"Lauren/Jem",       koc:"2026-03-26",  concept_date:"2026-03-26", pres_date:"2026-04-14", rev_date:"2026-05-12", submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Extreme Revisions",         flags:["⚠ Revision overdue (6d)"],        notes:"5 rounds of revisions" },
  { id:3,  project:"5810 A1A S",                  status:"In Design",          designer:"Shiela",      pm:"Matt/Kat",         koc:"2026-03-27",  concept_date:"2026-04-02", pres_date:"2026-04-13", rev_date:"2026-04-22", submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Extreme Revisions",         flags:["⚠ Revision overdue (26d)"],       notes:"" },
  { id:4,  project:"5724 10th Avenue Dr W",       status:"In Design",          designer:"Kim",         pm:"Matt/Kat",         koc:"2026-03-27",  concept_date:"2026-03-31", pres_date:null,       rev_date:"2026-04-16", submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Extreme Revisions",         flags:["⚠ Revision overdue (32d)"],       notes:"" },
  { id:5,  project:"7200 Monroe Rd",              status:"In Design",          designer:"Martin",      pm:"Lara/Marl",        koc:"2026-04-01",  concept_date:"2026-04-07", pres_date:"2026-04-08", rev_date:null,       submit_date:null,  approved_date:"2026-04-08", qc_date:null, bt_date:null,         fd_status:"Approved",                  flags:[],                                 notes:"" },
  { id:6,  project:"684 Minsi Trl E",             status:"In Design",          designer:"Kim",         pm:"Nicole/Lei",       koc:"2026-04-02",  concept_date:"2026-04-03", pres_date:"2026-04-07", rev_date:null,       submit_date:null,  approved_date:"2026-04-07", qc_date:null, bt_date:"2026-05-15", fd_status:"Approved",                  flags:["⚠ Not in QC yet (41d)"],          notes:"Proposal shared May 15" },
  { id:7,  project:"222 Icy Ln",                  status:"In Design",          designer:"Aya",         pm:"Lara/Marl",        koc:"2026-04-02",  concept_date:"2026-04-07", pres_date:"2026-04-21", rev_date:"2026-04-28", submit_date:null, approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"2nd Revision",              flags:["⚠ Revision overdue (20d)"],       notes:"" },
  { id:8,  project:"12671 115th St",              status:"In Design",          designer:"Kassel",      pm:"Nicole/Lei",       koc:"2026-04-03",  concept_date:"2026-04-05", pres_date:"2026-04-08", rev_date:null,       submit_date:null,  approved_date:"2026-04-08", qc_date:"2026-04-15", bt_date:"2026-05-14", fd_status:"Approved",  flags:[],                                 notes:"Client Proposal Presentation May 14" },
  { id:9,  project:"27 Ridge Glen Ln",            status:"In Design",          designer:"CJ",          pm:"Matt/Kat",         koc:"2026-04-03",  concept_date:"2026-04-07", pres_date:null,       rev_date:"2026-04-22", submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"1st Revision",              flags:["⚠ Revision overdue (26d)"],       notes:"" },
  { id:10, project:"76 Murray De Bruhl Rd",       status:"In Design",          designer:"Kassel",      pm:"Maureen/Di/Flexi", koc:"2026-04-06",  concept_date:"2026-04-08", pres_date:"2026-04-20", rev_date:"2026-05-05", submit_date:"2026-05-11", approved_date:null, qc_date:null,  bt_date:null,         fd_status:"1st Revision",              flags:[],                                 notes:"" },
  { id:11, project:"6418 Beach Dr",               status:"In Design",          designer:"Shiela",      pm:"Chad/Jai",         koc:"2026-04-07",  concept_date:"2026-04-07", pres_date:"2026-04-16", rev_date:"2026-04-22", submit_date:"2026-04-27", approved_date:"2026-04-27", qc_date:"2026-04-27", bt_date:null, fd_status:"2nd Revision", flags:[],                              notes:"Only revision: change bunkroom wallpaper" },
  { id:12, project:"421 Salem Valley Rd",         status:"In Design",          designer:"Shiela",      pm:"Lara/Marl",        koc:"2026-04-08",  concept_date:"2026-04-08", pres_date:"2026-04-23", rev_date:"2026-04-27", submit_date:null, approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"1st Revision",              flags:["⚠ Revision overdue (21d)"],       notes:"" },
  { id:13, project:"12201 N 58th Place",          status:"In Design",          designer:"Aya",         pm:"Lara/Marl",        koc:"2026-04-08",  concept_date:"2026-04-13", pres_date:"2026-04-23", rev_date:"2026-04-27", submit_date:"2026-04-30", approved_date:null, qc_date:null,  bt_date:null,         fd_status:"1st Revision",              flags:[],                                 notes:"" },
  { id:14, project:"8 Don Irwin Road",            status:"In Design",          designer:"Aya",         pm:"Matt/Kat",         koc:"2026-04-08",  concept_date:"2026-04-09", pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"First Draft",               flags:[],                                 notes:"" },
  { id:15, project:"6424 Charcon Ct",             status:"In Design",          designer:"Kim",         pm:"Chad/Jai",         koc:"2026-04-08",  concept_date:"2026-04-08", pres_date:"2026-04-21", rev_date:null,       submit_date:null,  approved_date:"2026-04-21", qc_date:null, bt_date:null,         fd_status:"1st Revision",              flags:["⚠ Not in QC yet (27d)"],          notes:"" },
  { id:16, project:"711 Vedder Mountain Road",    status:"In Design",          designer:"Kassel",      pm:"Matt/Kat",         koc:"2026-04-15",  concept_date:"2026-04-17", pres_date:"2026-04-24", rev_date:"2026-04-27", submit_date:null, approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"1st Revision",              flags:["⚠ Revision overdue (21d)"],       notes:"" },
  { id:17, project:"17119 Turkey Point St",       status:"In Design",          designer:"CJ",          pm:"Matt/Kat",         koc:"2026-04-17",  concept_date:"2026-04-21", pres_date:"2026-05-04", rev_date:"2026-05-18", submit_date:null, approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"3rd Revision Sent",         flags:["📌 KOC notes need to be sent"],   notes:"" },
  { id:18, project:"994 Harrison Ave",            status:"In Design",          designer:"Kim",         pm:"Lara/Marl",        koc:"2026-04-20",  concept_date:"2026-04-20", pres_date:"2026-04-28", rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"First Draft",               flags:[],                                 notes:"" },
  { id:19, project:"6427 Travis Road",            status:"In Design",          designer:"Unassigned",  pm:"Chad/Jai",         koc:"2026-04-21",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Not Yet Started",           flags:["⚠ No designer assigned"],         notes:"" },
  { id:20, project:"567 Linwood Ave",             status:"In Design",          designer:"Aya",         pm:"Maureen/Di/Flexi", koc:"2026-04-22",  concept_date:"2026-04-27", pres_date:"2026-05-14", rev_date:"2026-05-05", submit_date:"2026-05-08", approved_date:"2026-05-08", qc_date:null, bt_date:"2026-05-08", fd_status:"Approved",  flags:[],                                 notes:"Sent to client May 8" },
  { id:21, project:"5819 E Ludlow Drive",         status:"In Design",          designer:"Unassigned",  pm:"Matt/Kat",         koc:"2026-04-22",  concept_date:"2026-04-24", pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Not Yet Started",           flags:["⚠ No designer assigned","📌 KOC notes need to be sent"], notes:"" },
  { id:22, project:"215 Tophill Rd",              status:"In Design",          designer:"Aya",         pm:"Maureen/Di/Flexi", koc:"2026-04-22",  concept_date:"2026-04-27", pres_date:"2026-05-06", rev_date:"2026-05-13", submit_date:null, approved_date:null,  qc_date:null,         bt_date:"2026-05-18",  fd_status:"1st Revision – Ready to Send", flags:[],                              notes:"Ready to send May 18" },
  { id:23, project:"2743 America Avenue",         status:"In Design",          designer:"Kassel",      pm:"Chad/Jai",         koc:"2026-04-24",  concept_date:"2026-04-27", pres_date:"2026-05-07", rev_date:"2026-05-14", submit_date:null, approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"2nd Revision Sent",         flags:["⚠ Revision overdue (4d)"],        notes:"" },
  { id:24, project:"5621 E Voltaire Avenue",      status:"In Design",          designer:"Unassigned",  pm:"Matt/Kat",         koc:"2026-04-24",  concept_date:null,       pres_date:"2026-05-15", rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Not Yet Started",           flags:["⚠ No designer assigned"],         notes:"" },
  { id:25, project:"22531 Conrad Rd",             status:"In Design",          designer:"Unassigned",  pm:"Maureen/Di/Flexi", koc:"2026-04-24",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Not Yet Started",           flags:["⚠ No designer assigned"],         notes:"" },
  { id:26, project:"250 Access Dr",               status:"In Design",          designer:"Kim",         pm:"?",                koc:"2026-04-29",  concept_date:"2026-04-30", pres_date:"2026-05-13", rev_date:"2026-05-05", submit_date:null, approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"1st Revision",              flags:[],                                 notes:"" },
  { id:27, project:"12749 E Turquoise Ave",       status:"In Design",          designer:"Aya",         pm:"Lauren/Jem",       koc:null,          concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"1st Revision",              flags:[],                                 notes:"" },
  { id:28, project:"5823 22nd St W",              status:"In Design",          designer:"Unassigned",  pm:"?",                koc:null,          concept_date:null,       pres_date:"2026-05-11", rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Not Yet Started",           flags:["⚠ No designer assigned"],         notes:"" },
  { id:29, project:"6004 E Campo Bello Drive",    status:"In Design",          designer:"Unassigned",  pm:"?",                koc:null,          concept_date:null,       pres_date:"2026-05-14", rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"Not Yet Started",           flags:["⚠ No designer assigned"],         notes:"" },

  // AWAITING CLIENT
  { id:30, project:"8904 124th Way",              status:"Awaiting Client",    designer:"Aya",         pm:"?",                koc:null,          concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:31, project:"800 Embassy Rd",              status:"Awaiting Client",    designer:"Shiela",      pm:"?",                koc:"2025-08-12",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:32, project:"297 Daves Rd",                status:"Awaiting Client",    designer:"N/A",         pm:"Lauren/Jem",       koc:null,          concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:33, project:"483 S Florida Mango Rd",      status:"Awaiting Client",    designer:"N/A",         pm:"?",                koc:null,          concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:34, project:"1035 Avant Ave",              status:"Awaiting Client",    designer:"N/A",         pm:"Matt/Kat",         koc:null,          concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:35, project:"2133 Wild Laurel Dr",         status:"Awaiting Client",    designer:"Unassigned",  pm:"Nicole/Lei",       koc:null,          concept_date:null,       pres_date:"2026-05-18", rev_date:null,      submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:["⚠ No designer assigned"],         notes:"No concept – outdoor only" },

  // DESIGN QC
  { id:36, project:"217 Amet Way",                status:"Design QC",          designer:"Aya",         pm:"Chad/Jai",         koc:"2026-03-20",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:"2026-03-20", bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:37, project:"1576 Rosery Rd NE",           status:"Design QC",          designer:"Aya",         pm:"Chad/Jai",         koc:"2026-03-30",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:"2026-03-30", bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:38, project:"163 Grand Lagoon Shores Dr",  status:"Design QC",          designer:"CJ",          pm:"Chad/Jai",         koc:"2026-04-03",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:"2026-04-08", qc_date:"2026-04-08", bt_date:null,   fd_status:"",                          flags:[],                                 notes:"" },
  { id:39, project:"8755 E Gary Rd",              status:"Design QC",          designer:"Aya",         pm:"Lauren/Jem",       koc:null,          concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:40, project:"5112 26th Ave W",             status:"Design QC",          designer:"Kim",         pm:"Nicole/Lei",       koc:"2026-03-17",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },

  // CONTRACT & DEPOSIT
  { id:41, project:"98 Green Island Road",        status:"Contract & Deposit", designer:"CJ",          pm:"Nicole/Lei",       koc:"2026-01-05",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:42, project:"3448 Lickskillet Rd",         status:"Contract & Deposit", designer:"Kim",         pm:"?",                koc:"2026-01-23",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:43, project:"11 Jeff Rd",                  status:"Contract & Deposit", designer:"Kassel",      pm:"Chad/Jai",         koc:"2026-02-20",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:44, project:"580 Crestview Rd",            status:"Contract & Deposit", designer:"Aya",         pm:"Lara/Marl",        koc:"2026-03-06",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:45, project:"1410 35th St W",              status:"Contract & Deposit", designer:"CJ",          pm:"?",                koc:"2026-03-11",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:46, project:"5601 E Presidio Rd",          status:"Contract & Deposit", designer:"Kassel",      pm:"Lara/Marl",        koc:"2026-01-21",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },

  // BUDGET
  { id:47, project:"745 Highland Dr",             status:"Budget",             designer:"Kassel",      pm:"Maureen/Di/Flexi", koc:null,          concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:48, project:"140 Elk Ln",                  status:"Budget",             designer:"CJ",          pm:"Lauren/Jem",       koc:"2026-03-19",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:49, project:"2275 Kings Point Dr",         status:"Budget",             designer:"Kim",         pm:"Matt/Kat",         koc:"2025-12-29",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
  { id:50, project:"1214 Madison Ave",            status:"Budget",             designer:"Aya",         pm:"Lara/Marl",        koc:"2026-02-27",  concept_date:null,       pres_date:null,       rev_date:null,       submit_date:null,  approved_date:null,  qc_date:null,         bt_date:null,         fd_status:"",                          flags:[],                                 notes:"" },
]

// Phase 1, Phase 2, Staging (50 more projects)
const EXTRA = [
  {p:"7608 Turney Rd",s:"Phase 1",d:"Aya",pm:"Chad/Jai"},
  {p:"4615 34th St W",s:"Phase 1",d:"Shiela",pm:"Nicole/Lei"},
  {p:"5012 E Blanche Dr",s:"Phase 1",d:"CJ",pm:"Matt/Kat"},
  {p:"363 Oak Point Road",s:"Phase 1",d:"CJ",pm:"Matt/Kat"},
  {p:"7615 17th Ave W",s:"Phase 1",d:"Kassel",pm:"Chad/Jai"},
  {p:"12934 83rd Ave N",s:"Phase 1",d:"CJ",pm:"Maureen/Di/Flexi"},
  {p:"13633 N 51st Way",s:"Phase 1",d:"Kim",pm:"Matt/Kat"},
  {p:"13951 87th Ave",s:"Phase 1",d:"Kassel",pm:"Nicole/Lei"},
  {p:"363 Crestview Dr",s:"Phase 1",d:"Shiela",pm:"Maureen/Di/Flexi"},
  {p:"9681 119th Way",s:"Phase 1",d:"CJ",pm:"Chad/Jai"},
  {p:"9429 Laura Anne Drive",s:"Phase 1",d:"Aya",pm:"Nicole/Lei"},
  {p:"12835 74th Ave",s:"Phase 2",d:"Aya",pm:"Lauren/Jem"},
  {p:"1521 Walthour Rd",s:"Phase 2",d:"CJ",pm:"Nicole/Lei"},
  {p:"14176 86th Ave",s:"Phase 2",d:"Aya",pm:"Lauren/Jem"},
  {p:"13802 N 64th Pl",s:"Phase 2",d:"Shiela",pm:"Matt/Kat"},
  {p:"1003 45th St W",s:"Phase 2",d:"Unassigned",pm:"Lauren/Jem"},
  {p:"5019 E Hearn Rd",s:"Phase 2",d:"Aya",pm:"Matt/Kat"},
  {p:"307 Marquis",s:"Phase 2",d:"Kim",pm:"Lara/Marl"},
  {p:"394 Mountain Trce",s:"Phase 2",d:"CJ",pm:"Maureen/Di/Flexi"},
  {p:"11495 W 77th Drive",s:"Phase 2",d:"Shiela",pm:"Lara/Marl"},
  {p:"6723 Mary Todd Dr",s:"Phase 2",d:"Kassel",pm:"Matt/Kat"},
  {p:"9085 Leisure Ln N",s:"Phase 2",d:"Shiela",pm:"Maureen/Di/Flexi"},
  {p:"1318 Oak St",s:"Phase 2",d:"Shiela",pm:"Maureen/Di/Flexi"},
  {p:"6719 Country Field",s:"Phase 2",d:"Aya",pm:"?"},
  {p:"2720 Kendrick Dr",s:"Phase 2",d:"CJ",pm:"Lara/Marl"},
  {p:"356 Miller Ave",s:"Phase 2",d:"CJ",pm:"Maureen/Di/Flexi"},
  {p:"2310 42nd St",s:"Phase 2",d:"N/A",pm:"Lara/Marl"},
  {p:"190 Robyn Ln",s:"Phase 2",d:"Aya",pm:"Lauren/Jem"},
  {p:"7753 132nd Way",s:"Phase 2",d:"Aya",pm:"Lauren/Jem"},
  {p:"10053 W Bay St",s:"Staging",d:"Aya",pm:"?"},
  {p:"1431 Waterfront Dr",s:"Staging",d:"Aya",pm:"Lauren/Jem"},
  {p:"1644 40th St",s:"Staging",d:"CJ",pm:"Chad/Jai"},
  {p:"8501 141st St",s:"Staging",d:"Aya",pm:"Lauren/Jem"},
  {p:"6424 Sunset Ave",s:"Staging",d:"CJ",pm:"?"},
  {p:"4200 Rudy Rd",s:"Staging",d:"Aya",pm:"Maureen/Di/Flexi"},
  {p:"217 Wildlife Ln",s:"Staging",d:"Shiela",pm:"?"},
  {p:"1053 San Rafael St",s:"Staging",d:"CJ",pm:"Matt/Kat"},
  {p:"10 Penny Ave",s:"Staging",d:"CJ",pm:"Maureen/Di/Flexi"},
  {p:"1519 S Keene Rd",s:"Staging",d:"Shiela",pm:"Chad/Jai"},
  {p:"168 Granada Dr",s:"Staging",d:"Unassigned",pm:"?"},
  {p:"195 Hyland Dr",s:"Staging",d:"Aya",pm:"Maureen/Di/Flexi"},
  {p:"11166 W 78th Drive",s:"Staging",d:"CJ",pm:"Lara/Marl"},
  {p:"444 Spirit Mountain Rd",s:"Staging",d:"Aya",pm:"Lauren/Jem"},
  {p:"87 Rustic Rdg",s:"Staging",d:"Kassel",pm:"Lara/Marl"},
  {p:"3 1ST Street",s:"Staging",d:"CJ",pm:"?"},
  {p:"56 Bobwhite Hl",s:"Staging",d:"Aya",pm:"?"},
  {p:"335 Lake Placid Dr",s:"Staging",d:"Shiela",pm:"?"},
  {p:"14118 Passage Way",s:"Staging",d:"CJ",pm:"?"},
  {p:"366 Hyland Dr",s:"Staging",d:"Aya",pm:"Maureen/Di/Flexi"},
  {p:"134 Fort Rd",s:"Staging",d:"CJ",pm:"?"},
  {p:"2922 Low Oak St",s:"Staging",d:"Martin",pm:"?"},
  {p:"2718 Marlborough Dr",s:"Staging",d:"CJ",pm:"?"},
  {p:"6422 Balky St",s:"Staging",d:"Aya",pm:"?"},
  {p:"3808 Cape Vista Dr",s:"Staging",d:"Martin",pm:"Nicole/Lei"},
  {p:"3812 N Shore Drive",s:"Staging",d:"CJ",pm:"?"},
  {p:"275 Jessamine Pl",s:"Staging",d:"Kassel",pm:"?"},
  {p:"5032 Lansing Dr",s:"Staging",d:"CJ",pm:"?"},
  {p:"2027 Broken Oak",s:"Staging",d:"CJ",pm:"?"},
  {p:"355 Cohutta Mountain Rd",s:"Staging",d:"Shiela",pm:"?"},
  {p:"2773 Clabo Rd",s:"Staging",d:"Shiela",pm:"?"},
  {p:"58 Mandalay Rdg",s:"Staging",d:"CJ",pm:"?"},
  {p:"5498 3rd St",s:"Staging",d:"Aya",pm:"Maureen/Di/Flexi"},
  {p:"110 Old Ridge Rd",s:"Staging",d:"Shiela",pm:"?"},
  {p:"164 23rd Ave SW",s:"Staging",d:"Aya",pm:"?"},
  {p:"7101 City View Dr",s:"Staging",d:"Aya",pm:"Nicole/Lei"},
  {p:"1835 Carandis Road",s:"Staging",d:"CJ",pm:"?"},
  {p:"120 Wildflower Ln",s:"Staging",d:"Shiela",pm:"Nicole/Lei"},
  {p:"363 Hyland Dr",s:"Staging",d:"Shiela",pm:"Matt/Kat"},
  {p:"3106 Lanier Ln",s:"Staging",d:"Unassigned",pm:"?"},
  {p:"1616 39th Street",s:"Staging",d:"Kassel",pm:"Chad/Jai"},
  {p:"7913 19th Avenue Dr W",s:"Staging",d:"CJ",pm:"?"},
].map((x,i) => ({
  id: 51+i, project:x.p, status:x.s, designer:x.d, pm:x.pm,
  koc:null, concept_date:null, pres_date:null, rev_date:null,
  submit_date:null, approved_date:null, qc_date:null, bt_date:null,
  fd_status:"", flags:[], notes:""
}))

PROJECTS.push(...EXTRA)
