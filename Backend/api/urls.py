from django.urls import path
from .views import (DireccionList, DireccionDetail, EnvioList, EnvioDetail,
                    HistorialAsignacionList, HistorialAsignacionDetail,
                    HistorialEnvioList, HistorialEnvioDetail,
                    IncidenciaList, IncidenciaDetail,
                    NotificacionList, NotificacionDetail,
                    PaqueteList, PaqueteDetail,
                    UsuarioList, UsuarioDetail,
                    VehiculoList, VehiculoDetail)

urlpatterns = [
    # Direcciones
    path('direcciones/', DireccionList.as_view(), name='direccion-list'),
    path('direcciones/<int:pk>/', DireccionDetail.as_view(), name='direccion-detail'),

    # Envíos
    path('envios/', EnvioList.as_view(), name='envio-list'),
    path('envios/<int:pk>/', EnvioDetail.as_view(), name='envio-detail'),

    # Historial de Asignación
    path('historial-asignaciones/', HistorialAsignacionList.as_view(), name='historial-asignacion-list'),
    path('historial-asignaciones/<int:pk>/', HistorialAsignacionDetail.as_view(), name='historial-asignacion-detail'),

    # Historial de Envío
    path('historial-envios/', HistorialEnvioList.as_view(), name='historial-envio-list'),
    path('historial-envios/<int:pk>/', HistorialEnvioDetail.as_view(), name='historial-envio-detail'),

    # Incidencias
    path('incidencias/', IncidenciaList.as_view(), name='incidencia-list'),
    path('incidencias/<int:pk>/', IncidenciaDetail.as_view(), name='incidencia-detail'),

    # Notificaciones
    path('notificaciones/', NotificacionList.as_view(), name='notificacion-list'),
    path('notificaciones/<int:pk>/', NotificacionDetail.as_view(), name='notificacion-detail'),

    # Paquetes
    path('paquetes/', PaqueteList.as_view(), name='paquete-list'),
    path('paquetes/<int:pk>/', PaqueteDetail.as_view(), name='paquete-detail'),

    # Usuarios
    path('usuarios/', UsuarioList.as_view(), name='usuario-list'),
    path('usuarios/<int:pk>/', UsuarioDetail.as_view(), name='usuario-detail'),

    # Vehículos
    path('vehiculos/', VehiculoList.as_view(), name='vehiculo-list'),
    path('vehiculos/<int:pk>/', VehiculoDetail.as_view(), name='vehiculo-detail'),
]
