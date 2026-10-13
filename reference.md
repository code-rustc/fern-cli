# Reference
## Pets
<details><summary><code>client.pets.<a href="/src/api/resources/pets/client/Client.ts">listPets</a>({ ...params }) -> CodeRustcApi.Pet[]</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pets.listPets();

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

<details><summary><code>client.pets.<a href="/src/api/resources/pets/client/Client.ts">createPet</a>({ ...params }) -> CodeRustcApi.Pet</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pets.createPet({
    name: "Rex",
    tag: "dog"
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

<details><summary><code>client.pets.<a href="/src/api/resources/pets/client/Client.ts">getPet</a>({ ...params }) -> CodeRustcApi.Pet</code></summary>
<dl>
<dd>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.pets.getPet({
    petId: 1
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

