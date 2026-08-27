// ==========================================
// ACTIVIDAD 3: Consultas avanzadas en MongoDB
// Archivo: agregacion-mongodb.js
// ==========================================

use comercio;

// ------------------------------------------
// PASO 3: Insertar clientes
// ------------------------------------------
db.clientes.insertMany([
  { _id: 1, nombre: "Ana", ciudad: "Montevideo" },
  { _id: 2, nombre: "Bruno", ciudad: "Salto" },
  { _id: 3, nombre: "Carla", ciudad: "Montevideo" },
  { _id: 4, nombre: "Diego", ciudad: "Paysandú" }
]);

// ------------------------------------------
// PASO 4: Insertar pedidos con detalle en arreglo
// ------------------------------------------
db.pedidos.insertMany([
  { 
    cliente_id: 1, 
    fecha: "2026-01-05", 
    items: [
      { producto: "Teclado", cantidad: 1, precio: 40 },
      { producto: "Mouse", cantidad: 2, precio: 20 }
    ] 
  },
  { 
    cliente_id: 2, 
    fecha: "2026-01-08", 
    items: [
      { producto: "Monitor", cantidad: 1, precio: 250 }
    ] 
  },
  { 
    cliente_id: 1, 
    fecha: "2026-02-01", 
    items: [
      { producto: "Monitor", cantidad: 1, precio: 250 },
      { producto: "Webcam", cantidad: 1, precio: 60 }
    ] 
  },
  { 
    cliente_id: 3, 
    fecha: "2026-02-10", 
    items: [
      { producto: "Teclado", cantidad: 3, precio: 40 }
    ] 
  },
  { 
    cliente_id: 4, 
    fecha: "2026-03-15", 
    items: [
      { producto: "Mouse", cantidad: 5, precio: 20 }
    ] 
  }
]);

// ------------------------------------------
// PASO 5: Filtrar con $match
// ------------------------------------------
// Resultado: Devuelve los pedidos cuya fecha es mayor o igual a "2026-02-01"
db.pedidos.aggregate([
  { $match: { fecha: { $gte: "2026-02-01" } } }
]);

// ------------------------------------------
// PASO 6: Desarmar el arreglo con $unwind
// ------------------------------------------
// Resultado: Crea un documento separado por cada elemento que tenga el arreglo 'items'
db.pedidos.aggregate([
  { $unwind: "$items" }
]);

// ------------------------------------------
// PASO 7: Calcular el total por pedido y cliente
// ------------------------------------------
// Resultado esperado: Ana $420, Bruno $250, Carla $120, Diego $100.
db.pedidos.aggregate([
  { $unwind: "$items" },
  { 
    $project: {
      cliente_id: 1,
      fecha: 1,
      subtotal: { $multiply: ["$items.cantidad", "$items.precio"] }
    }
  },
  { 
    $group: {
      _id: "$cliente_id",
      total_gastado: { $sum: "$subtotal" }
    }
  },
  { $sort: { total_gastado: -1 } }
]);

// ------------------------------------------
// PASO 8: Productos más vendidos (por cantidad)
// ------------------------------------------
// Resultado esperado: "Monitor" con 2 unidades y más ingresos.
db.pedidos.aggregate([
  { $unwind: "$items" },
  { 
    $group: {
      _id: "$items.producto",
      unidades: { $sum: "$items.cantidad" },
      ingresos: { $sum: { $multiply: ["$items.cantidad", "$items.precio"] } }
    } 
  },
  { $sort: { unidades: -1 } }
]);

// ------------------------------------------
// PASO 9: Estadísticas por mes
// ------------------------------------------
// Resultado esperado: Agrupa y calcula ventas y promedios por mes (enero, febrero, marzo).
db.pedidos.aggregate([
  { $unwind: "$items" },
  { 
    $group: {
      _id: { $substr: ["$fecha", 0, 7] },
      ventas: { $sum: { $multiply: ["$items.cantidad", "$items.precio"] } },
      promedio_item: { $avg: "$items.precio" }
    }
  },
  { $sort: { _id: 1 } }
]);

// ------------------------------------------
// PASO 10: Unir colecciones con $lookup
// ------------------------------------------
// Resultado esperado: Devuelve los pedidos incluyendo el nombre y ciudad del cliente desde la otra colección.
db.pedidos.aggregate([
  { 
    $lookup: {
      from: "clientes",
      localField: "cliente_id",
      foreignField: "_id",
      as: "cliente"
    } 
  },
  { $unwind: "$cliente" },
  { 
    $project: {
      _id: 0,
      cliente_nombre: "$cliente.nombre",
      ciudad: "$cliente.ciudad",
      total_items: { $size: "$items" }
    }
  }
]);

// ------------------------------------------
// PASO 11: Resumen general (todos juntos)
// ------------------------------------------
// Resultado esperado: Facturación total, cantidad de pedidos y ticket promedio global de la empresa.
db.pedidos.aggregate([
  { $match: { fecha: { $gte: "2026-01-01" } } },
  { $unwind: "$items" },
  { 
    $group: { 
      _id: null,
      total_pedidos: { $sum: 1 },
      facturacion_total: { $sum: { $multiply: ["$items.cantidad", "$items.precio"] } },
      ticket_promedio: { $avg: { $multiply: ["$items.cantidad", "$items.precio"] } }
    } 
  }
]);