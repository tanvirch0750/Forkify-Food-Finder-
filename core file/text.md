"PLEASE READ: Changes to the Project API

👉 In the next lecture, I will introduce the food2fork API, which I use to build the project in this section.

However, as of November 30th, this API unfortunately no longer works. I decided to build my own API based on the food2fork API, which is simply called forkify-api.

This is the API that you should use to build the project in this section (I use the original food2fork API in the videos). Don't worry, everything will work almost exactly as in the videos!

So, most of the information in the next video is still relevant because the forkify-api works almost exactly as food2fork, so please just follow the next video, and of course the rest of the project.

👉 Here are the 3 things that you need to know about forkify-api which are DIFFERENT from the food2fork API in the videos:

No API key is required;

No proxy is required;

The URL is forkify-api.herokuapp.com (click for basic documentation).

👉 This is how you use forkify-api instead of the food2fork API.

In the Search.js file (as soon as you get there), just replace:

const res = await axios(`${PROXY}http://food2fork.com/api/search?key=${KEY}&q=${this.query}`);
with this:

const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
Then, in Recipe.js (as soon as you get there), please replace:

const res = await axios(`${PROXY}http://food2fork.com/api/get?key=${KEY}&rId=${this.id}`);
with this:

const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
👉 That's it, that's all you need to know. Again, make these changes as you go through the projects. For now, just keep following the videos. And now, have fun with the project "

Available search queries
carrot
broccoli
asparagus
cauliflower
corn
cucumber
green pepper
lettuce
mushrooms
onion
potato
pumpkin
red pepper
tomato
beetroot
brussel sprouts
peas
zucchini
radish
sweet potato
artichoke
leek
cabbage
celery
chili
garlic
basil
coriander
parsley
dill
rosemary
oregano
cinnamon
saffron
green bean
bean
chickpea
lentil
apple
apricot
avocado
banana
blackberry
blackcurrant
blueberry
boysenberry
cherry
coconut
fig
grape
grapefruit
kiwifruit
lemon
lime
lychee
mandarin
mango
melon
nectarine
orange
papaya
passion fruit
peach
pear
pineapple
plum
pomegranate
quince
raspberry
strawberry
watermelon
salad
pizza
pasta
popcorn
lobster
steak
bbq
pudding
hamburger
pie
cake
sausage
tacos
kebab
poutine
seafood
chips
fries
masala
paella
som tam
chicken
toast
marzipan
tofu
ketchup
hummus
chili
maple syrup
parma ham
fajitas
champ
lasagna
poke
chocolate
croissant
arepas
bunny chow
pierogi
donuts
rendang
sushi
ice cream
duck
curry
beef
goat
lamb
turkey
pork
fish
crab
bacon
ham
pepperoni
salami
ribs
