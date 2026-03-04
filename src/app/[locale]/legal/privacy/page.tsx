import { getTranslations } from 'next-intl/server';
import { I18N } from '@/i18n/keys';

export default async function PrivacyPage(){
  const t = await getTranslations('Legal.privacy');

  return(
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t(I18N.Legal.privacy.title)}</h1>
        
        <embed
          src="https://ecommer-stg-product-images.s3.us-east-2.amazonaws.com/politica_de_privacidad.pdf"
          type="application/pdf"
          width="100%"
          height="800px"
          className="border border-border rounded-lg"
        />
      </div>
    </main>
  )
}