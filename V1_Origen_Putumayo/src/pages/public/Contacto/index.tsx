import "../../../styles/Contact.css/styles.css";
import.meta.env.VITE_WHATSAPP_URL



export default function OrigenSection() {
  return (
    <section className="contact">
      {/* ================= DIRECT CONTACT ================= */}
      <div className="direct-contact">
        {/* MITAD VERDE */}
        <div className="contact-left">
          <h1 className="contact-title">Contáctanos</h1>

          <p className="contact-subtitle">
            Un espacio abierto para conversar, compartir ideas y construir
            juntos nuevas oportunidades
          </p>

          <div className="social-icons">
            <a
  href={import.meta.env.VITE_APP_WHATSAPP_URL}
  target="_blank"
  rel="noreferrer"
>
  <i className="bi bi-whatsapp"></i>
</a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-facebook"></i>
            </a>

            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-instagram"></i>
            </a>

            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-youtube"></i>
            </a>
          </div>
        </div>

        {/* MITAD BLANCA */}
        <div className="contact-right">
          <div className="info-item">
            <i className="bi bi-whatsapp"></i>
            <div>
              <h3>Customer Support</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque vel lacus nec justo placerat.
              </p>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-envelope"></i>
            <div>
              <h3>Email Us</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque vel lacus nec justo placerat.
              </p>
            </div>
          </div>

          <div className="info-item">
            <i className="bi bi-geo-alt"></i>
            <div>
              <h3>Many Locations</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque vel lacus nec justo placerat.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LOCATION SECTION ================= */}
      <div className="location-split">
        {/* IZQUIERDA - FORMULARIO */}
        <div className="location-left">
          <h2 className="location-title">Write a Message</h2>

          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();

              const form = e.target as HTMLFormElement;
              const name = (form.elements[0] as HTMLInputElement).value;
              const email = (form.elements[1] as HTMLInputElement).value;
              const message = (form.elements[2] as HTMLTextAreaElement).value;

              const subject = encodeURIComponent("Contacto desde la web");

              const body = encodeURIComponent(
                `Hola,

Has recibido un nuevo mensaje desde la web.

Nombre: ${name}
Correo: ${email}

Mensaje:
${message}
`
              );

              window.location.href = `mailto:${import.meta.env.VITE_CONTACT_EMAIL}?subject=${subject}&body=${body}`;
            }}
          >
            <div className="form-row">
              <input
                type="text"
                placeholder="Name"
                className="form-input"
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                className="form-input"
                required
              />
            </div>

            <textarea
              placeholder="Write a message"
              className="form-textarea"
              required
            ></textarea>

            <button type="submit" className="contact-btn">
              Send Message
            </button>
          </form>
        </div>

        {/* DERECHA - MAPA */}
        <div className="location-right">
          <h2 className="map-title">Location</h2>

          <div className="map-container">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps?q=Medellín,+Colombia&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <p>© 2026 - Todos los derechos reservados</p>
      </footer>
    </section>
  );
}
