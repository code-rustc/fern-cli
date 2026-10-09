use crate::api::*;
use crate::{ApiError, ClientConfig, HttpClient, QueryBuilder, RequestOptions};
use reqwest::Method;

pub struct PetsClient {
    pub http_client: HttpClient,
}

impl PetsClient {
    pub fn new(config: ClientConfig) -> Result<Self, ApiError> {
        Ok(Self {
            http_client: HttpClient::new(config.clone())?,
        })
    }

    /// # Examples
    ///
    /// ```no_run
    /// use cli_025_petstore_sdk::prelude::*;
    ///
    /// #[tokio::main]
    /// async fn main() {
    ///     let config = ClientConfig {
    ///         token: Some("<token>".to_string()),
    ///         ..Default::default()
    ///     };
    ///     let client = Cli025PetstoreClient::new(config).expect("Failed to build client");
    ///     client
    ///         .pets
    ///         .list_pets(
    ///             &ListPetsQueryRequest {
    ///                 ..Default::default()
    ///             },
    ///             None,
    ///         )
    ///         .await;
    /// }
    /// ```
    pub async fn list_pets(
        &self,
        request: &ListPetsQueryRequest,
        options: Option<RequestOptions>,
    ) -> Result<Vec<Pet>, ApiError> {
        self.http_client
            .execute_request(
                Method::GET,
                "pets",
                None,
                QueryBuilder::new()
                    .int("limit", request.limit.clone())
                    .build(),
                options,
            )
            .await
    }

    /// # Examples
    ///
    /// ```no_run
    /// use cli_025_petstore_sdk::prelude::*;
    ///
    /// #[tokio::main]
    /// async fn main() {
    ///     let config = ClientConfig {
    ///         token: Some("<token>".to_string()),
    ///         ..Default::default()
    ///     };
    ///     let client = Cli025PetstoreClient::new(config).expect("Failed to build client");
    ///     client
    ///         .pets
    ///         .create_pet(
    ///             &NewPet {
    ///                 name: "Rex".to_string(),
    ///                 tag: Some("dog".to_string()),
    ///                 ..Default::default()
    ///             },
    ///             None,
    ///         )
    ///         .await;
    /// }
    /// ```
    pub async fn create_pet(
        &self,
        request: &NewPet,
        options: Option<RequestOptions>,
    ) -> Result<Pet, ApiError> {
        self.http_client
            .execute_request(
                Method::POST,
                "pets",
                Some(serde_json::to_value(request).map_err(ApiError::Serialization)?),
                None,
                options,
            )
            .await
    }

    /// # Examples
    ///
    /// ```no_run
    /// use cli_025_petstore_sdk::prelude::*;
    ///
    /// #[tokio::main]
    /// async fn main() {
    ///     let config = ClientConfig {
    ///         token: Some("<token>".to_string()),
    ///         ..Default::default()
    ///     };
    ///     let client = Cli025PetstoreClient::new(config).expect("Failed to build client");
    ///     client.pets.get_pet(1, None).await;
    /// }
    /// ```
    pub async fn get_pet(
        &self,
        pet_id: i64,
        options: Option<RequestOptions>,
    ) -> Result<Pet, ApiError> {
        self.http_client
            .execute_request(
                Method::GET,
                &format!("pets/{}", pet_id),
                None,
                None,
                options,
            )
            .await
    }
}
