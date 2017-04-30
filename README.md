# Episcope testuppgift
![Image of assignment](http://puu.sh/vAZkE/e5b8d4d1ae.png)
Detta är koden till den testuppgift jag fick. Jag hade ibland lite svårt med tolkning av uppgiften, men vid de tillfällena så förklarar jag hur jag tolkade frågan. Jag kommer även förklara kodens flöde. 

## Uppgift 1 - Bootstrap - Ajax
Den andra delen av uppgiften hade jag väldigt svårt att förstå vad som efterfrågades och lämnade den i stort. Jag försökte däremot att visa de (vad jag uppfattade som) efterfrågade kunskaperna i den första delen av uppgiften.

Frontend koden bygger lite på MVC-tänk. Menyn och sökinställningarna har sin varsin "vy" och en controller. Till dessa finns modellen som ansvarar för data och anrop till backend.

I den första uppgiften tolkade jag uppgiften som att "använd ajax anrop för att dynamiskt ändra innehåll beroende på om någon/vem som är inloggad" (med några fler detaljer). 

### Frontend
![Image of navbar](http://puu.sh/vAZeZ/c55a36550b.png)
<sup>*Vy som utloggad. "Remember me" funktionen finns där för den andra uppgiften*</sup>  

Html-koden finner du [här](front/index.html).

Vid laddning så skickas ett get request till backend och frågar om meny-data. Denna initieras från [meny-vyn](front/js/views/navbarView.js). Vid anropet så får vi antingen data för den som är inloggad, eller information om att vi inte är inloggade och DOMen ändras inte. Vid testning har jag två användare: user1 och user123. Vardera har tre maskiner var som laddas in vid inloggning. 

----

![pre-login](http://puu.sh/vAZYJ/903d34ae02.png)

----

![post-login](http://puu.sh/vAZZC/1044cf2514.png)

----

![post-login-machines-user1](http://puu.sh/vB06O/15dc434eb6.png)

----

![post-login-machines-user123](http://puu.sh/vB0x9/c41f5e6acd.png)

----

Vid inloggning så skickas ett post-request till backend där uppgifter autentiseras. Lyckas inloggningen så får vi information om menyn och DOMen uppdateras med ny data. Login-knappens event hanteras i [kontrollern](front/js/controller/navbarViewController.js) jämt med logout-knappen. *Observers* i kontrollern lyssnar efter när saker ändras, tex lyckas inloggning, och hanterar situationen efter behov. Till exempel så göms inloggnings fälten vid en lyckad inloggning. När vi får ny meny-data så notifieras en annan observer som hanterar den nya datan och sätter in det i DOMen. 

Eftersom från serverns sida så håller en session tills vi stänger webbläsaren (då sessions-cookie:n går ut) så håller användaren sig inloggad tills man loggar ut eller webbläsaren stängs. 

### Backend

I backend så använder jag mig utav en väldigt simpel route-princip: Definiera routes -> Om en definierad route efterfrågas, hantera requestet, annars skicka 404. En definierad statisk mapp finns också för till exempel js-filer. Jag har även en Pseudo Databas (back/data/pdb.json) där jag har användare, deras maskiner och även autentiserings-koder (används i uppgift 2).

Servern körs genom [server.php](back/server.php). Det som görs där är att den efterfågade routen hämtas och sedan hanteras. Routes definieras i [routes.php](back/routes.php) som använder sig av RouteHandler-klassen som definieras i [routeHandler.php](back/routeHandler.php). I RouteHandler så finns funktioner för att definiera routes och funktioner som ska hantera dessa request (både get- och postrequests) samt definitioner av statista mappar. 

När vi vill hämta meny-data så gör vi ett get-request till "/data" som hanteras [här](back/routes.php#L91). Vi kollar om sessionen har en inloggad användare. Har vi ej det så skickar vi tom data tillbaka. Annars så häntar vi användarens maskin-data och stoppar in denna i vår meny-mall och skickar tillbaka detta. 

I uppgiften så frågades: "Testa gärna att skicka med en GET-variabel, tex userID=123". Detta ansåg jag som en konstig funktion i kombination med inloggning, men jag har lagt till sådan funktionalitet med en singelrads modifikation i frontend (det går lite i konflikt med uppgift 2) så det ska gå att få en användares data och anses som inloggad med "/?username=user123" (sedan så ansåg jag det konstigt att komma åt en annan användares data). Men ett request till "/" skickar tillbaka [index.html](front/index.html) då alla javascript filer efterfrågas som då också skickas tillbaka eftersom det är i den statiskt-definierade mappen. 

## Uppgift 2

I uppgift två så skapade jag en minifierad version av en "remember me" funktion. Ett exempel på något som inte görs är att utföra hash-and-salt på nyckeln innan den sparas och en möjlig simpel "kryptering" på nyckeln till localStorage. Sedan så används inte en faktiskt databas utan en substitut (en json-strukturerad fil). Men all data som hämtas från databasen är lätta att skriva som querys.  

Tanken med implementationen är att vid inloggning av en användare med "Remember me" checkad så skapar servern en randomiserad och temporär nyckel på 10 bytes (bör vara större i produktion (>= 64 bytes)). Denna skickas tillbaka till frontend och sparas jämt med användarnamnet (bör vara ett användar-id) i localStorage. När sidan laddas in så kollar sidan om dessa uppgifter finns i localStorage. Finns de, så hämtas de och skickas med ett post-request till servern. Servern kollar om det finns en sådan nyckel för den användaren i databasen. Finns denna och uppgifter stämmer så loggas användaren in, en ny nyckel skapas och skriver över den gamla och den nya nyckeln skickas tillbaka till klienten. Loggar användaren ut så tas uppgifterna bort från localStorage. 

Dessa temporära nycklar bör sparas i en separat table så en användare kan använda "komma ihåg" funktionen på flera enheter. 

Så, en sådan query kan se ut som följande: 

```SQL
SELECT username, rem_token FROM authenticated_users WHERE username = '<användarnamn>' AND rem_token = '<temporär nyckel>'
```

I denna table bör även ett datum sparas som säger när den skapades. Efter ett tag bör dessa tas bort så det inte är i databasen helatiden. 

----

På detta sätt så kan man "fortsätta" sin session även när sessionen redan är över.


## Efterord

Om du vill prova koden själv så kör, i roten, `$ php -S localhost:8000 back/server.php`.

Jag har själv kört koden med PHP 7.0+. Däremot så kan det finnas buggar. Jag har själv inte provat allt. Jag kommer själv också lägga upp en körbar version på [denna sida](http://lucaslj.com) (har än inte fixat SSL certifikat).
