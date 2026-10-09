import { CodeRustcApiClient } from 'uat026-w5e0z';

(async () => {
  const api = new CodeRustcApiClient({
    token: 'YOUR_TOKEN',
  });

  const data = await api.pets.listPets({
    limit: 81,
  });

  console.log(data);
})();
