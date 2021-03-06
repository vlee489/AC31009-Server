# Server Documenation

## HTTP Requests
The HTTP requests available. All body are formatted in JSON.

### `GET` profile [Authorization Required]
Get the user's profile data

Example Reponse
```json
{
  "success": true,
  "profile": {
    "games": 0,
    "wins": 0,
    "loses": 0,
    "heros": []
  }
}
```

### `GET` getInfo
Get info about the server.

Example Response
```json
{
  "success": true,
  "version": "0.0.1"
}
```

### `GET` gameData
Get the game charcter and balance data for the game as currently used by the server.

Example Response
```json
{
  "version": "0.0.1",
  "serverSupport": "0.0.1",
  "clientSupport": "0.0.1",
  "stats": [...],
  "heros": [...],
  "items": [...]
}
```

### `POST` validateToken
Check if a `Authorization` token is valid to use.

Body
```json
{
	"token": "User Token"
}
```

Example Response
```json
{
  "success": true,
  "valid": true
}
```

### `POST` createAccount
Create a new user account.

Body
```json
{
	"email": "email@example.com",
	"password": "password",
	"username": "exampleUsername",
	"firstName": "example",
	"lastName": "user"
}
```

Example Response
```json
{
  "success": true
}
```

### `POST` login
Returns a token for use with the endpoints that require authorisation.

Body
```json
{
	"email": "email@example.com",
	"password": "password"
}
```

Example Response
```json
{
  "success": true,
  "token": "Long Token",
  "details": {
    "email": "email@example.com",
    "username": "exampleUsername"
  }
}
```

### `POST` openLobby [Authorization Required]
Open a new lobby to play in.

Body
```json
{
    "open": false
}
```
**Fields**
- `open`: If the lobby is publically open or not either `true` | `false`

Example Response
```json
{
    "success": true,
    "roomCode": "ROOMCODEHERE"
}
```

## `GET` listLobbies [Authorization Required]
Get a list of open lobbies available to join.

Example Response
```json
{
    "success": true,
    "lobbies": [
        {
            "roomCode": "ROOMCODEHERE",
            "player": [
                {
                    "username": "username of player in lobby"
                }
            ]
        },
        {
            "roomCode": "ROOMCODEHERE",
            "player": [
                {
                    "username": "username of player in lobby"
                }
            ]
        }
    ]
}
```

## Websocket API

The Websocket API to communate with the game server. All Websocket connections require a header `Authorization` with the token from LOGIN to be able to connect to to the server. Else server will immeditly close the WS connection.

### `Message` PING
Check the link is alive

Message Example
```json
{
  "action": "PING"
}
```

Example Reponse
```json
{
    "success":true,
    "message":"PONG"
}
```

### `Message` Join Room
Join a room for battle

Message Example
```json
{
    "action": "join",
    "roomCode": "Roomcode",
    "hero": {
        "id": 0,
        "statEdits": [
            {
                "id": 0,
                "edit": 10
            }
        ]
     }
}
```

Example Responses
```json
{
    "success": true,
    "room": {
        "playerA": {
            "playerUsername": "exampleUser1",
            "playerID": "ID",
            "heroID": 0,
            "HP": 50,
            "shield": 2,
            "speed": 0,
            "speedLength": 0,
        },
        "playerB": null
    }
}
```

```json
{
    "success": false,
    "message": "Room doesn't exist"
}
```

### `Message` Runs Move
Run a move while in a lobby.

Message Example
```json
{
    "action": "move",
    "roomCode": "Roomcode",
    "move": {
        "moveType": 0,
        "id": 0
    }
}
```

Example Responses
```json
{
    "success": true,
}
```

### `Message` Round Info Return

Example Reponse
```json
{
    "reply": "round",
    "round": 1,
    "moves": [
        {
            "player": 0,
            "move": {
                "moveType": 0,
                "id": 0
            }
        }
    ],
    "playerA": {
        "playerUsername": "exampleUser1",
        "playerID": "ID",
        "heroID": 0,
        "HP": 50,
        "shield": 2,
        "speed": 0,
        "speedLength": 0,
    },
    "playerB": {
        "playerUsername": "exampleUser2",
        "playerID": "ID",
        "heroID": 0,
        "HP": 50,
        "shield": 2,
        "speed": 0,
        "speedLength": 0,
    },
    "active": true,
    "winner": null
}
```