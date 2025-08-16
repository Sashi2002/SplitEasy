# 💰 TabSplitr

**Split expenses easily with friends** - An expense-splitting app developed using React and TypeScript. 

## 🌟 Features

- **🧮 Smart Calculations**: Automatically calculates who owes what with minimal transactions
- **👥 Group Management**: Add friends and manage group expenses effortlessly
- **📊 Multiple Split Types**: Equal splits or custom amounts per person
- **💡 Dark/Light Theme**: Beautiful UI with automatic theme switching
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🚀 No Account Required**: Start using immediately without any registration
- **⚡ Real-time Updates**: Instant balance calculations and settlements

## 🎯 Perfect For

- 🏖️ **Group Trips & Vacations**
- 🍕 **Dinner Parties & Restaurants**
- 🏠 **Roommate Expenses**
- 🎉 **Events & Celebrations**
- 🛒 **Shared Shopping**

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd TabSplitr

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📱 How to Use

### 1. Create a Trip/Group
- Click "Start Splitting" or navigate to Trips
- Enter trip name and add participants
- Start adding expenses!

### 2. Add Expenses
- Click "Add Expense" button
- Enter expense details (title, amount in ₹)
- Choose who paid and who should split the cost
- Select equal split or enter custom amounts

### 3. Track Balances
- View the "Balances" tab to see who owes what
- See optimized settlement suggestions
- Track all expenses with detailed breakdowns

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React


## 🎨 Design Features

- **Modern Teal/Cyan Color Scheme** - Professional and friendly
- **Dark Mode Default** - Easy on the eyes
- **Smooth Animations** - Polished user experience
- **Responsive Layout** - Mobile-first design
- **Accessible UI** - Built with accessibility in mind

## 🧮 How Split Calculations Work

TabSplitr uses smart algorithms to:
1. **Calculate individual balances** - Who owes money vs. who should receive money
2. **Minimize transactions** - Find the optimal number of payments to settle all debts
3. **Handle custom splits** - Support unequal expense sharing
4. **Real-time updates** - Instantly recalculate when expenses change

## 🚀 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Development Guidelines

- Components are built with TypeScript for type safety
- Use the existing theme variables for consistent styling
- Follow the established folder structure
- Add proper TypeScript types for new features

---

**Built with ❤️ for making group expenses hassle-free**

*No more awkward money conversations - just fair, transparent expense splitting!*
