# Tech Stack

- Next.js 15.1.7
- React 19.0.0
- TypeScript
- Tailwind CSS 4.0.8
- Lucide React (for icons)

## File Structure

frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Authentication routes
│   │   ├── login/            # Login page
│   │   └── logout/           # Logout page
│   │
│   ├── dashboard/            # Main dashboard
│   │   ├── page.tsx          # Dashboard page
│   │   ├── layout.tsx        # Dashboard layout
│   │   └── loading.tsx       # Loading state
│   │
│   ├── projects/             # Project management
│   │   ├── page.tsx          # Projects list
│   │   ├── [id]/             # Project details
│   │   └── new/              # New project form
│   │
│   ├── expenses/             # Expense tracking
│   │   ├── page.tsx          # Expenses list
│   │   ├── [id]/             # Expense details
│   │   └── new/              # New expense form
│   │
│   ├── income/               # Income tracking
│   │   ├── page.tsx          # Income list
│   │   ├── [id]/             # Income details
│   │   └── new/              # New income form
│   │
│   ├── payments/             # Payment management
│   │   ├── page.tsx          # Payments list
│   │   ├── [id]/             # Payment details
│   │   └── new/              # New payment form
│   │
│   ├── requests/             # Expense requests
│   │   ├── page.tsx          # Requests list
│   │   ├── [id]/             # Request details
│   │   └── new/              # New request form
│   │
│   ├── treasury/             # Treasury management
│   │   ├── page.tsx          # Treasury overview
│   │   └── convert/          # Token conversion
│   │
│   ├── reports/              # Reporting
│   │   ├── page.tsx          # Reports dashboard
│   │   └── [type]/           # Specific report types
│   │
│   ├── settings/             # User settings
│   │   └── page.tsx          # Settings page
│   │
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
│
├── components/               # Reusable components
│   ├── ui/                   # UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── modal.tsx
│   │   └── ...
│   │
│   ├── forms/                # Form components
│   │   ├── expense-form.tsx
│   │   ├── income-form.tsx
│   │   └── ...
│   │
│   ├── charts/               # Data visualization
│   │   ├── bar-chart.tsx
│   │   ├── pie-chart.tsx
│   │   └── ...
│   │
│   ├── layout/               # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── footer.tsx
│   │
│   └── shared/               # Shared components
│       ├── loading.tsx
│       ├── error.tsx
│       └── ...
│
├── lib/                      # Utility libraries
│   ├── api/                  # API client
│   │   ├── client.ts         # Base API client
│   │   ├── auth.ts           # Auth API
│   │   ├── projects.ts       # Projects API
│   │   └── ...
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-projects.ts
│   │   └── ...
│   │
│   ├── store/                # Zustand store
│   │   ├── index.ts          # Store exports
│   │   ├── slices/           # Store slices
│   │   └── types.ts          # Store types
│   │
│   ├── utils/                # Utility functions
│   │   ├── date.ts
│   │   ├── currency.ts
│   │   └── ...
│   │
│   ├── context/              # React context
│   │   ├── auth-context.tsx
│   │   └── ...
│   │
│   └── types/                # TypeScript types
│       ├── api.ts
│       ├── models.ts
│       └── ...
│
├── public/                   # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── tests/                    # Test files
│   ├── components/
│   ├── pages/
│   └── utils/
│
├── .env.local                # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts

## Architecture Principles

1. **Component-Based Architecture**: Building UI from reusable components
2. **Server Components**: Leveraging Next.js server components for performance
3. **Type Safety**: Strict TypeScript usage throughout the application
4. **Responsive Design**: Mobile-first approach with Tailwind CSS
5. **Accessibility**: Following WCAG guidelines for accessible UI
6. **Performance**: Code splitting, lazy loading, and optimized assets
7. **Testing**: Component and integration testing
8. **State Management**: Zustand for global state management
9. **API Integration**: Centralized API client for backend communication
10. **Error Handling**: Consistent error boundaries and fallbacks

## UI/UX Principles

1. **Consistent Design Language**: Unified look and feel across the application
2. **Intuitive Navigation**: Clear information architecture
3. **Responsive Feedback**: Loading states and success/error messages
4. **Progressive Disclosure**: Showing information progressively as needed
5. **Accessibility**: Keyboard navigation, screen reader support, and color contrast
6. **Performance**: Fast load times and smooth interactions
7. **Dark/Light Mode**: Support for user preference
8. **Data Visualization**: Clear and informative charts and graphs
9. **Form Design**: Intuitive forms with validation and error handling
10. **Micro-interactions**: Subtle animations for better user experience 