---
title: "Business Intelligence Tips for Small Business: A Restaurant Example"
description: "Seven practical business intelligence tips for small business, applied step by step to a restaurant: which data to use, which KPIs to watch, what dashboard to build and which decisions come out of it."
seoTitle: "Business Intelligence Tips for Small Business"
seoDescription: "7 business intelligence tips for small business, with a real-world restaurant example: food cost, average check, staff scheduling and which dishes make money."
sources:
  - nra2026
  - dataStudio
  - powerBiPricing
cta:
  title: "Want a dashboard like this for your business?"
  text: "We help you pick your 4 or 5 KPIs, connect your point of sale and purchases, and set up the weekly routine to use it."
  button: "Book your free consultation"
---

Business intelligence tips tend to sound good and stay vague: "use your data", "define your KPIs", "make data-driven decisions". To be useful, you have to see them working in a real business. So in this article we apply seven tips, one at a time, to one of the most common businesses there is: a restaurant.

If you're not yet sure what business intelligence is, start with our [practical guide to business intelligence for small business](/en/blog/business-intelligence-small-business/). Here we go straight to practice.

## Why a restaurant

A restaurant is the perfect example because it produces a lot of data every day (every check, every supplier purchase, every shift) and runs on thin margins, so any leak shows up in the cash register fast.

The industry numbers back this up. According to the U.S. National Restaurant Association's 2026 report, 42% of operators said their restaurant was not profitable the previous year, more than 9 in 10 cite food, labor, insurance, energy and swipe fees as significant challenges, and 60% reported softer customer traffic. The Association lists data analytics among the advances helping operators manage costs.

Everything below works the same for a retail shop, a salon, a repair shop or a distributor. The KPIs change; the method doesn't.

## The restaurant in our example

Picture a 40-table family restaurant. It sells about $14,000 a week, has 12 employees, and the owner tracks sales by looking at each night's register close. They know some weeks "we make less", but not why.

Without buying anything new, the restaurant already has four data sources:

- The point of sale, with every check, dish, time and payment method.
- Supplier invoices, with what was bought and at what price.
- Staff schedules and payroll.
- Sales from delivery apps.

That's enough for everything that follows.

## 7 business intelligence tips, applied

### 1. Start with a question, not a tool

The most common mistake is installing software and then wondering what to do with it. First, write down the question that keeps you up at night.

At the restaurant: "Why are there weeks when we sell the same and make less?" That single question already tells you which data you need: sales, ingredient costs and staff costs.

### 2. Use the data you already have

You don't need a new system or a six-month project. Almost every point of sale can export sales to Excel or CSV, and supplier invoices can go into a simple sheet.

At the restaurant: they export sales by dish and by hour for the last 12 weeks from the point of sale, and load supplier purchases for the same period into a sheet with four columns: date, supplier, product and amount.

### 3. Track 4 or 5 KPIs, not 30

Nobody reads a dashboard with 30 charts. Pick the few numbers that answer your question.

The restaurant chose five:

- Sales by day of the week.
- Average check: sales divided by number of checks.
- Food cost: ingredient purchases as a percentage of sales.
- Labor cost: payroll as a percentage of sales.
- Sales and food cost by dish.

![Example restaurant dashboard with four weekly KPIs: sales of $14,000, average check of $25, food cost of 35% against a 30% target and labor cost of 30%; a sales-by-day chart with Friday and Saturday as the strongest days; and a menu table with units sold, food cost and the suggested action for each dish](/images/blog/business-intelligence-tips-small-business/restaurant-bi-dashboard.svg "Example values. Five KPIs are enough to answer the owner's question.")

### 4. Clean once, then automate the refresh

The heavy lifting in business intelligence is getting the data in order: the same dish shouldn't appear under three different names, dates should share one format and purchases should be in the same currency. Do it once and save the steps.

At the restaurant: they saved the cleanup steps with Power Query inside Excel. Every Monday they drop the new export into the same folder and the dashboard refreshes with one click. We walk through it in [how to build an Excel dashboard that refreshes itself](/en/blog/excel-dashboard-auto-refresh-power-bi/).

### 5. One dashboard, one weekly routine

A dashboard nobody looks at is decoration. Give it a day, a time and an owner.

At the restaurant: every Monday at 10, before placing the week's orders, the owner and the head chef spend 30 minutes on the dashboard. They walk out with one or two decisions, not a list of twenty.

### 6. Compare against yourself and set alerts

A number on its own says nothing. What helps is comparing it with last week, the same week last year or a target you set. And when a number crosses a line, it should jump out.

At the restaurant: the owner set their own food cost target at 30%, based on their menu prices and recipes. The dashboard turns red for any week above that target and for any ingredient whose price rises more than 10% over the previous month.

### 7. Turn every finding into an action, and measure it

Business intelligence doesn't decide for you: it shows you where to look. Every finding has to end in a concrete action, with a date to check whether it worked.

## What the restaurant found

With the dashboard running, three findings came up in the first few weeks:

1. **The best-selling dish made the least money.** The mixed grill sold 140 portions a week, but its food cost was 48%. They adjusted the portion and raised the price slightly. The pasta of the day, at 22% food cost, became the server's recommendation.
2. **A supplier raised the price of chicken and nobody noticed.** It had gone up 18% in two months. The alert flagged it and they negotiated with another supplier.
3. **Tuesday afternoons were overstaffed.** It was the slowest day, with $1,100 in sales, and had the same shift as a Thursday. They moved one person to Friday, the day with the longest wait times.

The result, in this example: after 8 weeks, food cost dropped from 35% to 31%. On $14,000 in weekly sales, those 4 points are $560 a week that stays in the business, without selling a single extra dish.

The numbers are illustrative: yours will differ. What repeats is the pattern: the money wasn't in selling more, but in seeing what was happening with what was already being sold.

## What it costs to set up

Less than you'd think. For a dashboard like this, Excel with Power Query is enough if you already have it, or Google's Data Studio, whose self-service tier is free, according to Google. If you want it to refresh in the cloud and let several people view it from a browser or phone, Power BI Pro costs $14 per user per month billed annually, according to Microsoft's pricing page. For the owner and the head chef, that's $28 a month.

The real cost isn't the license, it's the time: defining the question, cleaning the data the first time and keeping up the Monday routine. If you're torn between tools, see our [comparison of BI tools for small business](/en/blog/business-intelligence-tools-small-business/).

## How to apply it if you don't run a restaurant

The method is the same; the question and the KPIs change:

- Retail shop or convenience store: turnover by product, stockouts and margin by category.
- Salon or spa: booking occupancy by hour, average ticket and returning clients.
- Repair shop or field service: billed hours versus worked hours, and turnaround time.
- Distributor: days to collect, margin by customer and orders by sales rep.

## Your next step

Write down today the question that matters most about your business. Export the last 12 weeks from your point of sale or invoicing system and pick the 4 or 5 numbers that answer it. That's your first dashboard.

To measure whether it's working, read [the benefits of business intelligence and how to measure them](/en/blog/business-intelligence-benefits-small-business/). And if you'd like help, at ShineTechData we work with small businesses to define their KPIs, connect their data and set up the routine to use them. Learn about our [business intelligence](/en/services/business-intelligence/) service.
