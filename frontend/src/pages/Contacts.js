import { useTranslation } from 'react-i18next';

export default function Contacts() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('Kontakti')}</h1>
      <div className="contact-info">
        <p><strong>{t('Atbildīgā institūcija')}:</strong> {t('Latvijas Kara muzejs')}</p>
        <p>
          <strong>{t('Saziņai e-pasts')}:</strong>{' '}
          <a href="mailto:datubaze@karamuzejs.lv">datubaze@karamuzejs.lv</a>
        </p>
        <p>{t('Atbildes uz e-pastiem tiek sniegtas darba dienās, darba laikā.')}</p>
        <p><strong>{t('Jautājumi par saturu')}:</strong> {t('Uz šiem jautājumiem atbild Vēstures departaments.')}</p>
        <p><strong>{t('Tehniski jautājumi')}:</strong> {t('Sarežģītāku jautājumu gadījumā var tikt piesaistīti LR AM IT Atbalsta komanda vai mājaslapas izstrādātāji.')}</p>
      </div>
    </div>
  );
}
