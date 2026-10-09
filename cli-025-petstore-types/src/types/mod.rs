//! Request and response types for the CLI-025 Petstore
//!
//! This module contains all data structures used for API communication,
//! including request bodies, response types, and shared models.
//!
//! ## Type Categories
//!
//! - **Request/Response Types**: 1 types for API operations
//! - **Model Types**: 2 types for data representation

pub mod new_pet;
pub mod pet;
pub mod list_pets_query_request;

pub use new_pet::NewPet;
pub use pet::Pet;
pub use list_pets_query_request::ListPetsQueryRequest;

