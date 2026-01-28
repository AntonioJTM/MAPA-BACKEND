const path = require("path");

exports.getTest = (req, res) => {
  try {
    res.send("Servidor Express multimedia usuarios funcionando correctamente.");
  } catch (error) {
    console.error(error);
  }
};

exports.getJuegos = (req, res) => {
  try {
    const { subtipo } = req.body;
    if (!subtipo) {
      return res.status(400).json({
        error: "Parámetro faltante",
        message: "Se requiere el parámetro 'subtipo' en el cuerpo de la solicitud.",
      });
    }
    const query = `call spGetMultimediaBySub(?)`;
    req.db.query(query, [subtipo], (error, results) => {
      if (error) {
        if (error.sqlMessage) {
          res.status(500).json({ error: "Error en la consulta a la base de datos /getJuegos", message: error.sqlMessage });
        } else {
          res.status(500).json({ error: "Error en la consulta a la base de datos /getJuegos", message: error });
        }
      } else {
        if (results[0] && results[0].length > 0) {
          res.status(200).json({ data: results[0] });
        } else {
          res.status(500).json({ error: "No hay datos o la estructura del resultado es incorrecta /getJuegos", message: "La consulta no arrojo datos" });
        }
      }
    });
  } catch (error) {
    console.error("Error en getJuegos:", error);
    res.status(500).json({
      error: "Error al obtener getJuegos",
      detalle: error.message,
    });
  }
};
