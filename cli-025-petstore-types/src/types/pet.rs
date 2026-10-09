pub use crate::prelude::*;
#[allow(unused_imports)]
use super::*;

#[derive(Debug, Clone, Serialize, Deserialize, Default, PartialEq, Eq, Hash)]
pub struct Pet {
    #[serde(flatten)]
    pub new_pet_fields: NewPet,
    #[serde(default)]
    pub id: i64,
}

impl Pet {
    pub fn builder() -> PetBuilder {
        <PetBuilder as Default>::default()
    }
}

#[derive(Clone, PartialEq, Default, Debug)]
#[non_exhaustive]
pub struct PetBuilder {
    new_pet_fields: Option<NewPet>,
    id: Option<i64>,
}

impl PetBuilder {
    pub fn new_pet_fields(mut self, value: NewPet) -> Self {
        self.new_pet_fields = Some(value);
        self
    }

    pub fn id(mut self, value: i64) -> Self {
        self.id = Some(value);
        self
    }

    /// Consumes the builder and constructs a [`Pet`].
    /// This method will fail if any of the following fields are not set:
    /// - [`new_pet_fields`](PetBuilder::new_pet_fields)
    /// - [`id`](PetBuilder::id)
    pub fn build(self) -> Result<Pet, BuildError> {
        Ok(Pet {
            new_pet_fields: self.new_pet_fields.ok_or_else(|| BuildError::missing_field("new_pet_fields"))?,
            id: self.id.ok_or_else(|| BuildError::missing_field("id"))?,
        })
    }
}
