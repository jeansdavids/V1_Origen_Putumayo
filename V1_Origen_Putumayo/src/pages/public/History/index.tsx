

import "../../../styles/Historia.css/styles.css";

const History = () => {
  return (
    <main className="history">

      {/* SECCIÓN 1 – HERO */}
      <section className="history-hero">
        <h1 className="hero-title">
          NUESTRA HISTORIA COMIENZA EN LA TIERRA <br />
          PERO CRECE CON LAS PERSONAS
        </h1>
      </section>

      {/* SECCIÓN 2 – PROPÓSITO */}
      <section className="history-purpose">

        <div className="purpose-header">
          <h2>NUESTRO PROPÓSITO</h2>
          <p>Lo que nos guía hoy y hacia donde queremos llegar mañana</p>
        </div>

        <div className="purpose-cards">
          <div className="card">
            <h3>MISIÓN</h3>
            <p>
              Conectar los productos culturales y sostenibles del Putumayo
              con nuevos mercados, impulsando a los productores locales.
            </p>
          </div>

          <div className="card">
            <h3>VISIÓN</h3>
            <p>
              Llevar la identidad cultural del Putumayo más allá de sus fronteras,
              convirtiéndola en un referente de origen y sostenibilidad.
            </p>
          </div>
        </div>

        <h4 className="closing-text">
          Detrás de cada producto hay personas, <br />
          territorio y conocimiento ancestral.
        </h4>
        

      </section>

    </main>
  );
};


export default History;
