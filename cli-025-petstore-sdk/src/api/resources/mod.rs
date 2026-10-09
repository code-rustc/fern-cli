//! Service clients and API endpoints
//!
//! This module contains client implementations for:
//!
//! - **Pets**

use crate::{ApiError, ClientConfig};

pub mod pets;
pub struct ApiClient {
    pub config: ClientConfig,
    pub pets: PetsClient,
}

impl ApiClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
            config: config.clone(),
            pets: PetsClient::new(config.clone())?,
        })
    }
}

pub use pets::PetsClient;
