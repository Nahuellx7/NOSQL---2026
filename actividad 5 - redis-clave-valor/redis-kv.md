# Práctica de Redis - Clave/Valor y Estructuras de Datos

A continuación se detallan los comandos ejecutados en la terminal junto con sus respectivas respuestas de Redis durante la práctica de contenedores y estructuras de datos NoSQL.

## 1. Inicialización del Contenedor
docker run --name redis-clase -p 6379:6379 -d redis:7
docker exec -it redis-clase redis-cli

## 2. Operaciones con Strings y Contadores
SET mensaje "hola nosql"
# OK
GET mensaje
# "hola nosql"

SET visitas 0
# OK
INCR visitas
# (integer) 1
INCR visitas
# (integer) 2
INCRBY visitas 5
# (integer) 7
GET visitas
# "7"

## 3. Operaciones con Hashes
HSET usuario:1 nombre "Ana" ciudad "Montevideo" edad 30
# (integer) 3
HGET usuario:1 nombre
# "Ana"
HGETALL usuario:1
1) "nombre"
2) "Ana"
3) "ciudad"
4) "Montevideo"
5) "edad"
6) "30"
HINCRBY usuario:1 edad 1
# (integer) 31

## 4. Operaciones con Listas (Colas)
LPUSH cola:tareas "procesar-venta-1"
# (integer) 1
LPUSH cola:tareas "procesar-venta-2"
# (integer) 2
LRANGE cola:tareas 0 -1
1) "procesar-venta-2"
2) "procesar-venta-1"
RPOP cola:tareas
# "procesar-venta-1"
LPUSH cola:tareas "procesar-venta-3"
# (integer) 2
LLEN cola:tareas
# (integer) 2

## 5. Operaciones con Sets (Conjuntos)
SADD online "ana"
# (integer) 1
SADD online "bruno"
# (integer) 1
SADD online "ana"
# (integer) 0
SMEMBERS online
1) "ana"
2) "bruno"
SISMEMBER online "carla"
# (integer) 0

## 6. Operaciones con Sorted Sets (Conjuntos Ordenados)
ZADD ranking 100 "ana"
# (integer) 1
ZADD ranking 250 "bruno"
# (integer) 1
ZADD ranking 180 "carla"
# (integer) 1
ZRANGE ranking 0 -1 WITHSCORES
1) "ana"
2) "100"
3) "carla"
4) "180"
5) "bruno"
6) "250"
ZREVRANGE ranking 0 2
1) "bruno"
2) "carla"
3) "ana"

## 7. Expiración y TTL
SET sesion:100 "activo"
# OK
EXPIRE sesion:100 10
# (integer) 1
TTL sesion:100
# (integer) 8
TTL sesion:100
# (integer) -2
GET token:sesion
# (nil)
SET promocion "20% off" EX 15
# OK
TTL promocion
# (integer) 11
TTL promocion
# (integer) -2

## 8. Patrón Cache-Aside
GET cache:perfil:1
# (nil)
SET cache:perfil:1 "{\"nombre\":\"Ana\",\"ciudad\":\"Montevideo\"}" EX 30
# OK
GET cache:perfil:1
# "{\"nombre\":\"Ana\",\"ciudad\":\"Montevideo\"}"
TTL cache:perfil:1
# (integer) 28

## 9. Estado y Limpieza de la Base de Datos
DBSIZE
# (integer) 6
KEYS *
1) "mensaje"
2) "online"
3) "ranking"
4) "visitas"
5) "usuario:1"
6) "cola:tareas"
FLUSHALL
# OK