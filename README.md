# HAHA Location Replacement Assessment

**Version: 2.4 · Operator Replacement Assessment**

A browser-based assessment tool for North American vending operators and HAHA sales teams. It helps evaluate whether an existing vending location is a reasonable candidate for equipment replacement, compare the current machine with a proposed HAHA setup, and review investment, financing, and downside scenarios.

The tool is a decision-support model, not a guarantee of future sales or profit. It must be completed with operator-provided operating data and explicitly agreed assumptions.

## 1. Run the project

### Use the ready-to-deploy file

Open the root `index.html` in a modern browser. It is a self-contained HTML file and can also be hosted on GitHub Pages.

### Build after editing source

The source of truth is `src/`. Do not edit the generated root `index.html` directly.

```bash
python build.py
```

Run the calculation boundary tests with Node.js (no third-party packages required):

```bash
node --test tests/core.test.js
```

The build script inlines all CSS and JavaScript from `src/css/` and `src/js/` into the root `index.html`.

### Data and privacy

- Projects are stored in the current browser's `localStorage`.
- The app does not upload project data to a server.
- Clearing browser data, changing browsers, or changing devices does not transfer projects.
- Use **Backup / Export** to download JSON files and **Import** to restore them.
- HTML reports are generated locally in the browser. The browser's print dialog can be used to save a PDF.
- Imported legacy projects retain their saved values. Review their growth assumptions before relying on their forecasts.

## 2. Workflow overview

| Step | Purpose | Output |
|---|---|---|
| 01 · Location Assessment | Record current machine condition and observable commercial signals | 0–100 replacement-priority score |
| 02 · Operating & Financial Analysis | Enter actual sales, orders, profit, site terms, agreed growth assumptions, model, and financing | Current-vs-HAHA P&L, investment, payback, financing, and stress test |
| 03 · Assessment Report | Summarize the inputs, assumptions, financial comparison, and next steps | Printable report and standalone HTML report |

**Important:** Step 01 is a prioritization screen, not a replacement recommendation. A high score does not prove that replacement is profitable. The financial comparison in Step 02 is the decision point.

---

# 3. Step 01 — Location assessment

## 3.1 Score structure

```text
Total score = Hardware pain (0–40) + Commercial signals (0–60)
```

The score is only available after all required Step 01 fields are completed.

| Score | Interpretation |
|---:|---|
| 75–100 | High priority for financial review |
| 50–74 | Consider financial review |
| 0–49 | Lower urgency; validate the business case first |

These bands do not automatically determine the Step 02 growth assumptions or the final replacement verdict.

## 3.2 Hardware pain — maximum 40 points

| Input | Answer | Points |
|---|---|---:|
| Machine age | 7 years or older | 12 |
| | 4 to under 7 years | 6 |
| | Under 4 years | 0 |
| Cashless payment | No card and no mobile payment | 12 |
| | Card accepted, but no mobile payment | 5 |
| | Mobile payment accepted | 0 |
| Remote monitoring | No | 8 |
| | Yes | 0 |
| Physical condition | Poor | 8 |
| | Fair | 4 |
| | Good | 0 |

The hardware score is capped at 40. If the operator has not entered a required field, Step 01 remains incomplete rather than treating the missing answer as a confirmed zero.

Payment scoring uses the payment options recorded in the project:
- `card` = card payment
- `mobile` = mobile / wallet payment
- Coin and bill acceptance do not count as cashless payment.

## 3.3 Commercial diagnosis — six questions, 10 / 5 / 0 points each

The six questions are split into three offensive signals (potential to grow sales) and three defensive signals (operating friction or location risk).

| # | Dimension | 10 points | 5 points | 0 points |
|---:|---|---|---|---|
| Q1 | Product mix constraints | Current machine clearly prevents products customers want because of product type, size, or temperature limits | Some demanded products are restricted | No meaningful product restrictions |
| Q2 | Unmet multi-item demand | Customers show clear demand to buy multiple items together, but the current machine makes it difficult | Some evidence, but not frequent | Little evidence of unmet multi-item demand |
| Q3 | Nearby purchase convenience | Convenient food and beverage alternatives are limited | Some alternatives exist, but convenience is still limited | Many convenient alternatives |
| Q4 | Operating workload | Restocking, on-site checks, repeat maintenance, or machine issues create substantial work | Some recurring workload | Little additional workload |
| Q5 | Location retention risk | Concrete signals exist: property upgrade request, service complaint, or competitor already approaching | Possible but unconfirmed risk | No meaningful evidence of risk |
| Q6 | Lost purchases from equipment issues | Failures, downtime, or payment problems have already caused lost purchases or complaints | Some measurable impact | No known impact |

### Evidence guidance

- **Q1:** Ask which products the operator wants to sell but cannot stock because of capacity, product dimensions, temperature, or machine format. Do not assume all snacks or canned drinks are low-margin.
- **Q2:** Prefer items-per-transaction data, customer feedback, or direct observation. Average order value (AOV) alone does not tell you the number of items in a basket.
- **Q3:** Consider actual walking distance, access, hours, and availability of nearby alternatives. Do not restrict the question to 24-hour convenience stores.
- **Q4:** Score the operating work that is actually occurring, not the mere absence of remote monitoring. Include unnecessary site visits, restocking inefficiency, repeated maintenance, and issue handling.
- **Q5:** Use observable evidence, not a salesperson's guess that a competitor might take the location.
- **Q6:** Score the business consequence already experienced. Machine age and payment capability are separately covered in the hardware score; do not award points here based only on age or missing features.

The commercial score is the sum of Q1–Q6, capped at 60.

## 3.4 Required Step 01 fields

To continue to Step 02, the user must enter:

- Location name
- Machine age
- Machine condition
- Remote monitoring status
- At least one payment method
- An answer to all six commercial questions

---

# 4. Step 02 — Operating and financial analysis

## 4.1 Current-machine baseline

Required inputs:
- Current monthly sales
- Current monthly order count
- Current profit-entry method and the corresponding value
- Current location agreement (revenue share, fixed rent, combination, or none)

All monthly order calculations use a **30-day month**:

```text
Current daily orders = Current monthly orders ÷ 30
Current AOV = Current monthly sales ÷ Current monthly orders
```

AOV is average sales dollars per order. It is not average items per order.

If the operator does not know monthly order count, the app can estimate it using:

```text
Estimated monthly orders = Monthly sales ÷ $2.50
```

This is only an estimate based on a $2.50 assumed AOV. The report marks estimated order data. Replace it with actual backend order data when available.

### Current-machine profit methods

**A. Actual monthly net profit**

```text
Current net profit = User-entered actual monthly net profit
Current costs = Current sales − Current net profit
```

The actual net profit should already include all operating costs. Do not deduct site fees or other expenses again in this method.

**B. Estimated net margin**

```text
Current net profit = Current sales × Estimated net margin %
Current costs = Current sales − Current net profit
```

The margin is constrained to 0–100% by the calculation.

**C. Cost detail**

```text
COGS = Current sales × COGS %
Site fee = Current sales × Revenue-share % + Fixed rent
Card processing = Current sales × Cashless share % × Card fee %
Current costs = COGS + Site fee + Card processing
              + Reader fee + Platform fee + Other operating costs
Current net profit = Current sales − Current costs
```

The cashless share is a driver used to calculate card processing; it is not a separate cost.

The Other operating costs field should include relevant costs not already listed, such as restocking labor, repairs, travel, and other operating expenses. Do not double-count site fees or card fees.

If entered actual net profit exceeds monthly sales, the app displays a warning to confirm that the figures use the same period and accounting basis. It does not silently change the user's input.

## 4.2 Site agreement

The current location agreement can be:
- Revenue share
- Fixed rent
- Revenue share + fixed rent
- No site fee

```text
Site fee = Monthly sales × Revenue-share % + Fixed rent
```

Only the active agreement components are included.

By default, the HAHA scenario uses the same site agreement as the current machine. If the user enables the agreement override, the HAHA scenario uses the separately entered HAHA share and/or rent.

## 4.3 Growth assumptions — zero by default

The app contains four optional growth drivers:

| Driver | Type | What it represents |
|---|---|---|
| Product variety | Order growth | More relevant products can attract additional orders |
| Basket size | AOV growth | Customers buy more items or higher-value combinations per order |
| Reduced stockouts | Order growth | Better availability may recover missed orders |
| Payment experience | Order growth | Easier payment may reduce abandoned purchases |

**Default assumption for all four drivers is 0%.** The user must enter a percentage explicitly. The acceptance selector records whether an assumption is agreed, tentative, or not agreed; selecting a status does not automatically generate a growth percentage.

If the user manually enters a percentage, the report labels that percentage as **Custom**.

### Growth caps

Three order-growth drivers are combined and capped at 40%:

```text
Raw order growth = Variety % + Reduced-stockout % + Payment %
Applied order growth = min(Raw order growth, 40%)
```

If the raw total exceeds 40%, each order-growth driver is reduced proportionally:

```text
Pro-rata scale factor = 40% ÷ Raw order growth
Applied driver % = Entered driver % × Pro-rata scale factor
```

Basket-size growth is capped separately at 25%:

```text
Applied AOV growth = min(Entered basket-size growth, 25%)
```

### Projected sales

```text
Projected monthly orders = Current monthly orders × (1 + Applied order growth)
Projected AOV = Current AOV × (1 + Applied AOV growth)
Projected monthly sales = Projected monthly orders × Projected AOV
```

Because order growth and AOV growth compound, total sales growth can be greater than the sum of the entered percentages.

The revenue impact shown for the three order drivers is based on the current sales baseline and their pro-rata-adjusted percentages. Basket-size revenue impact is calculated using projected order count multiplied by the change in AOV.

## 4.4 Automatic model recommendation

Automatic recommendation is based on **current observed daily orders**, not projected orders. Forecast orders are shown separately as a capacity-planning signal and do not automatically upgrade the recommended model.

```text
Current daily orders = Current monthly orders ÷ 30
```

For non-frozen machine types:

| Current daily orders | Automatic recommendation |
|---:|---|
| Under 10 | Mini 360 |
| 10 to under 18 | Plus 440 |
| 18 to under 35 | Pro 542 |
| 35 through 55 | Max 660 or Max 620S |
| Above 55 | Ultra 1200 |

Boundary rules:
- 10 orders/day enters Plus 440.
- 18 orders/day enters Pro 542.
- 35 orders/day enters the Max tier.
- 55 orders/day remains in the Max tier.
- More than 55 orders/day enters Ultra 1200.

For the 35–55 orders/day tier:
- **Max 620S (Ad Screen):** hotel, hospital, transit, gym, and premium office venues.
- **Max 660:** other venue types.

If the existing machine type is recorded as `frozen`, Freezer 550 takes priority over the order thresholds. If a frozen location has fewer than 15 current orders/day, the app displays a low-volume warning to validate payback.

The user may manually select a different model. The report distinguishes:
- **Automatically Recommended Model:** based on current observed daily orders and venue.
- **Selected Model:** the model actually used for investment calculations.

The forecast-capacity warning compares the current-demand recommendation with the model tier implied by projected orders. It is a prompt to validate peak demand, not an automatic model change.

## 4.5 HAHA monthly operating profit

The HAHA scenario uses the projected monthly sales and orders calculated above.

```text
HAHA COGS = Projected sales × HAHA COGS %
HAHA site share = Projected sales × HAHA revenue-share %
HAHA site fee = HAHA site share + HAHA fixed rent
HAHA processing = Projected sales × Processing fee %
HAHA shrinkage = Projected sales × Shrinkage / spoilage %
HAHA fixed costs = SaaS + SIM + POS + Maintenance + Other
HAHA AI fee = Projected monthly orders × AI fee per order

HAHA total costs = COGS + Site fee + Processing + Shrinkage
                 + Fixed costs + AI fee

HAHA monthly net profit = Projected sales − HAHA total costs
Incremental monthly profit = HAHA monthly net profit − Current monthly net profit
```

The default model parameters in a new project are:

| Parameter | Default |
|---|---:|
| HAHA COGS rate | 45% |
| Payment processing rate | 5.95% |
| Shrinkage / spoilage | 1.5% |
| SaaS | $15/month |
| SIM | $15/month |
| POS | $10/month |
| Maintenance reserve | $15/month |
| AI fee | $0.05/order |
| Other operating costs | $0/month |

These are editable planning inputs, not universal costs or guarantees. Confirm the applicable commercial terms and actual operating costs before presenting a customer proposal. The Other operating costs field should not remain at zero unless the operator has confirmed that no additional costs apply.

The default model does not include advertising revenue.

## 4.6 Investment

```text
Equipment cost = Selected model MSRP
Freight = $250 if the freight option is enabled; otherwise $0
Net investment = Equipment + Freight + Installation + Removal − Trade-in
```

The app prevents net investment from falling below zero.

Default model MSRP values in the project:

| Model | MSRP |
|---|---:|
| Mini 360 | $2,999 |
| Plus 440 | $3,499 |
| Pro 542 | $4,499 |
| Max 620S | $5,499 |
| Max 660 | $5,099 |
| Ultra 1200 | $6,999 |
| Freezer 550 | $4,999 |

Confirm current pricing, freight, installation, removal, and trade-in values before quoting.

## 4.7 Payback and return

Two payback metrics are shown because they answer different questions:

```text
Standalone payback = Net investment ÷ HAHA monthly net profit
Incremental payback = Net investment ÷ Incremental monthly profit
```

- Standalone payback asks how long the HAHA machine's own net profit would take to cover the investment.
- Incremental payback asks how long the additional profit from replacing the current machine would take to cover the investment. This is the more relevant replacement comparison.

If the denominator is zero or negative, the corresponding payback is shown as unavailable / no payback.

```text
Annual incremental profit = Incremental monthly profit × 12

Three-year net gain = Incremental monthly profit × 36
                    − Net investment
                    − Financing cost within 36 months

3-year ROI = Three-year net gain ÷ Net investment × 100%
```

If net investment is zero, the displayed ROI is set to 0% to avoid division by zero.

## 4.8 Financing

Financing inputs:
- Down payment percentage (default 10%)
- Term (default 12 months; app range 1–24 months)
- APR (default 0%)
- Documentation fee (default $50)

```text
Down payment = Net investment × Down payment %
Principal = Net investment − Down payment
Monthly payment = Amortized payment on principal, APR, and term
Cash due at signing = Down payment + Documentation fee
Total paid = Down payment + Documentation fee + Monthly payment × Term
Financing interest = Monthly payment × Term − Principal
```

For 0% APR:

```text
Monthly payment = Principal ÷ Term
```

The documentation fee is paid at signing and is not included in the loan principal.

```text
Monthly payment coverage = HAHA monthly net profit ÷ Monthly payment
Cash after payment = HAHA monthly net profit − Monthly payment
Cash difference vs. current machine = Cash after payment − Current monthly net profit
```

The self-funding indicator is shown only when all conditions are true:
- Financing is enabled.
- Monthly payment is greater than zero.
- HAHA monthly net profit covers the payment.
- Incremental monthly profit is positive.
- Cash after payment is at least the current machine's monthly net profit.

Financing cost included in the 3-year net gain is the interest paid within the first 36 months plus the documentation fee.

## 4.9 Stress test

The stress test models 100%, 80%, and 60% of projected sales and projected orders.

For each scenario:

```text
Stress sales = Projected sales × Scenario %
Stress orders = Projected orders × Scenario %

Stress net profit = Stress sales
                  − Stress sales × Variable cost rate
                  − Fixed costs
                  − Stress orders × AI fee

Stress incremental profit = Stress net profit − Current monthly net profit
Stress incremental payback = Net investment ÷ Stress incremental profit
```

Variable cost rate includes:
- COGS
- Site revenue share
- Payment processing
- Shrinkage / spoilage

Fixed costs include monthly fixed operating costs and fixed site rent.

The stress table shows both HAHA monthly net profit and the difference versus keeping the current machine. A negative difference means the stress scenario performs worse than the current-machine profit baseline.

## 4.10 Final verdict rules

The verdict considers data completeness, incremental profit, incremental payback, relative gain, and (when financing is enabled) payment coverage.

| Verdict | Conditions |
|---|---|
| Strong | Data available; incremental profit > 0; incremental payback ≤ 24 months; relative gain ≥ 20%; and if financed, payment coverage ≥ 1.5× |
| Positive | Data available; incremental profit > 0; incremental payback ≤ 36 months; and if financed, payment coverage ≥ 1.2× |
| Conditional | Data available; incremental profit > 0; incremental payback ≤ 48 months, but the stronger criteria are not met |
| Defer | Other cases, including no positive incremental profit |

Relative gain is calculated as:

```text
If current profit > 0:
  Relative gain = Incremental monthly profit ÷ Current monthly net profit

If current profit ≤ 0:
  Relative gain = 100% when incremental monthly profit ≥ $200;
                  otherwise 0%
```

The verdict is a model output based on the inputs and assumptions. It is not a promise of actual results or a substitute for operator validation.

---

# 5. Step 03 — Report contents

The customer-facing report includes:
- Location and machine overview
- Step 01 score and diagnostic rationale
- Selected model and automatically recommended model
- Growth assumptions and applied percentages
- Current vs. HAHA monthly orders, AOV, sales, costs, and profit
- Incremental monthly profit
- Investment and financing summary
- Stress test, including profit difference versus the current machine
- Decision summary and suggested next steps
- Methodology and limitations

The report can be printed or saved as PDF through the browser print dialog, or downloaded as a standalone HTML file.

# 6. Important assumptions and limitations

1. A 30-day month is used to convert monthly orders to daily orders.
2. Current orders and current sales are treated as the operating baseline.
3. Growth percentages are zero by default and should only be entered after discussion with the operator.
4. Growth assumptions are planning scenarios, not sales commitments.
5. No advertising revenue is included.
6. The model does not automatically include taxes, inventory working capital, depreciation, or resale value unless represented in a user-entered field.
7. Actual machine repair and downtime impact varies by equipment condition and maintenance history. The tool does not assign an unsupported fixed dollar value to this risk.
8. Actual commercial terms, fees, product costs, and operating expenses should be verified before sharing the report.
9. A high Step 01 score does not override an unfavorable financial result.
10. Imported projects retain previously saved values. Review old growth percentages and cost assumptions before using an imported project as a new customer proposal.

# 7. Project structure

```text
src/
  index.html
  css/
    base.css
    layout.css
    controls.css
    views.css
    report.css
    components.css
    responsive.css
    print.css
  js/
    config.js       Model list, default project, fees, financing helpers
    utils.js        Formatting, DOM helpers, download helpers
    i18n.js         English and Chinese UI copy
    store.js        Local storage, schema normalization, backup/import
    calc.js         Scoring, financial model, model recommendation, validation
    ui-shell.js     App shell, navigation, modal, storage warning
    ui-pages.js     Dashboard and project list
    ui-step1.js     Location assessment
    ui-step2.js     Operating and financial analysis
    ui-report.js    Printable / downloadable report
    sync.js         Live output and recommendation synchronization
    events.js       User interaction and file import/export
    boot.js         Startup and view mounting
build.py            Single-file HTML build script
tests/core.test.js  Core calculation and boundary tests (Node.js built-in test runner)
index.html          Generated deployment artifact
README.md           Business logic and operating guide
```

## 8. Version 2.4 change log

- Automatic model recommendation now uses current observed daily orders, not forecast orders.
- Forecast capacity is shown separately as a warning when growth assumptions imply a higher capacity tier.
- New projects start with all four growth assumptions at 0%.
- Acceptance status no longer silently inserts growth percentages; users enter percentages explicitly.
- Manually entered growth percentages are identified as custom assumptions in the report.
- Step 01 diagnostic questions now focus on observable operator evidence and reduce overlap between hardware condition and actual business impact.
- Step 01 score tiers are framed as financial-review priority, not an automatic replacement instruction.
- Max 620S is labeled **Ad Screen**, not Flagship.
- Unsupported fixed-dollar repair-risk claims were removed.
- Operating-cost fields now explicitly prompt users to include restocking labor, site visits, cleaning, and other costs.
- The report distinguishes the selected model from the automatically recommended model.
- Stress-test rows show the profit difference versus the current machine.
- Warnings were added for old-machine net profit exceeding sales and for forecast capacity moving above the current-demand recommendation.
- The original three-step workflow, model catalog, local storage, import/export, financing, cash-flow chart, bilingual UI, and HTML/print reporting are retained.
