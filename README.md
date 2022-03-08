Projektin tavoite
-
Projektin tavoitteena on muuntaa Web 1-kurssilla puhtaasti Javascriptillä tehty nettisivu React-pohjaiseksi. Projekti on jaettu komponentteihin rekisteröityminen, sisäänkirjautuminen, pääikkuna ja navigointipalkki. Viimeisin sijaitsee App.js-tiedostossa.

Projektissa on hyödynnetty React Bootstrap-kirjastoa, sopivissa paikoissa omia tyylejä hyödyntäen.

REST-rajapinnan kuvaus
-
Projekti on toteutettu REST-rajapintaa hyödyntäen. Seuraavaksi käydään läpi projektissa käytetyt Http-metodit (tässä projektissa vain GET ja POST):

###GET-metodit:

**Arvostelujen hakemiseen: "/api/results"**
* Kyselyssä haetaan klikattua id:tä vastaavan asunnon osoite, id, kunto, viihtyvyys, kokonaisarvosana, sekä vapaasana teitokannasta. Apartments taulussa on osoitetiedot sekä pääavaimena id, joka viittaa reviews taulun id:hen joka toimii vierasavaimena.

**Kohteiden osotteiden hakemiseen: "/api/address"**
* Kyselyssä haetaan kaikki apartments taulun osoitteet ja id:t, jotta ne voidaan asettaa sivulla oleville kohteille.

**Kohteen kaikkien tietojen hakemiseen: "/api/apartments"**
* Kyselyssä haetaan apartments-taulusta kaikki kentät.

**Keskustelupalstan otsikoiden hakemiseen: "/api/chat"**
* Kyselyssä haetaan otsikko, otsikolle id, käyttäjätunnus sekä viestin lähettämisen päivämäärä tietokannan chat taulusta.

**Keskustelujen vastauksien hakemiseen: "/api/chatcontent"**
* Kyselyssä haetaan chat_answers taulusta kaikki vastaukset jotka on lisätty tiettyyn keskusteluun. Haku tapahtuu id:n perusteella.

###POST-metodit:

**Uuden keskustelun aloitus: "/api/addchat"**
* SQL kyselyssä chat tauluun lisätään käyttäjätunnus ja käyttäjän kirjoittama otsikko.

**Vastauksen lisääminen uuteen keskusteluun: "/api/addchatanswer"**
* SQL kyselyssä chat_answers tauluun lisätään vastaus, chatin id sekä käyttäjänimi sen perusteella mihin keskusteluun käyttäjä lähettää vastauksen.

**Arvostelulomakkeen lähetys: "/api/sendform"**
* SQL kyselyssä reviews tauluun lisätään arvot (kunto, viihtyvyys, kokonaisarvosana, vapaa sana) käyttäjän syöttämän datan perusteella. Kohteen id johon arvostelu lisätään saadaan app.get kyselyllä tietokannasta.

**Uuden käyttäjän rekisteröinti: "/api/adduser"**
* Kyselyllä lisätään uuden käyttäjn käyttäjätunnus ja salasana tietokantaan. Käyttäjän salasana salataan bcryptillä ennen tietokantaan lisäämistä.

**Käyttäjän kirjautuminen: "/login"**
* Kyselyssä tarkastetaan aluksi löytyykö käyttäjän syöttämä nimimerkki tietokannasta ja mikäli löytyy, verrataan käyttäjän syöttämän salasanan suolaa tietokannassa olevan salasanaan ja mikäli ne ovat samat, luodaan käyttöoikeus joka lähetetään serveriltä käyttäjälle ja käyttäjän päässä tallennetaan localstorage-muistialueelle.


