## What is League Oracle? 🎮🔍
League Oracle is a statistical analysis tool meant to be used in conjunction of a live League of Legends game, specifically focusing on the Summoner's Rift game mode. Players can freely screenshot their in-game loading screen, input it into League Oracle, and receive a whole ton of useful data pertaining to their match: the Summoners, the Champions, and everything in between. 

A great player is able to observe key information during the game, as it happens, and utilize it in order to optimize their gameplay strategies. League Oracle provides you with vital pre-game information regarding your teammates, the enemy team, among other things, so you can leverage it to get clinch that next promotion closer to the ever elusive Challenger ranking.

## The Technical Details
**Technologies Used: React.js, Node.js, Express.js, MongoDB, Tesseract OCR Engine, Riot Games API**

League Oracle works by first utilizing Google's **Tesseract OCR Engine** on the backend built using **Node.js** and **Express.js**, in order to read the data off your in-game loading screen. This includes the identity of Summoners, Champions, the Summoner makeup of each team, and the role/lane of each Summoner. Following that, it makes API calls to the **Riot Games API** and consumes the fetched JSON data to crunch historical game data at your convenience. 

Practical pre-game statistics like the win rate ratios of each specific Summoner are then displayed for your viewing pleasure. This means you'll be able to quickly have an overview of each Summoner's recent career: how they fared using this specific Champion over the past few matches, or perhaps even how they fared on this specific lane recently. The whole idea is to quickly grab essential historical data on all the Summoners in your match, akin to doing background research on each of them. This way you can deduce whether to pick up the Doran's Ring starter item or opt to rush for Rod of Ages early on in the game.

The initial screenshot data is then stored in two parts to a **MongoDB** database: the image information, and the textual information. Users of League Oracle will be able to view previous oracles, enabled by the textual information stored in the database. The image information is used for performance and character recognition purposes to benchmark and allow developers (me) to further optimize the data fetching and image processing strategies in future iterations.

**React.js**, **HTML**, and **CSS** bring it all together to build a front-end UI that the user interacts with to navigate around the League Oracle app.
