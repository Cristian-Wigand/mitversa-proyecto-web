from rest_framework import serializers
from .models import Direccion, Envio, HistorialAsignacion, HistorialEnvio, Incidencia, Notificacion, Paquete, Usuario, Vehiculo

class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = '__all__'

class EnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Envio
        fields = '__all__'

class HistorialAsignacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialAsignacion
        fields = '__all__'

class HistorialEnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialEnvio
        fields = '__all__'

class IncidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incidencia
        fields = '__all__'

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'

class PaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paquete
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class VehiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehiculo
        fields = '__all__'
