-- Procedimiento almacenado para obtener el conteo de multimedia por subtipo (tabs).
-- Uso: CALL ObtenerTabsConteo()
-- Retorna: SBT_ID, TIPO, Total por cada subtipo activo

DELIMITER $$

DROP PROCEDURE IF EXISTS ObtenerTabsConteo$$

CREATE PROCEDURE ObtenerTabsConteo()
BEGIN
    SELECT s.SBT_ID, s.SBT_TIPO AS TIPO, COUNT(m.MUL_ID) AS Total
    FROM MET_SUBTIPOS s
    LEFT JOIN MET_MULTIMEDIA m ON m.MUL_SBT_ID = s.SBT_ID AND m.MUL_STATUS = 1
    WHERE s.SBT_STATUS = 1
    GROUP BY s.SBT_ID, s.SBT_TIPO;
END$$

DELIMITER ;

-- Ejemplo de uso:
-- CALL ObtenerTabsConteo();
