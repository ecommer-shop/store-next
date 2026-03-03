export default function PrivacyPage(){
  return(
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Políticas de Privacidad</h1>
        
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