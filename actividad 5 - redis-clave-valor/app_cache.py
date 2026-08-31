import json
import redis

# Conexión al servidor de Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)


def obtener_perfil_usuario(usuario_id)
  cache_key = f'cacheperfil{usuario_id}'

  # 1. Intentar obtener el dato desde la caché de Redis (Cache Hit  Miss)
  perfil_cache = r.get(cache_key)
  if perfil_cache
    print('- [Cache HIT] Datos recuperados directamente de Redis.')
    return json.loads(perfil_cache)

  # 2. Si no está en Redis (Cache Miss), se simula la consulta a la base de datos principal (MongoDB)
  print('- [Cache MISS] Consultando a MongoDB y guardando en Redis...')
  perfil_db = {
      'id' usuario_id,
      'nombre' 'Ana',
      'ciudad' 'Montevideo',
  }

  # 3. Guardar el resultado en Redis con un TTL de 30 segundos para evitar datos obsoletos
  r.setex(cache_key, 30, json.dumps(perfil_db))

  return perfil_db


# Simulación de uso en la aplicación
print(obtener_perfil_usuario(1))  # Primera vez Genera Miss, lee de MongoDB y cachea
print(obtener_perfil_usuario(1))  # Segunda vez Genera Hit rápido desde Redis