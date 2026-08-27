use biblioteca

// Insertar un documento
db.libros.insertOne({ 
  titulo: "Cien años de soledad", 
  autor: "Gabriel García Márquez", 
  anio: 1967, 
  precio: 450, 
  categorias: ["Literatura", "Realismo mágico"], 
  editorial: { nombre: "Sudamericana", pais: "Argentina" }, 
  disponible: true 
})
/* Resultado:
{
  acknowledged: true,
  insertedId: ObjectId('6a904c4779f384e2e105d970')
}
*/

// Insertar varios documentos
db.libros.insertMany([
  { titulo: "Dune", autor: "Frank Herbert", anio: 1965, precio: 520, categorias: ["Ciencia ficción"], editorial: { nombre: "Ace Books", pais: "EEUU" }, disponible: true },
  { titulo: "1984", autor: "George Orwell", anio: 1949, precio: 380, categorias: ["Distopía", "Ciencia ficción"], editorial: { nombre: "Secker", pais: "Inglaterra" }, disponible: false },
  { titulo: "Fahrenheit 451", autor: "Ray Bradbury", anio: 1953, precio: 410, categorias: ["Distopía", "Ciencia ficción"], editorial: { nombre: "Ballantine", pais: "EEUU" }, disponible: true },
  { titulo: "El principito", autor: "Antoine de Saint-Exupéry", anio: 1943, precio: 250, categorias: ["Infantil", "Fábula"], editorial: { nombre: "Reynal", pais: "Francia" }, disponible: true }
])
/* Resultado:
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a904c5379f384e2e105d971'),
    '1': ObjectId('6a904c5379f384e2e105d972'),
    '2': ObjectId('6a904c5379f384e2e105d973'),
    '3': ObjectId('6a904c5379f384e2e105d974')
  }
}
*/

// Consulta 1: Buscar por título exacto
db.libros.findOne({ titulo: "Dune" })
/* Resultado:
{
  _id: ObjectId('6a904c5379f384e2e105d971'),
  titulo: 'Dune',
  autor: 'Frank Herbert',
  anio: 1965,
  precio: 520,
  categorias: [ 'Ciencia ficción' ],
  editorial: { nombre: 'Ace Books', pais: 'EEUU' },
  disponible: true
}
*/

// Consulta 2: Filtrar por precio menor a 400
db.libros.find({ precio: { $lt: 400 } })
/* Resultado:
[
  {
    _id: ObjectId('6a904c5379f384e2e105d972'),
    titulo: '1984',
    autor: 'George Orwell',
    anio: 1949,
    precio: 380,
    categorias: [ 'Distopía', 'Ciencia ficción' ],
    editorial: { nombre: 'Secker', pais: 'Inglaterra' },
    disponible: false
  },
  {
    _id: ObjectId('6a904c5379f384e2e105d974'),
    titulo: 'El principito',
    autor: 'Antoine de Saint-Exupéry',
    anio: 1943,
    precio: 250,
    categorias: [ 'Infantil', 'Fábula' ],
    editorial: { nombre: 'Reynal', pais: 'Francia' },
    disponible: true
  }
]
*/

// Consulta 3: Buscar por autor
db.libros.find({ autor: "George Orwell" })
/* Resultado:
[
  {
    _id: ObjectId('6a904c5379f384e2e105d972'),
    titulo: '1984',
    autor: 'George Orwell',
    anio: 1949,
    precio: 380,
    categorias: [ 'Distopía', 'Ciencia ficción' ],
    editorial: { nombre: 'Secker', pais: 'Inglaterra' },
    disponible: false
  }
]
*/

// Actualizar un documento
db.libros.updateOne({ titulo: "Dune" }, { $set: { precio: 599 } })
/* Resultado:
{
  acknowledged: true,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedId: null
}
*/

// Eliminar un documento
db.libros.deleteOne({ titulo: "El principito" })
/* Resultado:
{ acknowledged: true, deletedCount: 1 }
*/

// Contar documentos restantes
db.libros.countDocuments()
// Resultado: 4