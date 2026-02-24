/**
 * Controlador de tabs: conteo por subtipo (MET_SUBTIPOS) con total de multimedia activa.
 * Usa el procedimiento almacenado ObtenerTabsConteo().
 * Expone GET para Angular y getTabsData() para emitir por socket tras agregar/eliminar multimedia.
 */

/**
 * Ejecuta el procedimiento ObtenerTabsConteo y devuelve los datos (para HTTP o para socket).
 * @param {object} db - Pool de conexión (req.db)
 * @returns {Promise<Array<{ SBT_ID: number, TIPO: string, Total: number }>>}
 */
function getTabsData(db) {
    return new Promise((resolve, reject) => {
        db.query('CALL ObtenerTabsConteo()', (err, results) => {
            if (err) {
                console.error('[TABS] Error en procedimiento ObtenerTabsConteo:', err);
                return reject(err);
            }
            const data = Array.isArray(results) && results[0] ? results[0] : [];
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
