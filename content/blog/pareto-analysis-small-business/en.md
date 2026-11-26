---
title: "Pareto analysis for small business: find the 20% of products that drive 80% of your sales"
description: "What Pareto analysis and ABC classification are, how to run them step by step on your own sales data and what to decide for each class, applied to an independent pet supply store with 120 products."
seoTitle: "Pareto Analysis for Small Business: An ABC Example"
seoDescription: "Learn how to run a Pareto analysis and ABC classification of your products, with a pet store example and what to decide for each class."
sources:
  - sba2026
  - sbcs2026
cta:
  title: "Do you know which products are your A items?"
  text: "We take your last 12 months of sales, build your ABC classification with margin included and tell you what to do with each class."
  button: "Book your free consultation"
---

If you run a business with a lot of products, it probably feels like all of them matter. Each one takes up shelf space, gets reordered, gets counted at inventory time and gets rung up at the register. But they don't all pull the same weight. Almost always, a handful of products carries the business and most of the rest sell very little.

Pareto analysis tells you exactly which is which. It's the first post in our series on business intelligence analyses for small businesses, because it's the easiest one to run, it uses data you already have in your point-of-sale system and it gives you results you can act on the same week.

In this post we apply it to one of the most common businesses on any American main street: an independent pet supply store.

## What Pareto analysis is

Pareto analysis ranks your products from highest to lowest sales and measures what share of the total they add up to. It's named after the economist Vilfredo Pareto, who noticed that wealth was concentrated in a few hands. Over time, that idea became the well-known 80/20 rule: a small share of the causes explains most of the results.

In a business it looks like this: about 20% of your products tend to bring in about 80% of your sales. It isn't an exact law. Yours might be 15/70 or 30/85. The round number doesn't matter. What matters is finding out that the concentration exists and which products make it up.

**ABC classification** takes the analysis one step further and puts each product in one of three classes:

- **Class A:** the products that add up to the first 80% of sales. There are few of them, and they carry the business.
- **Class B:** the ones that take the running total from 80% to 95%. They sell steadily without being the stars.
- **Class C:** the last 5% of sales. They're usually most of your products.

The 80% and 95% cutoffs are the most common, but you can move them. The logic doesn't change: treating every product the same is the most expensive way to run a business.

## Why it's worth doing now

Small businesses are most of the U.S. economy. The SBA Office of Advocacy counts 36,207,130 small businesses in the country, and they employ 45.9 percent of private-sector workers. Most of them run on tight margins.

In the Federal Reserve Banks' Small Business Credit Survey, 73% of employer firms reported rising costs as a financial challenge, and 57% said reaching customers and growing sales was a challenge. When costs go up, every dollar sitting in inventory that doesn't move weighs more. And when sales are hard to win, it pays to know which products bring customers through the door.

Pareto analysis answers both questions with a single table.

## The store in our example

Picture an independent pet supply store with one location and about $780,000 in annual sales. It carries 120 products across ten categories: dog food, cat food, cat litter, flea, tick and health, treats and chews, aquarium and fish, grooming, small animal and bird, beds and accessories, and toys.

The owner feels the store is packed with stuff and there's never enough cash to restock what actually sells. They want to know which products to protect, which to push and which to stop reordering.

The numbers are illustrative, but the pattern is one we see again and again in retail.

## How to run the analysis step by step

You don't need special software. Excel or Google Sheets is enough to start.

1. **Export your sales by product** for the last 12 months from your point-of-sale or invoicing system. Use 12 months so seasonality doesn't fool you.
2. **Sort from highest to lowest** by sales dollars.
3. **Calculate each product's share**: its sales divided by the total.
4. **Calculate the running total**: the product's share plus the share of every product above it.
5. **Assign the class**: A if the running total before the product is under 80%, B if it's under 95% and C for the rest.
6. **Add each product's gross margin.** This step is optional, but it's the one that turns a sales list into decisions.

For the store, we built the analysis in Python, with matplotlib charts. The logic is the same as the spreadsheet's, just automated.

## What the store found

The result was almost textbook: 24 products, 20% of the catalog, bring in 80% of sales. And 22 of those 24 are dog food, cat food and cat litter.

![Pareto curve for the pet store: cumulative share of sales climbs fast with the first products and then flattens; 20% of products, class A, add up to 80% of sales, class B reaches 95% with 49% of products and class C makes up the remaining half of the catalog](/images/blog/pareto-analysis-small-business/pet-store-pareto-curve.svg "Illustrative data. The dashed line shows what the curve would look like if every product sold the same.")

The curve says it all: it shoots up with the first products and then flattens out. If every product sold the same, the curve would be the diagonal line. The further it bends away from that line, the more concentrated your business is.

Next we looked at how much each class weighs, not just in sales but in gross profit too.

![Stacked bars showing the weight of each class: class A is 20% of products, 80% of sales and 73% of gross profit; class B is 29% of products, 15% of sales and 19% of gross profit; class C is 51% of products, 5% of sales and 9% of gross profit](/images/blog/pareto-analysis-small-business/abc-class-mix.svg "Illustrative data. Half of the catalog brings in 5% of sales.")

Three findings jump out:

- **Half the catalog sells next to nothing.** The 61 class C products add up to just 5% of sales, about $38,000 a year. And 27 of them sell less than $500 a year each.
- **Class A products sell a lot but keep little per dollar.** Their gross margin is 24%, against the store's 27% average. Even so, they bring in 73% of gross profit, because volume wins.
- **The high margin is hiding in classes B and C.** Pet treats run close to a 51% margin, more than double what food makes, and most of them sit in class B.

The last chart plots each product's sales against its margin and splits it into four decision zones.

![Scatter plot of annual sales against gross margin for the 120 products: class A products sit on the right with margins between 20% and 27%, except two above 39%; many class B and C products sit on the left with margins between 40% and 61%; the four zones are stars, traffic drivers, opportunity and review or cut](/images/blog/pareto-analysis-small-business/product-sales-vs-margin.svg "Illustrative data. Each dot is a product; the vertical line marks where class A begins.")

## What to do with each class

This is where the analysis pays off. Each class calls for different treatment.

### Class A: never run out

These are your **traffic drivers**: customers come in for their dog's bag of food, and if it isn't there they go to another store or online, and they may not come back. For the store in our example, the decision was:

- Count inventory on these 24 products every week, not every month.
- Set a reorder minimum for each one and never go below it, even when cash is tight.
- Negotiate better prices or payment terms with food suppliers. With 80% of sales concentrated there, one point of margin is worth more than anywhere else.

The two high-margin A products, a treat and a flea and tick product, are the **stars**: they deserve the best spot in the store.

### Class B: the margin opportunity

This is the money the store wasn't seeing. Class B treats have a strong margin and existing demand. The store moved them next to the register and next to the food, and trained staff to suggest them. If every customer who buys food also takes home a treat, the store's total margin goes up without selling a single new product.

### Class C: review one by one

Class C doesn't get cut wholesale. It gets reviewed. The store split its 61 class C products into three groups:

- **Clear out and stop reordering:** products that sell less than $500 a year and have no reason to be there.
- **Special order only:** products a few loyal customers need, like certain aquarium items.
- **Keep on purpose:** products that sell little on their own but round out an A customer's purchase. A pet store without toys feels incomplete, even if toys sell little.

The cash freed up from class C goes straight into never running out of an A product.

## Common mistakes

- **Looking only at sales.** Without margin, class A looks like the best class and class B looks secondary. At the store, the best opportunity was right in class B.
- **Using too short a period.** A December or a promotion week skews everything. Use 12 months and rerun the analysis every quarter.
- **Cutting new products.** A product that's been on the shelf for two months will always look like class C. Give it time before you judge it.
- **Cutting without checking what's bought together.** A class C product that always ends up in the same bag as a class A product may matter more than it seems. Market basket analysis answers that, and we explain it in our post on [machine learning for small business](/en/blog/machine-learning-small-business/).

## What's next in the series

Pareto analysis ranks your products. The next step is to rank your customers: [RFM analysis](/en/blog/rfm-analysis-small-business/) uses a similar logic to find out who buys most often, who spends the most and who is drifting away. It's the next post in this series on business intelligence for small businesses.

If your data isn't in one place yet, start with our [guide to business intelligence for small business](/en/blog/business-intelligence-small-business/).

## Your next step

Today, export your sales by product for the last 12 months, sort them from highest to lowest and calculate the running total. In under an hour you'll know which products are your A items.

If you want to go further, with margin included, automatic refresh and a dashboard your team can review every week, ShineTechData builds it with you. See our [data analysis](/en/services/data-analysis/) service.
