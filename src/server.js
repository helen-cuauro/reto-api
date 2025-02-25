const express = require("express");
const https = require("https");
const cheerio = require("cheerio");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;
const URL = "https://documents.bvl.com.pe/empresas/entrder1.htm";
app.use(cors());

// Agente HTTPS para ignorar la verificación SSL
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(URL, {
      httpsAgent,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const html = response.data; 
    const $ = cheerio.load(html);

    let resultados = [];

    $("table.Tablas tbody tr").each((index, element) => {
      const celdas = $(element).find("td");

      if (celdas.length === 7) {
        resultados.push({
          valor: $(celdas[0]).text().trim(),
          derechos: $(celdas[1]).text().trim(),
          concepto_ejercicio: $(celdas[2]).text().trim(),
          fecha_acuerdo: $(celdas[3]).text().trim(),
          fecha_corte: $(celdas[4]).text().trim(),
          fecha_registro: $(celdas[5]).text().trim(),
          fecha_entrega: $(celdas[6]).text().trim(),
        });
      }
    });

    res.json({ success: true, data: resultados });
  } catch (error) {
    console.error("Error al hacer la petición ❌", error.message);
    res.status(500).json({ success: false, message: "Error al obtener la página" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
