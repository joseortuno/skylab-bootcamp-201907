## The Keymaker
The Keymaker es una web-app que gestiona invitaciones para visitadores de inmuebles (deployments). Las invitaciones se crean a partir de un deployment determinado hacia un visitador específico. Una vez la invitación se ha creado, se genera automáticamente una llave virtual del deployment con un rango de fecha y hora determinados y se envía por correo electrónico al invitado en cuestión. 

## Motivation
La web-app genera un histórico de llaves creadas por invitación, deployment, fecha de inicio y expiración. El usuario, también podrá generar nuevas llaves virtuales y cambiar su status. Los status de las llaves son: en espera, cancelada, visitado y expirada. Por último, también se guarda un listado de deployments creado por el usuario, el usuario podrá editar la información de cada deployment y cambiar su status de activo a inactivo. La web-app tiene la capacidad de tener más de un usuario.

La llave virtual (token) podrá tener los siguientes estados:
* Token valido
* Token cancelado
* Token previamente canjeado/usado

## Features

* login user
* key and guest management
* Search guest and deployments
* creation of automatic keys
* creation and cancellation of the invitation
* visualización del estado de la reserva (usada/no usada/cancelada…)
* cancelación de una reserva.

## Build status 

[![Build Status](https://img.shields.io/badge/build-working-brightgreen.svg)](https://github.com/joseortuno/skylab-bootcamp-201907/tree/esputy/develop/staff/jose-ortuno/the-keymaker)

### "The Oracle tells Neo that he will need the Keymaker's help in order to reach the Source, the machine mainframe (...)" The Matrix Reloaded
[More info about a fictional character](https://en.wikipedia.org/wiki/Keymaker)

![alt The Keymaker - Matrix](https://canalhollywood.es/wp-content/uploads/2016/10/key-maker_CreadorDeLlaves.jpg)

## Functional description

### Use Cases

![cases](/the-keymaker-doc/images/the-keymaker-uses-cases.jpg)

### Flows

![flows](/the-keymaker-doc/images/the-keymaker-flow-diagram.jpg)

## Technical Description

### Blocks

![block](https://svgshare.com/i/EVH.svg)

### Data Model

![data](https://svgshare.com/i/ETK.svg)

## Screenshots

### Register

![register](https://i.ibb.co/C7hGw4t/register.png)

### Sign in

![login](https://i.ibb.co/PMM2DyD/signin.png)

## Tests

![jasmine](https://i.ibb.co/5RF4Qx5/jasmine.png)

## API Reference

[Spotify General API Documentation](https://developer.spotify.com/documentation/)

[Spotify Web-API](https://developer.spotify.com/documentation/web-api/)


## Credits

* Jose Ortuño [Github](https://github.com/joseortuno/)


## License

lorem


