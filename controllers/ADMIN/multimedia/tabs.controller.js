/**
 * Controlador de tabs: conteo por subtipo (MET_SUBTIPOS) con total de multimedia activa.
 * Expone GET para Angular y getTabsData() para emitir por socket tras agregar/eliminar multimedia.
 */

const TABS_QUERY = `
  SELECT s.SBT_ID, s.SBT_TIPO AS TIPO, COUNT(m.MUL_ID) AS Total
  FROM MET_SUBTIPOS s
  LEFT JOIN MET_MULTIMEDIA m ON m.MUL_SBT_ID = s.SBT_ID AND m.MUL_STATUS = 1
  WHERE s.SBT_STATUS = 1
  GROUP BY s.SBT_ID, s.SBT_TIPO
`;

/**
 * Ejecuta la consulta de tabs y devuelve los datos (para HTTP o para socket).
 * @param {object} db - Pool de conexión (req.db)
 * @returns {Promise<Array<{ SBT_ID: number, TIPO: string, Total: number }>>}
 */
function getTabsData(db) {
    return new Promise((resolve, reject) => {
        db.query(TABS_QUERY, (err, rows) => {
            if (err) {
                console.error('[TABS] Error en consulta:', err);
                return reject(err);
            }
            const data = Array.isArray(rows) ? rows : [];
            resolve(data);
        });
    });
}

/**
 * GET /mapa/v1/admin/tabs
 * Respuesta para la petición de Angular con el mismo formato que la consulta.
 */
async function getTabs(req, res) {
    try {
        const data = await getTabsData(req.db);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('[TABS] Error en getTabs:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener conteo de tabs',
            detalle: error.message,
        });
    }
}

module.exports = {
    getTabs,
    getTabsData,
};
