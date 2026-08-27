# Ejercicio de Normalización - Biblioteca

## 1) Normalización paso a paso

### Primera Forma Normal (1FN)
**Requisito:** Atomicidad de los valores y clave primaria definida.
Se separan los socios que estaban agrupados en una sola celda.

| libro_id | titulo | autor | categoria | socio |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Cien años | G. Márquez | Literatura | Ana |
| 1 | Cien años | G. Márquez | Literatura | Luis |
| 2 | Dune | F. Herbert | Ciencia ficción | Ana |
| 1 | Cien años | G. Márquez | Literatura | Pedro |

*   **Clave Primaria:** (libro_id, socio)

### Segunda Forma Normal (2FN)
**Requisito:** 1FN y eliminación de dependencias parciales.
Los atributos `titulo`, `autor` y `categoria` solo dependen de `libro_id`, no del `socio`.

**Tabla Libros:**
| libro_id (PK) | titulo | autor | categoria |
| :--- | :--- | :--- | :--- |
| 1 | Cien años | G. Márquez | Literatura |
| 2 | Dune | F. Herbert | Ciencia ficción |

**Tabla Prestamos:**
| libro_id (FK) | socio |
| :--- | :--- |
| 1 | Ana |
| 1 | Luis |
| 2 | Ana |
| 1 | Pedro |

### Tercera Forma Normal (3FN)
**Requisito:** 2FN y eliminación de dependencias transitivas.
En este caso, la estructura de la 2FN ya cumple con la 3FN ya que no hay dependencias entre los atributos no clave (`titulo`, `autor`, `categoria`).

---

## 2) Esquema Final

*   **LIBROS** (**libro_id**, titulo, autor, categoria)
*   **PRESTAMOS** (**libro_id***, **socio**)

*(PK: Clave Primaria, FK: Clave Foránea)*

---

## 3) Anomalías de actualización eliminadas

1.  **Inserción:** Permite agregar libros sin que tengan préstamos asociados.
2.  **Borrado:** Eliminar un préstamo no borra la información del libro.
3.  **Modificación:** Los cambios en los datos del libro (título, autor) se hacen en un solo lugar.
