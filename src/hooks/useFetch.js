import { useCallback, useEffect, useRef, useState } from 'react';

// Hook reutilizable: ejecuta una función asíncrona al montar (y cuando cambian
// las dependencias) y expone { datos, cargando, error, recargar }.
// El indicador "cargando" solo se activa en la primera carga; en las recargas
// posteriores se conservan los datos viejos para que la pantalla no parpadee.
export function useFetch(funcion, dependencias = []) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [version, setVersion] = useState(0);
  const yaCargo = useRef(false);

  useEffect(() => {
    let cancelado = false;
    if (!yaCargo.current) setCargando(true);
    setError(null);

    funcion()
      .then((resultado) => {
        if (cancelado) return;
        setDatos(resultado);
        yaCargo.current = true;
      })
      .catch((e) => !cancelado && setError(e.message))
      .finally(() => !cancelado && setCargando(false));

    return () => {
      cancelado = true; // evita actualizar estado si el componente ya se desmontó
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version, ...dependencias]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  return { datos, cargando, error, recargar };
}
