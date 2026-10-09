pub use crate::prelude::*;
#[allow(unused_imports)]
use super::*;

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
pub struct NewPet {
    #[serde(default)]
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tag: Option<String>,
}

impl NewPet {
    pub fn builder() -> NewPetBuilder {
        <NewPetBuilder as Default>::default()
    }
}

#[derive(Clone, PartialEq, Default, Debug)]
#[non_exhaustive]
pub struct NewPetBuilder {
    name: Option<String>,
    tag: Option<String>,
}

impl NewPetBuilder {
    pub fn name(mut self, value: impl Into<String>) -> Self {
        self.name = Some(value.into());
        self
    }

    pub fn tag(mut self, value: impl Into<String>) -> Self {
        self.tag = Some(value.into());
        self
    }

    /// Consumes the builder and constructs a [`NewPet`].
    /// This method will fail if any of the following fields are not set:
    /// - [`name`](NewPetBuilder::name)
    pub fn build(self) -> Result<NewPet, BuildError> {
        Ok(NewPet {
            name: self.name.ok_or_else(|| BuildError::missing_field("name"))?,
            tag: self.tag,
        })
    }
}
