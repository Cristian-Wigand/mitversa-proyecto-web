# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Direccion(models.Model):
    id_direccion = models.AutoField(primary_key=True)
    ciudad = models.CharField(max_length=50)
    comuna = models.CharField(max_length=50)
    calle = models.CharField(max_length=100)
    numero = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'direccion'
        unique_together = (('ciudad', 'comuna', 'calle', 'numero'),)


class Envio(models.Model):
    id_envio = models.AutoField(primary_key=True)
    estado_envio = models.CharField(max_length=11)
    id_repartidor = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_repartidor')
    id_cliente = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_cliente', related_name='envio_id_cliente_set')
    fecha_pedido_inicio = models.DateTimeField()
    fecha_pedido_fin = models.DateTimeField()
    direccion_origen = models.ForeignKey(Direccion, models.DO_NOTHING, db_column='direccion_origen')
    direccion_destino = models.ForeignKey(Direccion, models.DO_NOTHING, db_column='direccion_destino', related_name='envio_direccion_destino_set')
    costo_total = models.PositiveIntegerField()

    class Meta:
        managed = False
        db_table = 'envio'


class HistorialAsignacion(models.Model):
    id_historial = models.AutoField(primary_key=True)
    id_repartidor = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_repartidor')
    id_vehiculo = models.ForeignKey('Vehiculo', models.DO_NOTHING, db_column='id_vehiculo')
    fecha_asignacion = models.DateTimeField()
    fecha_devolucion = models.DateTimeField(blank=True, null=True)
    kilometraje_inicial = models.DecimalField(max_digits=10, decimal_places=2)
    kilometraje_final = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    motivo = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'historial_asignacion'


class HistorialEnvio(models.Model):
    id_historial = models.AutoField(primary_key=True)
    id_envio = models.ForeignKey(Envio, models.DO_NOTHING, db_column='id_envio')
    fecha = models.DateTimeField()
    detalles = models.CharField(max_length=200, blank=True, null=True)
    direccion = models.ForeignKey(Direccion, models.DO_NOTHING, db_column='direccion')

    class Meta:
        managed = False
        db_table = 'historial_envio'


class Incidencia(models.Model):
    id_incidencia = models.AutoField(primary_key=True)
    id_envio = models.ForeignKey(Envio, models.DO_NOTHING, db_column='id_envio')
    fecha = models.DateTimeField()
    tipo_incidencia = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'incidencia'


class Notificacion(models.Model):
    id_notificacion = models.AutoField(primary_key=True)
    mensaje = models.CharField(max_length=100)
    id_cliente = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_cliente')
    id_envio = models.ForeignKey(Envio, models.DO_NOTHING, db_column='id_envio')
    fecha = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'notificacion'


class Paquete(models.Model):
    id_paquete = models.AutoField(primary_key=True)
    id_envio = models.ForeignKey(Envio, models.DO_NOTHING, db_column='id_envio')
    peso = models.PositiveIntegerField()
    largo = models.PositiveIntegerField()
    ancho = models.PositiveIntegerField()
    alto = models.PositiveIntegerField()
    descripcion = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'paquete'


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.CharField(unique=True, max_length=100)
    password = models.CharField(max_length=64)
    tipo_usuario = models.CharField(max_length=10)
    usuario_creado_el = models.DateTimeField()
    usuario_actualizado_el = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuario'


class Vehiculo(models.Model):
    id_vehiculo = models.AutoField(primary_key=True)
    matricula = models.CharField(unique=True, max_length=10)
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    estado = models.CharField(max_length=13)
    vehiculo_creado_el = models.DateTimeField()
    vehiculo_actualizado_el = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'vehiculo'
