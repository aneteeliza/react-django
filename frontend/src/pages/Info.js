// Info.js
import React from 'react';
import { Card, Container } from 'react-bootstrap';

function Info() {
  return (
    <Container>
      <Card className="w-70 text-center p-4 shadow-lg rounded">
        <h3 className="mb-4">Publiskā datubāze "Latviešu karavīri"</h3>
        {/* About the Database Section */}
        <section className="mb-4 text-start">
          <h4>Par datubāzi</h4>
          <p className="text-muted">
            Datubāze "Latviešu karavīri" piedāvā iespēju piekļūt informācijai par latviešu karavīriem. Šeit var atrast informāciju par karavīru vēsturi, viņu dalību dažādos militārajos notikumos, un daudz ko citu. Datubāze ir izveidota, lai atvieglotu piekļuvi šiem vēsturiskajiem datiem, un ir piemērota gan pētniekiem, gan interesentiem.
          </p>
        </section>
        <hr />
        {/* FAQ Section */}
        <section className="mb-4 text-start">
          <h4>BUJ (Biežāk Uzdotie Jautājumi)</h4>
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <strong>Kā reģistrēties?</strong><br />
              Lai reģistrētos, nospiediet pogu "Reģistrēties" un aizpildiet nepieciešamo informāciju.
            </li>
            <li className="mb-2">
              <strong>Kā veikt meklēšanu?</strong><br />
              Pēc pieteikšanās izmantojiet meklēšanas iespēju, lai atrastu informāciju par karavīriem.
            </li>
            <li>
              <strong>Ko darīt, ja aizmirstu paroli?</strong><br />
              Ja aizmirstat paroli, lūdzu, sazinieties ar mums, izmantojot norādīto e-pasta adresi.
            </li>
          </ul>
        </section>
        <hr />

        {/* Contact Section */}
        <section>
          <h4 className="text-start">Kontakti</h4>
          <p className="text-muted text-start">
            Atbildīgā institūcija: <a href="https://www.karamuzejs.lv/" className="text-decoration-none">Latvijas Kara muzejs</a>
          </p>
          <p className="text-muted text-start">
            E-pasts saziņai: <a href="mailto:datubaze@karamuzejs.lv" className="text-decoration-none">datubaze@karamuzejs.lv</a>
          </p>
          <p className="text-muted text-start">
            Atbildes uz e-pastiem tiek sniegtas darba dienās, darba laikā. Jautājumiem par datu bāzes saturu atbildēs Vēstures departaments, savukārt par tehniskām problēmām, ja nepieciešams, varēs palīdzēt IT Atbalsta komanda.
          </p>
        </section>
      </Card>
    </Container>
  );
}

export default Info;
