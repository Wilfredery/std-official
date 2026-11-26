---
title: "RFM analysis for small business: find out which customers to keep, win back or let go"
description: "What RFM analysis (recency, frequency, monetary) is, how to calculate it step by step in Excel from your customer history and what to do with each segment, applied to an independent hair salon with 840 clients."
seoTitle: "RFM Analysis for Small Business: A Step-by-Step Example"
seoDescription: "Learn how to segment your customers with RFM analysis in Excel, with a hair salon example and what to do with each segment."
sources:
  - sbcs2026
  - blsBarbers2026
cta:
  title: "Do you know which of your customers are drifting away?"
  text: "We take your customer sales or appointment history, build your RFM segmentation and tell you who to call first."
  button: "Book your free consultation"
---

Every business has customers who come in every month, customers who came once and never returned, and customers who used to come often and haven't been seen in a while. The trouble is that you can't tell who's who from monthly sales. Sales can look steady while your best customers walk over to the competition, one by one.

RFM analysis puts a name on each group. It's the second post in our series on business intelligence analyses for small businesses. In the [first one, Pareto analysis](/en/blog/pareto-analysis-small-business/), we ranked products. Now we rank customers.

We apply it to another business you'll find in any American town: an independent hair salon.

## What RFM analysis is

RFM stands for three questions you can ask about each customer's purchase history:

- **Recency (R):** how many days since their last purchase? A customer who came in last week is more likely to come back than one who hasn't been in for eight months.
- **Frequency (F):** how many times did they buy during the period? Someone who comes six times a year already has the habit.
- **Monetary (M):** how much did they spend in total? Not every frequent customer spends the same.

Each customer gets a score from 1 to 5 on each question, compared with the rest of your customers. The 20% with the most recent purchase get a 5 for recency, the next 20% get a 4, and so on down to 1. Same for frequency and monetary value.

With those scores, every customer falls into a **segment**. Some versions use ten or eleven segments, but five are enough for a small business, because each one calls for a different action:

- **Champions:** came in recently, come often and spend well.
- **New & promising:** came in recently, but haven't visited many times or spent much yet.
- **Need attention:** neither very recent nor long gone. They're at the point where a customer decides whether to come back.
- **At risk:** used to spend well and come often, but haven't been back in a while.
- **Lost:** came once or twice, spent little and haven't returned.

To avoid working with 125 combinations, frequency and monetary are averaged into a single score, **FM**. That leaves a 5-by-5 grid you can see in one chart.

## Why it's worth doing

In the Federal Reserve Banks' Small Business Credit Survey, 57% of employer firms said reaching customers and growing sales was a challenge, and 73% reported rising costs as a financial challenge. Winning new customers costs money in advertising, discounts and time. Winning back a customer who already knows you, knows where you are and trusted you once almost always costs less.

RFM analysis tells you who to win back, and also who isn't worth chasing.

## The salon in our example

According to the U.S. Bureau of Labor Statistics (BLS), barbers, hairstylists and cosmetologists held 670,800 jobs in 2025, and their employment is projected to grow 7% from 2025 to 2035, much faster than average. 48% of hairstylists and cosmetologists are self-employed. It's an industry of small businesses, where the relationship with each client is everything.

Picture an independent salon with one location that, over the last 12 months, served 840 different clients across 2,702 visits and brought in $284,050, with an average ticket of about $105. Because it works by appointment, every visit is recorded with the client's name, the date and the amount.

The owner feels like the book is full, but she sees new faces all the time and doesn't know how many of her regulars are still coming in.

The data is illustrative, but the pattern is the one we see in service businesses with repeat customers: salons, barbershops, spas, auto repair shops, vet clinics and gyms.

## How to run the analysis step by step

Like Pareto analysis, you can do it in Excel or Google Sheets.

1. **Export your sales or appointment history** for the last 12 months, with three columns: client, date and amount. If your booking system or point of sale records the customer on each sale, you already have what you need.
2. **Summarize by client** with a pivot table: date of last visit (max), number of visits (count) and total spent (sum).
3. **Calculate recency**: the days between the analysis date and the last visit.
4. **Assign the 1-to-5 scores.** For recency, where fewer days is better, the formula is `=1+INT(5*COUNTIF(D:D,">"&D2)/COUNT(D:D))`, with the days in column D. For frequency and monetary, where more is better, change `">"` to `"<"`. When many customers tie, like everyone who came only once, they get the same score.
5. **Calculate FM**: the average of frequency and monetary, rounded.
6. **Assign the segment** from recency and FM: champions if R is 4 or 5 and FM is 4 or 5; new & promising if R is 4 or 5 and FM is 3 or lower; need attention if R is 3; at risk if R is 1 or 2 and FM is 3 or higher; lost if both R and FM are 1 or 2.

For the salon we did it in Python with pandas and charts in matplotlib. The logic is exactly the same as in the spreadsheet.

In the salon, the recency scores came out like this: 5 for clients who visited in the last 23 days, 4 for 24 to 49 days, 3 for 50 to 119, 2 for 120 to 207 and 1 for clients who haven't been in for 208 days or more. 41% of clients came only once, and all of them scored 1 on frequency.

## What the salon found

First we looked at what share of clients and of revenue each segment represents.

![Horizontal bars per segment showing the share of clients and of revenue: champions are 28% of clients and 62% of revenue; new & promising, 12% and 4%; need attention, 20% and 13%; at risk, 10% and 15%; and lost, 30% and 6%](/images/blog/rfm-analysis-small-business/segments-clients-revenue.svg "Illustrative data. Each segment has two bars: its share of clients and its share of revenue.")

Three findings:

- **237 champions carry the salon.** They're 28% of clients and brought in 62% of revenue, $176,520 for the year. Each one spent $745 on average across about six visits.
- **82 at-risk clients are worth more than 255 lost ones.** At-risk clients are only 10% of the list, but they brought in 15% of revenue, $42,746. They came about four times a year and spent $521 on average, but their last visit was, on average, 166 days ago.
- **Almost a third of clients came once and never returned.** The 255 lost clients are 30% of the list and just 6% of revenue.

The grid shows where each client sits by recency and by their frequency-and-spend score. Lighter cells hold more clients.

![5-by-5 grid with recency on the vertical axis and frequency and spend on the horizontal axis: top right, champions, with 237 clients and 62% of revenue; top left, new & promising, with 99 clients and 4%; the middle row, need attention, with 167 clients and 13%; bottom right, at risk, with 82 clients and 15%; and bottom left, lost, with 255 clients and 6%](/images/blog/rfm-analysis-small-business/salon-rfm-grid.svg "Illustrative data. Lighter cells hold more clients.")

The two bottom corners tell very different stories. The left corner is full of one-visit clients who never came back. The right one has fewer clients, but they were already loyal and they're slipping away.

The last chart confirms it: it counts how many clients haven't been in for how many days, and separates high frequency-and-spend clients from the rest.

![Histogram of days since last visit, from 0 to 365 days: more than half of the high frequency-and-spend clients visited in the last 50 days; from 120 days on, where recency scores 1 and 2 begin, there are still high frequency-and-spend clients, the 82 at-risk clients, who spent $42,746 last year, while most are low frequency-and-spend clients](/images/blog/rfm-analysis-small-business/days-since-last-visit.svg "Illustrative data. The dashed line marks where recency scores 1 and 2 begin.")

## What to do with each segment

### Champions: take care of them, don't discount them

They don't need a promotion to come back; they already do. What they need is to feel recognized, and for nothing to push them away. For the salon, the plan was:

- Book the next appointment before they leave, so their favorite stylist isn't full when they need her.
- Give them priority for the most requested slots, like Saturday mornings.
- Ask them for referrals. A champion who brings a friend is worth more than any ad.

### New & promising: get the second visit

These are 99 clients who came in recently and don't have the habit yet. The second visit decides whether they stay. The salon started sending a personal message three or four weeks after the first visit, signed by the stylist who served them, with a link to book.

### Need attention: the timely reminder

These 167 clients haven't been in for 50 to 119 days. Many simply forgot to book. An automatic reminder when their usual cycle comes around, say six to eight weeks after their last cut, is enough to bring most of them back.

### At risk: the personal call

This is where the salon was losing money without noticing. These are 82 clients who spent $42,746 last year. If the salon wins back one in four, that's about $10,700 a year, with no ad spend.

A mass message won't work for this group. The stylist calls or texts each one, asks how they're doing and whether anything went wrong. Sometimes the answer is a move. Sometimes it's a bad experience nobody heard about, and that information is worth as much as the client.

### Lost: one last try, then move on

For the 255 lost clients, the salon sends a single low-cost campaign, like an email with a come-back offer, and then stops spending on them. Chasing someone who came once ten months ago is the most expensive way to look for sales. That effort pays off far more with at-risk clients.

## Common mistakes

- **Giving everyone the same discount.** A discount for a champion gives away margin to someone who was coming back anyway. Use it on at-risk customers, where it actually changes the decision.
- **Using fixed thresholds copied from another business.** A customer not returning for 60 days is normal for a salon and alarming for a coffee shop. That's why the 1-to-5 scores are calculated by comparing your own customers.
- **Doing it only once.** Customers move between segments every month. Repeat the analysis monthly or quarterly and see who went from champion to at risk.
- **Not recording the customer on every sale.** Without the customer's name or phone number on each purchase, there's no RFM. If you sell today without identifying the customer, start there: a loyalty program or asking for a phone number at checkout is enough.

## What's next in the series

RFM analysis is a snapshot of your customers today. The next step is to watch the movie: cohort analysis groups customers by the month they arrived and shows how many are still coming back one, three and six months later. It will be the next post in this series on business intelligence for small businesses.

If your customer data isn't in one place yet, start with our [business intelligence guide for small businesses](/en/blog/business-intelligence-small-business/).

## Your next step

Export your sales or appointment history for the last 12 months today, with the customer, the date and the amount. Build the pivot table by customer and sort by date of last visit. That alone will show you who used to be a loyal customer and hasn't been in for months.

If you want the analysis to update itself every month and your team to get the list of customers to call, ShineTechData can build it with you. Take a look at our [data analysis](/en/services/data-analysis/) service.
