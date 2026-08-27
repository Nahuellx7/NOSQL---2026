# Entregable: Seguridad en MongoDB

Este documento detalla la implementación de controles de seguridad en la instancia de MongoDB, abarcando el Control de Acceso Basado en Roles (RBAC), la simulación y mitigación de ataques de NoSQL Injection, y la aplicación de validadores de esquema mediante JSON Schema.

---

## 1. Creación de Usuarios y Roles (RBAC)

Para garantizar la seguridad de la instancia, se habilitó el motor de autenticación mediante el parámetro `--auth`. Posteriormente, se crearon los siguientes usuarios con privilegios acotados:

* **admin**: Usuario con el rol global `root` en la base de datos `admin`, otorgando control total sobre la instancia.
* **app_ventas_user**: Usuario creado en la base de datos `app_ventas` con el rol `readWrite`, autorizado para operaciones de lectura y escritura en su base de datos.
* **lector**: Usuario creado en la base de datos `app_ventas` con el rol `read`, limitado exclusivamente a consultas de lectura.

---

## 2. Pruebas de Control de Acceso y Error de Autorización

Se realizaron pruebas de conexión con el usuario `lector` en la base de datos `app_ventas` para verificar la restricción de privilegios al intentar ejecutar una operación de escritura no autorizada.

### Comando ejecutado
```javascript
db.productos.insertOne({ nombre: "Prueba", precio: 10 })
```

### Error de autorización obtenido en la terminal
```plaintext
MongoServerError[Unauthorized]: not authorized on app_ventas to execute command { insert: "productos", documents: [ { nombre: "Prueba", precio: 10, _id: ObjectId('6a902c663e9dc1bf06910d7b') } ], ordered: true, lsid: { id: UUID("c831ae6d-1834-499a-b46d-952360c3236c") }, \$db: "app_ventas" }
```

### Evidencia visual
![Error de autorización](imagenes%20y%20cmd/error%20de%20autorizacion%20por%20filtrado.png)

---

## 3. Simulación de NoSQL Injection

Se simuló una vulnerabilidad de inyección ejecutando un filtro inseguro con operadores lógicos en lugar de valores primitivos, lo que permite alterar la lógica de la consulta sin conocer credenciales válidas.

### Inserción de datos de prueba
```javascript
db.usuarios.insertMany([
  { usuario: "ana", clave: "s3creto", admin: false },
  { usuario: "bruno", clave: "otra", admin: true }
])
```

### Ejecución de la consulta vulnerable
```javascript
db.usuarios.findOne({ usuario: { \$ne: null }, clave: { \$ne: null } })
```

**Resultado:** La consulta devuelve arbitrariamente el primer documento de la colección (`ana`), logrando un bypass completo de la autenticación.

---

## 4. Validador de Esquema (JSON Schema) y Captura del Error

Para mitigar la inyección a nivel de base de datos, se aplicó un validador mediante JSON Schema que restringe los campos obligatorios al tipo texto (string), bloqueando el uso de objetos maliciosos como operadores lógicos.

### Comando de aplicación
```javascript
db.runCommand({
  collMod: "usuarios",
  validator: {
    \$jsonSchema: {
      bsonType: "object",
      required: ["usuario", "clave"],
      properties: {
        usuario: { bsonType: "string" },
        clave: { bsonType: "string" }
      }
    }
  }
})
```

### Intento de inserción maliciosa con el validador activo
```javascript
db.usuarios.insertOne({ usuario: { \$ne: null }, clave: "x" })
```

### Error de validación obtenido
```plaintext
MongoServerError: Document failed validation
```

### Evidencia visual
![Error de validación](imagenes%20y%20cmd/error%20de%20validacion.png)
---

## 5. Reflexión Técnica

Una API nunca debe armar filtros concatenando directamente datos ingresados por el usuario porque esto expone el sistema a ataques de inyección NoSQL. Permitir que entradas externas manipulen la estructura de las consultas facilita alterar la lógica del negocio y realizar un bypass de autenticación.

Validar y tipar estrictamente los datos asegura que la base de datos solo reciba los valores esperados. Implementar estas restricciones a nivel de esquema actúa como una capa de defensa en profundidad sumamente robusta frente a posibles fallos u omisiones en el código de la aplicación.
