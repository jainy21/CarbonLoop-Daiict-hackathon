# CARBONLOOP

## Circular Carbon Ecosystem — Waste-to-Carbon-Value Chain Tracker

You are one developer/AI coding agent working as part of a **4-person hackathon team**.

You MUST understand the complete product before writing code.

Do not treat your assigned module as a standalone application.

Your module is one part of a single integrated product called:

# CARBONLOOP

---

# 1. HACKATHON THEME

## Circular Carbon Ecosystem

The theme focuses on creating systems where waste is not treated only as something to dispose of, but as a resource that can be converted into useful products and measurable carbon value.

Our project addresses this theme through:

> **Waste-to-Carbon-Value Chain Tracking**

---

# 2. OFFICIAL PROBLEM

Organic and industrial waste that could potentially be converted into:

* Biochar
* Biogas
* Carbon-negative materials
* Other useful carbon-conversion pathways

frequently ends up in landfills.

This creates multiple problems:

1. Valuable waste resources are lost.

2. Landfill disposal can generate greenhouse-gas emissions.

3. Waste generators may not know where their waste should be sent.

4. Conversion facilities may not have a reliable way to discover suitable waste streams.

5. Transportation can be inefficient and expensive.

6. There is often no unified digital record connecting:

   Waste Generation
   ↓
   Collection
   ↓
   Transportation
   ↓
   Conversion
   ↓
   Carbon Impact

7. It becomes difficult to quantify the environmental impact of diverting waste from landfill.

---

# 3. WHAT WE ARE BUILDING

We are building a web-based platform that connects:

### Waste Generators

Examples:

* Farms
* Food-processing businesses
* Industrial waste generators
* Municipalities

with:

### Carbon Conversion Facilities

Examples:

* Biochar facilities
* Biogas facilities
* Carbon-negative material facilities

The platform helps determine:

> **Where should this waste go, how should it get there, and what carbon impact can be estimated from the journey?**

---

# 4. CORE PRODUCT FLOW

The complete CarbonLoop journey is:

```text
WASTE GENERATOR
       │
       ▼
CREATE WASTE BATCH
       │
       ▼
SMART FACILITY MATCHING
       │
       ▼
SELECT BEST CONVERSION FACILITY
       │
       ▼
OPTIMIZE COLLECTION ROUTE
       │
       ▼
TRANSPORT
       │
       ▼
FACILITY RECEIVES WASTE
       │
       ▼
WASTE CONVERSION
       │
       ▼
CARBON IMPACT CALCULATION
       │
       ▼
CARBON PASSPORT
       │
       ▼
PUBLIC QR VERIFICATION
```

This is the main story of the product.

Every major feature should support this journey.

---

# 5. CORE PRODUCT PROMISE

The product should communicate one simple idea:

> **Turn every waste batch into a traceable carbon journey.**

We are NOT building just:

* a waste-management dashboard
* a map application
* a carbon calculator
* a CRUD application
* a chatbot
* a generic sustainability website

We are combining these into one focused workflow.

---

# 6. PRIMARY USERS

## User 1 — Waste Generator

Examples:

* Farmer
* Food-processing company
* Municipality
* Industrial waste generator

They want to:

* register waste
* specify quantity and type
* provide location
* select preferred conversion pathway
* find a suitable facility
* track the waste journey
* see estimated carbon impact

---

## User 2 — Conversion Facility Operator

They want to:

* register facility
* specify accepted waste types
* specify available capacity
* specify conversion type
* receive suitable waste batches
* track incoming waste
* understand carbon impact

---

## User 3 — Municipality / Organization

They want to:

* understand how much waste is diverted
* monitor waste flows
* see carbon impact
* track facilities
* generate reports

---

# 7. THE MAIN PROBLEM WE SOLVE

The problem is not simply:

> "Waste goes to landfills."

The deeper digital problem is:

> **There is a missing coordination and traceability layer between waste generation, suitable conversion facilities, logistics, and measurable carbon impact.**

CarbonLoop acts as that coordination layer.

---

# 8. OUR SOLUTION

CarbonLoop provides four connected capabilities.

## A. Smart Waste-to-Facility Matching

Given:

* waste type
* quantity
* location
* preferred conversion

the system ranks suitable conversion facilities.

The ranking considers:

* waste compatibility
* available capacity
* distance
* conversion efficiency
* carbon benefit
* logistics cost

---

## B. Carbon-Aware Logistics

Once a facility is selected, the system determines a practical route.

The system considers:

* distance
* travel duration
* estimated logistics cost
* transport emissions

The objective is not simply:

> shortest route

but:

> **practical route with lower combined logistics and carbon impact.**

---

## C. Carbon Impact Estimation

The system estimates the carbon impact associated with diverting waste from landfill and converting it through the selected pathway.

Conceptually:

```text
Avoided Landfill Emissions
+
Conversion Carbon Benefit
-
Transportation Emissions
=
Estimated Net Carbon Impact
```

This is a **prototype estimation model**.

Do NOT present it as:

* certified carbon credits
* legally verified carbon accounting
* government-certified carbon removal

unless actual certification exists.

---

## D. Carbon Passport

After the waste journey is completed, CarbonLoop creates a digital record containing:

* batch ID
* waste type
* quantity
* origin
* conversion facility
* conversion pathway
* transport distance
* journey timeline
* estimated carbon impact

A QR code opens the public Carbon Passport.

This provides a simple demonstration of traceability.

---

# 9. MAIN "WOW" MOMENT

The most important demo experience should be:

### Step 1

User enters:

```text
10 tonnes
Rice Husk
Ahmedabad
```

### Step 2

CarbonLoop analyzes available facilities.

### Step 3

It recommends:

```text
BioChar Plant A

92% Match
```

and explains:

```text
✓ Compatible with rice husk
✓ Capacity available
✓ High conversion efficiency
✓ Strong carbon benefit
✓ Reasonable distance
```

### Step 4

The system displays the route:

```text
Ahmedabad
      ↓
🚛 26.4 km
      ↓
BioChar Plant A
```

### Step 5

Carbon impact is calculated:

```text
Avoided landfill emissions
+ X

Conversion benefit
+ Y

Transport emissions
- Z

------------------

Estimated Net Impact
8.4 tCO₂e
```

### Step 6

The user opens:

# CARBON PASSPORT

and scans a QR code.

The judge sees a public verification page showing the complete journey.

---

# 10. WHAT MAKES THIS DIFFERENT

The product should NOT compete by having 50 features.

Our differentiation is:

### 1. Traceability

Track one waste batch through the entire journey.

### 2. Intelligent Matching

Don't just list facilities.

Recommend the best facility.

### 3. Carbon-Aware Logistics

Don't just draw a map.

Connect transportation with carbon impact.

### 4. Carbon Passport

Turn the entire journey into a verifiable digital record.

---

# 11. MVP SCOPE

The hackathon MVP MUST focus on these capabilities:

```text
1. Waste Batch Creation
2. Facility Database
3. Smart Facility Matching
4. Route Optimization
5. Carbon Impact Calculation
6. Batch Tracking
7. Dashboard
8. Carbon Passport
9. QR Verification
```

These are the priority features.

---

# 12. FEATURES THAT ARE NOT MVP PRIORITY

Do NOT waste hackathon time building:

* complex authentication systems
* payment gateway
* real-world marketplace transactions
* complicated ERP integrations
* blockchain
* mobile application
* advanced fleet management
* complicated IoT hardware
* complex admin permission systems
* full carbon-credit marketplace
* dozens of dashboards
* generic AI chatbot

These may be future extensions.

---

# 13. AI — FUTURE, NOT CORE MVP

We plan to add AI later.

Potential AI features:

### AI Waste Classification

Input:

Image / description

Output:

Waste type and characteristics.

### AI Facility Recommendation

Use historical data to improve facility recommendations.

### Carbon Prediction

Predict carbon impact when some information is incomplete.

### Anomaly Detection

Identify unusual:

* waste quantities
* routes
* carbon calculations
* duplicate records

### CarbonLoop AI Assistant

The assistant could answer questions such as:

> Which facility is best for this waste?

> Why was this facility recommended?

> Which waste stream produced the highest carbon impact?

However:

# DO NOT BUILD THE AI CHATBOT BEFORE THE CORE MVP WORKS.

A reliable deterministic prototype is better than a broken AI demo.

---

# 14. TECH STACK — EVERYONE MUST USE THE SAME

## Frontend

```text
React
TypeScript
Vite
Tailwind CSS
shadcn/ui
Lucide React
Recharts
```

## Backend

```text
Node.js
Express
TypeScript
```

## Database

```text
MongoDB
Mongoose
```

## Maps

Preferred:

```text
Mapbox
```

Fallback:

```text
Leaflet
OpenStreetMap
```

## Routing

Use an external routing API where practical.

Possible architecture:

```text
routingService
      │
      ├── Mapbox
      ├── OSRM
      └── OpenRouteService
```

The rest of the application must not depend directly on a specific routing provider.

---

# 15. DESIGN LANGUAGE

The product is a professional:

> **Climate-Tech + Logistics + Data Intelligence SaaS**

Visual references:

* Linear
* Stripe
* Vercel
* modern logistics dashboards
* modern climate-tech products

Use:

* clean layouts
* strong typography
* white/off-white backgrounds
* dark text
* restrained green accent
* subtle borders
* professional cards
* clean charts
* compact data visualizations
* subtle gradients
* subtle animations

Avoid:

* childish designs
* excessive green
* excessive emojis
* generic Bootstrap appearance
* giant hero illustrations
* excessive rounded cards
* unnecessary animations
* clutter

---

# 16. SHARED INFORMATION ARCHITECTURE

The application navigation should conceptually contain:

```text
CarbonLoop

Overview
Waste Batches
Facilities
Smart Carbon Path
Map & Logistics
Carbon Impact
Carbon Passports
```

Do not create unrelated sections.

---

# 17. SHARED DATA MODELS

Every developer must use the same conceptual models:

```text
WasteBatch
Facility
Route
CarbonCalculation
BatchEvent
CarbonPassport
```

Do not rename these concepts.

---

# 18. WASTEBATCH LIFECYCLE

Use exactly:

```text
generated
    ↓
matched
    ↓
collection_scheduled
    ↓
in_transit
    ↓
received
    ↓
converting
    ↓
converted
```

Every developer must use these exact status names.

---

# 19. SHARED DEMO SCENARIO

The main hackathon demonstration uses:

```text
Waste Type:
Rice Husk

Quantity:
10 tonnes

Origin:
Ahmedabad

Preferred Path:
Biochar

Recommended Facility:
BioChar Plant A

Distance:
approximately 26.4 km

Estimated Logistics:
₹2,140

Transport Emissions:
approximately 6.2 kgCO₂e

Estimated Net Carbon Impact:
approximately 8.4 tCO₂e
```

These numbers are illustrative prototype values.

The final calculation engine should generate them based on the implemented model rather than blindly hardcoding the final carbon number.

---

# 20. IMPORTANT ARCHITECTURE RULE

You are working with three other developers.

Therefore:

## DO NOT

* create a separate architecture
* introduce a different frontend framework
* create a second database
* rename shared models
* rename shared APIs
* change status names
* create duplicate versions of the same component
* hardcode another developer's data
* overwrite another developer's module

## DO

* reuse shared types
* reuse shared components
* use API contracts
* create isolated services
* keep business logic modular
* communicate through APIs
* keep demo data centralized

---

# 21. API CONTRACT

The common API structure is:

```text
POST   /api/waste-batches

GET    /api/waste-batches

GET    /api/waste-batches/:id

PATCH  /api/waste-batches/:id/status

GET    /api/facilities

GET    /api/facilities/:id

POST   /api/matching/recommend

POST   /api/routes/optimize

GET    /api/routes/:id

POST   /api/carbon/calculate

GET    /api/carbon/:batchId

GET    /api/batches/:id/timeline

POST   /api/passports

GET    /api/passports/:batchId
```

Do not change these casually.

---

# 22. TEAM STRUCTURE

There are four developers.

### Developer 1

Waste & Batch

### Developer 2

Smart Matching & Carbon Engine

### Developer 3

GIS & Logistics

### Developer 4

Dashboard & Carbon Passport

Each developer owns their assigned module.

---

# 23. FINAL DEMO STORY

The judge should be able to understand the product within a few minutes.

The story:

```text
"We have 10 tonnes of rice husk."

             ↓

"Where should it go?"

             ↓

"CarbonLoop finds the best conversion facility."

             ↓

"Why this facility?"

             ↓

"Because of compatibility,
capacity, distance,
efficiency and carbon benefit."

             ↓

"How do we transport it?"

             ↓

"CarbonLoop calculates the route,
cost and transport emissions."

             ↓

"What environmental impact did we create?"

             ↓

"CarbonLoop estimates the net carbon impact."

             ↓

"Can we prove the journey?"

             ↓

"Yes — Carbon Passport + QR verification."
```

This is the complete product story.

---

# 24. YOUR DEVELOPMENT GOAL

You are NOT trying to build the biggest possible product.

You are trying to build:

> **A small, polished, technically credible prototype that demonstrates the complete waste-to-carbon value chain.**

Every feature must answer:

> Does this improve the core waste → conversion → carbon journey?

If not, do not prioritize it.
