## Installation
- npm init -y
- install devDependencies
- install dependencies

## Pages
- index.astro: Homepage
- details.astro: individual artwork details
- login.astro: Login page
- register.astro: Registration.page
- add.astro: Add new artwork
- edit.astro: edit existing artwork

## Routes
- artwork.routes.ts => page.routes.ts
- server.ts => app.js main server file

## Progress
- [ ] Front end and back end connected 

## Structure
nodejs-artwork-project
├── src
│   ├── config
│   │   └── db.ts         // Database connection
│   ├── controllers
│   │   └── artwork.controller.ts
│   ├── models
│   │   └── artwork.model.ts
│   ├── routes
│   │   └── artwork.routes.ts
│   └── server.ts         // Main Express server file
├── .env                  // Environment variables (e.g., MongoDB URI)
├── package.json
├── tsconfig.json
└── .gitignore

Replaced database calls (Artwork.find(), Artwork.findById(), etc.) with readArtworks() and writeArtworks()