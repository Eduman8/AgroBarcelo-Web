export const machineCategories = ['Maquinaria Nueva', 'Maquinaria Usada', 'Trabajos Realizados'];

export const machinesMock = [
  {
    id: 'tractor-massey-ferguson-292',
    nombre: 'Tractor Massey Ferguson 292',
    categoria: 'Maquinaria Usada',
    tipo: 'Tractor',
    estado: 'Usada',
    descripcionCorta: 'Unidad seleccionada para tareas generales de campo, con potencia y confiabilidad.',
    descripcionCompleta:
      'Tractor usado preparado para acompañar labores agropecuarias de uso diario. Se presenta como una opción confiable para productores que buscan potencia, versatilidad y soporte comercial cercano antes de avanzar con la consulta.',
    imagen: null,
    disponible: true
  },
  {
    id: 'sembradora-cele-grano-fino',
    nombre: 'Sembradora CELE Grano Fino',
    categoria: 'Maquinaria Nueva',
    tipo: 'Sembradora',
    estado: 'Nueva',
    descripcionCorta: 'Equipo preparado para siembra eficiente y uniforme en distintas condiciones de trabajo.',
    descripcionCompleta:
      'Sembradora nueva orientada a lograr una implantación pareja y eficiente. La ficha queda preparada para sumar fotos, datos técnicos y condiciones comerciales cuando se habilite la carga definitiva de maquinarias.',
    imagen: null,
    disponible: true
  },
  {
    id: 'rastra-discos-reforzada',
    nombre: 'Rastra de Discos Reforzada',
    categoria: 'Maquinaria Usada',
    tipo: 'Rastra',
    estado: 'Usada',
    descripcionCorta: 'Implemento robusto para preparación de suelo y mantenimiento de lotes productivos.',
    descripcionCompleta:
      'Rastra usada pensada para preparación y acondicionamiento de suelos. El detalle conserva datos mock para validar la navegación y deja la estructura lista para publicar especificaciones reales más adelante.',
    imagen: null,
    disponible: true
  },
  {
    id: 'implemento-agricola-multiproposito',
    nombre: 'Implemento Agrícola Multipropósito',
    categoria: 'Maquinaria Nueva',
    tipo: 'Implemento',
    estado: 'Nueva',
    descripcionCorta: 'Solución práctica para complementar labores agropecuarias durante todo el año.',
    descripcionCompleta:
      'Implemento nuevo de uso multipropósito para complementar tareas del campo. La publicación funciona como placeholder comercial hasta incorporar información técnica detallada e imágenes propias.',
    imagen: null,
    disponible: true
  },
  {
    id: 'trabajo-reparacion-sembradora-cele',
    nombre: 'Reacondicionamiento de Sembradora CELE',
    categoria: 'Trabajos Realizados',
    tipo: 'Servicio realizado',
    estado: 'Finalizado',
    descripcionCorta: 'Trabajo realizado sobre equipo de siembra para recuperar funcionamiento y confiabilidad.',
    descripcionCompleta:
      'Trabajo realizado de revisión y reacondicionamiento sobre una sembradora CELE. Esta ficha permite separar casos finalizados de la maquinaria disponible y preparar la sección para mostrar antecedentes con fotos en una etapa posterior.',
    imagen: null,
    disponible: false
  },
  {
    id: 'trabajo-mantenimiento-tractor',
    nombre: 'Mantenimiento Integral de Tractor',
    categoria: 'Trabajos Realizados',
    tipo: 'Servicio realizado',
    estado: 'Finalizado',
    descripcionCorta: 'Intervención integral para sostener rendimiento y disponibilidad operativa del tractor.',
    descripcionCompleta:
      'Trabajo realizado de mantenimiento integral sobre tractor agrícola. Se mantiene como contenido mock para validar cards, filtros y detalle sin conectar todavía con backend ni carga de imágenes.',
    imagen: null,
    disponible: false
  }
];

export function getMachineById(id) {
  return machinesMock.find((machine) => machine.id === id);
}
