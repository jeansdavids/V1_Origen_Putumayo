import "../../../styles/Historia.css/styles.css";

export default function OrigenSection() {
  return (
    <section className="history">

      {/* HISTORIA */}
      <div className="history-hero">
        <h1 className="hero-title">
          NUESTRA HISTORIA COMIENZA EN LA TIERRA<br />
          <span>PERO CRECE CON LAS PERSONAS</span>
        </h1>
      </div>

      {/* PROPÓSITO */}
      <div className="history-purpose">
        <div className="purpose-header">
          <h2>NUESTRO PROPÓSITO</h2>
          <p>
            Lo que nos guía hoy y hacia donde queremos llegar mañana
          </p>
        </div>

        <div className="purpose-cards">
          <div className="card">
           
            <p>
              Conectar los productos culturales y sostenibles del Putumayo
              con nuevos mercados, impulsando a los productores locales y
              preservando la identidad de la región a través de una plataforma
              digital moderna.
            </p>
          </div>

          <div className="card">
            
            <p>
              Llevar la identidad cultural del Putumayo más allá de sus
              fronteras, convirtiéndolo en un referente de origen,
              sostenibilidad y valor cultural.
            </p>
          </div>
        </div>

        <p className="closing-text">
          DETRÁS DE CADA PRODUCTO HAY PERSONAS,<br />
          TERRITORIO Y CONOCIMIENTO ANCESTRAL.
        </p>
      </div>

    </section>
  );
}
