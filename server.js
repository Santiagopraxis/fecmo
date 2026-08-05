// Archivo de arranque para hosting Node.js tipo Hostinger/Passenger,
// que necesita un unico archivo .js que levante el servidor (no "next start").
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(port, () => {
    console.log(`FECMO web escuchando en el puerto ${port}`);
  });
});
