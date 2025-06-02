# Innerpal

A React Native mobile application built with Expo.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your mobile device

### Installation

1. Clone the repository
```bash
git clone https://github.com/did88/Innerpal.git
cd Innerpal
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Then edit `.env` file with your actual values:
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `EXPO_PUBLIC_OPENAI_API_KEY`: Your OpenAI API key

4. Start the development server
```bash
npm start
```

5. Scan the QR code with Expo Go app on your mobile device

## 🛠 Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **Supabase**: Backend-as-a-Service
- **React Navigation**: Navigation library
- **React Hook Form**: Form handling
- **React Native Elements**: UI components

## 📁 Project Structure

```
Innerpal/
├── App.js              # Main app component
├── index.js            # App entry point
├── package.json        # Dependencies and scripts
├── app.json           # Expo configuration
├── .env.example       # Environment variables template
└── assets/            # Images and static assets
```

## 🔒 Security

- Never commit `.env` files to the repository
- Use `.env.example` as a template for required environment variables
- Store sensitive data securely using Expo SecureStore

## 📱 Available Scripts

- `npm start`: Start the Expo development server
- `npm run android`: Start on Android device/emulator
- `npm run ios`: Start on iOS device/simulator
- `npm run web`: Start web version

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.
