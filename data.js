/* ============================================================
   DATA — Editá este archivo con el análisis real de tu equipo.
   ============================================================
   Cada objeto es una fila del tablero. Instrucciones por campo:

   estado (Tablero 1 — Leyes UX):
     "cumple"    -> se respeta la ley
     "rompe"     -> se incumple la ley
     "pendiente" -> todavía no analizado (se ve gris/punteado)

   severidad (Tablero 2 — Heurísticas): número 0 a 4, o null si
   todavía no se evaluó (se ve como "pendiente").

   imagen: ruta a tu captura dentro de la carpeta /screenshots.
   Si no existe el archivo, se muestra un placeholder con
   instrucciones — no rompe nada mientras completás.

   explicacion: 1-2 frases. Respondé la pregunta guía: qué pasa
   y por qué (leyes), o qué pasa / por qué / qué impacto tiene
   en la persona usuaria (heurísticas).
   ============================================================ */

const LEYES_UX = [
  {
    id: "hick",
    numero: 1,
    nombre: "Ley de Hick",
    definicion: "El tiempo para tomar una decisión aumenta con la cantidad de alternativas disponibles.",
    preguntaGuia: "¿Hay un punto donde el usuario enfrenta demasiadas opciones a la vez? ¿Cómo se reduce (o no) esa carga?",
    estado: "rompe",
    imagen: "screenshots/01-hick.png",
    explicacion: "En \"Trámites\" los distintos beneficios (subsidios, exención de peajes, etc.) se listan uno debajo del otro sin categorías ni buscador, obligando a leer cada tarjeta para saber si aplica, en vez de filtrar de entrada."
  },
  {
    id: "fitts",
    numero: 2,
    nombre: "Ley de Fitts",
    definicion: "El tiempo para alcanzar un objetivo depende de su tamaño y de la distancia hasta él.",
    preguntaGuia: "¿Los elementos más usados son fáciles de tocar/clickear? ¿Hay algún target chico o mal ubicado?",
    estado: "cumple",
    imagen: "screenshots/02-fitts.png",
    explicacion: "En \"Teléfonos\" cada número de emergencia es una fila de ancho completo con ícono de llamada, pensada para tocarse rápido y sin margen de error en una situación urgente."
  },
  {
    id: "tesler",
    numero: 3,
    nombre: "Ley de Tesler",
    definicion: "Toda tarea tiene una complejidad mínima irreductible; solo se puede mover, no eliminar.",
    preguntaGuia: "¿Dónde asume la interfaz la complejidad para que el usuario no tenga que hacerlo?",
    estado: "cumple",
    imagen: "screenshots/03-tesler.png",
    explicacion: "Pedir el DNI digital implica validarlo contra RENAPER, pero al usuario se le presenta como un solo botón (\"Solicitar DNI Digital\"): la app absorbe la complejidad de la validación en vez de pasársela."
  },
  {
    id: "jakob",
    numero: 4,
    nombre: "Ley de Jakob",
    definicion: "Los usuarios esperan que tu interfaz se comporte como las que ya conocen.",
    preguntaGuia: "¿Qué patrones familiares usa (o rompe) la navegación, los íconos, los gestos?",
    estado: "cumple",
    imagen: "screenshots/04-jakob.png",
    explicacion: "La barra inferior fija (Inicio / Novedades / Teléfonos / Tina) y el header con flecha de \"volver\" se repiten en toda la app, igual que en cualquier app de banco o de gobierno que el usuario ya conoce."
  },
  {
    id: "miller",
    numero: 5,
    nombre: "Ley de Miller",
    definicion: "Las personas retienen entre 5 y 9 elementos en la memoria de trabajo.",
    preguntaGuia: "¿Hay listas o menús que respeten ese límite? ¿Hay alguno que lo exceda sin agrupar?",
    estado: "cumple",
    imagen: "screenshots/05-miller.png",
    explicacion: "\"Suscribir servicios\" agrupa todos los trámites posibles en solo 4 categorías plegables (Documentos, Vehículos, Salud, Trabajo) en vez de mostrar la lista completa de golpe, respetando el límite de memoria de trabajo."
  },
  {
    id: "estetica-usabilidad",
    numero: 6,
    nombre: "Efecto Estética-Usabilidad",
    definicion: "Un diseño estéticamente agradable se percibe como más usable, aunque no lo sea.",
    preguntaGuia: "¿Hay una pantalla linda que 'tapa' un problema real de uso, o al revés?",
    estado: "cumple",
    imagen: "screenshots/06-estetica.png",
    explicacion: "El header de \"Mi perfil\" (foto grande, tilde de verificado, tipografía prolija) transmite confianza institucional de entrada, lo que predispone a percibir el resto de la app como más seria y confiable aunque no se haya probado nada todavía."
  },
  {
    id: "doherty",
    numero: 7,
    nombre: "Umbral de Doherty",
    definicion: "Cuando el sistema responde en menos de 400 ms, aumenta la productividad y el engagement.",
    preguntaGuia: "¿Dónde se nota una demora? ¿Hay feedback de carga mientras se espera?",
    estado: "rompe",
    imagen: "screenshots/07-doherty.png",
    explicacion: "En \"Salud\" el ícono de recarga junto al título sugiere que los datos de cobertura se piden a otro sistema (Ministerio de Salud), pero no hay spinner, skeleton ni ningún indicio de carga: si la consulta tarda, el usuario no tiene forma de saber si la app está trabajando o se colgó."
  },
  {
    id: "peak-end",
    numero: 8,
    nombre: "Efecto Peak-End",
    definicion: "Los usuarios juzgan una experiencia sobre todo por su punto más intenso y por cómo termina.",
    preguntaGuia: "¿Cómo termina un flujo importante? ¿Ese cierre deja una buena o mala última impresión?",
    estado: "cumple",
    imagen: "screenshots/08-peakend.png",
    explicacion: "La pantalla de \"Cobros\" cierra con una tarjeta de \"¿Necesitás ayuda?\" que ofrece contacto directo con Capital Humano antes de que el usuario tenga que buscarlo por su cuenta, dejando una última impresión de acompañamiento en vez de terminar en un callejón sin salida."
  },
  {
    id: "posicion-serial",
    numero: 9,
    nombre: "Efecto de Posición Serial",
    definicion: "Los usuarios recuerdan mejor el primer y el último elemento de una lista.",
    preguntaGuia: "¿Qué está ubicado al principio o al final de una lista clave? ¿Es lo más importante?",
    estado: "cumple",
    imagen: "screenshots/09-posicionserial.png",
    explicacion: "En \"Teléfonos\", el 911 (el número más general y más usado) ocupa el primer lugar de la lista, aprovechando el efecto de primacía para que sea lo primero que se recuerde en una emergencia."
  },
  {
    id: "von-restorff",
    numero: 10,
    nombre: "Efecto Von Restorff",
    definicion: "Un elemento que se destaca visualmente del resto se recuerda mejor.",
    preguntaGuia: "¿Algo se distingue a propósito del resto? ¿Debería destacarse algo que hoy pasa desapercibido?",
    estado: "rompe",
    imagen: "screenshots/10-vonrestorff.png",
    explicacion: "En \"Seguridad y privacidad\", \"Eliminar cuenta\" (una acción destructiva e irreversible) tiene exactamente el mismo estilo visual que \"Cambiar contraseña\" (una acción inofensiva): nada la distingue como más riesgosa."
  },
  {
    id: "zeigarnik",
    numero: 11,
    nombre: "Efecto Zeigarnik",
    definicion: "Las personas recuerdan mejor las tareas incompletas que las completas.",
    preguntaGuia: "¿Hay algún indicador de tarea pendiente que motive a volver a completarla?",
    estado: "cumple",
    imagen: "screenshots/11-zeigarnik.png",
    explicacion: "En \"Mi perfil\", la etiqueta rosa \"Verificá tu número\" queda pegada al lado del teléfono hasta que el usuario complete la verificación, funcionando como recordatorio persistente de una tarea a medio terminar."
  },
  {
    id: "postel",
    numero: 12,
    nombre: "Ley de Postel",
    definicion: "Sé flexible con lo que aceptás como entrada, y estricto con lo que producís como salida.",
    preguntaGuia: "¿Un formulario o input rechaza casos válidos por ser demasiado rígido?",
    estado: "rompe",
    imagen: "screenshots/12-postel.png",
    explicacion: "En \"Vehículos\", ante el caso real de viajar al exterior sin cédula física ni patente, la app no ofrece una solución dentro del flujo (por ejemplo, un comprobante digital): directamente deriva a comunicarse con la DNRPA por otro canal."
  },
  {
    id: "occam",
    numero: 13,
    nombre: "Navaja de Occam",
    definicion: "Ante opciones de diseño igualmente válidas, la más simple suele ser la mejor.",
    preguntaGuia: "¿Dónde se eligió la solución más simple posible? ¿Dónde se complicó de más algo simple?",
    estado: "rompe",
    imagen: "screenshots/13-occam.png",
    explicacion: "Sacar un turno tiene tres puntos de entrada distintos (el banner de Inicio, la categoría \"Turnos\" del home, y el botón \"Ir a Turnos\" dentro de \"Trámites\"): tres caminos para la misma acción en vez del más simple, uno solo."
  },
  {
    id: "parkinson",
    numero: 14,
    nombre: "Ley de Parkinson",
    definicion: "El trabajo se expande hasta ocupar el tiempo disponible para completarlo.",
    preguntaGuia: "¿Hay algún límite de tiempo (real o percibido) que cambie cómo se comporta el usuario?",
    estado: "rompe",
    imagen: "screenshots/14-parkinson.png",
    explicacion: "En el Home, tanto el cartel de turnos (\"No tenés turnos programados\") como el de credenciales (\"¡Todas tus credenciales están al día!\") no muestran ninguna fecha límite ni vencimiento, así que no hay ningún límite de tiempo real ni percibido que empuje al usuario a actuar antes de que sea tarde."
  }
];

const HEURISTICAS_NIELSEN = [
  {
    id: "visibilidad",
    numero: 1,
    nombre: "Visibilidad del estado del sistema",
    definicion: "El sistema debe mantener informado al usuario sobre lo que está pasando, con feedback apropiado en tiempo razonable.",
    severidad: 2,
    imagen: "screenshots/h01-visibilidad.png",
    explicacion: "En \"Novedades\" las noticias no tienen fecha de publicación ni ninguna marca de \"nuevo\", por lo que el usuario no puede saber si lo que está leyendo es de hoy o de hace tres meses. El impacto es que pierde confianza en la sección y puede dejar de revisarla porque no sabe si vale la pena volver a mirarla."
  },
  {
    id: "mundo-real",
    numero: 2,
    nombre: "Correspondencia entre el sistema y el mundo real",
    definicion: "El sistema debe hablar el lenguaje del usuario, con palabras y conceptos familiares en vez de jerga técnica.",
    severidad: 1,
    imagen: "screenshots/h02-mundoreal.png",
    explicacion: "En \"Salud\", la cobertura aparece transcripta tal cual la tiene el registro oficial (\"OBRA SOCIAL DE EJECUTIVOS Y DEL PERSONAL DE DIRECCIÓN DE EMPRESAS\", en mayúsculas y sin formatear), en vez de mostrarse en el lenguaje simple que usaría la persona para referirse a su propia obra social. Es un problema menor porque no impide entender el dato, pero rompe el tono cercano del resto de la app."
  },
  {
    id: "control-libertad",
    numero: 3,
    nombre: "Control y libertad del usuario",
    definicion: "Los usuarios necesitan una 'salida de emergencia' clara para deshacer acciones o abandonar un flujo por error.",
    severidad: 0,
    imagen: "screenshots/h03-control.png",
    explicacion: "Pantallas como \"Hijos\" (y el resto de las secciones secundarias) mantienen siempre la flecha de volver en el header, así que la persona puede salir de cualquier pantalla en cualquier momento sin tener que completar el flujo. No genera ningún impacto negativo: es una salida de emergencia constante y predecible."
  },
  {
    id: "consistencia",
    numero: 4,
    nombre: "Consistencia y estándares",
    definicion: "Los usuarios no deberían dudar si distintas palabras, situaciones o acciones significan lo mismo.",
    severidad: 2,
    imagen: "screenshots/h04-consistencia.png",
    explicacion: "En \"Documentos\", el botón principal (\"Solicitar DNI Digital\") es de tipo outline (solo borde), mientras que el CTA equivalente en \"Hijos\" (\"Asociar un hijo/a\"), \"Turnos\" (\"Sacar turno\") o \"Cobros\" (\"Ingresar\") es un botón sólido. El usuario tiene que reinterpretar en cada pantalla qué jerarquía visual tiene la acción principal, porque el mismo tipo de acción no se ve igual en todos lados."
  },
  {
    id: "prevencion-errores",
    numero: 5,
    nombre: "Prevención de errores",
    definicion: "Es mejor prevenir que ocurra un error que generar un buen mensaje una vez que ya ocurrió.",
    severidad: 3,
    imagen: "screenshots/h05-prevencion.png",
    explicacion: "En \"Seguridad y privacidad\", \"Eliminar cuenta\" tiene exactamente el mismo tamaño, color e ícono que \"Cambiar contraseña\": nada distingue visualmente a la acción irreversible de la inofensiva antes de tocarla. El impacto es alto porque un toque apurado o accidental puede llevar a una persona directo hacia el flujo de baja de cuenta sin ninguna advertencia previa."
  },
  {
    id: "reconocer-recordar",
    numero: 6,
    nombre: "Reconocimiento antes que recuerdo",
    definicion: "Minimizar la carga de memoria mostrando objetos, acciones y opciones visibles en vez de exigir que el usuario las recuerde.",
    severidad: 0,
    imagen: "screenshots/h06-reconocer.png",
    explicacion: "En \"Suscribir servicios\", cada categoría (Documentos, Vehículos, Salud, Trabajo) se muestra con ícono, nombre y flecha desplegable visibles todo el tiempo, así que el usuario reconoce las opciones de un vistazo en vez de tener que recordar de memoria qué trámites puede activar. No genera fricción adicional para la persona usuaria."
  },
  {
    id: "flexibilidad",
    numero: 7,
    nombre: "Flexibilidad y eficiencia de uso",
    definicion: "Ofrecer aceleradores para usuarios expertos sin perjudicar a los usuarios novatos.",
    severidad: 2,
    imagen: "screenshots/h07-flexibilidad.png",
    explicacion: "En \"Trámites\", la lista de beneficios se recorre solo scrolleando: no hay buscador ni filtros para saltar directo a un trámite puntual. Una persona que ya sabe lo que busca (por ejemplo la exención de peajes) tiene que scrollear igual que alguien que está explorando por primera vez, sin ningún atajo para usuarios frecuentes."
  },
  {
    id: "estetico-minimalista",
    numero: 8,
    nombre: "Diseño estético y minimalista",
    definicion: "La interfaz no debe contener información irrelevante o que se use raramente.",
    severidad: 0,
    imagen: "screenshots/h08-minimalista.png",
    explicacion: "\"Acerca de esta aplicación\" muestra solo lo esencial: logo, versión, escudo institucional y dos botones (calificar / descargar más apps), sin información irrelevante ni elementos decorativos de más. Es una pantalla limpia que no le agrega carga cognitiva a la persona usuaria."
  },
  {
    id: "recuperacion-errores",
    numero: 9,
    nombre: "Ayudar a reconocer, diagnosticar y recuperarse de errores",
    definicion: "Los mensajes de error deben estar en lenguaje claro, indicar el problema exacto y sugerir una solución.",
    severidad: 3,
    imagen: "screenshots/h09-recuperacion.png",
    explicacion: "En \"Vehículos\", el aviso sobre viajar al exterior sin cédula física ni patente se muestra igual para todos los usuarios, no está atado a si a esa persona realmente le falta algún documento, y en vez de resolver el problema dentro de la app manda a comunicarse por otro canal con la DNRPA. El impacto es que la persona queda sin un diagnóstico concreto de qué le pasa a ella ni una solución accionable dentro de la misma app."
  },
  {
    id: "ayuda-documentacion",
    numero: 10,
    nombre: "Ayuda y documentación",
    definicion: "La ayuda debe ser fácil de encontrar, centrada en la tarea del usuario y no demasiado extensa.",
    severidad: 3,
    imagen: "screenshots/h10-ayuda.png",
    explicacion: "En \"Acerca de esta aplicación\" — la pantalla donde alguien buscaría ayuda sobre la app — solo hay botones para calificarla o descargar otras apps del Estado; no hay un link a centro de ayuda, preguntas frecuentes ni soporte. Alguien con una duda puntual sobre cómo usar Mi Argentina no tiene, en las pantallas relevadas, un lugar claro al que ir a buscar esa ayuda."
  }
];
