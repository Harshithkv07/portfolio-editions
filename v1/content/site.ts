/* ============================================================================
   EVERYTHING YOU WILL EVER NEED TO EDIT LIVES IN THIS FILE.

   Change the text between the quote marks. Save. The site updates.
   You do not need to touch any other file to change words or links.

   Lines marked  <- VERIFY  still need checking.
   ========================================================================== */

export type RhythmRow = {
  index: string;
  time: string;
  label: string;
  detail: string;
};

export type WorkItem = {
  index: string;
  title: string;
  kind: string;
  year: string;
  blurb: string;
  stack: string[];
  href?: string;
  /** Matches a filename in content/images/source/ (without extension). */
  image?: string;
  /** Grid footprint on desktop:
      "std"  = one column, "wide" = two, "full" = the whole row,
      "tall" = one column but two rows deep. */
  span?: "wide" | "tall" | "full" | "std";
};

export const site = {
  /* --- Identity ---------------------------------------------------------- */

  name: "Harshith K V", // <- VERIFY spelling and how you want it set
  shortName: "Harshith",
  role: "Builder", // the tiny label beside the nav mark

  /** The one line people remember. Keep it under about ten words. */
  positioning: "I build software, and a company called Metanoia.", // <- VERIFY

  /** Sits in the browser tab and in link previews. */
  meta: {
    title: "Harshith K V",
    description: "Builder. Founder of Metanoia. Software, shipped daily.", // <- VERIFY
    url: "https://example.com", // <- VERIFY once you have a domain
  },

  /* --- The dated strip near the top -------------------------------------- */
  /* Update whenever you feel like it. It is the only thing on the site that
     goes stale, and it is deliberately one line so that stays cheap.        */

  currently: {
    date: "September 2026", // <- VERIFY
    text: "Building Metanoia. Shipping PGPilot. Learning in public.", // <- VERIFY
  },

  /* --- About ------------------------------------------------------------- */

  about: {
    eyebrow: "About",
    /** Big statement type. Two or three short sentences maximum. */
    statement:
      "I make things that work offline, load fast, and do not ask permission to be useful.",
    /** Supporting paragraphs, right-hand column. */
    body: [
      "I study artificial intelligence and data science, which is a long way of saying I spend most of my time building things and finding out where they break.", // <- VERIFY
      "Most of what I ship starts as an irritation with software that already exists. PGPilot came out of wanting a tool that still worked when the network did not. Metanoia came out of wanting to do that on purpose, and at scale.", // <- VERIFY
    ],
    /** Small facts, set in mono. Keep them short and true. */
    facts: [
      { k: "Based", v: "Coimbatore, India" },
      { k: "Age", v: "19" }, // <- update on your birthday
      { k: "Field", v: "AI and Data Science" },
      { k: "Building", v: "Metanoia" },
      { k: "Open to", v: "Collaboration" },
    ],
  },

  /* --- The daily rhythm section ------------------------------------------ */
  /* These are the rows the blue band slides between as you scroll.
     Four to six rows works best. Fewer feels thin, more feels like a list.  */

  rhythm: {
    eyebrow: "A Day",
    heading: "How the Hours Actually Go.",
    rows: [
      {
        index: "01",
        time: "06:30",
        label: "Read",
        detail:
          "Before anything else has a claim on the day. Papers, documentation, whatever I did not understand yesterday.",
      },
      {
        index: "02",
        time: "09:00",
        label: "Build",
        detail:
          "The long block. One problem, no notifications, until it either works or I understand exactly why it does not.",
      },
      {
        index: "03",
        time: "14:00",
        label: "Ship",
        detail:
          "Whatever moved forward in the morning goes out. A commit, a build, a release. Unshipped work does not count.",
      },
      {
        index: "04",
        time: "17:00",
        label: "Learn",
        detail:
          "Coursework, and the parts of the field that are not useful to me yet. This is the part that compounds.",
      },
      {
        index: "05",
        time: "21:00",
        label: "Think",
        detail:
          "Metanoia. Where it goes next, what it should refuse to become, and what I am currently wrong about.",
      },
    ] as RhythmRow[], // <- VERIFY all of the above against your actual day
  },

  /* --- Work -------------------------------------------------------------- */

  work: {
    eyebrow: "Selected Work",
    heading: "Things I Have Built.",
    items: [
      {
        index: "01",
        title: "PGPilot",
        kind: "Offline-first application",
        year: "2026", // <- VERIFY
        blurb:
          "A tool built to keep working when the connection does not. Runs on Android and Windows from one codebase, with automated builds on every push.", // <- VERIFY
        stack: ["Flutter", "Dart", "GitHub Actions"],
        span: "wide",
        image: "work-pgpilot",
      },
      {
        index: "02",
        title: "Metanoia",
        kind: "Company",
        year: "2026", // <- VERIFY
        blurb: "The reason for most of the rest of this page. More below.",
        stack: ["In progress"],
        span: "std",
      },
      {
        index: "03",
        title: "This Site",
        kind: "Personal",
        year: "2026",
        blurb:
          "Three colours, one typeface, and a dithering pipeline. Built to a reference, then taken apart and rebuilt properly.",
        stack: ["Next.js", "GSAP", "Sharp"],
        span: "full",
      },
    ] as WorkItem[],
  },

  /* --- Metanoia ---------------------------------------------------------- */
  /* The emotional peak of the page. Full-bleed blue. Say less.              */

  metanoia: {
    eyebrow: "The Company",
    wordmark: "Metanoia",
    /** What the word literally means. Set small, above the statement. */
    definition: "metanoia — a change of mind; a turning.",
    /** This should be the best sentence on the whole site. */
    statement:
      "Software that changes how the work is done, not just how it looks.", // <- REPLACE with what Metanoia actually does
    body: [
      "Metanoia is the company I am building.", // <- VERIFY
      "Tell me in one sentence what it does and this paragraph becomes something true.", // <- REPLACE ME
    ],
    /** Three short principles, stacked with plus marks between them. */
    principles: ["Useful", "Offline", "Honest"], // <- VERIFY
    href: "", // add a link when Metanoia has a site of its own
  },

  /* --- Contact ----------------------------------------------------------- */

  contact: {
    eyebrow: "Get In Touch",
    heading: "Say Something.",
    line: "Open to collaboration, and to being told I am wrong.",

    /* A form instead of a published address, so your email never appears in
       the page source for scrapers to harvest.

       TO SWITCH IT ON:
         1. Go to https://formspree.io and make a free account.
         2. Create a form. It gives you an endpoint that looks like
            https://formspree.io/f/abcdwxyz
         3. Paste it below. Formspree emails you whatever people send.

       Your address lives in your Formspree account, never in this repo.
       While `endpoint` is empty the form is hidden and only your links show,
       so nothing broken ever ships.                                          */
    form: {
      endpoint: "", // <- paste your Formspree endpoint here
      success: "Thanks — I'll come back to you.",
      failure: "That did not send. Try again, or reach me on one of the links below.",
    },
    links: [
      // Add your username to the end of the URL. Links left empty are hidden
      // on the page and left out of the search-engine data, so an unfinished
      // one never ships as a dead link.
      { label: "GitHub", href: "" }, // <- e.g. https://github.com/harshithkv
      { label: "LinkedIn", href: "" }, // <- VERIFY or delete this line
      { label: "X", href: "" }, // <- VERIFY or delete this line
    ],
  },

  /* --- The hub -----------------------------------------------------------
     The home page is a board of tiles. Each tile is a door to its own page.

     Reorder this list and the board reorders with it. Delete an entry and both
     the tile and its page disappear from navigation — you would also delete the
     matching folder in app/ to remove the page itself.

     span controls the tile's footprint on the board:
       "hero"     full width, short          "wide"  two columns
       "tall"     one column, two rows       "std"   one square
       "slim"     one narrow column, tall
                                                                            */

  pages: [
    {
      slug: "about",
      index: "01",
      title: "About",
      hint: "Who I am, and what I keep building.",
      span: "tall",
      visual: "portrait",
    },
    {
      slug: "day",
      index: "02",
      title: "A Day",
      hint: "How the hours actually go.",
      span: "wide",
      visual: "rows",
    },
    {
      slug: "work",
      index: "03",
      title: "Work",
      hint: "Things I have built.",
      span: "std",
      visual: "index",
    },
    {
      slug: "metanoia",
      index: "04",
      title: "Metanoia",
      hint: "The company.",
      span: "std",
      visual: "blue",
    },
    {
      slug: "colophon",
      index: "05",
      title: "Colophon",
      hint: "Three colours, one typeface, one idea.",
      span: "std",
      visual: "swatches",
    },
    {
      slug: "contact",
      index: "06",
      title: "Contact",
      hint: "Say something.",
      span: "std",
      visual: "arrow",
    },
  ] as const,

  /* --- Colophon ----------------------------------------------------------
     The page that explains the design system. Delete the entry above and this
     page stops being linked. Kept because a site that looks designed should be
     able to say what the design is.                                          */

  colophon: {
    eyebrow: "Colophon",
    heading: "How This Was Made.",
    intro:
      "Three colours, one typeface, and one idea repeated until it became a system.",
    notes: [
      {
        k: "Colour",
        v: "Electric blue, black, white. Nothing else. Every dim state is opacity on white rather than a new grey, which is what keeps the palette from drifting.",
      },
      {
        k: "Type",
        v: "Geist, in three weights. Tracking tightens as size grows, which is most of why large type here reads as deliberate rather than merely big.",
      },
      {
        k: "Images",
        v: "Every photograph is reduced to a two-colour ordered dither at build time — a regular dot grid rather than noise, mapped from black to blue.",
      },
      {
        k: "Motion",
        v: "Entrances are masked per line of text. Everything stops entirely if your system asks for reduced motion.",
      },
    ],
  },

};

export type Site = typeof site;
