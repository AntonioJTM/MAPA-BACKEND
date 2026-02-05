const path = require("path");

exports.getTest = (req, res) => {
  try {
    res.send("Servidor Express multimedia usuarios funcionando correctamente.");
  } catch (error) {
    console.error(error);
  }
};

exports.getMultimediaByGr = (req, res) => {
  try {
    const { subtipo,semestre } = req.body;
    if (!subtipo,semestre) {
      return res.status(400).json({
        error: "Parámetro faltante",
        message: "Se requiere el parámetro 'subtipo,semestre' en el cuerpo de la solicitud.",
      });
    }
    const query = `call spGetMultimediaBySub(?,?)`;
    req.db.query(query, [subtipo,semestre], (error, results) => {
      if (error) {
        if (error.sqlMessage) {
          res.status(500).json({ error: "Error en la consulta a la base de datos /getMultimediaByGr", message: error.sqlMessage });
        } else {
          res.status(500).json({ error: "Error en la consulta a la base de datos /getMultimediaByGr", message: error });
        }
      } else {
        if (results[0] && results[0].length > 0) {
          res.status(200).json({ data: results[0] });
        } else {
          res.status(500).json({ error: "No hay datos o la estructura del resultado es incorrecta /getMultimediaByGr", message: "La consulta no arrojo datos" });
        }
      }
    });
  } catch (error) {
    console.error("Error en getMultimediaByGr:", error);
    res.status(500).json({
      error: "Error al obtener getMultimediaByGr",
      detalle: error.message,
    });
  }
};
