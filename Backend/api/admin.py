from django.contrib import admin
from .models import Direccion, Envio, HistorialAsignacion, HistorialEnvio, Incidencia, Notificacion, Paquete, Usuario, Vehiculo

class DireccionAdmin(admin.ModelAdmin):
    list_display = ('id_direccion', 'ciudad', 'comuna', 'calle', 'numero')
    search_fields = ('ciudad', 'comuna', 'calle')
    list_filter = ('ciudad', 'comuna')

class EnvioAdmin(admin.ModelAdmin):
    list_display = ('id_envio', 'estado_envio', 'id_repartidor', 'id_cliente', 'fecha_pedido_inicio', 'fecha_pedido_fin', 'costo_total')
    search_fields = ('estado_envio', 'id_cliente__nombre', 'id_repartidor__nombre')
    list_filter = ('estado_envio', 'fecha_pedido_inicio')

class HistorialAsignacionAdmin(admin.ModelAdmin):
    list_display = ('id_historial', 'id_repartidor', 'id_vehiculo', 'fecha_asignacion', 'kilometraje_inicial')
    search_fields = ('id_repartidor__nombre', 'id_vehiculo__matricula')
    list_filter = ('fecha_asignacion',)

class HistorialEnvioAdmin(admin.ModelAdmin):
    list_display = ('id_historial', 'id_envio', 'fecha', 'direccion')
    search_fields = ('id_envio__id_envio', 'direccion__ciudad')
    list_filter = ('fecha',)

class IncidenciaAdmin(admin.ModelAdmin):
    list_display = ('id_incidencia', 'id_envio', 'fecha', 'tipo_incidencia')
    search_fields = ('tipo_incidencia', 'descripcion')
    list_filter = ('tipo_incidencia',)

class NotificacionAdmin(admin.ModelAdmin):
    list_display = ('id_notificacion', 'mensaje', 'id_cliente', 'id_envio', 'fecha')
    search_fields = ('mensaje',)
    list_filter = ('fecha',)

class PaqueteAdmin(admin.ModelAdmin):
    list_display = ('id_paquete', 'id_envio', 'peso', 'largo', 'ancho', 'alto')
    search_fields = ('descripcion',)
    list_filter = ('peso',)

class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id_usuario', 'nombre', 'apellido', 'email', 'tipo_usuario')
    search_fields = ('nombre', 'apellido', 'email')
    list_filter = ('tipo_usuario',)

class VehiculoAdmin(admin.ModelAdmin):
    list_display = ('id_vehiculo', 'matricula', 'marca', 'modelo', 'estado')
    search_fields = ('matricula', 'marca', 'modelo')
    list_filter = ('estado',)

# Registra los modelos en el panel de administración
admin.site.register(Direccion, DireccionAdmin)
admin.site.register(Envio, EnvioAdmin)
admin.site.register(HistorialAsignacion, HistorialAsignacionAdmin)
admin.site.register(HistorialEnvio, HistorialEnvioAdmin)
admin.site.register(Incidencia, IncidenciaAdmin)
admin.site.register(Notificacion, NotificacionAdmin)
admin.site.register(Paquete, PaqueteAdmin)
admin.site.register(Usuario, UsuarioAdmin)
admin.site.register(Vehiculo, VehiculoAdmin)
