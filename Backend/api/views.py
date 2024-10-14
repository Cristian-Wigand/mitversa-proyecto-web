from rest_framework import generics
from .models import Direccion, Envio, HistorialAsignacion, HistorialEnvio, Incidencia, Notificacion, Paquete, Usuario, Vehiculo
from .serializers import (DireccionSerializer, EnvioSerializer, HistorialAsignacionSerializer, 
                          HistorialEnvioSerializer, IncidenciaSerializer, NotificacionSerializer, 
                          PaqueteSerializer, UsuarioSerializer, VehiculoSerializer)

# Dirección Views
class DireccionList(generics.ListCreateAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer

class DireccionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Direccion.objects.all()
    serializer_class = DireccionSerializer

# Envío Views
class EnvioList(generics.ListCreateAPIView):
    queryset = Envio.objects.all()
    serializer_class = EnvioSerializer

class EnvioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Envio.objects.all()
    serializer_class = EnvioSerializer

# Historial Asignación Views
class HistorialAsignacionList(generics.ListCreateAPIView):
    queryset = HistorialAsignacion.objects.all()
    serializer_class = HistorialAsignacionSerializer

class HistorialAsignacionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = HistorialAsignacion.objects.all()
    serializer_class = HistorialAsignacionSerializer

# Historial Envío Views
class HistorialEnvioList(generics.ListCreateAPIView):
    queryset = HistorialEnvio.objects.all()
    serializer_class = HistorialEnvioSerializer

class HistorialEnvioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = HistorialEnvio.objects.all()
    serializer_class = HistorialEnvioSerializer

# Incidencia Views
class IncidenciaList(generics.ListCreateAPIView):
    queryset = Incidencia.objects.all()
    serializer_class = IncidenciaSerializer

class IncidenciaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Incidencia.objects.all()
    serializer_class = IncidenciaSerializer

# Notificación Views
class NotificacionList(generics.ListCreateAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

class NotificacionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer

# Paquete Views
class PaqueteList(generics.ListCreateAPIView):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer

class PaqueteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer

# Usuario Views
class UsuarioList(generics.ListCreateAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class UsuarioDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

# Vehículo Views
class VehiculoList(generics.ListCreateAPIView):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer

class VehiculoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
