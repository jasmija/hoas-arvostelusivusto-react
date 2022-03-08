Projektin tavoite
-
Projektin tavoitteena on muuntaa Web 1-kurssilla puhtaasti Javascriptillä tehty nettisivu React-pohjaiseksi. Projekti on jaettu komponentteihin rekisteröityminen, sisäänkirjautuminen, pääikkuna ja navigointipalkki. Viimeisin sijaitsee App.js-tiedostossa.

Projektissa on hyödynnetty React Bootstrap-kirjastoa, mitä on avustettu lisäämällä omia tyylejä.

REST rajapinnan kuvaus
-

Projekti on toteutettu REST- rajapintaa hyödyntäen. Tietokannasta haetaan dataa GET metodeilla ja tietokantaan viedään dataa POST metodeilla.

GET metodia käytetään projektissa:
-
Asuntojen osotteiden hakemiseen: "/api/address"
* SQL kyselyssä haetaan kaikki apartments taulun osoitteet ja id:t, jotta ne voidaan asettaa sivulla oleville kohteille.

Arvostelujen hakemiseen: "/api/results"
* SQL kyselyssä haetaan klikattua id:tä vastaavan asunnon osoite, id, kunto, viihtyvyys, kokonaisarvosana, sekä vapaasana teitokannasta. Apartments taulussa on osoitetiedot sekä pääavaimena id, joka viittaa reviews taulun id:hen joka toimii vierasavaimena.

Keskustelupalstan otsikoiden hakemiseen: "/api/chat"
* SQL kyselyssä haetaan otsikko, otsikolle id sekä käyttäjätunnus tietokannan chat taulusta.

Keskustelujen vastauksien hakemiseen
* SQL kyselyssä haetaan chat_answers taulusta kaikki vastaukset jotka on lisätty tiettyyn keskusteluun. Haku tapahtuu id:n perusteella.

Rekiteröitymisessä tarkastetaan onko käyttäjätunnus jo olemassa
* SQL kyselyssä haetaan tietokannasta käyttäjänimeä, jonka käyttäjä on syöttänyt inputkenttään. Mikäli käyttäjänimi löytyy jo tietokannasta, annetaan virheilmoitus.

Kirjautumisessa tarkastetaan käyttäjätunnuksen ja sitä vastaavan salasanan yhteensopivuus
* SQL kyselyssä etsitään tietokannasta kyseinen käyttäjätunnus ja salasana. Mikäli ne vastaavat toisiaan sisäänkirjoutuminen onnistuu, muuten annetaan virheilmoitus.


POST metodia käytetään projektissa:
-
Arvostelulomakkeen lähetys: "/api/sendform"
* SQL kyselyssä reviews tauluun lisätään arvot (kunto, viihtyvyys, kokonaisarvosana, vapaasana) käyttäjän syöttämän datan perusteella. Kohteen id johon arvostelu lisätään saadaan app.get kyselyllä tietokannasta.

Uuden keskustelun aloitus: "/api/addchat"
* SQL kyselyssä chat tauluun lisätään käyttäjätunnus ja käyttäjän kirjoittama otsikko.

Vastauksen lisääminen uuteen keskusteluun: "/api/addchatanswer"
* SQL kyselyssä chat_answers tauluun lisätään vastaus sekä chatin id sen perusteella mihin keskusteluun käyttäjä lähettää vastauksen.

Käyttäjän kirjautuminen
* SQL kyselyssä lähetetään post sanomana käyttäjän syöttämien input kenttien arvot serverille.

Uuden käyttäjän rekisteröityminen
* SQL kyselyllä lisätään uuden käyttäjn käyttäjätunnus ja salasana tietokanaan.


