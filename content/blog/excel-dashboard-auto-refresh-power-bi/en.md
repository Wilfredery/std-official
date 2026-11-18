---
title: "How to Build an Excel Dashboard That Updates Automatically (and When to Move to Power BI)"
description: "Stop rebuilding the same report every Monday. Here's how to set up an Excel dashboard that refreshes on its own, step by step, and the signs that it's time to move to Power BI."
seoTitle: "Excel Dashboard That Updates Automatically: Step by Step"
seoDescription: "Set up an Excel dashboard that refreshes on its own with tables, Power Query and PivotTables, and learn the signs it's time to move to Power BI."
sources:
  - excelRefresh
  - powerBiPricing
cta:
  title: "Tired of rebuilding the same report every week?"
  text: "We connect your data, build a dashboard that updates on its own and help you decide whether Excel is enough or it's time for Power BI."
  button: "Book your free consultation"
---

For most small businesses, the first dashboard lives in Excel, and that's fine. The problem starts when someone spends every Monday morning copying last week's sales into the file, fixing the formulas and checking that the charts picked up the new rows.

The fix isn't more formulas. It's a structure where the raw data comes in through one door and everything else updates from it. This guide shows how to build that in Excel, step by step, and how to tell when Excel has done its job and it's time to move to Power BI.

## Why Excel dashboards stop updating

- **Data pasted by hand** on top of last week's, sometimes with a different column order.
- **Formulas pointing at fixed ranges** like A2:A500 that quietly miss row 501.
- **Charts built from copies** of the data instead of the data itself.
- **PivotTables nobody refreshes**, so they keep showing old numbers.

All four have the same root cause: the data, the calculations and the dashboard are mixed together.

## The structure: three layers

![Excel dashboard in three layers: a Data tab with an Excel table, a Calculations tab with PivotTables and a Dashboard tab with charts](/images/blog/excel-dashboard-auto-refresh-power-bi/excel-dashboard-three-layers.svg "Data comes in on one tab; everything else reads from it.")

1. **Data:** only raw data, formatted as an Excel table. Nobody types or calculates here.
2. **Calculations:** PivotTables and formulas that read from that table by name.
3. **Dashboard:** charts, key numbers and slicers. This is the only tab most people open.

## Step by step

1. **Bring the data in with Power Query instead of copy and paste.** In Data > Get Data, connect to your CSV export, a folder of files, a database or a file in OneDrive or SharePoint. Power Query saves every cleaning step (remove columns, fix dates, filter rows) and repeats them each time you refresh.
2. **Load it as a table.** Excel tables grow when new rows arrive, and formulas, PivotTables and charts that point at the table include those rows automatically. If you're not using Power Query yet, select the data and press Ctrl+T.
3. **Build PivotTables and PivotCharts from the table.** Sales by month, by product and by salesperson cover most first dashboards. Add slicers for date and product so people can filter without touching formulas.
4. **Add key numbers on top.** Total sales, average ticket and change versus last month, with formulas that reference the table by column name (for example, `=SUM(Sales[Amount])`) instead of a cell range.
5. **Turn on automatic refresh.** Go to Data > Queries & Connections, open the Connections tab, right-click the query and choose Properties. On the Usage tab, check **Refresh data when opening the file**, and if the file stays open during the day, **Refresh every** with the number of minutes. To refresh everything by hand, press Ctrl+Alt+F5 (Refresh All).

Two details worth knowing: these refresh options run in the Excel desktop app while the workbook is open, so a file nobody opens doesn't update. And if Excel has disabled external data on a computer, the connections have to be enabled from the Trust Center bar or the file kept in a trusted location.

## Signs Excel is no longer enough

![Checklist comparing when to keep a small business dashboard in Excel and when to move it to Power BI](/images/blog/excel-dashboard-auto-refresh-power-bi/excel-vs-power-bi-when-to-switch.svg)

- **Several people need the same numbers** and you're emailing files back and forth, asking which version is the right one.
- **You combine three or more sources** every time: sales system, accounting and ads, for example.
- **The file got slow** and takes minutes to open or refresh.
- **The report has to update on a schedule**, even when nobody opens it.
- **Each person should see only their part**, like each salesperson seeing only their own accounts.
- **People want it on their phone.**

If two or more of these sound familiar, Excel has done its job.

## What Power BI adds, and what it costs

- **Power BI Desktop is a free download** for building reports. A free account lets you create reports, but sharing them requires a paid license.
- **Power BI Pro costs $14 per user per month**, paid yearly, and lets you publish and share reports. Pro datasets can refresh on a schedule up to 8 times a day.
- **Premium Per User costs $24 per user per month**, paid yearly, with up to 48 refreshes a day and larger models.
- **Each person who views shared reports needs a license**, unless the company buys a large capacity plan. For a team of five, Pro comes to about $70 a month.

The good news: Power BI cleans data with the same Power Query you learned in Excel, so the work you did in step 1 carries over.

## Excel or Power BI?

Stay in Excel while one person owns the report, the data comes from one or two sources and refreshing when you open the file is enough. Move to Power BI when the dashboard becomes a shared tool for the team. Either way, the structure matters more than the tool: clean data in one place, calculations that read from it and a dashboard nobody types into.

If you're just getting started with indicators, our [practical guide to business intelligence for small businesses](/en/blog/business-intelligence-small-business/) helps you choose what to measure first.
