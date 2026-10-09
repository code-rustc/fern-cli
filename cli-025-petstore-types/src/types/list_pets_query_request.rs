pub use crate::prelude::*;
#[allow(unused_imports)]
use super::*;

/// Query parameters for listPets
#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
pub struct ListPetsQueryRequest {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<i64>,
}

impl ListPetsQueryRequest {
    pub fn builder() -> ListPetsQueryRequestBuilder {
        <ListPetsQueryRequestBuilder as Default>::default()
    }
}

#[derive(Clone, PartialEq, Default, Debug)]
#[non_exhaustive]
pub struct ListPetsQueryRequestBuilder {
    limit: Option<i64>,
}

impl ListPetsQueryRequestBuilder {
    pub fn limit(mut self, value: i64) -> Self {
        self.limit = Some(value);
        self
    }

    /// Consumes the builder and constructs a [`ListPetsQueryRequest`].
    pub fn build(self) -> Result<ListPetsQueryRequest, BuildError> {
        Ok(ListPetsQueryRequest {
            limit: self.limit,
        })
    }
}

