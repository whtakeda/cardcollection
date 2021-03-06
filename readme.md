# Card Collection Challenge

Card Collection Chalenge is a suite of card games based on a standard deck of cards.  The games include (in current or future releases)

1. Concentration/Memory
2. Whack-a-Card
3. Mastermind
4. Card Search
5. Race the Clock

---

## User Stories

#### MVP (Ongoing)

#### MVP (Completed)
* [x] As a player the game should be winnable, because the Kobayashi Maru is no fun
  * [x] Well-defined goal/outcome
  * [x] Keep score
* [x] As a player, I want the controls to be simple/easy-to-use
  * [x] mouse controllable
  * [x] drag-and-drop for Mastermind and Race the Clock
* [x] As a player,I want the game to have replay value
  * [x] Create multiple games - Memory, Whack-a-card, Mastermind, Race the clock
* [x] As a player, the game interface should be visual and interactive, because Zork is so 1980s
  * [x] Graphical user interface
  * [x] Use images and animation where appropriate
  * [x] User should receive visual feedback on game state/status
* [x] As a player the game should be winnable, because the Kobayashi Maru is no fun
  * [x] Ties are allowed
  * [x] Games should be scored individually, and individual wins should be scored cumulatively so players can compete against each other
* [x] As a player, the game should have replay value and be challenging, so I have a good way to waste my free time
  *  [x] Multiple difficulty levels and/or multiple winning objectives, and/or multiple games
* [x] As a player, the game should be easy to learn, because nobody wants to read the instructions
  * [x] Simple rules
  * [x] Instructions (just in case)

#### Icebox

* [ ] As a player,I want the game to have replay value
  * [ ] Create multiple games - Race the Clock

---

## Technical Specs

This game is built using the following technologies

* HTML and CSS for the GUI
* Javascript and jQuery for the game logic and updating the the GUI based on changes in the game state

---

## Design Approach

The game was initially designed with user stories and wireframing.  After wireframing the inital screen, a rapid prototype was developed to test the viablity of the wireframe layout.  It was discovered that the available screen space was not large enough to fit the wireframed design so it was modified in the prototype to make better use of the available space.

Next, the necessary data was identified (data types) and actions on the data were defined (functions/methods).

---

## Get Started

---

## Known Bugs/issues

* GUI does not scale well.  Requires nearly a full screen to display correctly.  Basically unplayable on mobile devices
* Possible bug in Mastermind that may allow the same card to be selected twice, making the game unwinnable

---

## Next Steps

* Improve status/message feedback in games.
* More detailed instructions
* Add animation for "flipping" card over
* Add support for mobile devices
* Improve styling of GUI
* Create a nice logo and come up with a better name
