# bzmb-snowflakesql

A [bzBond-server](https://github.com/beezwax/bzBond/tree/main/packages/bzBond-server#bzbond-server) microbond to integrate with the Snowflake SQL API.

## Installation

On a FileMaker server with bzBond-server installed run the following command:

`/var/www/bzbond-server/bin/install-microbond.sh bzmb-snowflakesql https://github.com/beezwax/bzmb-snowflakesql`

See the [bzBond-server documentation](https://github.com/beezwax/bzBond/tree/main/packages/bzBond-server#installing-microbonds) for more details on installation.

## Usage

The bzmb-snowflakesql microbond provides two routes

### bzmb-snowflakesql-auth

In a server-side FileMaker script run `bzBondRelay` script with parameters in the following format:

```
{
  "mode": "PERFORM_JAVASCRIPT",

  "route": "bzmb-snowflakesql-auth",

  "customMethod": "POST",

  "customBody": {
    
    // Required. The auth url
    "url": "string"

    // Required. The refresh token
    "refreshToken": "string",

    // Required. The client id of the auth app
    "clientId": "string",

    // Required. The client secret of the auth app
    "clientSecret": "string"
  }
}

```

The token can be accessed via `Get ( ScriptResult )`:
`JSONGetElement ( Get ( ScriptResult ); "response.result" )`

### bzmb-snowflakesql-statement

In a server-side FileMaker script run `bzBondRelay` script with parameters in the following format:

```
{
  "mode": "PERFORM_JAVASCRIPT",

  // To get a token
  "route": "bzmb-snowflakesql-statement",

  "customMethod": "POST",

  "customBody": {
    // Required. The snowflake API url
    "url": "string",

    // Required. The statement to run
    "statement": "string",

    // Required. The snowflake database
    "database": "string",

    // Required. The snowflake user role
    "role": "string",

    // Required. The access token to authorize the request
    "token": "string",

    // Optional. The Proxy to direct the request through
    "proxy": "string",

    // The number of seconds to wait for the query to complete
    "wait": "number"
    // default:
    "wait": 300
  }
}
```

The object containing row metadata (`rowType`) and an array of result rows (`data`) can be accessed via `Get ( ScriptResult )`:
`JSONGetElement ( Get ( ScriptResult ); "response.result" )`

