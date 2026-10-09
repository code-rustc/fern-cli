---
name: cli-025-petstore-custom-commands
description: How to author custom commands for the cli-025-petstore CLI using the co-generated SDK.
---

# Custom Commands for `cli-025-petstore`

## Overview

The `cli-025-petstore` CLI supports user-authored custom commands that are
compiled into the binary alongside the auto-generated API commands.
Custom commands get a fully-wired SDK client that inherits the CLI's
auth, retries, TLS, base URL, and global headers — zero configuration required.

## Architecture

```
cli/cli-025-petstore/custom.rs    ← Your command handlers (protected by .fernignore)
cli/cli-025-petstore/sdk.rs       ← Generated bridge: client() + block_on()
cli/cli-025-petstore/main.rs      ← Generated entrypoint (calls custom::register)
cli-025-petstore-sdk/             ← Co-generated typed SDK crate
cli-025-petstore-types/           ← Co-generated typed model crate
```

## Adding a Custom Command

### 1. Edit `cli/cli-025-petstore/custom.rs`

This file is protected by `.fernignore` — `fern generate` will never
overwrite it. Register commands in the `register()` function:

```rust
use cli_025_petstore_sdk::api::*;

pub fn register(app: CliApp) -> CliApp {
    let app = app.command(
        clap::Command::new("get-pet")
            .about("Get a pet")
            .arg(clap::Arg::new("petId").required(true))
        ,
        |matches, ctx| {
            let pet_id = matches.get_one::<String>("petId").unwrap();
            let client = super::sdk::client(ctx);
            let result = super::sdk::block_on(
                client.pets.get_pet(pet_id),
            )?;
            println!("{}", serde_json::to_string_pretty(&result).unwrap());
            Ok(())
        },
    );
    app
}
```

Then build and test:
```bash
cargo build
cli-025-petstore get-pet <petId>
```

### 2. Available SDK Clients

The `super::sdk::client(ctx)` call returns a `cli_025_petstore_sdk::api::Client`
with the following sub-clients:

| Field | Type | Description |
|-------|------|-------------|
| `client.pets` | `cli_025_petstore_sdk::api::PetsClient` | pets operations |

### 3. Key Patterns

**Get the SDK client** (execution-sharing, fully authenticated):
```rust
let client = super::sdk::client(ctx);
```

**Run an async SDK call from a sync handler:**
```rust
let result = super::sdk::block_on(
    client.some_resource.some_method(args),
)?;
```

**Use typed models for request/response serialization:**
```rust
use cli_025_petstore_sdk::api::*;
```

### 4. Authentication

Custom commands automatically inherit the CLI's authentication.
The following auth schemes are configured:

- **bearerAuth** (bearer): env `CLI_025_PETSTORE_TOKEN`

No manual auth wiring is needed in custom command handlers.

## Regeneration Safety

| File | Regenerated? | Notes |
|------|-------------|-------|
| `cli/cli-025-petstore/custom.rs` | **No** | Protected by `.fernignore` |
| `cli/cli-025-petstore/sdk.rs` | Yes | Bridges AppContext → SDK client |
| `cli/cli-025-petstore/main.rs` | Yes | Calls `custom::register(app)` |
| `cli-025-petstore-sdk/` | Yes | Co-generated typed SDK crate |
| `cli-025-petstore-types/` | Yes | Co-generated typed models |

After running `fern generate`, your `custom.rs` is preserved. All
generated code (SDK, types, glue, main.rs) is updated to match the
latest API spec. If the SDK surface changes (renamed methods, new
sub-clients), update your `custom.rs` to match.

## Build & Test

```bash
# Build the CLI (includes custom commands)
cargo build

# Run your custom command
cli-025-petstore <your-command> [args]

# Run with verbose output for debugging
RUST_LOG=debug cli-025-petstore <your-command> [args]
```
