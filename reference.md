# Reference

## Pets

<details><summary><code>client.pets.<a href="/src/services/pets/pets-service.ts">listPets</a>({ ...params }) -> CodeRustcApi.Pet[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pets.listPets({
  limit: 81,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `CodeRustcApi.ListPetsRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PetsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pets.<a href="/src/services/pets/pets-service.ts">createPet</a>({ ...params }) -> CodeRustcApi.Pet</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pets.createPet({
  body: newPet,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `CodeRustcApi.NewPet`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PetsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.pets.<a href="/src/services/pets/pets-service.ts">getPet</a>({ ...params }) -> CodeRustcApi.Pet</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>
</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pets.getPet({
  petId: 9,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `CodeRustcApi.GetPetRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PetsClient.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
