import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

function Info() {
  const { t } = useTranslation();

  return (
    <Container>
      <Card className="w-70 text-center p-4 shadow-lg rounded">
        <h3 className="mb-4">{t('Publiskā datubāze "Latviešu karavīri"')}</h3>

        {/* About the Database Section */}
        <section className="mb-4 text-start">
          <h4>{t('Par datubāzi')}</h4>
          <p className="text-muted">
            {t('Datubāze "Latviešu karavīri" piedāvā iespēju piekļūt informācijai par latviešu karavīriem. Šeit var atrast informāciju par karavīru vēsturi, viņu dalību dažādos militārajos notikumos, un daudz ko citu. Datubāze ir izveidota, lai atvieglotu piekļuvi  vēsturiskajiem datiem, un ir piemērota gan pētniekiem, gan interesentiem.')}
          </p>
        </section>

        <hr />

        {/* FAQ Section */}
        <section className="mb-4 text-start">
          <h4>{t('Biežāk Uzdotie Jautājumi')}</h4>
          <ul className="list-unstyled text-muted">
            <li className="mb-2">
              <strong>{t('Kā veikt meklēšanu?')}</strong><br />
              {t('Pēc pieteikšanās dodieties uz sadaļu “Meklēšana”, izvēlieties tabulu, kurā vēlaties meklēt, un ievadiet datus par karavīru, kura informāciju vēlaties apskatīt.')}
            </li>
            <li>
              <strong>{t('Ko darīt, ja aizmirstu paroli?')}</strong><br />
              {t('Ja aizmirstat paroli, lūdzu, sazinieties ar mums, izmantojot norādīto e-pasta adresi. Mēs nosūtīsim jums jaunu paroli, kura būs jāmaina pēc pirmās pieteikšanās.')}
            </li>
          </ul>
        </section>

        <hr />

        {/* Contact Section */}
        <section>
          <h4 className="text-start">{t('Kontakti')}</h4>
          <p className="text-muted text-start">
            {t('Atbildīgā institūcija')}: <a href="https://www.karamuzejs.lv/" className="text-decoration-none">Latvijas Kara muzejs</a>
          </p>
          <p className="text-muted text-start">
            {t('E-pasts saziņai')}: <a href="mailto:datubaze@karamuzejs.lv" className="text-decoration-none">datubaze@karamuzejs.lv</a>
          </p>
          <p className="text-muted text-start">
            {t('Atbildes uz e-pastiem tiek sniegtas darba dienās, darba laikā. Jautājumiem par datu bāzes saturu atbildēs Vēstures departaments, savukārt par tehniskām problēmām, ja nepieciešams, varēs palīdzēt IT atbalsta komanda.')}
          </p>
        </section>
      </Card>
    </Container>
  );
}

export default Info;
