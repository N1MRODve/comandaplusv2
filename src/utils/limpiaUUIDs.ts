export function limpiaUUIDs<T extends Record<string, any>>(obj: T): T {
    const copia = { ...obj }
    Object.keys(copia).forEach(key => {
      if (
        (key.endsWith('_id') ||
          key === 'plato_id' ||
          key === 'mesa_id' ||
          key === 'cliente_id') &&
        (copia[key] === "" || copia[key] === undefined)
      ) {
        copia[key] = null
      }
    })
    return copia
  }
  