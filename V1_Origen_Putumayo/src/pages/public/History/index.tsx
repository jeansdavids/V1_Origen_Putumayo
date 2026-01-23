import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const History: React.FC = () => {
    return (
    <main className="history">
      <section className="firstSection" aria-label="Introducción de historia">

        <div className="history-content1">
          <h1 className="history-introduction">
            NUESTRA HISTORIA COMIENZA EN LA TIERRA <br /> PERO CRECE CON LAS PERSONAS
          </h1>
        </div>

        <div className="history-content2">
          <h1 className="history-purpose">
            NUESTRO PROPOSITO
          </h1>
          <p className="purpose-subtitle">
            Lo que nos guia hoy y hacia donde queremos llegar mañana
          </p>
        </div>

        <div className="mision">
          <h1 className="text-mision">
            Conectar los productos <br /> culturales y sostenibles <br /> 
            del Putumayo <br /> con nuevos mercados, <br />
            impulsando a los productores <br /> locales y preservando la <br /> 
            identidad de la región a través de <br /> una plataforma digital moderna.
          </h1>
        </div> 

        <div className="vision">
          <h1 className="text-vision">
            Llevar la identidad cultural del <br /> Putumayo más allá de sus <br /> 
            fronteras, convirtiéndola en un <br /> referente de origen, <br />
            sostenibilidad y valor cultural.
          </h1>
        </div>

        <h1 className="under-title">
          Detrás de cada producto hay personas, <br /> territorio y conocimiento ancestral.
        </h1>

      </section>
    </main>

    );
}; 
export default History;
