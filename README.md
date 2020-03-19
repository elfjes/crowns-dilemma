# Crown's Dilemma
A simulation game of the Covid-19 outbreak


# Mathematical Model (Dutch)
Elke dag vinden er nieuwe besmettingen plaats. gemiddeld besmet 1 persoon N andere personen. N wordt ook wel R0 genoemd.
Dit is over de loop tijd van de ziekte. Corona is vrij besmettelijk, en als je niks doet zou de R0 zomaar 7 kunnen zijn. Als je dan aanneemt
dat iemand alleen besmettelijk is als hij ziek is en hij 7 dagen ziek is, is dat gemiddeld 1 per dag. Laten we dat als basis nemen. Elke dag
 worden evenveel mensen besmet als dat er besmette gevallen zijn. Vervolgens kan je maatregelen nemen om dit getal af te laten nemen. 
Vanwege de incubatietijd zie je de effect hiervan pas na n dagen, zeg n=7. Zo worden maatregelen die je nu neemt, pas later zichtbaar.
 Dat is voor mij een beetje de crux van het spel, je probeert te voorspellen wanneer je welke maatregel moet nemen. 

Onder water zitten mensen in verschillende buckets, bijvoorbeeld "besmette mensen die over 2 dagen ziek worden", en elke dag schuift 
iedereen een emmertje op

Dan nu de vraag: hoe bereken je de nieuwe R0 op basis van de maatregelen die je hebt genomen? Daarvoor moeten we even kijken 
hoe een besmetting plaatsvind. Dit gebeurt tijdens interacties tussen mensen. Je zou kunnen zeggen dat elke interactie tussen een 
besmettelijk en een niet-besmette persoon een bepaalde kans heeft om plaats te vinden. Deze kans is dan weer afhankelijk van de 
afstand van de interactie. Hoe dichterbij, hoe groter de kans. zie de volgende curves

N_infect = integral N_interactions * P_infect ds

laten we aannemen dat interacties vanaf een bepaalde afstand geen kans tot infectie hebben, kunnen we dus een kritische afstand 
Smax definieren, wat de integraal wat makkelijker maakt

Welke functies en parameters kiezen we voor Ninteract en Pinfect? De functie is in principe arbitrair, mits we bepaalde parameters kunnen 
zetten (maar ook weer niet teveel  vrijheidsgraden hebben). Welke parameters willen we?

Voor interacties willen we kunnen zeggen hoeveel nabije interacties we hebben (aanraken, s=0), zeg standaard 10
hoeveel totale interacties we hebben (Ntot) (integreren van de interactiefunctie tussen 0 en Smax), zeg standaard 100. We zouden voor 
interacties een exponentiele functie kunnen kiezen N=a*e^(bs). de randvoorwaarden leveren dan a=10 en b~=0.7. de waarde voor b volgt 
uit een vrij ingewikkeld resultaat van de integraal (thnx wolfram alpha) en is afhankelijk van a en Ntot. We zouden een andere functie 
(bijvoorbeeld polynoom) kunnen kiezen die een duidelijkere relatie legt, maar dat is voor nu niet nodig

Voor de kans op besmetting kunnen we een negatieve exponentiele functie kiezen P=c*e^(-d*s). Een van de randvoorwaarden hierbij is 
dat P op Smax vrij klein is, laten we zeggen 0.01 x de kans bij s=0. Dit legt de vorm van de functie vast. De andere randvoorwaarde
 over de amplitude van de functie volgt uit de basis aanname gemiddeld 1 van de interacties per dag een besmetting oplevert (dit 
moet ik nog even uitwerken)

Maatregelen vallen in 1 van 3 categorien: 
 - Social distancing, dit beinvloed het aantal interacties per dag (a varieren)
 - Hygiene, deze beinvloeden de kans op besmetting (c of d varieren)
 - Contactmaatregelen, voorkomen dat er interacties plaatsvinden op een korte afstand. Dit is een beetje een geval apart. Eigenlijk 
   verandert dit de vorm van de Interactie-functie bij kleine s. interacties die normaal plaatsvonden op zeg, s=0, vinden nu plaats op s=1. 
   Het is vrij lastig de vorm van de functie op deze manier aan te passen. Maar wat makkelijker is, is om infectiekans
   aan te passen bij kleine s. door bijvoorbeeld voor s=0 de kans te nemen bij s=1 (mininum nemen tussen s=0 en s=1)

Zo kun je dus elke dag op basis van de dan geldende maatregelen het aantal nieuwe besmettingen uitrekenen.

Besmettingen vinden alleen plaats tussen besmettelijke mensen en onbesmette mensen. Het aantal infecties op een dag moet je 
nog even reduceren met de fractie van onbesmette mensen in je populatie, waardoor het op een gegeven moment uitdooft




## Development
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```
