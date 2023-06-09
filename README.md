# invoice-gen (rynvoice?)

An application to make creating and managing invoices easier for those of us who don't use existing tools or spreadsheets to do so.

It's also fun to build, so why not.

Credit to T3 stack & Shadcn UI for making this project like butter. Dashboard repurposed from Shadcn's examples 😎

## Features

🚚📝 – Creation, updating and management of invoices.

👓👇 – Preview of invoices with download functionality.

📮📩 – Uses React Email to enable sending invoices in app for clients to view and pay.

🔎📱 – Dashboard to view previous invoices and some basic analytics.

🔒🔑 – GitHub authentication via NextAuth.

Dashboard
![Dashboard](/.github/images/dashboard.jpeg?raw=0)

Invoices table
![Invoices table](/.github/images/invoices_table.jpeg?raw=0)

Invoice creation
![Invoice creation](/.github/images/invoice_creation.jpeg?raw=0)

Invoice payment
![Invoice payment](/.github/images/payment_page.jpeg?raw=0)

## Run locally

Populate your .env file.

`yarn`

`yarn db push`

`yarn dev`
