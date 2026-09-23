# Filmklubb – mobilapp

Mobilapp byggd med React Native och Expo. Visar samma filmer som webbappen,
hämtade från samma backend.

- Webbapp: https://github.com/JackGriph/filmklubb-frontend
- Backend: https://github.com/JackGriph/filmklubb-backend

## Krav

- Node.js 20 eller senare
- .NET 10 SDK (för backend)
- Appen **Expo Go** på telefonen, inloggad med ett Expo-konto
- Telefonen och datorn på samma wifi

## 1. Starta backend så att telefonen når den

```bash
git clone https://github.com/JackGriph/filmklubb-backend.git
cd filmklubb-backend
dotnet run --launch-profile mobil
```

Profilen `mobil` lyssnar på alla nätverkskort. Med vanliga `dotnet run` svarar
backend bara på `localhost`, och då kommer telefonen inte åt den.

## 2. Peka appen mot din dator

Ta reda på datorns adress i nätverket:

```bash
ipconfig getifaddr en0
```

Skriv in den i `src/api/client.js`:

```js
export const BASE_URL = 'http://<din-adress>:5071'
```

`localhost` fungerar inte här – från telefonen betyder det telefonen själv.

## 3. Starta appen

```bash
git clone https://github.com/JackGriph/filmklubb-mobile.git
cd filmklubb-mobile
npm install
npx expo start
```

Skanna QR-koden med telefonens kamera så öppnas appen i Expo Go.
