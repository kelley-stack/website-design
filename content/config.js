/**
 * WEST FORK SITE CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * This is the one file you update for all routine changes.
 * Tell Claude Code: "update the price", "hide the open house", "change the
 * agent email" — changes land here, nowhere else.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const SITE_CONFIG = {

  // ─── OPEN HOUSE ───────────────────────────────────────────────────────────
  // Set active: false to hide the banner and modal entirely
  openHouse: {
    active: true,
    date:   "Sunday, April 19th",
    time:   "2:00 PM – 4:00 PM",
    address: "4817 West Fork Blvd, Conroe, TX 77304",
    // Google Calendar link — update dates (format: YYYYMMDDTHHmmSSZ / UTC)
    googleCalendarUrl: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Open+House+%E2%80%93+4817+West+Fork+Blvd&dates=20260419T190000Z/20260419T210000Z&details=West+Fork+Estates+Open+House.+Golf+course+and+river+views.+Kelley+Bouchard%2C+Realty+of+America+979-255-7324&location=4817+West+Fork+Blvd,+Conroe,+TX+77304",
  },

  // ─── PROPERTY 1 — THE ESTATE HOME ─────────────────────────────────────────
  home: {
    address:    "4817 West Fork Blvd",
    city:       "Conroe, TX 77304",
    price:      "$590,000",
    beds:       "4",
    baths:      "4 Full / 1 Half",
    built:      "2007",
    style:      "Traditional",
    sqft:       "4,054",
    acres:      "0.67",
    garage:     "2",
    description: "4 Beds · 4 Full / 1 Half Baths · Built 2007 · Traditional Style",
    features: [
      "Dual-view: championship fairways + San Jacinto River basin",
      "Resort-style primary suite with spa bath",
      "Chef's kitchen open to living and golf course views",
      "Expansive covered back porch — golf and river views",
      "Private study, formal dining, game room",
      "Two-car garage plus generous driveway",
    ],
  },

  // ─── PROPERTY 2 — THE WOODED LOT ──────────────────────────────────────────
  lot: {
    address:    "4815 West Fork Blvd",
    city:       "Conroe, TX 77304",
    price:      "$90,000",
    acres:      "0.64",
    sqftLot:    "27,784",
    zip:        "77304",
    description: "Adjacent wooded lot · Ready to build your custom dream home or combine with 4817 West Fork Estate",
    features: [
      "Signature rolling terrain with mature majestic tree canopy",
      "Backs to San Jacinto River greenbelt",
      "Adjacent to 4817 estate — ideal combined compound",
      "Golf course community — The Links at West Fork",
      "Unrivaled potential for a custom legacy build or private compound",
      "Deed restrictions in place (West Fork 03)",
    ],
  },

  // ─── COMPOUND (combined) ──────────────────────────────────────────────────
  compound: {
    totalAcres:      "1.2+",
    combinedPrice:   "$680,000",
    homePriceLabel:  "4817 Estate Home",
    lotPriceLabel:   "4815 Wooded Lot",
  },

  // ─── HERO STATS ───────────────────────────────────────────────────────────
  heroStats: [
    { num: "4BR / 4.5BA",   label: "Beds & Baths"  },
    { num: "4,054",         label: "Sq Ft"          },
    { num: "1.2+",          label: "Total Acres"    },
    { num: "$590K | $90K",  label: "List Price"     },
  ],

  // ─── AGENT CONTACT ────────────────────────────────────────────────────────
  agent: {
    name:    "Kelley Bouchard",
    title:   "Realty of America, LLC · Listing Agent",
    phone:   "979-255-7324",
    email:   "k.bouchard@realtyofamerica.com",
  },

  // ─── FOOTER ───────────────────────────────────────────────────────────────
  footer: {
    disclaimer: "All information is believed to be accurate but is not guaranteed. Buyer/Agent to independently verify all data including taxes, schools, and dimensions. All offers must include Proof of Funds or comprehensive pre-approval. © 2026 Realty of America, LLC.",
    trecUrl: "https://www.har.com/mhf/terms/dispBrokerInfo?sitetype=aws&cid=840791",
  },

};
